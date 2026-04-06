import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Circle,
  Code2,
  Target,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { getUserStream } from "../utils/auth";
import { CAREER_ROADMAPS } from "../utils/roleData";
import { loadCareerProfile, saveCareerProfile } from "../utils/storage";
import {
  type StreamId,
  getStreamById,
  getStreamRoles,
} from "../utils/streamData";

const ICON_MAP: Record<
  string,
  React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>
> = {
  BookOpen,
  Code2,
  Target,
  Briefcase,
};

interface RoadmapItem {
  id: string;
  label: string;
  type: "skill" | "project" | "task";
}

interface RoadmapPhase {
  title: string;
  icon: string;
  color: string;
  items: RoadmapItem[];
}

function buildStreamRoadmap(roleId: string, skills: string[]): RoadmapPhase[] {
  const slug = roleId.toLowerCase().replace(/\s+/g, "-");
  return [
    {
      title: "Phase 1: Foundation Skills",
      icon: "BookOpen",
      color: "#7C5CFF",
      items: skills.slice(0, 4).map((s, i) => ({
        id: `${slug}-skill-${i}`,
        label: `Learn ${s}`,
        type: "skill" as const,
      })),
    },
    {
      title: "Phase 2: Build & Practice",
      icon: "Code2",
      color: "#35D0C7",
      items: [
        {
          id: `${slug}-project-1`,
          label: `Build a ${roleId} practice project`,
          type: "project" as const,
        },
        {
          id: `${slug}-project-2`,
          label: "Document your projects on GitHub",
          type: "project" as const,
        },
        {
          id: `${slug}-project-3`,
          label: "Contribute to an open-source project",
          type: "project" as const,
        },
      ],
    },
    {
      title: "Phase 3: Job Readiness",
      icon: "Briefcase",
      color: "#39D98A",
      items: [
        {
          id: `${slug}-prep-1`,
          label: "Prepare your resume and portfolio",
          type: "task" as const,
        },
        {
          id: `${slug}-prep-2`,
          label: "Practice mock interviews",
          type: "task" as const,
        },
        {
          id: `${slug}-prep-3`,
          label: "Apply to relevant job listings",
          type: "task" as const,
        },
        {
          id: `${slug}-prep-4`,
          label: "Network on LinkedIn and attend career fairs",
          type: "task" as const,
        },
      ],
    },
  ];
}

