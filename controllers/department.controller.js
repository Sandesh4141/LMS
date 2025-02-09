import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCoursesByDepartment,
  getSubjectsByDepartment,
  getDepartmentDetails,
} from "../models/department.model.js";

/* Fetch all departments */
const fetchDepartments = async (req, res) => {
  try {
    const departments = await getAllDepartments();
    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};

/* Fetch department by ID */
const fetchDepartmentById = async (req, res) => {
  const { id } = req.params; // department id
  try {
    const department = await getDepartmentById(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ error: "Failed to fetch department" });
  }
};

/* Create a new department */
const createNewDepartment = async (req, res) => {
  const { programName, programCode, description } = req.body;
  try {
    const newDepartment = await createDepartment(
      programName,
      programCode,
      description
    );
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ error: "Failed to create department" });
  }
};

/* Update an existing department */
const updateExistingDepartment = async (req, res) => {
  const { id } = req.params;
  const { programName, programCode, description } = req.body;

  // Map frontend fields to backend column names
  const program_name = programName;
  const program_code = programCode;

  if (!program_name || !program_code) {
    return res.status(400).json({
      error: "Program name and program code are required.",
    });
  }

  try {
    const result = await updateDepartment(
      id,
      program_name,
      program_code,
      description
    );
    res.json(result);
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ error: "Failed to update department." });
  }
};

/* Delete a department */
const deleteDepartmentById = async (req, res) => {
  const { id } = req.params; // department id
  try {
    const deletedDepartment = await deleteDepartment(id);
    if (!deletedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json({ message: "Department deleted successfully", deletedDepartment });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ error: "Failed to delete department" });
  }
};

/* Fetch courses by department */
const fetchCourses = async (req, res) => {
  const { id } = req.params; // department id
  try {
    const courses = await getCoursesByDepartment(id);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

/* Fetch subjects by department */
const fetchSubjectsByDepartment = async (req, res) => {
  const { id } = req.params; // department id
  try {
    const subjects = await getSubjectsByDepartment(id);
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

/* Fetch department details (with courses and subjects) */
const fetchDepartmentDetails = async (req, res) => {
  const { id } = req.params; // department id
  try {
    const details = await getDepartmentDetails(id);
    if (details.length === 0) {
      return res
        .status(404)
        .json({ error: "Department not found or no associated data" });
    }
    res.json(details);
  } catch (error) {
    console.error("Error fetching department details:", error);
    res.status(500).json({ error: "Failed to fetch department details" });
  }
};

export {
  fetchDepartments, // Get all departments
  fetchDepartmentById, // Get a single department by ID
  createNewDepartment, // Create a new department
  updateExistingDepartment, // Update an existing department
  deleteDepartmentById, // Delete a department
  fetchCourses, // Fetch courses for a specific department
  fetchSubjectsByDepartment, // Fetch subjects for a specific department
  fetchDepartmentDetails, // Fetch a department with courses and subjects
};
