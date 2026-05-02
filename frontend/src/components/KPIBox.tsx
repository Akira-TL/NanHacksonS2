import { cn } from "../lib/utils";
import type { KPI } from "../types";
import React from "react";
import { useAppContext } from "../contexts/AppContext";

export function KPIBox({ kpi }: { kpi: KPI; key?: React.Key }) {
  const { t } = useAppContext();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-emerald-500";
      case "warning":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-emerald-400";
    if (trend < 0) return "text-red-400";
    return "text-gray-500";
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl p-5 hover:border-[#3D3D3D] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {t(kpi.title)}
        </span>
        <div
          className={cn("w-2 h-2 rounded-full", getStatusColor(kpi.status))}
        />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-white tracking-tight">
          {kpi.value}
        </span>
        {kpi.trend !== undefined ? (
          <span
            className={cn(
              "text-xs font-semibold mb-1.5",
              getTrendColor(kpi.trend),
            )}
          >
            {kpi.trend > 0 ? "+" : ""}
            {kpi.trend}%
          </span>
        ) : (
          <span className="text-gray-500 text-sm font-medium mb-1.5">
            {kpi.unit}
          </span>
        )}
      </div>
      <div>
        {kpi.trend !== undefined && (
          <div className="w-full bg-[#2D2D2D] h-1.5 mt-4 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full",
                kpi.trend > 10
                  ? "bg-[#1976D2] w-[91%]"
                  : kpi.trend > 0
                    ? "bg-emerald-500 w-[75%]"
                    : "bg-amber-500 w-[45%]",
              )}
            ></div>
          </div>
        )}
        <div className="text-gray-500 text-[10px] mt-3 font-medium uppercase tracking-wider">
          {t(kpi.description)}
        </div>
      </div>
    </div>
  );
}
