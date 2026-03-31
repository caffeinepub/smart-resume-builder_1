import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { getUserStream } from "../utils/auth";
import {
  loadCareerProfile,
  loadResume,
  saveCareerProfile,
} from "../utils/storage";
import {
  getStreamById,
  getStreamRoleEligibility,
  getStreamRoles,
  getStreamSkillResource,
} from "../utils/streamData";

export default function SkillGap() {
  const resume = loadResume();
  const careerProfile = loadCareerProfile();
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);
  const streamRoles = getStreamRoles(userStream);

  const defaultRole = careerProfile?.targetRole ?? streamRoles[0]?.name ?? "";
  const [selectedRole, setSelectedRole] = useState(
    streamRoles.find((r) => r.name === defaultRole)
      ? defaultRole
      : (streamRoles[0]?.name ?? ""),
  );

  const userSkills = resume?.skills ?? [];
  const selectedRoleData = streamRoles.find((r) => r.name === selectedRole);

  const analysis = useMemo(() => {
    if (!selectedRoleData)
      return { eligible: false, matchPercent: 0, matched: [], missing: [] };
    return getStreamRoleEligibility(userSkills, selectedRoleData);
  }, [userSkills, selectedRoleData]);

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
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Skill Gap Analysis
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Compare your skills against target role requirements
            </p>
          </div>
          <span
            className="text-sm font-medium px-3 py-1.5 rounded-full border"
            style={{
              color: streamDef.color,
              background: `${streamDef.color}15`,
              borderColor: `${streamDef.color}35`,
            }}
          >
            {streamDef.label}
          </span>
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
              {streamRoles.map((role) => (
                <option
                  key={role.name}
                  value={role.name}
                  style={{ background: "#0B1236" }}
                >
                  {role.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>
        </div>

        {selectedRoleData && (
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
                    {selectedRoleData.description}
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
                    {analysis.matched.length}/
                    {selectedRoleData.requiredSkills.length} skills
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

            {/* Actions */}
            {analysis.missing.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  type="button"
                  onClick={addToLearningPlan}
                  className="btn-primary flex items-center gap-2 py-2.5 px-5"
                  data-ocid="skill_gap.add_to_plan.button"
                >
                  <BookOpen size={15} /> Add Missing Skills to Learning Plan
                </button>
              </div>
            )}

            {/* Improvement Suggestions from stream resources */}
            {analysis.missing.length > 0 && (
              <div
                className="glass-card p-5"
                data-ocid="skill_gap.suggestions.panel"
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <RefreshCw size={16} style={{ color: streamDef.color }} />
                  Learning Resources for Missing Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.missing.slice(0, 4).map((skill) => {
                    const resource = getStreamSkillResource(userStream, skill);
                    return (
                      <div
                        key={skill}
                        className="p-4 rounded-xl border border-white/8 bg-white/3"
                      >
                        <p className="text-white font-medium text-sm mb-2">
                          {skill}
                        </p>
                        {resource ? (
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={resource.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-red-400 text-xs hover:text-red-300"
                            >
                              <ExternalLink size={11} /> YouTube
                            </a>
                            <a
                              href={resource.docs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300"
                            >
                              <ExternalLink size={11} /> Docs
                            </a>
                            <a
                              href={resource.practice}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-green-400 text-xs hover:text-green-300"
                            >
                              <ExternalLink size={11} /> Practice
                            </a>
                          </div>
                        ) : (
                          <a
                            href="/learning-resources"
                            className="text-purple-400 text-xs hover:text-purple-300"
                          >
                            View learning resources →
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {streamRoles.length === 0 && (
          <div
            className="glass-card p-8 text-center"
            data-ocid="skill_gap.empty_state"
          >
            <p className="text-white/40">
              No roles found for your stream. Please select a stream first.
            </p>
            <a
              href="/stream-select"
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              Select Stream
            </a>
          </div>
        )}
      </div>
    </AppShell>
  );
}
