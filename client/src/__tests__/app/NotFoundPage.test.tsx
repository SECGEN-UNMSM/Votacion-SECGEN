import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { redirect } from "next/navigation";
import NotFound from "../../app/not-found";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  redirect: jest.fn(),
}));

describe("NotFoundPage", () => {
  it("Debería de renderizar la página de not-found", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: /página no encontrada/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/lo sentimos, la página que buscas no existe./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /volver al inicio/i })
    ).toBeInTheDocument();
  });

  it("Debería de redirigir si presiona en volver", () => {
    render(<NotFound />);
    const button = screen.getByRole("button", { name: /volver al inicio/i });
    fireEvent.click(button);
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