export default function CareerRoadmap() {
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream as StreamId);
  const streamRoles = getStreamRoles(userStream as StreamId);

  const profile = loadCareerProfile();

  // Build role options: stream roles first, then legacy CAREER_ROADMAPS roles
  const streamRoleNames = streamRoles.map((r) => r.name);
  const legacyRoleNames = Object.keys(CAREER_ROADMAPS).filter(
    (r) => !streamRoleNames.includes(r),
  );
  const ALL_ROLE_OPTIONS = [...streamRoleNames, ...legacyRoleNames];

  const defaultRole =
    profile?.targetRole && ALL_ROLE_OPTIONS.includes(profile.targetRole)
      ? profile.targetRole
      : (ALL_ROLE_OPTIONS[0] ?? "");

  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(profile?.completedSteps ?? []),
  );

  // Build roadmap: use CAREER_ROADMAPS if it exists, otherwise build from stream data
  const getRoadmap = (role: string): RoadmapPhase[] => {
    if (CAREER_ROADMAPS[role]) return CAREER_ROADMAPS[role];
    const streamRole = streamRoles.find((r) => r.name === role);
    if (streamRole) return buildStreamRoadmap(role, streamRole.requiredSkills);
    return [];
  };

  const roadmap = getRoadmap(selectedRole);

  const toggleStep = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      const current = loadCareerProfile();
      const allItems = roadmap.flatMap((p) => p.items);
      saveCareerProfile({
        targetRole: selectedRole,
        completedSteps: Array.from(next),
        readinessScore: Math.round((next.size / allItems.length) * 100),
        learningPlan: current?.learningPlan ?? [],
      });
      return next;
    });
  };

  const totalItems = roadmap.flatMap((p) => p.items).length;
  const completedCount = roadmap
    .flatMap((p) => p.items)
    .filter((item) => completed.has(item.id)).length;
  const overallProgress =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <AppShell title="Career Roadmap" subtitle="Your step-by-step guide">
      <div className="max-w-4xl mx-auto" data-ocid="career_roadmap.page">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Career Roadmap</h1>
            <p className="text-white/40 text-sm mt-0.5">
              Track your progress from student to hired professional
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

        {/* Role selector + progress */}
        <div
          className="glass-card p-5 mb-6"
          data-ocid="career_roadmap.controls.panel"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm font-medium">Role:</span>
              <div className="relative">
                <select
                  data-ocid="career_roadmap.role.select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="input-dark pr-8 appearance-none py-2 text-sm"
                >
                  {streamRoleNames.length > 0 && (
                    <optgroup
                      label={`${streamDef.label} Roles`}
                      style={{ background: "#0B1236" }}
                    >
                      {streamRoleNames.map((r) => (
                        <option
                          key={r}
                          value={r}
                          style={{ background: "#0B1236" }}
                        >
                          {r}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {legacyRoleNames.length > 0 && (
                    <optgroup
                      label="Other Roles"
                      style={{ background: "#0B1236" }}
                    >
                      {legacyRoleNames.map((r) => (
                        <option
                          key={r}
                          value={r}
                          style={{ background: "#0B1236" }}
                        >
                          {r}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/50">Overall Progress</span>
                <span className="text-white font-semibold">
                  {completedCount}/{totalItems} tasks ({overallProgress}%)
                </span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Progress saved automatically!")}
              className="btn-primary text-xs py-2 px-4"
              data-ocid="career_roadmap.save.button"
            >
              Save Progress
            </button>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-6">
          {roadmap.map((phase, phaseIdx) => {
            const Icon = ICON_MAP[phase.icon] ?? BookOpen;
            const phaseItems = phase.items;
            const phaseCompleted = phaseItems.filter((item) =>
              completed.has(item.id),
            ).length;
            const phaseProgress = Math.round(
              (phaseCompleted / phaseItems.length) * 100,
            );

            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                key={phaseIdx}
                className="glass-card p-5"
                data-ocid={`career_roadmap.phase.item.${phaseIdx + 1}`}
              >
                {/* Phase header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${phase.color}20` }}
                    >
                      <Icon
                        size={18}
                        style={{ color: phase.color } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {phase.title}
                      </h3>
                      <p className="text-white/40 text-xs">
                        {phaseCompleted}/{phaseItems.length} completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: phase.color }}
                    >
                      {phaseProgress}%
                    </span>
                    {phaseProgress === 100 && (
                      <div className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                        Done!
                      </div>
                    )}
                  </div>
                </div>

                {/* Phase progress bar */}
                <div className="progress-bar-track mb-4">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${phaseProgress}%`,
                      background: `linear-gradient(90deg, ${phase.color}, ${phase.color}99)`,
                    }}
                  />
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {phaseItems.map((item, itemIdx) => {
                    const isDone = completed.has(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleStep(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                          isDone
                            ? "bg-green-500/10 border-green-500/25 hover:bg-green-500/15"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                        data-ocid={`career_roadmap.step.item.${phaseIdx * 10 + itemIdx + 1}`}
                      >
                        {isDone ? (
                          <CheckCircle2
                            size={18}
                            className="text-green-400 flex-shrink-0"
                          />
                        ) : (
                          <Circle
                            size={18}
                            className="text-white/20 flex-shrink-0"
                          />
                        )}
                        <span
                          className={`text-sm flex-1 ${
                            isDone
                              ? "text-white/60 line-through"
                              : "text-white/80"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            item.type === "skill"
                              ? "bg-purple-500/15 text-purple-300"
                              : item.type === "project"
                                ? "bg-cyan-500/15 text-cyan-300"
                                : "bg-orange-500/15 text-orange-300"
                          }`}
                        >
                          {item.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {ALL_ROLE_OPTIONS.length === 0 && (
          <div
            className="glass-card p-8 text-center"
            data-ocid="career_roadmap.empty_state"
          >
            <p className="text-white/40">
              No roles found. Please select a stream first.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
