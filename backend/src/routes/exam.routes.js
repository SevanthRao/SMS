const express = require("express");
const router = express.Router();

// Controller imports
const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/exam.controller");

// Middleware imports
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// ================================
// All routes require authentication
// ================================

// Admin / Faculty: create an exam
router.post("/", authenticate, authorize("admin", "faculty"), createExam);

// All authenticated users: get all exams
router.get("/", authenticate, getAllExams);

// All authenticated users: get a single exam
router.get("/:id", authenticate, getExamById);

// Admin / Faculty: update an exam
router.put("/:id", authenticate, authorize("admin", "faculty"), updateExam);

// Admin / Faculty: delete an exam
router.delete("/:id", authenticate, authorize("admin", "faculty"), deleteExam);

module.exports = router;
