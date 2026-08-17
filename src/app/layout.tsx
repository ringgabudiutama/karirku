import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/ToasterProvider";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KarirKu — Temukan Karier Impianmu",
  description:
    "Platform lowongan kerja terpercaya. Temukan ribuan lowongan dari perusahaan terverifikasi, atau pasang lowongan perusahaanmu di KarirKu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
