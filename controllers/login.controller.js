import jwt from "jsonwebtoken";
import { getUserByCredentials } from "../models/login.model.js";

const secretKey = process.env.JWT_SECRET || "supersecretkey"; // Store this in .env

// Login Controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Fetch user from the model
    const user = await getUserByCredentials(username, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      secretKey,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { loginUser };
