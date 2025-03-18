"use client"; // Client component

import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function ClientThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
