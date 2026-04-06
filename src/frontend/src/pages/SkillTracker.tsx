import {
  CheckCircle2,
  PlusCircle,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { getUserKey, getUserStream } from "../utils/auth";
import { addNotification } from "../utils/extras";
import { getStreamById } from "../utils/streamData";

type SkillStatus = "Learning" | "Practicing" | "Completed";

interface TrackedSkill {
  id: string;
  name: string;
  status: SkillStatus;
  addedAt: string;
}

const STORAGE_KEY = () => getUserKey("smartresume_skill_tracker");

const STATUS_CONFIG: Record<
  SkillStatus,
  { color: string; bg: string; border: string; pct: number }
> = {
  Learning: {
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.35)",
    pct: 33,
  },
  Practicing: {
    color: "#4B8BFF",
    bg: "rgba(75,139,255,0.15)",
    border: "rgba(75,139,255,0.35)",
    pct: 66,
  },
  Completed: {
    color: "#39D98A",
    bg: "rgba(57,217,138,0.15)",
    border: "rgba(57,217,138,0.35)",
    pct: 100,
  },
};

// Stream-specific suggested skills (beyond atsKeywords, more granular)
const STREAM_SUGGESTED_SKILLS: Record<string, string[]> = {
  cse: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "DSA",
    "SQL",
    "MongoDB",
    "REST API",
    "Git",
    "Docker",
    "System Design",
    "AWS",
    "Machine Learning",
    "CSS",
    "HTML",
  ],
  mechanical: [
    "AutoCAD",
    "SolidWorks",
    "CATIA",
    "ANSYS",
    "Pro/E",
    "Thermodynamics",
    "Fluid Mechanics",
    "Manufacturing Processes",
    "Quality Control",
    "Six Sigma",
    "Lean Manufacturing",
    "CNC Programming",
    "GD&T",
    "Material Science",
    "Heat Transfer",
  ],
  electrical: [
    "MATLAB",
    "PLC Programming",
    "SCADA",
    "AutoCAD Electrical",
    "Embedded C",
    "Arduino",
    "Raspberry Pi",
    "Power Systems",
    "Circuit Design",
    "PCB Design",
    "VHDL",
    "Proteus",
    "Electrical Safety",
    "Transformer",
    "Inverter Design",
  ],
  civil: [
    "AutoCAD Civil 3D",
    "STAAD Pro",
    "Revit",
    "SAP2000",
    "Structural Analysis",
    "Estimation & Costing",
    "Project Management",
    "Primavera",
    "MS Project",
    "Quantity Surveying",
    "BIM",
    "Site Supervision",
    "Soil Testing",
    "Concrete Mix Design",
  ],
  mba: [
    "Business Analysis",
    "Project Management",
    "Excel",
    "PowerPoint",
    "Data Analytics",
    "Tableau",
    "Power BI",
    "Marketing Strategy",
    "Digital Marketing",
    "CRM",
    "Financial Modeling",
    "Leadership",
    "Negotiation",
    "Public Speaking",
    "Agile / Scrum",
  ],
  medical: [
    "Clinical Research",
    "GCP",
    "Medical Coding (ICD-10)",
    "EMR/EHR",
    "Pharmacovigilance",
    "Healthcare Management",
    "Patient Care",
    "Anatomy",
    "Physiology",
    "Clinical Documentation",
    "Lab Techniques",
    "Biostatistics",
    "Research Methodology",
  ],
  commerce: [
    "Tally ERP",
    "GST Filing",
    "Taxation",
    "Auditing",
    "Financial Analysis",
    "MS Excel",
    "QuickBooks",
    "SAP FICO",
    "Cost Accounting",
    "Financial Reporting",
    "Banking Operations",
    "Investment Analysis",
    "Income Tax",
    "Balance Sheet",
    "Cash Flow Analysis",
  ],
  arts: [
    "Figma",
    "Adobe XD",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Canva",
    "UI Design",
    "UX Research",
    "Prototyping",
    "Typography",
    "Color Theory",
    "Motion Graphics",
    "After Effects",
    "Brand Identity",
    "Content Writing",
    "Video Editing",
  ],
};

