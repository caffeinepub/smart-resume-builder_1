import { getUserKey } from "./auth";
// ============================================================
// Dark Mode — stored per logged-in user
// ============================================================
function darkModeKey(): string {
  return getUserKey("smartresume_dark_mode");
}

export function getDarkMode(): boolean {
  try {
    const val = localStorage.getItem(darkModeKey());
    // Default to dark mode (null means not set yet => dark)
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

export function setDarkMode(v: boolean): void {
  localStorage.setItem(darkModeKey(), String(v));
  if (v) {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light-mode");
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light-mode");
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  }
}

export function initDarkMode(): void {
  setDarkMode(getDarkMode());
}

// ============================================================
// Daily Streak — stored per logged-in user
// ============================================================
export interface StreakData {
  count: number;
  lastDate: string;
}

function streakKey(): string {
  return getUserKey("smartresume_streak");
}

export function getStreak(): StreakData {
  try {
    const raw = localStorage.getItem(streakKey());
    return raw ? (JSON.parse(raw) as StreakData) : { count: 0, lastDate: "" };
  } catch {
    return { count: 0, lastDate: "" };
  }
}

export function updateStreak(): number {
  const today = new Date().toISOString().split("T")[0];
  const streak = getStreak();
  let newCount = streak.count;

  if (streak.lastDate === today) {
    return newCount;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];

  if (streak.lastDate === yStr) {
    newCount = streak.count + 1;
  } else if (streak.lastDate === "") {
    newCount = 1;
  } else {
    newCount = 1; // reset
  }

  const updated: StreakData = { count: newCount, lastDate: today };
  localStorage.setItem(streakKey(), JSON.stringify(updated));
  return newCount;
}

// ============================================================
// Bookmarks
// ============================================================
export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(getUserKey("smartresume_bookmarks"));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(id: string): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(id);
  let newState: boolean;
  if (idx === -1) {
    bookmarks.push(id);
    newState = true;
  } else {
    bookmarks.splice(idx, 1);
    newState = false;
  }
  localStorage.setItem(
    getUserKey("smartresume_bookmarks"),
    JSON.stringify(bookmarks),
  );
  return newState;
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().includes(id);
}

// ============================================================
// Notifications
// ============================================================
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function getNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(getUserKey("smartresume_notifications"));
    return raw ? (JSON.parse(raw) as Notification[]) : [];
  } catch {
    return [];
  }
}

export function addNotification(message: string): void {
  const notifs = getNotifications();
  const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  notifs.unshift({
    id,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
  // keep last 20
  localStorage.setItem(
    getUserKey("smartresume_notifications"),
    JSON.stringify(notifs.slice(0, 20)),
  );
}

export function markAllRead(): void {
  const notifs = getNotifications().map((n) => ({ ...n, read: true }));
  localStorage.setItem(
    getUserKey("smartresume_notifications"),
    JSON.stringify(notifs),
  );
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

// ============================================================
// Progress (certifications / projects)
// ============================================================
export function getProgress(key: string): boolean {
  try {
    const raw = localStorage.getItem(`smartresume_progress_${key}`);
    return raw === "true";
  } catch {
    return false;
  }
}

export function setProgress(key: string, done: boolean): void {
  localStorage.setItem(`smartresume_progress_${key}`, String(done));
}
