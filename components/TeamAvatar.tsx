"use client";

import Image from "next/image";
import teamLogos from "@/lib/team-logos.json";

interface Props {
  name: string;
  pot?: number;
  size?: "sm" | "md" | "lg";
}

const POT_COLORS: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-yellow-100", text: "text-yellow-800" },
  2: { bg: "bg-slate-100",  text: "text-slate-700"  },
  3: { bg: "bg-orange-100", text: "text-orange-800" },
  4: { bg: "bg-blue-100",   text: "text-blue-800"   },
};

const FALLBACK_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-800" },
  { bg: "bg-emerald-100", text: "text-emerald-800" },
];

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const SIZE_PX = { sm: 28, md: 36, lg: 48 };
const SIZE_CLASSES = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-12 h-12 text-sm",
};

export default function TeamAvatar({ name, pot, size = "md" }: Props) {
  const logoSrc = (teamLogos as Record<string, string>)[name];
  const px = SIZE_PX[size];

  if (logoSrc) {
    return (
      <div className={`${SIZE_CLASSES[size]} relative shrink-0 flex items-center justify-center`}>
        <Image
          src={logoSrc}
          alt={name}
          width={px}
          height={px}
          className="object-contain w-full h-full"
        />
      </div>
    );
  }

  // Fallback: starball oficial UCL
  return (
    <div className={`${SIZE_CLASSES[size]} shrink-0 flex items-center justify-center`}>
      <Image src="/ucl-ball.png" alt="UCL" width={px} height={px} className="object-contain w-full h-full invert" />
    </div>
  );
}
