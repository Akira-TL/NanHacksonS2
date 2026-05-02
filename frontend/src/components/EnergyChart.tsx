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
    const initData = Array.from({ length: 30 }).map((_, i) => ({
      time: `${(i % 24).toString().padStart(2, "0")}:00`,
      recycled: i < 24 ? 50 + Math.random() * 80 + (i > 10 && i < 16 ? 100 : 0) : null,
      loss: i < 24 ? 10 + Math.random() * 15 : null,
      storage: i < 24 ? 40 + i * 2 + Math.random() * 10 : null,
      recycledPredict: null as number | null,
      lossPredict: null as number | null,
      storagePredict: null as number | null,
      isPrediction: i >= 24,
    }));
    
    // Create overlap point at index 23 so the prediction lines start exactly from the actuals
    initData[23].recycledPredict = initData[23].recycled;
    initData[23].lossPredict = initData[23].loss;
    initData[23].storagePredict = initData[23].storage;

    for (let i = 24; i < 30; i++) {
       initData[i].recycledPredict = Math.max(0, initData[i-1].recycledPredict! + (Math.random() - 0.5) * 30);
       initData[i].lossPredict = Math.max(0, initData[i-1].lossPredict! + (Math.random() - 0.5) * 5);
       initData[i].storagePredict = Math.max(0, initData[i-1].storagePredict! + (Math.random() - 0.5) * 10);
    }

    return initData;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setData((prev) => {
        // Create a new array and shallow copy all objects to avoid mutation errors
        const newData = prev.map(item => ({ ...item }));
        
        // Remove the oldest point
        newData.shift();

        // Find the last actual point BEFORE we potentially convert a prediction
        const lastActualIdx = newData.findLastIndex(d => !d.isPrediction && d.recycled !== null);
        const lastActual = lastActualIdx !== -1 ? newData[lastActualIdx] : null;

        // Convert the first prediction point to an actual point (continuity)
        const firstPredIdx = newData.findIndex(d => d.isPrediction);
        if (firstPredIdx !== -1) {
          newData[firstPredIdx] = {
            ...newData[firstPredIdx],
            recycled: newData[firstPredIdx].recycledPredict,
            loss: newData[firstPredIdx].lossPredict,
            storage: newData[firstPredIdx].storagePredict,
            isPrediction: false
          };
        }

        // Add a new prediction point at the end
        const lastPoint = newData[newData.length - 1];
        const hour = parseInt(lastPoint.time.split(":")[0]);
        const nextHour = (hour + 1) % 24;

        newData.push({
          time: `${nextHour.toString().padStart(2, "0")}:00`,
          recycled: null,
          loss: null,
          storage: null,
          recycledPredict: Math.max(0, (lastPoint.recycledPredict || 100) + (Math.random() - 0.5) * 30),
          lossPredict: Math.max(0, (lastPoint.lossPredict || 15) + (Math.random() - 0.5) * 5),
          storagePredict: Math.max(0, (lastPoint.storagePredict || 70) + (Math.random() - 0.5) * 10),
          isPrediction: true,
        });
        
        return newData;
      });
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="col-span-12 xl:col-span-4 w-full flex flex-col min-h-[400px] bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2D2D2D] flex items-center justify-between">
        <h3 className="font-bold text-sm uppercase tracking-wider text-white">
          {t("System Energy Trends")}
        </h3>
        <span className="text-[#1976D2] text-[11px] font-bold uppercase tracking-wider cursor-pointer">
          {t("Live 24h")}
        </span>
      </div>
      <div className="flex-1 p-6 w-full min-h-[320px] relative">
        <div className="absolute inset-0 p-6">
          <ResponsiveContainer width="100%" height="100%" minHeight={0}>
            <LineChart
              data={data.map(d => ({ ...d }))}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2D2D2D"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={11}
              tickMargin={10}
              tickFormatter={(val, index) => (index % 4 === 0 ? val : "")}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickFormatter={(val) => `${Math.floor(val)}k`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E1E1E",
                borderColor: "#3D3D3D",
                borderRadius: "8px",
                padding: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#f3f4f6",
              }}
              labelStyle={{
                color: "#9ca3af",
                fontSize: "12px",
                marginBottom: "8px",
                fontWeight: 500,
              }}
            />
            <Line
              type="monotone"
              dataKey="recycled"
              name={t("Recycled Q")}
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="recycledPredict"
              name={`${t("Recycled Q")} (${t("Predicted")})`}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="loss"
              name={t("Heat Loss")}
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="lossPredict"
              name={`${t("Heat Loss")} (${t("Predicted")})`}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="storage"
              name={t("Storage Lv")}
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="storagePredict"
              name={`${t("Storage Lv")} (${t("Predicted")})`}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
