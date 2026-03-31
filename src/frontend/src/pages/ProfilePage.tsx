import { Edit3, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { getUserKey, getUserStream } from "../utils/auth";
import { getBookmarks } from "../utils/extras";
import { loadResume } from "../utils/storage";
import { getStreamById } from "../utils/streamData";

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

  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);

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
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="glass-card p-6" data-ocid="profile.form.card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold">Profile Details</h3>
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                data-ocid="profile.edit.button"
              >
                <Edit3 size={12} /> Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                data-ocid="profile.save.button"
              >
                <Save size={12} /> Save Changes
              </button>
            )}
          </div>

          <div className="space-y-4">
            {(
              [
                {
                  field: "fullName",
                  label: "Full Name",
                  placeholder: "Your full name",
                },
                {
                  field: "mobile",
                  label: "Mobile Number",
                  placeholder: "+91-9876543210",
                },
                {
                  field: "careerGoal",
                  label: "Career Goal",
                  placeholder: `e.g. ${streamDef.roles[0]?.name ?? "Software Engineer"} at a top company`,
                },
                {
                  field: "linkedinUrl",
                  label: "LinkedIn URL",
                  placeholder: "https://linkedin.com/in/yourname",
                },
              ] as const
            ).map(({ field, label, placeholder }) => (
              <div key={field}>
                <p className="label-dark">{label}</p>
                {editing ? (
                  <input
                    type="text"
                    className="input-dark w-full"
                    value={profile[field]}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(field, e.target.value)}
                    data-ocid={`profile.${field}.input`}
                  />
                ) : (
                  <p className="text-white text-sm py-2 px-3 rounded-xl bg-white/3 border border-white/6 min-h-[38px]">
                    {profile[field] || (
                      <span className="text-white/25">{placeholder}</span>
                    )}
                  </p>
                )}
              </div>
            ))}

            <div>
              <p className="label-dark">About Me</p>
              {editing ? (
                <textarea
                  className="input-dark w-full resize-none"
                  rows={4}
                  value={profile.aboutMe}
                  placeholder="Write a brief professional summary..."
                  onChange={(e) => handleChange("aboutMe", e.target.value)}
                  data-ocid="profile.aboutMe.textarea"
                />
              ) : (
                <p className="text-white text-sm py-2 px-3 rounded-xl bg-white/3 border border-white/6 min-h-[80px]">
                  {profile.aboutMe || (
                    <span className="text-white/25">
                      Write a brief professional summary...
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
