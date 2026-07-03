import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MatchFilters from "@/components/MatchFilters";
import { Team } from "@/lib/api";

const teams: Team[] = [
  { id: 1, name: "Real Madrid", country: { id: 1, name: "Spain" } },
  { id: 2, name: "Barcelona", country: { id: 1, name: "Spain" } },
  { id: 3, name: "Bayern Munich", country: { id: 2, name: "Germany" } },
];

const defaultProps = {
  teams,
  teamId: undefined,
  matchDay: undefined,
  location: undefined,
  countryName: undefined,
  onTeamChange: vi.fn(),
  onMatchDayChange: vi.fn(),
  onLocationChange: vi.fn(),
  onCountryChange: vi.fn(),
  onReset: vi.fn(),
};

describe("MatchFilters", () => {
  it("renderiza los selectores de país, equipo, jornada y local/visitante", () => {
    render(<MatchFilters {...defaultProps} />);
    expect(screen.getByText("Todos los países")).toBeInTheDocument();
    expect(screen.getByText("Todos los equipos")).toBeInTheDocument();
    expect(screen.getByText("Todas")).toBeInTheDocument();
    expect(screen.getByText("Todos")).toBeInTheDocument();
  });

  it("muestra todos los países sin duplicados", () => {
    render(<MatchFilters {...defaultProps} />);
    expect(screen.getByText("Spain")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
    // Spain aparece una sola vez en el dropdown de países
    expect(screen.getAllByText("Spain")).toHaveLength(1);
  });

  it("llama a onCountryChange con el país seleccionado", async () => {
    const onCountryChange = vi.fn();
    render(<MatchFilters {...defaultProps} onCountryChange={onCountryChange} />);
    const select = screen.getByText("Todos los países").closest("select")!;
    await userEvent.selectOptions(select, "Spain");
    expect(onCountryChange).toHaveBeenCalledWith("Spain");
  });

  it("llama a onCountryChange con undefined al seleccionar 'Todos los países'", async () => {
    const onCountryChange = vi.fn();
    render(<MatchFilters {...defaultProps} countryName="Spain" onCountryChange={onCountryChange} />);
    const select = screen.getByDisplayValue("Spain").closest("select")!;
    await userEvent.selectOptions(select, "");
    expect(onCountryChange).toHaveBeenCalledWith(undefined);
  });

  it("filtra los equipos cuando hay un país seleccionado", () => {
    render(<MatchFilters {...defaultProps} countryName="Spain" />);
    expect(screen.getByText("Real Madrid")).toBeInTheDocument();
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
    expect(screen.queryByText("Bayern Munich")).not.toBeInTheDocument();
  });

  it("el selector local/visitante está deshabilitado sin equipo seleccionado", () => {
    render(<MatchFilters {...defaultProps} />);
    const locationSelect = screen.getByText("Todos").closest("select")!;
    expect(locationSelect).toBeDisabled();
  });

  it("el selector local/visitante está habilitado con equipo seleccionado", () => {
    render(<MatchFilters {...defaultProps} teamId={1} />);
    const locationSelect = screen.getByText("Todos").closest("select")!;
    expect(locationSelect).not.toBeDisabled();
  });

  it("llama a onReset al hacer click en Limpiar filtros", async () => {
    const onReset = vi.fn();
    render(<MatchFilters {...defaultProps} onReset={onReset} />);
    await userEvent.click(screen.getByText("Limpiar filtros"));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
