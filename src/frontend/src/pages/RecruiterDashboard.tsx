import { useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  Briefcase,
  Filter,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Search,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getRegisteredUsers } from "../utils/auth";
import {
  clearCurrentRole,
  clearRecruiterAuth,
  getCurrentRole,
  getRecruiterAuth,
} from "../utils/roleAuth";

type Section = "dashboard" | "candidates" | "shortlisted" | "post-jobs";

interface CandidateInfo {
  phone: string;
  name: string;
  stream: string;
  atsScore: number | null;
  skills: string[];
  hasResume: boolean;
  hasProfile: boolean;
}

interface PostedJob {
  title: string;
  company: string;
  location: string;
  type: string;
  stream: string;
  skills: string;
  description: string;
  deadline: string;
  postedAt: string;
}

const STREAMS = [
  "All",
  "Computer Science / IT",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Management / MBA",
  "Medical / Healthcare",
  "Commerce / Finance",
  "Arts / Design",
];

function getCandidates(): CandidateInfo[] {
  const users = getRegisteredUsers();
  return Object.entries(users)
    .map(([phone, name]) => {
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
      let skills: string[] = [];
      try {
        const raw = localStorage.getItem(`skills_${phone}`);
        if (raw) skills = JSON.parse(raw);
      } catch {
        /* ignore */
      }
      const hasResume = !!localStorage.getItem(`resume_${phone}`);
      const hasProfile = !!localStorage.getItem(`profile_${phone}`);
      return { phone, name, stream, atsScore, skills, hasResume, hasProfile };
    })
    .filter((c) => c.hasProfile && c.hasResume);
}

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("dashboard");
  const [candidates, setCandidates] = useState<CandidateInfo[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [streamFilter, setStreamFilter] = useState("All");
  const [minATS, setMinATS] = useState(0);
  const [skillFilter, setSkillFilter] = useState("");
  const [inviteModal, setInviteModal] = useState<{
    phone: string;
    name: string;
  } | null>(null);
  const [inviteMsg, setInviteMsg] = useState("");
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    stream: "",
    skills: "",
    description: "",
    deadline: "",
  });
  const [jobPosted, setJobPosted] = useState(false);
  const recruiter = getRecruiterAuth();

  useEffect(() => {
    if (getCurrentRole() !== "recruiter" || !getRecruiterAuth()) {
      navigate({ to: "/" });
      return;
    }
    setCandidates(getCandidates());
  }, [navigate]);

  const handleLogout = () => {
    clearRecruiterAuth();
    clearCurrentRole();
    navigate({ to: "/" });
  };

  const getShortlisted = (): string[] => {
    try {
      const raw = localStorage.getItem(`shortlisted_${recruiter?.phone}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const toggleShortlist = (phone: string) => {
    const list = getShortlisted();
    const idx = list.indexOf(phone);
    if (idx === -1) list.push(phone);
    else list.splice(idx, 1);
    localStorage.setItem(
      `shortlisted_${recruiter?.phone}`,
      JSON.stringify(list),
    );
    setCandidates([...candidates]);
  };

  const sendInvite = () => {
    if (!inviteModal || !inviteMsg.trim()) return;
    let invites: {
      phone: string;
      name: string;
      message: string;
      date: string;
    }[] = [];
    try {
      const raw = localStorage.getItem(`interviews_sent_${recruiter?.phone}`);
      if (raw) invites = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    invites.push({
      phone: inviteModal.phone,
      name: inviteModal.name,
      message: inviteMsg.trim(),
      date: new Date().toISOString(),
    });
    localStorage.setItem(
      `interviews_sent_${recruiter?.phone}`,
      JSON.stringify(invites),
    );
    setInviteModal(null);
    setInviteMsg("");
  };

  const getPostedJobs = (): PostedJob[] => {
    try {
      const raw = localStorage.getItem(`posted_jobs_${recruiter?.phone}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const postJob = () => {
    if (!jobForm.title || !jobForm.company) return;
    const jobs = getPostedJobs();
    jobs.push({ ...jobForm, postedAt: new Date().toISOString() });
    localStorage.setItem(
      `posted_jobs_${recruiter?.phone}`,
      JSON.stringify(jobs),
    );
    setJobForm({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      stream: "",
      skills: "",
      description: "",
      deadline: "",
    });
    setJobPosted(true);
    setTimeout(() => setJobPosted(false), 3000);
  };

  const shortlisted = getShortlisted();
  const postedJobs = getPostedJobs();

  let invitesSent = 0;
  try {
    const raw = localStorage.getItem(`interviews_sent_${recruiter?.phone}`);
    if (raw) invitesSent = JSON.parse(raw).length;
  } catch {
    /* ignore */
  }

  const filteredCandidates = candidates.filter((c) => {
    if (searchQ && !c.name.toLowerCase().includes(searchQ.toLowerCase()))
      return false;
    if (streamFilter !== "All" && c.stream !== streamFilter) return false;
    if (minATS > 0 && (c.atsScore === null || c.atsScore < minATS))
      return false;
    if (
      skillFilter.trim() &&
      !c.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()))
    )
      return false;
    return true;
  });

  const shortlistedCandidates = candidates.filter((c) =>
    shortlisted.includes(c.phone),
  );

  const sidebarItems: {
    id: Section;
    label: string;
    icon: typeof LayoutDashboard;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "candidates", label: "Find Candidates", icon: Search },
    { id: "shortlisted", label: "Shortlisted", icon: Bookmark },
    { id: "post-jobs", label: "Post Jobs", icon: PlusCircle },
  ];

  if (!recruiter) return null;

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
                background: "linear-gradient(135deg, #39D98A, #10B981)",
              }}
            >
              <Briefcase size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Recruiter Portal</p>
              <p className="text-white/30 text-[10px]">SMARTRESUME AI</p>
            </div>
          </div>
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(57,217,138,0.1)",
              border: "1px solid rgba(57,217,138,0.2)",
            }}
          >
            <p className="text-white font-semibold text-sm truncate">
              {recruiter.name}
            </p>
            <p className="text-white/50 text-xs truncate mt-0.5">
              {recruiter.company}
            </p>
            <span
              className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(57,217,138,0.2)", color: "#39D98A" }}
            >
              {recruiter.designation}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`sidebar-nav-item w-full text-left ${section === item.id ? "active" : ""}`}
              data-ocid={`recruiter-dashboard.${item.id}.tab`}
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
            data-ocid="recruiter-dashboard.logout.button"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
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
              {section === "candidates" && "Find Candidates"}
              {section === "shortlisted" && "Shortlisted"}
              {section === "post-jobs" && "Post Job / Internship"}
            </h1>
            <p className="text-white/40 text-xs mt-0.5">Recruiter Dashboard</p>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard overview */}
          {section === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Candidates",
                    value: candidates.length,
                    color: "#7C5CFF",
                  },
                  {
                    label: "Shortlisted",
                    value: shortlisted.length,
                    color: "#39D98A",
                  },
                  {
                    label: "Jobs Posted",
                    value: postedJobs.length,
                    color: "#35D0C7",
                  },
                  {
                    label: "Invites Sent",
                    value: invitesSent,
                    color: "#F59E0B",
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
                    <p
                      className="text-white font-bold text-3xl"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-white/40 text-xs mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>

              {postedJobs.length > 0 && (
                <div
                  className="mt-6 rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3 className="text-white font-semibold mb-4">
                    Recent Job Posts
                  </h3>
                  <div className="space-y-3">
                    {postedJobs
                      .slice(-3)
                      .reverse()
                      .map((job) => (
                        <div
                          key={job.title + job.postedAt}
                          className="flex items-center justify-between p-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.03)" }}
                        >
                          <div>
                            <p className="text-white text-sm font-medium">
                              {job.title}
                            </p>
                            <p className="text-white/40 text-xs">
                              {job.company} · {job.location}
                            </p>
                          </div>
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(57,217,138,0.15)",
                              color: "#39D98A",
                            }}
                          >
                            {job.type}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Find Candidates */}
          {section === "candidates" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    className="input-dark pl-9 text-sm"
                    placeholder="Search by name..."
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    data-ocid="recruiter-dashboard.candidates.search_input"
                  />
                </div>
                <select
                  className="input-dark text-sm"
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value)}
                  data-ocid="recruiter-dashboard.candidates.stream.select"
                >
                  {STREAMS.map((s) => (
                    <option key={s} value={s} style={{ background: "#0d1340" }}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <Filter
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    className="input-dark pl-9 text-sm"
                    placeholder="Filter by skill..."
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    data-ocid="recruiter-dashboard.candidates.skill.search_input"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs whitespace-nowrap">
                    Min ATS: {minATS}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={minATS}
                    onChange={(e) => setMinATS(Number(e.target.value))}
                    className="flex-1"
                    data-ocid="recruiter-dashboard.candidates.min-ats.toggle"
                  />
                </div>
              </div>

              {filteredCandidates.length === 0 ? (
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  data-ocid="recruiter-dashboard.candidates.empty_state"
                >
                  <Search size={32} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">
                    No candidates match your filters
                  </p>
                </div>
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  data-ocid="recruiter-dashboard.candidates.list"
                >
                  {filteredCandidates.map((c, idx) => {
                    const isShortlisted = shortlisted.includes(c.phone);
                    return (
                      <div
                        key={c.phone}
                        className="rounded-2xl p-5"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        data-ocid={`recruiter-dashboard.candidates.item.${idx + 1}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                              style={{
                                background: "rgba(57,217,138,0.2)",
                                color: "#39D98A",
                              }}
                            >
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">
                                {c.name}
                              </p>
                              <p className="text-white/40 text-xs">{c.phone}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleShortlist(c.phone)}
                            className="transition-all hover:scale-110"
                            data-ocid={`recruiter-dashboard.candidates.bookmark.toggle.${idx + 1}`}
                          >
                            <Bookmark
                              size={16}
                              style={{
                                color: isShortlisted
                                  ? "#39D98A"
                                  : "rgba(255,255,255,0.3)",
                                fill: isShortlisted ? "#39D98A" : "none",
                              }}
                            />
                          </button>
                        </div>

                        {c.stream && (
                          <span
                            className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-3"
                            style={{
                              background: "rgba(53,208,199,0.15)",
                              color: "#35D0C7",
                              border: "1px solid rgba(53,208,199,0.3)",
                            }}
                          >
                            {c.stream}
                          </span>
                        )}

                        {c.atsScore !== null && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white/40">ATS Score</span>
                              <span className="text-white font-semibold">
                                {c.atsScore}/100
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${c.atsScore}%`,
                                  background:
                                    "linear-gradient(90deg, #39D98A, #35D0C7)",
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {c.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {c.skills.slice(0, 3).map((skill) => (
                              <span key={skill} className="skill-chip">
                                {skill}
                              </span>
                            ))}
                            {c.skills.length > 3 && (
                              <span className="skill-chip">
                                +{c.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setInviteModal({ phone: c.phone, name: c.name })
                          }
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                          style={{
                            background: "rgba(57,217,138,0.2)",
                            color: "#39D98A",
                            border: "1px solid rgba(57,217,138,0.3)",
                          }}
                          data-ocid={`recruiter-dashboard.candidates.invite.button.${idx + 1}`}
                        >
                          <Send size={12} />
                          Send Interview Invite
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Shortlisted */}
          {section === "shortlisted" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {shortlistedCandidates.length === 0 ? (
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  data-ocid="recruiter-dashboard.shortlisted.empty_state"
                >
                  <Bookmark size={32} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">
                    No candidates shortlisted yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shortlistedCandidates.map((c, idx) => (
                    <div
                      key={c.phone}
                      className="rounded-2xl p-5"
                      style={{
                        background: "rgba(57,217,138,0.06)",
                        border: "1px solid rgba(57,217,138,0.2)",
                      }}
                      data-ocid={`recruiter-dashboard.shortlisted.item.${idx + 1}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{
                            background: "rgba(57,217,138,0.2)",
                            color: "#39D98A",
                          }}
                        >
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {c.name}
                          </p>
                          {c.stream && (
                            <p className="text-white/40 text-xs">{c.stream}</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleShortlist(c.phone)}
                        className="w-full py-1.5 rounded-xl text-xs font-medium"
                        style={{
                          background: "rgba(239,68,68,0.15)",
                          color: "#f87171",
                        }}
                        data-ocid={`recruiter-dashboard.shortlisted.remove.button.${idx + 1}`}
                      >
                        Remove from Shortlist
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Post Jobs */}
          {section === "post-jobs" && (
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
                    Post New Job / Internship
                  </h3>
                  {jobPosted && (
                    <div
                      className="mb-4 px-4 py-3 rounded-xl text-sm"
                      style={{
                        background: "rgba(57,217,138,0.12)",
                        color: "#39D98A",
                        border: "1px solid rgba(57,217,138,0.3)",
                      }}
                      data-ocid="recruiter-dashboard.post-jobs.success_state"
                    >
                      ✅ Job posted successfully!
                    </div>
                  )}
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="input-dark text-sm"
                      placeholder="Job Title"
                      value={jobForm.title}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, title: e.target.value })
                      }
                      data-ocid="recruiter-dashboard.post-jobs.title.input"
                    />
                    <input
                      type="text"
                      className="input-dark text-sm"
                      placeholder="Company Name"
                      value={jobForm.company}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, company: e.target.value })
                      }
                      data-ocid="recruiter-dashboard.post-jobs.company.input"
                    />
                    <input
                      type="text"
                      className="input-dark text-sm"
                      placeholder="Location"
                      value={jobForm.location}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, location: e.target.value })
                      }
                      data-ocid="recruiter-dashboard.post-jobs.location.input"
                    />
                    <select
                      className="input-dark text-sm"
                      value={jobForm.type}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, type: e.target.value })
                      }
                      data-ocid="recruiter-dashboard.post-jobs.type.select"
                    >
                      {["Full-time", "Internship", "Part-time"].map((t) => (
                        <option
                          key={t}
                          value={t}
                          style={{ background: "#0d1340" }}
                        >
                          {t}
                        </option>
                      ))}
                    </select>
                    <select
                      className="input-dark text-sm"
                      value={jobForm.stream}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, stream: e.target.value })
                      }
                      data-ocid="recruiter-dashboard.post-jobs.stream.select"
                    >
                      <option value="" style={{ background: "#0d1340" }}>
                        Required Stream (Any)
                      </option>
                      {STREAMS.slice(1).map((s) => (
                        <option
                          key={s}
                          value={s}
                          style={{ background: "#0d1340" }}
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="input-dark text-sm"
                      placeholder="Required Skills (comma separated)"
                      value={jobForm.skills}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, skills: e.target.value })
                      }
                      data-ocid="recruiter-dashboard.post-jobs.skills.input"
                    />
                    <textarea
                      className="input-dark text-sm h-20 resize-none"
                      placeholder="Job Description"
                      value={jobForm.description}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, description: e.target.value })
                      }
                      data-ocid="recruiter-dashboard.post-jobs.description.textarea"
                    />
                    <input
                      type="date"
                      className="input-dark text-sm"
                      value={jobForm.deadline}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, deadline: e.target.value })
                      }
                      data-ocid="recruiter-dashboard.post-jobs.deadline.input"
                    />
                    <button
                      type="button"
                      onClick={postJob}
                      className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
                      style={{
                        background: "linear-gradient(135deg, #39D98A, #10B981)",
                        boxShadow: "0 4px 20px rgba(57,217,138,0.3)",
                      }}
                      data-ocid="recruiter-dashboard.post-jobs.submit.button"
                    >
                      Post Job
                    </button>
                  </div>
                </div>

                {/* Posted jobs list */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3 className="text-white font-semibold mb-4">
                    Posted Jobs ({postedJobs.length})
                  </h3>
                  {postedJobs.length === 0 ? (
                    <div
                      className="text-center py-8"
                      data-ocid="recruiter-dashboard.post-jobs.empty_state"
                    >
                      <PlusCircle
                        size={28}
                        className="text-white/20 mx-auto mb-2"
                      />
                      <p className="text-white/30 text-sm">
                        No jobs posted yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {postedJobs.map((job, i) => (
                        <div
                          key={job.title + job.postedAt}
                          className="p-4 rounded-xl"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                          data-ocid={`recruiter-dashboard.post-jobs.item.${i + 1}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-white font-medium text-sm">
                                {job.title}
                              </p>
                              <p className="text-white/50 text-xs mt-0.5">
                                {job.company} · {job.location}
                              </p>
                            </div>
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                              style={{
                                background: "rgba(57,217,138,0.15)",
                                color: "#39D98A",
                              }}
                            >
                              {job.type}
                            </span>
                          </div>
                          {job.deadline && (
                            <p className="text-white/30 text-xs mt-2">
                              Deadline: {job.deadline}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Invite Modal */}
      <AnimatePresence>
        {inviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setInviteModal(null)}
            data-ocid="recruiter-dashboard.invite.dialog"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6"
              style={{
                background: "#0d1340",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">
                  Send Interview Invite to {inviteModal.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setInviteModal(null)}
                  className="text-white/40 hover:text-white"
                  data-ocid="recruiter-dashboard.invite.close_button"
                >
                  <X size={18} />
                </button>
              </div>
              <textarea
                className="input-dark w-full h-24 resize-none mb-4"
                placeholder="Write your interview invitation message..."
                value={inviteMsg}
                onChange={(e) => setInviteMsg(e.target.value)}
                data-ocid="recruiter-dashboard.invite.textarea"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setInviteModal(null)}
                  className="btn-secondary flex-1"
                  data-ocid="recruiter-dashboard.invite.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={sendInvite}
                  className="btn-primary flex-1"
                  data-ocid="recruiter-dashboard.invite.confirm_button"
                >
                  Send Invite
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
