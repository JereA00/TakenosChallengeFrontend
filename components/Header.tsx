"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const links = [
  { href: "/draw", label: "Sorteo" },
  { href: "/matches", label: "Partidos" },
  { href: "/teams", label: "Equipos" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-10 border-b border-white/10"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2244 60%, #1a3a6b 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/draw" className="flex items-center gap-3 group">
          <Image
            src="/ucl-ball.png"
            alt="UEFA Champions League"
            width={36}
            height={36}
            className="object-contain group-hover:scale-105 transition-transform invert"
          />
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black text-base tracking-tight">UEFA</span>
              <span className="text-yellow-400 font-black text-base tracking-tight">Champions League</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-blue-300/70 font-medium hidden sm:inline">
                Draw · Fase de Liga
              </span>
              <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                2025/26
              </span>
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  active
                    ? "bg-yellow-400 text-gray-900 font-bold shadow-md shadow-yellow-400/20"
                    : "text-blue-100/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
