const express = require("express");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { authVerify, doctorOnly } = require("../middleware/authVerify");

const router = express.Router();

// Book appointment
router.post("/book", authVerify, async (req, res) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;

    // Get doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    if (doctor.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available for appointments.",
      });
    }

    // Check for existing appointment (double booking)
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $nin: ["cancelled"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked. Please choose another time.",
      });
    }

    const appointment = new Appointment({
      userId: req.user._id,
      doctorId,
      userInfo: {
        username: req.user.username,
        email: req.user.email,
        image: req.user.image,
      },
      doctorInfo: {
        name: doctor.name,
        email: doctor.email,
        speciality: doctor.speciality,
        hospital: doctor.hospital,
        fee: doctor.fee,
        image: doctor.image,
      },
      date,
      time,
      symptoms: symptoms || "",
      status: "pending",
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment,
    });
  } catch (error) {
    console.error("Book appointment error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked. Please choose another time.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to book appointment.",
    });
  }
});

// Get user's appointments
router.get("/my-appointments", authVerify, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get appointments.",
    });
  }
});

// Get doctor's appointments
router.get("/doctor-appointments", authVerify, doctorOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found.",
      });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get appointments.",
    });
  }
});

// Update appointment status (doctor only)
router.put("/:id/status", authVerify, doctorOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment status updated.",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment.",
    });
  }
});

// Cancel appointment (user can cancel their own)
router.put("/:id/cancel", authVerify, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled.",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel appointment.",
    });
  }
});

module.exports = router;
