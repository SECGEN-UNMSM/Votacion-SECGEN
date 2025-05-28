import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AsambleistaProvider } from "@/context/AsambleistasContext";
import { CandidatoProvider } from "@/context/CandidatosContext";

const soraSans = Sora({style: "normal", subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Sistema de Votación | UNMSM",
  description: "Sistema de votación para la UNMSM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${soraSans.className}`}>
      <body>
        <AsambleistaProvider>
          <CandidatoProvider>
            { children }
          </CandidatoProvider>
        </AsambleistaProvider>
      </body>
    </html>
  );
}
