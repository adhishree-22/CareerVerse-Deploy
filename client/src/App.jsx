import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "https://careerverse-deploy.onrender.com";

const SKILL_POOL = ["Python", "Networking Basics", "Linux", "SQL", "Public Speaking", "Excel", "Git/GitHub", "Data Structures", "Statistics", "Communication", "Figma", "Financial Modeling"];
const STUDY_LEVELS = [
  "", "10th Grade or Below", "11th Grade", "12th Grade", "Diploma",
  "1st Year Degree", "2nd Year Degree", "3rd Year Degree", "Final Year Degree", "Graduate",
];
const TABS = ["Roadmap", "Skills Analyzer", "Open Source", "Tasks", "Projects", "Mentors", "Universities", "Courses"];
const STEP_COLORS = ["#f2a65a", "#3ed7c4", "#7c9eff", "#ff6f91", "#8de971", "#ffd166", "#c792ea"];

function RoleSearchInput({ value, onChange, roles, placeholder }) {
  return (
    <>
      <input
        type="text"
        list="role-options"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Type any role, e.g. Robotics Engineer"}
      />
      <datalist id="role-options">
        {roles.map((r) => <option key={r} value={r} />)}
      </datalist>
    </>
  );
}

function App() {
  const [tab, setTab] = useState("Roadmap");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/roles`).then((res) => setRoles(res.data)).catch(() => setRoles([]));
  }, []);

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="eyebrow">AI Career Operating System</div>
        <h1>Your career,<br /><span>mapped</span> like a route.</h1>
        <p className="sub">One platform for your roadmap, skills, tasks, and opportunities.</p>
      </header>

      <div className="wrap tab-bar">
        {TABS.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? "tab-active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="wrap">
        {tab === "Roadmap" && <RoadmapTab roles={roles} />}
        {tab === "Skills Analyzer" && <SkillsTab roles={roles} />}
        {tab === "Open Source" && <OpenSourceTab />}
        {tab === "Tasks" && <TasksTab />}
        {tab === "Projects" && <ProjectsTab roles={roles} />}
        {tab === "Mentors" && <PersonalitiesTab />}
        {tab === "Universities" && <UniversitiesTab />}
        {tab === "Courses" && <CoursesTab />}
      </div>

      <footer className="app-footer">CAREERVERSE // demo build</footer>
    </div>
  );
}

function RoadmapTab({ roles }) {
  const [name, setName] = useState("");
  const [targetCareer, setTargetCareer] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState(SKILL_POOL);
  const [customSkill, setCustomSkill] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [doneSteps, setDoneSteps] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) =>
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));

  const loadSuggestedSkills = async () => {
    if (!targetCareer.trim()) return;
    try {
      const res = await axios.get(`${API}/api/skills/suggested`, { params: { role: targetCareer } });
      setSuggestedSkills(res.data);
    } catch (err) {
      setSuggestedSkills(SKILL_POOL);
    }
  };

  const addCustomSkill = () => {
    if (!customSkill.trim()) return;
    setSuggestedSkills((prev) => [...prev, customSkill.trim()]);
    setSelectedSkills((prev) => [...prev, customSkill.trim()]);
    setCustomSkill("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetCareer.trim()) return alert("Enter a target career");
    setLoading(true);
    setDoneSteps(new Set());
    try {
      const res = await axios.post(`${API}/api/roadmap`, { name: name || "Student", currentSkills: selectedSkills, targetCareer, studyLevel });
      setRoadmap(res.data);
    } catch (err) {
      alert("Something went wrong.");
    }
    setLoading(false);
  };

  const toggleStepDone = (step) =>
    setDoneSteps((prev) => {
      const next = new Set(prev);
      next.has(step) ? next.delete(step) : next.add(step);
      return next;
    });

  const totalSteps = roadmap?.roadmap?.length || 0;
  const progressPct = totalSteps ? doneSteps.size / totalSteps : 0;
  const baseScore = roadmap?.profileScore || 0;
  const liveScore = roadmap ? Math.round(baseScore * 0.6 + progressPct * 100 * 0.4) : 0;

  return (
    <>
      <div className="card">
        <h2>Plot my route</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Dream career (type any role)</label>
            <RoleSearchInput value={targetCareer} onChange={setTargetCareer} roles={roles} />
            <button type="button" className="cta" style={{ marginTop: 10, padding: "8px 16px", fontSize: 13 }} onClick={loadSuggestedSkills}>
              Load skills for this role
            </button>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Current study level</label>
            <select value={studyLevel} onChange={(e) => setStudyLevel(e.target.value)}>
              {STUDY_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl || "Select your current level"}</option>
              ))}
            </select>
          </div>
          <label className="field-label">Current skills (tap to select)</label>
          <div className="skills-tags">
            {suggestedSkills.map((s) => (
              <div key={s} className={`tag ${selectedSkills.includes(s) ? "active" : ""}`} onClick={() => toggleSkill(s)}>{s}</div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 14, marginBottom: 0 }}>
            <input type="text" placeholder="Add a skill not listed above" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} />
            <button type="button" className="cta" style={{ padding: "10px 16px", fontSize: 13 }} onClick={addCustomSkill}>+ Add skill</button>
          </div>
          <button className="cta" type="submit" disabled={loading} style={{ marginTop: 20 }}>{loading ? "Plotting..." : "⚡ Generate Roadmap"}</button>
        </form>
      </div>

      {roadmap && (
        <div className="results-grid">
          <div className="score-box">
            <div className="label">Profile Readiness</div>
            <div className="score-num">{liveScore}<span>/100</span></div>
          </div>
          <div className="route-card">
            <h3>Route to: {roadmap.targetCareer}</h3>
            <div className="zigzag-route">
              {roadmap.roadmap.map((step, i) => {
                const isDone = doneSteps.has(step.step);
                const color = STEP_COLORS[i % STEP_COLORS.length];
                const side = i % 2 === 0 ? "align-left" : "align-right";
                return (
                  <div className={`zigzag-item ${side}`} key={step.step}>
                    <div
                      className={`zigzag-node ${isDone ? "done" : ""}`}
                      style={{ background: color }}
                      onClick={() => toggleStepDone(step.step)}
                    >
                      {step.step}
                    </div>
                    <div className={`zigzag-card ${isDone ? "done" : ""}`} style={{ borderTopColor: color }}>
                      <div className="zigzag-title">{step.title}</div>
                      <div className="zigzag-duration" style={{ color }}>
                        {step.duration || `${step.timeframeWeeks} WEEKS`}
                      </div>
                      <div className="zigzag-desc">{step.tasks.join(" • ")}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SkillsTab({ roles }) {
  const [targetRole, setTargetRole] = useState("");
  const [skillLevels, setSkillLevels] = useState({});
  const [report, setReport] = useState(null);

  const setLevel = (name, level) => setSkillLevels((prev) => ({ ...prev, [name]: level }));

  const analyze = async () => {
    if (!targetRole.trim()) return alert("Enter a target role");
    const skills = Object.entries(skillLevels).map(([name, level]) => ({ name, level }));
    try {
      const res = await axios.post(`${API}/api/skills/analyze`, { targetRole, skills });
      setReport(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Error analyzing skills");
    }
  };

  return (
    <div className="card">
      <h2>Skills Gap Analyzer</h2>
      <label className="field-label">Target role (type any role)</label>
      <div style={{ marginBottom: 20 }}>
        <RoleSearchInput value={targetRole} onChange={setTargetRole} roles={roles} />
      </div>

      {report && (
        <p className="hint" style={{ marginBottom: 12 }}>
          {report.isGeneric
            ? "No curated data for this exact role yet — showing a generic skill template."
            : "Showing curated skill requirements for this role."}
        </p>
      )}

      {report ? (
        <>
          {report.skills.map((s) => (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <label className="field-label">{s.name} (0-5)</label>
              <input type="text" placeholder="0" onChange={(e) => setLevel(s.name, Number(e.target.value) || 0)} />
            </div>
          ))}
        </>
      ) : (
        <p className="hint">Enter a role above, click Analyze once to load the skill list, then rate yourself and analyze again.</p>
      )}

      <button className="cta" onClick={analyze}>Analyze Gap</button>

      {report && (
        <div className="route-card" style={{ marginTop: 24 }}>
          {report.skills.map((s) => (
            <div key={s.name} style={{ marginBottom: 14 }}>
              <div className="milestone-title">{s.name}</div>
              <div className="milestone-desc">Current: {s.currentLevel} / Required: {s.requiredLevel} — Gap: {s.gap}</div>
              <a href={s.resource} target="_blank" rel="noreferrer" style={{ color: "var(--teal)", fontSize: 13 }}>Resource →</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OpenSourceTab() {
  const [language, setLanguage] = useState("javascript");
  const [label, setLabel] = useState("good first issue");
  const [results, setResults] = useState([]);
  const [savedIssues, setSavedIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const DIFFICULTIES = [
    { value: "good first issue", label: "Beginner" },
    { value: "help wanted", label: "Intermediate" },
    { value: "bug", label: "Bug Fixing" },
  ];

  const loadSaved = async () => {
    const res = await axios.get(`${API}/api/opensource/saved`);
    setSavedIssues(res.data);
  };

  useEffect(() => { loadSaved(); }, []);

  const search = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(`${API}/api/opensource`, { params: { language, label, sort: "newest" } });
      setResults(res.data.results || []);
    } catch (err) {
      alert("Error fetching from GitHub");
    }
    setLoading(false);
  };

  const saveIssue = async (r) => {
    await axios.post(`${API}/api/opensource/saved`, {
      title: r.title, url: r.url, repo: r.repo, language: r.language, label: r.label, comments: r.comments, stars: r.stars
    });
    loadSaved();
  };

  const removeSaved = async (id) => {
    await axios.delete(`${API}/api/opensource/saved/${id}`);
    loadSaved();
  };

  const isSaved = (url) => savedIssues.some((s) => s.url === url);

  return (
    <div className="card">
      <h2>Open Source Finder</h2>
      <p className="hint">Find real, beginner-friendly issues to practice on and add to your portfolio.</p>

      <div style={{ marginTop: 16, marginBottom: 14 }}>
        <label className="field-label">Language you know</label>
        <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. python, javascript" />
      </div>

      <label className="field-label">Difficulty</label>
      <div className="skills-tags" style={{ marginBottom: 20 }}>
        {DIFFICULTIES.map((d) => (
          <div key={d.value} className={`tag ${label === d.value ? "active" : ""}`} onClick={() => setLabel(d.value)}>
            {d.label}
          </div>
        ))}
      </div>

      <button className="cta" onClick={search} disabled={loading}>{loading ? "Searching..." : "Find Issues"}</button>

      {searched && !loading && results.length === 0 && (
        <p className="hint" style={{ marginTop: 16 }}>No issues found — try a different language or difficulty.</p>
      )}

      <div className="animate-in" style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div key={i} className="route-card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 10 }}>
              <div>
                <a href={r.url} target="_blank" rel="noreferrer" className="milestone-title" style={{ color: "var(--ink)" }}>{r.title}</a>
                <div className="milestone-desc">
                  {r.repo} {r.stars !== null && `· ⭐ ${r.stars}`}
                </div>
              </div>
              <button
                className="cta"
                style={{ padding: "6px 12px", fontSize: 12, whiteSpace: "nowrap" }}
                onClick={() => saveIssue(r)}
                disabled={isSaved(r.url)}
              >
                {isSaved(r.url) ? "✓" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {savedIssues.length > 0 && (
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
          <h2 style={{ marginBottom: 12 }}>Saved Issues</h2>
          {savedIssues.map((s) => (
            <div key={s._id} className="route-card" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 10 }}>
                <div>
                  <a href={s.url} target="_blank" rel="noreferrer" className="milestone-title" style={{ color: "var(--ink)" }}>{s.title}</a>
                  <div className="milestone-desc">{s.repo}</div>
                </div>
                <span onClick={() => removeSaved(s._id)} style={{ fontSize: 12, color: "var(--ink-dim)", cursor: "pointer" }}>✕</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TasksTab() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("personal");
  const [filter, setFilter] = useState("");

  const loadTasks = async () => {
    const res = await axios.get(`${API}/api/tasks`, { params: filter ? { category: filter } : {} });
    setTasks(res.data);
  };

  useEffect(() => { loadTasks(); }, [filter]);

  const addTask = async () => {
    if (!title) return;
    await axios.post(`${API}/api/tasks`, { title, category, status: "todo" });
    setTitle("");
    loadTasks();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/api/tasks/${id}`, { status });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/api/tasks/${id}`);
    loadTasks();
  };

  const columns = ["todo", "in-progress", "done"];

  return (
    <div className="card">
      <h2>To-Do Tracker</h2>
      <div className="row">
        <input type="text" placeholder="New task" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="project">Project</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
      </div>
      <button className="cta" onClick={addTask}>Add Task</button>

      <div className="skills-tags" style={{ marginTop: 20 }}>
        {["", "project", "work", "personal"].map((c) => (
          <div key={c} className={`tag ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c || "All"}</div>
        ))}
      </div>

      <div className="results-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", marginTop: 20 }}>
        {columns.map((col) => (
          <div key={col} className="route-card">
            <h3 style={{ textTransform: "capitalize" }}>{col.replace("-", " ")}</h3>
            {tasks.filter((t) => t.status === col).map((t) => (
              <div key={t._id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
                <div className="milestone-title">{t.title}</div>
                <div className="milestone-desc">{t.category}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  {columns.filter((c) => c !== col).map((c) => (
                    <span key={c} onClick={() => updateStatus(t._id, c)} style={{ fontSize: 11, color: "var(--gold)", cursor: "pointer" }}>→ {c}</span>
                  ))}
                  <span onClick={() => deleteTask(t._id)} style={{ fontSize: 11, color: "var(--ink-dim)", cursor: "pointer" }}>✕</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsTab({ roles }) {
  const [targetRole, setTargetRole] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = async () => {
    if (!targetRole.trim()) return alert("Enter a target role");
    const res = await axios.post(`${API}/api/projects/suggestions`, { targetRole });
    setSuggestions(res.data.suggestions);
  };

  const saveProject = async (s) => {
    await axios.post(`${API}/api/projects`, {
      title: s.title,
      description: s.description,
      targetRole,
      milestones: s.milestones.map((m) => ({ title: m, done: false }))
    });
    alert("Saved to your projects!");
  };

  return (
    <div className="card">
      <h2>Project Builder</h2>
      <label className="field-label">Target role (type any role)</label>
      <div style={{ marginBottom: 16 }}>
        <RoleSearchInput value={targetRole} onChange={setTargetRole} roles={roles} />
      </div>
      <button className="cta" onClick={getSuggestions}>Suggest Projects</button>

      {suggestions.map((s, i) => (
        <div key={i} className="route-card" style={{ marginTop: 16 }}>
          <h3>{s.title}</h3>
          <p className="sub2">{s.description}</p>
          <ul style={{ color: "var(--ink-dim)", fontSize: 13.5, paddingLeft: 18 }}>
            {s.milestones.map((m, j) => <li key={j}>{m}</li>)}
          </ul>
          <button className="cta" style={{ marginTop: 10 }} onClick={() => saveProject(s)}>Save This Project</button>
        </div>
      ))}
    </div>
  );
}

function PersonalitiesTab() {
  const [videoQuery, setVideoQuery] = useState("");

  const videoChannels = [
    { title: "Centre for Career Development", desc: "India-focused: universities, admissions, career paths abroad and at home", url: "https://www.youtube.com/@chawlajitin/videos" },
    { title: "Linda Raynier", desc: "Job search strategy and interview advice", url: "https://www.youtube.com/@LindaRaynier" },
    { title: "Traversy Media", desc: "Learn real tech skills — web dev crash courses", url: "https://www.youtube.com/@TraversyMedia" },
    { title: "3Blue1Brown", desc: "Visual, intuitive math — great for data/engineering paths", url: "https://www.youtube.com/@3blue1brown" },
    { title: "How to Choose the Right Stream After 10th", desc: "Science vs Commerce vs Arts — breaks down how each stream works and how to decide", url: "https://www.youtube.com/watch?v=pyNw6DmA89I" },
  ];

  return (
    <div className="card">
      <h2>Career Guidance Videos</h2>
      <p className="hint">Curated channels, plus a live search for anything specific.</p>

      <div className="row" style={{ marginTop: 16 }}>
        <input
          type="text"
          placeholder="Search any topic on YouTube (e.g. cybersecurity career)"
          value={videoQuery}
          onChange={(e) => setVideoQuery(e.target.value)}
        />
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(videoQuery + " career guidance")}`}
          target="_blank"
          rel="noreferrer"
          className="cta"
          style={{ textDecoration: "none", textAlign: "center" }}
        >
          Search →
        </a>
      </div>

      <div className="results-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 20 }}>
        {videoChannels.map((v, i) => (
          <a key={i} href={v.url} target="_blank" rel="noreferrer" className="route-card video-link-card">
            <div className="video-link-header">
              <div className="video-play-icon">▶</div>
              <div className="milestone-title" style={{ color: "var(--ink)" }}>{v.title}</div>
            </div>
            <div className="milestone-desc">{v.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function UniversitiesTab() {
  const [query, setQuery] = useState("");
  const [searchedFor, setSearchedFor] = useState("");

  const search = () => {
    if (!query.trim()) return;
    setSearchedFor(query);
  };

  return (
    <div className="card">
      <h2>University Course Finder</h2>
      <p className="hint">Type any field (e.g. Marketing, Cybersecurity) — you'll get real search links for universities and eligibility criteria worldwide.</p>
      <input type="text" placeholder="Search a field or course..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <button className="cta" onClick={search}>Search</button>

      {searchedFor && (
        <div className="animate-in" style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          <p className="hint" style={{ marginBottom: 10 }}>
            Find universities and eligibility criteria for "{searchedFor}":
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(searchedFor + " universities eligibility criteria")}`}
              target="_blank"
              rel="noreferrer"
              className="cta"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              Search Universities →
            </a>
            <a
              href="https://www.bachelorsportal.com"
              target="_blank"
              rel="noreferrer"
              className="cta"
              style={{
                display: "inline-block",
                textDecoration: "none",
                background: "transparent",
                color: "var(--teal)",
                border: "2px solid var(--teal)",
              }}
            >
              Browse Bachelorsportal →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function CoursesTab() {
  const [skill, setSkill] = useState("");
  const [results, setResults] = useState([]);
  const [searchedFor, setSearchedFor] = useState("");

  const search = async () => {
    const res = await axios.get(`${API}/api/courses`, { params: skill ? { skill } : {} });
    setResults(res.data);
    setSearchedFor(skill);
  };

  useEffect(() => { search(); }, []);

  return (
    <div className="card">
      <h2>Online Course Aggregator</h2>
      <p className="hint">Type any course or skill — you'll always get a real search link, even if it's not in our sample picks below.</p>
      <input type="text" placeholder="Skill or course (e.g. Cybersecurity, Python, UI Design)" value={skill} onChange={(e) => setSkill(e.target.value)} />
      <button className="cta" onClick={search}>Search</button>

      {searchedFor && (
        <div className="animate-in" style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          <p className="hint" style={{ marginBottom: 10 }}>
            Search "{searchedFor}" directly on:
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={`https://www.classcentral.com/search?q=${encodeURIComponent(searchedFor)}`}
              target="_blank"
              rel="noreferrer"
              className="cta"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              Class Central →
            </a>
            <a
              href={`https://www.coursera.org/search?query=${encodeURIComponent(searchedFor)}`}
              target="_blank"
              rel="noreferrer"
              className="cta"
              style={{
                display: "inline-block",
                textDecoration: "none",
                background: "transparent",
                color: "var(--teal)",
                border: "2px solid var(--teal)",
              }}
            >
              Coursera →
            </a>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="animate-in" style={{ marginTop: 24 }}>
          <p className="hint" style={{ marginBottom: 10 }}>Curated picks from our sample list:</p>
          {results.map((c, i) => (
            <div key={i} className="milestone" style={{ display: "block", marginTop: 12 }}>
              <a href={c.url} target="_blank" rel="noreferrer" className="milestone-title" style={{ color: "var(--ink)" }}>{c.title}</a>
              <div className="milestone-desc">{c.provider} — {c.isFree ? "Free" : "Paid"} — {c.level}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
