const ROLE_STREAM_MAP = {
  "cybersecurity analyst": { stream: "Science (PCM)", exams: "JEE Main / state CET for BSc IT, BTech CS, or BCA", subjects: ["Mathematics", "Computer Science (if offered)", "Physics"] },
  "software engineer": { stream: "Science (PCM)", exams: "JEE Main / state CET for BTech CS or BCA", subjects: ["Mathematics", "Computer Science (if offered)", "Physics"] },
  "data analyst": { stream: "Science (PCM) or Commerce (with Maths)", exams: "JEE Main / state CET, or CUET for BSc Stats/Economics", subjects: ["Mathematics", "Statistics/Economics", "Computer basics"] },
  "data scientist": { stream: "Science (PCM)", exams: "JEE Main / state CET for BTech CS, Data Science, or Stats", subjects: ["Mathematics", "Computer Science (if offered)", "Statistics"] },
  "product manager": { stream: "Any (Science, Commerce, or Arts)", exams: "Depends on chosen degree — often BTech, BBA, or BA Economics", subjects: ["Mathematics", "Economics/Business Studies", "English/Communication"] },
  "finance analyst": { stream: "Commerce (with Maths preferred)", exams: "CUET / state CET for BCom, BBA, or BMS", subjects: ["Accountancy", "Business Studies", "Mathematics/Economics"] },
  "ux/ui designer": { stream: "Any (Science, Commerce, or Arts)", exams: "NID/UCEED for design colleges, or CUET for BDes", subjects: ["Art/Design (if offered)", "Mathematics or Economics", "English"] },
  "digital marketer": { stream: "Commerce or Arts", exams: "CUET for BBA, BMS, or Mass Communication", subjects: ["Business Studies", "Economics", "English/Communication"] },
  "mechanical engineer": { stream: "Science (PCM)", exams: "JEE Main/Advanced for BTech Mechanical", subjects: ["Mathematics", "Physics", "Chemistry"] },
  "civil engineer": { stream: "Science (PCM)", exams: "JEE Main for BTech Civil", subjects: ["Mathematics", "Physics", "Chemistry"] },
  "electrical engineer": { stream: "Science (PCM)", exams: "JEE Main for BTech Electrical/Electronics", subjects: ["Mathematics", "Physics", "Chemistry"] },
  "business analyst": { stream: "Commerce (with Maths) or Science (PCM)", exams: "CUET for BBA/BCom, or JEE for BTech + MBA later", subjects: ["Mathematics", "Business Studies/Economics", "English"] },
  "content writer": { stream: "Arts/Humanities or Commerce", exams: "CUET for BA English, Journalism, or Mass Communication", subjects: ["English", "Any language subject", "Social Science"] },
};

const DEFAULT_STREAM = { stream: "Science (PCM) or Commerce, depending on the exact role", exams: "Research entrance exams specific to your target degree once decided", subjects: ["Mathematics", "English/Communication", "A subject closely tied to your target field"] };

function getStreamInfo(targetRole) {
  const key = (targetRole || "").trim().toLowerCase();
  const found = Object.keys(ROLE_STREAM_MAP).find((r) => r.includes(key) || key.includes(r));
  return found ? ROLE_STREAM_MAP[found] : DEFAULT_STREAM;
}

function getPreCollegeSteps(targetRole, studyLevel) {
  if (!studyLevel) return [];
  const level = studyLevel.trim().toLowerCase();
  const info = getStreamInfo(targetRole);

  if (level.includes("10th")) {
    return [
      {
        title: `Choose your 11th/12th stream for ${targetRole}`,
        tasks: [
          `Recommended stream: ${info.stream}`,
          `Focus on strengthening: ${info.subjects.join(", ")}`,
          `Entrance exams to research early: ${info.exams}`,
        ],
        duration: "Decide before starting 11th grade",
      },
    ];
  }

  if (level.includes("11th") || level.includes("12th")) {
    return [
      {
        title: `Make the most of 11th-12th for ${targetRole}`,
        tasks: [
          `Ideal stream for this path: ${info.stream}`,
          `Prioritize: ${info.subjects.join(", ")}`,
          `Start preparing for: ${info.exams}`,
          "Use this time to explore free beginner content in your target field (YouTube, free courses) — don't wait for college to start exploring",
        ],
        duration: "Throughout 11th-12th grade",
      },
    ];
  }

  return [];
}

module.exports = { getPreCollegeSteps };