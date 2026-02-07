const mongoose = require("mongoose");

/**
 * Faculty Profile Schema
 * Extended profile data linked to a User with role "faculty".
 */
const facultySchema = new mongoose.Schema(
  {
    // Reference to the base User document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },

    experienceYears: {
      type: Number,
      required: [true, "Experience years is required"],
      min: [0, "Experience cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
