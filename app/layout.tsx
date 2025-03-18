import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import ClientThemeWrapper from "@/components/client-theme-wrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      {/* Static defaults for SSR */}
      <body className={inter.className}>
        <ClientThemeWrapper>{children}</ClientThemeWrapper>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};