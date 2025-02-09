import {
  getAllSubjects,
  getSubjectById,
  getSubjectsByCourse,
  getSubjectsByCourseAndSemester, // ✅ Import this function
  createSubject,
  updateSubject,
  deleteSubject,
} from "../models/subject.model.js";

/* Fetch all subjects */
const fetchAllSubjects = async (req, res) => {
  try {
    const subjects = await getAllSubjects();
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

/* Fetch subject by ID */
const fetchSubjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await getSubjectById(id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ error: "Failed to fetch subject" });
  }
};

/* Fetch subjects by course & semester ✅ (New Fix) */
const fetchSubjectsByCourseAndSemester = async (req, res) => {
  const { course_id, semester } = req.query;

  if (!course_id || !semester) {
    return res.status(400).json({ error: "Course ID and Semester are required!" });
  }

  try {
    const subjects = await getSubjectsByCourseAndSemester(course_id, semester);
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects by course & semester:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

/* Fetch subjects by course (without semester) */
const fetchSubjectsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const subjects = await getSubjectsByCourse(courseId);
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects by course:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

/* Create a new subject */
const createNewSubject = async (req, res) => {
  const { subjectName, courseId, semesterNumber, description, credits } = req.body;
  if (!subjectName || !courseId || !semesterNumber || !credits) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newSubject = await createSubject(
      subjectName,
      courseId,
      semesterNumber,
      description,
      credits
    );
    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Failed to create subject" });
  }
};

/* Update a subject */
const updateExistingSubject = async (req, res) => {
  const { id } = req.params;
  const { subjectName, courseId, semesterNumber, description, credits } = req.body;
  try {
    const updatedSubject = await updateSubject(
      id,
      subjectName,
      courseId,
      semesterNumber,
      description,
      credits
    );
    if (!updatedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.json(updatedSubject);
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Failed to update subject" });
  }
};

/* Delete a subject */
const deleteSubjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSubject = await deleteSubject(id);
    if (!deletedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.json({ message: "Subject deleted successfully", deletedSubject });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Failed to delete subject" });
  }
};

export {
  fetchAllSubjects,
  fetchSubjectById,
  fetchSubjectsByCourse,
  fetchSubjectsByCourseAndSemester, // ✅ New optimized function
  createNewSubject,
  updateExistingSubject,
  deleteSubjectById,
};
