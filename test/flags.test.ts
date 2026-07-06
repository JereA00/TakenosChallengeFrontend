import { describe, it, expect } from "vitest";
import { getFlag, COUNTRY_FLAGS } from "@/lib/flags";

describe("getFlag", () => {
  it("devuelve la bandera correcta para países conocidos", () => {
    expect(getFlag("Spain")).toBe("🇪🇸");
    expect(getFlag("England")).toBe("🏴󠁧󠁢󠁥󠁮󠁧󠁿");
    expect(getFlag("Germany")).toBe("🇩🇪");
  });

  it("devuelve 🌍 para países desconocidos", () => {
    expect(getFlag("Narnia")).toBe("🌍");
    expect(getFlag("")).toBe("🌍");
  });

  it("cubre todos los países del mapa COUNTRY_FLAGS", () => {
    for (const country of Object.keys(COUNTRY_FLAGS)) {
      expect(getFlag(country)).toBe(COUNTRY_FLAGS[country]);
    }
  });
});
