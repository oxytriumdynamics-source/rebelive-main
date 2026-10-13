export interface PersonalityType {
  id: string;
  name: string;
  slug: string;
  cardImage: string;
  colorHex: string;
  description: string;
  tagline?: string | null;
  traits: string[];
}

export interface UserPreference {
  id: string;
  userId: string;
  personalityTypeId?: string | null;
  personalityType?: PersonalityType | null;
}

export interface AuthUser {
  id: string;
  rebelId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  emailVerified: boolean;
  avatarUrl?: string | null;
  authProvider: string;
  createdAt: string;
  lastLoginAt?: string | null;
  preferences?: UserPreference | null;
}

/**
 * Formats an internal database ID or raw string into a concise, unique Rebel ID.
 * Standard format: `#RBL-XXXXXX` (e.g. `#RBL-04BC91` or `#RBL-8848`).
 */
export function formatRebelId(id?: string | null): string {
  if (!id) return "#RBL-8848";
  const trimmed = String(id).trim();
  if (trimmed.startsWith("REBEL-")) {
    const code = trimmed.replace("REBEL-", "").trim();
    return `#RBL-${code.toUpperCase()}`;
  }
  if (trimmed.startsWith("#RBL-")) {
    return trimmed.toUpperCase();
  }
  if (trimmed.startsWith("#")) {
    const code = trimmed.slice(1).trim();
    return `#RBL-${code.toUpperCase()}`;
  }
  const clean = trimmed.replace(/[^a-zA-Z0-9]/g, "");
  if (!clean) return "#RBL-8848";
  const suffix = clean.length > 6 ? clean.slice(-6).toUpperCase() : clean.toUpperCase();
  return `#RBL-${suffix}`;
}

export const DEMO_USER: AuthUser = {
  id: "REBEL-8848",
  rebelId: "#RBL-8848",
  email: "operator@rebelive.com",
  firstName: "Kaien",
  lastName: "Vance",
  phone: "+1 800-REBELIVE",
  role: "MEMBER",
  emailVerified: true,
  avatarUrl: "/brand/panther_white_icon-transparent.webp",
  authProvider: "local",
  createdAt: "2025-11-14T09:20:00.000Z",
  preferences: {
    id: "pref-apex",
    userId: "REBEL-8848",
    personalityTypeId: "APEX",
    personalityType: {
      id: "APEX",
      name: "APEX",
      slug: "apex",
      cardImage: "/brand/APEX.webp",
      colorHex: "#d8ac52",
      description: "You are Built to climb. Driven to go further. The peak isn't the end. It's proof you can go higher.",
      tagline: "Ascend Without Limits",
      traits: ["Relentless", "Summit Seeker", "High-Altitude Focus", "Zero Sugar"],
    },
  },
};

const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredUser(user: AuthUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearStoredUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}
