"use client";

import { useEffect, useState, useCallback } from "react";
import { getMatches, getTeams, Match, Team, MatchesResponse } from "@/lib/api";
import MatchCard from "@/components/MatchCard";
import MatchFilters from "@/components/MatchFilters";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import Image from "next/image";

const STARS = [
  "top-3 left-[8%]", "top-5 left-[20%]", "top-2 left-[35%]", "top-6 left-[50%]",
  "top-4 left-[65%]", "top-3 left-[78%]", "top-5 left-[90%]",
  "bottom-4 left-[12%]", "bottom-3 left-[30%]", "bottom-5 left-[55%]",
  "bottom-4 left-[72%]", "bottom-3 left-[88%]",
];

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [teamId, setTeamId] = useState<number | undefined>();
  const [matchDay, setMatchDay] = useState<number | undefined>();
  const [location, setLocation] = useState<"home" | "away" | undefined>();
  const [countryName, setCountryName] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: MatchesResponse = await getMatches({ teamId, matchDay, location, countryName, page, limit: 18 });
      setMatches(data.matches);
      setPagination({ page: data.pagination.page, totalPages: data.pagination.totalPages, total: data.pagination.total });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [teamId, matchDay, location, countryName, page]);

  useEffect(() => { getTeams().then(setTeams).catch(() => {}); }, []);
  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  function handleReset() { setTeamId(undefined); setMatchDay(undefined); setLocation(undefined); setCountryName(undefined); setPage(1); }
  function handleTeamChange(id?: number) { setTeamId(id); setLocation(undefined); setPage(1); }
  function handleMatchDayChange(day?: number) { setMatchDay(day); setPage(1); }
  function handleLocationChange(loc?: "home" | "away") { setLocation(loc); setPage(1); }
  function handleCountryChange(country?: string) { setCountryName(country); setTeamId(undefined); setLocation(undefined); setPage(1); }

  // Agrupar partidos por jornada
  const matchesByDay = matches.reduce<Record<number, Match[]>>((acc, m) => {
    if (!acc[m.matchDay]) acc[m.matchDay] = [];
    acc[m.matchDay].push(m);
    return acc;
  }, {});
  const sortedDays = Object.keys(matchesByDay).map(Number).sort((a, b) => a - b);

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

        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0" style={{ animation: "ucl-bounce 3s ease-in-out infinite" }}>
              <Image src="/ucl-ball.png" alt="UCL" width={72} height={68} className="object-contain invert" />
            </div>
            <div>
              <p className="text-yellow-400/80 text-xs font-bold tracking-widest uppercase mb-1">UEFA</p>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                Champions <span className="text-yellow-400">League</span>
              </h1>
              <p className="text-blue-300/70 text-sm mt-1">Partidos · Fase de Liga · 2025/26</p>
              {!loading && <p className="text-white/40 text-xs mt-0.5">{pagination.total} partidos en total</p>}
            </div>
          </div>
          <Link href="/teams"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
            Ver equipos →
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
        <div className="max-w-4xl mx-auto flex flex-col gap-6">

          <MatchFilters
            teams={teams} teamId={teamId} matchDay={matchDay} location={location} countryName={countryName}
            onTeamChange={handleTeamChange} onMatchDayChange={handleMatchDayChange}
            onLocationChange={handleLocationChange} onCountryChange={handleCountryChange}
            onReset={handleReset}
          />

          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

          {!loading && !error && matches.length === 0 && (
            <p className="text-center py-12" style={{ color: "rgba(147,197,253,0.4)" }}>
              No hay partidos para los filtros seleccionados.
            </p>
          )}

          {!loading && !error && matches.length > 0 && (
            <div className="flex flex-col gap-8">
              {sortedDays.map((day) => (
                <div key={day} className="flex flex-col gap-3">
                  {/* Header de jornada */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                      style={{ background: "rgba(255,199,44,0.15)", color: "#FFC72C" }}>
                      Jornada {day}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                    <span className="text-xs" style={{ color: "rgba(147,197,253,0.4)" }}>
                      {matchesByDay[day].length} partidos
                    </span>
                  </div>
                  {/* Grid 2 columnas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {matchesByDay[day].map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
