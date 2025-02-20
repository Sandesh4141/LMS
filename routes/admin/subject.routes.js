import express from "express";
import {
  fetchAllSubjects,
  fetchSubjectById,
  fetchSubjectsByCourse,
  fetchSubjectsByCourseAndSemester, 
  createNewSubject,
  updateExistingSubject,
  deleteSubjectById,
} from "../../controllers/subject.controller.js";

const router = express.Router();

// Fetch all subjects
router.get("/", fetchAllSubjects);

// Fetch subjects by course 
router.get("/course/:courseId", fetchSubjectsByCourse);

// Fetch subjects by course & semester  (NEW)
router.get(
  "/course/:courseId/semester/:semester",
  fetchSubjectsByCourseAndSemester
);

// Fetch subject by ID
router.get("/:id", fetchSubjectById);

// Create a new subject
router.post("/", createNewSubject);

// Update a subject
router.put("/:id", updateExistingSubject);

// Delete a subject
router.delete("/:id", deleteSubjectById);

export default router;
