import { Briefcase, Clock, ExternalLink, MapPin, Tag } from "lucide-react";
import { useState } from "react";
import AppShell from "../components/AppShell";

const JOB_PLATFORMS = [
  {
    name: "Internshala",
    desc: "#1 internship platform for students",
    tag: "Internships",
    url: "https://internshala.com",
    color: "#00BFA5",
    bg: "rgba(0,191,165,0.12)",
  },
  {
    name: "LinkedIn",
    desc: "Professional network with millions of job listings",
    tag: "All Jobs",
    url: "https://linkedin.com/jobs",
    color: "#0A66C2",
    bg: "rgba(10,102,194,0.12)",
  },
  {
    name: "Naukri",
    desc: "India's largest job portal for tech professionals",
    tag: "Full-time",
    url: "https://naukri.com",
    color: "#FF6B35",
    bg: "rgba(255,107,53,0.12)",
  },
  {
    name: "Unstop",
    desc: "Competitions, hackathons & internships for students",
    tag: "Hackathons",
    url: "https://unstop.com",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.12)",
  },
  {
    name: "Wellfound",
    desc: "Startup jobs at top-funded companies",
    tag: "Startups",
    url: "https://wellfound.com",
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
  },
  {
    name: "RemoteOK",
    desc: "Fully remote jobs worldwide",
    tag: "Remote",
    url: "https://remoteok.com",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
  },
  {
    name: "Fresherworld",
    desc: "Jobs exclusively for freshers & recent graduates",
    tag: "Freshers",
    url: "https://www.fresherworld.com",
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.12)",
  },
  {
    name: "HackerEarth",
    desc: "Coding challenges, hackathons & tech hiring",
    tag: "Hackathons",
    url: "https://hackerearth.com",
    color: "#2C3E7E",
    bg: "rgba(44,62,126,0.12)",
  },
];

const SAMPLE_JOBS = [
  {
    title: "Frontend Developer",
    company: "CloudTech Solutions",
    location: "Bangalore, India",
    type: "Full-time",
    skills: ["React", "TypeScript", "CSS"],
    link: "https://linkedin.com/jobs",
    postedAgo: "2 days ago",
  },
  {
    title: "React Intern",
    company: "StartupHub",
    location: "Remote",
    type: "Internship",
    skills: ["React", "JavaScript"],
    link: "https://internshala.com",
    postedAgo: "1 day ago",
  },
  {
    title: "Backend Node.js Developer",
    company: "Fintech Ventures",
    location: "Mumbai, India",
    type: "Full-time",
    skills: ["Node.js", "MongoDB", "REST API"],
    link: "https://naukri.com",
    postedAgo: "3 days ago",
  },
  {
    title: "Software Engineering Intern",
    company: "DataMinds AI",
    location: "Hyderabad, India",
    type: "Internship",
    skills: ["Python", "Algorithms", "SQL"],
    link: "https://internshala.com",
    postedAgo: "5 hours ago",
  },
  {
    title: "Full Stack Developer",
    company: "GrowthSaaS Inc",
    location: "Remote",
    type: "Remote",
    skills: ["React", "Node.js", "MongoDB"],
    link: "https://remoteok.com",
    postedAgo: "1 day ago",
  },
  {
    title: "Junior Data Analyst",
    company: "Retail Analytics Co",
    location: "Pune, India",
    type: "Full-time",
    skills: ["Python", "SQL", "Tableau"],
    link: "https://naukri.com",
    postedAgo: "4 days ago",
  },
  {
    title: "DevOps Intern",
    company: "CloudOps Ltd",
    location: "Noida, India",
    type: "Internship",
    skills: ["Docker", "Linux", "CI/CD"],
    link: "https://unstop.com",
    postedAgo: "2 days ago",
  },
  {
    title: "TypeScript Developer",
    company: "Open Source Startup",
    location: "Remote",
    type: "Remote",
    skills: ["TypeScript", "React", "Git"],
    link: "https://wellfound.com",
    postedAgo: "6 hours ago",
  },
  {
    title: "Frontend Engineer (Fresher)",
    company: "TechLaunch",
    location: "Delhi, India",
    type: "Full-time",
    skills: ["HTML", "CSS", "JavaScript"],
    link: "https://www.fresherworld.com",
    postedAgo: "1 day ago",
  },
  {
    title: "ML Intern",
    company: "NeuralWave AI",
    location: "Bangalore, India",
    type: "Internship",
    skills: ["Python", "TensorFlow", "NumPy"],
    link: "https://hackerearth.com",
    postedAgo: "3 days ago",
  },
];

