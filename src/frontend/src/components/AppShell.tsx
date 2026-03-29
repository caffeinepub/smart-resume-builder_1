import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Award,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileText,
  Flame,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  MessageSquare,
  Mic,
  Moon,
  Search,
  Sun,
  Target,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clearStoredAuth, getStoredAuth } from "../utils/auth";
import {
  type Notification,
  addNotification,
  getDarkMode,
  getNotifications,
  getStreak,
  getUnreadCount,
  markAllRead,
  setDarkMode,
  updateStreak,
} from "../utils/extras";

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  {
    path: "/profile",
    label: "My Profile",
    icon: User,
    ocid: "nav.profile.link",
  },
  {
    path: "/resume-builder",
    label: "Resume Builder",
    icon: FileText,
    ocid: "nav.resume_builder.link",
  },
  {
    path: "/ats-analyzer",
    label: "ATS Analyzer",
    icon: Target,
    ocid: "nav.ats_analyzer.link",
  },
  {
    path: "/role-eligibility",
    label: "Role Eligibility",
    icon: Award,
    ocid: "nav.role_eligibility.link",
  },
  {
    path: "/skill-gap",
    label: "Skill Gap",
    icon: GitBranch,
    ocid: "nav.skill_gap.link",
  },
  {
    path: "/skill-tracker",
    label: "Skill Tracker",
    icon: TrendingUp,
    ocid: "nav.skill_tracker.link",
  },
  {
    path: "/learning-resources",
    label: "Learning Resources",
    icon: BookOpen,
    ocid: "nav.learning_resources.link",
  },
  {
    path: "/certifications",
    label: "Free Certifications",
    icon: GraduationCap,
    ocid: "nav.certifications.link",
  },
  {
    path: "/projects",
    label: "Project Ideas",
    icon: Code2,
    ocid: "nav.projects.link",
  },
  {
    path: "/mock-tests",
    label: "Mock Tests",
    icon: ClipboardCheck,
    ocid: "nav.mock_tests.link",
  },
  {
    path: "/interview-prep",
    label: "Interview Prep",
    icon: MessageSquare,
    ocid: "nav.interview_prep.link",
  },
  {
    path: "/mock-interview",
    label: "Mock Interview",
    icon: Mic,
    ocid: "nav.mock_interview.link",
  },
  {
    path: "/career-roadmap",
    label: "Career Roadmap",
    icon: MapIcon,
    ocid: "nav.career_roadmap.link",
  },
  {
    path: "/jobs",
    label: "Jobs & Internships",
    icon: Briefcase,
    ocid: "nav.jobs.link",
  },
];

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkModeState] = useState(() => getDarkMode());
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const auth = getStoredAuth();

  const initials = auth?.name
    ? auth.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time setup
  useEffect(() => {
    const s = updateStreak();
    setStreak(s);
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
    if (s > 0) {
      const streakKey = `streak_notif_${auth?.phone ?? "guest"}_${s}`;
      if (!sessionStorage.getItem(streakKey)) {
        sessionStorage.setItem(streakKey, "1");
        addNotification(`🔥 Day ${s} streak! Keep up the great work!`);
      }
    }
    const welcomeKey = `welcome_notif_shown_${auth?.phone ?? "guest"}`;
    if (!sessionStorage.getItem(welcomeKey)) {
      sessionStorage.setItem(welcomeKey, "1");
      addNotification(
        `👋 Welcome back, ${auth?.name ?? "User"}! Your career journey continues.`,
      );
    }
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDarkToggle = () => {
    const newVal = !darkMode;
    setDarkModeState(newVal);
    setDarkMode(newVal);
  };

  const handleMarkAllRead = () => {
    markAllRead();
    setNotifications(getNotifications());
    setUnreadCount(0);
  };

  const handleLogout = () => {
    clearStoredAuth();
    navigate({ to: "/login" });
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${darkMode ? "dark-mode" : "light-mode"}`}
      style={{ backgroundColor: darkMode ? "#060B2A" : "#f0f2ff" }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-[260px] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #070C2A 0%, #0B1236 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7C5CFF, #4B8BFF)" }}
          >
            <Brain size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-white font-extrabold text-sm tracking-tight block">
              SMARTRESUME AI
            </span>
            <p className="text-white/40 text-[9px] font-medium uppercase tracking-wider">
              Career Builder
            </p>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden text-white/50 hover:text-white transition-colors flex-shrink-0"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-ocid={item.ocid}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto opacity-70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Streak + User */}
        <div className="px-4 py-4 border-t border-white/6 space-y-3">
          {streak > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Flame size={16} className="text-orange-400" />
              <span className="text-orange-300 text-sm font-semibold">
                {streak} day streak
              </span>
              <span className="text-orange-400/60 text-xs ml-auto">🔥</span>
            </div>
          )}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7C5CFF, #35D0C7)",
              }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">
                {auth?.name ?? "Guest"}
              </p>
              <p className="text-white/40 text-xs truncate">
                {auth?.phone ?? ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-white/40 hover:text-red-400 transition-colors flex-shrink-0"
              title="Logout"
              data-ocid="nav.logout.button"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex-shrink-0 flex items-center gap-4 px-5 py-3 border-b border-white/6"
          style={{
            background: "rgba(7, 12, 42, 0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            type="button"
            className="lg:hidden text-white/60 hover:text-white transition-colors p-1"
            onClick={() => setSidebarOpen(true)}
            data-ocid="nav.menu.button"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 max-w-md hidden sm:block">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <Search size={15} className="text-white/40" />
              <input
                type="text"
                placeholder="Search features..."
                className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
                data-ocid="nav.search.input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {title && (
              <div className="hidden md:flex flex-col">
                <span className="text-white text-sm font-semibold">
                  {title}
                </span>
                {subtitle && (
                  <span className="text-white/40 text-xs">{subtitle}</span>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={handleDarkToggle}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              data-ocid="nav.dark_mode.toggle"
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <div className="relative z-[9999]" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                data-ocid="nav.notifications.button"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div
                  className="absolute right-0 top-11 w-80 glass-card shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  data-ocid="nav.notifications.popover"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                    <span className="text-white font-semibold text-sm">
                      Notifications
                    </span>
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-purple-400 text-xs hover:text-purple-300"
                      data-ocid="nav.notifications.mark_read.button"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-white/40 text-sm text-center py-6">
                        No notifications
                      </p>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-white/5 text-sm ${
                            n.read ? "text-white/40" : "text-white"
                          }`}
                        >
                          <p>{n.message}</p>
                          <p className="text-white/25 text-xs mt-0.5">
                            {new Date(n.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/profile"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #7C5CFF, #35D0C7)",
              }}
              data-ocid="nav.avatar.button"
            >
              {initials}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-6">{children}</main>
      </div>
    </div>
  );
}
