import {
  CheckCircle2,
  Code2,
  ExternalLink,
  PlayCircle,
  Star,
} from "lucide-react";
import { useState } from "react";
import AppShell from "../components/AppShell";
import { getUserKey } from "../utils/auth";
import { addNotification } from "../utils/extras";

type ProjectStatus = "Not Started" | "In Progress" | "Completed";

interface ProjectIdea {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  features: string[];
  resumeWorth: number;
}

const PROJECTS: ProjectIdea[] = [
  {
    id: "todo",
    name: "ToDo App",
    description:
      "A clean task manager with categories, priorities, and persistent storage using localStorage.",
    technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    difficulty: "Beginner",
    features: [
      "Add/remove/edit tasks",
      "Mark complete",
      "Filter by status",
      "Dark mode",
      "Categories",
    ],
    resumeWorth: 3,
  },
  {
    id: "calc",
    name: "Scientific Calculator",
    description:
      "A fully functional calculator with basic and scientific operations, history log, and keyboard support.",
    technologies: ["HTML", "CSS", "JavaScript"],
    difficulty: "Beginner",
    features: [
      "Basic/scientific ops",
      "History log",
      "Keyboard support",
      "Responsive design",
    ],
    resumeWorth: 2,
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    description:
      "A personal portfolio showcasing projects, skills, and contact information with smooth animations.",
    technologies: ["HTML", "CSS", "JavaScript", "Animations"],
    difficulty: "Beginner",
    features: [
      "Responsive design",
      "Projects showcase",
      "Contact form",
      "Smooth animations",
      "Dark/light mode",
    ],
    resumeWorth: 4,
  },
  {
    id: "quiz",
    name: "Quiz App",
    description:
      "An interactive quiz application with multiple categories, timer, score tracking, and leaderboard.",
    technologies: ["HTML", "CSS", "JavaScript", "JSON"],
    difficulty: "Beginner",
    features: [
      "Timer per question",
      "Multiple categories",
      "Score tracking",
      "Leaderboard",
      "Progress bar",
    ],
    resumeWorth: 3,
  },
  {
    id: "student-mgr",
    name: "Student Manager",
    description:
      "A CRUD application to manage student records with search, filter, and grade calculator features.",
    technologies: ["React", "LocalStorage"],
    difficulty: "Beginner",
    features: [
      "CRUD operations",
      "Search and filter",
      "Grade calculator",
      "Data export",
      "Responsive UI",
    ],
    resumeWorth: 3,
  },
  {
    id: "resume-builder",
    name: "Resume Builder",
    description:
      "A drag-and-drop resume builder with live preview, PDF export, and multiple professional templates.",
    technologies: ["React", "PDF.js", "TypeScript"],
    difficulty: "Intermediate",
    features: [
      "Live preview",
      "PDF export",
      "Multiple templates",
      "Form validation",
      "Auto-save",
    ],
    resumeWorth: 5,
  },
  {
    id: "chat-app",
    name: "Real-Time Chat App",
    description:
      "A full-stack chat application with real-time messaging, multiple rooms, and file sharing.",
    technologies: ["React", "Socket.io", "Node.js", "Express"],
    difficulty: "Intermediate",
    features: [
      "Real-time messaging",
      "Chat rooms",
      "File sharing",
      "Online indicators",
      "Notifications",
    ],
    resumeWorth: 4,
  },
  {
    id: "code-editor",
    name: "Online Code Editor",
    description:
      "A browser-based code editor supporting multiple languages with syntax highlighting and live execution.",
    technologies: ["React", "Monaco Editor", "CodeMirror"],
    difficulty: "Intermediate",
    features: [
      "Multi-language support",
      "Syntax highlighting",
      "Run code",
      "Save snippets",
      "Share code",
    ],
    resumeWorth: 4,
  },
  {
    id: "blog-platform",
    name: "Blog Platform",
    description:
      "A full-featured blogging platform with markdown support, categories, tags, and comment system.",
    technologies: ["React", "Node.js", "MongoDB", "Markdown"],
    difficulty: "Intermediate",
    features: [
      "CRUD posts",
      "Markdown support",
      "Categories",
      "Comment system",
      "Search",
    ],
    resumeWorth: 4,
  },
  {
    id: "job-portal",
    name: "Job Portal",
    description:
      "A complete job portal with listings, apply system, company profiles, and smart search filters.",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    difficulty: "Intermediate",
    features: [
      "Job listings",
      "Application system",
      "Company profiles",
      "Smart filters",
      "Saved jobs",
    ],
    resumeWorth: 5,
  },
  {
    id: "ai-resume",
    name: "AI Resume Analyzer",
    description:
      "ML-powered resume analyzer using NLP to extract skills, compute ATS score, and provide actionable suggestions.",
    technologies: ["React", "Python", "FastAPI", "ML/NLP"],
    difficulty: "Advanced",
    features: [
      "NLP processing",
      "ATS score",
      "Skill extraction",
      "AI suggestions",
      "PDF parsing",
    ],
    resumeWorth: 5,
  },
  {
    id: "face-attendance",
    name: "Face Recognition Attendance",
    description:
      "Real-time face detection system for automated attendance management with reports and analytics dashboard.",
    technologies: ["Python", "OpenCV", "Flask", "Face Recognition"],
    difficulty: "Advanced",
    features: [
      "Real-time detection",
      "Attendance log",
      "Reports dashboard",
      "Multi-face support",
      "Export data",
    ],
    resumeWorth: 5,
  },
  {
    id: "healthcare",
    name: "Smart Healthcare System",
    description:
      "Patient management system with symptom checker, AI-powered doctor matching, and appointment scheduling.",
    technologies: ["React", "Node.js", "Python", "ML"],
    difficulty: "Advanced",
    features: [
      "Patient records",
      "Symptom checker",
      "Doctor matching",
      "Appointments",
      "Health analytics",
    ],
    resumeWorth: 5,
  },
  {
    id: "interview-platform",
    name: "Online Interview Platform",
    description:
      "WebRTC-based video interview platform with integrated code editor, recording, and AI feedback system.",
    technologies: ["React", "WebRTC", "Node.js", "Socket.io"],
    difficulty: "Advanced",
    features: [
      "Video calls",
      "Live code editor",
      "Recording",
      "AI feedback",
      "Interview scheduling",
    ],
    resumeWorth: 5,
  },
  {
    id: "ai-career",
    name: "AI Career Guidance System",
    description:
      "Intelligent career advisor using GPT to analyze skills, predict career paths, and recommend learning resources.",
    technologies: ["React", "Python", "OpenAI API", "ML"],
    difficulty: "Advanced",
    features: [
      "Skill analysis",
      "Career path prediction",
      "Resource recommendations",
      "Progress tracking",
      "Chat interface",
    ],
    resumeWorth: 5,
  },
];

