import {
  BookOpen,
  ChevronDown,
  Code2,
  ExternalLink,
  HelpCircle,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import AppShell from "../components/AppShell";
import { LEARNING_RESOURCES, ROLES } from "../utils/roleData";
import { loadCareerProfile, loadResume } from "../utils/storage";

const ALL_SKILLS = Object.keys(LEARNING_RESOURCES);

function ResourceCard({ skill }: { skill: string }) {
  const res = LEARNING_RESOURCES[skill];
  if (!res) return null;
  return (
    <div className="glass-card p-5" data-ocid="learning_resources.skill.card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-base">{skill}</h3>
          <p className="text-white/40 text-xs mt-0.5">{res.description}</p>
        </div>
        <span className="skill-chip text-xs">{skill}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <a
          href={res.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
          data-ocid="learning_resources.youtube.button"
        >
          <Youtube size={14} /> YouTube Tutorial
        </a>
        <a
          href={res.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
          data-ocid="learning_resources.docs.button"
        >
          <BookOpen size={14} /> Official Docs
        </a>
        <a
          href={res.practice}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
          data-ocid="learning_resources.practice.button"
        >
          <Code2 size={14} /> Practice Now
        </a>
      </div>

      <div>
        <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
          <HelpCircle size={12} /> Interview Questions
        </h4>
        <ul className="space-y-1">
          {res.interviewQuestions.map((q, i) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: stable index
              key={i}
              className="text-white/50 text-xs flex items-start gap-2"
            >
              <span className="text-purple-400 font-bold mt-0.5">
                Q{i + 1}.
              </span>{" "}
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function LearningResources() {
  const resume = loadResume();
  const careerProfile = loadCareerProfile();

  const missingSkillsFromProfile = careerProfile?.learningPlan ?? [];
  const missingSkillsFromRole = (() => {
    if (!careerProfile?.targetRole || !resume) return [];
    const role = ROLES[careerProfile.targetRole];
    if (!role) return [];
    return role.required.filter(
      (s) =>
        !resume.skills.map((k) => k.toLowerCase()).includes(s.toLowerCase()),
    );
  })();

  const missingSkills = Array.from(
    new Set([...missingSkillsFromProfile, ...missingSkillsFromRole]),
  );
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [filter, setFilter] = useState<"missing" | "all">("missing");

  const displayedSkills =
    filter === "missing"
      ? missingSkills.length > 0
        ? missingSkills.filter((s) => LEARNING_RESOURCES[s])
        : ALL_SKILLS
      : selectedSkill
        ? [selectedSkill]
        : ALL_SKILLS;

  return (
    <AppShell
      title="Learning Resources"
      subtitle="Curated resources for every skill"
    >
      <div className="max-w-5xl mx-auto" data-ocid="learning_resources.page">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Learning Resources</h1>
          <p className="text-white/40 text-sm mt-0.5">
            YouTube tutorials, official docs, practice platforms & interview
            questions
          </p>
        </div>

        {/* Controls */}
        <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("missing")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === "missing"
                  ? "bg-purple-500/30 border border-purple-500/50 text-white"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
              }`}
              data-ocid="learning_resources.missing_tab.tab"
            >
              Missing Skills{" "}
              {missingSkills.filter((s) => LEARNING_RESOURCES[s]).length > 0 &&
                `(${missingSkills.filter((s) => LEARNING_RESOURCES[s]).length})`}
            </button>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-purple-500/30 border border-purple-500/50 text-white"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
              }`}
              data-ocid="learning_resources.all_tab.tab"
            >
              All Skills ({ALL_SKILLS.length})
            </button>
          </div>

          {filter === "all" && (
            <div className="relative min-w-[160px]">
              <select
                data-ocid="learning_resources.skill.select"
                value={selectedSkill ?? ""}
                onChange={(e) => setSelectedSkill(e.target.value || null)}
                className="input-dark w-full appearance-none pr-8 py-2"
              >
                <option value="" style={{ background: "#0B1236" }}>
                  All Skills
                </option>
                {ALL_SKILLS.map((s) => (
                  <option key={s} value={s} style={{ background: "#0B1236" }}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
            </div>
          )}

          <div className="ml-auto flex flex-wrap gap-1">
            {["YouTube", "Docs", "Practice"].map((label) => (
              <span
                key={label}
                className="skill-chip text-xs flex items-center gap-1"
              >
                <ExternalLink size={10} /> {label}
              </span>
            ))}
          </div>
        </div>

        {displayedSkills.length === 0 ? (
          <div
            className="glass-card p-10 text-center"
            data-ocid="learning_resources.empty_state"
          >
            <BookOpen size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/50">
              No missing skills found! Keep building.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedSkills.map((skill) => (
              <ResourceCard key={skill} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
