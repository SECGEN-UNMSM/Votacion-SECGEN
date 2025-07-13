import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { redirect } from "next/navigation";
import AboutPage from "../../app/about/page";

/* Hooks */

jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => {},
}));

/* Componentes */

jest.mock("@/components/ToggleDarkMode", () => ({
  ToggleDarkMode: () => <div data-testid="toggle-dark-mode" />,
}));

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  redirect: jest.fn(),
}));

describe("AboutPage", () => {
  it("Debería de renderizar la página de About", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { name: /acerca de nosotros/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /nosotros/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /votación/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reportes/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cerrar sesión/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /sobre el sistema de votación/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /equipo de desarrollo/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /objetivo del sistema/i })
    ).toBeInTheDocument();
  });

  it("Debería de redirigir si presiona en votación", () => {
    render(<AboutPage />);
    const button = screen.getByRole("button", { name: /votación/i });
    fireEvent.click(button);
    expect(redirect).toHaveBeenCalledWith("/home");
  });

  it("Debería de redirigir si presiona en reportes", () => {
    render(<AboutPage />);
    const button = screen.getByRole("button", { name: /reportes/i });
    fireEvent.click(button);
    expect(redirect).toHaveBeenCalledWith("/reportes");
  });

  it("Debería de redirigir si presiona en cerrar sesión", () => {
    render(<AboutPage />);
    const button = screen.getByRole("button", { name: /cerrar sesión/i });
    fireEvent.click(button);
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
