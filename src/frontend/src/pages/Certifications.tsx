import {
  Award,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { getUserKey, getUserStream } from "../utils/auth";
import { addNotification, isBookmarked, toggleBookmark } from "../utils/extras";
import { type StreamId, getStreamById } from "../utils/streamData";

interface Course {
  id: string;
  name: string;
  platform: string;
  duration: string;
  category: string;
  url: string;
  description: string;
}

function extractPlatformName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const platformMap: Record<string, string> = {
      "coursera.org": "Coursera",
      "udemy.com": "Udemy",
      "edx.org": "edX",
      "google.com": "Google",
      "learndigital.withgoogle.com": "Google Digital Garage",
      "developers.google.com": "Google Developers",
      "skillbuilder.aws": "AWS Skill Builder",
      "explore.skillbuilder.aws": "AWS Skill Builder",
      "learn.microsoft.com": "Microsoft Learn",
      "microsoft.com": "Microsoft",
      "ibm.com": "IBM",
      "skillsbuild.org": "IBM SkillsBuild",
      "freecodecamp.org": "freeCodeCamp",
      "linkedin.com": "LinkedIn Learning",
      "nptel.ac.in": "NPTEL",
      "onlinecourses.nptel.ac.in": "NPTEL",
      "mygreatlearning.com": "Great Learning",
      "infyspringboard.onwingspan.com": "Infosys Springboard",
      "skillsforall.com": "Cisco Networking Academy",
      "cisco.com": "Cisco",
      "autodesk.com": "Autodesk",
      "solidworks.com": "SolidWorks",
      "hubspot.com": "HubSpot Academy",
      "semrush.com": "SEMrush",
      "udacity.com": "Udacity",
      "khanacademy.org": "Khan Academy",
      "pluralsight.com": "Pluralsight",
    };
    for (const [key, name] of Object.entries(platformMap)) {
      if (hostname.includes(key)) return name;
    }
    // Capitalize first segment of domain
    const parts = hostname.split(".");
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return "Online Course";
  }
}

const PLATFORM_COLORS: Record<string, string> = {
  Coursera: "#0056D2",
  Udemy: "#A435F0",
  edX: "#02262B",
  Google: "#4285F4",
  "Google Digital Garage": "#4285F4",
  "Google Developers": "#34A853",
  "AWS Skill Builder": "#FF9900",
  "Microsoft Learn": "#0078D4",
  Microsoft: "#0078D4",
  IBM: "#006699",
  "IBM SkillsBuild": "#006699",
  freeCodeCamp: "#0A0A23",
  "LinkedIn Learning": "#0A66C2",
  NPTEL: "#2C3E50",
  "Great Learning": "#E74C3C",
  "Infosys Springboard": "#007CC3",
  "Cisco Networking Academy": "#1BA0D7",
  Cisco: "#1BA0D7",
  Autodesk: "#0696D7",
  SolidWorks: "#CC0000",
  "HubSpot Academy": "#FF7A59",
  SEMrush: "#FF642D",
  Udacity: "#02B3E4",
  "Khan Academy": "#14BF96",
};

const COMPLETIONS_KEY = () => getUserKey("smartresume_cert_completions");

