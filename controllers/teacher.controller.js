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
  getTeacherAssignedCourse,
  getTeacherSubjects,
  verifyTeacherSubject,
  uploadSubjectMaterial,
  getEnrolledStudentsByCourse,
  getSubjectsForTeacher,
  getSubjectDetailsForTeacher,
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

// =================== 📌 TEACHER COURSE & SUBJECT CONTROLLERS ===================

/**
 * Get Assigned Course
 */
const getTeacherCourse = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    const course = await getTeacherAssignedCourse(teacherId);

    if (!course) {
      return res.status(404).json({ error: "No assigned course found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

/**
 * Get Assigned Subjects
 */
const getTeacherSubjectsList = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    const subjects = await getTeacherSubjects(teacherId);

    res.status(200).json({ subjects });
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

// =================== 📌 COURSE MATERIAL UPLOAD CONTROLLERS ===================

/**
 * Upload Course Content
 */
const uploadContent = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    const { subjectId } = req.params;
    const filePath = req.file?.path;

    if (!teacherId || !filePath) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const isAssigned = await verifyTeacherSubject(teacherId, subjectId);
    if (!isAssigned) {
      return res
        .status(403)
        .json({ error: "Not authorized to upload for this subject" });
    }

    const uploadedFile = await uploadSubjectMaterial(
      teacherId,
      subjectId,
      filePath
    );
    res
      .status(201)
      .json({ message: "File uploaded successfully", file: uploadedFile });
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

/**
 * Get Enrolled Students for a Course
 */ const getEnrolledStudents = async (req, res) => {
  console.log("Get Enrolled Students Hit");

  try {
    const teacherId = req.user?.id;
    const { courseId } = req.params;

    console.log("Teacher ID:", teacherId);
    console.log("Requested Course ID:", courseId);

    if (!teacherId || !courseId) {
      return res.status(400).json({ error: "Missing teacher ID or course ID" });
    }

    // Fetch all courses assigned to the teacher
    const assignedCourses = await getTeacherAssignedCourse(teacherId);

    console.log("Assigned Courses:", assignedCourses);

    // Ensure assignedCourses is an array before using .some()
    if (!Array.isArray(assignedCourses)) {
      return res.status(500).json({
        error: "Internal Server Error: Assigned courses data is invalid",
      });
    }

    // Check if requested course is in the assigned courses
    const isAuthorized = assignedCourses.some(
      (course) => course.course_id === parseInt(courseId)
    );

    if (!isAuthorized) {
      return res.status(403).json({ error: "Unauthorized access to course" });
    }

    // Fetch enrolled students
    const students = await getEnrolledStudentsByCourse(courseId);

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students enrolled in this course" });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    res.status(500).json({ error: "Failed to fetch enrolled students" });
  }
};

const getSubjectsForCourse = async (req, res) => {
  try {
    const teacherId = req.user.id; // Extract teacher ID from JWT
    const { id: courseId } = req.params; // Get courseId from URL params

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const subjects = await getSubjectsForTeacher(teacherId, courseId);

    if (subjects.length === 0) {
      return res
        .status(404)
        .json({ error: "No subjects found for this course" });
    }

    res.json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch assigned subjects" });
  }
};

const getSubjectDetails = async (req, res) => {
  try {
    const teacherId = req.user.id; // Extract teacher ID from JWT
    const { id: subjectId } = req.params; // Get subjectId from URL params

    if (!subjectId) {
      return res.status(400).json({ error: "Subject ID is required" });
    }

    const subject = await getSubjectDetailsForTeacher(teacherId, subjectId);

    if (!subject) {
      return res
        .status(404)
        .json({ error: "Subject not found or not assigned to you" });
    }

    res.json({ subject });
  } catch (error) {
    console.error("Error fetching subject details:", error);
    res.status(500).json({ error: "Failed to fetch subject details" });
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
  getTeacherCourse,
  getTeacherSubjectsList,
  uploadContent,
  getEnrolledStudents,
  getSubjectsForCourse,
  getSubjectDetailsForTeacher,
  getSubjectDetails,
};
