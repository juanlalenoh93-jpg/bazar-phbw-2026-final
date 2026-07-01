import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as ORGANIZATION_NAME, t as APP_TITLE } from "./branding-D-EPtLZP.mjs";
import { P as Church, f as ShieldCheck } from "../_libs/lucide-react.mjs";
import "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CGBII8bA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	(0, import_react.useRef)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[75vh] place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Church, { className: "h-8 w-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-xl font-bold",
					children: "PHBW 2026"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium text-foreground",
					children: APP_TITLE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: ORGANIZATION_NAME
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 rounded-xl bg-muted/50 p-3 text-left text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pengguna wajib login memakai akun Google sebelum masuk ke aplikasi." })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-left text-xs text-destructive",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Google Login belum aktif." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Tambahkan Environment Variable ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "VITE_GOOGLE_CLIENT_ID" }),
						" di Vercel, lalu redeploy."
					]
				})
			]
		})
	});
}
//#endregion
export { AuthPage as component };
