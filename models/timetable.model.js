import pool from "../db/db.js";

// Create a new timetable entry
const createTimetableEntry = async (
  course_id,
  teacher_id,
  subject_id,
  day_of_week,
  start_time,
  end_time,
  room_number
) => {
  try {
    const result = await pool.query(
      `INSERT INTO Timetables (course_id, teacher_id, subject_id, day_of_week, start_time, end_time, room_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        course_id,
        teacher_id,
        subject_id,
        day_of_week,
        start_time,
        end_time,
        room_number,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating timetable entry: " + error.message);
  }
};

// Get timetable by day of the week
const getTimetableByDay = async (day_of_week) => {
  try {
    const result = await pool.query(
      `SELECT t.*, s.subject_name, tc.name AS teacher_name, c.course_name
       FROM Timetables t
       JOIN subjects s ON t.subject_id = s.id
       JOIN teachers tc ON t.teacher_id = tc.id
       JOIN courses c ON t.course_id = c.id
       WHERE t.day_of_week = $1 
       ORDER BY t.start_time`,
      [day_of_week]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching timetable for day: " + error.message);
  }
};

// Get timetable by course ID
const getTimetableByCourse = async (course_id) => {
  try {
    const result = await pool.query(
      `SELECT t.*, s.subject_name, tc.name AS teacher_name, c.course_name
       FROM Timetables t
       JOIN subjects s ON t.subject_id = s.id
       JOIN teachers tc ON t.teacher_id = tc.id
       JOIN courses c ON t.course_id = c.id
       WHERE t.course_id = $1 
       ORDER BY t.day_of_week, t.start_time`,
      [course_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching timetable for course: " + error.message);
  }
};

// Get timetable by teacher ID
const getTimetableByTeacher = async (teacher_id) => {
  try {
    const result = await pool.query(
      `SELECT t.*, s.subject_name, c.course_name
       FROM Timetables t
       JOIN subjects s ON t.subject_id = s.id
       JOIN courses c ON t.course_id = c.id
       WHERE t.teacher_id = $1 
       ORDER BY t.day_of_week, t.start_time`,
      [teacher_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching timetable for teacher: " + error.message);
  }
};

// Get all courses with their semester count
const getCoursesWithSemesters = async () => {
  try {
    const result = await pool.query(
      "SELECT id, course_name, total_semesters, department_id FROM courses"
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching courses: " + error.message);
  }
};

// Get subjects for a specific course and semester
const getSubjectsByCourseAndSemester = async (course_id, semester) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subjects WHERE course_id = $1 AND semester_number = $2",
      [course_id, semester]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching subjects: " + error.message);
  }
};

// Get teachers assigned to a specific course
const getTeachersByCourse = async (course_id) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT t.id, t.name, t.email 
       FROM teachers t 
       JOIN subjects s ON t.id = s.teacher_id 
       WHERE s.course_id = $1`,
      [course_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching teachers: " + error.message);
  }
};

// Get available time slots for a course and semester
const getAvailableTimeSlots = async (course_id, semester) => {
  try {
    const result = await pool.query(
      `SELECT day_of_week, start_time, end_time, room_number 
       FROM timetables 
       WHERE course_id = $1 AND semester = $2`,
      [course_id, semester]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching available time slots: " + error.message);
  }
};

// Update timetable entry
const updateTimetableEntry = async (
  id,
  course_id,
  teacher_id,
  subject_id,
  day_of_week,
  start_time,
  end_time,
  room_number
) => {
  try {
    const result = await pool.query(
      `UPDATE Timetables 
       SET course_id = $1, teacher_id = $2, subject_id = $3, 
           day_of_week = $4, start_time = $5, end_time = $6, room_number = $7 
       WHERE id = $8 
       RETURNING *`,
      [
        course_id,
        teacher_id,
        subject_id,
        day_of_week,
        start_time,
        end_time,
        room_number,
        id,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating timetable entry: " + error.message);
  }
};

// Delete timetable entry by ID
const deleteTimetableEntry = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM Timetables WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Timetable entry not found");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Error deleting timetable entry: " + error.message);
  }
};

export {
  createTimetableEntry,
  getTimetableByDay,
  getTimetableByCourse,
  getTimetableByTeacher,
  getCoursesWithSemesters,
  getSubjectsByCourseAndSemester,
  getTeachersByCourse,
  getAvailableTimeSlots,
  updateTimetableEntry,
  deleteTimetableEntry,
};
