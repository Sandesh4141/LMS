//dependancies
import express from "express";

import { configDotenv } from "dotenv";
import cors from "cors";
configDotenv();
// routes

//global route
import loginRoutes from "./routes/login.routes.js";

//admin routes
import adminRoutes from "./routes/admin/index.routes.js";
//student routes
import studentRoutes from "./routes/student/student.routes.js";

/*
 *server entry file (server.js)
 */
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// route for login
app.use("/login", loginRoutes);

// routes for admin
app.use("/admin", adminRoutes);

//routes for student
app.use("/student", studentRoutes);

app.listen(port, () => {
  console.log("🚀 Server started at localhost://" + port);
});
