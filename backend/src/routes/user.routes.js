const express = require("express");
const router = express.Router();

// Controller imports
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
} = require("../controllers/user.controller");

// Middleware imports
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// ================================
// Public Routes (No auth required)
// ================================
router.post("/login", loginUser);

// ================================
// Protected Routes (Auth required)
// ================================

// Get logged-in user's own profile
router.get("/me", authenticate, getMyProfile);

// Admin-only: Create a new user
router.post("/register", authenticate, authorize("admin"), createUser);

// Admin-only: Get all users
router.get("/", authenticate, authorize("admin"), getAllUsers);

// Admin-only: Delete a user
router.delete("/:id", authenticate, authorize("admin"), deleteUser);

// Authenticated users: Get user by ID (admin = any, others = self only)
router.get("/:id", authenticate, getUserById);

// Authenticated users: Update user by ID (admin = any, others = self only)
router.put("/:id", authenticate, updateUser);

module.exports = router;
