const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  lessonNumber: { type: Number },
  title: { type: String, required: true },
  duration: { type: String, default: "15 mins" },
  videoUrl: { type: String, default: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" },
  content: { type: String, default: "" },
  summary: { type: String, default: "" },
  resources: [
    {
      name: String,
      url: String,
      type: { type: String, default: "link" }
    }
  ]
});

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "Comprehensive course designed for MCA students and software engineers.",
    },
    instructor: {
      type: String,
      default: "EduHub Senior Faculty",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Intermediate",
    },
    duration: {
      type: String,
      default: "30 Hours",
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    studentsCount: {
      type: Number,
      default: 1250,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
    },
    curriculum: [LessonSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
