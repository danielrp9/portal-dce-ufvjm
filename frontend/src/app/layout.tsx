import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-plus-jakarta'
});

const syne = Syne({
  subsets: ["latin"],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "Portal DCE UFVJM",
  description: "Portal Institucional e de Notícias do DCE UFVJM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${plusJakarta.variable} ${syne.variable}`}>
      <body className={`${plusJakarta.className} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}