const CATEGORIES = ["All", "Beginner", "Intermediate", "Advanced"];

const DIFFICULTY_CONFIG = {
  Beginner: {
    color: "#39D98A",
    bg: "rgba(57,217,138,0.15)",
    border: "rgba(57,217,138,0.35)",
  },
  Intermediate: {
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.35)",
  },
  Advanced: {
    color: "#EF4444",
    bg: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.35)",
  },
};

const STATUS_CONFIG: Record<
  ProjectStatus,
  { color: string; bg: string; border: string }
> = {
  "Not Started": {
    color: "rgba(255,255,255,0.4)",
    bg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.1)",
  },
  "In Progress": {
    color: "#4B8BFF",
    bg: "rgba(75,139,255,0.15)",
    border: "rgba(75,139,255,0.35)",
  },
  Completed: {
    color: "#39D98A",
    bg: "rgba(57,217,138,0.15)",
    border: "rgba(57,217,138,0.35)",
  },
};

const STATUS_KEY = () => getUserKey("smartresume_project_status");

function loadStatuses(): Record<string, ProjectStatus> {
  try {
    const raw = localStorage.getItem(STATUS_KEY());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStatuses(data: Record<string, ProjectStatus>): void {
  localStorage.setItem(STATUS_KEY(), JSON.stringify(data));
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          // biome-ignore lint/suspicious/noArrayIndexKey: star positions are static
          key={i}
          size={12}
          className={i < count ? "text-yellow-400" : "text-white/20"}
          fill={i < count ? "#FBBF24" : "none"}
        />
      ))}
    </div>
  );
}

