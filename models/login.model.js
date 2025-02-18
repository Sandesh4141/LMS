import pool from "../db/db.js";

// Function to fetch user from database by username and password
const getUserByCredentials = async (username, password) => {
  try {
    const query = `
      SELECT id, name, username, role 
      FROM (
        SELECT id, name, username, password, 'admin' AS role FROM admins
        UNION ALL
        SELECT id, name, username, password, 'teacher' AS role FROM teachers
        UNION ALL
        SELECT id, name, username, password, 'student' AS role FROM students
      ) AS users
      WHERE username = $1 AND password = $2
    `;

    const result = await pool.query(query, [username, password]);

    if (result.rowCount === 0) return null;
    return result.rows[0]; // Return user details (id, name, role)
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export { getUserByCredentials };
