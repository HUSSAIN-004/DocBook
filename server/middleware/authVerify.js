const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token from cookie
const authVerify = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// Doctor only middleware
const doctorOnly = async (req, res, next) => {
  try {
    if (!req.user.isDoctor) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Doctors only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = { authVerify, adminOnly, doctorOnly };
