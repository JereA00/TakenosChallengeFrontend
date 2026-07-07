"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { getMatches, getTeams, Match, Team, MatchesResponse } from "@/lib/api";
import { HERO_BG, HERO_STARS, MATCHES_PAGE_LIMIT } from "@/lib/constants";
import { MESSAGES } from "@/lib/messages";
import { groupMatchesByDay } from "@/lib/matches";
import MatchCard from "@/components/MatchCard";
import MatchFilters from "@/components/MatchFilters";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import Image from "next/image";


type FetchState = {
  loading: boolean;
  error: string | null;
  matches: Match[];
  pagination: { page: number; totalPages: number; total: number };
};
type FetchAction =
  | { type: "success"; matches: Match[]; pagination: FetchState["pagination"] }
  | { type: "error"; message: string };

function fetchReducer(_: FetchState, action: FetchAction): FetchState {
  if (action.type === "success")
    return { loading: false, error: null, matches: action.matches, pagination: action.pagination };
  return { loading: false, error: action.message, matches: [], pagination: { page: 1, totalPages: 1, total: 0 } };
}

const INITIAL_FETCH_STATE: FetchState = { loading: true, error: null, matches: [], pagination: { page: 1, totalPages: 1, total: 0 } };

export default function MatchesPage() {
  const [{ loading, error, matches, pagination }, dispatch] = useReducer(fetchReducer, INITIAL_FETCH_STATE);
  const [teams, setTeams] = useState<Team[]>([]);

  const [teamId, setTeamId] = useState<number | undefined>();
  const [matchDay, setMatchDay] = useState<number | undefined>();
  const [location, setLocation] = useState<"home" | "away" | undefined>();
  const [countryName, setCountryName] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  useEffect(() => { getTeams().then(setTeams).catch(() => {}); }, []);

  useEffect(() => {
    let cancelled = false;
    getMatches({ teamId, matchDay, location, countryName, page, limit: MATCHES_PAGE_LIMIT })
      .then((data: MatchesResponse) => {
        if (!cancelled) dispatch({
          type: "success",
          matches: data.matches,
          pagination: { page: data.pagination.page, totalPages: data.pagination.totalPages, total: data.pagination.total },
        });
      })
      .catch((e) => {
        if (!cancelled) dispatch({ type: "error", message: e instanceof Error ? e.message : MESSAGES.errors.unknown });
      });
    return () => { cancelled = true; };
  }, [teamId, matchDay, location, countryName, page]);

  function handleReset() { setTeamId(undefined); setMatchDay(undefined); setLocation(undefined); setCountryName(undefined); setPage(1); }
  function handleTeamChange(id?: number) { setTeamId(id); setLocation(undefined); setPage(1); }
  function handleMatchDayChange(day?: number) { setMatchDay(day); setPage(1); }
  function handleLocationChange(loc?: "home" | "away") { setLocation(loc); setPage(1); }
  function handleCountryChange(country?: string) { setCountryName(country); setTeamId(undefined); setLocation(undefined); setPage(1); }

  const matchesByDay = useMemo(() => groupMatchesByDay(matches), [matches]);
  const sortedDays = useMemo(() => Object.keys(matchesByDay).map(Number).sort((a, b) => a - b), [matchesByDay]);

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <div className="w-full py-12 px-4 relative overflow-hidden"
        style={{ background: HERO_BG }}>
        {/* Estrellas */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {HERO_STARS.map((pos, i) => (
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
              <p className="text-yellow-400/80 text-xs font-bold tracking-widest uppercase mb-1">{MESSAGES.header.uefa}</p>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                Champions <span className="text-yellow-400">League</span>
              </h1>
              <p className="text-blue-300/70 text-sm mt-1">{MESSAGES.matches.subtitle}</p>
              {!loading && <p className="text-white/40 text-xs mt-0.5">{pagination.total} {MESSAGES.matches.totalMatches}</p>}
            </div>
          </div>
          <Link href="/teams"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
            {MESSAGES.nav.viewTeams}
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
              {MESSAGES.matches.noResults}
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
                      {MESSAGES.matches.matchday(day)}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                    <span className="text-xs" style={{ color: "rgba(147,197,253,0.4)" }}>
                      {matchesByDay[day].length} {MESSAGES.matches.matchesCount}
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
