import pool from "../db/db.js";

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

export {
  addTeacher,
  getAllTeachers,
  getTeacherByID,
  updateTeacherByID,
  deleteTeacherByID,
};
