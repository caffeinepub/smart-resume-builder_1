import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const portals = [
  {
    id: "student",
    icon: GraduationCap,
    title: "Student Portal",
    subtitle: "Career Development",
    description:
      "Build resume, track skills, explore jobs & get AI career guidance",
    tags: ["Resume Builder", "ATS Analyzer", "Job Portal"],
    color: "#7C5CFF",
    glow: "rgba(124,92,255,0.35)",
    gradient:
      "linear-gradient(135deg, rgba(124,92,255,0.25), rgba(75,139,255,0.15))",
    border: "rgba(124,92,255,0.4)",
    route: "/login",
    ocid: "home.student.card",
    btnOcid: "home.student.button",
  },
  {
    id: "professor",
    icon: BookOpen,
    title: "Professor Portal",
    subtitle: "Student Mentoring",
    description:
      "Monitor student progress, provide feedback & guide placements",
    tags: ["Student Analytics", "Feedback", "Placement"],
    color: "#35D0C7",
    glow: "rgba(53,208,199,0.35)",
    gradient:
      "linear-gradient(135deg, rgba(53,208,199,0.2), rgba(20,184,166,0.12))",
    border: "rgba(53,208,199,0.4)",
    route: "/professor-login",
    ocid: "home.professor.card",
    btnOcid: "home.professor.button",
  },
  {
    id: "recruiter",
    icon: Briefcase,
    title: "Recruiter Portal",
    subtitle: "Talent Acquisition",
    description: "Search candidates, view resumes & post job opportunities",
    tags: ["Candidate Search", "Job Posting", "Shortlist"],
    color: "#39D98A",
    glow: "rgba(57,217,138,0.35)",
    gradient:
      "linear-gradient(135deg, rgba(57,217,138,0.2), rgba(16,185,129,0.12))",
    border: "rgba(57,217,138,0.4)",
    route: "/recruiter-login",
    ocid: "home.recruiter.card",
    btnOcid: "home.recruiter.button",
  },
  {
    id: "admin",
    icon: Shield,
    title: "Admin Panel",
    subtitle: "Platform Management",
    description: "Manage users, analytics & control entire ecosystem",
    tags: ["User Management", "Analytics", "Approvals"],
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.35)",
    gradient:
      "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.12))",
    border: "rgba(245,158,11,0.4)",
    route: "/admin-login",
    ocid: "home.admin.card",
    btnOcid: "home.admin.button",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#060B2A",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(124,92,255,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(53,208,199,0.12) 0%, transparent 50%), radial-gradient(ellipse at 60% 90%, rgba(57,217,138,0.08) 0%, transparent 50%)",
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-5 border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7C5CFF, #4B8BFF)",
              boxShadow: "0 0 20px rgba(124,92,255,0.4)",
            }}
          >
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-extrabold text-base tracking-tight leading-none">
              SMARTRESUME AI
            </p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium mt-0.5">
              Career Ecosystem
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-yellow-400" />
          <span className="text-white/50 text-xs font-medium">v18.0</span>
        </div>
      </motion.header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{
              background: "rgba(124,92,255,0.15)",
              border: "1px solid rgba(124,92,255,0.3)",
              color: "#a78bfa",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Universal AI Career Development Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Choose Your{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #7C5CFF 0%, #35D0C7 50%, #39D98A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Portal
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            A complete multi-role career ecosystem connecting students,
            professors, recruiters, and administrators
          </p>
        </motion.div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl">
          {portals.map((portal, i) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              data-ocid={portal.ocid}
              onClick={() => navigate({ to: portal.route })}
              className="group relative flex flex-col cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: portal.gradient,
                border: `1px solid ${portal.border}`,
                boxShadow: "0 4px 24px transparent",
              }}
              whileHover={{
                boxShadow: `0 8px 40px ${portal.glow}`,
                borderColor: portal.color,
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: `linear-gradient(135deg, ${portal.color}33, ${portal.color}1a)`,
                  border: `1.5px solid ${portal.color}55`,
                  boxShadow: `0 0 20px ${portal.color}22`,
                }}
              >
                <portal.icon size={28} style={{ color: portal.color }} />
              </div>

              {/* Subtitle badge */}
              <div
                className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2"
                style={{
                  background: `${portal.color}22`,
                  border: `1px solid ${portal.color}44`,
                  color: portal.color,
                }}
              >
                {portal.subtitle}
              </div>

              {/* Title */}
              <h3 className="text-white font-bold text-xl mb-2">
                {portal.title}
              </h3>

              {/* Description */}
              <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">
                {portal.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {portal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <button
                type="button"
                data-ocid={portal.btnOcid}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group-hover:gap-3"
                style={{
                  background: `linear-gradient(135deg, ${portal.color}cc, ${portal.color}99)`,
                  color: "#fff",
                  boxShadow: `0 4px 15px ${portal.glow}`,
                }}
              >
                Enter Portal
                <ArrowRight size={15} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-14 flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { val: "10,000+", label: "Students" },
            { val: "500+", label: "Professors" },
            { val: "200+", label: "Recruiters" },
            { val: "8", label: "Streams" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-white font-extrabold text-2xl">{s.val}</p>
              <p className="text-white/35 text-xs font-medium mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-5 border-t border-white/5">
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400/60 hover:text-purple-400 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
