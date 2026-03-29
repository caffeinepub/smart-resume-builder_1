import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle,
  ClipboardCheck,
  Code2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Mic,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Craft a professional resume with live preview and one-click PDF download",
    path: "/resume-builder",
    color: "#7C5CFF",
    bg: "rgba(124,92,255,0.12)",
  },
  {
    icon: Target,
    title: "ATS Analyzer",
    description:
      "Score your resume against ATS algorithms and get improvement tips",
    path: "/ats-analyzer",
    color: "#35D0C7",
    bg: "rgba(53,208,199,0.12)",
  },
  {
    icon: Award,
    title: "Role Eligibility",
    description:
      "Discover which tech roles you qualify for based on your skills",
    path: "/role-eligibility",
    color: "#39D98A",
    bg: "rgba(57,217,138,0.12)",
  },
  {
    icon: BookOpen,
    title: "Skill Gap Analysis",
    description:
      "Compare your skills to target role requirements and find gaps",
    path: "/skill-gap",
    color: "#4B8BFF",
    bg: "rgba(75,139,255,0.12)",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description:
      "Curated YouTube, docs, and practice platforms for every skill",
    path: "/learning-resources",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
  },
  {
    icon: GraduationCap,
    title: "Free Certifications",
    description:
      "Earn certificates from Google, AWS, Microsoft, and more for free",
    path: "/certifications",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.12)",
  },
  {
    icon: Code2,
    title: "CSE Project Ideas",
    description:
      "15 curated projects from beginner to advanced for your portfolio",
    path: "/projects",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.12)",
  },
  {
    icon: ClipboardCheck,
    title: "Mock Tests",
    description:
      "Practice aptitude, DSA, programming, and web dev MCQs with timer",
    path: "/mock-tests",
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    description: "HR, Technical, Coding & System Design question banks",
    path: "/interview-prep",
    color: "#35D0C7",
    bg: "rgba(53,208,199,0.12)",
  },
  {
    icon: Mic,
    title: "Mock Interview",
    description: "Simulated interview with timer and model answers",
    path: "/mock-interview",
    color: "#A855F7",
    bg: "rgba(168,85,247,0.12)",
  },
  {
    icon: Briefcase,
    title: "Career Roadmap",
    description: "Step-by-step roadmaps from student to hired professional",
    path: "/career-roadmap",
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.12)",
  },
  {
    icon: Briefcase,
    title: "Jobs & Internships",
    description:
      "Direct links to top job platforms and hand-picked opportunities",
    path: "/jobs",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
  },
];

const stats = [
  { value: "10,000+", label: "Students Helped", icon: Users },
  { value: "98%", label: "ATS Pass Rate", icon: CheckCircle },
  { value: "200+", label: "Free Courses", icon: GraduationCap },
  { value: "4.9★", label: "User Rating", icon: Star },
];

const steps = [
  {
    step: 1,
    title: "Sign Up",
    desc: "Create your free account with just your mobile number",
    icon: Users,
    color: "#7C5CFF",
  },
  {
    step: 2,
    title: "Skill Learning",
    desc: "Access 200+ free courses and certifications to build skills",
    icon: BookOpen,
    color: "#35D0C7",
  },
  {
    step: 3,
    title: "Project Building",
    desc: "Build portfolio projects guided by curated ideas and resources",
    icon: Code2,
    color: "#39D98A",
  },
  {
    step: 4,
    title: "Certification",
    desc: "Earn industry-recognized certificates from top platforms",
    icon: GraduationCap,
    color: "#F59E0B",
  },
  {
    step: 5,
    title: "Job Application",
    desc: "Apply to jobs with an ATS-optimized resume and proven skills",
    icon: Briefcase,
    color: "#EC4899",
  },
];

const pipelineSteps = [
  {
    icon: FileText,
    label: "Resume",
    desc: "ATS-optimized professional resume",
    color: "#7C5CFF",
  },
  {
    icon: BookOpen,
    label: "Skills",
    desc: "Learn in-demand tech skills",
    color: "#35D0C7",
  },
  {
    icon: Code2,
    label: "Projects",
    desc: "Build portfolio projects",
    color: "#39D98A",
  },
  {
    icon: GraduationCap,
    label: "Certify",
    desc: "Earn industry certificates",
    color: "#F59E0B",
  },
  {
    icon: Briefcase,
    label: "Get Hired",
    desc: "Land your dream job",
    color: "#EC4899",
  },
];

