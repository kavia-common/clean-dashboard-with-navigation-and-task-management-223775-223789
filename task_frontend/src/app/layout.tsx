import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retro Task Dashboard",
  description: "A retro-themed task dashboard with auth, CRUD, and realtime updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
