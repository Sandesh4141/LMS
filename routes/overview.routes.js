import express from "express";
import { fetchOverviewData } from "../controllers/overview.controller.js";

const router = express.Router();

// Route to get dashboard overview data
router.get("/", fetchOverviewData);

export default router;
