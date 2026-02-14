const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    userInfo: {
      username: String,
      email: String,
       image: String,
    },
    doctorInfo: {
      name: String,
      email: String,
      speciality: String,
      hospital: String,
      fee: Number,
      image: String,
       
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    symptoms: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Index to prevent double booking
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
