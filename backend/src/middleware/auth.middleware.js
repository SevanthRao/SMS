const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

/**
 * Authentication Middleware
 * Verifies the JWT token from the Authorization header.
 * Attaches the authenticated user to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from "Bearer <token>" format
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and attach to request (exclude password)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is valid but user no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticate;
