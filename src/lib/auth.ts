import { useSyncExternalStore } from "react";

export type AppUser = {
  name: string;
  email: string;
  picture?: string;
};

export type AuthState = {
  loading: boolean;
  session: { user: AppUser } | null;
  user: AppUser | null;
  displayName: string;
};

const AUTH_KEY = "phbw-2026-google-user-v1";
let user: AppUser | null = null;
let loaded = false;
const listeners = new Set<() => void>();

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

export function useAuth(): AuthState {
  const currentUser = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => loadUser(),
    () => null,
  );

  return {
    loading: false,
    session: currentUser ? { user: currentUser } : null,
    user: currentUser,
    displayName: currentUser?.name || "Panitia",
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
