import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMatches } from "@/lib/api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const mockResponse = (data: object) =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response);

const emptyMatchesResponse = {
  matches: [],
  pagination: { page: 1, limit: 18, total: 0, totalPages: 0 },
};

beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockReturnValue(mockResponse(emptyMatchesResponse));
});

describe("getMatches", () => {
  it("llama a /matches sin parámetros cuando no hay filtros", async () => {
    await getMatches();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/matches");
    expect(url).not.toContain("teamId");
    expect(url).not.toContain("matchDay");
  });

  it("incluye teamId en los query params cuando se especifica", async () => {
    await getMatches({ teamId: 5 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("teamId=5");
  });

  it("incluye matchDay en los query params cuando se especifica", async () => {
    await getMatches({ matchDay: 3 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("matchDay=3");
  });

  it("incluye location en los query params cuando se especifica", async () => {
    await getMatches({ teamId: 1, location: "home" });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("location=home");
  });

  it("incluye countryName en los query params cuando se especifica", async () => {
    await getMatches({ countryName: "Spain" });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("countryName=Spain");
  });

  it("combina múltiples filtros correctamente", async () => {
    await getMatches({ teamId: 2, matchDay: 4, location: "away", page: 2, limit: 18 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("teamId=2");
    expect(url).toContain("matchDay=4");
    expect(url).toContain("location=away");
    expect(url).toContain("page=2");
    expect(url).toContain("limit=18");
  });

  it("lanza error cuando la respuesta no es ok", async () => {
    mockFetch.mockReturnValue(
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) } as Response)
    );
    await expect(getMatches()).rejects.toThrow("Error al cargar los partidos");
  });
});
