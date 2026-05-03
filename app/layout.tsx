import Sidebar from "@/components/sidebar/sidebar";
import "./globals.css";
import { Syne, Outfit } from "next/font/google";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["800"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["400"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${syne.variable} ${outfit.variable} bg-[#050506]`}>
        <Sidebar />
        {/* h-screen yerine min-h-screen kullanarak kaydırmayı aktif ettik */}
        <div className="ml-[260px] min-h-screen flex flex-col relative">
          <header className="h-20 w-full flex items-center justify-end px-10 sticky top-0 z-50 bg-[#050506]/80 backdrop-blur-md">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#00ffd1]/10 rounded-full border border-[#00ffd1]/20">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00ffd1] animate-pulse" />
              <span className="text-[8px] font-mono text-[#00ffd1] uppercase tracking-widest font-black">System_Active</span>
            </div>
          </header>
          {/* İçerik alanı artık aşağı doğru özgürce uzayabilir */}
          <main className="flex-1 p-10 max-w-[1400px] mx-auto w-full overflow-visible">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
