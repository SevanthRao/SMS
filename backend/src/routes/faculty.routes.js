const express = require("express");
const router = express.Router();

// Controller imports
const {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  getMyFacultyProfile,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/faculty.controller");

// Middleware imports
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// ================================
// All routes require authentication
// ================================

// Faculty: view own profile
router.get("/me", authenticate, authorize("faculty"), getMyFacultyProfile);

// Admin: create a faculty profile
router.post("/", authenticate, authorize("admin"), createFaculty);

// Admin / Faculty: get all faculty profiles
router.get("/", authenticate, authorize("admin", "faculty"), getAllFaculty);

// Admin / Faculty: get a single faculty profile
router.get("/:id", authenticate, authorize("admin", "faculty"), getFacultyById);

// Admin: update a faculty profile
router.put("/:id", authenticate, authorize("admin"), updateFaculty);

// Admin: delete a faculty profile
router.delete("/:id", authenticate, authorize("admin"), deleteFaculty);

module.exports = router;
