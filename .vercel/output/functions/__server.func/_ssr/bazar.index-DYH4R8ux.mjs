import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DKCAsAV2.mjs";
import { t as Input } from "./input-DLhLYSN_.mjs";
import { t as Label } from "./label-DfxyFUsy.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, d as verifyPin, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./pin-DM1ztchA.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bazar.index-DYH4R8ux.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./bazar.index-R1lSX8Rb.mjs");
var Route = createFileRoute("/bazar/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function PinConfirmDelete({ onConfirm, label, requirePin = true, canDelete }) {
	const [pin, setPin] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)("confirm");
	const reset = () => {
		setOpen(false);
		setStep("confirm");
		setPin("");
	};
	const startDelete = () => {
		if (canDelete && !canDelete()) return;
		setStep("confirm");
		setOpen(true);
	};
	const proceed = (e) => {
		e.preventDefault();
		if (requirePin) {
			setStep("pin");
			return;
		}
		onConfirm();
		reset();
	};
	const confirmWithPin = (e) => {
		e.preventDefault();
		if (!verifyPin(pin)) {
			toast.error("PIN salah");
			return;
		}
		onConfirm();
		reset();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "icon",
		variant: "ghost",
		className: "h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive",
		onClick: startDelete,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open,
		onOpenChange: (v) => {
			if (!v) reset();
			else setOpen(true);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: step === "confirm" ? `Hapus ${label}?` : "Masukkan PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: step === "confirm" ? "Tindakan ini tidak dapat dibatalkan. Lanjutkan menghapus data ini?" : "Masukkan PIN aktif untuk melanjutkan penghapusan." })] }),
			step === "pin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					autoFocus: true,
					value: pin,
					onChange: (e) => setPin(e.target.value),
					placeholder: "Masukkan PIN"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), step === "confirm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: proceed,
				children: "Ya, Hapus"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: confirmWithPin,
				children: "Hapus"
			})] })
		] })
	})] });
}
//#endregion
export { Route as n, PinConfirmDelete as t };
