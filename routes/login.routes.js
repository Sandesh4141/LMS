import express from "express";
import pool from "../db/db.js";

const router = express.Router();

// Login endpoint
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = null;
    let role = null;

    // Check in the admins table
    const adminResult = await pool.query(
      "SELECT * FROM admins WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (adminResult.rowCount > 0) {
      user = adminResult.rows[0];
      role = "admin";
    }

    // Check in the teachers table
    if (!user) {
      const teacherResult = await pool.query(
        "SELECT * FROM teachers WHERE username = $1 AND password = $2",
        [username, password]
      );
      if (teacherResult.rowCount > 0) {
        user = teacherResult.rows[0];
        role = "teacher";
      }
    }

    // Check in the students table
    if (!user) {
      const studentResult = await pool.query(
        "SELECT * FROM students WHERE username = $1 AND password = $2",
        [username, password]
      );
      if (studentResult.rowCount > 0) {
        user = studentResult.rows[0];
        role = "student";
      }
    }

    // If no user is found
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Respond with user details
    res.json({
      id: user.id,
      name: user.name,
      role: role,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
