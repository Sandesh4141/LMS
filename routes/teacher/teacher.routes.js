// teacher.routes.js
import { Router } from "express";
import {
  changePassword,
  fetchTeacherProfile,
  getTeacherDashboard,
  updateProfile,
  uploadProfilePicture,
  getTeacherCourse,
  getTeacherSubjectsList,
  uploadContent,
} from "../../controllers/teacher.controller.js";
import { upload } from "../../middlewares/uploadProfilePic.middleware.js";
const router = Router();

// When a GET request is made to /teacher/dashboard, the dashboard data is returned.
router.get("/dashboard", getTeacherDashboard);
router.get("/profile", fetchTeacherProfile);
router.put("/profile/update", updateProfile);
router.post(
  "/profile/upload",
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.put("/profile/change-password", changePassword);

router.get("/course", getTeacherCourse); // Get Assigned Course
router.get("/subjects", getTeacherSubjectsList); // Get Assigned Subjects

router.post(
  "/subjects/:subjectId/upload",
  upload.single("file"),
  uploadContent
);

export default router;
