import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../../app/page";
import "@testing-library/jest-dom";
import { redirect } from "next/navigation";

/* Hooks */

jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => {},
}));

/* Componentes */

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/ToggleDarkMode", () => ({
  ToggleDarkMode: () => <div data-testid="toggle-dark-mode" />,
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("LoginPage", () => {
  it("Debería renderizar el formulario de login correctamente", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: /sistema de votación/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar/i })
    ).toBeInTheDocument();
  });

  it("Debería de mostrar mensajes de campos de entrada requeridos", async () => {
    render(<LoginPage />);

    const submit = screen.getByRole("button", { name: /iniciar/i });
    fireEvent.click(submit);

    expect(
      await screen.findByText(/el nombre de usuario es requerido./i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/la contraseña es requerida./i)
    ).toBeInTheDocument();
  });

  it("Debería redirigir si las credenciales son correctas", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "admin" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar/i }));

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/about");
    });
  });
});
