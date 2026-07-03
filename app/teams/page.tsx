"use client";

import { useEffect, useState } from "react";
import { getTeams, Team } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

const STARS = [
  "top-3 left-[8%]", "top-5 left-[20%]", "top-2 left-[35%]", "top-6 left-[50%]",
  "top-4 left-[65%]", "top-3 left-[78%]", "top-5 left-[90%]",
  "bottom-4 left-[12%]", "bottom-3 left-[30%]", "bottom-5 left-[55%]",
  "bottom-4 left-[72%]", "bottom-3 left-[88%]",
];
import TeamAvatar from "@/components/TeamAvatar";
import { getFlag } from "@/lib/flags";

const POT_CONFIG: Record<number, {
  label: string; accent: string; badgeBg: string; badgeText: string;
}> = {
  1: { label: "Bombo 1", accent: "#FFC72C", badgeBg: "rgba(255,199,44,0.15)", badgeText: "#FFC72C" },
  2: { label: "Bombo 2", accent: "#60a5fa", badgeBg: "rgba(96,165,250,0.15)", badgeText: "#93c5fd" },
  3: { label: "Bombo 3", accent: "#34d399", badgeBg: "rgba(52,211,153,0.15)", badgeText: "#6ee7b7" },
  4: { label: "Bombo 4", accent: "#f87171", badgeBg: "rgba(248,113,113,0.15)", badgeText: "#fca5a5" },
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTeams()
      .then(setTeams)
      .catch((e) => setError(e instanceof Error ? e.message : "Error desconocido"))
      .finally(() => setLoading(false));
  }, []);

  const teamsByPot: Record<number, Team[]> = {};
  for (const team of teams) {
    const pot = team.pot ?? 0;
    if (!teamsByPot[pot]) teamsByPot[pot] = [];
    teamsByPot[pot].push(team);
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <div className="w-full py-12 px-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2244 60%, #1a3a6b 100%)" }}>
        {/* Estrellas */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {STARS.map((pos, i) => (
            <span key={i} className={`absolute text-yellow-400/25 animate-pulse ${pos}`}
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2.5s", fontSize: i % 3 === 0 ? "18px" : "12px" }}>★</span>
          ))}
        </div>
        {/* Pelotas decorativas de fondo */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Image src="/ucl-ball.png" alt="" width={240} height={229} className="object-contain invert" />
        </div>
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
          <Image src="/ucl-ball.png" alt="" width={180} height={171} className="object-contain invert" />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0" style={{ animation: "ucl-bounce 3s ease-in-out infinite" }}>
              <Image src="/ucl-ball.png" alt="UCL" width={72} height={68} className="object-contain invert" />
            </div>
            <div>
              <p className="text-yellow-400/80 text-xs font-bold tracking-widest uppercase mb-1">UEFA</p>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                Champions <span className="text-yellow-400">League</span>
              </h1>
              <p className="text-blue-300/70 text-sm mt-1">Equipos · Fase de Liga · 2025/26</p>
              {!loading && <p className="text-white/40 text-xs mt-0.5">{teams.length} equipos participantes</p>}
            </div>
          </div>
          <Link href="/matches"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
            Ver partidos →
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ucl-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Contenido */}
      <div className="flex-1 w-full px-4 py-8" style={{ background: "#0d1e3a" }}>
        <div className="max-w-6xl mx-auto">

          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center py-8">{error}</p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((potId) => {
                const cfg = POT_CONFIG[potId];
                const potTeams = teamsByPot[potId] ?? [];
                return (
                  <div key={potId} className="rounded-xl overflow-hidden"
                    style={{ background: "#0a1628", border: `1px solid ${cfg.accent}22` }}>
                    <div className="px-4 py-3 flex items-center justify-between"
                      style={{ borderBottom: `1px solid ${cfg.accent}33`, background: `${cfg.accent}10` }}>
                      <span className="text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
                        style={{ background: cfg.badgeBg, color: cfg.badgeText }}>
                        {cfg.label}
                      </span>
                      <span className="text-xs" style={{ color: `${cfg.accent}80` }}>{potTeams.length} equipos</span>
                    </div>
                    <div>
                      {potTeams.map((team, i) => (
                        <Link key={team.id} href={`/teams/${team.id}`}
                          className="flex items-center gap-3 px-3 py-2.5 transition-colors group"
                          style={{ borderBottom: i < potTeams.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <div className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                            style={{ width: 40, height: 40, background: "rgba(255,255,255,0.92)", padding: 3 }}>
                            <TeamAvatar name={team.name} pot={potId} size="md" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{team.name}</p>
                            <p className="text-xs" style={{ color: "rgba(147,197,253,0.6)" }}>
                              {getFlag(team.country.name)} {team.country.name}
                            </p>
                          </div>
                          <span className="text-xs transition-colors shrink-0"
                            style={{ color: `${cfg.accent}50` }}>→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
