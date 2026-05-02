import { useEffect, useState } from "react";
import {
  Activity,
  Clock,
  Sun,
  Moon,
  Languages,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAppContext } from "../../contexts/AppContext";

const routeNames: Record<string, string> = {
  "/": "Project Overview",
  "/temperature": "Temperature Monitoring",
  "/energy": "Energy Management",
  "/heat": "Heat Management",
  "/alerts": "Alert Center",
  "/users": "User Management",
  "/settings": "System Settings",
  "/library": "Resource Library",
};

export function Header() {
  const [time, setTime] = useState(new Date());
  const location = useLocation();
  const { theme, setTheme, locale, setLocale, t } = useAppContext();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePublish = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: t("Publish Updates") + "...",
      success: t("Updates published to core system successfully"),
      error: t("Failed to publish updates"),
    });
  };

  const pageTitle = t(routeNames[location.pathname] || "EnergyLoop Core");

  return (
    <header className="h-14 bg-[#121212] border-b border-[#2D2D2D] flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
      {/* Left section */}
      <div className="flex items-center gap-8">
        <h1 className="text-lg font-bold tracking-widest text-white uppercase">
          {pageTitle}
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative flex items-center bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg px-3 py-1">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            className="bg-transparent border-none focus:ring-0 text-xs w-48 text-white placeholder-gray-600"
            placeholder={t("Global Search") + "..."}
            type="text"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2D2D2D] rounded transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2D2D2D] rounded transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setLocale(locale === "en" ? "zh" : "en")}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2D2D2D] rounded-lg text-sm font-semibold hover:bg-[#2D2D2D] transition-colors bg-[#1E1E1E]"
        >
          <span
            className={
              locale === "en"
                ? "text-[#1976D2] font-black"
                : "text-gray-500 font-medium"
            }
          >
            A
          </span>
          <span className="text-gray-600">/</span>
          <span
            className={
              locale === "zh"
                ? "text-[#1976D2] font-black"
                : "text-gray-500 font-medium"
            }
          >
            中
          </span>
        </button>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1E1E1E] border border-[#2D2D2D]">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
            {t("Sys_Nominal")}
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#2D2D2D] bg-[#6750a4] flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              <span>OP</span>
            </div>
          </div>
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-[#1976D2] text-white text-xs font-semibold rounded hover:bg-[#0D47A1] transition-colors shadow-lg shadow-blue-900/20"
          >
            {t("Commit Changes")}
          </button>
        </div>

        {/* Time */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          {time.toISOString().split("T")[0]} {time.toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
}
