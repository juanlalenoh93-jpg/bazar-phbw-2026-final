import { useSyncExternalStore } from "react";

export type AppUser = {
  name: string;
  email: string;
  picture?: string;
};

export type UserRole = "admin" | "viewer";

export type AuthState = {
  loading: boolean;
  session: { user: AppUser } | null;
  user: AppUser | null;
  displayName: string;
  role: UserRole;
  isAdmin: boolean;
};

const AUTH_KEY = "phbw-2026-google-user-v1";
const ADMIN_LIST_KEY = "phbw-2026-admin-list-v1";

let user: AppUser | null = null;
let loaded = false;
const listeners = new Set<() => void>();

let adminList: string[] | null = null;
const adminListeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function loadUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  if (loaded) return user;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }
  loaded = true;
  return user;
}

export function getAuthUser(): AppUser | null {
  return loadUser();
}

export function setAuthUser(nextUser: AppUser | null) {
  user = nextUser;
  loaded = true;
  if (typeof window !== "undefined") {
    if (nextUser) localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(AUTH_KEY);
  }
  notify();
}

// ---- Role / Admin System ----

function loadAdminList(): string[] {
  if (typeof window === "undefined") return [];
  if (adminList !== null) return adminList;
  try {
    adminList = JSON.parse(localStorage.getItem(ADMIN_LIST_KEY) || "[]");
  } catch {
    adminList = [];
  }
  return adminList!;
}

function saveAdminList() {
  if (typeof window !== "undefined")
    localStorage.setItem(ADMIN_LIST_KEY, JSON.stringify(adminList || []));
  adminListeners.forEach((l) => l());
  listeners.forEach((l) => l());
}

export function getUserRole(email?: string): UserRole {
  if (!email) return "viewer";
  const list = loadAdminList();
  if (list.length === 0) return "admin";
  return list.includes(email.toLowerCase().trim()) ? "admin" : "viewer";
}

export function getAdminList(): string[] {
  return loadAdminList();
}

export function addAdmin(email: string) {
  loadAdminList();
  const e = email.toLowerCase().trim();
  if (!e) return;
  if (!adminList!.includes(e)) {
    adminList = [...adminList!, e];
    saveAdminList();
  }
}

export function removeAdmin(email: string) {
  loadAdminList();
  const e = email.toLowerCase().trim();
  adminList = (adminList || []).filter((x) => x !== e);
  saveAdminList();
}

export function useAdminList(): string[] {
  return useSyncExternalStore(
    (cb) => {
      adminListeners.add(cb);
      return () => adminListeners.delete(cb);
    },
    () => loadAdminList(),
    () => [],
  );
}

export function useAuth(): AuthState {
  const currentUser = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => loadUser(),
    () => null,
  );

  const role = getUserRole(currentUser?.email);
  return {
    loading: false,
    session: currentUser ? { user: currentUser } : null,
    user: currentUser,
    displayName: currentUser?.name || "Panitia",
    role,
    isAdmin: role === "admin",
  };
}

export function signOut() {
  setAuthUser(null);
}

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return decodeURIComponent(
    Array.from(atob(padded))
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

export function userFromGoogleCredential(credential: string): AppUser {
  const payload = JSON.parse(decodeBase64Url(credential.split(".")[1] || "")) as {
    name?: string;
    email?: string;
    picture?: string;
  };
  if (!payload.email) throw new Error("Credential Google tidak memiliki email");
  return {
    name: payload.name || payload.email.split("@")[0] || "Panitia",
    email: payload.email,
    picture: payload.picture,
  };
}
