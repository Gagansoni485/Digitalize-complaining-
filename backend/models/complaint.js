import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    body: { type: String, required: true },
    visible: { type: Boolean, default: true },
    sender: { type: String, enum: ["admin", "student", "super_admin"], default: "admin" },
    senderName: { type: String }, // Name of the person who sent the message
  },
  { timestamps: true }
);

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, enum: ["academic", "sports", "harass", "harassment", "exam", "general"], default: "general" },
    status: { 
      type: String, 
      enum: ["received", "assigned", "in_progress", "resolved", "closed", "forwarded"], 
      default: "received" 
    },
    priority: { 
      type: String, 
      enum: ["low", "normal", "high", "urgent"], 
      default: "normal" 
    },
    
    // Student Information (for non-anonymous complaints)
    studentInfo: {
      name: { type: String },
      rollNo: { type: String },
      department: { type: String }, // Student's department/branch
      semester: { type: Number, min: 1, max: 8 },
      phone: { type: String },
      email: { type: String },
    },
    
    // Assignment Information
    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Admin' 
    }, // Reference to assigned admin
    assignedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Admin' 
    }, // Reference to super admin who assigned (if manually assigned)
    assignmentType: { 
      type: String, 
      enum: ["auto", "manual"], 
      default: "auto" 
    },
    assignedAt: { type: Date },
    
    // Complaint Details
    department: { type: String }, // Department the complaint is related to
    isAnonymous: { type: Boolean, default: false },
    identityRevealed: { type: Boolean, default: false }, // Super admin can reveal identity
    revealedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Who revealed the identity
    revealedAt: { type: Date }, // When identity was revealed
    messages: { type: [messageSchema], default: [] },
    token: { type: String, unique: true, index: true },
    
    // Tracking
    forwardHistory: [{
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      to: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      reason: { type: String },
      forwardedAt: { type: Date, default: Date.now }
    }],
    
    // Resolution
    resolution: { type: String },
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

// Indexes for efficient querying
complaintSchema.index({ category: 1, status: 1 });
complaintSchema.index({ assignedTo: 1, status: 1 });
complaintSchema.index({ 'studentInfo.department': 1, 'studentInfo.semester': 1 });
complaintSchema.index({ token: 1 });

export default mongoose.model("Complaint", complaintSchema);
