const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Team {
  id: number;
  name: string;
  country: { id: number; name: string };
  pot?: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  matchDay: number;
}

export interface MatchesResponse {
  matches: Match[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MatchFilters {
  teamId?: number;
  matchDay?: number;
  page?: number;
  limit?: number;
  location?: "home" | "away";
  countryName?: string;
}

export interface Pot {
  id: number;
  teams: Team[];
}

export interface Draw {
  id: number;
  createdAt: string;
  pots: Pot[];
}

export interface DrawStatistics {
  drawId: number;
  createdAt: string;
  totalMatches: number;
  matchesPerMatchDay: Record<number, number>;
  matchesPerPot: Record<number, number>;
  teamsPerPot: Record<number, number>;
}

function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10_000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function getMatches(filters: MatchFilters = {}): Promise<MatchesResponse> {
  const params = new URLSearchParams();
  if (filters.teamId)     params.set("teamId",      String(filters.teamId));
  if (filters.matchDay)   params.set("matchDay",    String(filters.matchDay));
  if (filters.page)       params.set("page",        String(filters.page));
  if (filters.limit)      params.set("limit",       String(filters.limit));
  if (filters.location)   params.set("location",    filters.location);
  if (filters.countryName) params.set("countryName", filters.countryName);

  const res = await fetchWithTimeout(`${API_URL}/matches?${params}`);
  if (!res.ok) throw new Error("Error al cargar los partidos");
  return res.json();
}

export async function getTeams(): Promise<Team[]> {
  const res = await fetchWithTimeout(`${API_URL}/teams`);
  if (!res.ok) throw new Error("Error al cargar los equipos");
  return res.json();
}

export async function getTeamById(id: number): Promise<{ team: Team; matches: Match[] }> {
  const res = await fetchWithTimeout(`${API_URL}/teams/${id}`);
  if (!res.ok) throw new Error("Equipo no encontrado");
  return res.json();
}

export async function getDraw(): Promise<Draw | null> {
  const res = await fetchWithTimeout(`${API_URL}/draw`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al cargar el sorteo");
  return res.json();
}

export async function createDraw(): Promise<void> {
  const res = await fetchWithTimeout(`${API_URL}/draw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 409) throw new Error("Ya existe un sorteo activo");
  if (!res.ok) throw new Error("Error al crear el sorteo");
}

export async function deleteDraw(): Promise<void> {
  const res = await fetchWithTimeout(`${API_URL}/draw`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 404) throw new Error("No existe un sorteo para eliminar");
  if (!res.ok) throw new Error("Error al eliminar el sorteo");
}

export async function getDrawStatistics(): Promise<DrawStatistics | null> {
  const res = await fetchWithTimeout(`${API_URL}/draw/statistics`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al cargar estadísticas");
  return res.json();
}
