import { useState, useMemo } from "react";
import type { BatteryUnit } from "../types";
import {
  Search,
  Filter,
  RotateCcw,
  Thermometer,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAppContext } from "../contexts/AppContext";
import { usePolling } from "../hooks/usePolling";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

export function TemperatureMonitoring() {
  const {
    data: batteries,
    setData: setBatteries,
    refetch,
  } = usePolling<BatteryUnit[]>("/api/batteries", 3000, []);
  const { t } = useAppContext();
  const [selectedBatId, setSelectedBatId] = useState<string | null>(null);
  const [zoneFilter, setZoneFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBatteries = batteries.filter((bat) => {
    // Generate derived zone based on ID
    const seed = bat.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const batZone = seed % 3 === 0 ? "A" : seed % 3 === 1 ? "B" : "C";

    if (zoneFilter !== "All" && batZone !== zoneFilter) return false;
    if (statusFilter === "Normal" && bat.temperatureC > 35) return false;
    if (statusFilter === "Warning" && bat.temperatureC <= 35) return false;
    if (
      searchQuery &&
      !bat.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const selectedBat = batteries.find((b) => b.id === selectedBatId) || null;

  const mockHistoryData = useMemo(() => {
    if (!selectedBat) return [];
    // Generate a consistent yet unique curve per battery using its ID string
    const seed = selectedBat.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Use a fixed base temp derived from seed so it doesn't jump every 3s polling update
    const baseTemp = 20 + (seed % 15);

    return Array.from({ length: 24 }).map((_, i) => {
      const noise = Math.sin(i * 0.5 + seed) * 3 + Math.cos(i * 1.2) * 2;
      return {
        time: `${i}:00`,
        temp: Number(Math.max(10, baseTemp - 5 + noise).toFixed(1)),
      };
    });
  }, [selectedBat?.id]);

  const handleControl = async (action: "heat" | "cool" | "adjust_target") => {
    if (!selectedBatId) return;

    if (action === "adjust_target") {
      toast(t("Adjust Target Mode"), {
        description: t("Target adjustment via controls enabled."),
      });
      return;
    }

    try {
      const res = await fetch(`/api/batteries/${selectedBatId}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const updatedBat = await res.json();
        setBatteries((prev) =>
          prev.map((b) => (b.id === updatedBat.id ? updatedBat : b)),
        );
        toast.success(t(`Action executed successfully`) + ` (${action})`);
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to execute control action"));
    }
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success(t("Matrix data refreshed"));
  };

  const getStatusColor = (temp: number) => {
    if (temp < 15)
      return "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)]";
    if (temp <= 25)
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-400";
    if (temp <= 35) return "border-amber-400/30 bg-amber-400/10 text-amber-400";
    return "border-red-400/30 bg-red-400/10 text-red-400 font-bold";
  };

  const getStatusText = (temp: number) => {
    if (temp < 15) return t("Low");
    if (temp <= 25) return t("Normal");
    if (temp <= 35) return t("High");
    return t("Warning");
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 mx-auto w-full max-w-[1440px]">
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Battery List */}
        <div className="xl:col-span-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {t("Realtime Thermal Monitor")}
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredBatteries.map((bat) => (
                <div
                  key={bat.id}
                  onClick={() => setSelectedBatId(bat.id)}
                  className={cn(
                    "border rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all hover:scale-105 hover:shadow-md",
                    getStatusColor(bat.temperatureC),
                    selectedBatId === bat.id &&
                      "ring-2 ring-indigo-500 ring-offset-2",
                  )}
                >
                  <div className="font-mono font-bold text-xs uppercase tracking-wider">
                    {bat.id}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight">
                      {bat.temperatureC.toFixed(1)}°C
                    </span>
                    <span className="text-xs font-medium opacity-80">
                      {Math.round(bat.soc)}% SOC
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-semibold px-2 border rounded-full uppercase bg-[var(--bg-base)]/50">
                      {getStatusText(bat.temperatureC)}
                    </span>
                    {bat.temperatureC > 35 && (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Battery Detail Pane */}
        {selectedBat ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-base)]">
              <h3 className="font-semibold text-[var(--text-primary)]">
                {t("Cell Details")} / {selectedBat.id}
              </h3>
              <Thermometer className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-semibold tracking-wide text-[var(--text-muted)] mb-1">
                    {t("Current Temp")}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-4xl font-bold tracking-tighter",
                        selectedBat.temperatureC > 35
                          ? "text-red-400"
                          : "text-[var(--text-primary)]",
                      )}
                    >
                      {selectedBat.temperatureC.toFixed(1)}°C
                    </span>
                    {selectedBat.temperatureC > 35 && (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-900/30 px-2 py-1 rounded">
                        <AlertTriangle className="w-3 h-3" />{" "}
                        {t("High Temp Alert")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tracking-wide text-[var(--text-muted)] mb-1">
                    {t("Target Temp")}
                  </div>

                  <div className="text-xl font-bold text-[var(--text-secondary)]">
                    20°C{" "}
                    <span className="text-sm text-[var(--text-muted)] font-medium">
                      ±2°C
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-48 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockHistoryData}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={["dataMin - 5", "dataMax + 5"]} hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  onClick={() => handleControl("heat")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors w-full"
                >
                  {t("Enable Heating")}
                </button>
                <button
                  onClick={() => handleControl("cool")}
                  className="bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors w-full"
                >
                  {t("Enable Cooling")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--bg-card)] border text-center border-[var(--border-subtle)] border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-[var(--text-muted)] h-[600px] sticky top-24">
            <Thermometer className="w-12 h-12 mb-4 text-[var(--text-muted)]/30" />
            <p className="font-medium">{t("Select a battery cell")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
