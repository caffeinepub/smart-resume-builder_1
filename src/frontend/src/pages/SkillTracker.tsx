import { CheckCircle2, PlusCircle, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { getUserKey } from "../utils/auth";
import { addNotification } from "../utils/extras";

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

  const counts = {
    Learning: skills.filter((s) => s.status === "Learning").length,
    Practicing: skills.filter((s) => s.status === "Practicing").length,
    Completed: skills.filter((s) => s.status === "Completed").length,
  };

  const addSkill = () => {
    const name = newSkill.trim();
    if (!name) return;
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Skill already exists!");
      return;
    }
    const skill: TrackedSkill = {
      id: `skill_${Date.now()}`,
      name,
      status: "Learning",
      addedAt: new Date().toISOString(),
    };
    const updated = [skill, ...skills];
    setSkills(updated);
    saveSkills(updated);
    setNewSkill("");
    toast.success(`Added: ${name}`);
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            Skill Progress Tracker
          </h1>
          <p className="text-white/40 text-sm">
            Add skills and track your progress from Learning to Completed
          </p>
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
          className="glass-card p-4 mb-6 flex gap-3"
          data-ocid="skill_tracker.add.panel"
        >
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            placeholder="Add a new skill (e.g. React, Python, Docker...)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors"
            data-ocid="skill_tracker.input"
          />
          <button
            type="button"
            onClick={addSkill}
            className="btn-primary flex items-center gap-2 py-2.5 px-5 flex-shrink-0"
            data-ocid="skill_tracker.add_button"
          >
            <PlusCircle size={16} /> Add
          </button>
        </div>

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
                Add your first skill above to start tracking progress
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
