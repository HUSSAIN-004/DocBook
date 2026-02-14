const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import User model
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/doctor-appointment"
    );
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@docbook.com" });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: admin@docbook.com");
      console.log("Password: admin123");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      username: "Admin",
      email: "admin@docbook.com",
      password: hashedPassword,
      isAdmin: true,
      isDoctor: false,
    });

    await admin.save();

    console.log("\n========================================");
    console.log("Admin user created successfully!");
    console.log("========================================");
    console.log("Email: admin@docbook.com");
    console.log("Password: admin123");
    console.log("========================================\n");
    console.log("Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
