// teacher.routes.js
import { Router } from "express";
import { getTeacherDashboard } from "../../controllers/teacher.controller.js";

const router = Router();

// When a GET request is made to /teacher/dashboard, the dashboard data is returned.
router.get("/dashboard", getTeacherDashboard);


export default router;
