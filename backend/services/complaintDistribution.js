import Admin from "../models/Admin.js";
import Complaint from "../models/Complaint.js";

/**
 * Automatic Complaint Distribution Service
 * Assigns complaints to appropriate admins based on category, department, and semester
 */

class ComplaintDistributionService {
  
  /**
   * Find the best admin to assign a complaint to
   * @param {Object} complaintData - The complaint data
   * @returns {Object|null} - The assigned admin or null if none found
   */
  async findBestAdmin(complaintData) {
    const { category, studentInfo } = complaintData;
    
    // Build query criteria
    const query = {
      isActive: true,
      specializations: category || "general",
      $expr: { $lt: ["$currentCaseLoad", "$maxCaseLoad"] } // Not at max capacity
    };
    
    // Add department/branch filter if student info is available
    if (studentInfo && studentInfo.department) {
      query.branches = studentInfo.department;
    }
    
    // Add semester filter if available
    if (studentInfo && studentInfo.semester) {
      query.semesters = studentInfo.semester;
    }
    
    try {
      // Find admins matching criteria, sorted by current caseload (least loaded first)
      const availableAdmins = await Admin.find(query)
        .sort({ currentCaseLoad: 1, createdAt: 1 })
        .limit(5);
      
      if (availableAdmins.length === 0) {
        // Fallback: Find any admin with the specialization, regardless of department/semester
        const fallbackAdmins = await Admin.find({
          isActive: true,
          specializations: category || "general",
          $expr: { $lt: ["$currentCaseLoad", "$maxCaseLoad"] }
        }).sort({ currentCaseLoad: 1 }).limit(3);
        
        if (fallbackAdmins.length === 0) {
          // Last resort: Find any active admin
          const anyAdmin = await Admin.findOne({
            isActive: true,
            $expr: { $lt: ["$currentCaseLoad", "$maxCaseLoad"] }
          }).sort({ currentCaseLoad: 1 });
          
          return anyAdmin;
        }
        
        return fallbackAdmins[0];
      }
      
      // Return the admin with the lowest caseload
      return availableAdmins[0];
      
    } catch (error) {
      console.error("Error finding admin for assignment:", error);
      return null;
    }
  }
  
