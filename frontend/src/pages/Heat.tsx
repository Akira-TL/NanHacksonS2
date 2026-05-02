import { CollectorsPanel } from "../components/CollectorsPanel";
import type { HeatCollectorState } from "../types";
import { Settings2, Power, Fan } from "lucide-react";
import { usePolling } from "../hooks/usePolling";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";

export function HeatManagement() {
  const { t } = useAppContext();
  const { data: collectors } = usePolling<HeatCollectorState[]>(
    "/api/collectors",
    5000,
    [],
  );

  const handleConfigure = () => {
    toast(t("Subsystem Configuration"), {
      description: t("Opening advanced subsystem calibration tools."),
    });
  };

  const handleAdjustParams = (name: string) => {
    toast(t(`Adjusting`) + ` ${name}`, {
      description: t("Calibrating heat transfer coefficients."),
    });
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 mx-auto w-full max-w-[1440px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Total Heat Recycled")}
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            1,600{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              kWh
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ 12.5% /1h
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Heat Utilization Rate")}
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            90.0{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              %
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ 4.7% /1h
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mb-2">
            {t("Silicon-Melt Storage")}
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            83.3{" "}
            <span className="text-sm text-[var(--text-muted)] font-medium">
              %
            </span>
          </div>
          <div className="text-emerald-400 text-xs font-semibold mt-2">
            ↑ 3.2% /1h
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollectorsPanel collectors={collectors} />

        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {t("Subsystem Details")}
            </h3>
            <span
              onClick={handleConfigure}
              className="text-[var(--accent-primary)] text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:bg-[var(--bg-base)] p-1 rounded transition-colors"
            >
              {t("Configure")}
            </span>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div
                onClick={() => handleAdjustParams(t("Compressor Array"))}
                className="cursor-pointer hover:border-[var(--accent-primary)] transition-colors flex items-center gap-4 border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 p-4 rounded-xl"
              >
                <div className="p-3 bg-[var(--bg-card)] border border-[var(--accent-primary)]/20 rounded-lg shadow-sm">
                  <Settings2 className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[var(--text-primary)] text-sm">
                    {t("Compressor Array Alpha")}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-medium">
                    {t("Active - Heat source from B-Block batteries")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[var(--text-primary)]">
                    850{" "}
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                      kWh
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleAdjustParams(t("Heat Sheet"))}
                className="cursor-pointer hover:border-amber-400 transition-colors flex items-center gap-4 border border-amber-400/30 bg-amber-400/5 p-4 rounded-xl"
              >
                <div className="p-3 bg-[var(--bg-card)] border border-amber-400/20 rounded-lg shadow-sm">
                  <Power className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {t("Heat Sheet Contact Pad")}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {t("Active - Direct contact recycling")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">
                    420{" "}
                    <span className="text-xs font-medium text-slate-500">
                      kWh
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleAdjustParams(t("Forced Air Sync"))}
                className="cursor-pointer hover:border-slate-400 transition-colors flex items-center gap-4 border border-slate-200 bg-slate-50/50 p-4 rounded-xl"
              >
                <div className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                  <Fan className="w-6 h-6 text-slate-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {t("Forced Air Sync System")}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {t("Standby Mode")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">
                    580{" "}
                    <span className="text-xs font-medium text-slate-500">
                      kWh
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
