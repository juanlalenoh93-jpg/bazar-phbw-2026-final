import { r as __toESM } from "../_runtime.mjs";
import { k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Q8aXDp4D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var AUTH_KEY = "phbw-2026-google-user-v1";
var ADMIN_LIST_KEY = "phbw-2026-admin-list-v1";
var user = null;
var loaded = false;
var listeners = /* @__PURE__ */ new Set();
var adminList = null;
var adminListeners = /* @__PURE__ */ new Set();
function notify() {
	listeners.forEach((listener) => listener());
}
function loadUser() {
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
function getAuthUser() {
	return loadUser();
}
function setAuthUser(nextUser) {
	user = nextUser;
	loaded = true;
	if (typeof window !== "undefined") if (nextUser) localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
	else localStorage.removeItem(AUTH_KEY);
	notify();
}
function loadAdminList() {
	if (typeof window === "undefined") return [];
	if (adminList !== null) return adminList;
	try {
		adminList = JSON.parse(localStorage.getItem(ADMIN_LIST_KEY) || "[]");
	} catch {
		adminList = [];
	}
	return adminList;
}
function saveAdminList() {
	if (typeof window !== "undefined") localStorage.setItem(ADMIN_LIST_KEY, JSON.stringify(adminList || []));
	adminListeners.forEach((l) => l());
	listeners.forEach((l) => l());
}
function getUserRole(email) {
	if (!email) return "viewer";
	const list = loadAdminList();
	if (list.length === 0) return "admin";
	return list.includes(email.toLowerCase().trim()) ? "admin" : "viewer";
}
function addAdmin(email) {
	loadAdminList();
	const e = email.toLowerCase().trim();
	if (!e) return;
	if (!adminList.includes(e)) {
		adminList = [...adminList, e];
		saveAdminList();
	}
}
function removeAdmin(email) {
	loadAdminList();
	const e = email.toLowerCase().trim();
	adminList = (adminList || []).filter((x) => x !== e);
	saveAdminList();
}
function useAdminList() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		adminListeners.add(cb);
		return () => adminListeners.delete(cb);
	}, () => loadAdminList(), () => []);
}
function useAuth() {
	const currentUser = (0, import_react.useSyncExternalStore)((cb) => {
		listeners.add(cb);
		return () => listeners.delete(cb);
	}, () => loadUser(), () => null);
	const role = getUserRole(currentUser?.email);
	return {
		loading: false,
		session: currentUser ? { user: currentUser } : null,
		user: currentUser,
		displayName: currentUser?.name || "Panitia",
		role,
		isAdmin: role === "admin"
	};
}
function signOut() {
	setAuthUser(null);
}
//#endregion
export { useAdminList as a, signOut as i, getAuthUser as n, useAuth as o, removeAdmin as r, addAdmin as t };
