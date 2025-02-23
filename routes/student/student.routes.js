import { getStudentDashboard } from "../../controllers/student.controller.js";
import { Router } from "express";
const router = Router();

router.get("/dashboard", getStudentDashboard);

export default router;
