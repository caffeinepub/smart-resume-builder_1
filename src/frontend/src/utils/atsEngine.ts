import type { ATSResult } from "./storage";

// ============================================================
// ATS Scoring Engine
// ============================================================
export function scoreResume(text: string): ATSResult {
  const textLower = text.toLowerCase();
  let score = 0;
  const missingSections: string[] = [];
  const suggestions: string[] = [];

  // Section checks (10 pts each, max 60)
  const sectionPatterns: Array<[RegExp, string]> = [
    [/summary|objective|profile|about/i, "Summary/Objective"],
    [/education|academic|degree|university|college/i, "Education"],
    [/experience|work|employment|internship/i, "Work Experience"],
    [/skills|technologies|tech stack|technical/i, "Skills"],
    [/project|portfolio|built|developed/i, "Projects"],
    [/certif|certificate|course|training/i, "Certifications"],
  ];

  for (const [pattern, label] of sectionPatterns) {
    if (pattern.test(textLower)) {
      score += 10;
    } else {
      missingSections.push(label);
      suggestions.push(`Add a "${label}" section to improve ATS parsing`);
    }
  }

  // Keyword density check (20 pts)
  const techKeywords = [
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
  const foundKeywords = techKeywords.filter((k) => textLower.includes(k));
  const keywordScore = Math.floor(
    (foundKeywords.length / techKeywords.length) * 20,
  );
  score += keywordScore;

  const missingKeywords = techKeywords.filter((k) => !textLower.includes(k));
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
      'Add quantified achievements (e.g., "Improved performance by 40%", "Reduced load time by 2s")',
    );
  }
  if (
    !/\b(led|managed|designed|architected|implemented|deployed)/i.test(text)
  ) {
    suggestions.push(
      "Use strong action verbs: Led, Designed, Implemented, Architected, Deployed",
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
