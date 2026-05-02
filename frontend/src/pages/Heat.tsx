import { CollectorsPanel } from "../components/CollectorsPanel";
import type { HeatCollectorState } from "../types";
import { usePolling } from "../hooks/usePolling";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function HeatManagement() {
  const { t } = useAppContext();
  const { data: collectors, refetch } = usePolling<HeatCollectorState[]>(
    "/api/collectors",
    2000,
    [],
  );
  const { data: kpis } = usePolling<any[]>("/api/overview", 2000, []);
  const { data: saltMeltData } = usePolling<{ temperatureC: number }>("/api/salt-melt", 2000, { temperatureC: 201.5 });

  const stats = {
    heatRecycled: kpis.find((k: any) => k.title === "Daily Heat Recycled")?.value || "1,600",
    heatTrend: kpis.find((k: any) => k.title === "Daily Heat Recycled")?.trend || 12.5,
    utilization: kpis.find((k: any) => k.title === "Wind Curtailment Mgt")?.value || "90.0",
    utilTrend: kpis.find((k: any) => k.title === "Wind Curtailment Mgt")?.trend || 4.1,
    saltMelt: saltMeltData.temperatureC.toFixed(1)
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 mx-auto w-full max-w-[1440px]"
    >
      {/* Top Section: Joint Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
          <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Total Heat Recycled")}
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {stats.heatRecycled}{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              kWh
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ {stats.heatTrend.toFixed(1)} /1h
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
          <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Heat Utilization Rate")}
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {stats.utilization}{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              %
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ {stats.utilTrend.toFixed(1)}% /1h
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
          <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Salt Melt Heap")}
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {stats.saltMelt}{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              °C
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ 0.8 °C /1h
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 shadow-sm">
          <div className="text-emerald-500 text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Joint System Health")}
          </div>
          <div className="text-3xl font-bold text-white">
            99.2{" "}
            <span className="text-sm text-emerald-500/50 font-medium">
              %
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            OPTIMAL SYNERGY
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CollectorsPanel collectors={collectors} refetch={refetch} />
        </div>
        <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl p-6 flex flex-col">
            <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-6">
              {t("Joint Control Matrix")}
            </h3>
            <div className="space-y-4">
               {[
                 { label: "Battery Cluster Isolation", status: "Auto", active: true },
                 { label: "HVAC Duty Cycle Sync", status: "Active", active: true },
                 { label: "Salt Melt Diverter", status: "Manual", active: false },
                 { label: "Emergency Heat Vent", status: "Standby", active: false },
               ].map((ctrl) => (
                 <div key={ctrl.label} className="p-4 bg-[#121212] border border-[#2D2D2D] rounded-lg flex items-center justify-between">
                   <div>
                     <div className="text-xs font-bold text-white mb-1">{t(ctrl.label)}</div>
                     <div className="text-[10px] text-gray-500 font-bold uppercase">{t(ctrl.status)}</div>
                   </div>
                   <div className={cn("w-10 h-5 rounded-full relative transition-colors cursor-pointer", ctrl.active ? "bg-emerald-500" : "bg-gray-700")}>
                      <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", ctrl.active ? "right-1" : "left-1")} />
                   </div>
                 </div>
               ))}
            </div>
            <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
               <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">AI Optimization</div>
               <p className="text-[11px] text-gray-400 leading-relaxed">
                  Joint system is currently optimizing heat flow between Zone B and the Salt Melt Stack. Predicted savings: 1.4 MWh over next 4 hours.
               </p>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

