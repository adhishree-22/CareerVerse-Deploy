require("dotenv").config();
const SavedIssue = require("./models/SavedIssue");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { analyzeSkillGap, KNOWN_ROLES, getSuggestedSkillNames, computeProfileScore } = require("./skillsAnalyzer");
const Roadmap = require("./models/Roadmap");
const { getRoadmapSteps } = require("./roadmapData");
const Task = require("./models/Task");
const Project = require("./models/Project");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ---------------- HEALTH ----------------
app.get("/api/health", (req, res) => {
  res.json({ status: "server is running" });
});

app.get("/api/roles", (req, res) => {
  res.json(KNOWN_ROLES);
});

app.get("/api/skills/suggested", (req, res) => {
  const { role } = req.query;
  if (!role) return res.status(400).json({ error: "role is required" });
  res.json(getSuggestedSkillNames(role));
});


// ---------------- ROADMAP ----------------
function generateRoadmapFromAI({ name, currentSkills, targetCareer, studyLevel }) {
  const { score, missing } = computeProfileScore(targetCareer, currentSkills);
  const { steps } = getRoadmapSteps(targetCareer, studyLevel);

  return {
    student: name,
    targetCareer,
    profileScore: score,
    missingSkills: missing.length ? missing : ["You're covering all the core skills we track for this role!"],
    roadmap: steps,
    basedOnCurrentSkills: currentSkills
  };
}

