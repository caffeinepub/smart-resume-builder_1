import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BarChart2,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileText,
  Flame,
  GraduationCap,
  Map as MapIcon,
  MessageSquare,
  Mic,
  Target,
  TrendingUp,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppShell from "../components/AppShell";
import { getScoreColor, getScoreLabel } from "../utils/atsEngine";
import { getStoredAuth, getUserKey, getUserStream } from "../utils/auth";
import { getStreak } from "../utils/extras";
import {
  getResumeCompletionPercent,
  loadATSResult,
  loadCareerProfile,
  loadResume,
} from "../utils/storage";
import {
  getStreamById,
  getStreamRoleEligibility,
  getStreamRoles,
} from "../utils/streamData";

const FEATURE_CARDS = [
  {
    title: "Create Resume",
    desc: "Build your professional resume",
    path: "/resume-builder",
    icon: FileText,
    color: "#7C5CFF",
    bg: "rgba(124,92,255,0.15)",
  },
  {
    title: "Analyze Resume",
    desc: "Check ATS score & keywords",
    path: "/ats-analyzer",
    icon: Target,
    color: "#35D0C7",
    bg: "rgba(53,208,199,0.15)",
  },
  {
    title: "Career Roles",
    desc: "Find your eligible roles",
    path: "/role-eligibility",
    icon: Award,
    color: "#39D98A",
    bg: "rgba(57,217,138,0.15)",
  },
  {
    title: "Skill Learning",
    desc: "Learn missing skills",
    path: "/learning-resources",
    icon: BookOpen,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.15)",
  },
  {
    title: "Free Certifications",
    desc: "Earn industry certificates",
    path: "/certifications",
    icon: GraduationCap,
    color: "#EC4899",
    bg: "rgba(236,72,153,0.15)",
  },
  {
    title: "Projects",
    desc: "Portfolio-worthy project ideas",
    path: "/projects",
    icon: Code2,
    color: "#6366F1",
    bg: "rgba(99,102,241,0.15)",
  },
  {
    title: "Mock Tests",
    desc: "Practice aptitude & skills",
    path: "/mock-tests",
    icon: ClipboardCheck,
    color: "#F97316",
    bg: "rgba(249,115,22,0.15)",
  },
  {
    title: "Jobs & Internships",
    desc: "Apply on top platforms",
    path: "/jobs",
    icon: Briefcase,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.15)",
  },
  {
    title: "Career Roadmap",
    desc: "Step-by-step career path",
    path: "/career-roadmap",
    icon: MapIcon,
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.15)",
  },
  {
    title: "Profile Progress",
    desc: "Track your readiness",
    path: "/dashboard",
    icon: BarChart2,
    color: "#A855F7",
    bg: "rgba(168,85,247,0.15)",
  },
  {
    title: "My Profile",
    desc: "Edit your career profile",
    path: "/profile",
    icon: User,
    color: "#EC4899",
    bg: "rgba(236,72,153,0.15)",
  },
  {
    title: "Skill Tracker",
    desc: "Track learning progress",
    path: "/skill-tracker",
    icon: TrendingUp,
    color: "#39D98A",
    bg: "rgba(57,217,138,0.15)",
  },
  {
    title: "Interview Prep",
    desc: "Prepare for interviews",
    path: "/interview-prep",
    icon: MessageSquare,
    color: "#35D0C7",
    bg: "rgba(53,208,199,0.15)",
  },
  {
    title: "Mock Interview",
    desc: "Simulated interview mode",
    path: "/mock-interview",
    icon: Mic,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.15)",
  },
];

