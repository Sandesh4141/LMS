import { Router } from "express";
import studentRoutes from "./student.routes.js";
import { authenticateJWT, authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles("student"));

router.use("/", studentRoutes);

export default router;
