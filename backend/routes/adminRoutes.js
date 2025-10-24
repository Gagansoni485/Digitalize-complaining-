import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Complaint from "../models/Complaint.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("Admin registration request received:", req.body);
    const { 
      name, 
      email, 
      password, 
      department, 
      employeeId, 
      role = "admin",
      specializations = ["general"],
      branches = department, // Default to their department
      semesters = null, // Default to null for now
      maxCaseLoad = 50
    } = req.body;
    
    if (!name || !email || !password || !department || !employeeId) {
      console.log("Missing required fields");
      return res.status(400).json({ 
        message: "All fields are required: name, email, password, department, employeeId" 
      });
    }
    
    // Validate specializations
    const validSpecializations = ["academic", "sports", "harass", "harassment", "exam", "general"];
    const invalidSpecs = specializations.filter(spec => !validSpecializations.includes(spec));
    if (invalidSpecs.length > 0) {
      return res.status(400).json({ 
        message: `Invalid specializations: ${invalidSpecs.join(", ")}. Valid options: ${validSpecializations.join(", ")}` 
      });
    }
    
    // const existingEmail = await Admin.findOne({ email });
    // if (existingEmail) return res.status(400).json({ message: "Admin with this email already exists" });

    // const existingEmployeeId = await Admin.findOne({ employeeId });
    // if (existingEmployeeId) return res.status(400).json({ message: "Admin with this employee ID already exists" });
    
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ 
      name, 
      email, 
      password: hash, 
      department, 
      employeeId,
      role,
      specializations,
      branches,
      semesters,
      maxCaseLoad,
      isActive: true,
      currentCaseLoad: 0
    });
    
    res.status(201).json({ 
      id: admin._id, 
      name: admin.name, 
      email: admin.email, 
      department: admin.department,
      employeeId: admin.employeeId,
      role: admin.role,
      specializations: admin.specializations,
      branches: admin.branches,
      semesters: admin.semesters,
      maxCaseLoad: admin.maxCaseLoad
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("Admin login request received:", req.body);
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, admin.password || "");
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
    res.json({
      token,
      user: { 
        id: admin._id, 
        name: admin.name, 
        email: admin.email,
        role: admin.role,
        department: admin.department,
        specializations: admin.specializations,
        branches: admin.branches,
        semesters: admin.semesters
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all admins (Super Admin only)
router.get("/", async (req, res) => {
  try {
    const { specialization, branch, semester, isActive } = req.query;
    const query = {};

    if (specialization) query.specializations = specialization;
    if (branch) query.branches = branch;
    if (semester) query.semesters = parseInt(semester);
    if (isActive !== undefined) query.isActive = isActive === 'true';

    console.log('Admin query:', query);

    const admins = await Admin.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    console.log(`Found ${admins.length} admins`);

    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get admin by ID
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update admin details
router.put("/:id", async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    // If password is being updated, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    // Validate specializations if being updated
    if (updateData.specializations) {
      const validSpecializations = ["academic", "sports", "harass", "harassment", "exam", "general"];
      const invalidSpecs = updateData.specializations.filter(spec => !validSpecializations.includes(spec));
      if (invalidSpecs.length > 0) {
        return res.status(400).json({ 
          message: `Invalid specializations: ${invalidSpecs.join(", ")}` 
        });
      }
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle admin active status
router.patch("/:id/toggle-status", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    
    admin.isActive = !admin.isActive;
    await admin.save();
    
    res.json({ 
      message: `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: admin.isActive 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get admin workload statistics
router.get("/:id/stats", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    
    // Get complaint statistics for this admin
    const complaintStats = await Complaint.aggregate([
      { $match: { assignedTo: admin._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalAssigned = await Complaint.countDocuments({ assignedTo: admin._id });
    const resolved = await Complaint.countDocuments({ 
      assignedTo: admin._id, 
      status: { $in: ["resolved", "closed"] } 
    });
    
    res.json({
      admin: {
        name: admin.name,
        email: admin.email,
        department: admin.department,
        specializations: admin.specializations,
        currentCaseLoad: admin.currentCaseLoad,
        maxCaseLoad: admin.maxCaseLoad,
        utilizationRate: admin.maxCaseLoad > 0 ? (admin.currentCaseLoad / admin.maxCaseLoad * 100).toFixed(2) : 0
      },
      complaints: {
        total: totalAssigned,
        resolved: resolved,
        resolutionRate: totalAssigned > 0 ? (resolved / totalAssigned * 100).toFixed(2) : 0,
        byStatus: complaintStats
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get available admins for assignment
router.get("/available/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { department, semester } = req.query;
    
    // Validate category
    const validSpecializations = ["academic", "sports", "harass", "harassment", "exam", "general"];
    if (!validSpecializations.includes(category)) {
      return res.status(400).json({ 
        message: `Invalid category: ${category}. Valid options: ${validSpecializations.join(", ")}` 
      });
    }
    
    const query = {
      isActive: true,
      specializations: category
    };

    if (department) query.branches = department;
    if (semester) query.semesters = parseInt(semester);

    // Find admins with available capacity (currentCaseLoad < maxCaseLoad)
    const admins = await Admin.find(query)
      .select('name email department specializations currentCaseLoad maxCaseLoad branches semesters')
      .sort({ currentCaseLoad: 1 });

    // Filter by caseload in memory instead of using $expr
    const availableAdmins = admins.filter(admin => admin.currentCaseLoad < admin.maxCaseLoad);

    res.json(availableAdmins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;







