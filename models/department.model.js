import pool from "../db/db.js";

/* Fetch all departments */
const getAllDepartments = async () => {
  console.log("getAllDepartments hit:-> department.model");
  const result = await pool.query("SELECT * FROM department");
  return result.rows;
};

/* Fetch department by ID */
const getDepartmentById = async (id) => {
  console.log("getDepartmentById hit:-> department.model");
  const result = await pool.query("SELECT * FROM department WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

/* Create a new department */
const createDepartment = async (programName, programCode, description) => {
  console.log("createDepartment hit:-> department.model");
  const result = await pool.query(
    `INSERT INTO department (program_name, program_code, description) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [programName, programCode, description]
  );
  return result.rows[0];
};

/* Update a department */
const updateDepartment = async (id, programName, programCode, description) => {
  console.log("updateDepartment hit:-> department.model");
  const result = await pool.query(
    `UPDATE department 
     SET program_name = $1, program_code = $2, description = $3, updated_at = NOW()
     WHERE id = $4 
     RETURNING *`,
    [programName, programCode, description, id]
  );
  return result.rows[0];
};

/* Delete a department */
const deleteDepartment = async (id) => {
  console.log("deleteDepartment hit:-> department.model");
  const result = await pool.query(
    "DELETE FROM department WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

/* Fetch courses by department (program_id) */
const getCoursesByDepartment = async (programId) => {
  console.log("getCoursesByDepartment hit:-> department.model");
  const result = await pool.query(
    `SELECT c.* 
     FROM courses c 
     JOIN department_courses dc ON c.id = dc.course_id 
     WHERE dc.program_id = $1`,
    [programId]
  );
  return result.rows;
};

/* Fetch subjects by department */
const getSubjectsByDepartment = async (departmentId) => {
  console.log("getSubjectsByDepartment hit:-> department.model");
  const result = await pool.query(
    `SELECT s.* 
     FROM subjects s
     JOIN courses c ON s.course_id = c.id
     WHERE c.department_id = $1`,
    [departmentId]
  );
  return result.rows;
};

/* Fetch department with its courses and subjects */
const getDepartmentDetails = async (id) => {
  console.log("getDepartmentDetails hit:-> department.model");
  const result = await pool.query(
    `SELECT d.id AS department_id, d.program_name, d.program_code, c.id AS course_id, c.course_name, s.id AS subject_id, s.subject_name 
     FROM department d
     LEFT JOIN courses c ON d.id = c.department_id
     LEFT JOIN subjects s ON c.id = s.course_id
     WHERE d.id = $1`,
    [id]
  );
  return result.rows;
};

export {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCoursesByDepartment,
  getSubjectsByDepartment,
  getDepartmentDetails,
};
