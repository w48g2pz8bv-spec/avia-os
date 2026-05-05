import { AppProvider } from "./app-context";
import Sidebar from "@/components/sidebar/sidebar";
import NeuralCommandBar from "@/components/shared/neural-command-bar";
import NeuralInsight from "@/components/shared/neural-insight";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-[#050506] text-white selection:bg-[#00ffd1]/30">
        <NeuralCommandBar />
        <NeuralInsight />
        <Sidebar />
        <main className="ml-[240px] flex-1 p-10 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
