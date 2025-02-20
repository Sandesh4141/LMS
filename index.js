//dependancies
import express from "express";

import { configDotenv } from "dotenv";
import cors from "cors";
configDotenv();
// routes

//global route
import loginRoutes from "./routes/login.routes.js";

//admin routes
import adminStudentRoutes from "./routes/admin/student.routes.js";
import adminTeacherRoutes from "./routes/admin/teacher.routes.js";
import adminDepartmentRoutes from "./routes/admin/department.routes.js";
import adminOverviewRoutes from "./routes/admin/overview.routes.js";
import adminCourseRoutes from "./routes/admin/course.routes.js";
import adminSubjectRoutes from "./routes/admin/subject.routes.js";
import adminTimetableRoutes from "./routes/admin/timetable.routes.js";

//student routes
import studentRoutes from "./routes/student/student.routes.js";

/*
 *server entry file (server.js)
 */
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
// routes for admin
app.use("/login", loginRoutes);
app.use("/admin/students", adminStudentRoutes);
app.use("/admin/teachers", adminTeacherRoutes);
app.use("/admin/overview", adminOverviewRoutes);
app.use("/admin/departments", adminDepartmentRoutes);
app.use("/admin/courses", adminCourseRoutes);
app.use("/admin/subjects", adminSubjectRoutes);
app.use("/admin/timetable", adminTimetableRoutes);

//routes for student
app.use("/student", studentRoutes);

app.listen(port, () => {
  console.log("🚀 Server started at localhost://" + port);
});
