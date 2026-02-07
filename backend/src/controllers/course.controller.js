const Course = require("../models/Course.model");
const Student = require("../models/Student.model");

// ================================
// POST /api/courses
// Create a new course (Admin only)
// ================================
const createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, credits, department, faculty, students } = req.body;

    // Check if course code already exists
    const existing = await Course.findOne({ courseCode: courseCode?.toUpperCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A course with this code already exists.",
      });
    }

    const course = await Course.create({
      courseCode,
      courseName,
      credits,
      department,
      faculty: faculty || null,
      students: students || [],
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course.",
    });
  }
};

// ================================
// GET /api/courses
// Get all courses
// Admin/Faculty: all courses
// Student: only enrolled courses
// ================================
const getAllCourses = async (req, res) => {
  try {
    let query = {};

    // If the user is a student, only return their enrolled courses
    if (req.user.role === "student") {
      const studentProfile = await Student.findOne({ user: req.user._id });
      if (!studentProfile) {
        return res.status(404).json({
          success: false,
          message: "Student profile not found.",
        });
      }
      query = { students: studentProfile._id };
    }

    const courses = await Course.find(query)
      .populate({ path: "faculty", select: "department designation user", populate: { path: "user", select: "name email" } })
      .populate("students", "enrollmentNumber department year")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses.",
    });
  }
};

// ================================
// GET /api/courses/:id
// Get a single course by ID
// ================================
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({ path: "faculty", select: "department designation user", populate: { path: "user", select: "name email" } })
      .populate("students", "enrollmentNumber department year");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
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
      message: "Failed to fetch course.",
    });
  }
};

// ================================
// PUT /api/courses/:id
// Update a course (Admin only)
// ================================
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate({ path: "faculty", select: "department designation user", populate: { path: "user", select: "name email" } })
      .populate("students", "enrollmentNumber department year");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: course,
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
      message: "Failed to update course.",
    });
  }
};

// ================================
// DELETE /api/courses/:id
// Delete a course (Admin only)
// ================================
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
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
      message: "Failed to delete course.",
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
