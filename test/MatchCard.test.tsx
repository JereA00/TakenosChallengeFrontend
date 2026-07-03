import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MatchCard from "@/components/MatchCard";
import { Match } from "@/lib/api";

const match: Match = {
  id: "1",
  matchDay: 3,
  homeTeam: { id: 1, name: "Real Madrid", country: { id: 1, name: "Spain" } },
  awayTeam: { id: 2, name: "Bayern Munich", country: { id: 2, name: "Germany" } },
};

describe("MatchCard", () => {
  it("muestra el nombre del equipo local", () => {
    render(<MatchCard match={match} />);
    expect(screen.getByText("Real Madrid")).toBeInTheDocument();
  });

  it("muestra el nombre del equipo visitante", () => {
    render(<MatchCard match={match} />);
    expect(screen.getByText("Bayern Munich")).toBeInTheDocument();
  });

  it("muestra el número de jornada", () => {
    render(<MatchCard match={match} />);
    expect(screen.getByText(/J3/i)).toBeInTheDocument();
  });

  it("muestra el separador VS", () => {
    render(<MatchCard match={match} />);
    expect(screen.getByText("VS")).toBeInTheDocument();
  });
});
