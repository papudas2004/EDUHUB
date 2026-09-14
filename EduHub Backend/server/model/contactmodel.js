const mongoose = require("mongoose");

const contactDetailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },

    xp: {
      type: Number,
      default: 120,
    },

    streak: {
      type: Number,
      default: 5,
    },

    level: {
      type: Number,
      default: 1,
    },

    badges: {
      type: [String],
      default: ["🔥 7 Day Streak", "📚 Learning Champion"],
    },

    phoneno: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactDetailSchema);