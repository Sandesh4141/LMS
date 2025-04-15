import pool from "../db/db.js";

const getAdminById = async (id) => {
  const result = await pool.query(
    `SELECT id, username, name, phone_number, profile_image
     FROM admins
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// 🔹 Update admin profile info
const updateAdminProfile = async (id, name, phone_number, profile_image) => {
  return pool.query(
    `UPDATE admins
     SET name = $1,
         phone_number = $2,
         profile_image = $3
     WHERE id = $4`,
    [name, phone_number, profile_image, id]
  );
};

// 🔹 Get hashed password for verification
const getAdminPassword = async (id) => {
  const result = await pool.query(
    `SELECT password
     FROM admins
     WHERE id = $1`,
    [id]
  );
  return result.rows[0]?.password;
};

// 🔹 Update admin password
const updateAdminPassword = async (id, hashedPassword) => {
  return pool.query(
    `UPDATE admins
     SET password = $1
     WHERE id = $2`,
    [hashedPassword, id]
  );
};

export {
  getAdminById,
  updateAdminProfile,
  getAdminPassword,
  updateAdminPassword,
};
