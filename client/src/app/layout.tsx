import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AppInitWrapper } from "@/components/AppInitWrapper";

//const soraSans = Sora({style: "normal", subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Sistema de Votación | UNMSM",
  description: "Sistema de votación para la UNMSM",
};

const interSans = Sora({ style: "normal", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${interSans.className}`}>
      <body>
        <AppInitWrapper>
          {children}
        </AppInitWrapper>
      </body>
    </html>
  );
}
