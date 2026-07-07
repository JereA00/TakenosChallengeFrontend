"use client";

import { Team } from "@/lib/api";
import { MESSAGES } from "@/lib/messages";

interface Props {
  teams: Team[];
  teamId?: number;
  matchDay?: number;
  location?: "home" | "away";
  countryName?: string;
  onTeamChange: (teamId?: number) => void;
  onMatchDayChange: (matchDay?: number) => void;
  onLocationChange: (location?: "home" | "away") => void;
  onCountryChange: (country?: string) => void;
  onReset: () => void;
}

const selectStyle: React.CSSProperties = {
  height: 36,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 8,
  color: "white",
  fontSize: 13,
  padding: "0 10px",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2393c5fd' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: 30,
  cursor: "pointer",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(147,197,253,0.6)",
  marginBottom: 6,
  display: "block",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export default function MatchFilters({
  teams, teamId, matchDay, location, countryName,
  onTeamChange, onMatchDayChange, onLocationChange, onCountryChange, onReset,
}: Props) {
  const countries = Array.from(new Set(teams.map((t) => t.country.name))).sort();
  const filteredTeams = countryName ? teams.filter((t) => t.country.name === countryName) : teams;

  return (
    <div className="rounded-xl p-4" style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex flex-wrap gap-4 items-end">

        <div className="flex flex-col" style={{ minWidth: 160 }}>
          <label style={labelStyle}>{MESSAGES.filters.countryLabel}</label>
          <select
            aria-label={MESSAGES.filters.countryAriaLabel}
            value={countryName ?? ""}
            onChange={(e) => onCountryChange(e.target.value || undefined)}
            disabled={!!teamId}
            style={{ ...selectStyle, opacity: teamId ? 0.4 : 1, minWidth: 160 }}
          >
            <option value="" style={{ background: "#0d1e3a" }}>{MESSAGES.filters.allCountries}</option>
            {countries.map((c) => (
              <option key={c} value={c} style={{ background: "#0d1e3a" }}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col" style={{ minWidth: 190 }}>
          <label style={labelStyle}>{MESSAGES.filters.teamLabel}</label>
          <select
            aria-label={MESSAGES.filters.teamAriaLabel}
            value={teamId ? String(teamId) : ""}
            onChange={(e) => onTeamChange(e.target.value ? Number(e.target.value) : undefined)}
            style={{ ...selectStyle, minWidth: 190 }}
          >
            <option value="" style={{ background: "#0d1e3a" }}>{MESSAGES.filters.allTeams}</option>
            {filteredTeams.map((team) => (
              <option key={team.id} value={String(team.id)} style={{ background: "#0d1e3a" }}>{team.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label style={labelStyle}>{MESSAGES.filters.matchdayLabel}</label>
          <select
            aria-label={MESSAGES.filters.matchdayAriaLabel}
            value={matchDay ? String(matchDay) : ""}
            onChange={(e) => onMatchDayChange(e.target.value ? Number(e.target.value) : undefined)}
            style={{ ...selectStyle, minWidth: 140 }}
          >
            <option value="" style={{ background: "#0d1e3a" }}>{MESSAGES.filters.allMatchdays}</option>
            {[1,2,3,4,5,6,7,8].map((day) => (
              <option key={day} value={String(day)} style={{ background: "#0d1e3a" }}>{MESSAGES.filters.matchdayOption(day)}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label style={labelStyle}>{MESSAGES.filters.locationLabel}</label>
          <select
            aria-label={MESSAGES.filters.locationAriaLabel}
            value={location ?? ""}
            onChange={(e) => onLocationChange(e.target.value ? (e.target.value as "home" | "away") : undefined)}
            disabled={!teamId}
            style={{ ...selectStyle, minWidth: 140, opacity: !teamId ? 0.4 : 1 }}
          >
            <option value="" style={{ background: "#0d1e3a" }}>{MESSAGES.filters.allLocations}</option>
            <option value="home" style={{ background: "#0d1e3a" }}>{MESSAGES.filters.homeOption}</option>
            <option value="away" style={{ background: "#0d1e3a" }}>{MESSAGES.filters.awayOption}</option>
          </select>
        </div>

        <button
          onClick={onReset}
          style={{
            height: 36, padding: "0 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            color: "white", cursor: "pointer", transition: "opacity 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {MESSAGES.filters.clearButton}
        </button>
      </div>
    </div>
  );
}
