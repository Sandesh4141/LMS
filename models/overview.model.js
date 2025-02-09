import pool from "../db/db.js";

const getOverviewStats = async () => {
  const students = await pool.query("SELECT COUNT(*) FROM students");
  const teachers = await pool.query("SELECT COUNT(*) FROM teachers");
  const admins = await pool.query("SELECT COUNT(*) FROM admins");
  const courses = await pool.query("SELECT COUNT(*) FROM courses");
  const programs = await pool.query("SELECT COUNT(*) FROM department");

  return {
    students: parseInt(students.rows[0].count, 10),
    teachers: parseInt(teachers.rows[0].count, 10),
    admins: parseInt(admins.rows[0].count, 10),
    courses: parseInt(courses.rows[0].count, 10),
    programs: parseInt(programs.rows[0].count, 10),
  };
};

const getRecentActivity = async () => {
  // Example: Fetching the latest activities from an activity log
  const recentActivity = await pool.query(
    "SELECT activity_description FROM activity_log ORDER BY created_at DESC LIMIT 5"
  );
  return recentActivity.rows.map((row) => row.activity_description);
};

export { getOverviewStats, getRecentActivity };
