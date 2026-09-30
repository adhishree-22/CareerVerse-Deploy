const mongoose = require("mongoose");

const savedIssueSchema = new mongoose.Schema({
  title: String,
  url: String,
  repo: String,
  language: String,
  label: String,
  comments: Number,
  stars: Number,
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SavedIssue", savedIssueSchema);