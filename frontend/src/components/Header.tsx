import { useEffect, useState } from "react";
import { Activity, ThermometerSun, Clock } from "lucide-react";

export function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-[var(--bg-card)] border-b border-[var(--border-subtle)] flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex flex-col items-center justify-center text-white shadow-sm shadow-indigo-600/20">
          <ThermometerSun className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
            Project Overview
          </h1>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-muted)] text-sm font-medium">
            Silicon-Melt Core
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-900/30 border border-emerald-800/40">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
            Sys_Nominal
          </span>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-muted)] border-l border-[var(--border-subtle)] pl-6">
          <Clock className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-sm font-medium tracking-wide">
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>
      </div>
    </header>
  );
}
