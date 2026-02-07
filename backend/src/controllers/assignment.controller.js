const Assignment = require("../models/Assignment.model");
const Faculty = require("../models/Faculty.model");

// ================================
// POST /api/assignments
// Create an assignment (Faculty only)
// ================================
const createAssignment = async (req, res) => {
  try {
    const { title, description, course, faculty: bodyFaculty, dueDate } = req.body;

    let facultyId;

    if (req.user.role === "admin") {
      // Admin must specify which faculty
      if (!bodyFaculty) {
        return res.status(400).json({
          success: false,
          message: "Admin must specify a faculty for the assignment.",
        });
      }
      facultyId = bodyFaculty;
    } else {
      // Faculty — auto-assign from their own profile
      const facultyProfile = await Faculty.findOne({ user: req.user._id });
      if (!facultyProfile) {
        return res.status(404).json({
          success: false,
          message: "Faculty profile not found. Contact admin.",
        });
      }
      facultyId = facultyProfile._id;
    }

    const assignment = await Assignment.create({
      title,
      description,
      course,
      faculty: facultyId,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully.",
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create assignment.",
    });
  }
};

// ================================
// GET /api/assignments
// Get all assignments
// Faculty: their own assignments
// Student/Admin: all assignments
// ================================
const getAllAssignments = async (req, res) => {
  try {
    let query = {};

    // If faculty, only show their own assignments
    if (req.user.role === "faculty") {
      const facultyProfile = await Faculty.findOne({ user: req.user._id });
      if (facultyProfile) {
        query = { faculty: facultyProfile._id };
      }
    }

    const assignments = await Assignment.find(query)
      .populate("course", "courseCode courseName")
      .populate({ path: "faculty", select: "department designation user", populate: { path: "user", select: "name email" } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch assignments.",
    });
  }
};

// ================================
// GET /api/assignments/:id
// Get a single assignment by ID
// ================================
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("course", "courseCode courseName")
      .populate({ path: "faculty", select: "department designation user", populate: { path: "user", select: "name email" } });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: assignment,
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
      message: "Failed to fetch assignment.",
    });
  }
};

// ================================
// PUT /api/assignments/:id
// Update an assignment (Admin: any, Faculty: own only)
// ================================
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    // Faculty can only update their own assignments
    if (req.user.role === "faculty") {
      const facultyProfile = await Faculty.findOne({ user: req.user._id });
      if (!facultyProfile || assignment.faculty.toString() !== facultyProfile._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own assignments.",
        });
      }
    }

    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("course", "courseCode courseName")
      .populate({ path: "faculty", select: "department designation user", populate: { path: "user", select: "name email" } });

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully.",
      data: updated,
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
      message: "Failed to update assignment.",
    });
  }
};

// ================================
// DELETE /api/assignments/:id
// Delete an assignment (Admin: any, Faculty: own only)
// ================================
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    // Faculty can only delete their own assignments
    if (req.user.role === "faculty") {
      const facultyProfile = await Faculty.findOne({ user: req.user._id });
      if (!facultyProfile || assignment.faculty.toString() !== facultyProfile._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own assignments.",
        });
      }
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully.",
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
      message: "Failed to delete assignment.",
    });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
