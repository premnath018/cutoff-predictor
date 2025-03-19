import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "TNEA Counselling College Predictor 2025 | Find the Best Engineering Colleges in Tamil Nadu",
  description:
    "Predict your chances of admission in TNEA counselling 2025. Find the top engineering colleges and departments based on your 12th cutoff score. Get accurate cutoff predictions and explore the best colleges in Tamil Nadu.",
  keywords:
    "TNEA, counselling, cutoff predictor, college predictor, engineering admission, Tamil Nadu engineering, TNEA 2025, college admission, cutoff scores, engineering colleges, 12th cutoff Tamil Nadu, best college cutoff, top engineering colleges, Tamil Nadu cutoff marks, engineering rank predictor, Anna University cutoff, government college cutoff, private college admission, category-wise cutoff, branch-wise cutoff",
  openGraph: {
    title: "TNEA Counselling College Predictor 2025 | Cutoff College Predictor",
    description:
      "Find your perfect engineering college in Tamil Nadu based on your 12th cutoff score. Get accurate cutoff predictions for TNEA counselling 2025 and explore top colleges.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" }, // Default favicon
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