const valueProps = [
  {
    emoji: "\u{1F916}",
    title: "AI Career Assistant",
    desc: "Get instant career guidance, resume tips, and skill recommendations from our built-in AI",
  },
  {
    emoji: "\u{1F4CA}",
    title: "Real Analytics",
    desc: "Track your ATS score, career readiness, skill progress, and certification count in one dashboard",
  },
  {
    emoji: "\u{1F3C6}",
    title: "Free Everything",
    desc: "200+ free courses from Google, AWS, Microsoft, IBM, Coursera - zero paid plans needed",
  },
  {
    emoji: "\u{1F3AF}",
    title: "Interview Ready",
    desc: "HR + Technical + Coding + System Design question bank with mock interview mode and timer",
  },
  {
    emoji: "\u{1F525}",
    title: "Streak System",
    desc: "Daily learning streaks keep you motivated and track your consistency over time",
  },
  {
    emoji: "\u{1F680}",
    title: "Project Builder",
    desc: "15 curated CSE projects with guides, tech stack, and resources to build real portfolio work",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #060B2A 0%, #0B1236 50%, #060B2A 100%)",
      }}
    >
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/6 sticky top-0 z-40"
        style={{
          background: "rgba(6,11,42,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C5CFF, #4B8BFF)" }}
          >
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-extrabold text-sm tracking-tight">
              SMARTRESUME AI
            </span>
            <p className="text-white/40 text-[9px] font-medium uppercase tracking-wider">
              Career Ecosystem
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#stats" className="hover:text-white transition-colors">
            Stats
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="btn-secondary text-sm py-2 px-4"
            data-ocid="home.login.button"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn-primary text-sm py-2 px-4"
            data-ocid="home.register.button"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-10 pt-20 pb-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,92,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#060B2A]/60 to-[#060B2A]" />
        <div className="animate-fade-in-up max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6">
            <LayoutDashboard size={14} /> Career Ecosystem Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5">
            Build Your Career
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #7C5CFF, #35D0C7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Resume to Job Offer
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            The only platform combining Resume Builder, ATS Analyzer, Skill
            Tracker, Certification Hub, Interview Prep, and AI Career Assistant
            in one complete ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              to="/register"
              className="btn-primary flex items-center gap-2 py-3 px-6 text-base"
              data-ocid="home.hero.primary.button"
            >
              Start Free Today <ArrowRight size={17} />
            </Link>
            <Link
              to="/login"
              className="btn-secondary flex items-center gap-2 py-3 px-6 text-base"
              data-ocid="home.hero.secondary.button"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="px-6 md:px-10 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                key={i}
                className="glass-card p-6 text-center"
                data-ocid={`home.stat.item.${i + 1}`}
              >
                <Icon size={24} className="mx-auto mb-2 text-purple-400" />
                <div className="text-3xl font-extrabold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              How It Works
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Five steps from student to hired professional
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                  key={i}
                  className="glass-card p-5 text-center relative overflow-visible"
                  data-ocid={`home.step.item.${i + 1}`}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: `${s.color}20`,
                      border: `1px solid ${s.color}40`,
                    }}
                  >
                    <Icon size={22} style={{ color: s.color }} />
                  </div>
                  <div
                    className="text-2xl font-extrabold mb-1"
                    style={{ color: s.color }}
                  >
                    {s.step}
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">
                    {s.title}
                  </p>
                  <p className="text-white/40 text-xs">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight size={16} className="text-white/20" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 md:px-10 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Everything You Need
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              One platform for your complete career preparation journey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.path + f.title}
                  to={f.path}
                  className="glass-card-hover p-5 flex flex-col gap-3"
                  data-ocid={`home.feature.item.${i + 1}`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: f.bg }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">
                      {f.title}
                    </p>
                    <p className="text-white/40 text-xs leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                  <div
                    className="mt-auto flex items-center gap-1 text-xs"
                    style={{ color: f.color }}
                  >
                    Explore <ArrowRight size={11} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why SmartResume AI? */}
      <section className="px-6 md:px-10 pb-20">
        <div
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,92,255,0.12) 0%, rgba(53,208,199,0.08) 50%, rgba(124,92,255,0.12) 100%)",
            border: "1px solid rgba(124,92,255,0.25)",
          }}
        >
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{
                  background: "rgba(124,92,255,0.15)",
                  border: "1px solid rgba(124,92,255,0.3)",
                  color: "#A78BFA",
                }}
              >
                <Brain size={14} /> Why SmartResume AI?
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                The Only Platform That Takes You From
              </h2>
              <p
                className="text-xl font-bold"
                style={{
                  background: "linear-gradient(90deg, #7C5CFF, #35D0C7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Student to Hired Professional
              </p>
              <p className="text-white/50 mt-3 max-w-2xl mx-auto">
                LinkedIn + Internshala + Coursera + Resume AI combined in one
                complete career ecosystem. Not a college project — a funded
                startup MVP.
              </p>
            </div>

            {/* Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-10">
              {pipelineSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="flex flex-col items-center text-center relative"
                  >
                    {i < 4 && (
                      <div
                        className="hidden sm:block absolute top-5 left-[60%] w-full h-0.5 z-0"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(124,92,255,0.5), transparent)",
                        }}
                      />
                    )}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 relative z-10"
                      style={{
                        background: `${step.color}20`,
                        border: `1px solid ${step.color}40`,
                      }}
                    >
                      <Icon size={22} style={{ color: step.color }} />
                    </div>
                    <p className="text-white font-bold text-sm">{step.label}</p>
                    <p className="text-white/40 text-xs mt-1">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {valueProps.map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <p className="text-white font-semibold text-sm mb-1">
                    {item.title}
                  </p>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 md:px-10 pb-20">
        <div
          className="max-w-4xl mx-auto glass-card p-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,92,255,0.2), rgba(53,208,199,0.15))",
          }}
        >
          <TrendingUp size={40} className="text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Launch Your Career?
          </h2>
          <p className="text-white/60 mb-6">
            Join 10,000+ students who have built their dream careers using
            SMARTRESUME AI.
          </p>
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2"
            data-ocid="home.cta.button"
          >
            Start Free Today <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 px-6 md:px-10 py-6 text-center text-white/30 text-sm">
        {"\u00A9"} {new Date().getFullYear()} SMARTRESUME AI. Built with{" "}
        {"\u2764\uFE0F"} using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
