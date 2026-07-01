import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as ORGANIZATION_NAME, o as useMainHeader } from "./branding-D-EPtLZP.mjs";
import { P as Church } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { b as useLogo, x as useRightLogo } from "./storage-DHI9muZ1.mjs";
import { n as getAuthUser, o as useAuth } from "./auth-Q8aXDp4D.mjs";
import { N as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route$7 } from "./bazar.index-DYH4R8ux.mjs";
import { t as Route$8 } from "./bazar._id-3cnj9n48.mjs";
import { t as Route$9 } from "./bazar._id.rekapan-CoKsjaGz.mjs";
import { t as Route$10 } from "./piutang._customer-zqgWm1JW.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cl2igG7V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-voXG7vHA.css";
function AppHeader() {
	const logo = useLogo();
	const rightLogo = useRightLogo();
	const mainHeader = useMainHeader();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-5xl px-4 py-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoDisplay, {
						title: "Logo Kiri",
						logo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "min-w-0 flex-1 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-sm font-bold leading-tight text-foreground sm:text-base",
							children: mainHeader
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-medium text-muted-foreground sm:text-xs",
							children: ORGANIZATION_NAME
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoDisplay, {
						title: "Logo Kanan",
						logo: rightLogo
					})
				]
			})
		})
	});
}
function LogoDisplay({ title, logo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-label": title,
		className: "grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-primary/10 text-primary",
		children: logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: logo,
			alt: title,
			className: "h-full w-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Church, { className: "h-6 w-6" })
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "PHBW 2026" },
			{
				name: "description",
				content: `Aplikasi manajemen keuangan bazar Panitia Hari Besar Wilayah 2026, ${ORGANIZATION_NAME}.`
			},
			{
				property: "og:title",
				content: "PHBW 2026"
			},
			{
				name: "twitter:title",
				content: "PHBW 2026"
			},
			{
				property: "og:description",
				content: "Aplikasi Bazar PHBW 2026"
			},
			{
				name: "twitter:description",
				content: "Aplikasi Bazar PHBW 2026"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "theme-color",
				content: "#047857"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "PHBW 2026"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Halaman tidak ditemukan."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/",
				className: "mt-4 inline-block text-primary underline",
				children: "Kembali ke beranda"
			})
		] })
	})
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "id",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user } = useAuth();
	const navigate = useNavigate();
	const isAuthPage = pathname === "/auth";
	const showHeader = pathname === "/" && !!user;
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getAuthUser() && !isAuthPage) navigate({
			to: "/auth",
			replace: true
		});
	}, [user, pathname]);
	(0, import_react.useEffect)(() => {
		if (isAuthPage && !!user) navigate({
			to: "/",
			replace: true
		});
	}, [user, isAuthPage]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
		const register = () => navigator.serviceWorker.register("/sw.js").catch(() => void 0);
		if (document.readyState === "complete") register();
		else window.addEventListener("load", register, { once: true });
		return () => window.removeEventListener("load", register);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background",
			children: [
				showHeader && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto max-w-5xl px-4 py-6 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
					richColors: true,
					closeButton: true,
					position: "bottom-center"
				})
			]
		})
	});
}
var $$splitComponentImporter$5 = () => import("./saldo-EY9KXStA.mjs");
var Route$5 = createFileRoute("/saldo")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./riwayat-CLlPfcsJ.mjs");
var Route$4 = createFileRoute("/riwayat")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./kalkulator-BwQv4gUO.mjs");
var Route$3 = createFileRoute("/kalkulator")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./auth-CGBII8bA.mjs");
var Route$2 = createFileRoute("/auth")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./routes-Cif65HPV.mjs");
var Route$1 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./piutang.index-Dor968QC.mjs");
var Route = createFileRoute("/piutang/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SaldoRoute = Route$5.update({
	id: "/saldo",
	path: "/saldo",
	getParentRoute: () => Route$6
});
var RiwayatRoute = Route$4.update({
	id: "/riwayat",
	path: "/riwayat",
	getParentRoute: () => Route$6
});
var KalkulatorRoute = Route$3.update({
	id: "/kalkulator",
	path: "/kalkulator",
	getParentRoute: () => Route$6
});
var AuthRoute = Route$2.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$6
});
var IndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var PiutangIndexRoute = Route.update({
	id: "/piutang/",
	path: "/piutang/",
	getParentRoute: () => Route$6
});
var BazarIndexRoute = Route$7.update({
	id: "/bazar/",
	path: "/bazar/",
	getParentRoute: () => Route$6
});
var PiutangCustomerRoute = Route$10.update({
	id: "/piutang/$customer",
	path: "/piutang/$customer",
	getParentRoute: () => Route$6
});
var BazarIdRoute = Route$8.update({
	id: "/bazar/$id",
	path: "/bazar/$id",
	getParentRoute: () => Route$6
});
var BazarIdRouteChildren = { BazarIdRekapanRoute: Route$9.update({
	id: "/rekapan",
	path: "/rekapan",
	getParentRoute: () => BazarIdRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	AuthRoute,
	KalkulatorRoute,
	RiwayatRoute,
	SaldoRoute,
	BazarIdRoute: BazarIdRoute._addFileChildren(BazarIdRouteChildren),
	PiutangCustomerRoute,
	BazarIndexRoute,
	PiutangIndexRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
