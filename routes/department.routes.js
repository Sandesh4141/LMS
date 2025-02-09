import express from "express";
import {
  fetchDepartments, // Fetch all departments
  fetchDepartmentById, // Fetch a single department by ID
  createNewDepartment, // Create a new department
  updateExistingDepartment, // Update an existing department
  deleteDepartmentById, // Delete a department
  fetchCourses, // Fetch courses for a department
  fetchSubjectsByDepartment, // Fetch subjects for a department
  fetchDepartmentDetails, // Fetch a department with its courses and subjects
} from "../controllers/department.controller.js";

const router = express.Router();

/* Routes */
router.get("/", fetchDepartments); // GET /departments - Fetch all departments
router.get("/:id", fetchDepartmentById); // GET /departments/:id - Fetch a department by ID
router.post("/", createNewDepartment); // POST /departments - Create a new department
router.put("/:id", updateExistingDepartment); // PUT /departments/:id - Update an existing department
router.delete("/:id", deleteDepartmentById); // DELETE /departments/:id - Delete a department
router.get("/:id/courses", fetchCourses); // GET /departments/:id/courses - Fetch courses by department
router.get("/:id/subjects", fetchSubjectsByDepartment); // GET /departments/:id/subjects - Fetch subjects by department
router.get("/:id/details", fetchDepartmentDetails); // GET /departments/:id/details - Fetch department details with courses and subjects

export default router;
