import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  Bell,
  Briefcase,
  CheckCircle,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Send,
  Shield,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getRegisteredUsers } from "../utils/auth";
import {
  type ProfessorUser,
  type RecruiterUser,
  approveRecruiter,
  clearCurrentRole,
  getProfessors,
  getRecruiters,
} from "../utils/roleAuth";

type Section =
  | "dashboard"
  | "students"
  | "professors"
  | "recruiters"
  | "notifications"
  | "analytics";

interface StudentRow {
  phone: string;
  name: string;
  stream: string;
  atsScore: number | null;
  hasResume: boolean;
}

function getAllStudents(): StudentRow[] {
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
    return { phone, name, stream, atsScore, hasResume };
  });
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("dashboard");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [professors, setProfessors] = useState<Record<string, ProfessorUser>>(
    {},
  );
  const [recruiters, setRecruiters] = useState<Record<string, RecruiterUser>>(
    {},
  );
  const [notifText, setNotifText] = useState("");
  const [notifSent, setNotifSent] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("currentRole") !== "admin") {
      navigate({ to: "/" });
      return;
    }
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setStudents(getAllStudents());
    setProfessors(getProfessors());
    setRecruiters(getRecruiters());
  };

  const handleLogout = () => {
    clearCurrentRole();
    navigate({ to: "/" });
  };

  const handleDeleteStudent = (phone: string) => {
    const users = getRegisteredUsers();
    delete users[phone];
    localStorage.setItem("career_users", JSON.stringify(users));
    for (const key of [
      `resume_${phone}`,
      `ats_${phone}`,
      `profile_${phone}`,
      `stream_${phone}`,
      `skills_${phone}`,
      "career_auth",
    ]) {
      // Only remove non-session keys; skip career_auth to not log out others
      if (key !== "career_auth") localStorage.removeItem(key);
    }
    setDeleteConfirm(null);
    refreshData();
  };

  const handleRemoveProfessor = (phone: string) => {
    const profs = getProfessors();
    delete profs[phone];
    localStorage.setItem("professors_registry", JSON.stringify(profs));
    localStorage.removeItem(`prof_pass_${phone}`);
    refreshData();
  };

  const handleApproveRecruiter = (phone: string) => {
    approveRecruiter(phone);
    refreshData();
  };

  const handleSendNotification = () => {
    if (!notifText.trim()) return;
    let notifs: { text: string; date: string }[] = [];
    try {
      const raw = localStorage.getItem("global_notifications");
      if (raw) notifs = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    notifs.push({ text: notifText.trim(), date: new Date().toISOString() });
    localStorage.setItem("global_notifications", JSON.stringify(notifs));
    setNotifText("");
    setNotifSent(true);
    setTimeout(() => setNotifSent(false), 3000);
  };

  const pendingRecruiters = Object.entries(recruiters).filter(
    ([, r]) => !r.approved,
  );
  const approvedRecruiters = Object.entries(recruiters).filter(
    ([, r]) => r.approved,
  );
  const totalStudents = students.length;
  const totalProfs = Object.keys(professors).length;
  const totalRecs = Object.keys(recruiters).length;
  const activeStudents = students.filter((s) => s.hasResume).length;

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
    { id: "students", label: "Manage Students", icon: Users },
    { id: "professors", label: "Manage Professors", icon: GraduationCap },
    { id: "recruiters", label: "Manage Recruiters", icon: Briefcase },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
  ];

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
        <div className="px-5 py-6 border-b border-white/6">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
              }}
            >
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Admin Panel</p>
              <p className="text-white/30 text-[10px]">SMARTRESUME AI</p>
            </div>
          </div>
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <p className="text-white font-semibold text-sm">Administrator</p>
            <p className="text-white/40 text-xs mt-0.5">Full Platform Access</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`sidebar-nav-item w-full text-left ${section === item.id ? "active" : ""}`}
              data-ocid={`admin-dashboard.${item.id}.tab`}
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
            data-ocid="admin-dashboard.logout.button"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header
          className="sticky top-0 z-10 px-6 py-4 border-b border-white/6"
          style={{
            background: "rgba(6,11,42,0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h1 className="text-white font-bold text-xl">
            {section === "dashboard" && "Platform Overview"}
            {section === "students" && "Manage Students"}
            {section === "professors" && "Manage Professors"}
            {section === "recruiters" && "Manage Recruiters"}
            {section === "notifications" && "Send Notifications"}
            {section === "analytics" && "Platform Analytics"}
          </h1>
          <p className="text-white/40 text-xs mt-0.5">Admin Dashboard</p>
        </header>

        <div className="p-6">
          {/* Dashboard */}
          {section === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Students",
                    value: totalStudents,
                    color: "#7C5CFF",
                    icon: Users,
                  },
                  {
                    label: "Total Professors",
                    value: totalProfs,
                    color: "#35D0C7",
                    icon: GraduationCap,
                  },
                  {
                    label: "Total Recruiters",
                    value: totalRecs,
                    color: "#39D98A",
                    icon: Briefcase,
                  },
                  {
                    label: "Active Students",
                    value: activeStudents,
                    color: "#F59E0B",
                    icon: CheckCircle,
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
                    <p className="text-white font-bold text-3xl">
                      {stat.value}
                    </p>
                    <p className="text-white/40 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {pendingRecruiters.length > 0 && (
                <div
                  className="mt-6 rounded-2xl p-5"
                  style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.25)",
                  }}
                >
                  <p className="text-yellow-400 font-semibold text-sm mb-1">
                    ⚠️ {pendingRecruiters.length} Recruiter Approval
                    {pendingRecruiters.length > 1 ? "s" : ""} Pending
                  </p>
                  <p className="text-white/40 text-xs">
                    Go to Manage Recruiters to review.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Students */}
          {section === "students" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {students.length === 0 ? (
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  data-ocid="admin-dashboard.students.empty_state"
                >
                  <Users size={32} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">
                    No students registered yet
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  data-ocid="admin-dashboard.students.table"
                >
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                        {[
                          "Name",
                          "Phone",
                          "Stream",
                          "ATS Score",
                          "Resume",
                          "Action",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, idx) => (
                        <tr
                          key={s.phone}
                          className="border-t border-white/5 hover:bg-white/3 transition-colors"
                          data-ocid={`admin-dashboard.students.row.${idx + 1}`}
                        >
                          <td className="px-4 py-3 text-white text-sm font-medium">
                            {s.name}
                          </td>
                          <td className="px-4 py-3 text-white/50 text-xs">
                            {s.phone}
                          </td>
                          <td className="px-4 py-3">
                            {s.stream ? (
                              <span
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={{
                                  background: "rgba(53,208,199,0.15)",
                                  color: "#35D0C7",
                                }}
                              >
                                {s.stream}
                              </span>
                            ) : (
                              <span className="text-white/30 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-white/70 text-sm">
                            {s.atsScore !== null ? `${s.atsScore}` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-medium ${s.hasResume ? "text-green-400" : "text-red-400"}`}
                            >
                              {s.hasResume ? "✓ Yes" : "✗ No"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(s.phone)}
                              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{
                                background: "rgba(239,68,68,0.15)",
                                color: "#f87171",
                              }}
                              data-ocid={`admin-dashboard.students.delete_button.${idx + 1}`}
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Professors */}
          {section === "professors" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {Object.keys(professors).length === 0 ? (
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  data-ocid="admin-dashboard.professors.empty_state"
                >
                  <GraduationCap
                    size={32}
                    className="text-white/20 mx-auto mb-3"
                  />
                  <p className="text-white/40 text-sm">
                    No professors registered yet
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  data-ocid="admin-dashboard.professors.table"
                >
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                        {[
                          "Name",
                          "Phone",
                          "Department",
                          "College",
                          "Action",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(professors).map(([phone, prof], idx) => (
                        <tr
                          key={phone}
                          className="border-t border-white/5 hover:bg-white/3"
                          data-ocid={`admin-dashboard.professors.row.${idx + 1}`}
                        >
                          <td className="px-4 py-3 text-white text-sm font-medium">
                            {prof.name}
                          </td>
                          <td className="px-4 py-3 text-white/50 text-xs">
                            {phone}
                          </td>
                          <td className="px-4 py-3 text-white/70 text-xs">
                            {prof.department}
                          </td>
                          <td className="px-4 py-3 text-white/70 text-xs">
                            {prof.college}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveProfessor(phone)}
                              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg"
                              style={{
                                background: "rgba(239,68,68,0.15)",
                                color: "#f87171",
                              }}
                              data-ocid={`admin-dashboard.professors.delete_button.${idx + 1}`}
                            >
                              <XCircle size={12} />
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Recruiters */}
          {section === "recruiters" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Pending */}
              {pendingRecruiters.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    Pending Approval ({pendingRecruiters.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingRecruiters.map(([phone, rec], idx) => (
                      <div
                        key={phone}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{
                          background: "rgba(245,158,11,0.08)",
                          border: "1px solid rgba(245,158,11,0.2)",
                        }}
                        data-ocid={`admin-dashboard.recruiters.pending.item.${idx + 1}`}
                      >
                        <div>
                          <p className="text-white font-medium text-sm">
                            {rec.name}
                          </p>
                          <p className="text-white/50 text-xs">
                            {rec.company} · {rec.designation} · {phone}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApproveRecruiter(phone)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                          style={{
                            background: "rgba(57,217,138,0.2)",
                            color: "#39D98A",
                            border: "1px solid rgba(57,217,138,0.3)",
                          }}
                          data-ocid={`admin-dashboard.recruiters.approve.button.${idx + 1}`}
                        >
                          <CheckCircle size={12} />
                          Approve
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approved */}
              <h3 className="text-white font-semibold mb-3">
                Approved Recruiters ({approvedRecruiters.length})
              </h3>
              {approvedRecruiters.length === 0 ? (
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  data-ocid="admin-dashboard.recruiters.empty_state"
                >
                  <Briefcase size={32} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">
                    No approved recruiters yet
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                        {["Name", "Company", "Designation", "Phone"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {approvedRecruiters.map(([phone, rec], idx) => (
                        <tr
                          key={phone}
                          className="border-t border-white/5"
                          data-ocid={`admin-dashboard.recruiters.approved.row.${idx + 1}`}
                        >
                          <td className="px-4 py-3 text-white text-sm">
                            {rec.name}
                          </td>
                          <td className="px-4 py-3 text-white/60 text-xs">
                            {rec.company}
                          </td>
                          <td className="px-4 py-3 text-white/60 text-xs">
                            {rec.designation}
                          </td>
                          <td className="px-4 py-3 text-white/50 text-xs">
                            {phone}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Notifications */}
          {section === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl"
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h3 className="text-white font-semibold mb-4">
                  Send Global Notification to All Students
                </h3>
                {notifSent && (
                  <div
                    className="mb-4 px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "rgba(57,217,138,0.12)",
                      color: "#39D98A",
                      border: "1px solid rgba(57,217,138,0.3)",
                    }}
                    data-ocid="admin-dashboard.notifications.success_state"
                  >
                    ✅ Notification sent to all students!
                  </div>
                )}
                <textarea
                  className="input-dark w-full h-32 resize-none mb-4"
                  placeholder="Write your notification message..."
                  value={notifText}
                  onChange={(e) => setNotifText(e.target.value)}
                  data-ocid="admin-dashboard.notifications.textarea"
                />
                <button
                  type="button"
                  onClick={handleSendNotification}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #F59E0B, #D97706)",
                    boxShadow: "0 4px 15px rgba(245,158,11,0.3)",
                  }}
                  data-ocid="admin-dashboard.notifications.submit.button"
                >
                  <Send size={15} />
                  Send to All Students
                </button>
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
                    Student Stream Distribution
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(streamCounts).map(([stream, count]) => (
                      <div key={stream}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70 text-xs">
                            {stream}
                          </span>
                          <span className="text-white/50 text-xs">
                            {count} students
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.round((count / Math.max(totalStudents, 1)) * 100)}%`,
                            }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #F59E0B, #EF4444)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {Object.keys(streamCounts).length === 0 && (
                      <p className="text-white/30 text-sm">
                        No student data yet
                      </p>
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
                    Platform Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Resume Upload Rate",
                        value:
                          totalStudents > 0
                            ? `${Math.round((activeStudents / totalStudents) * 100)}%`
                            : "0%",
                        color: "#7C5CFF",
                      },
                      {
                        label: "Recruiter Approval Rate",
                        value:
                          totalRecs > 0
                            ? `${Math.round((approvedRecruiters.length / totalRecs) * 100)}%`
                            : "0%",
                        color: "#39D98A",
                      },
                      {
                        label: "Streams Active",
                        value: Object.keys(streamCounts).length,
                        color: "#35D0C7",
                      },
                      {
                        label: "Pending Approvals",
                        value: pendingRecruiters.length,
                        color: "#F59E0B",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl p-4 text-center"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <p
                          className="text-2xl font-bold"
                          style={{ color: stat.color }}
                        >
                          {stat.value}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setDeleteConfirm(null)}
            data-ocid="admin-dashboard.delete.dialog"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{
                background: "#0d1340",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Delete Student?</h3>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="text-white/40 hover:text-white"
                  data-ocid="admin-dashboard.delete.close_button"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-white/50 text-sm mb-5">
                This will permanently delete all data for this student. This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="btn-secondary flex-1"
                  data-ocid="admin-dashboard.delete.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteStudent(deleteConfirm)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  }}
                  data-ocid="admin-dashboard.delete.confirm_button"
                >
                  Delete Student
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
