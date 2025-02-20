import express from "express";
import {
  createTeacher,
  getTeachers,
  getSpecificTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../controllers/teacher.controller.js";

const router = express.Router();

router.post("/", createTeacher); // Add a new teacher
router.get("/", getTeachers); // Get all teachers
router.get("/:id", getSpecificTeacher); // Get a teacher by ID
router.put("/:id", updateTeacher); // Update a teacher by ID
router.delete("/:id", deleteTeacher); // Delete a teacher by ID

export default router;
