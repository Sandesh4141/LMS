import express from "express";
import * as timetableController from "../controllers/timetable.controller.js"; // Adjust path to your controller file
const router = express.Router();

// Create a new timetable entry
router.post("/timetable", timetableController.createTimetableEntry);

// Get timetable for a specific day
router.get("/timetable/day/:day", timetableController.getTimetableByDay);

// Get timetable for a specific course
router.get(
  "/timetable/course/:course_id",
  timetableController.getTimetableByCourse
);

// Get timetable for a specific teacher
router.get(
  "/timetable/teacher/:teacher_id",
  timetableController.getTimetableByTeacher
);

// Update timetable entry
router.put("/timetable/:id", timetableController.updateTimetableEntry);

// Delete timetable entry
router.delete("/timetable/:id", timetableController.deleteTimetableEntry);

export default router;
