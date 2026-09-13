export const TASK_COLORS = [
  "#111827",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0891b2",
];

export const DEFAULT_TASK_COLOR = TASK_COLORS[0];

/** Normalises "#333" / "#333333" to a 6-digit hex, falling back to the default colour. */
export function normalizeHex(color: string | undefined): string {
  if (!color) return DEFAULT_TASK_COLOR;
  const hex = color.trim();
  if (/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return DEFAULT_TASK_COLOR;
}

/** Returns the colour as an rgba() string at the given opacity. */
export function tint(color: string | undefined, alpha: number): string {
  const hex = normalizeHex(color);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
