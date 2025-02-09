import pool from "../db/db.js";

/* Fetch all courses */
const getAllCourses = async () => {
  console.log("getAllCourses hit:-> course.model");
  const result = await pool.query(
    `SELECT c.*, d.program_name AS department_name 
     FROM courses c
     LEFT JOIN department d ON c.department_id = d.id`
  );
  return result.rows;
};

/* Fetch course by ID */
const getCourseById = async (id) => {
  console.log("getCourseById hit:-> course.model");
  const result = await pool.query(
    `SELECT c.*, d.program_name AS department_name 
     FROM courses c
     JOIN department d ON c.department_id = d.id
     WHERE c.id = $1`,
    [id]
  );
  return result.rows[0];
};

/* Fetch courses by department ID */
const getCoursesByDepartment = async (departmentId) => {
  console.log("getCoursesByDepartment hit:-> course.model");
  const result = await pool.query(
    "SELECT * FROM courses WHERE department_id = $1",
    [departmentId]
  );
  return result.rows;
};

/* Create a new course */
const createCourse = async (
  courseName,
  courseCode,
  description,
  credits,
  departmentId,
  totalSemesters,
  durationYears,
  modeOfStudy,
  eligibilityCriteria,
  intakeCapacity,
  affiliatedUniversity,
  isActive
) => {
  console.log("createCourse hit:-> course.model");
  const result = await pool.query(
    `INSERT INTO courses (course_name, course_code, description, credits, department_id, 
                          total_semesters, duration_years, mode_of_study, 
                          eligibility_criteria, intake_capacity, affiliated_university, is_active, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) 
     RETURNING *`,
    [
      courseName,
      courseCode,
      description,
      credits,
      departmentId,
      totalSemesters,
      durationYears,
      modeOfStudy,
      eligibilityCriteria,
      intakeCapacity,
      affiliatedUniversity,
      isActive,
    ]
  );
  return result.rows[0];
};

/* Update a course */
const updateCourse = async (
  id,
  courseName,
  courseCode,
  description,
  credits,
  departmentId,
  totalSemesters,
  durationYears,
  modeOfStudy,
  eligibilityCriteria,
  intakeCapacity,
  affiliatedUniversity,
  isActive
) => {
  console.log("updateCourse hit:-> course.model");
  const result = await pool.query(
    `UPDATE courses 
     SET course_name = $1, course_code = $2, description = $3, credits = $4, department_id = $5, 
         total_semesters = $6, duration_years = $7, mode_of_study = $8, 
         eligibility_criteria = $9, intake_capacity = $10, affiliated_university = $11, is_active = $12, 
         updated_at = NOW() 
     WHERE id = $13 
     RETURNING *`,
    [
      courseName,
      courseCode,
      description,
      credits,
      departmentId,
      totalSemesters,
      durationYears,
      modeOfStudy,
      eligibilityCriteria,
      intakeCapacity,
      affiliatedUniversity,
      isActive,
      id,
    ]
  );
  return result.rows[0];
};

/* Delete a course */
const deleteCourse = async (id) => {
  console.log("deleteCourse hit:-> course.model");
  const result = await pool.query(
    "DELETE FROM courses WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

/* Fetch all subjects under a course */
const fetchAllSubjectsUnderCourse = async (courseId) => {
  console.log("fetchAllSubjectsUnderCourse hit:-> course.model");
  const result = await pool.query(
    "SELECT * FROM subjects WHERE course_id = $1",
    [courseId]
  );
  return result.rows;
};

/* Fetch all students enrolled in a course */
const getStudentsByCourse = async (courseId) => {
  console.log("getStudentsByCourse hit:-> course.model");
  const result = await pool.query(
    `SELECT s.* FROM students s 
     JOIN enrollments e ON s.id = e.student_id 
     WHERE e.course_id = $1`,
    [courseId]
  );
  return result.rows;
};

/* Fetch instructors assigned to a course */
const getInstructorsByCourse = async (courseId) => {
  console.log("getInstructorsByCourse hit:-> course.model");
  const result = await pool.query(
    `SELECT t.* FROM teachers t 
     JOIN timetables tt ON t.id = tt.teacher_id 
     WHERE tt.course_id = $1`,
    [courseId]
  );
  return result.rows;
};

/* Fetch course timetable */
const getCourseTimetable = async (courseId) => {
  console.log("getCourseTimetable hit:-> course.model");
  const result = await pool.query(
    "SELECT * FROM timetables WHERE course_id = $1",
    [courseId]
  );
  return result.rows;
};

export {
  getAllCourses,
  getCourseById,
  getCoursesByDepartment,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchAllSubjectsUnderCourse,
  getStudentsByCourse,
  getInstructorsByCourse,
  getCourseTimetable,
};
