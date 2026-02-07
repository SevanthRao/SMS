const express = require("express");
const app = express();

// ================================
// Global Middleware
// ================================

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// ================================
// API Routes
// ================================
const userRoutes = require("./routes/user.routes");
const studentRoutes = require("./routes/student.routes");
const facultyRoutes = require("./routes/faculty.routes");
const courseRoutes = require("./routes/course.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const examRoutes = require("./routes/exam.routes");

app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);

// ================================
// Health Check Route
// ================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management System API is running.",
  });
});

// ================================
// 404 Handler - Unknown Routes
// ================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ================================
// Global Error Handler
// ================================
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

module.exports = app;