app.post("/api/roadmap", async (req, res) => {
  const { name, currentSkills, targetCareer, studyLevel } = req.body;
  if (!name || !targetCareer) {
    return res.status(400).json({ error: "name and targetCareer are required" });
  }
  const roadmapData = generateRoadmapFromAI({ name, currentSkills: currentSkills || [], targetCareer, studyLevel });
  try {
    const savedRoadmap = await Roadmap.create(roadmapData);
    res.json(savedRoadmap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save roadmap" });
  }
});

// ---------------- SKILLS ANALYZER ----------------
app.post("/api/skills/analyze", (req, res) => {
  const { targetRole, skills } = req.body;
  if (!targetRole || !skills) {
    return res.status(400).json({ error: "targetRole and skills are required" });
  }
  const result = analyzeSkillGap(targetRole, skills);
  if (result.error) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// ---------------- OPEN SOURCE FINDER ----------------
app.get("/api/opensource", async (req, res) => {
  const { language = "javascript", label = "good first issue", sort = "newest" } = req.query;
  try {
    const query = encodeURIComponent(`is:issue is:open label:"${label}" language:${language}`);
    const sortParams = {
      "newest": "sort=created&order=desc",
      "most-comments": "sort=comments&order=desc",
      "fewest-comments": "sort=comments&order=asc",
    };
    const sortQuery = sortParams[sort] || sortParams["newest"];

    const response = await fetch(`https://api.github.com/search/issues?q=${query}&per_page=15&${sortQuery}`, {
      headers: { "Accept": "application/vnd.github+json" }
    });
    const data = await response.json();
    if (!data.items) {
      return res.status(500).json({ error: "GitHub API error", details: data });
    }

    let results = data.items.map((item) => ({
      title: item.title,
      url: item.html_url,
      repo: item.repository_url.split("/").slice(-2).join("/"),
      labels: item.labels.map((l) => l.name),
      comments: item.comments,
      language,
      label,
      stars: null,
    }));

    const uniqueRepos = [...new Set(results.map((r) => r.repo))].slice(0, 10);
    const starMap = {};
    await Promise.all(
      uniqueRepos.map(async (repoFullName) => {
        try {
          const repoRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
            headers: { "Accept": "application/vnd.github+json" }
          });
          const repoData = await repoRes.json();
          starMap[repoFullName] = repoData.stargazers_count ?? null;
        } catch {
          starMap[repoFullName] = null;
        }
      })
    );
    results = results.map((r) => ({ ...r, stars: starMap[r.repo] ?? null }));

    res.json({ language, label, sort, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from GitHub" });
  }
});

app.post("/api/opensource/saved", async (req, res) => {
  try {
    const saved = await SavedIssue.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save issue" });
  }
});

app.get("/api/opensource/saved", async (req, res) => {
  const saved = await SavedIssue.find().sort({ savedAt: -1 });
  res.json(saved);
});

app.delete("/api/opensource/saved/:id", async (req, res) => {
  try {
    await SavedIssue.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove" });
  }
});

// ---------------- PROJECT BUILDER (mocked suggestions) ----------------
function generateProjectSuggestions(targetRole, currentSkills) {
  return [
    {
      title: `${targetRole} Portfolio Project`,
      description: `A hands-on project demonstrating core skills for ${targetRole}.`,
      milestones: ["Define scope", "Build MVP", "Add documentation", "Deploy / publish", "Write a README with results"]
    },
    {
      title: "Open Source Contribution Sprint",
      description: "Contribute to 2-3 real repositories to build public proof of skill.",
      milestones: ["Find 3 good-first-issue repos", "Fix first issue", "Submit PR", "Respond to review feedback"]
    },
    {
      title: "Capstone Case Study",
      description: `Deep-dive analysis or build relevant to ${targetRole}, written up as a case study.`,
      milestones: ["Pick a real problem", "Research approach", "Build/analyze", "Write up findings"]
    }
  ];
}

app.post("/api/projects/suggestions", (req, res) => {
  const { targetRole, currentSkills } = req.body;
  if (!targetRole) {
    return res.status(400).json({ error: "targetRole is required" });
  }
  const suggestions = generateProjectSuggestions(targetRole, currentSkills || []);
  res.json({ targetRole, suggestions });
});

app.post("/api/projects", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to save project" });
  }
});

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

app.put("/api/projects/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Project not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

// ---------------- PERSONALITY RECOMMENDATIONS (placeholder data) ----------------
const PERSONALITIES = [
  { name: "Sample Profile A", field: "Cybersecurity", currentRole: "Security Engineer", careerPath: ["BSc IT", "SOC Analyst Intern", "Security Engineer"], keyLessons: ["Build a home lab early", "Certifications open doors but projects prove skill"] },
  { name: "Sample Profile B", field: "Software Engineering", currentRole: "Backend Engineer", careerPath: ["BSc CS", "Open source contributor", "Backend Engineer"], keyLessons: ["Contribute to open source consistently", "Master one stack deeply before spreading wide"] },
  { name: "Sample Profile C", field: "Data Science", currentRole: "Data Analyst", careerPath: ["BSc Stats", "Kaggle competitions", "Data Analyst"], keyLessons: ["SQL is non-negotiable", "Communicate findings, not just models"] },
];

app.get("/api/personalities", (req, res) => {
  const { field } = req.query;
  const results = field
    ? PERSONALITIES.filter((p) => p.field.toLowerCase() === field.toLowerCase())
    : PERSONALITIES;
  res.json(results);
});

// ---------------- UNIVERSITY COURSE FINDER (placeholder data) ----------------
const UNIVERSITY_COURSES = [
  { university: "Sample University A", course: "BSc Cybersecurity", country: "UK", duration: "3 years" },
  { university: "Sample University B", course: "MSc Data Science", country: "USA", duration: "2 years" },
  { university: "Sample University C", course: "BEng Computer Science", country: "India", duration: "4 years" },
];

app.get("/api/universities/courses", (req, res) => {
  const { query } = req.query;
  const results = query
    ? UNIVERSITY_COURSES.filter((c) =>
        `${c.university} ${c.course} ${c.country}`.toLowerCase().includes(query.toLowerCase())
      )
    : UNIVERSITY_COURSES;
  res.json(results);
});

// ---------------- ONLINE COURSE AGGREGATOR (placeholder data) ----------------
const ONLINE_COURSES = [
  { title: "Intro to Networking", provider: "Coursera", url: "https://www.coursera.org", skillTags: ["Networking"], isFree: true, level: "Beginner" },
  { title: "Python for Everybody", provider: "Coursera", url: "https://www.coursera.org", skillTags: ["Python"], isFree: true, level: "Beginner" },
  { title: "The Complete Web Developer", provider: "Udemy", url: "https://www.udemy.com", skillTags: ["React", "Node"], isFree: false, level: "Intermediate" },
];

app.get("/api/courses", (req, res) => {
  const { skill } = req.query;
  const results = skill
    ? ONLINE_COURSES.filter((c) => c.skillTags.some((t) => t.toLowerCase() === skill.toLowerCase()))
    : ONLINE_COURSES;
  res.json(results);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CareerVerse server running on port ${PORT}`);
});