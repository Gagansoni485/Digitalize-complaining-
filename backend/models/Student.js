import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instituteName: { type: String, required: true },
    semester: { type: Number, min: 1, max: 8 }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
