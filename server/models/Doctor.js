const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    about: {
      type: String,
      required: [true, "About is required"],
      trim: true,
    },
    speciality: {
      type: String,
      required: [true, "Speciality is required"],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
      trim: true,
    },
    hospital: {
      type: String,
      required: [true, "Hospital is required"],
      trim: true,
    },
    fee: {
      type: Number,
      required: [true, "Fee is required"],
    },
    timeFrom: {
      type: String,
      required: [true, "Time From is required"],
    },
    timeTo: {
      type: String,
      required: [true, "Time To is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
