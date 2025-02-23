import { Router } from "express";
import teacherRoutes from "./teacher.routes.js";
import {
  authenticateJWT,
  authorizeRoles,
} from "../../middlewares/auth.middleware.js";

const router = Router();

// Apply authentication and only teachers can access these routes
router.use(authenticateJWT);
router.use(authorizeRoles("teacher"));

// Mount teacher routes
router.use("/", teacherRoutes);

export default router;
