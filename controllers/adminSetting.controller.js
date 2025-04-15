import {
  getAdminById,
  updateAdminProfile,
  getAdminPassword,
  updateAdminPassword,
} from "../models/admin.model.js";

// GET /admin/settings/profile
export const getProfile = async (req, res) => {
  try {
    const admin = await getAdminById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ message: "Failed to fetch admin profile" });
  }
};

// PUT /admin/settings/profile
export const updateProfile = async (req, res) => {
  const { full_name, phone_number, profile_image } = req.body;

  if (!full_name) {
    return res.status(400).json({ message: "Full name is required" });
  }

  try {
    await updateAdminProfile(
      req.user.id,
      full_name,
      phone_number || null,
      profile_image || null
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// POST /admin/settings/change-password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const storedPassword = await getAdminPassword(req.user.id);

    // For now, just plain-text comparison (⚠️ NOT recommended for production)
    if (storedPassword !== currentPassword) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    await updateAdminPassword(req.user.id, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
};
