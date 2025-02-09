//dependancies
import express from "express";

import { configDotenv } from "dotenv";
import cors from "cors";
configDotenv();
// routes
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import loginRoutes from "./routes/login.routes.js";

import departmentRoutes from "./routes/department.routes.js";
import overviewRoutes from "./routes/overview.routes.js";
import courseRoutes from "./routes/course.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import timetableRoutes from "./routes/timetable.routes.js";

/*
 *server entry file (server.js)
 */
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
// routes for admin
app.use("/login", loginRoutes);
app.use("/admin/students", studentRoutes);
app.use("/admin/teachers", teacherRoutes);
app.use("/admin/overview", overviewRoutes);
app.use("/admin/departments", departmentRoutes);
app.use("/admin/courses", courseRoutes);
app.use("/admin/subjects", subjectRoutes);
app.use("/admin/timetable", timetableRoutes);

//routes for student
app.use("/student/profile", studentRoutes);
app.use("/student/timetable", timetableRoutes);
app.use("/student/courses", courseRoutes);
app.use("/student/subjects", subjectRoutes);


app.listen(port, () => {
  console.log("Server started at localhost://" + port);
});
