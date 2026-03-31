import {
  Activity,
  Award,
  BarChart2,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  Cog,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  Link as LinkIcon,
  Monitor,
  Palette,
  Server,
  Settings2,
  Shield,
  Target,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import AppShell from "../components/AppShell";
import { getUserStream } from "../utils/auth";
import { loadResume } from "../utils/storage";
import { getStreamRoleEligibility, getStreamRoles } from "../utils/streamData";

const ICON_MAP: Record<
  string,
  React.ComponentType<{
    size?: number;
    style?: React.CSSProperties;
    className?: string;
  }>
> = {
  Monitor,
  Server,
  Globe,
  Code2,
  BarChart2,
  Layers,
  Settings2,
  Brain,
  Cog,
  Zap,
  Building2,
  Briefcase,
  Heart,
  TrendingUp,
  Palette,
  Target,
  Activity,
  Award,
  DollarSign,
  FileText,
  GraduationCap,
  Shield,
  Users,
  LinkIcon,
};

export default function RoleEligibility() {
  const resume = loadResume();
  const skills = resume?.skills ?? [];
  const userStream = getUserStream();
  const streamRoles = getStreamRoles(userStream);

  const roleResults = useMemo(() => {
    return streamRoles.map((role) => ({
      name: role.name,
      role,
      ...getStreamRoleEligibility(skills, role),
    }));
  }, [skills, streamRoles]);

  const eligible = roleResults.filter((r) => r.eligible);
  const ineligible = roleResults.filter((r) => !r.eligible);

  return (
    <AppShell
      title="Role Eligibility"
      subtitle="See which roles you qualify for"
    >
      <div className="max-w-6xl mx-auto" data-ocid="role_eligibility.page">
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Role Eligibility</h1>
            <p className="text-white/40 text-sm mt-0.5">
              Based on your {skills.length} skills from your saved resume
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-green-400">
              {eligible.length}
            </div>
            <div className="text-white/50 text-sm">Eligible Roles</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-white">
              {roleResults.length}
            </div>
            <div className="text-white/50 text-sm">Total Roles</div>
          </div>
          <div className="glass-card p-4 text-center col-span-2 sm:col-span-1">
            <div className="text-3xl font-bold text-purple-400">
              {skills.length}
            </div>
            <div className="text-white/50 text-sm">Your Skills</div>
          </div>
        </div>

        {/* Eligible roles */}
        {eligible.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-400" /> Eligible
              Roles ({eligible.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eligible.map((r, i) => {
                const Icon = ICON_MAP[r.role.icon] ?? Monitor;
                return (
                  <div
                    key={r.name}
                    className="glass-card p-5 border border-green-500/20 animate-fade-in-up"
                    style={{
                      background: "rgba(57, 217, 138, 0.06)",
                      animationDelay: `${i * 0.1}s`,
                    }}
                    data-ocid={`role_eligibility.eligible.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: `${r.role.color}20` }}
                      >
                        <Icon size={20} style={{ color: r.role.color }} />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30">
                        <CheckCircle2 size={12} className="text-green-400" />
                        <span className="text-green-400 text-xs font-semibold">
                          Eligible
                        </span>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{r.name}</h3>
                    <p className="text-white/40 text-xs mb-3">
                      {r.role.description}
                    </p>

                    {/* Match bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Skill Match</span>
                        <span className="text-green-400 font-semibold">
                          {r.matchPercent}%
                        </span>
                      </div>
                      <div className="progress-bar-track">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${r.matchPercent}%`,
                            background:
                              "linear-gradient(90deg, #39D98A, #35D0C7)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Skills chips */}
                    <div className="flex flex-wrap gap-1">
                      {r.matched.map((s) => (
                        <span
                          key={s}
                          className="skill-chip-known text-[10px] px-2 py-0.5"
                        >
                          {s}
                        </span>
                      ))}
                      {r.missing.map((s) => (
                        <span
                          key={s}
                          className="skill-chip-missing text-[10px] px-2 py-0.5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ineligible roles */}
        {ineligible.length > 0 && (
          <div>
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <XCircle size={18} className="text-red-400" /> Not Yet Eligible (
              {ineligible.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ineligible.map((r, i) => {
                const Icon = ICON_MAP[r.role.icon] ?? Monitor;
                return (
                  <div
                    key={r.name}
                    className="glass-card p-5 opacity-70"
                    data-ocid={`role_eligibility.ineligible.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/5">
                        <Icon size={20} className="text-white/40" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        <XCircle size={12} className="text-white/40" />
                        <span className="text-white/40 text-xs font-medium">
                          {r.matchPercent}% match
                        </span>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{r.name}</h3>
                    <p className="text-white/40 text-xs mb-3">
                      {r.role.description}
                    </p>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/40">
                          Need {r.missing.length} more skills
                        </span>
                        <span className="text-white/40">{r.matchPercent}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${r.matchPercent}%`,
                            background: "rgba(255,255,255,0.2)",
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {r.missing.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="skill-chip-missing text-[10px] px-2 py-0.5"
                        >
                          {s}
                        </span>
                      ))}
                      {r.missing.length > 3 && (
                        <span className="skill-chip text-[10px]">
                          +{r.missing.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No resume state */}
        {skills.length === 0 && (
          <div
            className="glass-card p-10 text-center mt-6"
            data-ocid="role_eligibility.empty_state"
          >
            <p className="text-white/40 mb-3">
              No skills found. Build your resume to see eligible roles.
            </p>
            <a href="/resume-builder" className="btn-primary text-sm py-2 px-5">
              Build Resume
            </a>
          </div>
        )}
      </div>
    </AppShell>
  );
}
