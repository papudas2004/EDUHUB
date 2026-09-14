const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    studentName: {
      type: String,
      required: true
    },
    studentEmail: {
      type: String,
      required: true
    },
    courseId: {
      type: String,
      required: true
    },
    courseTitle: {
      type: String,
      required: true
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    grade: {
      type: String,
      default: "Excellence (O)"
    },
    instructorName: {
      type: String,
      default: "Siddharth Roy, Senior Tech Lead"
    },
    verified: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", CertificateSchema);
