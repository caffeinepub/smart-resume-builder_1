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

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#060B2A",
        backgroundImage:
          "radial-gradient(ellipse at 15% 40%, rgba(124,92,255,0.2) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(53,208,199,0.15) 0%, transparent 50%)",
      }}
    >
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/6"
        style={{
          background: "rgba(6, 11, 42, 0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C5CFF, #4B8BFF)" }}
          >
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-extrabold text-base tracking-tight">
              SMARTRESUME AI
            </span>
            <p className="text-white/40 text-[9px] uppercase tracking-widest font-medium">
              Career Builder
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a href="#stats" className="hover:text-white transition-colors">
            About
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="btn-secondary text-sm py-2 px-4"
            data-ocid="home.login.button"
          >
            Sign In
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
              "url('/assets/generated/hero-bg.dim_1200x600.jpg') center/cover",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#060B2A]/60 to-[#060B2A]" />

        <div className="animate-fade-in-up max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6">
            <Brain size={14} />
            AI-Powered Career Platform for Students
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Build Your <span className="gradient-text">Dream Career</span>
            <br />
            with AI-Powered Tools
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-4 leading-relaxed">
            SMARTRESUME AI guides every step — from your first resume to landing
            your dream job. Resume builder, ATS analyzer, skill learning,
            certifications, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              to="/register"
              className="btn-primary flex items-center gap-2"
              data-ocid="home.hero.register.button"
            >
              <Brain size={17} /> Get Started Free
            </Link>
            <Link
              to="/resume-builder"
              className="btn-secondary flex items-center gap-2"
              data-ocid="home.hero.build_resume.button"
            >
              <FileText size={17} /> Build Resume
            </Link>
            <Link
              to="/ats-analyzer"
              className="btn-secondary flex items-center gap-2"
              data-ocid="home.hero.analyze.button"
            >
              <Target size={17} /> Analyze Resume
            </Link>
            <Link
              to="/dashboard"
              className="btn-secondary flex items-center gap-2"
              data-ocid="home.hero.dashboard.button"
            >
              <LayoutDashboard size={17} /> Dashboard
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
                className={`glass-card p-6 text-center animate-fade-in-up stagger-${i + 1}`}
              >
                <Icon size={24} className="text-purple-400 mx-auto mb-3" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Career Journey in 5 Steps
            </h2>
            <p className="text-white/50 text-lg">
              From zero to hired — SMARTRESUME AI guides every step of the way
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className={`glass-card p-5 text-center relative animate-fade-in-up stagger-${i + 1}`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-extrabold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${s.color}, ${s.color}88)`,
                    }}
                  >
                    {s.step}
                  </div>
                  <Icon
                    size={20}
                    className="mx-auto mb-2"
                    style={{ color: s.color }}
                  />
                  <h3 className="text-white font-bold text-sm mb-2">
                    {s.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {s.desc}
                  </p>
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

      {/* Features */}
      <section id="features" className="px-6 md:px-10 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              10 Powerful Career Modules
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Everything you need to go from student to hired professional, all
              in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.path + f.title}
                  to={f.path}
                  data-ocid={`home.feature.item.${i + 1}`}
                  className={`glass-card-hover p-5 group animate-fade-in-up stagger-${(i % 6) + 1}`}
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                    style={{ background: f.bg }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-3">
                    {f.description}
                  </p>
                  <div
                    className="flex items-center gap-1 text-xs font-medium transition-colors"
                    style={{ color: f.color }}
                  >
                    Explore{" "}
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              );
            })}
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
            Join 10,000+ students who've built their dream careers using
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
        © {new Date().getFullYear()} SMARTRESUME AI. Built with ❤️ using{" "}
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
