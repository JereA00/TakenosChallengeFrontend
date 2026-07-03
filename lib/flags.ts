export const COUNTRY_FLAGS: Record<string, string> = {
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Spain: "🇪🇸",
  Germany: "🇩🇪",
  France: "🇫🇷",
  Italy: "🇮🇹",
  Portugal: "🇵🇹",
  Netherlands: "🇳🇱",
  Belgium: "🇧🇪",
  Turkey: "🇹🇷",
  Greece: "🇬🇷",
  Norway: "🇳🇴",
  Azerbaijan: "🇦🇿",
  Denmark: "🇩🇰",
  "Czech Republic": "🇨🇿",
  Kazakhstan: "🇰🇿",
  Cyprus: "🇨🇾",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Austria: "🇦🇹",
  Switzerland: "🇨🇭",
  Croatia: "🇭🇷",
  Serbia: "🇷🇸",
  Ukraine: "🇺🇦",
  Romania: "🇷🇴",
  Poland: "🇵🇱",
  Hungary: "🇭🇺",
};

export function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? "🌍";
}
