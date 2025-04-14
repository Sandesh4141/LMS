import {
  getStudentCountByDepartment,
  getStudentCountByCourse,
  getTeacherCountByDepartment,
  getTeacherSubjectStats,
  getSubjectsByCourse,
  getSubjectsWithoutTeachers,
  getAnnouncementsStats,
  getCourseEnrollmentStats,
  getCourseTeacherStats,
} from "../models/reports.model.js";

export const studentReport = async (req, res) => {
  try {
    const byDept = await getStudentCountByDepartment();
    const byCourse = await getStudentCountByCourse();
    res.json({ byDept, byCourse });
  } catch (err) {
    console.error("Error in studentReport:", err);
    res.status(500).json({ error: "Failed to fetch student report" });
  }
};

export const teacherReport = async (req, res) => {
  try {
    const byDept = await getTeacherCountByDepartment();
    const subjectStats = await getTeacherSubjectStats();
    res.json({ byDept, subjectStats });
  } catch (err) {
    console.error("Error in teacherReport:", err);
    res.status(500).json({ error: "Failed to fetch teacher report" });
  }
};

export const subjectReport = async (req, res) => {
  try {
    const byCourse = await getSubjectsByCourse();
    const unassigned = await getSubjectsWithoutTeachers();
    res.json({ byCourse, unassigned });
  } catch (err) {
    console.error("Error in subjectReport:", err);
    res.status(500).json({ error: "Failed to fetch subject report" });
  }
};

export const announcementReport = async (req, res) => {
  try {
    const stats = await getAnnouncementsStats();
    res.json(stats);
  } catch (err) {
    console.error("Error in announcementReport:", err);
    res.status(500).json({ error: "Failed to fetch announcement report" });
  }
};

export const courseReport = async (req, res) => {
  try {
    const enrollments = await getCourseEnrollmentStats();
    const teacherMapping = await getCourseTeacherStats();
    res.json({ enrollments, teacherMapping });
  } catch (err) {
    console.error("Error in courseReport:", err);
    res.status(500).json({ error: "Failed to fetch course report" });
  }
};