const JOB_TYPE_TABS = ["All", "Internship", "Full-time", "Remote"];
const SKILL_FILTERS = [
  "Frontend",
  "Backend",
  "Data Science",
  "DevOps",
  "ML/AI",
];
const SKILL_FILTER_KEYWORDS: Record<string, string[]> = {
  Frontend: [
    "React",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "Vue",
    "Angular",
  ],
  Backend: ["Node.js", "Express", "Python", "Django", "REST API", "MongoDB"],
  "Data Science": ["Python", "SQL", "Tableau", "Statistics", "NumPy"],
  DevOps: ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS"],
  "ML/AI": ["TensorFlow", "Machine Learning", "Python", "NumPy"],
};

const TYPE_COLOR: Record<string, string> = {
  "Full-time": "#39D98A",
  Internship: "#35D0C7",
  Remote: "#7C5CFF",
};

export default function Jobs() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    const typeMatch = activeTab === "All" || job.type === activeTab;
    const skillMatch =
      !activeFilter ||
      job.skills.some((s) =>
        SKILL_FILTER_KEYWORDS[activeFilter]?.some((k) =>
          s.toLowerCase().includes(k.toLowerCase()),
        ),
      );
    return typeMatch && skillMatch;
  });

  return (
    <AppShell title="Jobs & Internships" subtitle="Find your next opportunity">
      <div className="max-w-6xl mx-auto" data-ocid="jobs.page">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Jobs & Internships</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Top platforms and hand-picked opportunities for students
          </p>
        </div>

        {/* Platforms */}
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ExternalLink size={16} className="text-cyan-400" /> Job Platforms
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {JOB_PLATFORMS.map((p, i) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-hover p-4 flex flex-col gap-2"
                data-ocid={`jobs.platform.item.${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: p.bg }}
                  >
                    <ExternalLink size={16} style={{ color: p.color }} />
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: p.bg, color: p.color }}
                  >
                    {p.tag}
                  </span>
                </div>
                <p className="text-white font-semibold text-sm">{p.name}</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  {p.desc}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div>
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Briefcase size={16} className="text-purple-400" /> Featured
            Opportunities
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              {JOB_TYPE_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-purple-500/40 border border-purple-500/50 text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                  data-ocid={"jobs.type_tab.tab"}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {SKILL_FILTERS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setActiveFilter(activeFilter === f ? null : f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    activeFilter === f
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                      : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                  }`}
                  data-ocid={"jobs.skill_filter.toggle"}
                >
                  <Tag size={11} className="inline mr-1" />
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Listings */}
          <div className="space-y-3">
            {filteredJobs.length === 0 ? (
              <div
                className="glass-card p-10 text-center"
                data-ocid="jobs.empty_state"
              >
                <Briefcase size={40} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/50">No jobs match current filters</p>
              </div>
            ) : (
              filteredJobs.map((job, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                  key={i}
                  className="glass-card-hover p-5 flex flex-wrap items-center gap-4"
                  data-ocid={`jobs.job.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{job.title}</h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${TYPE_COLOR[job.type] ?? "#7C5CFF"}20`,
                          color: TYPE_COLOR[job.type] ?? "#7C5CFF",
                          border: `1px solid ${TYPE_COLOR[job.type] ?? "#7C5CFF"}40`,
                        }}
                      >
                        {job.type}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm font-medium">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-white/30 text-xs">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {job.postedAgo}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((s) => (
                      <span key={s} className="skill-chip text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 flex-shrink-0"
                    data-ocid={"jobs.apply.button"}
                  >
                    Apply <ExternalLink size={12} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// Footer
export function Footer() {
  return (
    <footer className="border-t border-white/6 py-6 text-center text-white/30 text-sm">
      © {new Date().getFullYear()}. Built with ❤️ using{" "}
      <a
        href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
        className="text-purple-400 hover:text-purple-300"
      >
        caffeine.ai
      </a>
    </footer>
  );
}
