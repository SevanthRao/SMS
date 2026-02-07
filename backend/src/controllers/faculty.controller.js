const Faculty = require("../models/Faculty.model");

// ================================
// POST /api/faculty
// Create a faculty profile (Admin only)
// ================================
const createFaculty = async (req, res) => {
  try {
    const { user, department, designation, experienceYears } = req.body;

    // Check if a profile already exists for this user
    const existing = await Faculty.findOne({ user });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A faculty profile already exists for this user.",
      });
    }

    const faculty = await Faculty.create({
      user,
      department,
      designation,
      experienceYears,
    });

    res.status(201).json({
      success: true,
      message: "Faculty profile created successfully.",
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create faculty profile.",
    });
  }
};

// ================================
// GET /api/faculty
// Get all faculty profiles (Admin only)
// ================================
const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch faculty.",
    });
  }
};

// ================================
// GET /api/faculty/:id
// Get a single faculty profile by ID (Admin only)
// ================================
const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate("user", "name email role");

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch faculty profile.",
    });
  }
};

// ================================
// GET /api/faculty/me
// Get own faculty profile (Faculty only)
// ================================
const getMyFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id })
      .populate("user", "name email role");

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found. Contact admin.",
      });
    }

    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your profile.",
    });
  }
};

// ================================
// PUT /api/faculty/:id
// Update a faculty profile (Admin only)
// ================================
const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "name email role");

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Faculty profile updated successfully.",
      data: faculty,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update faculty profile.",
    });
  }
};

// ================================
// DELETE /api/faculty/:id
// Delete a faculty profile (Admin only)
// ================================
const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Faculty profile deleted successfully.",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete faculty profile.",
    });
  }
};

module.exports = {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  getMyFacultyProfile,
  updateFaculty,
  deleteFaculty,
};
