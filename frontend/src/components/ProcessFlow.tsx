import { cn } from "../lib/utils";
import { Thermometer, Zap, Wind, Play, Square, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../contexts/AppContext";
import React, { useEffect, useState } from "react";
import { usePolling } from "../hooks/usePolling";
import type { BatteryUnit } from "../types";

export function ProcessFlow() {
  const { t } = useAppContext();
  const { data: batteries } = usePolling<BatteryUnit[]>("/api/batteries", 2000, []);
  const { data: collectors, setData: setCollectors } = usePolling<any[]>("/api/collectors", 2000, []);
  const { data: saltMeltData } = usePolling<{ temperatureC: number }>("/api/salt-melt", 2000, { temperatureC: 201.5 });
  const { data: synergyConfig, setData: setSynergy } = usePolling<{ masterSynergyEnabled: boolean }>("/api/master-synergy", 2000, { masterSynergyEnabled: false });

  const zones = ["A", "B", "C", "D", "E"];
  
  // Determine synergy state (e.g., from collector state)
  const isMasterSynergyEnabled = synergyConfig.masterSynergyEnabled;
  const saltMeltTemp = saltMeltData.temperatureC;

  const zoneTemps = zones.reduce((acc, zone) => {
    const bts = batteries.filter(b => b.zone === zone);
    const avg = bts.length > 0 ? bts.reduce((sum, b) => sum + b.temperatureC, 0) / bts.length : 20;
    acc[zone] = avg;
    return acc;
  }, {} as Record<string, number>);

  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const toggleMasterSynergy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const resp = await fetch("/api/master-synergy", { method: 'POST' });
      const data = await resp.json();
      setSynergy(data);
    } catch (err) {}
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl col-span-12 lg:col-span-8 p-6 flex flex-col justify-center min-h-[400px] overflow-visible">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          {t("Active Heat Flow Matrix")}
        </h3>
        <button 
          onClick={toggleMasterSynergy}
          className="flex items-center gap-2 px-3 py-1 bg-[#121212] border border-[#2D2D2D] rounded-full text-xs font-semibold hover:border-gray-500 transition-colors"
        >
          <span className={cn("status-dot", isMasterSynergyEnabled ? "online" : "offline")} />
          <span className={isMasterSynergyEnabled ? "text-emerald-400" : "text-gray-500"}>
            {isMasterSynergyEnabled ? t("Synergy Running") : t("Synergy Standby")}
          </span>
        </button>
      </div>

      <div className="flex items-stretch justify-between gap-6 w-full max-w-5xl mx-auto flex-1">
        
        {/* Sources and Flows (Multiple rows) */}
        <div className="flex flex-col gap-3 flex-1 justify-center">
          {zones.map((zone, i) => {
             const zoneCollector = collectors.find(c => c.type === "forced_air" && c.zone === zone);
             const active = zoneCollector?.state === "COLLECTING";
             const isExpanded = expandedZone === zone;

             const toggleZoneCollector = async (e: React.MouseEvent) => {
               e.stopPropagation();
               if (!zoneCollector) return;
               try {
                 await fetch(`/api/collectors/${zoneCollector.id}/control`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ action: 'toggle' })
                 });
               } catch (err) {}
             };

             return (
              <div key={zone} className="flex flex-col gap-2 relative">
                <div className="flex items-center gap-4 w-full h-14 relative z-10">
                  {/* Source Node */}
                  <div className="flex shrink-0 w-24 h-full rounded-xl border border-[#2D2D2D] bg-[#0A0A0A] flex-col items-center justify-center relative shadow-md">
                    <span className={cn("font-bold text-md tracking-tight mb-0.5 transition-colors", active ? "text-white" : "text-amber-400")}>
                      {zoneTemps[zone].toFixed(1)}°C
                    </span>
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">
                      {t("Zone")} {zone}
                    </span>
                  </div>

                  {/* Transfer Path */}
                  <div className="flex-1 flex items-center min-w-[50px]">
                    <FlowLine active={active} color="success" delay={i * 0.2} />
                  </div>

                  {/* Intermediate Block (Synergy) */}
                  <div 
                    onClick={() => setExpandedZone(isExpanded ? null : zone)}
                    className={cn(
                      "group border rounded-lg px-2 flex flex-col items-center justify-center w-36 h-full transition-all shadow-sm cursor-pointer hover:border-gray-500",
                      active ? "bg-[#0A0A0A] border-emerald-500/30" : "bg-[#1E1E1E] border-[#2D2D2D]"
                    )}
                  >
                    <div className="flex items-center justify-center">
                      <Wind className={cn("w-4 h-4 mr-1 transition-colors", active ? "text-emerald-400" : "text-gray-600")} />
                      <span className={cn("text-[10px] font-bold text-center leading-tight transition-colors line-clamp-2", active ? "text-white" : "text-gray-500")}>
                        {t("Air Cooling Compression Synergy")}
                      </span>
                    </div>
                  </div>
                  
                  {/* Output Flow */}
                  <div className="flex-1 flex items-center min-w-[30px]">
                    <FlowLine active={active} color="success" delay={i * 0.2 + 0.3} />
                  </div>
                </div>

                {/* Expandable Control Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="absolute top-14 right-6 left-28 z-20 overflow-hidden"
                    >
                      <div className="mt-2 bg-[#121212] border border-[#3D3D3D] rounded-lg p-3 shadow-xl flex items-center justify-between mx-auto w-[240px]">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Control Panel</span>
                          <span className="text-xs text-white">Zone {zone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <button className="p-1.5 bg-[#1E1E1E] border border-[#2D2D2D] rounded hover:bg-[#2D2D2D] transition-colors" title="Settings">
                             <Settings2 className="w-4 h-4 text-gray-400" />
                           </button>
                           <button 
                             onClick={(e) => toggleZoneCollector(e)}
                             className={cn("px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-bold uppercase transition-colors", 
                               active ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20")}
                           >
                             {active ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                             {active ? t("Stop") : t("Start")}
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
             );
          })}
        </div>

        {/* Destination - Salt Melt Heap (Spans all rows) */}
        <div className="flex flex-col justify-center shrink-0 w-36 ml-4">
          <div className="w-full h-[60%] min-h-[160px] rounded-xl border border-[#1976D2]/30 bg-[#0A0A0A] flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(25,118,210,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1976D2]/10 to-transparent"></div>
            <Thermometer className="text-[#1976D2] h-6 w-6 mb-2 relative z-10 transition-colors" />
            <span className={cn("font-black text-2xl tracking-tighter relative z-10 transition-colors", saltMeltTemp < 190 ? "text-blue-200" : "text-white")}>
              {saltMeltTemp.toFixed(1)}°C
            </span>
            <div className="flex items-center gap-1 mt-2 text-[#cfbcff] relative z-10 border-t border-[#1976D2]/20 pt-2 px-4">
              <Zap className="w-3 h-3" />
              <span className="text-xs font-bold">14.2 MWh</span>
            </div>
            <div className="absolute bottom-4 whitespace-nowrap text-[10px] font-semibold text-[#1976D2] uppercase tracking-wider">
              {t("Salt Melt Heap")}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function FlowLine({
  active,
  color,
  delay = 0,
}: {
  active?: boolean;
  color: "primary" | "warning" | "success";
  delay?: number;
}) {
  const colorMap = {
    primary: "bg-[#1976D2]/30",
    warning: "bg-amber-500/30",
    success: "bg-emerald-500/30",
  };

  const particleColorMap = {
    primary: "bg-[#1976D2]",
    warning: "bg-amber-400",
    success: "bg-emerald-400",
  };

  return (
    <div className={cn("h-[2px] w-full relative overflow-hidden", colorMap[color])}>
      {active && (
        <motion.div
          className={cn("w-12 h-full absolute left-0 top-0 opacity-80", particleColorMap[color])}
          animate={{ left: ["-100%", "200%"] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        />
      )}
    </div>
  );
}
