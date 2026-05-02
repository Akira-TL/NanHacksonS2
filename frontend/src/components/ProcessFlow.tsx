import { cn } from "../lib/utils";
import { Thermometer, Box, Fan } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../contexts/AppContext";
import { usePolling } from "../hooks/usePolling";
import type { BatteryUnit } from "../types";

export function ProcessFlow() {
  const { t } = useAppContext();
  const { data: batteries } = usePolling<BatteryUnit[]>(
    "/api/batteries",
    3000,
    [],
  );

  // Calculate average temperature
  const avgTemp =
    batteries.length > 0
      ? (
          batteries.reduce((sum, b) => sum + b.temperatureC, 0) /
          batteries.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl col-span-12 lg:col-span-8 p-6 flex flex-col justify-center min-h-[300px]">
      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-6">
        {t("Active Heat Flow Matrix")}
      </h3>

      <div className="flex items-center justify-between gap-6 w-full max-w-4xl mx-auto h-full">
        {/* Source - Show average temperature */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-24 h-24 rounded-xl border border-[#2D2D2D] bg-[#0A0A0A] flex flex-col items-center justify-center gap-2 relative">
            <Thermometer className="text-red-400 w-6 h-6" />
            <span className="font-bold text-2xl tracking-tight text-white">
              {avgTemp}°C
            </span>
            <div className="absolute -bottom-8 whitespace-nowrap text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {t("Battery Matrix")}
            </div>
          </div>
        </div>

        {/* Transfer Paths */}
        <div className="flex flex-col justify-between flex-1 gap-6 py-6 min-w-[200px]">
          {/* Path 1: Heat Sheet only (removed compressor) */}
          <div className="flex items-center gap-2 relative">
            <FlowLine active color="warning" />
            <div className="bg-[#0A0A0A] border border-[#2D2D2D] rounded-lg p-3 flex items-center gap-3 relative z-10 w-44 justify-center">
              <Box className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">
                  {t("Heat Sheet")}
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                  Eff 9.5%
                </span>
              </div>
            </div>
            <FlowLine active color="warning" />
          </div>

          {/* Path 2: Forced Air */}
          <div className="flex items-center gap-2 relative">
            <FlowLine active color="success" delay={0.5} />
            <div className="bg-[#0A0A0A] border border-[#2D2D2D] rounded-lg p-3 flex items-center gap-3 relative z-10 w-44 justify-center">
              <Fan className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">
                  {t("Forced Air System")}
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                  Eff 68.3%
                </span>
              </div>
            </div>
            <FlowLine active color="success" delay={0.5} />
          </div>
        </div>

        {/* Destination */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-24 h-24 rounded-xl border border-[#2D2D2D] bg-[#0A0A0A] flex flex-col items-center justify-center gap-2 relative">
            <Box className="text-[#1976D2] w-6 h-6" />
            <span className="font-bold text-2xl tracking-tight text-white">
              85%
            </span>
            <div className="absolute -bottom-8 whitespace-nowrap text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {t("Salt Melt Pile")}
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
    <div
      className={cn("h-[2px] flex-1 relative overflow-hidden", colorMap[color])}
    >
      {active && (
        <motion.div
          className={cn(
            "w-12 h-full absolute left-0 top-0 opacity-80",
            particleColorMap[color],
          )}
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