function loadCompletions(): string[] {
  try {
    const raw = localStorage.getItem(COMPLETIONS_KEY());
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveCompletions(ids: string[]): void {
  localStorage.setItem(COMPLETIONS_KEY(), JSON.stringify(ids));
}

export default function Certifications() {
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream as StreamId);
  const streamResources = streamDef.skillResources;

  // Build courses from stream skillResources
  const streamCourses = useMemo((): Course[] => {
    return Object.entries(streamResources)
      .filter(([, resource]) => resource.certification)
      .map(([skill, resource]) => ({
        id: skill.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: `${skill} Certification Course`,
        platform: extractPlatformName(resource.certification),
        duration: "Self-paced",
        category: streamDef.label,
        url: resource.certification,
        description: resource.description,
      }));
  }, [streamResources, streamDef.label]);

  const [bookmarkState, setBookmarkState] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(streamCourses.map((c) => [c.id, isBookmarked(c.id)])),
  );
  const [completions, setCompletions] = useState<string[]>(loadCompletions);

  const handleBookmark = (id: string) => {
    const newState = toggleBookmark(id);
    setBookmarkState((prev) => ({ ...prev, [id]: newState }));
  };

  const handleComplete = (course: Course) => {
    if (completions.includes(course.id)) return;
    const updated = [...completions, course.id];
    setCompletions(updated);
    saveCompletions(updated);
    addNotification(`🏆 Certification completed: ${course.name}`);
  };

  return (
    <AppShell
      title="Free Certifications"
      subtitle="Earn certificates from top platforms"
    >
      <div className="max-w-7xl mx-auto" data-ocid="certifications.page">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Free Certifications
            </h1>
            <p className="text-white/40 text-sm">
              Industry-recognized certificates curated for{" "}
              <span style={{ color: streamDef.color }}>{streamDef.label}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {completions.length > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0"
                style={{
                  background: "rgba(57,217,138,0.15)",
                  border: "1px solid rgba(57,217,138,0.3)",
                }}
              >
                <CheckCircle2 size={15} className="text-green-400" />
                <span className="text-green-400 font-semibold text-sm">
                  Completed: {completions.length}
                </span>
              </div>
            )}
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{
                color: streamDef.color,
                background: `${streamDef.color}15`,
                borderColor: `${streamDef.color}35`,
              }}
              data-ocid="certifications.stream.badge"
            >
              {streamDef.label}
            </span>
          </div>
        </div>

        {streamCourses.length === 0 ? (
          <div
            className="glass-card p-12 text-center"
            data-ocid="certifications.empty_state"
          >
            <Award size={40} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-semibold">
              No certifications found
            </p>
            <p className="text-white/30 text-sm mt-2">
              No certification courses available for {streamDef.label} yet.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="certifications.list"
          >
            {streamCourses.map((course, i) => {
              const bookmarked = bookmarkState[course.id];
              const completed = completions.includes(course.id);
              const platformColor =
                PLATFORM_COLORS[course.platform] ??
                streamDef.color ??
                "#7C5CFF";
              return (
                <div
                  key={course.id}
                  className="glass-card p-5 flex flex-col gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  data-ocid={`certifications.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm leading-tight">
                        {course.name}
                      </h3>
                      {course.description && (
                        <p className="text-white/35 text-[10px] mt-1 leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookmark(course.id)}
                      className={`flex-shrink-0 transition-colors ${
                        bookmarked
                          ? "text-yellow-400"
                          : "text-white/30 hover:text-yellow-400"
                      }`}
                      title={bookmarked ? "Remove bookmark" : "Bookmark"}
                      data-ocid={`certifications.bookmark.${i + 1}`}
                    >
                      {bookmarked ? (
                        <BookmarkCheck size={16} />
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: `${platformColor}CC` }}
                    >
                      {course.platform}
                    </span>
                    <span className="flex items-center gap-1 text-white/50 text-xs">
                      <Clock size={11} />
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {completed ? (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 font-semibold">
                        <CheckCircle2 size={11} /> ✓ Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 font-medium">
                        <Award size={11} /> Free Certificate
                      </span>
                    )}
                    <span
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{
                        color: streamDef.color,
                        background: `${streamDef.color}12`,
                        borderColor: `${streamDef.color}28`,
                      }}
                    >
                      {course.category}
                    </span>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-primary text-xs py-2 px-4 flex items-center justify-center gap-1.5"
                      data-ocid={`certifications.start.${i + 1}`}
                    >
                      Start Learning <ExternalLink size={12} />
                    </a>
                    {!completed && (
                      <button
                        type="button"
                        onClick={() => handleComplete(course)}
                        className="btn-secondary text-xs py-2 px-3 flex items-center gap-1 flex-shrink-0"
                        title="Mark as completed"
                        data-ocid={`certifications.complete_button.${i + 1}`}
                      >
                        <CheckCircle2 size={12} /> Done
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
