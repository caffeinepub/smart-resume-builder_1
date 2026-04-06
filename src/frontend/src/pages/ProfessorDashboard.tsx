import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  CheckCircle,
  ChevronDown,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getRegisteredUsers } from "../utils/auth";
import {
  clearCurrentRole,
  clearProfessorAuth,
  getCurrentRole,
  getProfessorAuth,
} from "../utils/roleAuth";

type Section = "dashboard" | "students" | "analytics";

interface StudentInfo {
  phone: string;
  name: string;
  stream: string;
  atsScore: number | null;
  hasResume: boolean;
  hasProfile: boolean;
  placementReady: boolean;
  feedbacks: string[];
}

function getStudentData(): StudentInfo[] {
  const users = getRegisteredUsers();
  return Object.entries(users).map(([phone, name]) => {
    const stream = localStorage.getItem(`stream_${phone}`) ?? "";
    let atsScore: number | null = null;
    try {
      const raw = localStorage.getItem(`ats_${phone}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        atsScore = typeof parsed.score === "number" ? parsed.score : null;
      }
    } catch {
      /* ignore */
    }
    const hasResume = !!localStorage.getItem(`resume_${phone}`);
    const hasProfile = !!localStorage.getItem(`profile_${phone}`);
    const placementReady =
      localStorage.getItem(`placement_ready_${phone}`) === "true";
    let feedbacks: string[] = [];
    try {
      const raw = localStorage.getItem(`prof_feedback_${phone}`);
      if (raw) feedbacks = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return {
      phone,
      name,
      stream,
      atsScore,
      hasResume,
      hasProfile,
      placementReady,
      feedbacks,
    };
  });
}

export default function ProfessorDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("dashboard");
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [streamFilter, setStreamFilter] = useState("All");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{
    phone: string;
    name: string;
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [projectModal, setProjectModal] = useState<{
    phone: string;
    name: string;
  } | null>(null);
  const [projectText, setProjectText] = useState("");
  const prof = getProfessorAuth();

  useEffect(() => {
    if (getCurrentRole() !== "professor" || !getProfessorAuth()) {
      navigate({ to: "/" });
      return;
    }
    setStudents(getStudentData());
  }, [navigate]);

  const handleLogout = () => {
    clearProfessorAuth();
    clearCurrentRole();
    navigate({ to: "/" });
  };

  const handleTogglePlacement = (phone: string) => {
    const current = localStorage.getItem(`placement_ready_${phone}`) === "true";
    localStorage.setItem(`placement_ready_${phone}`, String(!current));
    setStudents(getStudentData());
  };

  const handleAddFeedback = () => {
    if (!feedbackModal || !feedbackText.trim()) return;
    let existing: string[] = [];
    try {
      const raw = localStorage.getItem(`prof_feedback_${feedbackModal.phone}`);
      if (raw) existing = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    existing.push(feedbackText.trim());
    localStorage.setItem(
      `prof_feedback_${feedbackModal.phone}`,
      JSON.stringify(existing),
    );
    setFeedbackModal(null);
    setFeedbackText("");
    setStudents(getStudentData());
  };

  const handleAssignProject = () => {
    if (!projectModal || !projectText.trim()) return;
    localStorage.setItem(
      `prof_assigned_project_${projectModal.phone}`,
      projectText.trim(),
    );
    setProjectModal(null);
    setProjectText("");
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      !searchQ ||
      s.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      s.phone.includes(searchQ);
    const matchStream = streamFilter === "All" || s.stream === streamFilter;
    return matchSearch && matchStream;
  });

  const allStreams = [
    "All",
    ...Array.from(new Set(students.map((s) => s.stream).filter(Boolean))),
  ];
  const totalStudents = students.length;
  const withResume = students.filter((s) => s.hasResume).length;
  const placementReadyCount = students.filter((s) => s.placementReady).length;
  const avgATS =
    students.filter((s) => s.atsScore !== null).length > 0
      ? Math.round(
          students
            .filter((s) => s.atsScore !== null)
            .reduce((acc, s) => acc + (s.atsScore ?? 0), 0) /
            students.filter((s) => s.atsScore !== null).length,
        )
      : null;

  const streamCounts: Record<string, number> = {};
  for (const s of students) {
    if (s.stream) streamCounts[s.stream] = (streamCounts[s.stream] ?? 0) + 1;
  }

  const sidebarItems: {
    id: Section;
    label: string;
    icon: typeof LayoutDashboard;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "My Students", icon: Users },
    { id: "analytics", label: "Batch Analytics", icon: BarChart2 },
  ];

  if (!prof) return null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#060B2A" }}
    >
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col shrink-0 border-r border-white/8"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,15,48,0.98) 0%, rgba(6,11,42,0.98) 100%)",
        }}
      >
        {/* Header */}
        <div className="px-5 py-6 border-b border-white/6">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #35D0C7, #14B8A6)",
              }}
            >
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Professor Portal</p>
              <p className="text-white/30 text-[10px]">SMARTRESUME AI</p>
            </div>
          </div>
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(53,208,199,0.1)",
              border: "1px solid rgba(53,208,199,0.2)",
            }}
          >
            <p className="text-white font-semibold text-sm truncate">
              {prof.name}
            </p>
            <p className="text-white/50 text-xs truncate mt-0.5">
              {prof.college}
            </p>
            <span
              className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(53,208,199,0.2)", color: "#35D0C7" }}
            >
              {prof.department}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`sidebar-nav-item w-full text-left ${section === item.id ? "active" : ""}`}
              data-ocid={`professor-dashboard.${item.id}.tab`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/6">
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-nav-item w-full text-left text-red-400 hover:text-red-300"
            data-ocid="professor-dashboard.logout.button"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <header
          className="sticky top-0 z-10 px-6 py-4 border-b border-white/6 flex items-center justify-between"
          style={{
            background: "rgba(6,11,42,0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <h1 className="text-white font-bold text-xl">
              {section === "dashboard" && "Overview"}
              {section === "students" && "My Students"}
              {section === "analytics" && "Batch Analytics"}
            </h1>
            <p className="text-white/40 text-xs mt-0.5">Professor Dashboard</p>
          </div>
        </header>

        <div className="p-6">
          {/* Overview */}
          {section === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Students",
                    value: totalStudents,
                    color: "#7C5CFF",
                    icon: Users,
                  },
                  {
                    label: "With Resume",
                    value: withResume,
                    color: "#35D0C7",
                    icon: CheckCircle,
                  },
                  {
                    label: "Placement Ready",
                    value: placementReadyCount,
                    color: "#39D98A",
                    icon: Star,
                  },
                  {
                    label: "Avg ATS Score",
                    value: avgATS !== null ? `${avgATS}/100` : "N/A",
                    color: "#F59E0B",
                    icon: TrendingUp,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl p-5"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        background: `${stat.color}22`,
                        border: `1px solid ${stat.color}44`,
                      }}
                    >
                      <stat.icon size={18} style={{ color: stat.color }} />
                    </div>
                    <p className="text-white font-bold text-2xl">
                      {stat.value}
                    </p>
                    <p className="text-white/40 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Stream distribution quick view */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h3 className="text-white font-semibold mb-4">
                  Stream Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(streamCounts).map(([stream, count]) => (
                    <div key={stream}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">{stream}</span>
                        <span className="text-white/50">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round((count / Math.max(totalStudents, 1)) * 100)}%`,
                            background:
                              "linear-gradient(90deg, #7C5CFF, #35D0C7)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {Object.keys(streamCounts).length === 0 && (
                    <p className="text-white/30 text-sm">No student data yet</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Students */}
          {section === "students" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="relative flex-1 min-w-48">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    className="input-dark pl-9 text-sm"
                    placeholder="Search students..."
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    data-ocid="professor-dashboard.students.search_input"
                  />
                </div>
                <select
                  className="input-dark text-sm w-48"
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value)}
                  data-ocid="professor-dashboard.students.stream.select"
                >
                  {allStreams.map((s) => (
                    <option key={s} value={s} style={{ background: "#0d1340" }}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="space-y-3"
                data-ocid="professor-dashboard.students.list"
              >
                {filtered.length === 0 && (
                  <div
                    className="rounded-2xl p-8 text-center"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    data-ocid="professor-dashboard.students.empty_state"
                  >
                    <Users size={32} className="text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No students found</p>
                  </div>
                )}
                {filtered.map((student, idx) => (
                  <div
                    key={student.phone}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    data-ocid={`professor-dashboard.students.item.${idx + 1}`}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors text-left"
                      onClick={() =>
                        setExpandedStudent(
                          expandedStudent === student.phone
                            ? null
                            : student.phone,
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{
                            background: "rgba(124,92,255,0.2)",
                            color: "#a78bfa",
                          }}
                        >
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {student.name}
                          </p>
                          <p className="text-white/40 text-xs">
                            {student.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {student.stream && (
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full hidden sm:block"
                            style={{
                              background: "rgba(53,208,199,0.15)",
                              color: "#35D0C7",
                              border: "1px solid rgba(53,208,199,0.3)",
                            }}
                          >
                            {student.stream}
                          </span>
                        )}
                        {student.atsScore !== null && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background:
                                student.atsScore >= 70
                                  ? "rgba(57,217,138,0.15)"
                                  : "rgba(245,158,11,0.15)",
                              color:
                                student.atsScore >= 70 ? "#39D98A" : "#F59E0B",
                              border: `1px solid ${student.atsScore >= 70 ? "rgba(57,217,138,0.3)" : "rgba(245,158,11,0.3)"}`,
                            }}
                          >
                            ATS: {student.atsScore}
                          </span>
                        )}
                        {student.placementReady && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(57,217,138,0.2)",
                              color: "#39D98A",
                              border: "1px solid rgba(57,217,138,0.4)",
                            }}
                          >
                            ✓ Ready
                          </span>
                        )}
                        <ChevronDown
                          size={16}
                          className="text-white/40 transition-transform"
                          style={{
                            transform:
                              expandedStudent === student.phone
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedStudent === student.phone && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-white/6 pt-4">
                            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                              <div
                                className="rounded-xl p-3"
                                style={{ background: "rgba(255,255,255,0.04)" }}
                              >
                                <p className="text-xs text-white/40">Resume</p>
                                <p
                                  className={`text-sm font-semibold mt-1 ${student.hasResume ? "text-green-400" : "text-red-400"}`}
                                >
                                  {student.hasResume ? "Uploaded" : "Missing"}
                                </p>
                              </div>
                              <div
                                className="rounded-xl p-3"
                                style={{ background: "rgba(255,255,255,0.04)" }}
                              >
                                <p className="text-xs text-white/40">Profile</p>
                                <p
                                  className={`text-sm font-semibold mt-1 ${student.hasProfile ? "text-green-400" : "text-yellow-400"}`}
                                >
                                  {student.hasProfile
                                    ? "Complete"
                                    : "Incomplete"}
                                </p>
                              </div>
                              <div
                                className="rounded-xl p-3"
                                style={{ background: "rgba(255,255,255,0.04)" }}
                              >
                                <p className="text-xs text-white/40">
                                  ATS Score
                                </p>
                                <p className="text-sm font-semibold mt-1 text-white">
                                  {student.atsScore !== null
                                    ? `${student.atsScore}/100`
                                    : "N/A"}
                                </p>
                              </div>
                            </div>

                            {student.feedbacks.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs text-white/40 mb-2">
                                  Feedback History
                                </p>
                                <div className="space-y-1">
                                  {student.feedbacks.map((fb) => (
                                    <div
                                      key={fb.slice(0, 30)}
                                      className="text-xs text-white/60 px-3 py-2 rounded-lg"
                                      style={{
                                        background: "rgba(255,255,255,0.04)",
                                      }}
                                    >
                                      {fb}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFeedbackModal({
                                    phone: student.phone,
                                    name: student.name,
                                  })
                                }
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                                style={{
                                  background: "rgba(124,92,255,0.2)",
                                  color: "#a78bfa",
                                  border: "1px solid rgba(124,92,255,0.3)",
                                }}
                                data-ocid={`professor-dashboard.student.feedback.button.${idx + 1}`}
                              >
                                <MessageSquare size={12} />
                                Add Feedback
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setProjectModal({
                                    phone: student.phone,
                                    name: student.name,
                                  })
                                }
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                                style={{
                                  background: "rgba(53,208,199,0.15)",
                                  color: "#35D0C7",
                                  border: "1px solid rgba(53,208,199,0.25)",
                                }}
                                data-ocid={`professor-dashboard.student.project.button.${idx + 1}`}
                              >
                                <FolderOpen size={12} />
                                Assign Project
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleTogglePlacement(student.phone)
                                }
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                                style={{
                                  background: student.placementReady
                                    ? "rgba(239,68,68,0.15)"
                                    : "rgba(57,217,138,0.15)",
                                  color: student.placementReady
                                    ? "#f87171"
                                    : "#39D98A",
                                  border: `1px solid ${student.placementReady ? "rgba(239,68,68,0.3)" : "rgba(57,217,138,0.3)"}`,
                                }}
                                data-ocid={`professor-dashboard.student.placement.button.${idx + 1}`}
                              >
                                <Star size={12} />
                                {student.placementReady
                                  ? "Unmark Ready"
                                  : "Mark Placement Ready"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics */}
          {section === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3 className="text-white font-semibold mb-5">
                    Stream Distribution
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(streamCounts).map(([stream, count]) => (
                      <div key={stream}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-white/70 text-xs">
                            {stream}
                          </span>
                          <span className="text-white/50 text-xs">
                            {count} students
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.round((count / Math.max(totalStudents, 1)) * 100)}%`,
                            }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #7C5CFF, #35D0C7)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {Object.keys(streamCounts).length === 0 && (
                      <p className="text-white/30 text-sm">No data yet</p>
                    )}
                  </div>
                </div>

                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3 className="text-white font-semibold mb-5">
                    Resume Completion
                  </h3>
                  <div className="flex items-center justify-center py-6">
                    <div className="text-center">
                      <p className="text-5xl font-extrabold text-white">
                        {totalStudents > 0
                          ? Math.round((withResume / totalStudents) * 100)
                          : 0}
                        %
                      </p>
                      <p className="text-white/40 text-sm mt-2">
                        Resume upload rate
                      </p>
                      <p className="text-white/30 text-xs mt-1">
                        {withResume}/{totalStudents} students
                      </p>
                    </div>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${totalStudents > 0 ? Math.round((withResume / totalStudents) * 100) : 0}%`,
                      }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #39D98A, #35D0C7)",
                      }}
                    />
                  </div>
                </div>

                <div
                  className="rounded-2xl p-6 lg:col-span-2"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3 className="text-white font-semibold mb-5">
                    Placement Readiness
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(57,217,138,0.1)",
                        border: "1px solid rgba(57,217,138,0.2)",
                      }}
                    >
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "#39D98A" }}
                      >
                        {placementReadyCount}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        Placement Ready
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.2)",
                      }}
                    >
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "#F59E0B" }}
                      >
                        {totalStudents - placementReadyCount}
                      </p>
                      <p className="text-white/50 text-xs mt-1">In Progress</p>
                    </div>
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(124,92,255,0.1)",
                        border: "1px solid rgba(124,92,255,0.2)",
                      }}
                    >
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "#a78bfa" }}
                      >
                        {avgATS !== null ? avgATS : "—"}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        Avg ATS Score
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setFeedbackModal(null)}
            data-ocid="professor-dashboard.feedback.dialog"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6"
              style={{
                background: "#0d1340",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">
                  Add Feedback for {feedbackModal.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setFeedbackModal(null)}
                  className="text-white/40 hover:text-white"
                  data-ocid="professor-dashboard.feedback.close_button"
                >
                  <X size={18} />
                </button>
              </div>
              <textarea
                className="input-dark w-full h-24 resize-none mb-4"
                placeholder="Write feedback..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                data-ocid="professor-dashboard.feedback.textarea"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackModal(null)}
                  className="btn-secondary flex-1"
                  data-ocid="professor-dashboard.feedback.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddFeedback}
                  className="btn-primary flex-1"
                  data-ocid="professor-dashboard.feedback.confirm_button"
                >
                  Save Feedback
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {projectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setProjectModal(null)}
            data-ocid="professor-dashboard.project.dialog"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6"
              style={{
                background: "#0d1340",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">
                  Assign Project to {projectModal.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setProjectModal(null)}
                  className="text-white/40 hover:text-white"
                  data-ocid="professor-dashboard.project.close_button"
                >
                  <X size={18} />
                </button>
              </div>
              <textarea
                className="input-dark w-full h-24 resize-none mb-4"
                placeholder="Describe the project assignment..."
                value={projectText}
                onChange={(e) => setProjectText(e.target.value)}
                data-ocid="professor-dashboard.project.textarea"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setProjectModal(null)}
                  className="btn-secondary flex-1"
                  data-ocid="professor-dashboard.project.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignProject}
                  className="btn-primary flex-1"
                  data-ocid="professor-dashboard.project.confirm_button"
                >
                  Assign Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
