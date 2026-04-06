import type { ATSResult } from "./storage";
import { STREAMS } from "./streamData";

// ============================================================
// Stream-specific section headings
// ============================================================
const STREAM_SECTIONS: Record<string, string[]> = {
  cse: ["Projects", "Skills", "GitHub", "Certifications"],
  mechanical: ["Internship", "Technical Skills", "Projects", "Tools"],
  electrical: ["Internship", "Technical Skills", "Projects", "Lab Work"],
  civil: ["Internship", "Technical Skills", "Projects", "Site Experience"],
  mba: ["Internship", "Leadership", "Achievements", "Skills"],
  medical: ["Clinical Training", "Research", "Skills", "Certifications"],
  commerce: ["Internship", "Skills", "Achievements", "Certifications"],
  arts: ["Portfolio", "Skills", "Projects", "Exhibitions"],
};

const FALLBACK_KEYWORDS = [
  "javascript",
  "python",
  "react",
  "node",
  "sql",
  "git",
  "api",
  "agile",
  "team",
  "project",
  "typescript",
  "css",
  "html",
  "database",
  "software",
];

// Map verbose stream labels (as stored in localStorage) to short keys
const LABEL_TO_KEY: Record<string, string> = {
  "computer science / it": "cse",
  "computer science": "cse",
  cse: "cse",
  it: "cse",
  "mechanical engineering": "mechanical",
  mechanical: "mechanical",
  "electrical engineering": "electrical",
  electrical: "electrical",
  "civil engineering": "civil",
  civil: "civil",
  "management / mba": "mba",
  management: "mba",
  mba: "mba",
  "medical / healthcare": "medical",
  medical: "medical",
  healthcare: "medical",
  "commerce / finance": "commerce",
  commerce: "commerce",
  finance: "commerce",
  "arts / design": "arts",
  arts: "arts",
  design: "arts",
};

// ============================================================
// ATS Scoring Engine — stream-aware
// ============================================================
export function analyzeResume(text: string, streamId?: string): ATSResult {
  const textLower = text.toLowerCase();
  let score = 0;
  const missingSections: string[] = [];
  const suggestions: string[] = [];

  // Universal sections (always checked, 30 pts)
  const universalPatterns: Array<[RegExp, string]> = [
    [/summary|objective|profile|about/i, "Summary/Objective"],
    [/education|academic|degree|university|college/i, "Education"],
    [/experience|work|employment|internship/i, "Work Experience"],
  ];

  // Resolve stream key from label or short id
  const streamKey = LABEL_TO_KEY[(streamId ?? "cse").toLowerCase()] ?? "cse";
  const streamDef = STREAMS[streamKey as keyof typeof STREAMS];

  // Get keywords from stream definition, fallback to CSE keywords
  const techKeywords: string[] = streamDef?.atsKeywords ?? FALLBACK_KEYWORDS;

  // Get stream sections (30 pts)
  const streamSections = STREAM_SECTIONS[streamKey] ?? STREAM_SECTIONS.cse;

  const streamSectionPatterns: Array<[RegExp, string]> = streamSections.map(
    (section) => [
      new RegExp(section.toLowerCase().replace(/[^a-z ]/g, ".*"), "i"),
      section,
    ],
  );

  // Check universal sections (30 pts)
  for (const [pattern, label] of universalPatterns) {
    if (pattern.test(textLower)) {
      score += 10;
    } else {
      missingSections.push(label);
      suggestions.push(`Add a "${label}" section to improve ATS parsing`);
    }
  }

  // Check stream-specific sections (30 pts)
  for (const [pattern, label] of streamSectionPatterns) {
    if (pattern.test(textLower)) {
      score += Math.floor(30 / streamSectionPatterns.length);
    } else {
      missingSections.push(label);
      suggestions.push(
        `Add a "${label}" section — important for ${streamDef?.label ?? "your field"} resumes`,
      );
    }
  }

  // Keyword density check (20 pts) — stream-specific keywords
  const foundKeywords = techKeywords.filter((k) =>
    textLower.includes(k.toLowerCase()),
  );
  const keywordScore = Math.floor(
    (foundKeywords.length / techKeywords.length) * 20,
  );
  score += keywordScore;

  const missingKeywords = techKeywords.filter(
    (k) => !textLower.includes(k.toLowerCase()),
  );
  const missingSkills = missingKeywords.slice(0, 6);

  // Length check (10 pts)
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 350) {
    score += 10;
  } else if (wordCount >= 180) {
    score += 5;
    suggestions.push(
      `Expand content to at least 350 words (currently ~${wordCount} words) for better ATS parsing`,
    );
  } else {
    suggestions.push(
      `Resume is too short (~${wordCount} words). Aim for 350–600 words.`,
    );
  }

  // Formatting cues (10 pts)
  let formatScore = 0;
  if (text.includes("@") && /\d{3}/.test(text)) formatScore += 5;
  if (/github\.com|linkedin\.com/.test(textLower)) {
    formatScore += 5;
  } else {
    suggestions.push(
      "Add GitHub and LinkedIn profile links for better credibility",
    );
  }
  score += Math.min(formatScore, 10);

  // Extra suggestions
  if (!/%|increased|improved|reduced|saved|grew/i.test(text)) {
    suggestions.push(
      'Add quantified achievements (e.g., "Improved performance by 40%", "Reduced costs by 20%")',
    );
  }
  if (
    !/\b(led|managed|designed|architected|implemented|deployed|developed|created)/i.test(
      text,
    )
  ) {
    suggestions.push(
      "Use strong action verbs: Led, Designed, Implemented, Developed, Managed",
    );
  }
  if (missingSections.length === 0 && score >= 70) {
    suggestions.push(
      "Great resume structure! Consider tailoring keywords to specific job descriptions.",
    );
  }

  return {
    score: Math.min(score, 100),
    missingSections,
    missingSkills,
    suggestions: suggestions.slice(0, 6),
    analyzedAt: new Date().toISOString(),
  };
}

// Keep legacy export alias so existing callers don't break
export const scoreResume = analyzeResume;

export function getScoreColor(score: number): string {
  if (score >= 80) return "#39D98A";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Needs Work";
}
