import express from "express";

import { authorizeRoles } from "../../middlewares/auth.middleware.js";
import { authenticateJWT } from "../../middlewares/auth.middleware.js";

import courseRoutes from "./course.routes.js";
import departmentsRoutes from "./department.routes.js";
import overviewRoutes from "./overview.routes.js";
import studentRoutes from "./student.routes.js";
import subjectRoutes from "./subject.routes.js";
import teacherRoutes from "./teacher.routes.js";
import timetableRoutes from "./timetable.routes.js";
import announcementRoutes from "./announcement.routes.js";
import reportRoutes from "./reports.routes.js";
import adminSettingsRoutes from "./adminSettings.routes.js";

const router = express.Router();
router.use(authenticateJWT);
router.use(authorizeRoles("admin"));

router.use("/courses", courseRoutes);
router.use("/departments", departmentsRoutes);
router.use("/overview", overviewRoutes);
router.use("/students", studentRoutes);
router.use("/subjects", subjectRoutes);
router.use("/teachers", teacherRoutes);
router.use("/timetable", timetableRoutes);
router.use("/announcements", announcementRoutes);
router.use("/reports", reportRoutes);
router.use("/admin-settings", adminSettingsRoutes); // Assuming you have a separate route for admin settings
export default router;
