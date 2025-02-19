import express from "express";

const router = express.Router();
//controllers
import {
  getStudents,
  getSpecificStudent,
  deleteStudentWithSpecificID,
  updateStudentWithSpecificID,
  createStudent,
  getStudentCredentials,
} from "../controllers/student.controller.js";

// student dashboard routes
import { getStudentDashboard } from "../controllers/student.controller.js";
router.get("/", getStudents);
router.post("/", createStudent);

router.get("/:id/dashboard", getStudentDashboard);
router.get("/:id", getSpecificStudent);
router.delete("/:id", deleteStudentWithSpecificID);
router.put("/:id", updateStudentWithSpecificID);
router.get("/:id/credentials", getStudentCredentials);

// GET /student/dashboard

export default router;
