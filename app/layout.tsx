import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

import prisma from "@/lib/prisma";
import PixelManager from "@/components/portfolio/PixelManager";
import WhatsAppWidget from "@/components/portfolio/WhatsAppWidget";

export const metadata: Metadata = {
  title: "Portfolio - Luiz Boss",
  description: "Portfolio moderno de desenvolvedor full stack",
};

import { Suspense } from "react";
import AnalyticsTracker from "@/components/portfolio/AnalyticsTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pixels = await prisma.pixel.findMany({
    where: { status: true }
  });

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" }
  });

  const whatsappNumber = settings?.whatsappNumber || "5511999999999";
  const whatsappMessage = settings?.whatsappMessage || "Olá Luiz, vi seu portfólio e gostaria de saber mais!";

  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${syne.variable}`} suppressHydrationWarning>
      <head>
        <PixelManager pixels={pixels} />
      </head>
      <body className="font-sans">
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
        <WhatsAppWidget number={whatsappNumber} message={whatsappMessage} />
      </body>
    </html>
  );
}
