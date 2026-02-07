const express = require("express");
const router = express.Router();

// Controller imports
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

// Middleware imports
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// ================================
// All routes require authentication
// ================================

// Admin: create a course
router.post("/", authenticate, authorize("admin"), createCourse);

// All authenticated users: get all courses (students see only enrolled)
router.get("/", authenticate, getAllCourses);

// All authenticated users: get a single course
router.get("/:id", authenticate, getCourseById);

// Admin: update a course
router.put("/:id", authenticate, authorize("admin"), updateCourse);

// Admin: delete a course
router.delete("/:id", authenticate, authorize("admin"), deleteCourse);

module.exports = router;
