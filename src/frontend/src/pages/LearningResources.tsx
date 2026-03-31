import {
  BookOpen,
  ChevronDown,
  Code2,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import AppShell from "../components/AppShell";
import { getUserStream } from "../utils/auth";
import { LEARNING_RESOURCES } from "../utils/roleData";
import { loadCareerProfile } from "../utils/storage";
import {
  type SkillResource,
  type StreamDefinition,
  getAllStreams,
  getStreamById,
} from "../utils/streamData";

function ResourceCard({
  skill,
  resource,
}: { skill: string; resource: SkillResource }) {
  return (
    <div className="glass-card p-5" data-ocid="learning_resources.skill.card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-base">{skill}</h3>
          <p className="text-white/40 text-xs mt-0.5">{resource.description}</p>
        </div>
        <span className="skill-chip text-xs">{skill}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <a
          href={resource.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
          data-ocid="learning_resources.youtube.button"
        >
          <Youtube size={14} /> YouTube Tutorial
        </a>
        <a
          href={resource.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
          data-ocid="learning_resources.docs.button"
        >
          <BookOpen size={14} /> Official Docs
        </a>
        <a
          href={resource.practice}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
          data-ocid="learning_resources.practice.button"
        >
          <Code2 size={14} /> Practice Now
        </a>
      </div>

      {resource.certification && (
        <a
          href={resource.certification}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition-colors mb-4"
          data-ocid="learning_resources.certification.button"
        >
          <ExternalLink size={14} /> Free Certification Course
        </a>
      )}

      <div>
        <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
          <HelpCircle size={12} /> Interview Questions
        </h4>
        <ul className="space-y-1">
          {resource.interviewQuestions.map((q, i) => (
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

// Legacy CSE resource card (keeps backward compat)
function LegacyResourceCard({ skill }: { skill: string }) {
  const res = LEARNING_RESOURCES[skill];
  if (!res) return null;
  return (
    <ResourceCard
      skill={skill}
      resource={{
        youtube: res.youtube,
        docs: res.docs,
        practice: res.practice,
        certification: "",
        description: res.description,
        interviewQuestions: res.interviewQuestions,
      }}
    />
  );
}

export default function LearningResources() {
  const careerProfile = loadCareerProfile();
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);
  const allStreams = getAllStreams();

  // Stream skill resources
  const streamResources = streamDef.skillResources;

  // Legacy CSE resources for backward compat
  const legacySkills = Object.keys(LEARNING_RESOURCES);

  // Figure out missing skills from career profile
  const missingSkillsFromProfile = careerProfile?.learningPlan ?? [];
  const allMissingSkills = Array.from(new Set(missingSkillsFromProfile));

  const [filter, setFilter] = useState<"stream" | "missing" | "all">("stream");
  const [browseStream, setBrowseStream] = useState<string>(userStream || "cse");

  const browseStreamDef: StreamDefinition = getStreamById(browseStream);
  const browseResources = browseStreamDef.skillResources;
  const browseSkills = Object.keys(browseResources);

  // Determine which skills to display
  let displayedStreamSkills: string[] = [];
  let displayedLegacySkills: string[] = [];
  let useStreamResources = true;

  if (filter === "stream") {
    displayedStreamSkills = browseSkills;
    useStreamResources = true;
  } else if (filter === "missing") {
    // Show only skills from the stream that are in the missing list
    const matchingStream = browseSkills.filter((s) =>
      allMissingSkills.some(
        (m) =>
          m.toLowerCase().includes(s.toLowerCase()) ||
          s.toLowerCase().includes(m.toLowerCase()),
      ),
    );
    const matchingLegacy = legacySkills.filter((s) =>
      allMissingSkills.some(
        (m) =>
          m.toLowerCase().includes(s.toLowerCase()) ||
          s.toLowerCase().includes(m.toLowerCase()),
      ),
    );
    if (matchingStream.length > 0) {
      displayedStreamSkills = matchingStream;
      useStreamResources = true;
    } else if (matchingLegacy.length > 0) {
      displayedLegacySkills = matchingLegacy;
      useStreamResources = false;
    } else {
      displayedStreamSkills = browseSkills;
      useStreamResources = true;
    }
  } else {
    // all — show all stream skills
    displayedStreamSkills = browseSkills;
    useStreamResources = true;
  }

  // Keep streamResources ref to avoid lint warning (used in stream badge)
  void streamResources;

  return (
    <AppShell
      title="Learning Resources"
      subtitle="Curated resources for every skill"
    >
      <div className="max-w-5xl mx-auto" data-ocid="learning_resources.page">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Learning Resources
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Free resources to master skills in your field
            </p>
          </div>
          <span
            className="text-sm font-medium px-3 py-1.5 rounded-full border"
            style={{
              color: streamDef.color,
              background: `${streamDef.color}15`,
              borderColor: `${streamDef.color}35`,
            }}
            data-ocid="learning_resources.stream.badge"
          >
            {streamDef.label}
          </span>
        </div>

        {/* Filter tabs */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              {(["stream", "missing", "all"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filter === f
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                  data-ocid={`learning_resources.filter_${f}.tab`}
                >
                  {f === "stream"
                    ? streamDef.label
                    : f === "missing"
                      ? "My Missing Skills"
                      : "All Skills"}
                </button>
              ))}
            </div>

            {/* Browse by stream */}
            <div className="relative ml-auto">
              <select
                value={browseStream}
                onChange={(e) => {
                  setBrowseStream(e.target.value);
                  setFilter("stream");
                }}
                className="input-dark text-xs py-1.5 pr-8 appearance-none"
                data-ocid="learning_resources.stream.select"
              >
                {allStreams.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                    style={{ background: "#0B1236" }}
                  >
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Resources grid */}
        <div className="space-y-4">
          {useStreamResources
            ? displayedStreamSkills.map((skill) => {
                const resource = browseResources[skill];
                if (!resource) return null;
                return (
                  <ResourceCard key={skill} skill={skill} resource={resource} />
                );
              })
            : displayedLegacySkills.map((skill) => (
                <LegacyResourceCard key={skill} skill={skill} />
              ))}

          {displayedStreamSkills.length === 0 &&
            displayedLegacySkills.length === 0 && (
              <div
                className="glass-card p-10 text-center"
                data-ocid="learning_resources.empty_state"
              >
                <RefreshCw size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/50 font-medium">No Resources Found</p>
                <p className="text-white/30 text-sm mt-2">
                  No learning resources available for your current filter.
                </p>
                <button
                  type="button"
                  onClick={() => setFilter("stream")}
                  className="btn-secondary mt-4 text-xs"
                >
                  Browse {streamDef.label} Resources
                </button>
              </div>
            )}
        </div>
      </div>
    </AppShell>
  );
}
