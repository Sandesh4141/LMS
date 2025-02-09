import {
  addTeacher,
  getAllTeachers,
  getTeacherByID,
  updateTeacherByID,
  deleteTeacherByID,
} from "../models/teacher.model.js";

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

export {
  createTeacher,
  getTeachers,
  getSpecificTeacher,
  updateTeacher,
  deleteTeacher,
};
