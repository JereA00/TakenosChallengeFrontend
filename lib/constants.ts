export const HERO_BG = "linear-gradient(135deg, #0a1628 0%, #0d2244 60%, #1a3a6b 100%)";

export const HERO_STARS = [
  "top-3 left-[8%]", "top-5 left-[20%]", "top-2 left-[35%]", "top-6 left-[50%]",
  "top-4 left-[65%]", "top-3 left-[78%]", "top-5 left-[90%]",
  "bottom-4 left-[12%]", "bottom-3 left-[30%]", "bottom-5 left-[55%]",
  "bottom-4 left-[72%]", "bottom-3 left-[88%]",
];

export const POT_CONFIG: Record<number, {
  label: string; accent: string; badgeBg: string; badgeText: string; dot: string;
}> = {
  1: { label: "Bombo 1", accent: "#FFC72C", badgeBg: "rgba(255,199,44,0.15)",  badgeText: "#FFC72C", dot: "#FFC72C" },
  2: { label: "Bombo 2", accent: "#60a5fa", badgeBg: "rgba(96,165,250,0.15)",  badgeText: "#93c5fd", dot: "#60a5fa" },
  3: { label: "Bombo 3", accent: "#34d399", badgeBg: "rgba(52,211,153,0.15)",  badgeText: "#6ee7b7", dot: "#34d399" },
  4: { label: "Bombo 4", accent: "#f87171", badgeBg: "rgba(248,113,113,0.15)", badgeText: "#fca5a5", dot: "#f87171" },
};
