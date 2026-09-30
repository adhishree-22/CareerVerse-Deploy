const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ["project", "work", "personal"], default: "personal" },
  relatedProject: { type: String, default: "" },
  dueDate: { type: Date },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  subtasks: [
    {
      title: String,
      done: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);
