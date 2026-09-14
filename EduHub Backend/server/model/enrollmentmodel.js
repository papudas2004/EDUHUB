const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    courseTitle: {
      type: String,
      default: "",
    },
    completedLessons: {
      type: [Number], // Array of lesson indices / numbers
      default: [],
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
    lastLessonIndex: {
      type: Number,
      default: 0,
    },
    notes: [
      {
        lessonIndex: Number,
        noteText: String,
        updatedAt: { type: Date, default: Date.now }
      }
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    certificateId: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
