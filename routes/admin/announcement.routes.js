import express from "express";
import {
  postAnnouncement,
  getAnnouncements,
  getAnnouncement,
  removeAnnouncement,
  editAnnouncement,
  filterAnnouncements,
  getAnnouncementCount,
} from "../../controllers/announcments.controller.js";

// custom multer config with destination: uploads/adminAnnouncements
import multer from "multer";
import path from "path";
import fs from "fs";

// storage path
const uploadPath = "uploads/adminAnnouncements";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Routes
router.post("/", upload.single("attachment"), postAnnouncement);
router.get("/", getAnnouncements);
router.get("/count", getAnnouncementCount);
router.get("/filter", filterAnnouncements);
router.get("/:id", getAnnouncement);
router.put("/:id", upload.single("attachment"), editAnnouncement);
router.delete("/:id", removeAnnouncement);

export default router;
