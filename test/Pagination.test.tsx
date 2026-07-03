import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "@/components/Pagination";

describe("Pagination", () => {
  it("no renderiza nada cuando hay una sola página", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("no renderiza nada cuando totalPages es 0", () => {
    const { container } = render(
      <Pagination page={1} totalPages={0} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("muestra los botones anterior y siguiente con múltiples páginas", () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByText(/anterior/i)).toBeInTheDocument();
    expect(screen.getByText(/siguiente/i)).toBeInTheDocument();
  });

  it("desactiva el botón anterior en la primera página", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByText(/anterior/i).closest("button")).toBeDisabled();
  });

  it("desactiva el botón siguiente en la última página", () => {
    render(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByText(/siguiente/i).closest("button")).toBeDisabled();
  });

  it("llama a onPageChange con la página siguiente al hacer click en siguiente", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByText(/siguiente/i));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("llama a onPageChange con la página anterior al hacer click en anterior", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByText(/anterior/i));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("muestra la página actual y el total", () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByText(/2.*5|Página 2/i)).toBeInTheDocument();
  });
});
