import {
  Briefcase,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Tag,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { getUserStream } from "../utils/auth";
import { getStreamJobPortals } from "../utils/streamData";

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
    link: "https://wellfound.com",
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
];

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "#39D98A",
  Internship: "#4B8BFF",
  Remote: "#F59E0B",
  "Part-time": "#EC4899",
};

export default function Jobs() {
  const userStream = getUserStream();
  const portals = getStreamJobPortals(userStream || "cse");

  return (
    <AppShell
      title="Jobs & Internships"
      subtitle="Find opportunities in your field"
    >
      <div className="max-w-6xl mx-auto" data-ocid="jobs.page">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Jobs & Internships
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Curated job portals for your field
            </p>
          </div>
        </div>

        {/* Job Portals */}
        <div className="mb-10">
          <h2 className="section-heading mb-4">Top Job Portals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portals.map((portal, i) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-hover p-5 flex flex-col gap-3 group cursor-pointer"
                data-ocid={`jobs.portal.item.${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: portal.bg }}
                  >
                    <Globe size={18} style={{ color: portal.color }} />
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-white/30 group-hover:text-white/70 transition-colors"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {portal.name}
                  </h3>
                  <p className="text-white/40 text-xs mt-0.5">
                    {portal.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 border-t border-white/6 flex items-center justify-between">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: portal.color }}
                  >
                    Visit Portal
                  </span>
                  <ExternalLink size={12} style={{ color: portal.color }} />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Sample Jobs */}
        <div>
          <h2 className="section-heading mb-4">Latest Opportunities</h2>
          <div className="space-y-3">
            {SAMPLE_JOBS.map((job, i) => (
              <a
                key={`${job.title}-${i}`}
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-hover flex flex-col sm:flex-row sm:items-center gap-4 p-4 group cursor-pointer"
                data-ocid={`jobs.listing.item.${i + 1}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={18} className="text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        {job.title}
                      </h3>
                      <p className="text-white/50 text-xs">{job.company}</p>
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        color: TYPE_COLORS[job.type] ?? "#fff",
                        background: `${TYPE_COLORS[job.type] ?? "#fff"}20`,
                      }}
                    >
                      {job.type}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-3 mt-2">
                    <span className="flex items-center gap-1 text-white/40 text-[10px]">
                      <MapPin size={10} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-white/40 text-[10px]">
                      <Clock size={10} /> {job.postedAgo}
                    </span>
                    {job.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/6 text-white/50 flex items-center gap-1"
                      >
                        <Tag size={8} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
                <ExternalLink
                  size={14}
                  className="text-white/30 group-hover:text-white/70 flex-shrink-0 transition-colors hidden sm:block"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
