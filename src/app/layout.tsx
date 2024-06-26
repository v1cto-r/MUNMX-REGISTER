import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Registro de Delegados",
  description: "Registro de delegados de MUNMX 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/Basic-MUNMX.ico" />
        <link rel="shortcut" href="/Basic-MUNMX.ico" />
      </head>
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
