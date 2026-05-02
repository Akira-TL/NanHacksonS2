import { Settings2, Power, Fan, Play, Square, Settings } from "lucide-react";
import type { HeatCollectorState } from "../types";
import { cn } from "../lib/utils";
import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "sonner";

import { usePolling } from "../hooks/usePolling";

export function CollectorsPanel({
  collectors,
  refetch,
}: {
  collectors: HeatCollectorState[];
  refetch?: () => void;
}) {
  const { t } = useAppContext();
  const { data: synergyConfig, setData: setSynergy } = usePolling<{ masterSynergyEnabled: boolean }>("/api/master-synergy", 2000, { masterSynergyEnabled: false });

  const heatSheets = collectors.filter((c) => c.type !== "forced_air");
  const forcedAirs = collectors.filter((c) => c.type === "forced_air");

  const aggregatedForcedAir = {
    id: "master_forced_air",
    type: "forced_air",
    state: synergyConfig.masterSynergyEnabled ? "COLLECTING" : "STANDBY",
    efficiency: forcedAirs.length ? forcedAirs.reduce((s,c) => s + c.efficiency, 0) / forcedAirs.length : 68.3,
    currentPowerKw: forcedAirs.reduce((s,c) => s + c.currentPowerKw, 0),
    temperatureC: forcedAirs.length ? forcedAirs.reduce((s,c) => s + c.temperatureC, 0) / forcedAirs.length : 28.5,
  } as HeatCollectorState;

  const displayCollectors = [...heatSheets, aggregatedForcedAir];

  return (
    <div className="col-span-12 lg:col-span-4 bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl flex flex-col min-h-[300px]">
      <div className="px-6 py-4 border-b border-[#2D2D2D] flex items-center justify-between">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider">
          {t("Subsystem Status")}
        </h3>
        <span className="text-[#1976D2] text-[11px] font-bold uppercase tracking-wider cursor-pointer">
          {t("Live Metrics")}
        </span>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-[#0A0A0A]/50 pointer-events-auto relative">
        {displayCollectors.map((c) => (
          <CollectorRow key={c.id} collector={c} refetch={refetch} />
        ))}
      </div>
    </div>
  );
}

const CollectorRow: React.FC<{ collector: HeatCollectorState, refetch?: () => void }> = ({
  collector,
  refetch,
}) => {
  const { id, type, state, efficiency, currentPowerKw, temperatureC } = collector;
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);

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

  const handleAction = async (action: 'toggle' | 'calibrate') => {
    setLoading(true);
    try {
      if (id === "master_forced_air" && action === "toggle") {
        const res = await fetch("/api/master-synergy", { method: "POST" });
        if (res.ok) {
           toast.success(t(`Action successful`) + ` (${action})`);
           refetch?.();
        } else {
           toast.error(t(`Action failed`));
        }
      } else {
        const targetId = id === "master_forced_air" && action === "calibrate" ? "forced_air_zone_A" : id;
        const res = await fetch(`/api/collectors/${targetId}/control`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        if (res.ok) {
          toast.success(t(`Action successful`) + ` (${action})`);
          refetch?.();
        } else {
          toast.error(t(`Action failed`));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(t(`Network error`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden group hover:border-[#3D3D3D] transition-colors">
      {state === "COLLECTING" && (
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
      )}
      
      <div className="flex items-center justify-between w-full">
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

      <div className="grid grid-cols-3 gap-2 w-full bg-[#121212] p-3 rounded-lg border border-[#2D2D2D]">
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

      <div className="flex items-center gap-2 mt-1 w-full flex-row-reverse border-t border-[#2D2D2D] pt-3">
        <button
          onClick={() => handleAction('calibrate')}
          disabled={loading}
          className="p-2 rounded-lg bg-[#2D2D2D] border border-[#3D3D3D] text-[#A0A0A0] hover:bg-[#3D3D3D] hover:text-white transition-colors disabled:opacity-50"
          title={t("Calibrate")}
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleAction('toggle')}
          disabled={loading}
          className={cn(
            "flex-1 p-2 rounded-lg border transition-colors flex items-center justify-center gap-2 font-semibold text-xs tracking-wider uppercase disabled:opacity-50",
            state === 'COLLECTING' 
              ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" 
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
          )}
        >
          {state === 'COLLECTING' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {state === 'COLLECTING' ? t("Stop") : t("Start")}
        </button>
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
