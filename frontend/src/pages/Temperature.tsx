import { useState } from "react";
import type { BatteryUnit } from "../types";
import {
  Search,
  RotateCcw,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAppContext } from "../contexts/AppContext";
import { usePolling } from "../hooks/usePolling";
import { toast } from "sonner";
import { motion } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";

export function TemperatureMonitoring() {
  const {
    data: batteries,
    setData: setBatteries,
    refetch,
  } = usePolling<BatteryUnit[]>("/api/batteries", 3000, []);
  const { t } = useAppContext();
  const [zoneFilter, setZoneFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBatteries = batteries.filter((bat) => {
    if (zoneFilter !== "All" && bat.zone !== zoneFilter) return false;
    if (statusFilter === "Normal" && bat.temperatureC > 35) return false;
    if (statusFilter === "Warning" && bat.temperatureC <= 35) return false;
    if (
      searchQuery &&
      !bat.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleRefresh = async () => {
    await refetch();
    toast.success(t("Matrix data refreshed"));
  };

  const getStatusColor = (temp: number) => {
    if (temp < 15) return "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)]";
    if (temp <= 25) return "border-emerald-500/50 bg-emerald-500/20 text-emerald-400";
    if (temp <= 35) return "border-amber-500/50 bg-amber-500/20 text-amber-400";
    return "border-red-500/50 bg-red-500/20 text-red-500";
  };

  return (
    <Tooltip.Provider delayDuration={100}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="p-6 lg:p-8 flex flex-col gap-6 mx-auto w-full max-w-[1440px]"
      >
        {/* Controls */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-base)]">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {t("Zone")}
              </span>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="bg-transparent text-sm font-semibold text-[var(--text-primary)] outline-none pr-4"
              >
                <option value="All">{t("All Zones")}</option>
                <option value="A">{t("Zone A")}</option>
                <option value="B">{t("Zone B")}</option>
                <option value="C">{t("Zone C")}</option>
                <option value="D">{t("Zone D")}</option>
                <option value="E">{t("Zone E")}</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-base)]">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {t("Status")}
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-semibold text-[var(--text-primary)] outline-none pr-4"
              >
                <option value="All">{t("All Statuses")}</option>
                <option value="Normal">{t("Normal")}</option>
                <option value="Warning">{t("Warning")}</option>
              </select>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID..."
                className="pl-9 pr-4 py-1.5 border border-[var(--border-subtle)] rounded-lg text-sm outline-none focus:border-[var(--accent-primary)] w-64 bg-[var(--bg-base)] transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--border-subtle)] transition-colors text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4" /> {t("Refresh")}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 items-start mt-6">
          {/* Battery List */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-visible relative z-10">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-card)] rounded-t-xl">
              <h3 className="font-semibold text-[var(--text-primary)]">
                {t("Realtime Thermal Monitor")}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {filteredBatteries.map((bat) => (
                  <Tooltip.Root key={bat.id}>
                    <Tooltip.Trigger asChild>
                      <div
                        className={cn(
                          "relative overflow-hidden border rounded-xl flex flex-col gap-2 cursor-pointer transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group h-24",
                          getStatusColor(bat.temperatureC)
                        )}
                      >
                        {/* SOC Indicator Bar (Bottom to top) */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-blue-500/20 transition-all duration-500 z-0" 
                          style={{ height: `${bat.soc}%` }} 
                        />
                        
                        <div className="relative z-10 flex flex-col items-center justify-center h-full p-2 text-center pointer-events-none">
                          <span className="text-2xl font-black tracking-tight drop-shadow-md">
                            {bat.temperatureC.toFixed(1)}°C
                          </span>
                          <span className="text-xs font-bold opacity-80 mt-1">
                            {Math.round(bat.soc)}%
                          </span>
                        </div>
                      </div>
                    </Tooltip.Trigger>
                    
                    <Tooltip.Portal>
                      <Tooltip.Content
                        sideOffset={5}
                        className="z-50 bg-[#121212] border border-[#2D2D2D] rounded-xl shadow-xl p-4 w-56 text-[#cfbcff] animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between border-b border-[#2D2D2D] pb-2">
                            <span className="font-bold text-white uppercase text-xs tracking-wider">Node {bat.id}</span>
                            <span className={cn(
                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                bat.temperatureC > 35 ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                              )}>
                              {bat.temperatureC > 35 ? t("Warning") : t("Normal")}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-semibold">{t("Temperature")}</span>
                              <span className={cn(
                                "text-sm font-bold",
                                bat.temperatureC > 35 ? "text-red-400" : "text-emerald-400"
                              )}>{bat.temperatureC.toFixed(2)}°C</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-semibold">{t("SOC")}</span>
                              <span className="text-sm font-bold text-blue-400">{bat.soc.toFixed(1)}%</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-semibold">{t("State")}</span>
                              <span className="text-sm font-bold text-gray-300 capitalize">{bat.status}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-semibold">{t("Zone")}</span>
                              <span className="text-sm font-bold text-gray-300">
                                {bat.zone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Tooltip.Arrow className="fill-[#2D2D2D]" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Tooltip.Provider>
  );
}
