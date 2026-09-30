const { getSuggestedSkillNames } = require("./skillsAnalyzer");
const { getPreCollegeSteps } = require("./studyStages");

const ROLE_ROADMAPS = {
  "cybersecurity analyst": [
    { title: "Learn networking & OS fundamentals", tasks: ["Understand TCP/IP, DNS, subnetting, and firewalls", "Get comfortable in Linux command line (files, permissions, processes)", "Set up a home lab using VirtualBox or VMware"], timeframeWeeks: 4 },
    { title: "Build core security knowledge", tasks: ["Learn the CIA triad, common attack types (phishing, malware, DDoS)", "Study OWASP Top 10 web vulnerabilities", "Take a free intro course (Coursera / Cybrary / TryHackMe)"], timeframeWeeks: 5 },
    { title: "Get hands-on with tools", tasks: ["Practice with Wireshark for packet analysis", "Try Nmap for network scanning", "Complete beginner rooms on TryHackMe or HackTheBox"], timeframeWeeks: 5 },
    { title: "Build one real security project", tasks: ["Build a log analyzer, vulnerability scanner, or secure exam portal", "Document your process and findings in a GitHub README", "Present it clearly — this becomes your interview talking point"], timeframeWeeks: 6 },
    { title: "Earn an entry-level certification", tasks: ["Study for CompTIA Security+ (most recognized entry cert)", "Use free practice tests to check readiness", "Schedule and take the exam"], timeframeWeeks: 8 },
    { title: "Apply and network", tasks: ["Apply to SOC Analyst / Security Intern roles", "Attend a cybersecurity meetup or CTF event", "Reach out to alumni in security roles for informational chats"], timeframeWeeks: 4 },
  ],
  "software engineer": [
    { title: "Master data structures & algorithms", tasks: ["Cover arrays, linked lists, trees, graphs, and hashmaps", "Practice on LeetCode / GeeksforGeeks daily", "Learn time/space complexity (Big O)"], timeframeWeeks: 6 },
    { title: "Learn a full stack (frontend + backend)", tasks: ["Pick one frontend framework (React) and one backend (Express/Django)", "Learn how a client-server request actually flows", "Understand REST API design basics"], timeframeWeeks: 6 },
    { title: "Learn databases", tasks: ["Learn SQL fundamentals (joins, indexes, queries)", "Try one NoSQL database (MongoDB)", "Understand when to use which"], timeframeWeeks: 3 },
    { title: "Build 2-3 full-stack projects", tasks: ["Include a real backend, database, and deployed frontend", "Push clean, documented code to GitHub", "Deploy at least one live (Render, Vercel, Railway)"], timeframeWeeks: 8 },
    { title: "Contribute to open source", tasks: ["Find beginner-friendly repos (good-first-issue label)", "Submit at least 2 real pull requests", "Respond to reviewer feedback professionally"], timeframeWeeks: 4 },
    { title: "Interview prep and applications", tasks: ["Practice mock technical interviews (timed)", "Prepare a clear story for each project", "Apply to 15-20 targeted internships"], timeframeWeeks: 5 },
  ],
  "data analyst": [
    { title: "Master Excel and spreadsheets", tasks: ["Pivot tables, VLOOKUP/XLOOKUP, conditional formatting", "Practice cleaning messy real-world datasets"], timeframeWeeks: 3 },
    { title: "Learn SQL deeply", tasks: ["Joins, subqueries, window functions", "Practice on Mode Analytics or LeetCode SQL problems"], timeframeWeeks: 4 },
    { title: "Learn Python for data", tasks: ["pandas for data manipulation", "matplotlib/seaborn for visualization"], timeframeWeeks: 5 },
    { title: "Learn a BI/visualization tool", tasks: ["Build 2-3 dashboards in Tableau or Power BI", "Practice telling a story with data, not just charts"], timeframeWeeks: 4 },
    { title: "Build a real analysis project", tasks: ["Pick a public dataset (Kaggle) and analyze it end-to-end", "Write up findings clearly with visuals", "Publish on GitHub / a portfolio site"], timeframeWeeks: 5 },
    { title: "Apply to internships", tasks: ["Target data/business analyst intern roles", "Prepare to walk through your project confidently"], timeframeWeeks: 4 },
  ],
  "data scientist": [
    { title: "Solidify statistics & probability", tasks: ["Distributions, hypothesis testing, regression", "Khan Academy or a stats course"], timeframeWeeks: 5 },
    { title: "Learn the Python data stack", tasks: ["pandas, numpy for data handling", "matplotlib/seaborn for visualization"], timeframeWeeks: 5 },
    { title: "Learn machine learning basics", tasks: ["Supervised vs unsupervised learning", "scikit-learn for classic ML models"], timeframeWeeks: 6 },
    { title: "Complete an end-to-end ML project", tasks: ["Go from raw data to a trained, evaluated model", "Deploy it or build a simple dashboard for it"], timeframeWeeks: 6 },
    { title: "Enter a Kaggle competition", tasks: ["Pick a beginner-friendly competition", "Document your approach and learnings publicly"], timeframeWeeks: 4 },
    { title: "Apply to data/ML internships", tasks: ["Target roles labeled entry-level or intern", "Be ready to explain your model choices clearly"], timeframeWeeks: 4 },
  ],
  "product manager": [
    { title: "Learn PM fundamentals", tasks: ["Prioritization frameworks (RICE, MoSCoW)", "User stories and roadmapping basics"], timeframeWeeks: 4 },
    { title: "Practice with real (or campus) projects", tasks: ["Lead or shadow a real project — CSI committee work counts", "Practice stakeholder communication"], timeframeWeeks: 5 },
    { title: "Get comfortable with data", tasks: ["Basic SQL to query metrics yourself", "Learn to read a dashboard critically, not just view it"], timeframeWeeks: 4 },
    { title: "Build a product case study", tasks: ["Pick a product, critique its UX and strategy", "Propose a redesign with clear reasoning"], timeframeWeeks: 5 },
    { title: "Sharpen communication & pitching", tasks: ["Practice explaining a decision in under 2 minutes", "Get comfortable with wireframing basics (Figma)"], timeframeWeeks: 4 },
    { title: "Apply to APM / PM internship programs", tasks: ["Many companies run dedicated intern tracks — track deadlines early"], timeframeWeeks: 4 },
  ],
  "finance analyst": [
    { title: "Learn financial statements cold", tasks: ["Income statement, balance sheet, cash flow", "Practice reading real company filings"], timeframeWeeks: 4 },
    { title: "Get fluent in Excel modeling", tasks: ["Build a DCF model from scratch", "Learn basic comps and LBO structure"], timeframeWeeks: 6 },
    { title: "Follow markets actively", tasks: ["Read a financial newsletter daily", "Form and track your own market opinions"], timeframeWeeks: 4 },
    { title: "Complete a valuation project", tasks: ["Pick a real public company", "Build a full model and defend your thesis in writing"], timeframeWeeks: 6 },
    { title: "Network with alumni in finance", tasks: ["Request informational interviews", "Ask specifically about their entry path, not just general advice"], timeframeWeeks: 4 },
    { title: "Apply to summer analyst programs", tasks: ["Deadlines are early — track them closely", "Tailor your resume per firm"], timeframeWeeks: 4 },
  ],
};

