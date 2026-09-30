const ROLE_SKILLS = {
  "cybersecurity analyst": [
    { name: "Networking Fundamentals", requiredLevel: 4, resource: "https://www.coursera.org/learn/computer-networking" },
    { name: "Linux / Command Line", requiredLevel: 4, resource: "https://linuxjourney.com/" },
    { name: "Security Basics (CIA Triad, Threats)", requiredLevel: 4, resource: "https://www.coursera.org/learn/cyber-security-basics" },
    { name: "Python Scripting", requiredLevel: 3, resource: "https://www.learnpython.org/" },
    { name: "Cloud Basics (AWS/Azure)", requiredLevel: 3, resource: "https://aws.amazon.com/training/" },
  ],
  "software engineer": [
    { name: "Data Structures & Algorithms", requiredLevel: 4, resource: "https://www.geeksforgeeks.org/data-structures/" },
    { name: "Git & Version Control", requiredLevel: 4, resource: "https://learngitbranching.js.org/" },
    { name: "One Backend Framework", requiredLevel: 3, resource: "https://expressjs.com/" },
    { name: "Databases (SQL/NoSQL)", requiredLevel: 3, resource: "https://www.mongodb.com/docs/manual/tutorial/" },
    { name: "System Design Basics", requiredLevel: 2, resource: "https://github.com/donnemartin/system-design-primer" },
  ],
  "data analyst": [
    { name: "SQL", requiredLevel: 4, resource: "https://mode.com/sql-tutorial/" },
    { name: "Excel / Spreadsheets", requiredLevel: 4, resource: "https://exceljet.net/" },
    { name: "Python for Data (pandas)", requiredLevel: 3, resource: "https://pandas.pydata.org/docs/getting_started/index.html" },
    { name: "Data Visualization", requiredLevel: 3, resource: "https://www.tableau.com/learn/training" },
    { name: "Statistics Basics", requiredLevel: 3, resource: "https://www.khanacademy.org/math/statistics-probability" },
  ],
  "data scientist": [
    { name: "Statistics & Probability", requiredLevel: 4, resource: "https://www.khanacademy.org/math/statistics-probability" },
    { name: "Python (pandas, numpy)", requiredLevel: 4, resource: "https://pandas.pydata.org/docs/getting_started/index.html" },
    { name: "Machine Learning Basics", requiredLevel: 3, resource: "https://www.coursera.org/learn/machine-learning" },
    { name: "SQL", requiredLevel: 3, resource: "https://mode.com/sql-tutorial/" },
    { name: "Data Visualization", requiredLevel: 3, resource: "https://www.tableau.com/learn/training" },
  ],
  "product manager": [
    { name: "Prioritization Frameworks", requiredLevel: 3, resource: "https://www.productplan.com/glossary/prioritization-framework/" },
    { name: "Communication & Stakeholder Mgmt", requiredLevel: 4, resource: "https://www.coursera.org/learn/wharton-communication-skills" },
    { name: "Basic SQL / Data Reading", requiredLevel: 2, resource: "https://mode.com/sql-tutorial/" },
    { name: "Wireframing (Figma)", requiredLevel: 2, resource: "https://www.figma.com/resources/learn-design/" },
    { name: "Market/User Research", requiredLevel: 3, resource: "https://www.nngroup.com/articles/which-ux-research-methods/" },
  ],
  "finance analyst": [
    { name: "Financial Statement Analysis", requiredLevel: 4, resource: "https://corporatefinanceinstitute.com/resources/accounting/" },
    { name: "Excel Modeling", requiredLevel: 4, resource: "https://corporatefinanceinstitute.com/resources/excel/" },
    { name: "Valuation Basics (DCF, Comps)", requiredLevel: 3, resource: "https://corporatefinanceinstitute.com/resources/valuation/" },
    { name: "Market Awareness", requiredLevel: 2, resource: "https://www.investopedia.com/" },
    { name: "Communication / Pitching", requiredLevel: 3, resource: "https://www.coursera.org/learn/wharton-communication-skills" },
  ],
  "ux/ui designer": [
    { name: "Figma / Design Tools", requiredLevel: 4, resource: "https://www.figma.com/resources/learn-design/" },
    { name: "User Research Basics", requiredLevel: 3, resource: "https://www.nngroup.com/articles/which-ux-research-methods/" },
    { name: "Wireframing & Prototyping", requiredLevel: 4, resource: "https://www.interaction-design.org/literature/topics/prototyping" },
    { name: "Design Systems", requiredLevel: 2, resource: "https://www.designsystems.com/" },
    { name: "Basic HTML/CSS", requiredLevel: 2, resource: "https://www.freecodecamp.org/" },
  ],
  "digital marketer": [
    { name: "SEO Basics", requiredLevel: 3, resource: "https://moz.com/beginners-guide-to-seo" },
    { name: "Social Media Strategy", requiredLevel: 3, resource: "https://blog.hootsuite.com/" },
    { name: "Analytics (Google Analytics)", requiredLevel: 3, resource: "https://skillshop.exceedlms.com/student/catalog" },
    { name: "Content Writing", requiredLevel: 3, resource: "https://copyblogger.com/blog/" },
    { name: "Basic Ad Platforms (Meta/Google Ads)", requiredLevel: 2, resource: "https://skillshop.exceedlms.com/student/catalog" },
  ],
  "mechanical engineer": [
    { name: "CAD (SolidWorks/AutoCAD)", requiredLevel: 4, resource: "https://www.solidworks.com/how-buy/free-trial" },
    { name: "Thermodynamics", requiredLevel: 3, resource: "https://ocw.mit.edu/" },
    { name: "Materials Science Basics", requiredLevel: 3, resource: "https://ocw.mit.edu/" },
    { name: "Manufacturing Processes", requiredLevel: 3, resource: "https://ocw.mit.edu/" },
    { name: "MATLAB / Simulation Tools", requiredLevel: 2, resource: "https://matlabacademy.mathworks.com/" },
  ],
  "civil engineer": [
    { name: "Structural Analysis Basics", requiredLevel: 4, resource: "https://ocw.mit.edu/" },
    { name: "AutoCAD / Civil 3D", requiredLevel: 3, resource: "https://www.autodesk.com/certification/learn" },
    { name: "Construction Materials", requiredLevel: 3, resource: "https://ocw.mit.edu/" },
    { name: "Project Management Basics", requiredLevel: 2, resource: "https://www.pmi.org/" },
    { name: "Surveying Fundamentals", requiredLevel: 2, resource: "https://ocw.mit.edu/" },
  ],
  "business analyst": [
    { name: "Requirements Gathering", requiredLevel: 4, resource: "https://www.iiba.org/" },
    { name: "SQL", requiredLevel: 3, resource: "https://mode.com/sql-tutorial/" },
    { name: "Excel / Data Analysis", requiredLevel: 4, resource: "https://exceljet.net/" },
    { name: "Process Mapping", requiredLevel: 3, resource: "https://www.lucidchart.com/pages/process-mapping" },
    { name: "Stakeholder Communication", requiredLevel: 3, resource: "https://www.coursera.org/learn/wharton-communication-skills" },
  ],
  "content writer": [
    { name: "Writing Clarity & Structure", requiredLevel: 4, resource: "https://www.grammarly.com/blog/" },
    { name: "SEO Writing Basics", requiredLevel: 3, resource: "https://moz.com/beginners-guide-to-seo" },
    { name: "Research Skills", requiredLevel: 3, resource: "https://www.coursera.org/" },
    { name: "Editing / Proofreading", requiredLevel: 3, resource: "https://www.grammarly.com/blog/" },
    { name: "Basic CMS (WordPress etc.)", requiredLevel: 2, resource: "https://learn.wordpress.org/" },
  ],
};

