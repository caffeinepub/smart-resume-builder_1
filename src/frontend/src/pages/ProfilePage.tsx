import { Edit3, Save, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { getUserKey } from "../utils/auth";
import { getBookmarks } from "../utils/extras";
import { loadResume } from "../utils/storage";

interface UserProfile {
  fullName: string;
  mobile: string;
  careerGoal: string;
  linkedinUrl: string;
  aboutMe: string;
}

function profileKey(): string {
  return getUserKey("smartresume_profile");
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(profileKey());
    if (raw) return JSON.parse(raw) as UserProfile;
    // Only fall back to resume data if no profile saved for THIS user
    const resume = loadResume();
    return {
      fullName: resume?.name ?? "",
      mobile: resume?.phone ?? "",
      careerGoal: "",
      linkedinUrl: resume?.linkedinUrl ?? "",
      aboutMe: resume?.summary ?? "",
    };
  } catch {
    return {
      fullName: "",
      mobile: "",
      careerGoal: "",
      linkedinUrl: "",
      aboutMe: "",
    };
  }
}

function saveProfile(profile: UserProfile): void {
  localStorage.setItem(profileKey(), JSON.stringify(profile));
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [editing, setEditing] = useState(false);

  const resume = loadResume();
  const skillsCount = resume?.skills.length ?? 0;
  const projectsCount = resume?.projects.length ?? 0;
  const certsCompleted = (() => {
    try {
      const raw = localStorage.getItem(
        getUserKey("smartresume_cert_completions"),
      );
      return raw ? (JSON.parse(raw) as string[]).length : 0;
    } catch {
      return 0;
    }
  })();
  const bookmarksCount = getBookmarks().length;

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveProfile(profile);
    setEditing(false);
    toast.success("Profile saved successfully!");
  };

  const stats = [
    { label: "Skills", value: skillsCount, color: "#7C5CFF" },
    { label: "Projects", value: projectsCount, color: "#35D0C7" },
    { label: "Certs Earned", value: certsCompleted, color: "#EC4899" },
    { label: "Bookmarks", value: bookmarksCount, color: "#F59E0B" },
  ];

  return (
    <AppShell title="My Profile" subtitle="Your career identity">
      <div className="max-w-3xl mx-auto" data-ocid="profile.page">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
          <p className="text-white/40 text-sm">
            Manage your personal information and career goals
          </p>
        </div>

        {/* Avatar + Stats */}
        <div
          className="glass-card p-6 mb-5 flex flex-col sm:flex-row items-center gap-6"
          data-ocid="profile.header.card"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-white font-extrabold text-3xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7C5CFF, #35D0C7)" }}
            data-ocid="profile.avatar"
          >
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-white font-bold text-xl">
              {profile.fullName || "Your Name"}
            </h2>
            <p className="text-white/40 text-sm">
              {profile.careerGoal || "Set your career goal below"}
            </p>
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 text-xs mt-1 inline-block hover:text-purple-300"
              >
                LinkedIn Profile ↗
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm flex-shrink-0"
            data-ocid="profile.edit_button"
          >
            <Edit3 size={14} /> {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-4 gap-3 mb-5"
          data-ocid="profile.stats.section"
        >
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div
                className="text-2xl font-extrabold"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Profile Form */}
        <div className="glass-card p-6" data-ocid="profile.form">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <User size={16} className="text-purple-400" /> Personal Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  disabled={!editing}
                  placeholder="Your full name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-ocid="profile.name.input"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-mobile"
                  className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5"
                >
                  Mobile Number
                </label>
                <input
                  id="profile-mobile"
                  type="tel"
                  value={profile.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                  disabled={!editing}
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-ocid="profile.mobile.input"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="profile-goal"
                className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5"
              >
                Career Goal
              </label>
              <input
                id="profile-goal"
                type="text"
                value={profile.careerGoal}
                onChange={(e) => handleChange("careerGoal", e.target.value)}
                disabled={!editing}
                placeholder="e.g. Become a Full Stack Developer at a FAANG company"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-ocid="profile.career_goal.input"
              />
            </div>
            <div>
              <label
                htmlFor="profile-linkedin"
                className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5"
              >
                LinkedIn URL
              </label>
              <input
                id="profile-linkedin"
                type="url"
                value={profile.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                disabled={!editing}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-ocid="profile.linkedin.input"
              />
            </div>
            <div>
              <label
                htmlFor="profile-about"
                className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5"
              >
                About Me
              </label>
              <textarea
                id="profile-about"
                value={profile.aboutMe}
                onChange={(e) => handleChange("aboutMe", e.target.value)}
                disabled={!editing}
                placeholder="Write a short bio about yourself, your skills, and career aspirations..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                data-ocid="profile.about.textarea"
              />
            </div>
            {editing && (
              <button
                type="button"
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
                data-ocid="profile.save_button"
              >
                <Save size={16} /> Save Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
