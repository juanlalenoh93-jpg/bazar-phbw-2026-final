import { r as __toESM } from "../_runtime.mjs";
import { k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/branding-D-EPtLZP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var APP_TITLE = "Panitia Hari Besar Wilayah 2026";
var ORGANIZATION_NAME = "Kompelsus Pemuda Wilayah IV JBZL";
var WORKSPACE_ORG_LABEL = "Wilayah IV";
var MAIN_HEADER_KEY = "phbw-2026-main-header-v1";
var WORKSPACE_HEADER_KEY = "phbw-2026-workspace-header-v1";
var mainHeader = null;
var workspaceHeader = null;
var loaded = false;
var listeners = /* @__PURE__ */ new Set();
function load() {
	if (typeof window === "undefined" || loaded) return;
	try {
		mainHeader = localStorage.getItem(MAIN_HEADER_KEY);
		workspaceHeader = localStorage.getItem(WORKSPACE_HEADER_KEY);
	} catch {
		mainHeader = null;
		workspaceHeader = null;
	}
	loaded = true;
}
function emit() {
	listeners.forEach((listener) => listener());
}
function getMainHeader() {
	load();
	return mainHeader?.trim() || "Panitia Hari Besar Wilayah 2026";
}
function getWorkspaceHeader() {
	load();
	return workspaceHeader?.trim() || "Wilayah IV";
}
function setMainHeader(value) {
	const next = value.trim() || "Panitia Hari Besar Wilayah 2026";
	mainHeader = next;
	loaded = true;
	if (typeof window !== "undefined") localStorage.setItem(MAIN_HEADER_KEY, next);
	emit();
}
function setWorkspaceHeader(value) {
	const next = value.trim() || "Wilayah IV";
	workspaceHeader = next;
	loaded = true;
	if (typeof window !== "undefined") localStorage.setItem(WORKSPACE_HEADER_KEY, next);
	emit();
}
function useMainHeader() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		listeners.add(cb);
		return () => listeners.delete(cb);
	}, () => getMainHeader(), () => APP_TITLE);
}
function useWorkspaceHeader() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		listeners.add(cb);
		return () => listeners.delete(cb);
	}, () => getWorkspaceHeader(), () => WORKSPACE_ORG_LABEL);
}
//#endregion
export { setWorkspaceHeader as a, setMainHeader as i, ORGANIZATION_NAME as n, useMainHeader as o, WORKSPACE_ORG_LABEL as r, useWorkspaceHeader as s, APP_TITLE as t };