const KNOWN_ROLES = [
  "Cybersecurity Analyst", "Software Engineer", "Data Analyst", "Data Scientist",
  "Product Manager", "Finance Analyst", "UX/UI Designer", "Digital Marketer",
  "Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Business Analyst",
  "Content Writer", "HR Analyst", "Sales Executive", "Teacher", "Journalist",
  "Graphic Designer", "DevOps Engineer", "Cloud Engineer", "AI/ML Engineer",
  "Financial Analyst", "Operations Manager", "Consultant",
];

function findRoleMatch(input) {
  if (!input) return null;
  const key = input.trim().toLowerCase();
  if (ROLE_SKILLS[key]) return key;
  const found = Object.keys(ROLE_SKILLS).find((r) => r.includes(key) || key.includes(r));
  return found || null;
}

function genericSkillTemplate(targetRole) {
  return [
    { name: `Core technical skill for ${targetRole}`, requiredLevel: 4, resource: `https://www.google.com/search?q=core+skills+for+${encodeURIComponent(targetRole)}` },
    { name: "Industry-standard tools", requiredLevel: 3, resource: `https://www.google.com/search?q=tools+used+by+${encodeURIComponent(targetRole)}` },
    { name: "Communication & collaboration", requiredLevel: 3, resource: "https://www.coursera.org/learn/wharton-communication-skills" },
    { name: "One real project or portfolio piece", requiredLevel: 3, resource: `https://www.google.com/search?q=${encodeURIComponent(targetRole)}+portfolio+project+ideas` },
    { name: "Relevant certification or credential", requiredLevel: 2, resource: `https://www.google.com/search?q=${encodeURIComponent(targetRole)}+entry+level+certification` },
  ];
}

function analyzeSkillGap(targetRole, selfRatedSkills) {
  const matchedKey = findRoleMatch(targetRole);
  const requirements = matchedKey ? ROLE_SKILLS[matchedKey] : genericSkillTemplate(targetRole);
  const isGeneric = !matchedKey;

  const skillMap = {};
  (selfRatedSkills || []).forEach((s) => {
    skillMap[s.name.trim().toLowerCase()] = s.level;
  });

  const report = requirements.map((req) => {
    const currentLevel = skillMap[req.name.trim().toLowerCase()] || 0;
    return {
      name: req.name,
      currentLevel,
      requiredLevel: req.requiredLevel,
      gap: Math.max(req.requiredLevel - currentLevel, 0),
      resource: req.resource,
    };
  });

  return { targetRole, isGeneric, skills: report };
}

function getSuggestedSkillNames(targetRole) {
  const matchedKey = findRoleMatch(targetRole);
  if (matchedKey) {
    return ROLE_SKILLS[matchedKey].map((s) => s.name);
  }
  return genericSkillTemplate(targetRole).map((s) => s.name);
}

function computeProfileScore(targetRole, currentSkills) {
  const names = getSuggestedSkillNames(targetRole);
  const owned = (currentSkills || []).map((s) => s.trim().toLowerCase());

  const missing = [];
  let matchedCount = 0;

  names.forEach((reqName) => {
    const reqLower = reqName.trim().toLowerCase();
    const isOwned = owned.some((o) => reqLower.includes(o) || o.includes(reqLower));
    if (isOwned) {
      matchedCount++;
    } else {
      missing.push(reqName);
    }
  });

  const score = names.length ? Math.round((matchedCount / names.length) * 100) : 0;
  return { score, missing };
}

module.exports = { analyzeSkillGap, KNOWN_ROLES, getSuggestedSkillNames, computeProfileScore };