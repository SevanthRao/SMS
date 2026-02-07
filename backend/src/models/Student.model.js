const mongoose = require("mongoose");

/**
 * Student Profile Schema
 * Extended profile data linked to a User with role "student".
 */
const studentSchema = new mongoose.Schema(
  {
    // Reference to the base User document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },

    enrollmentNumber: {
      type: String,
      required: [true, "Enrollment number is required"],
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1, "Year must be at least 1"],
      max: [6, "Year cannot exceed 6"],
    },

    guardianName: {
      type: String,
      required: [true, "Guardian name is required"],
      trim: true,
    },

    guardianContact: {
      type: String,
      required: [true, "Guardian contact is required"],
      trim: true,
    },

    feeStatus: {
      type: String,
      enum: {
        values: ["paid", "partial", "unpaid"],
        message: "Fee status must be paid, partial, or unpaid",
      },
      default: "unpaid",
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
