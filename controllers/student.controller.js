import {
  getAllStudentsFiltered,
  getStudentByID,
  deleteStudentByID,
  updateStudentByID,
  addStudent,
  getCredentials,
  getStudentCourseName,
  getAllStudents
} from "../models/student.model.js";

// student model imports

import { getStudentDashboardData } from "../models/student.model.js";

// Create a new student (Backend generates username & password)
const createStudent = async (req, res) => {
  try {
    const student = req.body;

    const requiredFields = [
      "name",
      "email",
      "phone",
      "dob",
      "gender",
      "department",
      "enrollment_year",
      "year_of_study",
      "address",
    ];
    for (const field of requiredFields) {
      if (!student[field]) {
        return res.status(400).json({ error: `Field '${field}' is required` });
      }
    }

    // Call model to create student (Username & Password generated automatically)
    const newStudent = await addStudent(student);

    res.status(201).json({
      message: "Student added successfully",
      student: newStudent,
    });
  } catch (err) {
    console.error("Error adding student: ", err);
    res.status(500).json({ error: "Failed to add student" });
  }
};

// Fetch all students with pagination and filtering
const getStudents = async (req, res) => {
  try {
    const students = await getAllStudents(); // 🧠 get course_name joined here
    res.json({ students });
  } catch (err) {
    console.error("Error fetching students: ", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Fetch a specific student by ID
const getSpecificStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await getStudentByID(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("Error fetching student with ID: ", err);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// Delete a specific student and related data
const deleteStudentWithSpecificID = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the student exists
    const student = await getStudentByID(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete related data (e.g., course assignments)
    // await deleteStudentCourses(id);

    // Delete the student
    const deletedStudent = await deleteStudentByID(id);

    res.json({
      message: "Student and related data deleted successfully",
      student: deletedStudent,
    });
  } catch (err) {
    console.error("Error deleting student: ", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// // Helper function to delete related course assignments
// const deleteStudentCourses = async (studentId) => {
//   try {
//     await pool.query("DELETE FROM student_courses WHERE student_id = $1", [
//       studentId,
//     ]);
//     console.log(`Deleted related courses for student ID: ${studentId}`);
//   } catch (err) {
//     console.error("Error deleting related courses: ", err);
//     throw new Error("Failed to delete related courses");
//   }
// };

// Update a specific student
const updateStudentWithSpecificID = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const updatedStudent = await updateStudentByID(id, updates);

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (err) {
    console.error("Error updating student: ", err);
    res.status(500).json({ error: "Failed to update student" });
  }
};
// Fetch username and password for a specific student
const getStudentCredentials = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the model to fetch credentials
    const credentials = await getCredentials(id);

    if (!credentials) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      message: "Credentials fetched successfully",
      credentials,
    });
  } catch (err) {
    console.error("Error fetching student credentials: ", err);
    res.status(500).json({ error: "Failed to fetch student credentials" });
  }
};

// ======================== Student Dashboard ========================

const getStudentDashboard = async (req, res) => {
  console.log("Fetching student dashboard data...");
  try {
    const studentId = req.user?.id; // Ensure the student is authenticated

    if (!studentId) {
      return res.status(400).json({ error: "Missing student ID" });
    }

    const dashboardData = await getStudentDashboardData(studentId);

    if (!dashboardData) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ student: dashboardData });
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

export {
  createStudent,
  getStudents,
  getSpecificStudent,
  deleteStudentWithSpecificID,
  updateStudentWithSpecificID,
  getStudentCredentials,
  getStudentDashboard,
};
