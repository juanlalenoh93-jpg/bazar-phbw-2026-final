import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bazar._id.rekapan-CoKsjaGz.js
var $$splitComponentImporter = () => import("./bazar._id.rekapan-C9ojxiIC.mjs");
var Route = createFileRoute("/bazar/$id/rekapan")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: ({ params }) => ({ id: params.id })
});
//#endregion
export { Route as t };
