import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Tessera — Fraud Analyst",
  description: "AI-powered fraud review dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
