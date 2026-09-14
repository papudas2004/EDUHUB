// EduHub Backend/server/model/taskmodel.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskDetail: {
    type: String,
    required: true
  },
  courseStream: {
    type: String,
    required: true
  },
  dueDate: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Assignment', 'Quiz', 'Practical'],
    default: 'Assignment'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
