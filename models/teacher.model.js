import pool from "../db/db.js";

// ====================== Model for Admins ======================
const addTeacher = async (teacher) => {
  const {
    username,
    password,
    name,
    department,
    email,
    phone_number,
    join_date,
  } = teacher;

  const result = await pool.query(
    `INSERT INTO teachers (username, password, name, department, email, phone_number, join_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [username, password, name, department, email, phone_number, join_date]
  );

  console.log("Add Teacher Hitt");
  return result.rows[0];
};

const getAllTeachers = async () => {
  const result = await pool.query(
    "SELECT id, name, department, email, phone_number, join_date FROM teachers"
  );
  return result.rows;
};

const getTeacherByID = async (id) => {
  const result = await pool.query("SELECT * FROM teachers WHERE id = $1", [id]);
  return result.rows[0];
};

const updateTeacherByID = async (id, updates) => {
  const fields = Object.keys(updates)
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");
  const values = Object.values(updates);

  const query = `UPDATE teachers SET ${fields} WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [id, ...values]);

  return result.rows[0];
};

const deleteTeacherByID = async (id) => {
  const result = await pool.query(
    "DELETE FROM teachers WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

// ====================== Model for teacher ======================

const getTeacherDashboardData = async (teacherId) => {
  const query = `SELECT
  t.id,
  t.name,
  t.email,
  t.department,
  CASE WHEN t.course_id IS NOT NULL THEN 1 ELSE 0 END AS totalCourses,
  JSON_AGG(DISTINCT c.course_name) AS coursesTaught,
  JSON_AGG(DISTINCT sub.subject_name) AS subjects,
  JSON_AGG(
    DISTINCT CONCAT(tt.day_of_week, ' ', tt.start_time, '-', tt.end_time)
  ) AS timetable
FROM teachers t
LEFT JOIN courses c ON t.course_id = c.id
LEFT JOIN subjects sub ON sub.course_id = c.id
LEFT JOIN timetables tt ON tt.course_id = c.id
WHERE t.id = $1
GROUP BY t.id, t.name, t.email, t.department, t.course_id, c.course_name;
`;

  console.log("Get Teacher Dashboard Data Hit");
  const { rows } = await pool.query(query, [teacherId]);
  return rows[0];
};

const getTeacherProfile = async (teacherId) => {
  //  teachers self profile
  const query = `
      SELECT id, name, email, department, phone_number, office_hours, profile_picture
      FROM teachers
      WHERE id = $1;
  `;

  console.log("Get Teacher Profile Hit");
  const { rows } = await pool.query(query, [teacherId]);
  return rows[0];
};

const updateTeacherProfile = async (teacherId, name, phone, officeHours) => {
  const query = `
      UPDATE teachers 
      SET name = $1, phone_number = $2, office_hours = $3 
      WHERE id = $4 
      RETURNING *;
  `;

  console.log("Update Teacher Profile Hit");

  const { rows } = await pool.query(query, [
    name,
    phone,
    officeHours,
    teacherId,
  ]);
  return rows[0];
};

const updateProfilePicture = async (teacherId, filePath) => {
  //  model function for updating profile picture for teacher prfile
  // using this they can update thier own profile picture

  const query = `
      UPDATE teachers 
      SET profile_picture = $1 
      WHERE id = $2 
      RETURNING profile_picture;
  `;

  const { rows } = await pool.query(query, [filePath, teacherId]);
  return rows[0];
};

const changeTeacherPassword = async (teacherId, newPassword) => {
  //  model function for updating password for teacher profile
  // using this they can update teacher can change thier own password

  const query = `
      UPDATE teachers 
      SET password = $1 
      WHERE id = $2
      RETURNING id, name, email;
  `;

  const { rows } = await pool.query(query, [newPassword, teacherId]);
  return rows[0];
};

export {
  addTeacher,
  getAllTeachers,
  getTeacherByID,
  updateTeacherByID,
  deleteTeacherByID,
  getTeacherDashboardData,
  getTeacherProfile,
  updateTeacherProfile,
  updateProfilePicture,
  changeTeacherPassword,
};
