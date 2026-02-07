/**
 * Seed Script
 * Creates a default admin user if none exists.
 * Run with: npm run seed
 */
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("./models/User.model");
const connectDB = require("./config/db");

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists. Skipping seed.");
      process.exit(0);
    }

    // Create default admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    console.log("✅ Default admin user created:");
    console.log(`   Email:    admin@example.com`);
    console.log(`   Password: admin123`);
    console.log(`   Role:     admin`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
