const mongoose = require("mongoose");

/**
 * Assignment Schema
 * Represents an assignment created by faculty for a specific course.
 */
const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Course this assignment belongs to
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },

    // Faculty who created this assignment
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: [true, "Faculty reference is required"],
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
