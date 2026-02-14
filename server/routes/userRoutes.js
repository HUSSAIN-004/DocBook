const express = require("express");
const User = require("../models/User");
const { authVerify } = require("../middleware/authVerify");
const { upload, bufferToBase64 } = require("../middleware/upload");

const router = express.Router();

// Get user profile
router.get("/profile", authVerify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get profile.",
    });
  }
});

// Update user profile
router.put("/profile", authVerify, upload.single("image"), async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if email is taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use.",
        });
      }
    }

    // Update image if provided - store as base64
    if (req.file) {
      user.image = bufferToBase64(req.file.buffer, req.file.mimetype);
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
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
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
});

module.exports = router;
