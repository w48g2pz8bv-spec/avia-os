import type { Metadata } from "next";
import "./globals.css";
import { Syne, Outfit } from "next/font/google";
import { ToastProvider } from "@/lib/toast-context";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "500", "700", "800"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "AIVA // Neural Intelligence OS",
  description: "İşletmenizin yeni dijital sinir sistemi. Yapay zeka ile otomatik büyüme, yönetim ve optimizasyon.",
  openGraph: {
    title: "AIVA // Neural Intelligence OS",
    description: "Yapay zeka ile işletmenizi geleceğe taşıyın.",
    url: "https://aiva-neural.io",
    siteName: "AIVA",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIVA // Neural Intelligence OS",
    description: "İşletmenizin yeni dijital sinir sistemi.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${syne.variable} ${outfit.variable} font-outfit bg-[#050506] text-white antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}


