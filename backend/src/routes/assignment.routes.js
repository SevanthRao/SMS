const express = require("express");
const router = express.Router();

// Controller imports
const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignment.controller");

// Middleware imports
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// ================================
// All routes require authentication
// ================================

// Admin / Faculty: create an assignment
router.post("/", authenticate, authorize("admin", "faculty"), createAssignment);

// All authenticated users: get all assignments
router.get("/", authenticate, getAllAssignments);

// All authenticated users: get a single assignment
router.get("/:id", authenticate, getAssignmentById);

// Admin / Faculty: update an assignment
router.put("/:id", authenticate, authorize("admin", "faculty"), updateAssignment);

// Admin / Faculty: delete an assignment
router.delete("/:id", authenticate, authorize("admin", "faculty"), deleteAssignment);

module.exports = router;
