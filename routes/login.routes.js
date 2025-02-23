import express from "express";
import pool from "../db/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ error: "Username, password, and role are required." });
  }

  let tableName;
  switch (role.toLowerCase()) {
    case "admin":
      tableName = "admins";
      break;
    case "teacher":
      tableName = "teachers";
      break;
    case "student":
      tableName = "students";
      break;
    default:
      return res.status(400).json({ error: "Invalid role selected." });
  }

  try {
    const queryText = `SELECT * FROM ${tableName} WHERE username = $1 AND password = $2`;
    const { rows } = await pool.query(queryText, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = rows[0];

    // Create a payload for the JWT token
    const payload = {
      id: user.id,
      name: user.name,
      role: role.toLowerCase(),
    };

    // Sign the token for all roles
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
