import { Match } from "./api";

export function groupMatchesByDay(matches: Match[]): Record<number, Match[]> {
  return matches.reduce<Record<number, Match[]>>((acc, m) => {
    if (!acc[m.matchDay]) acc[m.matchDay] = [];
    acc[m.matchDay].push(m);
    return acc;
  }, {});
}
