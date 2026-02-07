const Student = require("../models/Student.model");

// ================================
// POST /api/students
// Create a student profile (Admin only)
// ================================
const createStudent = async (req, res) => {
  try {
    const { user, enrollmentNumber, department, year, guardianName, guardianContact, feeStatus } = req.body;

    // Check if a profile already exists for this user
    const existing = await Student.findOne({ user });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A student profile already exists for this user.",
      });
    }

    // Check if enrollment number is already taken
    const enrollmentExists = await Student.findOne({ enrollmentNumber });
    if (enrollmentExists) {
      return res.status(409).json({
        success: false,
        message: "This enrollment number is already in use.",
      });
    }

    const student = await Student.create({
      user,
      enrollmentNumber,
      department,
      year,
      guardianName,
      guardianContact,
      feeStatus,
    });

    res.status(201).json({
      success: true,
      message: "Student profile created successfully.",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create student profile.",
    });
  }
};

// ================================
// GET /api/students
// Get all student profiles (Admin only)
// ================================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch students.",
    });
  }
};

// ================================
// GET /api/students/:id
// Get a single student profile by ID (Admin only)
// ================================
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("user", "name email role");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
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
      message: "Failed to fetch student profile.",
    });
  }
};

// ================================
// GET /api/students/me
// Get own student profile (Student only)
// ================================
const getMyStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate("user", "name email role");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. Contact admin.",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your profile.",
    });
  }
};

// ================================
// PUT /api/students/:id
// Update a student profile (Admin only)
// ================================
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "name email role");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student profile updated successfully.",
      data: student,
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
      message: "Failed to update student profile.",
    });
  }
};

// ================================
// DELETE /api/students/:id
// Delete a student profile (Admin only)
// ================================
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student profile deleted successfully.",
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
      message: "Failed to delete student profile.",
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  getMyStudentProfile,
  updateStudent,
  deleteStudent,
};
