import pool from "../db/db.js";

/* Fetch all subjects */
const getAllSubjects = async () => {
  const result = await pool.query(`
    SELECT subjects.*, courses.course_name 
    FROM subjects 
    JOIN courses ON subjects.course_id = courses.id
  `);
  return result.rows;
};

/* Fetch subject by ID */
const getSubjectById = async (id) => {
  const result = await pool.query("SELECT * FROM subjects WHERE id = $1", [id]);
  return result.rows[0];
};

/* Fetch subjects by course ID */
const getSubjectsByCourse = async (courseId) => {
  const result = await pool.query(
    "SELECT * FROM subjects WHERE course_id = $1",
    [courseId]
  );
  return result.rows;
};

/* Fetch subjects by course ID and semester */
const getSubjectsByCourseAndSemester = async (courseId, semester) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subjects WHERE course_id = $1 AND semester_number = $2",
      [courseId, semester]
    );
    return result.rows;
  } catch (error) {
    throw new Error(
      "Error fetching subjects for course & semester: " + error.message
    );
  }
};

/* Create a new subject */
const createSubject = async (
  subjectName,
  courseId,
  semesterNumber,
  description,
  credits
) => {
  const result = await pool.query(
    `INSERT INTO subjects (subject_name, course_id, semester_number, description, credits) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [subjectName, courseId, semesterNumber, description, credits]
  );
  return result.rows[0];
};

/* Update a subject */
const updateSubject = async (
  id,
  subjectName,
  courseId,
  semesterNumber,
  description,
  credits
) => {
  const result = await pool.query(
    `UPDATE subjects 
     SET subject_name = $1, course_id = $2, semester_number = $3, description = $4, credits = $5, updated_at = NOW() 
     WHERE id = $6 
     RETURNING *`,
    [subjectName, courseId, semesterNumber, description, credits, id]
  );
  return result.rows[0];
};

/* Delete a subject */
const deleteSubject = async (id) => {
  const result = await pool.query(
    "DELETE FROM subjects WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export {
  getAllSubjects,
  getSubjectById,
  getSubjectsByCourse,
  getSubjectsByCourseAndSemester, // ✅ Added new function for filtering subjects
  createSubject,
  updateSubject,
  deleteSubject,
};
