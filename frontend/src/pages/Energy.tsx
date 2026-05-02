import { EnergyChart } from "../components/EnergyChart";
import { Download, Zap, TrendingDown, Leaf } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "motion/react";
import { usePolling } from "../hooks/usePolling";

export function EnergyManagement() {
  const { t } = useAppContext();
  const { data: estats } = usePolling<any>("/api/energy-stats", 2000, {
      windPower: 96000, windTrend: 5.2, totalLoad: 70000, loadTrend: 2.1,
      excessPower: 26000, excessTrend: -1.5, batteryHeat: 2100, windCurtailment: 1200,
      compressorLoad: 700, hvacLoad: 1680, storageTransferred: 1850, systemLoss: 320
  });

  const handleExport = () => {
    const headers = ["Time", "Recycled Q", "Heat Loss", "Storage Lv"];
    const rows = Array.from({ length: 24 }).map((_, i) => {
      const time = `${i.toString().padStart(2, "0")}:00`;
      const recycled = (50 + Math.random() * 80 + (i > 10 && i < 16 ? 100 : 0)).toFixed(1);
      const loss = (10 + Math.random() * 15).toFixed(1);
      const storage = (40 + i * 2 + Math.random() * 10).toFixed(1);
      return [time, recycled, loss, storage].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "energy_dist_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(t("Report downloaded successfully") + " (energy_dist_2026.csv)");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 mx-auto w-full max-w-[1440px]"
    >
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg text-sm font-semibold outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)]">
            <option>{t("Today")}</option>
            <option>{t("This Week")}</option>
            <option>{t("This Month")}</option>
          </select>
          <select className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg text-sm font-semibold outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)]">
            <option>{t("All Regions")}</option>
            <option>{t("Region A")}</option>
            <option>{t("Region B")}</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <Download className="w-4 h-4" /> {t("Export Report")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-md shadow-black/5"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest">
              {t("Wind Power generation")}
            </div>
            <Leaf className="w-5 h-5 text-emerald-400 opacity-80" />
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {Math.floor(estats.windPower).toLocaleString()}{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              kWh
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ {estats.windTrend.toFixed(1)}% /1h
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-md shadow-black/5"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest">
              {t("Total Load Consumption")}
            </div>
            <Zap className="w-5 h-5 text-amber-400 opacity-80" />
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {Math.floor(estats.totalLoad).toLocaleString()}{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              kWh
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ {estats.loadTrend.toFixed(1)}% /1h
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-md shadow-black/5"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest">
              {t("Excess Power (Curtailed)")}
            </div>
            <TrendingDown className="w-5 h-5 text-blue-400 opacity-80" />
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {Math.floor(estats.excessPower).toLocaleString()}{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              kWh
            </span>
          </div>
          <div className="text-amber-400 text-xs font-semibold mt-2">
            ↓ {Math.abs(estats.excessTrend).toFixed(1)}% /1h
          </div>
        </motion.div>
      </div>

      {/* 24-Hour Energy Distribution Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full flex"
      >
        <EnergyChart />
      </motion.div>

      {/* Energy Balance Analysis */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl overflow-hidden shadow-lg p-8"
      >
        <h3 className="font-semibold text-white mb-6">
          {t("Real-time Energy Flow Analysis")}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              {t("Input Sources")}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-[#2D2D2D]">
                <span className="font-semibold text-gray-300">
                  {t("Battery Heat Recovery")}
                </span>
                <span className="font-mono font-bold text-white">
                  {Math.floor(estats.batteryHeat).toLocaleString()} kWh
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-[#2D2D2D]">
                <span className="font-semibold text-gray-300">
                  {t("Wind Power Curtailment")}
                </span>
                <span className="font-mono font-bold text-[#1976D2]">
                  {Math.floor(estats.windCurtailment).toLocaleString()} kWh
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-[#2D2D2D]">
                <span className="font-semibold text-gray-300">
                  {t("Compressor Subsystem Load")}
                </span>
                <span className="font-mono font-bold text-white">
                  {Math.floor(estats.compressorLoad).toLocaleString()} kWh
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              {t("Output / Storage")}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <span className="font-semibold text-red-400">
                  {t("Battery HVAC Matrix Load")}
                </span>
                <span className="font-mono font-bold text-red-400">
                  {Math.floor(estats.hvacLoad).toLocaleString()} kWh
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <span className="font-semibold text-emerald-400">
                  {t("Silicon-Melt Storage Transferred")}
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {Math.floor(estats.storageTransferred).toLocaleString()} kWh
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-[#2D2D2D]">
                <span className="font-semibold text-gray-300">
                  {t("System Path Loss")}
                </span>
                <span className="font-mono font-bold text-white">
                  {Math.floor(estats.systemLoss).toLocaleString()} kWh
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
