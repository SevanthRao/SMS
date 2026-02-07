const express = require("express");
const router = express.Router();

// Controller imports
const {
  createStudent,
  getAllStudents,
  getStudentById,
  getMyStudentProfile,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");

// Middleware imports
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// ================================
// All routes require authentication
// ================================

// Student: view own profile
router.get("/me", authenticate, authorize("student"), getMyStudentProfile);

// Admin: create a student profile
router.post("/", authenticate, authorize("admin"), createStudent);

// Admin / Faculty: get all student profiles
router.get("/", authenticate, authorize("admin", "faculty"), getAllStudents);

// Admin / Faculty: get a single student profile
router.get("/:id", authenticate, authorize("admin", "faculty"), getStudentById);

// Admin: update a student profile
router.put("/:id", authenticate, authorize("admin"), updateStudent);

// Admin: delete a student profile
router.delete("/:id", authenticate, authorize("admin"), deleteStudent);

module.exports = router;
