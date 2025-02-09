import express from "express";
import {
  fetchAllCourses,
  fetchCourseById,
  fetchCoursesByDepartment,
  createNewCourse,
  updateExistingCourse,
  deleteCourseById,
  fetchSubjectsUnderCourse,
  fetchStudentsByCourse,
  fetchInstructorsByCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

// Fetch all courses
router.get("/", fetchAllCourses);

// Fetch course by ID
router.get("/:id", fetchCourseById);

// Fetch courses by department
router.get("/department/:departmentId", fetchCoursesByDepartment);

// Fetch subjects under a course
router.get("/:courseId/subjects", fetchSubjectsUnderCourse);

// Fetch students enrolled in a course
router.get("/:courseId/students", fetchStudentsByCourse);

// Fetch instructors assigned to a course
router.get("/:courseId/instructors", fetchInstructorsByCourse);

// Create a new course
router.post("/", createNewCourse);

// Update an existing course
router.put("/:id", updateExistingCourse);

// Delete a course
router.delete("/:id", deleteCourseById);

export default router;