function loadSkills(): TrackedSkill[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY());
    return raw ? (JSON.parse(raw) as TrackedSkill[]) : [];
  } catch {
    return [];
  }
}

function saveSkills(skills: TrackedSkill[]): void {
  localStorage.setItem(STORAGE_KEY(), JSON.stringify(skills));
}

export default function SkillTracker() {
  const [skills, setSkills] = useState<TrackedSkill[]>(loadSkills);
  const [newSkill, setNewSkill] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);
  const suggestedSkills =
    STREAM_SUGGESTED_SKILLS[streamDef.id] ?? STREAM_SUGGESTED_SKILLS.cse;

  const trackedNames = new Set(skills.map((s) => s.name.toLowerCase()));
  const unaddedSuggestions = suggestedSkills.filter(
    (s) => !trackedNames.has(s.toLowerCase()),
  );

  const counts = {
    Learning: skills.filter((s) => s.status === "Learning").length,
    Practicing: skills.filter((s) => s.status === "Practicing").length,
    Completed: skills.filter((s) => s.status === "Completed").length,
  };

  const addSkill = (name?: string) => {
    const skillName = (name ?? newSkill).trim();
    if (!skillName) return;
    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      toast.error("Skill already exists!");
      return;
    }
    const skill: TrackedSkill = {
      id: `skill_${Date.now()}`,
      name: skillName,
      status: "Learning",
      addedAt: new Date().toISOString(),
    };
    const updated = [skill, ...skills];
    setSkills(updated);
    saveSkills(updated);
    if (!name) setNewSkill("");
    toast.success(`Added: ${skillName}`);
  };

  const changeStatus = (id: string, status: SkillStatus) => {
    const updated = skills.map((s) => (s.id === id ? { ...s, status } : s));
    setSkills(updated);
    saveSkills(updated);
    if (status === "Completed") {
      const skill = skills.find((s) => s.id === id);
      if (skill) {
        addNotification(`🎯 Skill completed: ${skill.name}`);
        toast.success(`🎉 ${skill.name} marked as Completed!`);
      }
    }
  };

  const deleteSkill = (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    saveSkills(updated);
    toast.success("Skill removed");
  };

  return (
    <AppShell title="Skill Tracker" subtitle="Track your learning journey">
      <div className="max-w-4xl mx-auto" data-ocid="skill_tracker.page">
        <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Skill Progress Tracker
            </h1>
            <p className="text-white/40 text-sm">
              Add skills and track your progress from Learning to Completed
            </p>
          </div>
          <span
            className="text-sm font-medium px-3 py-1.5 rounded-full border flex items-center gap-1.5"
            style={{
              color: streamDef.color,
              background: `${streamDef.color}15`,
              borderColor: `${streamDef.color}35`,
            }}
          >
            <Sparkles size={12} />
            {streamDef.label} Skills
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(["Learning", "Practicing", "Completed"] as SkillStatus[]).map(
            (status) => {
              const cfg = STATUS_CONFIG[status];
              return (
                <div
                  key={status}
                  className="glass-card p-4 text-center"
                  style={{ borderColor: cfg.border }}
                  data-ocid={`skill_tracker.${status.toLowerCase()}.card`}
                >
                  <div
                    className="text-3xl font-extrabold"
                    style={{ color: cfg.color }}
                  >
                    {counts[status]}
                  </div>
                  <div className="text-white/50 text-xs font-medium mt-1">
                    {status}
                  </div>
                </div>
              );
            },
          )}
        </div>

        {/* Add Skill */}
        <div
          className="glass-card p-4 mb-4 flex gap-3"
          data-ocid="skill_tracker.add.panel"
        >
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            placeholder={`Add a skill (e.g. ${suggestedSkills[0]}, ${suggestedSkills[1]}...)`}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors"
            data-ocid="skill_tracker.input"
          />
          <button
            type="button"
            onClick={() => addSkill()}
            className="btn-primary flex items-center gap-2 py-2.5 px-5 flex-shrink-0"
            data-ocid="skill_tracker.add_button"
          >
            <PlusCircle size={16} /> Add
          </button>
        </div>

        {/* Stream-specific Suggested Skills */}
        {unaddedSuggestions.length > 0 && (
          <div
            className="glass-card p-4 mb-6"
            data-ocid="skill_tracker.suggestions.panel"
          >
            <button
              type="button"
              onClick={() => setShowSuggestions((v) => !v)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles size={14} style={{ color: streamDef.color }} />
                Suggested Skills for {streamDef.label}
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${streamDef.color}20`,
                    color: streamDef.color,
                  }}
                >
                  {unaddedSuggestions.length} available
                </span>
              </h3>
              <span className="text-white/40 text-xs">
                {showSuggestions ? "Hide" : "Show"}
              </span>
            </button>

            {showSuggestions && (
              <div className="mt-3 flex flex-wrap gap-2 animate-fade-in-up">
                {unaddedSuggestions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80 flex items-center gap-1.5"
                    style={{
                      color: streamDef.color,
                      background: `${streamDef.color}12`,
                      borderColor: `${streamDef.color}30`,
                    }}
                    data-ocid={`skill_tracker.suggest.${skill}`}
                  >
                    <PlusCircle size={11} /> {skill}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skill List */}
        <div className="space-y-3" data-ocid="skill_tracker.list">
          {skills.length === 0 && (
            <div
              className="glass-card p-12 text-center"
              data-ocid="skill_tracker.empty_state"
            >
              <TrendingUp size={36} className="text-purple-400 mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">
                No skills tracked yet
              </p>
              <p className="text-white/40 text-sm">
                Add a skill above or pick from the suggested list for{" "}
                {streamDef.label}
              </p>
            </div>
          )}

          {skills.map((skill, i) => {
            const cfg = STATUS_CONFIG[skill.status];
            return (
              <div
                key={skill.id}
                className="glass-card p-4 animate-fade-in-up"
                data-ocid={`skill_tracker.item.${i + 1}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">
                        {skill.name}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          color: cfg.color,
                        }}
                      >
                        {skill.status}
                      </span>
                    </div>
                    <div className="mt-2 progress-bar-track">
                      <div
                        className="progress-bar-fill transition-all duration-700"
                        style={{
                          width: `${cfg.pct}%`,
                          background: `linear-gradient(90deg, ${cfg.color}80, ${cfg.color})`,
                        }}
                      />
                    </div>
                    <p className="text-white/30 text-[10px] mt-0.5">
                      {cfg.pct}% complete
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteSkill(skill.id)}
                    className="text-white/30 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    data-ocid={`skill_tracker.delete_button.${i + 1}`}
                    title="Remove skill"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="flex gap-2">
                  {(
                    ["Learning", "Practicing", "Completed"] as SkillStatus[]
                  ).map((s) => {
                    const sCfg = STATUS_CONFIG[s];
                    const isActive = skill.status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => changeStatus(skill.id, s)}
                        className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-all duration-200 border"
                        style={{
                          background: isActive
                            ? sCfg.bg
                            : "rgba(255,255,255,0.03)",
                          borderColor: isActive
                            ? sCfg.border
                            : "rgba(255,255,255,0.08)",
                          color: isActive
                            ? sCfg.color
                            : "rgba(255,255,255,0.4)",
                        }}
                        data-ocid={`skill_tracker.${s.toLowerCase()}_button.${i + 1}`}
                      >
                        {s === "Completed" ? (
                          <span className="flex items-center justify-center gap-1">
                            <CheckCircle2 size={11} />
                            {s}
                          </span>
                        ) : (
                          s
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
