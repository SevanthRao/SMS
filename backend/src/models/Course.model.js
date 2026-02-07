const mongoose = require("mongoose");

/**
 * Course Schema
 * Represents an academic course with assigned faculty and enrolled students.
 */
const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },

    credits: {
      type: Number,
      required: [true, "Credits are required"],
      min: [1, "Credits must be at least 1"],
      max: [10, "Credits cannot exceed 10"],
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    // Faculty assigned to teach this course
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      default: null,
    },

    // Array of enrolled students
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
