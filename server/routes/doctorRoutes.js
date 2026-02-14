const express = require("express");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { authVerify, doctorOnly } = require("../middleware/authVerify");
const { upload, bufferToBase64 } = require("../middleware/upload");

const router = express.Router();

// Get all approved doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
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

// Get doctors by speciality
router.get("/speciality/:speciality", async (req, res) => {
  try {
    const { speciality } = req.params;
    const doctors = await Doctor.find({
      status: "approved",
      speciality: { $regex: speciality, $options: "i" },
    });
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

// Get single doctor
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }
    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get doctor.",
    });
  }
});

// Apply to become a doctor
router.post("/apply", authVerify, upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      about,
      speciality,
      degree,
      experience,
      hospital,
      fee,
      timeFrom,
      timeTo,
    } = req.body;

    // Check if already applied
    const existingDoctor = await Doctor.findOne({ userId: req.user._id });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to become a doctor.",
      });
    }

    // Convert image to base64 if provided
    let imageUrl = "";
    if (req.file) {
      imageUrl = bufferToBase64(req.file.buffer, req.file.mimetype);
    }

    const doctor = new Doctor({
      userId: req.user._id,
      image: imageUrl,
      name,
      email,
      phone,
      address,
      about,
      speciality,
      degree,
      experience,
      hospital,
      fee: Number(fee),
      timeFrom,
      timeTo,
      status: "pending",
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully. Please wait for admin approval.",
      doctor,
    });
  } catch (error) {
    console.error("Apply doctor error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit application.",
    });
  }
});

// Get doctor profile (for logged in doctor)
router.get("/profile/me", authVerify, doctorOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found.",
      });
    }
    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get doctor profile.",
    });
  }
});

// Update doctor profile
router.put("/profile", authVerify, doctorOnly, upload.single("image"), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found.",
      });
    }

    const {
      name,
      phone,
      address,
      about,
      speciality,
      degree,
      experience,
      hospital,
      fee,
      timeFrom,
      timeTo,
    } = req.body;

    // Update image if provided
    if (req.file) {
      doctor.image = bufferToBase64(req.file.buffer, req.file.mimetype);
    }

    if (name) doctor.name = name;
    if (phone) doctor.phone = phone;
    if (address) doctor.address = address;
    if (about) doctor.about = about;
    if (speciality) doctor.speciality = speciality;
    if (degree) doctor.degree = degree;
    if (experience) doctor.experience = experience;
    if (hospital) doctor.hospital = hospital;
    if (fee) doctor.fee = Number(fee);
    if (timeFrom) doctor.timeFrom = timeFrom;
    if (timeTo) doctor.timeTo = timeTo;

    await doctor.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      doctor,
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
});

// Check application status
router.get("/application/status", authVerify, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.json({
        success: true,
        hasApplied: false,
        status: null,
      });
    }
    res.json({
      success: true,
      hasApplied: true,
      status: doctor.status,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get application status.",
    });
  }
});

module.exports = router;
