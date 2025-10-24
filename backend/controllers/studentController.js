
import Student from "../models/Student.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
};

// @desc Register Student
export const registerStudent = async (req, res) => {
  try {
    const { name, email, branch, rollNo, instituteName, password } = req.body;

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      branch,
      rollNo,
      instituteName,
      password: hash,
    });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      branch: student.branch,
      rollNo: student.rollNo,
      instituteName: student.instituteName,
      token: generateToken(student._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login Student (Email + Password)
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });

    const student = await Student.findOne({ email });
    if (!student) {
      console.log("No student found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Student found:", student.email, "Hashed password:", student.password);
    const ok = await bcrypt.compare(password, student.password || "");
    console.log("Password match:", ok);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      branch: student.branch,
      rollNo: student.rollNo,
      instituteName: student.instituteName,
      token: generateToken(student._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};