function genericRoadmapSteps(targetRole) {
  const skills = getSuggestedSkillNames(targetRole);
  return [
    { title: `Research what ${targetRole} actually does day-to-day`, tasks: ["Read 3-5 real job descriptions for this role", "Watch a 'day in the life' video if one exists", "Identify the top 3 skills that show up repeatedly"], timeframeWeeks: 2 },
    { title: `Build foundational skills for ${targetRole}`, tasks: skills.slice(0, 3).map((s) => `Learn/practice: ${s}`), timeframeWeeks: 6 },
    { title: "Build one real project or portfolio piece", tasks: [`Create something concrete that demonstrates ${targetRole} skills`, "Document it clearly (write-up, GitHub, or portfolio site)"], timeframeWeeks: 6 },
    { title: "Get a relevant certification or credential", tasks: ["Search for the most commonly requested entry-level certification", "Study and take it if it fits your timeline"], timeframeWeeks: 6 },
    { title: "Apply and network", tasks: [`Apply to entry-level / intern ${targetRole} roles`, "Reach out to 2-3 people already in this role for advice"], timeframeWeeks: 4 },
  ];
}

function findRoadmapMatch(input) {
  if (!input) return null;
  const key = input.trim().toLowerCase();
  if (ROLE_ROADMAPS[key]) return key;
  const found = Object.keys(ROLE_ROADMAPS).find((r) => r.includes(key) || key.includes(r));
  return found || null;
}

function getRoadmapSteps(targetRole, studyLevel) {
  const matchedKey = findRoadmapMatch(targetRole);
  const rawSteps = matchedKey ? ROLE_ROADMAPS[matchedKey] : genericRoadmapSteps(targetRole);
  const preSteps = getPreCollegeSteps(targetRole, studyLevel);
  const allRawSteps = [...preSteps, ...rawSteps];
  const steps = allRawSteps.map((s, i) => ({ step: i + 1, ...s }));
  return { steps, isGeneric: !matchedKey };
}

module.exports = { getRoadmapSteps };