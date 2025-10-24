import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
  // New fields for complaint distribution
  specializations: [{ 
    type: String, 
    enum: ["academic", "sports", "harass", "harassment", "exam", "general"] 
  }], // What types of complaints this admin handles
  branches: { type: String }, // Which branch/department they handle (e.g., "CSE", "ECE", "MECH")
  semesters: { type: Number, min: 1, max: 8 }, // Which semester they primarily handle
  isActive: { type: Boolean, default: true }, // Whether admin is currently active for assignments
  maxCaseLoad: { type: Number, default: 50 }, // Maximum number of active complaints they can handle
  currentCaseLoad: { type: Number, default: 0 }, // Current number of active complaints assigned
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient complaint assignment queries
// adminSchema.index({ specializations: 1 });
// adminSchema.index({ branches: 1 });
// adminSchema.index({ semesters: 1 });
// adminSchema.index({ isActive: 1 });

export default mongoose.model("Admin", adminSchema);
