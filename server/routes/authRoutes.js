const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {upload} = require("../middleware/upload");
const { authVerify } = require("../middleware/authVerify");

const router = express.Router();

// Register
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Convert image to base64 if provided
    let imageData = "";
    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype;
      imageData = `data:${mimeType};base64,${base64}`;
    }

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      image: imageData,
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Login successful!",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

// Get current user (check auth)
router.get("/me", authVerify, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        image: req.user.image,
        isAdmin: req.user.isAdmin,
        isDoctor: req.user.isDoctor,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user.",
    });
  }
});

module.exports = router;
