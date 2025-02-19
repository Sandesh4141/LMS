import pool from "../db/db.js";
const addStudent = async (student) => {
  const {
    name,
    email,
    phone,
    dob,
    gender,
    department,
    enrollment_year,
    year_of_study,
    address,
  } = student;

  // Generate username from email
  const username = email.split("@")[0];

  // Generate default password: FirstName@123
  const password = `${name.split(" ")[0]}@123`;

  // Insert student into the database
  const result = await pool.query(
    `INSERT INTO students 
      (username, password, name, email, phone, dob, gender, department, enrollment_year, year_of_study, address, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
     RETURNING id, name, email, username, password`,
    [
      username,
      password, // Plain text password (Not encrypted)
      name,
      email,
      phone,
      dob,
      gender,
      department,
      enrollment_year,
      year_of_study,
      address,
    ]
  );

  return result.rows[0]; // Return newly added student
};

const getAllStudents = async () => {
  /*
   *student.model
   * Returns all students
   */
  const result = await pool.query("SELECT * FROM students");
  console.log("student model :-> students fetched:", result.rowCount);
  return result.rows;
};

const getStudentByID = async (id) => {
  /*
   * student.model
   * Return student with specific ID
   */
  const result = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
  console.log("student model :-> student fetched ", result.rowCount);
  if (result.rowCount <= 0) {
    console.log("No Users Found");
  }
  return result.rows[0];
};

const deleteStudentByID = async (id) => {
  /*
   * student.model
   * Deletes student with specific ID
   */
  const result = await pool.query(
    "DELETE FROM students WHERE id = $1 RETURNING *",
    [id]
  );
  console.log("Delete Req hitt: student.model");
  return result.rows[0];
};

const updateStudentByID = async (id, formData) => {
  const {
    name,
    email,
    phone,
    dob,
    gender,
    department,
    course_id,
    enrollment_year,
    year_of_study,
    address,
  } = formData;

  const result = await pool.query(
    `UPDATE students
     SET name = $1, email = $2, phone = $3, dob = $4, gender = $5, department = $6, course_id = $7, enrollment_year = $8, year_of_study = $9, address = $10, updated_at = NOW()
     WHERE id = $11
     RETURNING *`,
    [
      name,
      email,
      phone,
      dob,
      gender,
      department,
      course_id,
      enrollment_year,
      year_of_study,
      address,
      id,
    ]
  );

  return result.rows[0];
};

const assignCoursesToStudent = async (studentId, programId, year, semester) => {
  const result = await pool.query(
    `INSERT INTO student_courses (student_id, course_id, year, semester)
     SELECT $1, course_id, $2, $3 FROM department_courses WHERE program_id = $4`,
    [studentId, year, semester, programId]
  );
  return result.rowCount;
};

// Fetch students with pagination and filtering
const getAllStudentsFiltered = async ({
  department,
  year_of_study,
  limit = 10,
  offset = 0,
}) => {
  let query = `SELECT * FROM students`;
  const conditions = [];
  const values = [];

  // Add department filter if provided
  if (department) {
    conditions.push(`department = $${conditions.length + 1}`);
    values.push(department);
  }

  // Add year of study filter if provided
  if (year_of_study) {
    conditions.push(`year_of_study = $${conditions.length + 1}`);
    values.push(year_of_study);
  }

  // Append filters to the query
  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  // Add pagination to the query
  query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
};

// Fetch total count of students for pagination metadata
const getStudentCount = async ({ department, year_of_study }) => {
  let query = `SELECT COUNT(*) AS total FROM students`;
  const conditions = [];
  const values = [];

  if (department) {
    conditions.push(`department = $${conditions.length + 1}`);
    values.push(department);
  }

  if (year_of_study) {
    conditions.push(`year_of_study = $${conditions.length + 1}`);
    values.push(year_of_study);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const result = await pool.query(query, values);
  return parseInt(result.rows[0].total, 10);
};
const getCredentials = async (id) => {
  const query = `SELECT username, password FROM students WHERE id = $1`;
  const result = await pool.query(query, [id]);

  console.log(`Fetching credentials for student ID: ${id}`);
  if (result.rowCount === 0) {
    throw new Error("No credentials found for the given student ID");
  }

  return result.rows[0]; // Return username and password (plain text)
};

// get student dashboard data
const getStudentDashboardData = async (studentId) => {
  const query = `
    SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.email AS student_email,
        s.year_of_study,
        c.id AS course_id,
        c.course_name,
        c.credits,
        sub.id AS subject_id,
        sub.subject_name,
        t.id AS teacher_id,
        t.name AS teacher_name,
        tt.day_of_week,
        tt.start_time,
        tt.end_time,
        tt.room_number
    FROM students s
    LEFT JOIN student_courses sc ON s.id = sc.student_id
    LEFT JOIN courses c ON sc.course_id = c.id
    LEFT JOIN subjects sub ON c.id = sub.course_id
    LEFT JOIN teachers t ON sub.teacher_id = t.id
    LEFT JOIN timetables tt ON sub.id = tt.subject_id
    WHERE s.id = $1;
  `;

  try {
    const result = await pool.query(query, [studentId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching student dashboard data:", error);
    throw error;
  }
};

export {
  addStudent,
  getAllStudents,
  getStudentByID,
  deleteStudentByID,
  updateStudentByID,
  assignCoursesToStudent,
  getAllStudentsFiltered,
  getStudentCount,
  getCredentials,
  getStudentDashboardData,
};
