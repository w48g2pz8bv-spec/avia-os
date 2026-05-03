"use client";
import { motion } from "framer-motion";
import AnalyticsCard from "./analytics-card";
import VoiceSimulator from "./voice-simulator";

export default function DashboardPreview() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-panel lg:col-span-2 rounded-[3rem] p-10"
          >
            <div className="flex gap-2 mb-8">
              <div className="h-2 w-2 rounded-full bg-red-500/50" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
              <div className="h-2 w-2 rounded-full bg-green-500/50" />
            </div>
            <h3 className="font-syne text-3xl font-bold text-white mb-8">System Analytics</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <AnalyticsCard title="Neural Reach" value="1.2M+" />
              <AnalyticsCard title="Conversion" value="24.8%" />
            </div>
          </motion.div>
          <VoiceSimulator />
        </div>
      </div>
    </section>
  );
}