import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  deleteAnnouncement,
  updateAnnouncement,
  getFilteredAnnouncements,
  countAnnouncements,
} from "../models/announcments.model.js";

// 📨 POST /admin/announcements
export const postAnnouncement = async (req, res) => {
  const {
    title,
    message,
    audience_type,
    department_id,
    course_id,
    subject_id,
  } = req.body;

  const file = req.file;

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required." });
  }

  try {
    const newAnnouncement = await createAnnouncement({
      title,
      message,
      audience_type: audience_type || "all",
      department_id: department_id || null,
      course_id: course_id || null,
      subject_id: subject_id || null,
      file_path: file ? `adminAnnouncements/${file.filename}` : null,
      file_type: file?.mimetype || null,
      file_name: file?.originalname || null,
    });

    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error("❌ Error creating announcement:", error);
    res.status(500).json({ error: "Failed to create announcement" });
  }
};

// 📥 GET /admin/announcements
export const getAnnouncements = async (req, res) => {
  try {
    const data = await getAllAnnouncements();
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching announcements:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

// 📌 GET /admin/announcements/:id
export const getAnnouncement = async (req, res) => {
  try {
    const data = await getAnnouncementById(req.params.id);
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching announcement:", error);
    res.status(500).json({ error: "Failed to fetch announcement" });
  }
};

// 🗑️ DELETE /admin/announcements/:id
export const removeAnnouncement = async (req, res) => {
  try {
    const deleted = await deleteAnnouncement(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Announcement deleted", deleted });
  } catch (error) {
    console.error("❌ Error deleting announcement:", error);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
};

// ✏️ PUT /admin/announcements/:id
export const editAnnouncement = async (req, res) => {
  const file = req.file;
  const id = req.params.id;
  const {
    title,
    message,
    audience_type,
    department_id,
    course_id,
    subject_id,
  } = req.body;

  try {
    const updated = await updateAnnouncement(id, {
      title,
      message,
      audience_type,
      department_id,
      course_id,
      subject_id,
      file_path: file ? `adminAnnouncements/${file.filename}` : null,
      file_type: file?.mimetype || null,
      file_name: file?.originalname || null,
    });

    res.json(updated);
  } catch (error) {
    console.error("❌ Error updating announcement:", error);
    res.status(500).json({ error: "Failed to update announcement" });
  }
};

// 🎯 GET /admin/announcements/filter
export const filterAnnouncements = async (req, res) => {
  const { department_id, course_id, subject_id, audience_type } = req.query;

  try {
    const data = await getFilteredAnnouncements({
      department_id,
      course_id,
      subject_id,
      audience_type,
    });

    res.json(data);
  } catch (error) {
    console.error("❌ Error filtering announcements:", error);
    res.status(500).json({ error: "Failed to filter announcements" });
  }
};

// 📊 GET /admin/announcements/count
export const getAnnouncementCount = async (req, res) => {
  try {
    const count = await countAnnouncements();
    res.json({ total: count });
  } catch (error) {
    console.error("❌ Error counting announcements:", error);
    res.status(500).json({ error: "Failed to get count" });
  }
};
