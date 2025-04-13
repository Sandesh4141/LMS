// 📁 announcement.model.js
import pool from "../db/db.js";

/* 📌 Create new announcement */
export const createAnnouncement = async ({
  title,
  message,
  audience_type = "all",
  department_id = null,
  course_id = null,
  subject_id = null,
  file_path = null,
  file_type = null,
  file_name = null,
}) => {
  const result = await pool.query(
    `
    INSERT INTO announcements
      (title, message, audience_type, department_id, course_id, subject_id, file_path, file_type, file_name, created_at)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    RETURNING *
    `,
    [
      title,
      message,
      audience_type,
      department_id,
      course_id,
      subject_id,
      file_path,
      file_type,
      file_name,
    ]
  );

  return result.rows[0];
};

/* 📥 Get all announcements (latest first) */
export const getAllAnnouncements = async () => {
  const result = await pool.query(`
    SELECT * FROM announcements
    ORDER BY created_at DESC
  `);
  return result.rows;
};

/* 📄 Get one by ID */
export const getAnnouncementById = async (id) => {
  const result = await pool.query(`SELECT * FROM announcements WHERE id = $1`, [
    id,
  ]);
  return result.rows[0];
};

/* 🧹 Delete announcement */
export const deleteAnnouncement = async (id) => {
  const result = await pool.query(
    `DELETE FROM announcements WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

/* ✏️ Update announcement */
export const updateAnnouncement = async (
  id,
  {
    title,
    message,
    audience_type,
    department_id,
    course_id,
    subject_id,
    file_path,
    file_type,
    file_name,
  }
) => {
  const result = await pool.query(
    `
    UPDATE announcements SET
      title = $1,
      message = $2,
      audience_type = $3,
      department_id = $4,
      course_id = $5,
      subject_id = $6,
      file_path = $7,
      file_type = $8,
      file_name = $9,
      updated_at = NOW()
    WHERE id = $10
    RETURNING *
    `,
    [
      title,
      message,
      audience_type,
      department_id,
      course_id,
      subject_id,
      file_path,
      file_type,
      file_name,
      id,
    ]
  );
  return result.rows[0];
};

/* 🔍 Get announcements by filter (use in dashboard or user-specific view) */
export const getFilteredAnnouncements = async ({
  department_id = null,
  course_id = null,
  subject_id = null,
  audience_type = null,
}) => {
  let query = `SELECT * FROM announcements WHERE 1=1`;
  const values = [];
  let i = 1;

  if (audience_type) {
    query += ` AND audience_type = $${i++}`;
    values.push(audience_type);
  }
  if (department_id) {
    query += ` AND department_id = $${i++}`;
    values.push(department_id);
  }
  if (course_id) {
    query += ` AND course_id = $${i++}`;
    values.push(course_id);
  }
  if (subject_id) {
    query += ` AND subject_id = $${i++}`;
    values.push(subject_id);
  }

  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

/* 📊 Get total count */
export const countAnnouncements = async () => {
  const result = await pool.query(`SELECT COUNT(*) FROM announcements`);
  return parseInt(result.rows[0].count);
};
