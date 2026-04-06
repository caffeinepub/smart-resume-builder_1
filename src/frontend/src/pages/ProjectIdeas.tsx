import {
  CheckCircle2,
  Code2,
  ExternalLink,
  PlayCircle,
  Star,
} from "lucide-react";
import { useState } from "react";
import AppShell from "../components/AppShell";
import { getUserKey, getUserStream } from "../utils/auth";
import { addNotification } from "../utils/extras";
import { getStreamById } from "../utils/streamData";

type ProjectStatus = "Not Started" | "In Progress" | "Completed";

interface ProjectIdea {
  id: string;
  name: string;
  desc: string;
  technologies: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  resumeWorth: number;
}

// ============================================================
// Stream-specific project banks
// ============================================================
const STREAM_PROJECTS: Record<string, ProjectIdea[]> = {
  cse: [
    {
      id: "web-app",
      name: "Personal Portfolio Website",
      desc: "Build a responsive portfolio with React showcasing your projects and skills",
      difficulty: "Beginner",
      technologies: ["HTML", "CSS", "JavaScript", "React"],
      resumeWorth: 4,
    },
    {
      id: "chat-app",
      name: "Real-Time Chat Application",
      desc: "Full-stack chat app with Socket.io, authentication and message history",
      difficulty: "Intermediate",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      resumeWorth: 5,
    },
    {
      id: "ai-chatbot",
      name: "AI Chatbot Integration",
      desc: "Integrate OpenAI API to build a domain-specific chatbot with custom prompts",
      difficulty: "Intermediate",
      technologies: ["Python", "FastAPI", "OpenAI API", "React"],
      resumeWorth: 5,
    },
    {
      id: "mobile-app",
      name: "Mobile Task Manager App",
      desc: "Cross-platform mobile app with offline sync, notifications and cloud backup",
      difficulty: "Advanced",
      technologies: ["React Native", "Firebase", "Expo"],
      resumeWorth: 5,
    },
    {
      id: "ml-classifier",
      name: "ML Image Classifier",
      desc: "Train a CNN model to classify images, deploy as REST API",
      difficulty: "Advanced",
      technologies: ["Python", "TensorFlow", "Flask", "Docker"],
      resumeWorth: 5,
    },
    {
      id: "dsa-visualizer",
      name: "DSA Visualizer",
      desc: "Interactive visualization of sorting, searching and graph algorithms",
      difficulty: "Intermediate",
      technologies: ["React", "TypeScript", "Canvas API"],
      resumeWorth: 4,
    },
  ],
  mechanical: [
    {
      id: "cad-model",
      name: "CAD Assembly Model",
      desc: "Design a complete mechanical assembly (engine/pump) using AutoCAD or SolidWorks with detailed drawings",
      difficulty: "Beginner",
      technologies: ["AutoCAD", "SolidWorks"],
      resumeWorth: 4,
    },
    {
      id: "mini-engine",
      name: "Mini Engine Model",
      desc: "Build and test a scaled-down IC engine model demonstrating thermodynamic principles",
      difficulty: "Intermediate",
      technologies: ["Workshop Skills", "Mechanical Design", "Testing"],
      resumeWorth: 5,
    },
    {
      id: "automation",
      name: "Industrial Automation System",
      desc: "Design PLC-based automation for a production line with sensors and actuators",
      difficulty: "Advanced",
      technologies: ["PLC", "SCADA", "AutoCAD", "Sensors"],
      resumeWorth: 5,
    },
    {
      id: "stress-analysis",
      name: "Stress Analysis Project",
      desc: "FEA analysis of a structural component under various load conditions",
      difficulty: "Intermediate",
      technologies: ["ANSYS", "SolidWorks Simulation", "MATLAB"],
      resumeWorth: 4,
    },
    {
      id: "hvac-design",
      name: "HVAC System Design",
      desc: "Complete design of heating, ventilation and cooling system for a commercial building",
      difficulty: "Advanced",
      technologies: [
        "AutoCAD MEP",
        "Heat Transfer Calculations",
        "HVAC Standards",
      ],
      resumeWorth: 5,
    },
    {
      id: "conveyor",
      name: "Conveyor Belt System",
      desc: "Design and build a small-scale conveyor belt with motor control and speed regulation",
      difficulty: "Beginner",
      technologies: ["Mechanical Design", "Basic Electronics", "AutoCAD"],
      resumeWorth: 3,
    },
  ],
  electrical: [
    {
      id: "smart-grid",
      name: "Smart Grid Simulation",
      desc: "Simulate a smart power grid with load balancing, fault detection and renewable integration",
      difficulty: "Advanced",
      technologies: ["MATLAB", "Simulink", "Power Electronics"],
      resumeWorth: 5,
    },
    {
      id: "iot-circuit",
      name: "IoT Home Automation Circuit",
      desc: "Design circuit for remotely controlling home appliances via smartphone using ESP32",
      difficulty: "Intermediate",
      technologies: ["ESP32", "Arduino", "PCB Design", "IoT"],
      resumeWorth: 5,
    },
    {
      id: "pcb-design",
      name: "PCB Design Project",
      desc: "Design and fabricate a custom PCB for a microcontroller-based application",
      difficulty: "Intermediate",
      technologies: ["Eagle/KiCad", "Circuit Design", "Soldering"],
      resumeWorth: 4,
    },
    {
      id: "plc-automation",
      name: "PLC Ladder Logic Automation",
      desc: "Program PLC ladder logic for industrial process control simulation",
      difficulty: "Intermediate",
      technologies: ["PLC", "Ladder Logic", "SCADA", "HMI"],
      resumeWorth: 4,
    },
    {
      id: "power-supply",
      name: "Variable Power Supply Design",
      desc: "Design and build a variable DC power supply with overload protection",
      difficulty: "Beginner",
      technologies: ["Circuit Design", "Transformers", "Voltage Regulators"],
      resumeWorth: 3,
    },
    {
      id: "renewable-energy",
      name: "Renewable Energy Monitor",
      desc: "Solar panel monitoring system with data logging and efficiency analysis",
      difficulty: "Advanced",
      technologies: ["Embedded C", "Sensors", "Data Analytics", "Arduino"],
      resumeWorth: 5,
    },
  ],
  civil: [
    {
      id: "structural-design",
      name: "Structural Analysis of RCC Beam",
      desc: "Complete structural analysis and design of reinforced concrete beam under various loads",
      difficulty: "Intermediate",
      technologies: ["STAAD Pro", "AutoCAD", "IS Codes"],
      resumeWorth: 5,
    },
    {
      id: "urban-planning",
      name: "Urban Planning Layout",
      desc: "Master plan for a residential township including roads, utilities and green spaces",
      difficulty: "Advanced",
      technologies: ["AutoCAD", "GIS", "Urban Planning Standards"],
      resumeWorth: 5,
    },
    {
      id: "water-supply",
      name: "Water Supply System Design",
      desc: "Design water distribution network for a residential colony with demand calculations",
      difficulty: "Intermediate",
      technologies: ["AutoCAD", "EPANET", "Hydraulic Calculations"],
      resumeWorth: 4,
    },
    {
      id: "soil-testing",
      name: "Soil Investigation Report",
      desc: "Conduct geotechnical soil testing and prepare investigation report with foundation recommendations",
      difficulty: "Beginner",
      technologies: ["Soil Testing", "Lab Analysis", "Report Writing"],
      resumeWorth: 3,
    },
    {
      id: "bim-model",
      name: "BIM Model with Revit",
      desc: "Create complete 3D BIM model of a building including MEP, structural and architectural details",
      difficulty: "Advanced",
      technologies: ["Revit", "AutoCAD", "BIM Standards"],
      resumeWorth: 5,
    },
    {
      id: "cost-estimate",
      name: "Construction Cost Estimation",
      desc: "Detailed bill of quantities and cost estimation for a 3-storey building",
      difficulty: "Beginner",
      technologies: ["MS Excel", "IS Rate Analysis", "BOQ"],
      resumeWorth: 3,
    },
  ],
  mba: [
    {
      id: "market-analysis",
      name: "Market Analysis Report",
      desc: "Comprehensive market analysis for a product launch including SWOT, competitor analysis and market sizing",
      difficulty: "Beginner",
      technologies: ["Excel", "PowerPoint", "Research Methods"],
      resumeWorth: 4,
    },
    {
      id: "business-plan",
      name: "Business Plan Development",
      desc: "Complete business plan for a startup with financial projections, marketing strategy and operational plan",
      difficulty: "Intermediate",
      technologies: ["Excel", "PowerPoint", "Financial Modeling"],
      resumeWorth: 5,
    },
    {
      id: "digital-marketing",
      name: "Digital Marketing Campaign",
      desc: "Plan and execute a complete digital marketing campaign with SEO, social media and analytics",
      difficulty: "Intermediate",
      technologies: ["Google Analytics", "Social Media", "SEO Tools"],
      resumeWorth: 4,
    },
    {
      id: "hr-policy",
      name: "HR Policy Framework",
      desc: "Design a comprehensive HR policy framework including recruitment, training and performance management",
      difficulty: "Intermediate",
      technologies: ["HR Systems", "Policy Writing", "Excel"],
      resumeWorth: 4,
    },
    {
      id: "financial-model",
      name: "Financial Modeling Project",
      desc: "Build a 3-statement financial model (P&L, Balance Sheet, Cash Flow) for a company",
      difficulty: "Advanced",
      technologies: ["Excel", "Financial Statements", "Valuation"],
      resumeWorth: 5,
    },
    {
      id: "supply-chain",
      name: "Supply Chain Optimization",
      desc: "Analyze and optimize a company's supply chain using lean principles and data analysis",
      difficulty: "Advanced",
      technologies: ["Excel", "Process Mapping", "Analytics"],
      resumeWorth: 5,
    },
  ],
  medical: [
    {
      id: "healthcare-survey",
      name: "Healthcare Survey & Analysis",
      desc: "Conduct a community health survey, analyze data and present public health recommendations",
      difficulty: "Beginner",
      technologies: ["SPSS", "Excel", "Research Methods"],
      resumeWorth: 4,
    },
    {
      id: "clinical-study",
      name: "Clinical Study Design",
      desc: "Design and document a clinical research protocol for a medical intervention study",
      difficulty: "Advanced",
      technologies: [
        "Clinical Research Methods",
        "ICH-GCP",
        "Protocol Writing",
      ],
      resumeWorth: 5,
    },
    {
      id: "health-app",
      name: "Health Tracking Application",
      desc: "Design (wireframe/prototype) a mobile app for patient vitals monitoring and medication reminders",
      difficulty: "Intermediate",
      technologies: ["Figma", "Health Informatics", "UI/UX"],
      resumeWorth: 4,
    },
    {
      id: "epidemiology",
      name: "Epidemiological Study",
      desc: "Conduct a descriptive epidemiological study on a local health issue with statistical analysis",
      difficulty: "Intermediate",
      technologies: ["Epidemiology", "Statistics", "SPSS"],
      resumeWorth: 4,
    },
    {
      id: "medical-record",
      name: "Medical Record System Prototype",
      desc: "Design a simple electronic medical records system with patient management and reporting",
      difficulty: "Intermediate",
      technologies: ["System Design", "Healthcare IT", "Documentation"],
      resumeWorth: 4,
    },
    {
      id: "nutrition-analysis",
      name: "Nutritional Analysis Project",
      desc: "Assess dietary patterns of a target population and provide evidence-based nutrition recommendations",
      difficulty: "Beginner",
      technologies: ["Nutrition Science", "Data Collection", "Reporting"],
      resumeWorth: 3,
    },
  ],
  commerce: [
    {
      id: "financial-analysis",
      name: "Company Financial Analysis",
      desc: "Analyze a listed company's financial statements with ratio analysis and investment recommendation",
      difficulty: "Intermediate",
      technologies: ["Excel", "Financial Ratios", "Accounting Standards"],
      resumeWorth: 5,
    },
    {
      id: "tax-planning",
      name: "Tax Planning Case Study",
      desc: "Prepare a comprehensive tax planning study for an individual and company under Income Tax Act",
      difficulty: "Intermediate",
      technologies: ["Income Tax", "Tally ERP", "Tax Laws"],
      resumeWorth: 4,
    },
    {
      id: "audit-report",
      name: "Internal Audit Report",
      desc: "Conduct internal audit of a small business and prepare audit report with findings and recommendations",
      difficulty: "Advanced",
      technologies: ["Auditing Standards", "Tally", "Excel"],
      resumeWorth: 5,
    },
    {
      id: "gst-project",
      name: "GST Compliance Project",
      desc: "Set up complete GST compliance system for a small business including registration, returns and reconciliation",
      difficulty: "Beginner",
      technologies: ["GST Portal", "Tally ERP", "Tax Laws"],
      resumeWorth: 3,
    },
    {
      id: "mutual-fund",
      name: "Mutual Fund Portfolio Analysis",
      desc: "Analyze and compare mutual fund schemes, build an optimal portfolio based on risk profile",
      difficulty: "Intermediate",
      technologies: ["Excel", "Financial Analysis", "Investment Knowledge"],
      resumeWorth: 4,
    },
    {
      id: "banking-operations",
      name: "Banking Operations Study",
      desc: "Study and document banking operations, credit appraisal process and risk management practices",
      difficulty: "Beginner",
      technologies: ["Banking Knowledge", "Report Writing", "Excel"],
      resumeWorth: 3,
    },
  ],
  arts: [
    {
      id: "brand-identity",
      name: "Brand Identity Design",
      desc: "Create complete brand identity package (logo, colors, typography, guidelines) for a startup",
      difficulty: "Beginner",
      technologies: ["Adobe Illustrator", "Figma", "Brand Strategy"],
      resumeWorth: 4,
    },
    {
      id: "ux-case-study",
      name: "UX Design Case Study",
      desc: "Full UX research and design project: user research, wireframes, prototypes and usability testing",
      difficulty: "Intermediate",
      technologies: ["Figma", "User Research", "Prototyping"],
      resumeWorth: 5,
    },
    {
      id: "motion-graphics",
      name: "Motion Graphics Video",
      desc: "Create animated explainer video or title sequence using motion graphics techniques",
      difficulty: "Intermediate",
      technologies: ["After Effects", "Premiere Pro", "Storyboarding"],
      resumeWorth: 4,
    },
    {
      id: "photo-series",
      name: "Documentary Photography Series",
      desc: "Create a cohesive photo documentary series with editorial writeup and portfolio presentation",
      difficulty: "Beginner",
      technologies: ["Photography", "Adobe Lightroom", "Storytelling"],
      resumeWorth: 3,
    },
    {
      id: "fashion-collection",
      name: "Fashion Collection Design",
      desc: "Design a 5-piece fashion collection with mood board, fabric selection and technical sketches",
      difficulty: "Intermediate",
      technologies: ["Illustration", "Adobe Photoshop", "Fashion Design"],
      resumeWorth: 4,
    },
    {
      id: "social-campaign",
      name: "Social Media Content Campaign",
      desc: "Plan and create a complete social media content campaign with strategy, visuals and copy",
      difficulty: "Beginner",
      technologies: ["Canva", "Social Media Strategy", "Content Creation"],
      resumeWorth: 3,
    },
  ],
};

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
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);

  // Fallback to cse if stream not found
  const projects = STREAM_PROJECTS[userStream] ?? STREAM_PROJECTS.cse;

  const [activeCategory, setActiveCategory] = useState("All");
  const [statuses, setStatuses] =
    useState<Record<string, ProjectStatus>>(loadStatuses);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.difficulty === activeCategory);

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
      title={`${streamDef.label} Projects`}
      subtitle="Build portfolio-worthy projects"
    >
      <div className="max-w-7xl mx-auto" data-ocid="projects.page">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {streamDef.label} Project Ideas
            </h1>
            <p className="text-white/40 text-sm">
              {projects.length} carefully curated projects from beginner to
              advanced
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            {/* Stream badge */}
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{
                color: streamDef.color,
                background: `${streamDef.color}15`,
                borderColor: `${streamDef.color}35`,
              }}
              data-ocid="projects.stream.badge"
            >
              {streamDef.icon} {streamDef.label}
            </span>
            {completedCount > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
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
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="skill-chip text-xs">
                      {tech}
                    </span>
                  ))}
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
