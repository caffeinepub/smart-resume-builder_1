import { BookOpen, CheckCircle2, ChevronDown, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { ROLES, getRoleEligibility } from "../utils/roleData";
import {
  loadCareerProfile,
  loadResume,
  saveCareerProfile,
} from "../utils/storage";

export default function SkillGap() {
  const resume = loadResume();
  const careerProfile = loadCareerProfile();
  const [selectedRole, setSelectedRole] = useState(
    careerProfile?.targetRole ?? "Frontend Developer",
  );

  const userSkills = resume?.skills ?? [];
  const analysis = useMemo(
    () => getRoleEligibility(userSkills, selectedRole),
    [userSkills, selectedRole],
  );
  const roleData = ROLES[selectedRole];

  const addToLearningPlan = () => {
    const current = loadCareerProfile();
    const existing = current?.learningPlan ?? [];
    const newSkills = analysis.missing.filter((s) => !existing.includes(s));
    if (newSkills.length === 0) {
      toast.info("All missing skills already in your learning plan!");
      return;
    }
    saveCareerProfile({
      targetRole: selectedRole,
      completedSteps: current?.completedSteps ?? [],
      readinessScore: current?.readinessScore ?? 0,
      learningPlan: [...existing, ...newSkills],
    });
    toast.success(`Added ${newSkills.length} skills to your learning plan!`);
  };

  return (
    <AppShell title="Skill Gap" subtitle="See what skills you need">
      <div className="max-w-5xl mx-auto" data-ocid="skill_gap.page">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Skill Gap Analysis</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Compare your skills against target role requirements
          </p>
        </div>

        {/* Role selector */}
        <div className="glass-card p-5 mb-6">
          <p className="label-dark text-base mb-2">Select Target Role</p>
          <div className="relative max-w-xs">
            <select
              data-ocid="skill_gap.role.select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input-dark w-full appearance-none pr-10"
            >
              {Object.keys(ROLES).map((role) => (
                <option
                  key={role}
                  value={role}
                  style={{ background: "#0B1236" }}
                >
                  {role}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>
        </div>

        {roleData && (
          <>
            {/* Summary bar */}
            <div
              className="glass-card p-5 mb-6"
              data-ocid="skill_gap.summary.panel"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-white font-semibold text-lg">
                    {selectedRole}
                  </h2>
                  <p className="text-white/40 text-sm">
                    {roleData.description}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className="text-3xl font-bold"
                    style={{
                      color:
                        analysis.matchPercent >= 60 ? "#39D98A" : "#F59E0B",
                    }}
                  >
                    {analysis.matchPercent}%
                  </div>
                  <div className="text-white/40 text-xs">
                    {analysis.matched.length}/{roleData.required.length} skills
                  </div>
                </div>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${analysis.matchPercent}%`,
                    background:
                      analysis.matchPercent >= 60
                        ? "linear-gradient(90deg, #39D98A, #35D0C7)"
                        : "linear-gradient(90deg, #F59E0B, #EF4444)",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>0%</span>
                <span>60% (Eligible threshold)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div
                className="glass-card p-5"
                data-ocid="skill_gap.known_skills.panel"
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" /> You Know
                  ({analysis.matched.length})
                </h3>
                <div className="space-y-2">
                  {analysis.matched.length === 0 ? (
                    <p
                      className="text-white/30 text-sm"
                      data-ocid="skill_gap.known_skills.empty_state"
                    >
                      No matching skills yet
                    </p>
                  ) : (
                    analysis.matched.map((s, i) => (
                      <div
                        key={s}
                        className="flex items-center gap-3 py-2 px-3 rounded-xl bg-green-500/10 border border-green-500/20"
                        data-ocid={`skill_gap.known_skill.item.${i + 1}`}
                      >
                        <CheckCircle2
                          size={15}
                          className="text-green-400 flex-shrink-0"
                        />
                        <span className="text-white text-sm">{s}</span>
                        <span className="ml-auto text-green-400 text-xs">
                          ✓
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div
                className="glass-card p-5"
                data-ocid="skill_gap.missing_skills.panel"
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <XCircle size={16} className="text-red-400" /> Need to Learn (
                  {analysis.missing.length})
                </h3>
                <div className="space-y-2">
                  {analysis.missing.length === 0 ? (
                    <p
                      className="text-green-400 text-sm font-medium"
                      data-ocid="skill_gap.missing_skills.empty_state"
                    >
                      🎉 You have all required skills!
                    </p>
                  ) : (
                    analysis.missing.map((s, i) => (
                      <div
                        key={s}
                        className="flex items-center gap-3 py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/20"
                        data-ocid={`skill_gap.missing_skill.item.${i + 1}`}
                      >
                        <XCircle
                          size={15}
                          className="text-red-400 flex-shrink-0"
                        />
                        <span className="text-white text-sm">{s}</span>
                        <span className="ml-auto text-red-400 text-xs">✗</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {analysis.missing.length > 0 && (
              <div
                className="glass-card p-5 flex items-center justify-between"
                data-ocid="skill_gap.learning_plan.panel"
              >
                <div>
                  <h3 className="text-white font-semibold">
                    Add to Learning Plan
                  </h3>
                  <p className="text-white/40 text-sm">
                    Save {analysis.missing.length} missing skills to track your
                    progress
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addToLearningPlan}
                  className="btn-primary flex items-center gap-2"
                  data-ocid="skill_gap.add_plan.button"
                >
                  <BookOpen size={15} /> Add {analysis.missing.length} Skills
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
