import {
  Award,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import AppShell from "../components/AppShell";
import { getUserKey } from "../utils/auth";
import { addNotification, isBookmarked, toggleBookmark } from "../utils/extras";

interface Course {
  id: string;
  name: string;
  platform: string;
  duration: string;
  category: string;
  url: string;
}

const COURSES: Course[] = [
  {
    id: "gdd",
    name: "Fundamentals of Digital Marketing",
    platform: "Google Digital Garage",
    duration: "40 hrs",
    category: "Web Development",
    url: "https://learndigital.withgoogle.com/digitalgarage",
  },
  {
    id: "aws-cpe",
    name: "AWS Cloud Practitioner Essentials",
    platform: "AWS Skill Builder",
    duration: "6 hrs",
    category: "Cloud Computing",
    url: "https://explore.skillbuilder.aws",
  },
  {
    id: "cisco-cs",
    name: "Introduction to Cybersecurity",
    platform: "Cisco Networking Academy",
    duration: "15 hrs",
    category: "Cyber Security",
    url: "https://skillsforall.com",
  },
  {
    id: "ms-az900",
    name: "Azure Fundamentals AZ-900",
    platform: "Microsoft Learn",
    duration: "10 hrs",
    category: "Cloud Computing",
    url: "https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/",
  },
  {
    id: "ibm-ai",
    name: "Introduction to Artificial Intelligence",
    platform: "IBM SkillsBuild",
    duration: "6 hrs",
    category: "AI/ML",
    url: "https://skillsbuild.org",
  },
  {
    id: "fcc-rwd",
    name: "Responsive Web Design",
    platform: "freeCodeCamp",
    duration: "300 hrs",
    category: "Web Development",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
  },
  {
    id: "coursera-ml",
    name: "Machine Learning Specialization (Audit)",
    platform: "Coursera",
    duration: "90 hrs",
    category: "AI/ML",
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
  },
  {
    id: "gl-python",
    name: "Python for Data Science",
    platform: "Great Learning",
    duration: "12 hrs",
    category: "Data Science",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/python-for-data-science",
  },
  {
    id: "nptel-ds",
    name: "Data Science for Engineers",
    platform: "NPTEL",
    duration: "40 hrs",
    category: "Data Science",
    url: "https://onlinecourses.nptel.ac.in",
  },
  {
    id: "infosys-py",
    name: "Python Programming",
    platform: "Infosys Springboard",
    duration: "20 hrs",
    category: "Programming",
    url: "https://infyspringboard.onwingspan.com",
  },
  {
    id: "fcc-js",
    name: "JavaScript Algorithms and Data Structures",
    platform: "freeCodeCamp",
    duration: "300 hrs",
    category: "Programming",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
  },
  {
    id: "google-py",
    name: "Python Crash Course",
    platform: "Google / Coursera",
    duration: "40 hrs",
    category: "Programming",
    url: "https://www.coursera.org/learn/python-crash-course",
  },
  {
    id: "ms-webdev",
    name: "Introduction to Web Development",
    platform: "Microsoft Learn",
    duration: "6 hrs",
    category: "Web Development",
    url: "https://learn.microsoft.com/en-us/training/paths/web-development-101/",
  },
  {
    id: "aws-ml",
    name: "Machine Learning Foundation",
    platform: "AWS Skill Builder",
    duration: "8 hrs",
    category: "AI/ML",
    url: "https://explore.skillbuilder.aws/learn/course/external/view/elearning/1214/machine-learning-foundations",
  },
  {
    id: "gl-dl",
    name: "Introduction to Deep Learning",
    platform: "Great Learning",
    duration: "8 hrs",
    category: "AI/ML",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/deep-learning-fundamentals-with-keras",
  },
];

const CATEGORIES = [
  "All",
  "Programming",
  "Web Development",
  "AI/ML",
  "Data Science",
  "Cyber Security",
  "Cloud Computing",
];

const PLATFORM_COLORS: Record<string, string> = {
  "Google Digital Garage": "#4285F4",
  "AWS Skill Builder": "#FF9900",
  "Cisco Networking Academy": "#1BA0D7",
  "Microsoft Learn": "#0078D4",
  "IBM SkillsBuild": "#006699",
  freeCodeCamp: "#0A0A23",
  Coursera: "#0056D2",
  "Great Learning": "#E74C3C",
  NPTEL: "#2C3E50",
  "Infosys Springboard": "#007CC3",
  "Google / Coursera": "#34A853",
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarkState, setBookmarkState] = useState<Record<string, boolean>>(
    () => Object.fromEntries(COURSES.map((c) => [c.id, isBookmarked(c.id)])),
  );
  const [completions, setCompletions] = useState<string[]>(loadCompletions);

  const filtered =
    activeCategory === "All"
      ? COURSES
      : COURSES.filter((c) => c.category === activeCategory);

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
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Free Certification Courses
            </h1>
            <p className="text-white/40 text-sm">
              Industry-recognized certificates from top providers — all free to
              start
            </p>
          </div>
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
        </div>

        <div
          className="flex flex-wrap gap-2 mb-6"
          data-ocid="certifications.filter.tab"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
              data-ocid={`certifications.${cat.toLowerCase().replace(/[/ ]/g, "_")}.tab`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="certifications.list"
        >
          {filtered.map((course, i) => {
            const bookmarked = bookmarkState[course.id];
            const completed = completions.includes(course.id);
            const platformColor = PLATFORM_COLORS[course.platform] ?? "#7C5CFF";
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
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
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

        {filtered.length === 0 && (
          <div
            className="text-center py-16 text-white/40"
            data-ocid="certifications.empty_state"
          >
            No courses found for this category.
          </div>
        )}
      </div>
    </AppShell>
  );
}
