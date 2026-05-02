import { EnergyChart } from "../components/EnergyChart";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";

export function EnergyManagement() {
  const { t } = useAppContext();
  const handleExport = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: t("Generating energy consumption report..."),
      success: t("Report downloaded successfully") + " (energy_dist_2026.csv)",
      error: t("Failed to generate report"),
    });
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 mx-auto w-full max-w-[1440px]">
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
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Wind Power generation")}
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            96,000{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              kWh
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ 5.2% /1h
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Total Load Consumption")}
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            70,000{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              kWh
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ 2.1% /1h
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Excess Power (Curtailed)")}
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            26,000{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              kWh
            </span>
          </div>
          <div className="text-amber-400 text-xs font-semibold mt-2">
            ↓ 1.5% /1h
          </div>
        </div>
      </div>

      {/* 24-Hour Energy Distribution Chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <EnergyChart />
      </div>

      {/* Energy Balance Analysis */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-8">
        <h3 className="font-semibold text-[var(--text-primary)] mb-6">
          {t("Real-time Energy Flow Analysis")}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">
              {t("Input Sources")}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
                <span className="font-semibold text-[var(--text-secondary)]">
                  {t("Battery Heat Recovery")}
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  2,100 kWh (52.5%)
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
                <span className="font-semibold text-[var(--text-secondary)]">
                  {t("Wind Power Curtailment")}
                </span>
                <span className="font-mono font-bold text-[var(--accent-primary)]">
                  1,200 kWh (30.0%)
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
                <span className="font-semibold text-[var(--text-secondary)]">
                  {t("Compressor Subsystem Load")}
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  700 kWh (17.5%)
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">
              {t("Output / Storage")}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-400/10 rounded-lg border border-red-400/30">
                <span className="font-semibold text-red-400">
                  {t("Battery HVAC Matrix Load")}
                </span>
                <span className="font-mono font-bold text-red-400">
                  1,680 kWh (45.7%)
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-400/10 rounded-lg border border-emerald-400/30">
                <span className="font-semibold text-emerald-400">
                  {t("Silicon-Melt Storage Transferred")}
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  1,850 kWh (50.3%)
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
                <span className="font-semibold text-[var(--text-secondary)]">
                  {t("System Path Loss")}
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  320 kWh (8.7%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
