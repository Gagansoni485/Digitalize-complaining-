import express from "express";
import { registerStudent, loginStudent } from "../controllers/studentController.js";

const router = express.Router();

// Register new student
router.post("/register", registerStudent);

// Login student (email + rollNo)
router.post("/login", loginStudent);

export default router;