export default function ProjectIdeas() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [statuses, setStatuses] =
    useState<Record<string, ProjectStatus>>(loadStatuses);

  const filtered =
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.difficulty === activeCategory);
  const completedCount = Object.values(statuses).filter(
    (s) => s === "Completed",
  ).length;

  const setStatus = (project: ProjectIdea, status: ProjectStatus) => {
    const updated = { ...statuses, [project.id]: status };
    setStatuses(updated);
    saveStatuses(updated);
    if (status === "Completed") {
      addNotification(`🚀 Project completed: ${project.name}`);
    }
  };

  return (
    <AppShell
      title="CSE Project Ideas"
      subtitle="Build portfolio-worthy projects"
    >
      <div className="max-w-7xl mx-auto" data-ocid="projects.page">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              CSE Project Ideas Hub
            </h1>
            <p className="text-white/40 text-sm">
              15 carefully curated projects from beginner to advanced
            </p>
          </div>
          {completedCount > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0"
              style={{
                background: "rgba(57,217,138,0.15)",
                border: "1px solid rgba(57,217,138,0.3)",
              }}
            >
              <CheckCircle2 size={15} className="text-green-400" />
              <span className="text-green-400 font-semibold text-sm">
                Completed: {completedCount}
              </span>
            </div>
          )}
        </div>

        <div
          className="flex flex-wrap gap-2 mb-6"
          data-ocid="projects.filter.tab"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project, i) => {
            const diffConfig = DIFFICULTY_CONFIG[project.difficulty];
            const status: ProjectStatus = statuses[project.id] ?? "Not Started";
            const statusCfg = STATUS_CONFIG[status];
            const searchQuery = encodeURIComponent(
              `${project.name} ${project.technologies[0]} tutorial GitHub`,
            );
            return (
              <div
                key={project.id}
                className="glass-card p-5 flex flex-col gap-3 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
                data-ocid={`projects.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white font-bold text-base">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: statusCfg.bg,
                        border: `1px solid ${statusCfg.border}`,
                        color: statusCfg.color,
                      }}
                    >
                      {status}
                    </span>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: diffConfig.bg,
                        border: `1px solid ${diffConfig.border}`,
                        color: diffConfig.color,
                      }}
                    >
                      {project.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-white/50 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="skill-chip text-xs">
                      {tech}
                    </span>
                  ))}
                </div>

                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Key Features
                  </p>
                  <ul className="space-y-0.5">
                    {project.features.map((f) => (
                      <li
                        key={f}
                        className="text-white/60 text-xs flex items-start gap-1.5"
                      >
                        <span className="text-purple-400 mt-0.5 flex-shrink-0">
                          ›
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-white/40 text-xs">Resume Worth:</p>
                  <StarRating count={project.resumeWorth} />
                  <span className="text-yellow-400 text-xs font-semibold">
                    {project.resumeWorth}/5
                  </span>
                </div>

                {/* Status Actions */}
                <div className="flex gap-1.5">
                  {status === "Not Started" && (
                    <button
                      type="button"
                      onClick={() => setStatus(project, "In Progress")}
                      className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1"
                      data-ocid={`projects.start_button.${i + 1}`}
                    >
                      <PlayCircle size={13} /> Start Project
                    </button>
                  )}
                  {status === "In Progress" && (
                    <button
                      type="button"
                      onClick={() => setStatus(project, "Completed")}
                      className="flex-1 text-xs py-2 rounded-xl font-semibold flex items-center justify-center gap-1 transition-all"
                      style={{
                        background: "rgba(57,217,138,0.2)",
                        border: "1px solid rgba(57,217,138,0.4)",
                        color: "#39D98A",
                      }}
                      data-ocid={`projects.complete_button.${i + 1}`}
                    >
                      <CheckCircle2 size={13} /> Mark Completed
                    </button>
                  )}
                  {status === "Completed" && (
                    <div
                      className="flex-1 text-xs py-2 rounded-xl font-semibold flex items-center justify-center gap-1"
                      style={{
                        background: "rgba(57,217,138,0.15)",
                        border: "1px solid rgba(57,217,138,0.3)",
                        color: "#39D98A",
                      }}
                    >
                      <CheckCircle2 size={13} /> 🏅 Completed!
                    </div>
                  )}
                  <a
                    href={`https://www.google.com/search?q=${searchQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1 flex-shrink-0"
                    data-ocid={`projects.search.${i + 1}`}
                  >
                    <Code2 size={12} /> Resources <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
