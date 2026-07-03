"use client";

import { useEffect, useState } from "react";
import { getTeamById, Team, Match } from "@/lib/api";
import MatchCard from "@/components/MatchCard";
import TeamAvatar from "@/components/TeamAvatar";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getFlag } from "@/lib/flags";

const POT_CONFIG: Record<number, { label: string; accent: string; badgeBg: string; badgeText: string }> = {
  1: { label: "Bombo 1", accent: "#FFC72C", badgeBg: "rgba(255,199,44,0.15)", badgeText: "#FFC72C" },
  2: { label: "Bombo 2", accent: "#60a5fa", badgeBg: "rgba(96,165,250,0.15)", badgeText: "#93c5fd" },
  3: { label: "Bombo 3", accent: "#34d399", badgeBg: "rgba(52,211,153,0.15)", badgeText: "#6ee7b7" },
  4: { label: "Bombo 4", accent: "#f87171", badgeBg: "rgba(248,113,113,0.15)", badgeText: "#fca5a5" },
};

const STARS = [
  "top-3 left-[8%]", "top-5 left-[20%]", "top-2 left-[35%]", "top-6 left-[50%]",
  "top-4 left-[65%]", "top-3 left-[78%]", "top-5 left-[90%]",
  "bottom-4 left-[12%]", "bottom-3 left-[30%]", "bottom-5 left-[55%]",
  "bottom-4 left-[72%]", "bottom-3 left-[88%]",
];

export default function TeamDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [team, setTeam] = useState<Team | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getTeamById(id)
      .then((data) => { setTeam(data.team); setMatches(data.matches); })
      .catch((e) => setError(e instanceof Error ? e.message : "Error desconocido"))
      .finally(() => setLoading(false));
  }, [id]);

  const homeMatches = matches.filter((m) => m.homeTeam.id === id);
  const awayMatches = matches.filter((m) => m.awayTeam.id === id);
  const cfg = team?.pot ? POT_CONFIG[team.pot] : null;

  return (
    <div className="flex flex-col flex-1">

      {/* Hero */}
      <div className="w-full py-12 px-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2244 60%, #1a3a6b 100%)" }}>
        <div className="absolute inset-0 pointer-events-none select-none">
          {STARS.map((pos, i) => (
            <span key={i} className={`absolute text-yellow-400/25 animate-pulse ${pos}`}
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2.5s", fontSize: i % 3 === 0 ? "18px" : "12px" }}>
              ★
            </span>
          ))}
        </div>
        {/* Pelotas decorativas de fondo */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Image src="/ucl-ball.png" alt="" width={240} height={229} className="object-contain invert" />
        </div>
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
          <Image src="/ucl-ball.png" alt="" width={180} height={171} className="object-contain invert" />
        </div>

      <style jsx global>{`
        @keyframes ucl-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/teams" className="inline-flex items-center gap-1.5 text-sm text-blue-300/70 hover:text-blue-200 transition-colors mb-5">
            ← Volver a equipos
          </Link>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && !error && team && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Team info */}
              <div className="flex items-center gap-5">
                <div className="shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ width: 72, height: 72, background: "rgba(255,255,255,0.95)", padding: 6 }}>
                  <TeamAvatar name={team.name} pot={team.pot} size="lg" />
                </div>
                <div>
                  <p className="text-yellow-400/80 text-xs font-bold tracking-widest uppercase mb-1">UEFA · Champions League</p>
                  <h1 className="text-2xl font-black text-white">{team.name}</h1>
                  <p className="text-blue-300/60 text-sm mt-0.5">{getFlag(team.country.name)} {team.country.name}</p>
                </div>
              </div>

              {/* Stats + bombo */}
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex gap-5 text-center">
                  {[
                    { n: matches.length, l: "Partidos" },
                    { n: homeMatches.length, l: "De local" },
                    { n: awayMatches.length, l: "De visitante" },
                  ].map(({ n, l }) => (
                    <div key={l}>
                      <p className="text-2xl font-black text-yellow-400">{n}</p>
                      <p className="text-xs text-blue-300/60">{l}</p>
                    </div>
                  ))}
                </div>
                {cfg && (
                  <span className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                    style={{ background: cfg.badgeBg, color: cfg.badgeText, border: `1px solid ${cfg.accent}33` }}>
                    {cfg.label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 w-full px-4 py-8" style={{ background: "#0d1e3a" }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

          {!loading && !error && team && (
            <>
              {/* De local */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>
                    De local · {homeMatches.length}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {homeMatches.length === 0
                    ? <p className="text-sm" style={{ color: "rgba(147,197,253,0.4)" }}>Sin partidos de local</p>
                    : homeMatches.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>

              {/* De visitante */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ background: "rgba(52,211,153,0.12)", color: "#34d399" }}>
                    De visitante · {awayMatches.length}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {awayMatches.length === 0
                    ? <p className="text-sm" style={{ color: "rgba(147,197,253,0.4)" }}>Sin partidos de visitante</p>
                    : awayMatches.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
