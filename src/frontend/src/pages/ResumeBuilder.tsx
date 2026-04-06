import {
  Download,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Layers,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { getUserStream } from "../utils/auth";
import { addNotification } from "../utils/extras";
import { loadResume, saveResume } from "../utils/storage";
import type {
  Certification,
  Education,
  Experience,
  Project,
  ResumeData,
} from "../utils/storage";
import { getStreamById } from "../utils/streamData";

const EMPTY_RESUME: ResumeData = {
  name: "",
  email: "",
  phone: "",
  summary: "",
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  profilePhoto: "",
  linkedinUrl: "",
};

export type ResumeTemplate =
  | "software"
  | "mechanical"
  | "electrical"
  | "mba"
  | "medical"
  | "finance"
  | "civil"
  | "design";

const RESUME_TEMPLATES: Array<{
  id: ResumeTemplate;
  label: string;
  desc: string;
  color: string;
  streams: string[];
}> = [
  {
    id: "software",
    label: "Software",
    desc: "Clean technical layout with GitHub/skills focus",
    color: "#7C5CFF",
    streams: ["cse"],
  },
  {
    id: "mechanical",
    label: "Mechanical",
    desc: "Structured format for core engineering roles",
    color: "#F97316",
    streams: ["mechanical"],
  },
  {
    id: "electrical",
    label: "Electrical",
    desc: "Technical layout with circuits & systems focus",
    color: "#F59E0B",
    streams: ["electrical"],
  },
  {
    id: "civil",
    label: "Civil",
    desc: "Structured layout for construction & infra roles",
    color: "#10B981",
    streams: ["civil"],
  },
  {
    id: "mba",
    label: "MBA",
    desc: "Achievement-focused professional template",
    color: "#0EA5E9",
    streams: ["management", "mba"],
  },
  {
    id: "medical",
    label: "Medical",
    desc: "Clinical format with research & patient care focus",
    color: "#EC4899",
    streams: ["medical"],
  },
  {
    id: "finance",
    label: "Finance",
    desc: "Formal template for banking & finance roles",
    color: "#14B8A6",
    streams: ["commerce"],
  },
  {
    id: "design",
    label: "Design/Arts",
    desc: "Creative layout for design & arts careers",
    color: "#A855F7",
    streams: ["arts"],
  },
];

function getDefaultTemplate(stream: string): ResumeTemplate {
  const match = RESUME_TEMPLATES.find((t) => t.streams.includes(stream));
  return match?.id ?? "software";
}

function SectionCard({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5 mb-4">
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <GripVertical size={14} className="text-white/30" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="label-dark">{children}</p>;
}

function getTemplateSections(template: ResumeTemplate): string[] {
  switch (template) {
    case "mechanical":
    case "electrical":
    case "civil":
      return [
        "Experience / Internship",
        "Technical Skills",
        "Projects",
        "Tools & Software",
        "Certifications",
      ];
    case "mba":
      return [
        "Internship",
        "Leadership",
        "Achievements",
        "Core Skills",
        "Certifications",
      ];
    case "medical":
      return [
        "Clinical Experience",
        "Research",
        "Technical Skills",
        "Publications",
        "Certifications",
      ];
    case "finance":
      return [
        "Experience",
        "Financial Skills",
        "Certifications",
        "Projects",
        "Achievements",
      ];
    case "design":
      return [
        "Portfolio",
        "Design Skills",
        "Tools",
        "Projects",
        "Awards/Recognition",
      ];
    default:
      return [
        "Work Experience",
        "Technical Skills",
        "Projects",
        "Certifications",
        "GitHub/Portfolio",
      ];
  }
}

function ResumePreview({
  resume,
  template,
}: { resume: ResumeData; template: ResumeTemplate }) {
  const templateConfig: Record<
    ResumeTemplate,
    { accent: string; headerBg: string; fontStyle: string }
  > = {
    software: {
      accent: "#7C5CFF",
      headerBg: "linear-gradient(135deg, #7C5CFF, #4B8BFF)",
      fontStyle: "font-mono",
    },
    mechanical: {
      accent: "#F97316",
      headerBg: "linear-gradient(135deg, #F97316, #FBBF24)",
      fontStyle: "font-sans",
    },
    electrical: {
      accent: "#F59E0B",
      headerBg: "linear-gradient(135deg, #F59E0B, #F97316)",
      fontStyle: "font-sans",
    },
    civil: {
      accent: "#10B981",
      headerBg: "linear-gradient(135deg, #10B981, #059669)",
      fontStyle: "font-sans",
    },
    mba: {
      accent: "#0EA5E9",
      headerBg: "linear-gradient(135deg, #0EA5E9, #6366F1)",
      fontStyle: "font-sans",
    },
    medical: {
      accent: "#EC4899",
      headerBg: "linear-gradient(135deg, #EC4899, #A855F7)",
      fontStyle: "font-sans",
    },
    finance: {
      accent: "#14B8A6",
      headerBg: "linear-gradient(135deg, #14B8A6, #0EA5E9)",
      fontStyle: "font-sans",
    },
    design: {
      accent: "#A855F7",
      headerBg: "linear-gradient(135deg, #A855F7, #EC4899)",
      fontStyle: "font-sans",
    },
  };

  const config = templateConfig[template];

  return (
    <div
      id="resume-preview"
      className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl"
      style={{ minHeight: "842px", fontFamily: "Arial, sans-serif" }}
    >
      {/* Header */}
      <div
        className="p-6 rounded-lg mb-6 text-white"
        style={{ background: config.headerBg }}
      >
        <div className="flex items-center gap-4">
          {resume.profilePhoto && (
            <img
              src={resume.profilePhoto}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-white/50"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{resume.name || "Your Name"}</h1>
            <div className="flex flex-wrap gap-3 mt-1 text-white/80 text-sm">
              {resume.email && <span>{resume.email}</span>}
              {resume.phone && <span>• {resume.phone}</span>}
              {resume.linkedinUrl && <span>• {resume.linkedinUrl}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <section className="mb-5">
          <h2
            className="text-base font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
            style={{ color: config.accent, borderColor: config.accent }}
          >
            {template === "mba"
              ? "Professional Summary"
              : template === "medical"
                ? "Clinical Summary"
                : template === "design"
                  ? "Creative Statement"
                  : "Summary / Objective"}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {resume.summary}
          </p>
        </section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <section className="mb-5">
          <h2
            className="text-base font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
            style={{ color: config.accent, borderColor: config.accent }}
          >
            Education
          </h2>
          {resume.education.map((edu, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">
                    {edu.institution}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {edu.degree} in {edu.field}
                  </p>
                </div>
                <span className="text-gray-500 text-sm">
                  {edu.startYear} – {edu.endYear}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section className="mb-5">
          <h2
            className="text-base font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
            style={{ color: config.accent, borderColor: config.accent }}
          >
            {template === "mechanical" ||
            template === "electrical" ||
            template === "civil"
              ? "Technical Skills"
              : template === "design"
                ? "Design Skills & Tools"
                : template === "finance"
                  ? "Financial Skills"
                  : "Skills"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 rounded font-medium text-white"
                style={{ backgroundColor: config.accent }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-5">
          <h2
            className="text-base font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
            style={{ color: config.accent, borderColor: config.accent }}
          >
            {template === "mechanical" ||
            template === "electrical" ||
            template === "civil"
              ? "Internship / Experience"
              : template === "medical"
                ? "Clinical Experience"
                : template === "design"
                  ? "Work Experience"
                  : template === "mba"
                    ? "Professional Experience"
                    : "Work Experience"}
          </h2>
          {resume.experience.map((exp, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{exp.position}</p>
                  <p className="text-gray-600 text-sm">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-sm">
                  {exp.startYear} – {exp.endYear}
                </span>
              </div>
              <ul className="mt-1.5 space-y-1">
                {exp.responsibilities.map((r, j) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                    key={j}
                    className="text-gray-700 text-sm flex items-start gap-2"
                  >
                    <span style={{ color: config.accent }}>▸</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <section className="mb-5">
          <h2
            className="text-base font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
            style={{ color: config.accent, borderColor: config.accent }}
          >
            {template === "design" ? "Portfolio Projects" : "Projects"}
          </h2>
          {resume.projects.map((proj, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
            <div key={i} className="mb-3">
              <p className="font-semibold text-gray-900">{proj.name}</p>
              <p className="text-gray-700 text-sm">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] px-1.5 py-0.5 rounded"
                      style={{
                        background: `${config.accent}15`,
                        color: config.accent,
                        border: `1px solid ${config.accent}30`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <section className="mb-5">
          <h2
            className="text-base font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
            style={{ color: config.accent, borderColor: config.accent }}
          >
            Certifications
          </h2>
          {resume.certifications.map((cert, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
            <div key={i} className="flex items-start justify-between mb-1">
              <div>
                <span className="text-gray-900 text-sm font-medium">
                  {cert.name}
                </span>
                <span className="text-gray-500 text-sm"> — {cert.issuer}</span>
              </div>
              <span className="text-gray-500 text-sm">{cert.year}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default function ResumeBuilder() {
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);
  const defaultTemplate = getDefaultTemplate(userStream);

  const [resume, setResume] = useState<ResumeData>(EMPTY_RESUME);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [template, setTemplate] = useState<ResumeTemplate>(defaultTemplate);
  const [skillInput, setSkillInput] = useState("");
  const [hasSavedResume, setHasSavedResume] = useState(
    () => loadResume() !== null,
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // No auto-load on mount — form starts blank

  const update = (field: keyof ResumeData, value: unknown) => {
    setResume((prev) => {
      const next = { ...prev, [field]: value };
      saveResume(next);
      return next;
    });
  };

  const handlePrint = () => window.print();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      update("profilePhoto", ev.target?.result as string);
      toast.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || resume.skills.includes(s)) return;
    update("skills", [...resume.skills, s]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    update(
      "skills",
      resume.skills.filter((x) => x !== s),
    );
  };

  const addEducation = () => {
    const edu: Education = {
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
    };
    update("education", [...resume.education, edu]);
  };

  const updateEducation = (
    i: number,
    field: keyof Education,
    value: string,
  ) => {
    const updated = resume.education.map((e, idx) =>
      idx === i ? { ...e, [field]: value } : e,
    );
    update("education", updated);
  };

  const removeEducation = (i: number) => {
    update(
      "education",
      resume.education.filter((_, idx) => idx !== i),
    );
  };

  const addProject = () => {
    const p: Project = { name: "", description: "", technologies: [] };
    update("projects", [...resume.projects, p]);
  };

  const updateProject = (i: number, field: keyof Project, value: unknown) => {
    const updated = resume.projects.map((p, idx) =>
      idx === i ? { ...p, [field]: value } : p,
    );
    update("projects", updated);
  };

  const removeProject = (i: number) => {
    update(
      "projects",
      resume.projects.filter((_, idx) => idx !== i),
    );
  };

  const addExperience = () => {
    const e: Experience = {
      company: "",
      position: "",
      startYear: "",
      endYear: "",
      responsibilities: [""],
    };
    update("experience", [...resume.experience, e]);
  };

  const updateExperience = (
    i: number,
    field: keyof Experience,
    value: unknown,
  ) => {
    const updated = resume.experience.map((e, idx) =>
      idx === i ? { ...e, [field]: value } : e,
    );
    update("experience", updated);
  };

  const removeExperience = (i: number) => {
    update(
      "experience",
      resume.experience.filter((_, idx) => idx !== i),
    );
  };

  const addCertification = () => {
    const c: Certification = { name: "", issuer: "", year: "" };
    update("certifications", [...resume.certifications, c]);
  };

  const updateCertification = (
    i: number,
    field: keyof Certification,
    value: string,
  ) => {
    const updated = resume.certifications.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c,
    );
    update("certifications", updated);
  };

  const removeCertification = (i: number) => {
    update(
      "certifications",
      resume.certifications.filter((_, idx) => idx !== i),
    );
  };

  const handleSaveResume = () => {
    saveResume(resume);
    setHasSavedResume(true);
    addNotification("Resume saved successfully!");
    toast.success("Resume saved!");
  };

  const handleLoadSaved = () => {
    const saved = loadResume();
    if (saved) {
      setResume(saved);
      toast.success("Loaded saved resume!");
    } else {
      toast.error("No saved resume found.");
    }
  };

  const recommendedSections = getTemplateSections(template);
  const activeTemplateConfig = RESUME_TEMPLATES.find((t) => t.id === template);

  return (
    <AppShell title="Resume Builder" subtitle="Build your ATS-ready resume">
      <div className="max-w-7xl mx-auto" data-ocid="resume_builder.page">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
            <p className="text-white/40 text-sm">
              Build a professional resume for{" "}
              <span style={{ color: streamDef.color }}>{streamDef.label}</span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {hasSavedResume && (
              <button
                type="button"
                onClick={handleLoadSaved}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                data-ocid="resume_builder.load_saved.button"
              >
                <Upload size={13} /> Load Saved
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveResume}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
              data-ocid="resume_builder.save.button"
            >
              <Save size={13} /> Save Resume
            </button>
            <button
              type="button"
              onClick={() => setPreviewVisible((v) => !v)}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              data-ocid="resume_builder.preview_toggle.button"
            >
              {previewVisible ? (
                <>
                  <EyeOff size={13} /> Hide Preview
                </>
              ) : (
                <>
                  <Eye size={13} /> Show Preview
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
              data-ocid="resume_builder.download.button"
            >
              <Download size={13} /> Download PDF
            </button>
          </div>
        </div>

        {/* Template Selector */}
        <div
          className="glass-card p-4 mb-5"
          data-ocid="resume_builder.templates.panel"
        >
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-white/60" />
            <p className="text-white font-semibold text-sm">Resume Template</p>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full border"
              style={{
                color: streamDef.color,
                background: `${streamDef.color}12`,
                borderColor: `${streamDef.color}28`,
              }}
            >
              Recommended for {streamDef.label}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {RESUME_TEMPLATES.map((tmpl) => {
              const isSelected = template === tmpl.id;
              const isRecommended = tmpl.streams.includes(userStream);
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setTemplate(tmpl.id)}
                  className="relative p-2.5 rounded-xl border text-left transition-all duration-200 focus:outline-none"
                  style={{
                    background: isSelected
                      ? `${tmpl.color}20`
                      : "rgba(255,255,255,0.03)",
                    borderColor: isSelected
                      ? tmpl.color
                      : isRecommended
                        ? `${tmpl.color}40`
                        : "rgba(255,255,255,0.08)",
                  }}
                  data-ocid={`resume_builder.template.item.${RESUME_TEMPLATES.indexOf(tmpl) + 1}`}
                >
                  {isRecommended && (
                    <div
                      className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                      style={{ background: tmpl.color }}
                    />
                  )}
                  <p
                    className="text-xs font-semibold leading-tight"
                    style={{
                      color: isSelected ? tmpl.color : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {tmpl.label}
                  </p>
                  <p className="text-white/30 text-[9px] mt-0.5 leading-tight">
                    {tmpl.desc.slice(0, 30)}...
                  </p>
                </button>
              );
            })}
          </div>
          {activeTemplateConfig && (
            <div className="mt-3 pt-2 border-t border-white/6">
              <p className="text-white/40 text-xs">
                <span
                  style={{ color: activeTemplateConfig.color }}
                  className="font-semibold"
                >
                  {activeTemplateConfig.label} Template:
                </span>{" "}
                Key sections: {recommendedSections.join(" • ")}
              </p>
            </div>
          )}
        </div>

        <div
          className={`grid gap-6 ${previewVisible ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
        >
          {/* Form column */}
          <div className="space-y-0 print:hidden" ref={previewRef}>
            {/* Personal Info */}
            <SectionCard title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Full Name *</FieldLabel>
                  <input
                    type="text"
                    className="input-dark"
                    placeholder="Your Full Name"
                    value={resume.name}
                    onChange={(e) => update("name", e.target.value)}
                    data-ocid="resume_builder.name.input"
                  />
                </div>
                <div>
                  <FieldLabel>Email *</FieldLabel>
                  <input
                    type="email"
                    className="input-dark"
                    placeholder="your@email.com"
                    value={resume.email}
                    onChange={(e) => update("email", e.target.value)}
                    data-ocid="resume_builder.email.input"
                  />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input
                    type="tel"
                    className="input-dark"
                    placeholder="+91-9876543210"
                    value={resume.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    data-ocid="resume_builder.phone.input"
                  />
                </div>
                <div>
                  <FieldLabel>LinkedIn URL</FieldLabel>
                  <input
                    type="url"
                    className="input-dark"
                    placeholder="https://linkedin.com/in/yourname"
                    value={resume.linkedinUrl ?? ""}
                    onChange={(e) => update("linkedinUrl", e.target.value)}
                    data-ocid="resume_builder.linkedin.input"
                  />
                </div>
              </div>
              <div className="mt-3">
                <FieldLabel>Profile Photo</FieldLabel>
                <div className="flex items-center gap-3">
                  {resume.profilePhoto && (
                    <img
                      src={resume.profilePhoto}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border border-white/20"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                    data-ocid="resume_builder.photo.upload_button"
                  >
                    <Upload size={12} /> Upload Photo
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Summary */}
            <SectionCard title="Professional Summary">
              <textarea
                className="input-dark resize-none"
                rows={4}
                placeholder={`Write a compelling ${template === "mba" ? "professional" : template === "design" ? "creative" : "technical"} summary highlighting your key strengths and ${streamDef.label} expertise...`}
                value={resume.summary}
                onChange={(e) => update("summary", e.target.value)}
                data-ocid="resume_builder.summary.textarea"
              />
            </SectionCard>

            {/* Education */}
            <SectionCard title="Education">
              {resume.education.map((edu, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                  key={i}
                  className="p-3 rounded-xl bg-white/3 border border-white/8 mb-3"
                  data-ocid={`resume_builder.education.item.${i + 1}`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <div className="sm:col-span-2">
                      <FieldLabel>Institution</FieldLabel>
                      <input
                        type="text"
                        className="input-dark py-2"
                        placeholder="University / College Name"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(i, "institution", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Degree</FieldLabel>
                      <input
                        type="text"
                        className="input-dark py-2"
                        placeholder="B.Tech / B.E. / MBA"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(i, "degree", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Field / Branch</FieldLabel>
                      <input
                        type="text"
                        className="input-dark py-2"
                        placeholder="Computer Science / Mechanical..."
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(i, "field", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Start Year</FieldLabel>
                      <input
                        type="text"
                        className="input-dark py-2"
                        placeholder="2020"
                        value={edu.startYear}
                        onChange={(e) =>
                          updateEducation(i, "startYear", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>End Year</FieldLabel>
                      <input
                        type="text"
                        className="input-dark py-2"
                        placeholder="2024 / Present"
                        value={edu.endYear}
                        onChange={(e) =>
                          updateEducation(i, "endYear", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEducation(i)}
                    className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300"
                    data-ocid={`resume_builder.education.delete_button.${i + 1}`}
                  >
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addEducation}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 mt-1"
                data-ocid="resume_builder.education.add_button"
              >
                <Plus size={12} /> Add Education
              </button>
            </SectionCard>

            {/* Skills */}
            <SectionCard title="Skills">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="input-dark flex-1"
                  placeholder={`e.g. ${streamDef.roles[0]?.requiredSkills[0] ?? "JavaScript"}`}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  data-ocid="resume_builder.skill.input"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-primary text-xs px-4"
                  data-ocid="resume_builder.skill.add_button"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border"
                    style={{
                      color: streamDef.color,
                      background: `${streamDef.color}12`,
                      borderColor: `${streamDef.color}28`,
                    }}
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="text-current opacity-60 hover:opacity-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </SectionCard>

            {/* Experience */}
            <SectionCard
              title={
                template === "mechanical" ||
                template === "electrical" ||
                template === "civil"
                  ? "Internship / Work Experience"
                  : template === "medical"
                    ? "Clinical / Work Experience"
                    : "Work Experience"
              }
            >
              {resume.experience.map((exp, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                  key={i}
                  className="p-3 rounded-xl bg-white/3 border border-white/8 mb-3"
                  data-ocid={`resume_builder.experience.item.${i + 1}`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <div>
                      <FieldLabel>Company</FieldLabel>
                      <input
                        type="text"
                        className="input-dark py-2"
                        placeholder="Company / Hospital / Firm Name"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(i, "company", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Position / Role</FieldLabel>
                      <input
                        type="text"
                        className="input-dark py-2"
                        placeholder="Intern / Engineer / Analyst"
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(i, "position", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Start Year</FieldLabel>
                      <input
                        type="text"
                        className="input-dark py-2"
                        placeholder="2022"
                        value={exp.startYear}
                        onChange={(e) =>
                          updateExperience(i, "startYear", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>End Year</FieldLabel>
                      <input
                        type="text"
                        className="input-dark py-2"
                        placeholder="2023 / Present"
                        value={exp.endYear}
                        onChange={(e) =>
                          updateExperience(i, "endYear", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <FieldLabel>Key Responsibilities</FieldLabel>
                  {exp.responsibilities.map((resp, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                    <div key={j} className="flex gap-2 mb-1">
                      <input
                        type="text"
                        className="input-dark py-2 flex-1"
                        placeholder="Describe your role and achievement..."
                        value={resp}
                        onChange={(e) => {
                          const updated = exp.responsibilities.map((r, ri) =>
                            ri === j ? e.target.value : r,
                          );
                          updateExperience(i, "responsibilities", updated);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = exp.responsibilities.filter(
                            (_, ri) => ri !== j,
                          );
                          updateExperience(i, "responsibilities", updated);
                        }}
                        className="text-red-400/60 hover:text-red-400 flex-shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      updateExperience(i, "responsibilities", [
                        ...exp.responsibilities,
                        "",
                      ])
                    }
                    className="text-purple-400 text-xs flex items-center gap-1 mt-1 hover:text-purple-300"
                  >
                    <Plus size={11} /> Add responsibility
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(i)}
                    className="text-red-400 text-xs flex items-center gap-1 mt-2 hover:text-red-300"
                    data-ocid={`resume_builder.experience.delete_button.${i + 1}`}
                  >
                    <Trash2 size={11} /> Remove Experience
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addExperience}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                data-ocid="resume_builder.experience.add_button"
              >
                <Plus size={12} /> Add Experience
              </button>
            </SectionCard>

            {/* Projects */}
            <SectionCard
              title={template === "design" ? "Portfolio Projects" : "Projects"}
            >
              {resume.projects.map((proj, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                  key={i}
                  className="p-3 rounded-xl bg-white/3 border border-white/8 mb-3"
                  data-ocid={`resume_builder.project.item.${i + 1}`}
                >
                  <div className="mb-2">
                    <FieldLabel>Project Name</FieldLabel>
                    <input
                      type="text"
                      className="input-dark py-2"
                      placeholder="Project / System Name"
                      value={proj.name}
                      onChange={(e) => updateProject(i, "name", e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <FieldLabel>Description</FieldLabel>
                    <textarea
                      className="input-dark resize-none py-2"
                      rows={2}
                      placeholder="Describe the project, your role, and impact..."
                      value={proj.description}
                      onChange={(e) =>
                        updateProject(i, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <FieldLabel>Technologies / Tools Used</FieldLabel>
                    <input
                      type="text"
                      className="input-dark py-2"
                      placeholder="React, Node.js, AutoCAD... (comma separated)"
                      value={proj.technologies.join(", ")}
                      onChange={(e) =>
                        updateProject(
                          i,
                          "technologies",
                          e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProject(i)}
                    className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300"
                    data-ocid={`resume_builder.project.delete_button.${i + 1}`}
                  >
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addProject}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                data-ocid="resume_builder.project.add_button"
              >
                <Plus size={12} /> Add Project
              </button>
            </SectionCard>

            {/* Certifications */}
            <SectionCard title="Certifications">
              {resume.certifications.map((cert, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                  key={i}
                  className="p-3 rounded-xl bg-white/3 border border-white/8 mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2"
                  data-ocid={`resume_builder.certification.item.${i + 1}`}
                >
                  <div className="sm:col-span-2">
                    <FieldLabel>Certification Name</FieldLabel>
                    <input
                      type="text"
                      className="input-dark py-2"
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) =>
                        updateCertification(i, "name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <FieldLabel>Year</FieldLabel>
                    <input
                      type="text"
                      className="input-dark py-2"
                      placeholder="2024"
                      value={cert.year}
                      onChange={(e) =>
                        updateCertification(i, "year", e.target.value)
                      }
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <FieldLabel>Issuer / Platform</FieldLabel>
                    <input
                      type="text"
                      className="input-dark py-2"
                      placeholder="Coursera / Google / NPTEL"
                      value={cert.issuer}
                      onChange={(e) =>
                        updateCertification(i, "issuer", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertification(i)}
                    className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300"
                    data-ocid={`resume_builder.certification.delete_button.${i + 1}`}
                  >
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCertification}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                data-ocid="resume_builder.certification.add_button"
              >
                <Plus size={12} /> Add Certification
              </button>
            </SectionCard>

            <div className="flex gap-3 pt-2 print:hidden">
              <button
                type="button"
                onClick={handleSaveResume}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                data-ocid="resume_builder.save_final.button"
              >
                <Save size={15} /> Save Resume
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                data-ocid="resume_builder.print.button"
              >
                <FileText size={15} /> Export PDF
              </button>
            </div>
          </div>

          {/* Preview column */}
          {previewVisible && (
            <div className="print:block">
              <div className="sticky top-5">
                <div className="flex items-center justify-between mb-3 print:hidden">
                  <p className="text-white/60 text-sm font-medium">
                    Live Preview
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{
                      color: activeTemplateConfig?.color ?? streamDef.color,
                      background: `${activeTemplateConfig?.color ?? streamDef.color}12`,
                      borderColor: `${activeTemplateConfig?.color ?? streamDef.color}28`,
                    }}
                  >
                    {activeTemplateConfig?.label ?? "Software"} Template
                  </span>
                </div>
                <div className="overflow-auto max-h-[calc(100vh-180px)] rounded-xl print:max-h-none print:overflow-visible">
                  <ResumePreview resume={resume} template={template} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
