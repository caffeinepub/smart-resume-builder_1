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
import { getStreamById, getStreamJobPortals } from "../utils/streamData";

interface SampleJob {
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  link: string;
  postedAgo: string;
}

const STREAM_SAMPLE_JOBS: Record<string, SampleJob[]> = {
  cse: [
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
  ],
  mechanical: [
    {
      title: "Design Engineer",
      company: "Tata Motors",
      location: "Pune, India",
      type: "Full-time",
      skills: ["AutoCAD", "SolidWorks", "GD&T"],
      link: "https://naukri.com",
      postedAgo: "2 days ago",
    },
    {
      title: "Mechanical Engineering Intern",
      company: "L&T Engineering",
      location: "Chennai, India",
      type: "Internship",
      skills: ["AutoCAD", "CATIA"],
      link: "https://internshala.com",
      postedAgo: "1 day ago",
    },
    {
      title: "Production Engineer",
      company: "Mahindra & Mahindra",
      location: "Nashik, India",
      type: "Full-time",
      skills: ["Manufacturing", "Lean", "Six Sigma"],
      link: "https://naukri.com",
      postedAgo: "3 days ago",
    },
    {
      title: "CAD Engineer",
      company: "Bajaj Auto",
      location: "Aurangabad, India",
      type: "Full-time",
      skills: ["SolidWorks", "CATIA", "Ansys"],
      link: "https://naukri.com",
      postedAgo: "1 week ago",
    },
    {
      title: "HVAC Design Engineer",
      company: "Voltas Ltd",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["HVAC", "Thermodynamics", "AutoCAD"],
      link: "https://naukri.com",
      postedAgo: "5 days ago",
    },
    {
      title: "Quality Control Engineer",
      company: "Hero MotoCorp",
      location: "Gurugram, India",
      type: "Full-time",
      skills: ["Six Sigma", "SPC", "Quality Systems"],
      link: "https://naukri.com",
      postedAgo: "2 days ago",
    },
  ],
  electrical: [
    {
      title: "Embedded Systems Engineer",
      company: "Bosch India",
      location: "Bangalore, India",
      type: "Full-time",
      skills: ["Embedded C", "ARM", "RTOS"],
      link: "https://naukri.com",
      postedAgo: "2 days ago",
    },
    {
      title: "Electrical Engineering Intern",
      company: "BHEL",
      location: "Bhopal, India",
      type: "Internship",
      skills: ["Circuit Design", "AutoCAD Electrical"],
      link: "https://internshala.com",
      postedAgo: "3 days ago",
    },
    {
      title: "Power Systems Engineer",
      company: "Power Grid Corporation",
      location: "Delhi, India",
      type: "Full-time",
      skills: ["Power Systems", "ETAP", "SCADA"],
      link: "https://naukri.com",
      postedAgo: "4 days ago",
    },
    {
      title: "PLC/SCADA Engineer",
      company: "Siemens India",
      location: "Pune, India",
      type: "Full-time",
      skills: ["PLC Programming", "SCADA", "HMI"],
      link: "https://naukri.com",
      postedAgo: "1 week ago",
    },
    {
      title: "VLSI Design Engineer",
      company: "Qualcomm India",
      location: "Hyderabad, India",
      type: "Full-time",
      skills: ["Verilog", "FPGA", "Digital Design"],
      link: "https://naukri.com",
      postedAgo: "2 days ago",
    },
    {
      title: "Electrical Site Engineer",
      company: "Tata Projects",
      location: "Chennai, India",
      type: "Full-time",
      skills: ["Site Management", "Electrical Systems", "Safety"],
      link: "https://naukri.com",
      postedAgo: "6 days ago",
    },
  ],
  civil: [
    {
      title: "Site Engineer",
      company: "L&T Construction",
      location: "Chennai, India",
      type: "Full-time",
      skills: ["AutoCAD Civil", "Construction Mgmt"],
      link: "https://naukri.com",
      postedAgo: "2 days ago",
    },
    {
      title: "Structural Engineer",
      company: "STUP Consultants",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["STAAD Pro", "Structural Analysis"],
      link: "https://naukri.com",
      postedAgo: "1 day ago",
    },
    {
      title: "Civil Engineering Intern",
      company: "Shapoorji Pallonji",
      location: "Bangalore, India",
      type: "Internship",
      skills: ["AutoCAD", "Surveying"],
      link: "https://internshala.com",
      postedAgo: "3 days ago",
    },
    {
      title: "Project Manager",
      company: "CPWD",
      location: "Delhi, India",
      type: "Government",
      skills: ["Project Management", "Construction"],
      link: "https://cpwd.gov.in",
      postedAgo: "1 week ago",
    },
    {
      title: "Quantity Surveyor",
      company: "DLF Ltd",
      location: "Gurugram, India",
      type: "Full-time",
      skills: ["Estimation", "BOQ", "Contracts"],
      link: "https://naukri.com",
      postedAgo: "5 days ago",
    },
    {
      title: "Transportation Engineer",
      company: "NHAI",
      location: "Pan India",
      type: "Government",
      skills: ["Highway Design", "Traffic Analysis"],
      link: "https://naukri.com",
      postedAgo: "4 days ago",
    },
  ],
  management: [
    {
      title: "Business Analyst",
      company: "Deloitte India",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["SQL", "Excel", "Power BI"],
      link: "https://linkedin.com/jobs",
      postedAgo: "1 day ago",
    },
    {
      title: "Marketing Manager",
      company: "Flipkart",
      location: "Bangalore, India",
      type: "Full-time",
      skills: ["Digital Marketing", "Analytics", "SEO"],
      link: "https://linkedin.com/jobs",
      postedAgo: "2 days ago",
    },
    {
      title: "MBA Intern – Strategy",
      company: "McKinsey India",
      location: "Delhi, India",
      type: "Internship",
      skills: ["Case Analysis", "Excel", "Communication"],
      link: "https://internshala.com",
      postedAgo: "3 days ago",
    },
    {
      title: "Product Manager",
      company: "Swiggy",
      location: "Bangalore, India",
      type: "Full-time",
      skills: ["Product Strategy", "Agile", "Data Analysis"],
      link: "https://linkedin.com/jobs",
      postedAgo: "1 week ago",
    },
    {
      title: "HR Business Partner",
      company: "Infosys",
      location: "Pune, India",
      type: "Full-time",
      skills: ["HR Management", "Communication", "Leadership"],
      link: "https://linkedin.com/jobs",
      postedAgo: "5 days ago",
    },
    {
      title: "Operations Manager",
      company: "Amazon India",
      location: "Hyderabad, India",
      type: "Full-time",
      skills: ["Operations", "Logistics", "Leadership"],
      link: "https://linkedin.com/jobs",
      postedAgo: "4 days ago",
    },
  ],
  mba: [
    {
      title: "Business Analyst",
      company: "Deloitte India",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["SQL", "Excel", "Power BI"],
      link: "https://linkedin.com/jobs",
      postedAgo: "1 day ago",
    },
    {
      title: "Product Manager",
      company: "Swiggy",
      location: "Bangalore, India",
      type: "Full-time",
      skills: ["Product Strategy", "Agile", "Data Analysis"],
      link: "https://linkedin.com/jobs",
      postedAgo: "1 week ago",
    },
    {
      title: "MBA Intern – Strategy",
      company: "McKinsey India",
      location: "Delhi, India",
      type: "Internship",
      skills: ["Case Analysis", "Excel", "Communication"],
      link: "https://internshala.com",
      postedAgo: "3 days ago",
    },
    {
      title: "Marketing Manager",
      company: "Flipkart",
      location: "Bangalore, India",
      type: "Full-time",
      skills: ["Digital Marketing", "Analytics", "SEO"],
      link: "https://linkedin.com/jobs",
      postedAgo: "2 days ago",
    },
    {
      title: "HR Business Partner",
      company: "Infosys",
      location: "Pune, India",
      type: "Full-time",
      skills: ["HR Management", "Communication", "Leadership"],
      link: "https://linkedin.com/jobs",
      postedAgo: "5 days ago",
    },
    {
      title: "Investment Banking Analyst",
      company: "Goldman Sachs India",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["Financial Modeling", "Excel", "Valuation"],
      link: "https://linkedin.com/jobs",
      postedAgo: "2 days ago",
    },
  ],
  medical: [
    {
      title: "Clinical Research Associate",
      company: "IQVIA India",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["GCP", "Clinical Trials", "ICH Guidelines"],
      link: "https://naukri.com",
      postedAgo: "2 days ago",
    },
    {
      title: "Healthcare IT Analyst",
      company: "Apollo Hospitals",
      location: "Hyderabad, India",
      type: "Full-time",
      skills: ["Healthcare IT", "EMR", "Data Analysis"],
      link: "https://naukri.com",
      postedAgo: "1 day ago",
    },
    {
      title: "Medical Coding Intern",
      company: "Manipal Hospital",
      location: "Bangalore, India",
      type: "Internship",
      skills: ["ICD-10", "CPT", "Medical Coding"],
      link: "https://internshala.com",
      postedAgo: "3 days ago",
    },
    {
      title: "Pharmacovigilance Scientist",
      company: "Sun Pharma",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["Drug Safety", "Regulatory Affairs", "ADR Reporting"],
      link: "https://naukri.com",
      postedAgo: "1 week ago",
    },
    {
      title: "Hospital Administrator",
      company: "Fortis Healthcare",
      location: "Delhi, India",
      type: "Full-time",
      skills: ["Hospital Management", "Healthcare Administration"],
      link: "https://naukri.com",
      postedAgo: "5 days ago",
    },
    {
      title: "Medical Representative",
      company: "Cipla Ltd",
      location: "Pan India",
      type: "Full-time",
      skills: ["Medical Knowledge", "Sales", "Communication"],
      link: "https://naukri.com",
      postedAgo: "4 days ago",
    },
  ],
  commerce: [
    {
      title: "Chartered Accountant",
      company: "Deloitte India",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["Auditing", "Taxation", "Financial Reporting"],
      link: "https://naukri.com",
      postedAgo: "1 day ago",
    },
    {
      title: "Financial Analyst",
      company: "HDFC Bank",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["Financial Analysis", "Excel", "Modeling"],
      link: "https://naukri.com",
      postedAgo: "2 days ago",
    },
    {
      title: "Commerce Intern",
      company: "PricewaterhouseCoopers",
      location: "Delhi, India",
      type: "Internship",
      skills: ["Accounting", "Tally", "Excel"],
      link: "https://internshala.com",
      postedAgo: "3 days ago",
    },
    {
      title: "Tax Associate",
      company: "KPMG India",
      location: "Bangalore, India",
      type: "Full-time",
      skills: ["GST", "Income Tax", "Compliance"],
      link: "https://naukri.com",
      postedAgo: "1 week ago",
    },
    {
      title: "Investment Analyst",
      company: "Motilal Oswal",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["Equity Research", "Financial Analysis", "Valuation"],
      link: "https://naukri.com",
      postedAgo: "5 days ago",
    },
    {
      title: "Credit Analyst",
      company: "State Bank of India",
      location: "Pan India",
      type: "Government",
      skills: ["Credit Analysis", "Risk Management", "Banking"],
      link: "https://naukri.com",
      postedAgo: "4 days ago",
    },
  ],
  arts: [
    {
      title: "UI/UX Designer",
      company: "Zomato",
      location: "Bangalore, India",
      type: "Full-time",
      skills: ["Figma", "UI Design", "UX Research"],
      link: "https://dribbble.com/jobs",
      postedAgo: "1 day ago",
    },
    {
      title: "Graphic Design Intern",
      company: "BigBazaar",
      location: "Remote",
      type: "Internship",
      skills: ["Illustrator", "Photoshop", "Branding"],
      link: "https://internshala.com",
      postedAgo: "2 days ago",
    },
    {
      title: "Product Designer",
      company: "Ola Electric",
      location: "Bangalore, India",
      type: "Full-time",
      skills: ["Figma", "Prototyping", "Design Systems"],
      link: "https://dribbble.com/jobs",
      postedAgo: "3 days ago",
    },
    {
      title: "Creative Director",
      company: "Ogilvy India",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["Creative Direction", "Brand Strategy", "Art Direction"],
      link: "https://linkedin.com/jobs",
      postedAgo: "1 week ago",
    },
    {
      title: "Motion Designer",
      company: "Hotstar",
      location: "Mumbai, India",
      type: "Full-time",
      skills: ["After Effects", "Motion Graphics", "Animation"],
      link: "https://linkedin.com/jobs",
      postedAgo: "5 days ago",
    },
    {
      title: "Visual Designer",
      company: "PhonePe",
      location: "Bangalore, India",
      type: "Full-time",
      skills: ["Figma", "Illustration", "Typography"],
      link: "https://dribbble.com/jobs",
      postedAgo: "4 days ago",
    },
  ],
};

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "#39D98A",
  Internship: "#4B8BFF",
  Remote: "#F59E0B",
  "Part-time": "#EC4899",
  Government: "#35D0C7",
};

export default function Jobs() {
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);
  const portals = getStreamJobPortals(userStream || "cse");

  // Get stream-specific sample jobs, falling back to CSE
  const sampleJobs =
    STREAM_SAMPLE_JOBS[userStream] ?? STREAM_SAMPLE_JOBS.cse ?? [];

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
              Curated job portals and listings for{" "}
              <span style={{ color: streamDef.color }}>{streamDef.label}</span>
            </p>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full border"
            style={{
              color: streamDef.color,
              background: `${streamDef.color}15`,
              borderColor: `${streamDef.color}35`,
            }}
            data-ocid="jobs.stream.badge"
          >
            {streamDef.label}
          </span>
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
          <h2 className="section-heading mb-4">
            Latest {streamDef.label} Opportunities
          </h2>
          <div className="space-y-3">
            {sampleJobs.map((job, i) => (
              <a
                key={`${job.title}-${i}`}
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-hover flex flex-col sm:flex-row sm:items-center gap-4 p-4 group cursor-pointer"
                data-ocid={`jobs.listing.item.${i + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${streamDef.color}18` }}
                >
                  <Briefcase size={18} style={{ color: streamDef.color }} />
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
