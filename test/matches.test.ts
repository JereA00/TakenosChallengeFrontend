import { describe, it, expect } from "vitest";
import { groupMatchesByDay } from "@/lib/matches";
import { Match } from "@/lib/api";

const makeMatch = (id: string, matchDay: number): Match => ({
  id,
  matchDay,
  homeTeam: { id: 1, name: "Team A", country: { id: 1, name: "Spain" } },
  awayTeam: { id: 2, name: "Team B", country: { id: 2, name: "England" } },
});

describe("groupMatchesByDay", () => {
  it("agrupa correctamente partidos de distintas jornadas", () => {
    const matches = [makeMatch("1", 1), makeMatch("2", 2), makeMatch("3", 1)];
    const result = groupMatchesByDay(matches);
    expect(result[1]).toHaveLength(2);
    expect(result[2]).toHaveLength(1);
  });

  it("devuelve objeto vacío con array vacío", () => {
    expect(groupMatchesByDay([])).toEqual({});
  });

  it("agrupa todos los partidos en la misma jornada si coinciden", () => {
    const matches = [makeMatch("1", 3), makeMatch("2", 3)];
    const result = groupMatchesByDay(matches);
    expect(Object.keys(result)).toHaveLength(1);
    expect(result[3]).toHaveLength(2);
  });

  it("preserva los datos del partido dentro del grupo", () => {
    const match = makeMatch("42", 5);
    const result = groupMatchesByDay([match]);
    expect(result[5][0].id).toBe("42");
  });
});
