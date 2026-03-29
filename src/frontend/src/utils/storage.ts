import { getUserKey } from "./auth";
// ============================================================
// TypeScript types
// ============================================================
export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Experience {
  company: string;
  position: string;
  startYear: string;
  endYear: string;
  responsibilities: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  education: Education[];
  skills: string[];
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
  profilePhoto?: string;
  linkedinUrl?: string;
}

export interface ATSResult {
  score: number;
  missingSections: string[];
  missingSkills: string[];
  suggestions: string[];
  analyzedAt?: string;
}

export interface CareerProfile {
  targetRole: string;
  completedSteps: string[];
  readinessScore: number;
  learningPlan: string[];
}

// ============================================================
// Sample data
// ============================================================
export const sampleResume: ResumeData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1-555-0123",
  linkedinUrl: "https://linkedin.com/in/alexjohnson",
  profilePhoto: "",
  summary:
    "Passionate frontend developer student with 2+ years of hands-on experience building modern web applications using React and TypeScript. Strong understanding of UI/UX principles and modern web technologies. Proven ability to collaborate in agile teams and deliver high-quality, scalable solutions.",
  education: [
    {
      institution: "State University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startYear: "2021",
      endYear: "2025",
    },
  ],
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "TypeScript",
    "Git",
    "Node.js",
    "Tailwind CSS",
  ],
  projects: [
    {
      name: "E-Commerce Dashboard",
      description:
        "Built a responsive React dashboard with real-time data visualization and interactive charts. Improved load time by 40% through code splitting and lazy loading.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Recharts"],
    },
    {
      name: "Weather Forecast App",
      description:
        "A weather application using OpenWeather API with 7-day forecasts, geolocation support, and animated weather icons.",
      technologies: ["JavaScript", "HTML", "CSS", "REST API"],
    },
    {
      name: "Task Management System",
      description:
        "Full-stack task manager with drag-and-drop, user authentication, and real-time collaboration features.",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
    },
  ],
  experience: [
    {
      company: "TechStartup Inc",
      position: "Frontend Developer Intern",
      startYear: "2023",
      endYear: "2024",
      responsibilities: [
        "Built 15+ reusable React components improving development velocity by 30%",
        "Improved page load speed by 40% through performance optimization",
        "Collaborated with design team using Figma to implement pixel-perfect UIs",
        "Participated in daily standups and sprint planning in agile environment",
      ],
    },
  ],
  certifications: [
    {
      name: "Meta React Developer Certificate",
      issuer: "Meta / Coursera",
      year: "2023",
    },
    {
      name: "JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      year: "2022",
    },
  ],
};

const _sampleCareerProfile: CareerProfile = {
  targetRole: "Frontend Developer",
  completedSteps: [
    "learn-html",
    "learn-css",
    "learn-javascript",
    "learn-react",
  ],
  readinessScore: 72,
  learningPlan: ["TypeScript", "Testing", "System Design"],
};

const _sampleATSResult: ATSResult = {
  score: 82,
  missingSections: [],
  missingSkills: ["agile", "api"],
  suggestions: [
    "Add more quantified achievements with specific percentages",
    "Include GitHub and LinkedIn profile links",
    "Add a dedicated Technical Skills section with proficiency levels",
  ],
  analyzedAt: new Date().toISOString(),
};

// ============================================================
// Storage helpers — per-user keys
// ============================================================
function resumeKey() {
  return getUserKey("resume");
}
function atsKey() {
  return getUserKey("ats");
}
function careerProfileKey() {
  return getUserKey("career_profile");
}

export function saveResume(data: ResumeData): void {
  localStorage.setItem(resumeKey(), JSON.stringify(data));
}

export function loadResume(): ResumeData | null {
  try {
    const raw = localStorage.getItem(resumeKey());
    return raw ? (JSON.parse(raw) as ResumeData) : null;
  } catch {
    return null;
  }
}

export function saveATSResult(result: ATSResult): void {
  localStorage.setItem(atsKey(), JSON.stringify(result));
}

export function loadATSResult(): ATSResult | null {
  try {
    const raw = localStorage.getItem(atsKey());
    return raw ? (JSON.parse(raw) as ATSResult) : null;
  } catch {
    return null;
  }
}

export function saveCareerProfile(profile: CareerProfile): void {
  localStorage.setItem(careerProfileKey(), JSON.stringify(profile));
}

export function loadCareerProfile(): CareerProfile | null {
  try {
    const raw = localStorage.getItem(careerProfileKey());
    return raw ? (JSON.parse(raw) as CareerProfile) : null;
  } catch {
    return null;
  }
}

// initializeSampleData is intentionally disabled
// Users must create their own data
export function initializeSampleData(): void {
  // No-op: do not pre-populate with sample data
}

export function getResumeCompletionPercent(resume: ResumeData | null): number {
  if (!resume) return 0;
  let score = 0;
  if (resume.name && resume.email) score += 20;
  if (resume.summary && resume.summary.length > 50) score += 15;
  if (resume.education.length > 0) score += 15;
  if (resume.skills.length >= 5) score += 15;
  if (resume.projects.length > 0) score += 15;
  if (resume.experience.length > 0) score += 10;
  if (resume.certifications.length > 0) score += 10;
  return Math.min(score, 100);
}
