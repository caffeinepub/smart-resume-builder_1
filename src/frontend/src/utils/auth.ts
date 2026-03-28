export interface AuthUser {
  phone: string;
  name: string;
  token: string;
}

const AUTH_KEY = "career_auth";
const USERS_KEY = "career_users";

export function getStoredAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function getRegisteredUsers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function registerUser(phone: string, name: string): void {
  const users = getRegisteredUsers();
  users[phone] = name;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function isPhoneRegistered(phone: string): boolean {
  return phone in getRegisteredUsers();
}
