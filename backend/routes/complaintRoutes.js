import express from "express";
import Complaint from "../models/complaint.js";
import Admin from "../models/admin.js";
import complaintDistribution from "../services/complaintDistribution.js";

const router = express.Router();

// Helper to generate a 6-digit random token
function generateToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to extract student info from form data
function extractStudentInfo(payload) {
  if (payload.anonymous) {
    return null;
  }
  
  // Get studentInfo object if it exists, otherwise extract from root level
  const studentData = payload.studentInfo || payload;
  
  return {
    name: studentData.name || studentData.studentName,
    rollNo: studentData.rollNo || studentData.rollNumber,
    department: studentData.department || studentData.branch || payload.department,
    semester: studentData.semester ? parseInt(studentData.semester) : undefined,
    phone: studentData.phone,
    email: studentData.email
  };
}

// Student submits complaint
router.post("/", async (req, res) => {
  try {
    console.log('=== New Complaint Submission ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const payload = req.body || {};
    
    // Validation
    if (!payload.title && !payload.description) {
      return res.status(400).json({ error: "Title or description is required" });
    }
    
    if (!payload.category) {
      return res.status(400).json({ error: "Category is required" });
    }
    
    // Generate unique token
    let token;
    let exists = true;
    let attempts = 0;
    
    while (exists && attempts < 10) {
      token = generateToken();
      exists = await Complaint.findOne({ token });
      attempts++;
    }
    
    if (attempts >= 10) {
      throw new Error('Failed to generate unique token');
    }
    
    console.log('Generated token:', token);
    
    // Extract student information
    const studentInfo = extractStudentInfo(payload);
    console.log('Student info:', studentInfo);
    
    // Create complaint with enhanced data structure
    const complaintData = {
      title: payload.title || "Complaint",
      description: payload.description || "",
      category: payload.category,
      department: payload.department || studentInfo?.department,
      isAnonymous: Boolean(payload.anonymous),
      studentInfo: payload.anonymous ? null : studentInfo,
      token,
      priority: payload.priority || "normal",
      status: "received"
    };
    
    console.log('Complaint data to save:', JSON.stringify(complaintData, null, 2));
    
    // Create and save complaint
    const complaint = await Complaint.create(complaintData);
    console.log('Complaint saved successfully with ID:', complaint._id);
    console.log('Token assigned:', complaint.token);
    
    // Attempt automatic assignment
    try {
      const assignmentResult = await complaintDistribution.assignComplaint(complaint._id);
      if (assignmentResult.success) {
        console.log(`Complaint ${token} automatically assigned to ${assignmentResult.assignedTo.name}`);
      } else {
        console.log(`Could not auto-assign complaint ${token}: ${assignmentResult.error}`);
      }
    } catch (assignmentError) {
      console.error("Auto-assignment failed:", assignmentError);
      // Continue even if auto-assignment fails
    }
    
    // Return the complaint with token
    const responseData = {
      _id: complaint._id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      token: complaint.token,
      status: complaint.status,
      createdAt: complaint.createdAt,
      message: "Complaint submitted successfully"
    };
    
    console.log('Sending response:', responseData);
    res.status(201).json(responseData);
    
  } catch (err) {
    console.error("Error creating complaint:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});
// Track complaint by token
router.get("/track/:token", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ token: req.params.token });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json({
      status: complaint.status,
      priority: complaint.priority,
      title: complaint.title,
      description: complaint.description,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      messages: complaint.messages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin fetches all complaints
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all complaints...');
    const complaints = await Complaint.find();
    console.log(`Found ${complaints.length} total complaints`);
    res.json(complaints);
  } catch (err) {
    console.error('Error fetching all complaints:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single complaint by id
router.get("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin updates complaint status/priority
router.put("/:id", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add admin message to complaint thread
router.post("/:id/messages", async (req, res) => {
  try {
    const { body, visible, sender, senderName } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Not found" });
    complaint.messages.push({ 
      body, 
      visible: Boolean(visible), 
      sender: sender || "admin",
      senderName: senderName || "Admin"
    });
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manual assignment of complaint to admin (Super Admin only)
router.post("/:id/assign", async (req, res) => {
  try {
    const { adminId, assignedBy } = req.body;
    const result = await complaintDistribution.assignComplaint(
      req.params.id, 
      adminId, 
      assignedBy
    );
    
    if (result.success) {
      res.json({
        message: "Complaint assigned successfully",
        assignedTo: result.assignedTo,
        assignmentType: result.assignmentType
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forward complaint to another admin
router.post("/:id/forward", async (req, res) => {
  try {
    const { fromAdminId, toAdminId, reason } = req.body;
    const result = await complaintDistribution.forwardComplaint(
      req.params.id,
      fromAdminId,
      toAdminId,
      reason
    );

    if (result.success) {
      res.json({
        message: "Complaint forwarded successfully",
        forwardedTo: result.forwardedTo,
        fromAdminId: fromAdminId,
        toAdminId: toAdminId,
        reason: reason
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get complaints assigned to specific admin
router.get("/admin/:adminId", async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { assignedTo: req.params.adminId };
    
    if (status) {
      query.status = status;
    }
    
    const complaints = await Complaint.find(query)
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Complaint.countDocuments(query);
    
    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unassigned complaints (Super Admin)
router.get("/unassigned", async (req, res) => {
  try {
    const { category } = req.query;
    const query = { 
      $or: [
        { assignedTo: { $exists: false } },
        { assignedTo: null }
      ]
    };

    if (category) {
      query.category = category;
    }

    console.log('Unassigned complaints query:', query);

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 });

    console.log(`Found ${complaints.length} unassigned complaints`);

    res.json(complaints);
  } catch (err) {
    console.error('Error fetching unassigned complaints:', err);
    res.status(500).json({ error: err.message });
  }
});

// Auto-assign all unassigned complaints
router.post("/auto-assign", async (req, res) => {
  try {
    const result = await complaintDistribution.autoAssignUnassignedComplaints();
    res.json({
      message: "Batch assignment completed",
      ...result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get assignment statistics
router.get("/stats/assignments", async (req, res) => {
  try {
    console.log('Fetching assignment statistics...');
    const stats = await complaintDistribution.getAssignmentStats();
    console.log('Stats computed:', stats);
    res.json(stats);
  } catch (err) {
    console.error('Error getting assignment stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update complaint status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, resolution, resolvedBy } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    
    complaint.status = status;
    
    if (status === "resolved" || status === "closed") {
      complaint.resolution = resolution;
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = resolvedBy;
      
      // Decrease admin's caseload
      if (complaint.assignedTo) {
        await Admin.findByIdAndUpdate(
          complaint.assignedTo,
          { $inc: { currentCaseLoad: -1 } }
        );
      }
    }
    
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reveal student identity for anonymous complaints (Super Admin only)
router.post("/:id/reveal-identity", async (req, res) => {
  try {
    const { superAdminId } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    
    if (!complaint.isAnonymous) {
      return res.status(400).json({ error: "This complaint is not anonymous" });
    }
    
    // Mark identity as revealed
    complaint.identityRevealed = true;
    complaint.revealedBy = superAdminId;
    complaint.revealedAt = new Date();
    
    await complaint.save();
    
    res.json({
      message: "Student identity revealed",
      studentInfo: complaint.studentInfo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
