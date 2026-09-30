const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  student: String,
  targetCareer: String,
  profileScore: Number,
  missingSkills: [String],
  roadmap: [
    {
      step: Number,
      title: String,
      tasks: [String],
      timeframeWeeks: Number
    }
  ],
  basedOnCurrentSkills: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Roadmap", roadmapSchema);