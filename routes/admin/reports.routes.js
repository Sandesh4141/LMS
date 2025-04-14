import express from "express";

import {
  studentReport,
  teacherReport,
  subjectReport,
  announcementReport,
  courseReport,
} from "../../controllers/reports.controller.js";

const router = express.Router();

// Reports Routes
router.get("/students", studentReport);
router.get("/teachers", teacherReport);
router.get("/subjects", subjectReport);
router.get("/courses", courseReport);
router.get("/announcements", announcementReport);

export default router;
