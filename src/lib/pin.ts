const PIN_KEY = "phbw-2026-pin-v1";
const DEFAULT_PIN = "PHBW2026";

export function getPin(): string {
  if (typeof window === "undefined") return DEFAULT_PIN;
  return localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
}

export function setPin(pin: string) {
  if (typeof window === "undefined") return;
  if (!pin.trim()) return;
  localStorage.setItem(PIN_KEY, pin.trim());
}

export function verifyPin(input: string): boolean {
  return input.trim() === getPin();
}
