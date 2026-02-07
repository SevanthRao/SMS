const Exam = require("../models/Exam.model");

// ================================
// POST /api/exams
// Create an exam (Admin / Faculty only)
// ================================
const createExam = async (req, res) => {
  try {
    const { examName, course, examDate, totalMarks } = req.body;

    const exam = await Exam.create({
      examName,
      course,
      examDate,
      totalMarks,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully.",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create exam.",
    });
  }
};

// ================================
// GET /api/exams
// Get all exams (All authenticated users)
// ================================
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("course", "courseCode courseName department")
      .sort({ examDate: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exams.",
    });
  }
};

// ================================
// GET /api/exams/:id
// Get a single exam by ID (All authenticated users)
// ================================
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("course", "courseCode courseName department");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
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
      message: "Failed to fetch exam.",
    });
  }
};

// ================================
// PUT /api/exams/:id
// Update an exam (Admin / Faculty only)
// ================================
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("course", "courseCode courseName department");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam updated successfully.",
      data: exam,
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
      message: "Failed to update exam.",
    });
  }
};

// ================================
// DELETE /api/exams/:id
// Delete an exam (Admin / Faculty only)
// ================================
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully.",
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
      message: "Failed to delete exam.",
    });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
};
