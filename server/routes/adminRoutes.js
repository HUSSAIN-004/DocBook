const express = require("express");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const { authVerify, adminOnly } = require("../middleware/authVerify");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authVerify, adminOnly);

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get users.",
    });
  }
});

// Delete user (cannot delete admin)
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin user.",
      });
    }

    // Delete doctor profile if exists
    const doctor = await Doctor.findOne({ userId: user._id });
    if (doctor) {
      await Doctor.deleteOne({ userId: user._id });
    }

    // Delete user's appointments
    await Appointment.deleteMany({ userId: user._id });

    await User.deleteOne({ _id: user._id });

    res.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
});

// Get all doctors (including pending)
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get doctors.",
    });
  }
});

// Approve doctor
router.put("/doctors/:id/approve", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    doctor.status = "approved";
    await doctor.save();

    // Update user's isDoctor flag
    await User.findByIdAndUpdate(doctor.userId, { isDoctor: true });

    res.json({
      success: true,
      message: "Doctor approved successfully.",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve doctor.",
    });
  }
});

// Block doctor
router.put("/doctors/:id/block", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    doctor.status = "blocked";
    await doctor.save();

    // Update user's isDoctor flag
    await User.findByIdAndUpdate(doctor.userId, { isDoctor: false });

    res.json({
      success: true,
      message: "Doctor blocked successfully.",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to block doctor.",
    });
  }
});

// Unblock doctor (set back to approved)
router.put("/doctors/:id/unblock", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    doctor.status = "approved";
    await doctor.save();

    // Update user's isDoctor flag
    await User.findByIdAndUpdate(doctor.userId, { isDoctor: true });

    res.json({
      success: true,
      message: "Doctor unblocked successfully.",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to unblock doctor.",
    });
  }
});

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments({ status: "approved" });
    const pendingDoctors = await Doctor.countDocuments({ status: "pending" });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        pendingDoctors,
        totalAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get stats.",
    });
  }
});

module.exports = router;
