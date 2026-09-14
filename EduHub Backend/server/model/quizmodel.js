const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, default: "" },
  topic: { type: String, default: "General" }
});

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    durationMinutes: { type: Number, default: 10 },
    totalMarks: { type: Number, default: 100 },
    description: { type: String, default: "Test your skills and track your accuracy." },
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

const QuizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    quizId: { type: String, required: true, index: true },
    quizTitle: { type: String, default: "" },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    strongTopics: [String],
    weakTopics: [String],
    xpEarned: { type: Number, default: 50 },
  },
  { timestamps: true }
);

module.exports = {
  Quiz: mongoose.model("Quiz", QuizSchema),
  QuizAttempt: mongoose.model("QuizAttempt", QuizAttemptSchema)
};
