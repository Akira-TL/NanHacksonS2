import { Settings2, Power, Fan } from "lucide-react";
import type { HeatCollectorState } from "../types";
import { cn } from "../lib/utils";
import React from "react";
import { useAppContext } from "../contexts/AppContext";

export function CollectorsPanel({
  collectors,
}: {
  collectors: HeatCollectorState[];
}) {
  const { t } = useAppContext();
  return (
    <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl col-span-12 lg:col-span-4 flex flex-col min-h-[300px]">
      <div className="px-6 py-4 border-b border-[#2D2D2D] flex items-center justify-between">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider">
          {t("Subsystem Status")}
        </h3>
        <span className="text-[#1976D2] text-[11px] font-bold uppercase tracking-wider cursor-pointer">
          {t("Live Metrics")}
        </span>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-[#0A0A0A]/50">
        {collectors.map((c) => (
          <CollectorRow key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}

function CollectorRow({
  type,
  state,
  efficiency,
  currentPowerKw,
  temperatureC,
}: HeatCollectorState & { key?: React.Key }) {
  const { t } = useAppContext();
  const getIcon = () => {
    switch (type) {
      case "compressor":
        return <Settings2 className="w-5 h-5 text-[#1976D2]" />;
      case "heat_sheet":
        return <Power className="w-5 h-5 text-amber-400" />;
      case "forced_air":
        return <Fan className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case "compressor":
        return t("Compressor Hub");
      case "heat_sheet":
        return t("Heat Sheet Array");
      case "forced_air":
        return t("Forced Air Sync");
    }
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl p-4 flex flex-col gap-5 relative overflow-hidden group hover:border-[#3D3D3D] transition-colors">
      {state === "COLLECTING" && (
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0A0A0A] border border-[#2D2D2D] rounded-lg">
            {getIcon()}
          </div>
          <span className="font-semibold text-sm text-white">{getLabel()}</span>
        </div>
        <div
          className={cn(
            "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md",
            state === "COLLECTING"
              ? "bg-emerald-500/20 text-emerald-400"
              : state === "STANDBY"
                ? "bg-gray-500/20 text-gray-400"
                : "bg-red-500/20 text-red-400",
          )}
        >
          {t(state)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatBox label={t("Efficiency")} value={`${efficiency.toFixed(1)}%`} />
        <StatBox
          label={t("Current PWR")}
          value={`${currentPowerKw.toFixed(1)}kW`}
        />
        <StatBox
          label={t("Output TMP")}
          value={`${temperatureC.toFixed(1)}°C`}
        />
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase mb-1">
        {label}
      </span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
