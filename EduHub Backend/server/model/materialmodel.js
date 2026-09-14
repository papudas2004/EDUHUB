const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "DSA", "Cloud", "Operating Systems", "Placement"],
      default: "Frontend"
    },
    type: {
      type: String,
      enum: ["pdf", "notes", "code", "video", "cheatsheet"],
      default: "pdf"
    },
    description: { type: String, default: "" },
    fileUrl: { type: String, default: "#" },
    fileName: { type: String, default: "study_notes.md" },
    content: { type: String, default: "" },
    author: { type: String, default: "EduHub Academic Faculty" },
    size: { type: String, default: "2.4 MB" },
    downloadsCount: { type: Number, default: 45 },
    tags: [String],
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", MaterialSchema);
