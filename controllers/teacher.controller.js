import pool from "../db/db.js";
import {
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
} from "../models/teacher.model.js";
// ======================== admin - teacher Controllers  ========================
const createTeacher = async (req, res) => {
  console.log("Create Teacher Hit");
  try {
    const teacher = req.body;

    // Validate required fields
    // const requiredFields = ["username", "password", "name", "subject"];
    const requiredFields = ["username", "password", "name", "department"];

    for (const field of requiredFields) {
      if (!teacher[field]) {
        return res.status(400).json({ error: `Field '${field}' is required` });
      }
    }

    const newTeacher = await addTeacher(teacher);
    res
      .status(201)
      .json({ message: "Teacher added successfully", teacher: newTeacher });
  } catch (err) {
    res.status(500).send("Error adding teacher:-> teacher.controller");
    console.error("Error adding teacher: -> teacher.controller ", err);
  }
};

const getTeachers = async (req, res) => {
  console.log("Get Teachers Hit");
  try {
    const teachers = await getAllTeachers();
    res.json(teachers);
  } catch (err) {
    res.status(500).send("Error fetching teachers:-> teacher.controller");
    console.error("Error fetching teachers: -> teacher.controller ", err);
  }
};

/**
 * Controller function to handle retrieving a teacher by their ID.
 *
 */
const getSpecificTeacher = async (req, res) => {
  console.log("Get Specific Teacher Hit");
  try {
    const { id } = req.params;
    const teacher = await getTeacherByID(id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json(teacher);
  } catch (err) {
    res.status(500).send("Error fetching teacher by ID:-> teacher.controller");
    console.error("Error fetching teacher by ID: -> teacher.controller ", err);
  }
};

const updateTeacher = async (req, res) => {
  console.log("Update Teacher Hit");
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const updatedTeacher = await updateTeacherByID(id, updates);

    if (!updatedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });
  } catch (err) {
    res.status(500).send("Error updating teacher:-> teacher.controller");
    console.error("Error updating teacher: -> teacher.controller ", err);
  }
};

const deleteTeacher = async (req, res) => {
  console.log("Delete Teacher Hit");
  try {
    const { id } = req.params;
    const deletedTeacher = await deleteTeacherByID(id);

    if (!deletedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({
      message: "Teacher deleted successfully",
      teacher: deletedTeacher,
    });
  } catch (err) {
    res.status(500).send("Error deleting teacher:-> teacher.controller");
    console.error("Error deleting teacher: -> teacher.controller ", err);
  }
};

// ======================== Teacher - teacher controllers ========================

// these controller functions are for teacher to handle their own profile and dashboard
// these functions are protected and only accessible to teacher

const getTeacherDashboard = async (req, res) => {
  try {
    // Retrieve the teacher's ID from the authenticated token (attached by JWT middleware)
    const teacherId = req.user?.id;

    if (!teacherId) {
      return res.status(400).json({ error: "Missing teacher ID" });
    }

    const dashboardData = await getTeacherDashboardData(teacherId);
    res.json({ teacher: dashboardData });
  } catch (error) {
    console.error("Error fetching teacher dashboard:", error);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

// ======================== Profile & Personal Information Controllers ========================

// 📌 Fetch Teacher Profile
const fetchTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      return res.status(400).json({ error: "Unauthorized request" });
    }

    const profile = await getTeacherProfile(teacherId);
    res.json({ profile });
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
};

// 📌 Update Teacher Profile
const updateProfile = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    const { name, phone, officeHours } = req.body;

    if (!teacherId) {
      return res.status(400).json({ error: "Unauthorized request" });
    }

    const updatedProfile = await updateTeacherProfile(
      teacherId,
      name,
      phone,
      officeHours
    );
    res.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating teacher profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// 📌 Upload Profile Picture
const uploadProfilePicture = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    const filePath = req.file?.path;

    if (!teacherId) {
      return res.status(401).json({ error: "Unauthorized access" }); // 401: Unauthorized
    }

    if (!filePath) {
      return res.status(400).json({ error: "No file uploaded" }); // 400: Bad Request
    }

    const updatedProfile = await updateProfilePicture(teacherId, filePath);

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: updatedProfile.profile_picture,
    });
  } catch (error) {
    console.error("❌ Error updating profile picture:", error);
    res
      .status(500)
      .json({ error: "Server error while updating profile picture" }); // 500: Internal Server Error
  }
};

const changePassword = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!teacherId)
      return res.status(401).json({ error: "Unauthorized access" });

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both current and new passwords are required" });
    }

    // Fetch current password from the database
    const result = await pool.query(
      `SELECT password FROM teachers WHERE id = $1`,
      [teacherId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const storedPassword = result.rows[0].password;

    // Verify the old password
    if (currentPassword !== storedPassword) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Update password
    await changeTeacherPassword(teacherId, newPassword);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error changing password:", error);
    res.status(500).json({ error: "Server error while updating password" });
  }
};

export {
  createTeacher,
  getTeachers,
  getSpecificTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherDashboard,
  fetchTeacherProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
};
