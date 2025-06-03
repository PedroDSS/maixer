import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./animations.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maixer - Recettes personnalisées générées par IA",
  description: "Générez des recettes personnalisées avec analyse nutritionnelle complète grâce à l'intelligence artificielle.",
  keywords: ["recettes", "cuisine", "IA", "nutrition", "personnalisé"],
  authors: [{ name: "Maixer Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-amber-50`}
      >
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div 
            className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/3 w-96 h-96 bg-orange-300 opacity-20 rounded-full blur-3xl animate-blob"
          />
          <div 
            className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/3 w-96 h-96 bg-amber-300 opacity-20 rounded-full blur-3xl animate-blob animation-delay-2000"
          />
          <div 
            className="absolute top-1/3 left-1/3 w-80 h-80 bg-orange-200 opacity-20 rounded-full blur-3xl animate-blob animation-delay-4000"
          />
        </div>
        <Providers>
          <main className="flex-1 relative z-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
