import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react, w as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-DKCAsAV2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/**
* Buka pesan WhatsApp lewat wa.me. Beberapa browser (mode hemat data,
* pop-up blocker, atau saat dibuka dari dalam PWA/WebView) bisa membatalkan
* window.open secara diam-diam sehingga tombol "Kirim ke WA" terlihat tidak
* berfungsi padahal sebenarnya pop-up-nya yang diblokir. Fungsi ini mendeteksi
* itu dan otomatis menyalin teksnya ke clipboard sebagai cadangan, supaya user
* tetap bisa paste manual ke WhatsApp kalau pop-up gagal terbuka.
*/
async function shareToWhatsApp(text) {
	const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
	let opened = false;
	try {
		const win = window.open(url, "_blank");
		opened = !!win && !win.closed;
	} catch {
		opened = false;
	}
	if (opened) return {
		opened: true,
		copied: false
	};
	let copied = false;
	try {
		await navigator.clipboard.writeText(text);
		copied = true;
	} catch {
		copied = false;
	}
	return {
		opened: false,
		copied
	};
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(0,0,0,.06)] hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-[0_2px_8px_rgba(0,0,0,.06)] hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-[0_2px_8px_rgba(0,0,0,.06)] hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-[0_2px_8px_rgba(0,0,0,.06)] hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 px-3 text-xs",
			lg: "h-10 px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { shareToWhatsApp as i, buttonVariants as n, cn as r, Button as t };
