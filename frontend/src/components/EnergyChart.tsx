import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "../contexts/AppContext";

export function EnergyChart() {
  const { t } = useAppContext();
  const [data, setData] = useState(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      time: `${i.toString().padStart(2, "0")}:00`,
      recycled: 50 + Math.random() * 80 + (i > 10 && i < 16 ? 100 : 0),
      loss: 10 + Math.random() * 15,
      storage: 40 + i * 2 + Math.random() * 10,
    }));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const hour = parseInt(last.time.split(":")[0]);
        const nextHour = (hour + 1) % 24;

        newData.push({
          time: `${nextHour.toString().padStart(2, "0")}:00`,
          recycled: Math.max(0, last.recycled + (Math.random() - 0.5) * 20),
          loss: Math.max(0, last.loss + (Math.random() - 0.5) * 5),
          storage: Math.max(
            0,
            Math.min(100, last.storage + (Math.random() - 0.5) * 10),
          ),
        });
        return newData;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="tech-panel col-span-12 xl:col-span-4 flex flex-col min-h-[400px]">
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <h3 className="font-semibold text-[var(--text-primary)]">
          {t("System Energy Trends")}
        </h3>
        <span className="text-[var(--accent-primary)] text-[11px] font-bold uppercase tracking-wider cursor-pointer">
          {t("Live 24h")}
        </span>
      </div>
      <div className="flex-1 p-6 min-h-[300px] w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickMargin={10}
              tickFormatter={(val, index) => (index % 4 === 0 ? val : "")}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickFormatter={(val) => `${Math.floor(val)}k`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                padding: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#0f172a",
              }}
              labelStyle={{
                color: "#64748b",
                fontSize: "12px",
                marginBottom: "8px",
                fontWeight: 500,
              }}
            />
            <Line
              type="monotone"
              dataKey="recycled"
              name={t("Recycled Q")}
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="loss"
              name={t("Heat Loss")}
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="storage"
              name={t("Storage Lv")}
              stroke="#0ea5e9"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