function ScoreRing({
  score,
  color,
  size = 120,
}: { score: number; color: string; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
      <title>Score ring</title>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="8"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

function EmptyAnalyticsState() {
  return (
    <div
      className="glass-card p-10 flex flex-col items-center justify-center text-center col-span-full"
      data-ocid="dashboard.empty_state"
    >
      <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
        <BarChart2 size={36} className="text-purple-400" />
      </div>
      <h3 className="text-white font-bold text-xl mb-2">
        Start your career journey
      </h3>
      <p className="text-white/50 text-sm mb-6 max-w-sm">
        Create or Upload a Resume to see your ATS score, skill gaps, eligible
        roles, and career readiness.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/resume-builder"
          className="btn-primary flex items-center gap-2 py-2.5 px-5"
          data-ocid="dashboard.empty_state.create_resume.button"
        >
          <FileText size={15} /> Build Resume
        </Link>
        <Link
          to="/ats-analyzer"
          className="btn-secondary flex items-center gap-2 py-2.5 px-5"
          data-ocid="dashboard.empty_state.analyze_resume.button"
        >
          <Target size={15} /> Analyze Resume
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const resume = loadResume();
  const atsResult = loadATSResult();
  const careerProfile = loadCareerProfile();
  const auth = getStoredAuth();

  const hasData = !!(resume || atsResult);

  // Stream info
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);
  const streamRoles = getStreamRoles(userStream);

  const completionPct = getResumeCompletionPercent(resume);
  const atsScore = atsResult?.score ?? 0;
  const readiness = careerProfile?.readinessScore ?? 0;
  const streakData = getStreak();

  const certCount = (() => {
    try {
      const bm = localStorage.getItem(getUserKey("smartresume_bookmarks"));
      return bm ? (JSON.parse(bm) as string[]).length : 0;
    } catch {
      return 0;
    }
  })();

  const certsCompleted = (() => {
    try {
      const raw = localStorage.getItem(
        getUserKey("smartresume_cert_completions"),
      );
      return raw ? (JSON.parse(raw) as string[]).length : 0;
    } catch {
      return 0;
    }
  })();

  const skillTrackerData = (() => {
    try {
      const raw = localStorage.getItem(getUserKey("smartresume_skill_tracker"));
      if (!raw)
        return {
          total: 0,
          completed: 0,
          items: [] as Array<{ name: string; status: string }>,
        };
      const items = JSON.parse(raw) as Array<{ name: string; status: string }>;
      return {
        total: items.length,
        completed: items.filter((s) => s.status === "Completed").length,
        items: items.slice(0, 3),
      };
    } catch {
      return { total: 0, completed: 0, items: [] };
    }
  })();

  const completedProjects = (() => {
    try {
      const raw = localStorage.getItem(
        getUserKey("smartresume_project_status"),
      );
      if (!raw) return 0;
      const obj = JSON.parse(raw) as Record<string, string>;
      return Object.values(obj).filter((s) => s === "Completed").length;
    } catch {
      return 0;
    }
  })();

  const careerReadiness = Math.round(
    completionPct * 0.3 +
      atsScore * 0.3 +
      Math.min(certCount * 5, 20) +
      readiness * 0.2 +
      Math.min(certsCompleted * 4, 12) +
      Math.min(completedProjects * 5, 15),
  );

  useEffect(() => {
    if (resume && completionPct > 0) {
      const key = `dashboard_notif_${completionPct}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
      }
    }
  }, [resume, completionPct]);

  // Stream-based eligible roles
  const eligibleRoles = useMemo(() => {
    if (!resume) return [];
    return streamRoles
      .map((role) => ({
        name: role.name,
        ...getStreamRoleEligibility(resume.skills, role),
      }))
      .filter((r) => r.eligible);
  }, [resume, streamRoles]);

  // Stream-based skill coverage chart
  const skillCoverageData = useMemo(() => {
    if (!resume) return [];
    return streamRoles.slice(0, 6).map((role) => {
      const { matchPercent } = getStreamRoleEligibility(resume.skills, role);
      return {
        role: role.name.split(" ").slice(0, 2).join(" "),
        percent: matchPercent,
      };
    });
  }, [resume, streamRoles]);

  // Stream-based top skills recommendations
  const topSkills = useMemo(() => {
    const allSkills = streamRoles.flatMap((r) => r.requiredSkills);
    const unique = [...new Set(allSkills)];
    const userSkills = resume?.skills.map((s) => s.toLowerCase()) ?? [];
    // Prioritize skills user doesn't have yet
    const missing = unique.filter(
      (s) => !userSkills.some((us) => us.includes(s.toLowerCase())),
    );
    const prioritized = [
      ...missing,
      ...unique.filter((s) => !missing.includes(s)),
    ];
    return prioritized.slice(0, 5).map((skill) => ({
      skill,
      category: streamDef.label,
    }));
  }, [streamRoles, resume, streamDef.label]);

  const radarData = [
    { subject: "Resume", value: completionPct },
    { subject: "ATS Score", value: atsScore },
    {
      subject: "Skills",
      value: Math.min((resume?.skills.length ?? 0) * 10, 100),
    },
    {
      subject: "Projects",
      value: Math.min((resume?.projects.length ?? 0) * 25, 100),
    },
    { subject: "Readiness", value: readiness },
  ];

  const kpis = [
    {
      label: "Resume Completion",
      value: `${completionPct}%`,
      icon: FileText,
      color: "#7C5CFF",
      sub: completionPct >= 80 ? "Great" : "Needs work",
      num: completionPct,
    },
    {
      label: "ATS Score",
      value: `${atsScore}/100`,
      icon: Target,
      color: getScoreColor(atsScore),
      sub: getScoreLabel(atsScore),
      num: atsScore,
    },
    {
      label: "Eligible Roles",
      value: `${eligibleRoles.length}`,
      icon: Award,
      color: "#39D98A",
      sub: `of ${streamRoles.length} roles`,
      num:
        streamRoles.length > 0
          ? (eligibleRoles.length / streamRoles.length) * 100
          : 0,
    },
    {
      label: "Career Readiness",
      value: `${readiness}%`,
      icon: TrendingUp,
      color: "#4B8BFF",
      sub: "Keep improving",
      num: readiness,
    },
    {
      label: "Certifications",
      value: `${certCount}`,
      icon: GraduationCap,
      color: "#EC4899",
      sub: "bookmarked",
      num: certCount * 10,
    },
    {
      label: "Projects Built",
      value: `${resume?.projects.length ?? 0}`,
      icon: Code2,
      color: "#F97316",
      sub: "in resume",
      num: (resume?.projects.length ?? 0) * 25,
    },
    {
      label: "Skills Tracked",
      value: `${skillTrackerData.total}`,
      icon: TrendingUp,
      color: "#39D98A",
      sub: `${skillTrackerData.completed} completed`,
      num:
        skillTrackerData.total > 0
          ? (skillTrackerData.completed / skillTrackerData.total) * 100
          : 0,
    },
    {
      label: "Certs Completed",
      value: `${certsCompleted}`,
      icon: GraduationCap,
      color: "#35D0C7",
      sub: "finished courses",
      num: Math.min(certsCompleted * 10, 100),
    },
  ];

  return (
    <AppShell title="Dashboard" subtitle="Your career overview">
      <div className="max-w-7xl mx-auto space-y-6" data-ocid="dashboard.page">
        {/* Welcome Banner with Stream Badge */}
        <div
          className="glass-card p-5 flex items-center justify-between gap-4"
          data-ocid="dashboard.welcome.card"
        >
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white">
              Welcome back, {auth?.name ?? "User"}
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Your personalized career platform
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{
                color: streamDef.color,
                background: `${streamDef.color}15`,
                borderColor: `${streamDef.color}35`,
              }}
              data-ocid="dashboard.stream.badge"
            >
              {streamDef.label}
            </span>
            <Link
              to="/stream-select"
              className="text-white/30 text-[10px] hover:text-white/60 transition-colors"
              data-ocid="dashboard.change_stream.link"
            >
              Change Stream
            </Link>
          </div>
        </div>

        {/* Feature Navigation Grid */}
        <div data-ocid="dashboard.features.section">
          <h2 className="section-heading mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {FEATURE_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.path + card.title}
                  to={card.path}
                  className="glass-card-hover p-4 flex flex-col items-center text-center gap-2 group"
                  data-ocid={`dashboard.feature.item.${i + 1}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: card.bg }}
                  >
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <p className="text-white text-xs font-semibold leading-tight">
                    {card.title}
                  </p>
                  <p className="text-white/40 text-[10px] leading-tight hidden sm:block">
                    {card.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Streak Card — always visible */}
        <div
          className="glass-card p-5 flex items-center gap-4"
          data-ocid="dashboard.streak.card"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-500/15 border border-orange-500/25">
            <Flame size={28} className="text-orange-400" />
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider font-medium">
              Daily Streak
            </p>
            <p className="text-3xl font-extrabold text-white">
              {streakData.count}{" "}
              <span className="text-lg text-orange-400">days</span>
            </p>
            <p className="text-white/40 text-xs mt-0.5">
              Keep logging in daily to maintain your streak!
            </p>
          </div>
        </div>

        {/* Analytics — only shown when data exists */}
        {hasData ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
              {kpis.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                    key={i}
                    className={`kpi-card animate-fade-in-up stagger-${i + 1}`}
                    data-ocid={`dashboard.kpi.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white/50 text-[10px] font-medium uppercase tracking-wider">
                        {kpi.label}
                      </p>
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${kpi.color}20` }}
                      >
                        <Icon size={13} style={{ color: kpi.color }} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {kpi.value}
                    </div>
                    <p className="text-white/40 text-[10px]">{kpi.sub}</p>
                    <div className="progress-bar-track mt-2">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${Math.min(kpi.num, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Career Readiness Meter */}
            <div
              className="glass-card p-5"
              data-ocid="dashboard.readiness_meter.card"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/50 text-xs uppercase tracking-wider font-medium">
                  Career Readiness Score
                </p>
                <span
                  className="text-2xl font-extrabold"
                  style={{ color: getScoreColor(careerReadiness) }}
                >
                  {careerReadiness}%
                </span>
              </div>
              <div className="progress-bar-track h-4 mb-2">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${careerReadiness}%`,
                    background: `linear-gradient(90deg, #7C5CFF, ${getScoreColor(careerReadiness)})`,
                  }}
                />
              </div>
              <p className="text-white/40 text-xs">
                {careerReadiness >= 80
                  ? "You're job-ready! 🎉"
                  : careerReadiness >= 50
                    ? "Making good progress 👍"
                    : "Keep learning and building! 💪"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ATS Score Ring */}
              <div
                className="glass-card p-6 flex flex-col items-center"
                data-ocid="dashboard.ats_score.panel"
              >
                <h3 className="section-heading text-center">ATS Score</h3>
                <div className="relative">
                  <ScoreRing
                    score={atsScore}
                    color={getScoreColor(atsScore)}
                    size={140}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {atsScore}
                    </span>
                    <span className="text-white/40 text-xs">/100</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span
                    className="text-lg font-semibold"
                    style={{ color: getScoreColor(atsScore) }}
                  >
                    {getScoreLabel(atsScore)}
                  </span>
                  <p className="text-white/40 text-sm mt-1">
                    Last analyzed{" "}
                    {atsResult?.analyzedAt
                      ? new Date(atsResult.analyzedAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <Link
                  to="/ats-analyzer"
                  className="mt-4 btn-secondary text-xs py-2 px-4 flex items-center gap-1"
                  data-ocid="dashboard.ats_analyzer.button"
                >
                  Analyze Again <ArrowRight size={12} />
                </Link>
              </div>

              {/* Skill Coverage Chart */}
              {resume && skillCoverageData.length > 0 ? (
                <div
                  className="glass-card p-6 lg:col-span-2"
                  data-ocid="dashboard.skills_chart.panel"
                >
                  <h3 className="section-heading">
                    {streamDef.label} Role Coverage
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={skillCoverageData}
                      margin={{ top: 4, right: 4, bottom: 4, left: -20 }}
                    >
                      <XAxis
                        dataKey="role"
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(11,18,54,0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          color: "#fff",
                        }}
                        formatter={(v: number) => [`${v}%`, "Match"]}
                      />
                      <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
                        {skillCoverageData.map((_, idx) => (
                          <Cell
                            // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                            key={idx}
                            fill={idx % 2 === 0 ? streamDef.color : "#35D0C7"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div
                  className="glass-card p-6 lg:col-span-2 flex flex-col items-center justify-center text-center"
                  data-ocid="dashboard.skills_chart.empty"
                >
                  <BarChart2 size={36} className="text-white/20 mb-3" />
                  <p className="text-white/50 font-medium">No Skill Data Yet</p>
                  <p className="text-white/30 text-sm mt-1 mb-4">
                    Build your resume to see role skill coverage
                  </p>
                  <Link
                    to="/resume-builder"
                    className="btn-secondary text-xs py-2 px-4 flex items-center gap-1"
                  >
                    Build Resume <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>

            {/* Skill Recommendations */}
            <div
              className="glass-card p-6"
              data-ocid="dashboard.skill_recommendations.panel"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="section-heading">Skill Recommendations</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    color: streamDef.color,
                    background: `${streamDef.color}15`,
                    borderColor: `${streamDef.color}35`,
                  }}
                >
                  {streamDef.label}
                </span>
              </div>
              <p className="text-white/40 text-sm mb-4">
                Top skills to learn based on your stream's role requirements
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {topSkills.map((item, i) => (
                  <div
                    key={item.skill}
                    className="glass-card-hover p-4"
                    data-ocid={`dashboard.skill_rec.item.${i + 1}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{ background: `${streamDef.color}20` }}
                    >
                      <Zap size={14} style={{ color: streamDef.color }} />
                    </div>
                    <p className="text-white font-semibold text-sm">
                      {item.skill}
                    </p>
                    <p className="text-white/40 text-xs mb-3">
                      {item.category}
                    </p>
                    <Link
                      to="/learning-resources"
                      className="text-cyan-400 text-xs flex items-center gap-1 hover:text-cyan-300"
                      data-ocid={`dashboard.skill_rec.learn.${i + 1}`}
                    >
                      Learn Now <ArrowRight size={11} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Career Readiness Radar */}
              <div
                className="glass-card p-6"
                data-ocid="dashboard.readiness.panel"
              >
                <h3 className="section-heading">Career Readiness</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke={streamDef.color}
                      fill={streamDef.color}
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Eligible Roles */}
              <div
                className="glass-card p-6"
                data-ocid="dashboard.eligible_roles.panel"
              >
                <h3 className="section-heading">Eligible Roles</h3>
                <div className="space-y-2">
                  {eligibleRoles.length === 0 ? (
                    <p
                      className="text-white/40 text-sm"
                      data-ocid="dashboard.eligible_roles.empty_state"
                    >
                      Add more skills to unlock eligible roles
                    </p>
                  ) : (
                    eligibleRoles.map((r, i) => (
                      <div
                        key={r.name}
                        className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                        data-ocid={`dashboard.eligible_roles.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            size={14}
                            className="text-green-400 flex-shrink-0"
                          />
                          <span className="text-white text-sm">{r.name}</span>
                        </div>
                        <span className="text-green-400 text-xs font-semibold">
                          {r.matchPercent}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  to="/role-eligibility"
                  className="mt-4 text-purple-400 text-xs flex items-center gap-1 hover:text-purple-300"
                  data-ocid="dashboard.view_roles.link"
                >
                  View All Roles <ArrowRight size={12} />
                </Link>
              </div>

              {/* Missing Skills */}
              <div
                className="glass-card p-6"
                data-ocid="dashboard.missing_skills.panel"
              >
                <h3 className="section-heading">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {!atsResult ? (
                    <p
                      className="text-white/40 text-sm"
                      data-ocid="dashboard.missing_skills.no_analysis"
                    >
                      Run ATS analysis to see missing skills
                    </p>
                  ) : atsResult.missingSkills.length === 0 ? (
                    <p
                      className="text-white/40 text-sm"
                      data-ocid="dashboard.missing_skills.empty_state"
                    >
                      Great! No critical skills missing
                    </p>
                  ) : (
                    atsResult.missingSkills.slice(0, 8).map((skill, i) => (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                        key={i}
                        className="skill-chip-missing flex items-center gap-1"
                        data-ocid={`dashboard.missing_skills.item.${i + 1}`}
                      >
                        <XCircle size={11} /> {skill}
                      </span>
                    ))
                  )}
                </div>
                <Link
                  to="/learning-resources"
                  className="mt-4 text-cyan-400 text-xs flex items-center gap-1 hover:text-cyan-300"
                  data-ocid="dashboard.learn.link"
                >
                  Start Learning <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Skill Progress Summary */}
            {skillTrackerData.total > 0 && (
              <div
                className="glass-card p-6"
                data-ocid="dashboard.skill_progress.panel"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-heading">Skill Progress</h3>
                  <Link
                    to="/skill-tracker"
                    className="text-purple-400 text-xs flex items-center gap-1 hover:text-purple-300"
                    data-ocid="dashboard.skill_tracker.link"
                  >
                    View All <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {skillTrackerData.items.map((skill, i) => {
                    const pct =
                      skill.status === "Completed"
                        ? 100
                        : skill.status === "Practicing"
                          ? 66
                          : 33;
                    const color =
                      skill.status === "Completed"
                        ? "#39D98A"
                        : skill.status === "Practicing"
                          ? "#4B8BFF"
                          : "#F59E0B";
                    return (
                      <div
                        key={`${skill.name}-${i}`}
                        data-ocid={`dashboard.skill_progress.item.${i + 1}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">
                            {skill.name}
                          </span>
                          <span
                            className="text-xs font-semibold"
                            style={{ color }}
                          >
                            {skill.status}
                          </span>
                        </div>
                        <div className="progress-bar-track">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${pct}%`,
                              background: `linear-gradient(90deg, ${color}aa, ${color})`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyAnalyticsState />
        )}
      </div>
    </AppShell>
  );
}