  /**
   * Assign a complaint to an admin
   * @param {String} complaintId - The complaint ID
   * @param {String} adminId - The admin ID (optional, for manual assignment)
   * @param {String} assignedBy - The ID of who assigned it (for manual assignments)
   * @returns {Object} - Assignment result
   */
  async assignComplaint(complaintId, adminId = null, assignedBy = null) {
    try {
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
        return { success: false, error: "Complaint not found" };
      }
      
      let assignedAdmin;
      let assignmentType = "auto";
      
      if (adminId) {
        // Manual assignment
        assignedAdmin = await Admin.findById(adminId);
        assignmentType = "manual";
        if (!assignedAdmin) {
          return { success: false, error: "Admin not found" };
        }
      } else {
        // Automatic assignment
        assignedAdmin = await this.findBestAdmin(complaint);
        if (!assignedAdmin) {
          return { success: false, error: "No available admin found for assignment" };
        }
      }
      
      // Update complaint
      complaint.assignedTo = assignedAdmin._id;
      complaint.assignedBy = assignedBy;
      complaint.assignmentType = assignmentType;
      complaint.assignedAt = new Date();
      complaint.status = "assigned";
      
      // Update admin's caseload
      assignedAdmin.currentCaseLoad += 1;
      
      // Save both documents
      await Promise.all([
        complaint.save(),
        assignedAdmin.save()
      ]);
      
      return {
        success: true,
        assignedTo: {
          id: assignedAdmin._id,
          name: assignedAdmin.name,
          email: assignedAdmin.email,
          department: assignedAdmin.department
        },
        assignmentType
      };
      
    } catch (error) {
      console.error("Error assigning complaint:", error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Forward a complaint from one admin to another
   * @param {String} complaintId - The complaint ID
   * @param {String} fromAdminId - Current admin ID
   * @param {String} toAdminId - Target admin ID
   * @param {String} reason - Reason for forwarding
   * @returns {Object} - Forward result
   */
  async forwardComplaint(complaintId, fromAdminId, toAdminId, reason) {
    try {
      const complaint = await Complaint.findById(complaintId);
      const fromAdmin = await Admin.findById(fromAdminId);
      const toAdmin = await Admin.findById(toAdminId);
      
      if (!complaint || !fromAdmin || !toAdmin) {
        return { success: false, error: "Invalid complaint or admin IDs" };
      }
      
      // Check if toAdmin has capacity
      if (toAdmin.currentCaseLoad >= toAdmin.maxCaseLoad) {
        return { success: false, error: "Target admin is at maximum capacity" };
      }
      
      // Update complaint
      complaint.assignedTo = toAdmin._id;
      complaint.status = "forwarded";
      complaint.forwardHistory.push({
        from: fromAdmin._id,
        to: toAdmin._id,
        reason: reason,
        forwardedAt: new Date()
      });
      
      // Update admin caseloads
      fromAdmin.currentCaseLoad = Math.max(0, fromAdmin.currentCaseLoad - 1);
      toAdmin.currentCaseLoad += 1;
      
      // Add system message to complaint
      complaint.messages.push({
        body: `Complaint forwarded from ${fromAdmin.name} to ${toAdmin.name}. Reason: ${reason}`,
        sender: "admin",
        senderName: "System",
        visible: true
      });
      
      // Save all documents
      await Promise.all([
        complaint.save(),
        fromAdmin.save(),
        toAdmin.save()
      ]);
      
      return {
        success: true,
        forwardedTo: {
          id: toAdmin._id,
          name: toAdmin.name,
          email: toAdmin.email,
          department: toAdmin.department
        }
      };
      
    } catch (error) {
      console.error("Error forwarding complaint:", error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Get assignment statistics
   * @returns {Object} - Statistics about complaint assignments
   */
  async getAssignmentStats() {
    try {
      // Get basic complaint stats
      const [
        complaintStats,
        categories,
        admins
      ] = await Promise.all([
        // Get basic complaint stats
        Complaint.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              assigned: { $sum: { $cond: [{ $ifNull: ["$assignedTo", false] }, 1, 0] } },
              resolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } },
              inProgress: { $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] } }
            }
          },
          { $project: { _id: 0 } }
        ]),
        
        // Get category stats
        Complaint.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              assigned: { $sum: { $cond: [{ $ifNull: ["$assignedTo", false] }, 1, 0] } }
            }
          },
          { $sort: { count: -1 } }
        ]),
        
        // Get admin stats
        Admin.aggregate([
          {
            $match: { isActive: true }
          },
          {
            $lookup: {
              from: 'complaints',
              localField: '_id',
              foreignField: 'assignedTo',
              as: 'assignedComplaints'
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              currentCaseLoad: 1,
              maxCaseLoad: 1,
              isActive: 1,
              activeComplaints: {
                $size: {
                  $filter: {
                    input: '$assignedComplaints',
                    as: 'comp',
                    cond: { $ne: ['$$comp.status', 'resolved'] }
                  }
                }
              }
            }
          },
          { $sort: { currentCaseLoad: 1 } }
        ])
      ]);

      // Extract values from complaint stats
      const { total = 0, assigned = 0, resolved = 0, inProgress = 0 } = complaintStats[0] || {};

      // Calculate admin statistics
      const activeAdmins = admins.filter(a => a.isActive);
      const totalCaseLoad = activeAdmins.reduce((sum, admin) => sum + (admin.currentCaseLoad || 0), 0);
      const avgCaseLoad = activeAdmins.length > 0 ? (totalCaseLoad / activeAdmins.length).toFixed(2) : 0;

      // Format the response
      return {
        complaints: {
          total,
          assigned,
          unassigned: total - assigned,
          resolved,
          inProgress,
          assignmentRate: total > 0 ? `${Math.round((assigned / total) * 100)}%` : '0%'
        },
        categories,
        admins: {
          total: admins.length,
          active: activeAdmins.length,
          totalCaseLoad,
          avgCaseLoad: parseFloat(avgCaseLoad),
          caseLoads: admins.map(admin => ({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            currentCaseLoad: admin.currentCaseLoad || 0,
            maxCaseLoad: admin.maxCaseLoad || 0,
            activeComplaints: admin.activeComplaints || 0
          }))
        }
      };
      
    } catch (error) {
      console.error("Error getting assignment stats:", error);
      // Return a valid response structure even on error
      return {
        complaints: { total: 0, assigned: 0, unassigned: 0, resolved: 0, inProgress: 0, assignmentRate: '0%' },
        categories: [],
        admins: { total: 0, active: 0, totalCaseLoad: 0, avgCaseLoad: 0, caseLoads: [] }
      };
    }
  }
  
  /**
   * Auto-assign all unassigned complaints
   * @returns {Object} - Batch assignment result
   */
  async autoAssignUnassignedComplaints() {
    try {
      const unassignedComplaints = await Complaint.find({ assignedTo: { $exists: false } });
      const results = {
        total: unassignedComplaints.length,
        assigned: 0,
        failed: 0,
        errors: []
      };
      
      for (const complaint of unassignedComplaints) {
        const result = await this.assignComplaint(complaint._id);
        if (result.success) {
          results.assigned++;
        } else {
          results.failed++;
          results.errors.push({
            complaintId: complaint._id,
            token: complaint.token,
            error: result.error
          });
        }
      }
      
      return results;
      
    } catch (error) {
      console.error("Error in batch assignment:", error);
      return { error: error.message };
    }
  }
}

export default new ComplaintDistributionService();
