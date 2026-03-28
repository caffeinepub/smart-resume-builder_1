import {
  Download,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { addNotification } from "../utils/extras";
import { loadResume, saveResume } from "../utils/storage";
import type {
  Certification,
  Education,
  Experience,
  Project,
  ResumeData,
} from "../utils/storage";

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

export default function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(EMPTY_RESUME);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [template, setTemplate] = useState<"classic" | "modern" | "minimal">(
    "classic",
  );
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
  const removeSkill = (s: string) =>
    update(
      "skills",
      resume.skills.filter((x) => x !== s),
    );

  const addEdu = () =>
    update("education", [
      ...resume.education,
      {
        institution: "",
        degree: "",
        field: "",
        startYear: "",
        endYear: "",
      } as Education,
    ]);
  const updateEdu = (i: number, field: keyof Education, val: string) => {
    const arr = resume.education.map((e, idx) =>
      idx === i ? { ...e, [field]: val } : e,
    );
    update("education", arr);
  };
  const removeEdu = (i: number) =>
    update(
      "education",
      resume.education.filter((_, idx) => idx !== i),
    );

  const addProject = () =>
    update("projects", [
      ...resume.projects,
      { name: "", description: "", technologies: [] } as Project,
    ]);
  const updateProject = (i: number, field: keyof Project, val: unknown) => {
    const arr = resume.projects.map((p, idx) =>
      idx === i ? { ...p, [field]: val } : p,
    );
    update("projects", arr);
  };
  const removeProject = (i: number) =>
    update(
      "projects",
      resume.projects.filter((_, idx) => idx !== i),
    );

  const addExp = () =>
    update("experience", [
      ...resume.experience,
      {
        company: "",
        position: "",
        startYear: "",
        endYear: "",
        responsibilities: [],
      } as Experience,
    ]);
  const updateExp = (i: number, field: keyof Experience, val: unknown) => {
    const arr = resume.experience.map((e, idx) =>
      idx === i ? { ...e, [field]: val } : e,
    );
    update("experience", arr);
  };
  const removeExp = (i: number) =>
    update(
      "experience",
      resume.experience.filter((_, idx) => idx !== i),
    );

  const addCert = () =>
    update("certifications", [
      ...resume.certifications,
      { name: "", issuer: "", year: "" } as Certification,
    ]);
  const updateCert = (i: number, field: keyof Certification, val: string) => {
    const arr = resume.certifications.map((c, idx) =>
      idx === i ? { ...c, [field]: val } : c,
    );
    update("certifications", arr);
  };
  const removeCert = (i: number) =>
    update(
      "certifications",
      resume.certifications.filter((_, idx) => idx !== i),
    );

  return (
    <AppShell title="Resume Builder" subtitle="Build & preview your resume">
      <div className="max-w-7xl mx-auto" data-ocid="resume_builder.page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
            <p className="text-white/40 text-sm mt-0.5">
              Changes auto-save to your browser
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewVisible((v) => !v)}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              data-ocid="resume_builder.toggle_preview.button"
            >
              {previewVisible ? <EyeOff size={14} /> : <Eye size={14} />}
              {previewVisible ? "Hide" : "Show"} Preview
            </button>
            <button
              type="button"
              onClick={() => {
                saveResume(resume);
                setHasSavedResume(true);
                addNotification("Resume Created Successfully");
                toast.success("Resume saved!");
              }}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              data-ocid="resume_builder.save.button"
            >
              <Save size={14} /> Save
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
              data-ocid="resume_builder.download.button"
            >
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>

        {/* Load Saved Resume Banner */}
        {hasSavedResume && (
          <div
            className="glass-card p-4 mb-4 flex items-center justify-between border border-purple-500/30 bg-purple-500/10"
            data-ocid="resume_builder.saved_banner"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <FileText size={16} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  You have a saved resume
                </p>
                <p className="text-white/50 text-xs">
                  Click to load it into the editor
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const saved = loadResume();
                if (saved) {
                  setResume(saved);
                  toast.success("Saved resume loaded!");
                }
              }}
              className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
              data-ocid="resume_builder.load_saved.button"
            >
              <Upload size={14} /> Load Saved Resume
            </button>
          </div>
        )}
        <div
          className={`grid gap-6 ${
            previewVisible
              ? "grid-cols-1 xl:grid-cols-2"
              : "grid-cols-1 max-w-2xl"
          }`}
        >
          {/* Form */}
          <div className="space-y-0 print:hidden">
            <SectionCard title="Personal Information">
              {/* Profile Photo */}
              <div className="mb-4">
                <FieldLabel>Profile Photo</FieldLabel>
                <div className="flex items-center gap-4">
                  {resume.profilePhoto ? (
                    <img
                      src={resume.profilePhoto}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/40"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-white/30">
                      <Upload size={20} />
                    </div>
                  )}
                  <div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                      data-ocid="resume_builder.photo.upload_button"
                    >
                      <Upload size={12} />{" "}
                      {resume.profilePhoto ? "Change Photo" : "Upload Photo"}
                    </button>
                    {resume.profilePhoto && (
                      <button
                        type="button"
                        onClick={() => update("profilePhoto", "")}
                        className="mt-1 text-xs text-red-400/70 hover:text-red-400 transition-colors block"
                        data-ocid="resume_builder.photo.delete_button"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <input
                    id="inp-name"
                    data-ocid="resume_builder.name.input"
                    className="input-dark"
                    placeholder="Alex Johnson"
                    value={resume.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <input
                    id="inp-email"
                    data-ocid="resume_builder.email.input"
                    className="input-dark"
                    placeholder="alex@email.com"
                    value={resume.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input
                    id="inp-phone"
                    data-ocid="resume_builder.phone.input"
                    className="input-dark"
                    placeholder="+1-555-0123"
                    value={resume.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>LinkedIn URL</FieldLabel>
                  <input
                    id="inp-linkedin"
                    data-ocid="resume_builder.linkedin.input"
                    className="input-dark"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={resume.linkedinUrl ?? ""}
                    onChange={(e) => update("linkedinUrl", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-3">
                <FieldLabel>Professional Summary</FieldLabel>
                <textarea
                  id="inp-summary"
                  data-ocid="resume_builder.summary.textarea"
                  className="input-dark resize-none"
                  rows={4}
                  placeholder="Brief professional summary..."
                  value={resume.summary}
                  onChange={(e) => update("summary", e.target.value)}
                />
              </div>
            </SectionCard>

            <SectionCard title="Skills">
              <div className="flex gap-2 mb-3">
                <input
                  id="inp-skill"
                  data-ocid="resume_builder.skill.input"
                  className="input-dark flex-1"
                  placeholder="Add a skill (e.g. React)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-primary text-xs py-2 px-4"
                  data-ocid="resume_builder.add_skill.button"
                >
                  <Plus size={15} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((s) => (
                  <span
                    key={s}
                    className="skill-chip flex items-center gap-1.5"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="hover:text-red-400 transition-colors"
                      data-ocid="resume_builder.remove_skill.button"
                    >
                      <Trash2 size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Education">
              {resume.education.map((edu, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                  key={i}
                  className="bg-white/5 rounded-xl p-4 mb-3 relative"
                  data-ocid={`resume_builder.education.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => removeEdu(i)}
                    className="absolute top-3 right-3 text-white/30 hover:text-red-400 transition-colors"
                    data-ocid="resume_builder.remove_education.button"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <FieldLabel>Institution</FieldLabel>
                      <input
                        className="input-dark"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEdu(i, "institution", e.target.value)
                        }
                        placeholder="University name"
                      />
                    </div>
                    <div>
                      <FieldLabel>Degree</FieldLabel>
                      <input
                        className="input-dark"
                        value={edu.degree}
                        onChange={(e) => updateEdu(i, "degree", e.target.value)}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <FieldLabel>Field of Study</FieldLabel>
                      <input
                        className="input-dark"
                        value={edu.field}
                        onChange={(e) => updateEdu(i, "field", e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <FieldLabel>Start Year</FieldLabel>
                        <input
                          className="input-dark"
                          value={edu.startYear}
                          onChange={(e) =>
                            updateEdu(i, "startYear", e.target.value)
                          }
                          placeholder="2021"
                        />
                      </div>
                      <div>
                        <FieldLabel>End Year</FieldLabel>
                        <input
                          className="input-dark"
                          value={edu.endYear}
                          onChange={(e) =>
                            updateEdu(i, "endYear", e.target.value)
                          }
                          placeholder="2025"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addEdu}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                data-ocid="resume_builder.add_education.button"
              >
                <Plus size={14} /> Add Education
              </button>
            </SectionCard>

            <SectionCard title="Work Experience">
              {resume.experience.map((exp, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                  key={i}
                  className="bg-white/5 rounded-xl p-4 mb-3 relative"
                  data-ocid={`resume_builder.experience.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => removeExp(i)}
                    className="absolute top-3 right-3 text-white/30 hover:text-red-400 transition-colors"
                    data-ocid="resume_builder.remove_experience.button"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <FieldLabel>Company</FieldLabel>
                      <input
                        className="input-dark"
                        value={exp.company}
                        onChange={(e) =>
                          updateExp(i, "company", e.target.value)
                        }
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <FieldLabel>Role / Position</FieldLabel>
                      <input
                        className="input-dark"
                        value={exp.position}
                        onChange={(e) =>
                          updateExp(i, "position", e.target.value)
                        }
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <FieldLabel>Start Year</FieldLabel>
                      <input
                        className="input-dark"
                        value={exp.startYear}
                        onChange={(e) =>
                          updateExp(i, "startYear", e.target.value)
                        }
                        placeholder="2023"
                      />
                    </div>
                    <div>
                      <FieldLabel>End Year</FieldLabel>
                      <input
                        className="input-dark"
                        value={exp.endYear}
                        onChange={(e) =>
                          updateExp(i, "endYear", e.target.value)
                        }
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <FieldLabel>
                      Description / Responsibilities (one per line)
                    </FieldLabel>
                    <textarea
                      className="input-dark resize-none"
                      rows={3}
                      value={exp.responsibilities.join("\n")}
                      onChange={(e) =>
                        updateExp(
                          i,
                          "responsibilities",
                          e.target.value.split("\n"),
                        )
                      }
                      placeholder="• Built React components..."
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExp}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                data-ocid="resume_builder.add_experience.button"
              >
                <Plus size={14} /> Add Experience
              </button>
            </SectionCard>

            <SectionCard title="Projects">
              {resume.projects.map((proj, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                  key={i}
                  className="bg-white/5 rounded-xl p-4 mb-3 relative"
                  data-ocid={`resume_builder.project.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => removeProject(i)}
                    className="absolute top-3 right-3 text-white/30 hover:text-red-400 transition-colors"
                    data-ocid="resume_builder.remove_project.button"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="mb-2">
                    <FieldLabel>Project Name</FieldLabel>
                    <input
                      className="input-dark"
                      value={proj.name}
                      onChange={(e) => updateProject(i, "name", e.target.value)}
                      placeholder="E-Commerce Dashboard"
                    />
                  </div>
                  <div className="mb-2">
                    <FieldLabel>Description</FieldLabel>
                    <textarea
                      className="input-dark resize-none"
                      rows={2}
                      value={proj.description}
                      onChange={(e) =>
                        updateProject(i, "description", e.target.value)
                      }
                      placeholder="What you built and why..."
                    />
                  </div>
                  <div>
                    <FieldLabel>Technologies (comma-separated)</FieldLabel>
                    <input
                      className="input-dark"
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
                      placeholder="React, TypeScript, Node.js"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addProject}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                data-ocid="resume_builder.add_project.button"
              >
                <Plus size={14} /> Add Project
              </button>
            </SectionCard>

            <SectionCard title="Certifications">
              {resume.certifications.map((cert, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                  key={i}
                  className="bg-white/5 rounded-xl p-4 mb-3 relative"
                  data-ocid={`resume_builder.certification.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => removeCert(i)}
                    className="absolute top-3 right-3 text-white/30 hover:text-red-400 transition-colors"
                    data-ocid="resume_builder.remove_cert.button"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <FieldLabel>Certification Name</FieldLabel>
                      <input
                        className="input-dark"
                        value={cert.name}
                        onChange={(e) => updateCert(i, "name", e.target.value)}
                        placeholder="AWS Solutions Architect"
                      />
                    </div>
                    <div>
                      <FieldLabel>Year</FieldLabel>
                      <input
                        className="input-dark"
                        value={cert.year}
                        onChange={(e) => updateCert(i, "year", e.target.value)}
                        placeholder="2024"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <FieldLabel>Issuer</FieldLabel>
                      <input
                        className="input-dark"
                        value={cert.issuer}
                        onChange={(e) =>
                          updateCert(i, "issuer", e.target.value)
                        }
                        placeholder="Amazon Web Services"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCert}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                data-ocid="resume_builder.add_cert.button"
              >
                <Plus size={14} /> Add Certification
              </button>
            </SectionCard>
          </div>

          {/* Preview */}
          {previewVisible && (
            <div className="print:block" ref={previewRef}>
              {/* Template Picker */}
              <div className="flex items-center gap-2 mb-3 print:hidden">
                <span className="text-white/40 text-xs font-medium mr-1">
                  Template:
                </span>
                {(["classic", "modern", "minimal"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${template === t ? "bg-purple-600 text-white" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
                    data-ocid={`resume_builder.template_${t}.button`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div
                id="resume-preview"
                className={`rounded-2xl shadow-2xl text-sm leading-relaxed bg-white text-gray-900 ${template === "modern" ? "overflow-hidden" : "p-8"}`}
                style={
                  template === "minimal"
                    ? { fontFamily: "Georgia, serif", background: "#f8f8f6" }
                    : {}
                }
                data-ocid="resume_builder.preview.panel"
              >
                {/* Modern template: colored header */}
                {template === "modern" && (
                  <div
                    style={{
                      background: "linear-gradient(135deg,#1e1b4b,#312e81)",
                    }}
                    className="p-8 text-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white">
                          {resume.name || "Your Name"}
                        </h1>
                        <div className="flex flex-wrap gap-3 text-purple-200 text-sm mt-2">
                          {resume.email && <span>✉ {resume.email}</span>}
                          {resume.phone && <span>☎ {resume.phone}</span>}
                          {resume.linkedinUrl && (
                            <span>
                              🔗{" "}
                              <a
                                href={resume.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-300 hover:underline"
                              >
                                LinkedIn
                              </a>
                            </span>
                          )}
                        </div>
                        {resume.summary && (
                          <p className="mt-3 text-purple-100/80 text-sm leading-relaxed">
                            {resume.summary}
                          </p>
                        )}
                      </div>
                      {resume.profilePhoto && (
                        <img
                          src={resume.profilePhoto}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-400/50 flex-shrink-0"
                        />
                      )}
                    </div>
                  </div>
                )}

                {template !== "modern" && (
                  <div className="border-b-2 border-gray-200 pb-5 mb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {resume.name || "Your Name"}
                        </h1>
                        <div className="flex flex-wrap gap-3 text-gray-600 text-sm mt-2">
                          {resume.email && <span>✉ {resume.email}</span>}
                          {resume.phone && <span>☎ {resume.phone}</span>}
                          {resume.linkedinUrl && (
                            <span>
                              🔗{" "}
                              <a
                                href={resume.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                LinkedIn
                              </a>
                            </span>
                          )}
                        </div>
                        {resume.summary && (
                          <p className="mt-3 text-gray-700 leading-relaxed">
                            {resume.summary}
                          </p>
                        )}
                      </div>
                      {resume.profilePhoto && (
                        <img
                          src={resume.profilePhoto}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className={template === "modern" ? "p-8" : ""}>
                  {resume.skills.length > 0 && (
                    <div className="mb-5">
                      <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">
                        Technical Skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded text-xs font-medium border border-blue-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {resume.education.length > 0 && (
                    <div className="mb-5">
                      <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">
                        Education
                      </h2>
                      {resume.education.map((edu, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                        <div key={i} className="mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {edu.institution}
                              </p>
                              <p className="text-gray-600">
                                {edu.degree}
                                {edu.field && ` in ${edu.field}`}
                              </p>
                            </div>
                            {(edu.startYear || edu.endYear) && (
                              <span className="text-gray-500 text-xs">
                                {edu.startYear} – {edu.endYear}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {resume.experience.length > 0 && (
                    <div className="mb-5">
                      <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">
                        Work Experience
                      </h2>
                      {resume.experience.map((exp, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                        <div key={i} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {exp.position}
                              </p>
                              <p className="text-gray-600">{exp.company}</p>
                            </div>
                            {(exp.startYear || exp.endYear) && (
                              <span className="text-gray-500 text-xs">
                                {exp.startYear} – {exp.endYear}
                              </span>
                            )}
                          </div>
                          <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                            {exp.responsibilities
                              .filter(Boolean)
                              .map((r, j) => (
                                // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                                <li key={j}>
                                  {r.replace(/^[\u2022\-]\s*/, "")}
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {resume.projects.length > 0 && (
                    <div className="mb-5">
                      <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">
                        Projects
                      </h2>
                      {resume.projects.map((p, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                        <div key={i} className="mb-3">
                          <p className="font-semibold text-gray-900">
                            {p.name}
                          </p>
                          <p className="text-gray-700">{p.description}</p>
                          {p.technologies.length > 0 && (
                            <p className="text-gray-500 text-xs mt-1">
                              Stack: {p.technologies.join(" · ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {resume.certifications.length > 0 && (
                    <div>
                      <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">
                        Certifications
                      </h2>
                      {resume.certifications.map((c, i) => (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: index is stable
                          key={i}
                          className="flex justify-between items-center mb-1"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {c.name}
                            </p>
                            <p className="text-gray-600 text-xs">{c.issuer}</p>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {c.year}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
