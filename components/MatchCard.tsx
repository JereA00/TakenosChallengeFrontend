"use client";

import { Match } from "@/lib/api";
import TeamAvatar from "@/components/TeamAvatar";
import { getFlag } from "@/lib/flags";

interface Props {
  match: Match;
}

export default function MatchCard({ match }: Props) {
  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3 transition-all"
      style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
    >
      {/* Local */}
      <div className="flex-1 flex items-center justify-end gap-2.5 min-w-0">
        <div className="text-right min-w-0">
          <p className="font-semibold text-white text-sm truncate">{match.homeTeam.name}</p>
          <p className="text-xs" style={{ color: "rgba(147,197,253,0.6)" }}>
            {getFlag(match.homeTeam.country.name)} {match.homeTeam.country.name}
          </p>
        </div>
        <div className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ width: 36, height: 36, background: "rgba(255,255,255,0.92)", padding: 3 }}>
          <TeamAvatar name={match.homeTeam.name} pot={match.homeTeam.pot} size="sm" />
        </div>
      </div>

      {/* Centro */}
      <div className="flex flex-col items-center shrink-0 gap-0.5 w-14">
        <span className="text-xs font-black px-2 py-0.5 rounded-full tabular-nums"
          style={{ background: "rgba(255,199,44,0.15)", color: "#FFC72C" }}>
          J{match.matchDay}
        </span>
        <span className="text-[10px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>VS</span>
      </div>

      {/* Visitante */}
      <div className="flex-1 flex items-center gap-2.5 min-w-0">
        <div className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ width: 36, height: 36, background: "rgba(255,255,255,0.92)", padding: 3 }}>
          <TeamAvatar name={match.awayTeam.name} pot={match.awayTeam.pot} size="sm" />
        </div>
        <div className="text-left min-w-0">
          <p className="font-semibold text-white text-sm truncate">{match.awayTeam.name}</p>
          <p className="text-xs" style={{ color: "rgba(147,197,253,0.6)" }}>
            {getFlag(match.awayTeam.country.name)} {match.awayTeam.country.name}
          </p>
        </div>
      </div>
    </div>
  );
}
