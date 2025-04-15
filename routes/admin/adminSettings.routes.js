import express from "express";
import { upload } from "../../middlewares/uploadProfilePic.middleware.js";
import { authenticateJWT } from "../../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../controllers/adminSetting.controller.js";

const router = express.Router();


router.put(
  "/profile",
  authenticateJWT,
  upload.single("profile_image"),
  updateProfile
);

router.get("/profile", authenticateJWT, getProfile);
router.post("/change-password", authenticateJWT, changePassword);

export default router;
