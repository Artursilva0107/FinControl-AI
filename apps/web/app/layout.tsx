import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "FinControl AI", description: "Gestão financeira empresarial" };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
