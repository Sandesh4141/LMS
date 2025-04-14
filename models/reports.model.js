import pool from "../db/db.js";

// ====================== STUDENT REPORTS =======================
export const getStudentCountByDepartment = async () => {
  const result = await pool.query(`
    SELECT 
      d.program_name AS department, 
      COUNT(s.id) AS student_count
    FROM students s
    JOIN department d ON s.department = d.program_name
    GROUP BY d.program_name
  `);
  return result.rows;
};

export const getStudentCountByCourse = async () => {
  const result = await pool.query(`
    SELECT 
      c.course_name, 
      COUNT(s.id) AS student_count
    FROM students s
    JOIN courses c ON s.course_id = c.id
    GROUP BY c.course_name
  `);
  return result.rows;
};

// ====================== TEACHER REPORTS =======================
export const getTeacherCountByDepartment = async () => {
  const result = await pool.query(`
    SELECT 
      d.program_name AS department, 
      COUNT(t.id) AS teacher_count
    FROM teachers t
    JOIN department d ON t.department = d.program_name
    GROUP BY d.program_name
  `);
  return result.rows;
};

export const getTeacherSubjectStats = async () => {
  const result = await pool.query(`
    SELECT 
      t.name AS teacher, 
      COUNT(s.id) AS subject_count
    FROM teachers t
    LEFT JOIN subjects s ON s.teacher_id = t.id
    GROUP BY t.name
  `);
  return result.rows;
};

// ====================== SUBJECT REPORTS =======================
export const getSubjectsByCourse = async () => {
  const result = await pool.query(`
    SELECT 
      c.course_name, 
      COUNT(s.id) AS subject_count
    FROM subjects s
    JOIN courses c ON s.course_id = c.id
    GROUP BY c.course_name
  `);
  return result.rows;
};

export const getSubjectsWithoutTeachers = async () => {
  const result = await pool.query(`
    SELECT subject_name 
    FROM subjects 
    WHERE teacher_id IS NULL
  `);
  return result.rows;
};

// ====================== ANNOUNCEMENT REPORTS =======================
export const getAnnouncementsStats = async () => {
  const result = await pool.query(`
    SELECT 
      audience_type, 
      COUNT(*) AS total 
    FROM announcements 
    GROUP BY audience_type
  `);
  return result.rows;
};

// ====================== COURSE REPORTS =======================
export const getCourseEnrollmentStats = async () => {
  const result = await pool.query(`
    SELECT 
      c.course_name, 
      COUNT(s.id) AS student_count
    FROM students s
    JOIN courses c ON s.course_id = c.id
    GROUP BY c.course_name
  `);
  return result.rows;
};

export const getCourseTeacherStats = async () => {
  const result = await pool.query(`
    SELECT 
      c.course_name, 
      COUNT(DISTINCT s.teacher_id) AS teacher_count
    FROM subjects s
    JOIN courses c ON s.course_id = c.id
    GROUP BY c.course_name
  `);
  return result.rows;
};
