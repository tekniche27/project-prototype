import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PointsProvider } from "@/context/PointsContext";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GuessIT",
  description: "quiz game related to IT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PointsProvider>
        <Navbar />
        {children}
        </PointsProvider>
      </body>
    </html>
    </SessionProvider>
  );
}
