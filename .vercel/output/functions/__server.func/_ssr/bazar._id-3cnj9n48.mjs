import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bazar._id-3cnj9n48.js
var $$splitNotFoundComponentImporter = () => import("./bazar._id-B2oYC9ic.mjs");
var $$splitComponentImporter = () => import("./bazar._id-BHiI6_qA.mjs");
var Route = createFileRoute("/bazar/$id")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	loader: ({ params }) => ({ id: params.id })
});
//#endregion
export { Route as t };
