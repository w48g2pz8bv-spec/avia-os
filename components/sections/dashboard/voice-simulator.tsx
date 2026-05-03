 "use client";
import { Mic } from "lucide-react";
import VapiWaveform from "@/components/ui/vapi-waveform";

export default function VoiceSimulator() {
  return (
    <div className="glass-panel rounded-[2rem] p-8 border border-white/5 relative overflow-hidden h-full flex flex-col justify-between">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-10 w-10 rounded-full bg-[#00ffd1]/10 flex items-center justify-center">
          <Mic className="h-5 w-5 text-[#00ffd1]" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">AIVA Voice Agent</h4>
          <p className="text-[10px] text-white/30 font-mono tracking-tighter">STATUS: LISTENING...</p>
        </div>
      </div>

      <div className="py-4">
        <VapiWaveform />
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">Neural Link Established</span>
      </div>
    </div>
  );
}