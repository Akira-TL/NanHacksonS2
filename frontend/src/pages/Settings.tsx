import { useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Server,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "motion/react";

export function SystemSettings() {
  const { t } = useAppContext();
  const [settings, setSettings] = useState({
    autoCurtailment: true,
    warningThresholdC: 45,
    criticalThresholdC: 55,
    maxPowerDischargeKw: 1000,
    notifyOnWarning: false,
    environmentMode: "eco",
  });

  const handleSave = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: t("Applying system settings..."),
      success: t("Settings applied successfully"),
      error: t("Failed to apply settings"),
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 flex flex-col gap-6 mx-auto w-full max-w-[1440px]"
    >
      <div className="flex justify-between items-center bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-subtle)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {t("System Parameters")}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {t(
              "Configure global operational thresholds and automation policies.",
            )}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Save className="w-4 h-4" /> {t("Save Changes")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thermal Settings */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center gap-2 bg-[var(--bg-base)]">
            <Cpu className="w-5 h-5 text-[var(--accent-primary)]" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              {t("Thermal Automation")}
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  {t("Auto-Curtailment Mode")}
                </div>
                <div className="text-sm text-[var(--text-muted)] max-w-sm">
                  {t(
                    "Automatically reduce charging power when approaching critical temperatures.",
                  )}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.autoCurtailment}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoCurtailment: e.target.checked,
                    })
                  }
                />
                <div className="w-11 h-6 bg-[var(--border-subtle)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--bg-base)] after:border-[var(--border-subtle)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
              </label>
            </div>

            <div>
              <label className="font-semibold text-[var(--text-primary)] block mb-2">
                {t("Warning Threshold (°C)")}
              </label>
              <input
                type="range"
                min="30"
                max="50"
                value={settings.warningThresholdC}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    warningThresholdC: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
              />
              <div className="text-right text-sm font-bold text-[var(--text-secondary)] mt-1">
                {settings.warningThresholdC}°C
              </div>
            </div>

            <div>
              <label className="font-semibold text-[var(--text-primary)] block mb-2">
                {t("Critical Threshold (°C)")}
              </label>
              <input
                type="range"
                min="45"
                max="75"
                value={settings.criticalThresholdC}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    criticalThresholdC: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer accent-red-400"
              />
              <div className="text-right text-sm font-bold text-[var(--text-secondary)] mt-1">
                {settings.criticalThresholdC}°C
              </div>
            </div>
          </div>
        </div>

        {/* System Policies */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center gap-2 bg-[var(--bg-base)]">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              {t("Safety Policies")}
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="font-semibold text-slate-900 block mb-2">
                {t("Environment Mode")}
              </label>
              <select
                value={settings.environmentMode}
                onChange={(e) =>
                  setSettings({ ...settings, environmentMode: e.target.value })
                }
                className="w-full border border-[var(--border-subtle)] rounded-lg p-2.5 text-sm bg-[var(--bg-base)] focus:border-[var(--accent-primary)] outline-none text-[var(--text-primary)]"
              >
                <option value="eco">{t("Eco Mode (Max Efficiency)")}</option>
                <option value="balanced">{t("Balanced")}</option>
                <option value="performance">
                  {t("Performance (Max Output)")}
                </option>
              </select>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  {t("Notify on P2 Warnings")}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {t(
                    "Send push notifications for all P2/Warning status anomalies.",
                  )}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifyOnWarning}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifyOnWarning: e.target.checked,
                    })
                  }
                />
                <div className="w-11 h-6 bg-[var(--border-subtle)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--bg-base)] after:border-[var(--border-subtle)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
