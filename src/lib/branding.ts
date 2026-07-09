import { useSyncExternalStore } from "react";

export const APP_TITLE = "Panitia Hari Besar Wilayah 2026";
export const ORGANIZATION_NAME_DEFAULT = "Kompelsus Pemuda Wilayah IV JBZL";
export const WORKSPACE_ORG_LABEL = "Wilayah IV";

const MAIN_HEADER_KEY = "phbw-2026-main-header-v1";
const WORKSPACE_HEADER_KEY = "phbw-2026-workspace-header-v1";
const ORG_NAME_KEY = "phbw-2026-org-name-v1";

let mainHeader: string | null = null;
let workspaceHeader: string | null = null;
let orgName: string | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined" || loaded) return;
  try {
    mainHeader = localStorage.getItem(MAIN_HEADER_KEY);
    workspaceHeader = localStorage.getItem(WORKSPACE_HEADER_KEY);
    orgName = localStorage.getItem(ORG_NAME_KEY);
  } catch {
    mainHeader = null;
    workspaceHeader = null;
    orgName = null;
  }
  loaded = true;
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function getMainHeader(): string {
  load();
  return mainHeader?.trim() || APP_TITLE;
}

export function getWorkspaceHeader(): string {
  load();
  return workspaceHeader?.trim() || WORKSPACE_ORG_LABEL;
}

export function getOrgName(): string {
  load();
  return orgName?.trim() || ORGANIZATION_NAME_DEFAULT;
}

// Kept for any legacy import; now resolves to the (possibly customized) org name.
export const ORGANIZATION_NAME = ORGANIZATION_NAME_DEFAULT;

export function setMainHeader(value: string) {
  const next = value.trim() || APP_TITLE;
  mainHeader = next;
  loaded = true;
  if (typeof window !== "undefined") localStorage.setItem(MAIN_HEADER_KEY, next);
  emit();
}

export function setWorkspaceHeader(value: string) {
  const next = value.trim() || WORKSPACE_ORG_LABEL;
  workspaceHeader = next;
  loaded = true;
  if (typeof window !== "undefined") localStorage.setItem(WORKSPACE_HEADER_KEY, next);
  emit();
}

export function setOrgName(value: string) {
  const next = value.trim() || ORGANIZATION_NAME_DEFAULT;
  orgName = next;
  loaded = true;
  if (typeof window !== "undefined") localStorage.setItem(ORG_NAME_KEY, next);
  emit();
}

export function resetMainHeader() {
  mainHeader = null;
  loaded = true;
  if (typeof window !== "undefined") localStorage.removeItem(MAIN_HEADER_KEY);
  emit();
}

export function resetWorkspaceHeader() {
  workspaceHeader = null;
  loaded = true;
  if (typeof window !== "undefined") localStorage.removeItem(WORKSPACE_HEADER_KEY);
  emit();
}

export function useMainHeader(): string {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => getMainHeader(),
    () => APP_TITLE,
  );
}

export function useWorkspaceHeader(): string {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => getWorkspaceHeader(),
    () => WORKSPACE_ORG_LABEL,
  );
}

export function useOrgName(): string {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => getOrgName(),
    () => ORGANIZATION_NAME_DEFAULT,
  );
}
