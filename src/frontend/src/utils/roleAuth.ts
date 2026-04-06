// Role-based auth helpers for multi-role career ecosystem

export type UserRole = "student" | "professor" | "recruiter" | "admin";

const ROLE_KEY = "currentRole";
const PROFESSORS_KEY = "professors_registry";
const RECRUITERS_KEY = "recruiters_registry";
const PROFESSOR_AUTH_KEY = "professor_auth";
const RECRUITER_AUTH_KEY = "recruiter_auth";

// ============================================================
// Role helpers
// ============================================================

export function getCurrentRole(): UserRole | null {
  try {
    const raw = localStorage.getItem(ROLE_KEY);
    if (
      raw === "student" ||
      raw === "professor" ||
      raw === "recruiter" ||
      raw === "admin"
    ) {
      return raw as UserRole;
    }
    return null;
  } catch {
    return null;
  }
}

export function setCurrentRole(role: UserRole): void {
  localStorage.setItem(ROLE_KEY, role);
}

export function clearCurrentRole(): void {
  localStorage.removeItem(ROLE_KEY);
}

// ============================================================
// Professor registry
// ============================================================

export interface ProfessorUser {
  name: string;
  phone: string;
  department: string;
  college: string;
}

export function getProfessors(): Record<string, ProfessorUser> {
  try {
    const raw = localStorage.getItem(PROFESSORS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ProfessorUser>) : {};
  } catch {
    return {};
  }
}

export function registerProfessor(phone: string, data: ProfessorUser): void {
  const profs = getProfessors();
  profs[phone] = data;
  localStorage.setItem(PROFESSORS_KEY, JSON.stringify(profs));
}

export function isProfessorRegistered(phone: string): boolean {
  return phone in getProfessors();
}

// ============================================================
// Recruiter registry
// ============================================================

export interface RecruiterUser {
  name: string;
  phone: string;
  company: string;
  designation: string;
  approved: boolean;
}

export function getRecruiters(): Record<string, RecruiterUser> {
  try {
    const raw = localStorage.getItem(RECRUITERS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, RecruiterUser>) : {};
  } catch {
    return {};
  }
}

export function registerRecruiter(phone: string, data: RecruiterUser): void {
  const recs = getRecruiters();
  recs[phone] = data;
  localStorage.setItem(RECRUITERS_KEY, JSON.stringify(recs));
}

export function isRecruiterRegistered(phone: string): boolean {
  return phone in getRecruiters();
}

export function approveRecruiter(phone: string): void {
  const recs = getRecruiters();
  if (recs[phone]) {
    recs[phone].approved = true;
    localStorage.setItem(RECRUITERS_KEY, JSON.stringify(recs));
  }
}

// ============================================================
// Professor session
// ============================================================

export function getProfessorAuth(): (ProfessorUser & { phone: string }) | null {
  try {
    const raw = localStorage.getItem(PROFESSOR_AUTH_KEY);
    return raw ? (JSON.parse(raw) as ProfessorUser & { phone: string }) : null;
  } catch {
    return null;
  }
}

export function setProfessorAuth(phone: string, data: ProfessorUser): void {
  localStorage.setItem(PROFESSOR_AUTH_KEY, JSON.stringify({ ...data, phone }));
}

export function clearProfessorAuth(): void {
  localStorage.removeItem(PROFESSOR_AUTH_KEY);
}

// ============================================================
// Recruiter session
// ============================================================

export function getRecruiterAuth(): (RecruiterUser & { phone: string }) | null {
  try {
    const raw = localStorage.getItem(RECRUITER_AUTH_KEY);
    return raw ? (JSON.parse(raw) as RecruiterUser & { phone: string }) : null;
  } catch {
    return null;
  }
}

export function setRecruiterAuth(phone: string, data: RecruiterUser): void {
  localStorage.setItem(RECRUITER_AUTH_KEY, JSON.stringify({ ...data, phone }));
}

export function clearRecruiterAuth(): void {
  localStorage.removeItem(RECRUITER_AUTH_KEY);
}
