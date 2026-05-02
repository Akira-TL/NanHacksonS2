import { cn } from "../lib/utils";
import type { BatteryUnit } from "../types";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export function BatteryGrid({ units }: { units: BatteryUnit[] }) {
  const navigate = useNavigate();
  const { t } = useAppContext();
  const getColor = (temp: number) => {
    if (temp < 15) return "bg-[#0A0A0A] border-sky-500/30 text-sky-400";
    if (temp <= 25)
      return "bg-[#0A0A0A] border-emerald-500/30 text-emerald-400";
    if (temp <= 45) return "bg-[#0A0A0A] border-amber-500/30 text-amber-400";
    return "bg-[#0A0A0A] border-red-500/30 text-red-400 font-bold";
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl col-span-12 xl:col-span-8 flex flex-col min-h-[400px]">
      <div className="px-6 py-4 border-b border-[#2D2D2D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">
            {t("Active Battery Cells")}
          </h3>
          <button
            onClick={() => navigate("/temperature")}
            className="text-[#1976D2] text-[10px] font-bold uppercase tracking-wider bg-[#1976D2]/10 hover:bg-[#1976D2]/20 px-2 py-1 rounded transition-colors"
          >
            {t("View Details")}
          </button>
        </div>
        <div className="flex gap-4 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-sky-400" /> &lt;15°C
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-emerald-400" /> 15-25°C
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-amber-400" /> 25-45°C
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-red-400" /> &gt;45°C
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center bg-[#0A0A0A]/50">
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-[14] lg:grid-cols-[18] gap-1.5 m-auto text-[10px]">
          {units.map((unit) => (
            <div
              key={unit.id}
              className={cn(
                "w-8 h-8 rounded-md border flex items-center justify-center font-medium relative group cursor-crosshair transition-colors duration-500",
                getColor(unit.temperatureC),
              )}
            >
              {Math.round(unit.temperatureC)}

              {/* Tooltip */}
              <div className="absolute hidden group-hover:flex flex-col bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg z-20 shadow-lg whitespace-nowrap min-w-[140px]">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  {t("Cell Info")}
                </span>
                <div className="flex items-center justify-between gap-4 text-xs text-gray-400 mb-1">
                  <span className="font-medium">ID:</span>{" "}
                  <span className="font-semibold text-white">{unit.id}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-xs text-gray-400 mb-1">
                  <span className="font-medium">SOC:</span>{" "}
                  <span className="font-semibold text-white">
                    {Math.round(unit.soc)}%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-xs text-gray-400">
                  <span className="font-medium">TMP:</span>{" "}
                  <span className="font-semibold text-white">
                    {unit.temperatureC.toFixed(1)}°C
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-xs mt-2 pt-2 border-t border-[#2D2D2D]">
                  <span className="font-medium text-gray-500 uppercase">
                    STATUS:
                  </span>
                  <span
                    className={cn(
                      "font-bold text-[10px] uppercase px-1.5 py-0.5 rounded",
                      unit.status === "normal"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400",
                    )}
                  >
                    {unit.status === "warning" ? t("Warning") : t(unit.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
