import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Siren,
  FileText,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { usePolling } from "../hooks/usePolling";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";
import { motion, AnimatePresence } from "motion/react";

export function AlertCenter() {
  const { t } = useAppContext();
  const {
    data: alerts,
    setData: setAlerts,
    refetch: refetchAlerts,
  } = usePolling<any[]>("/api/alerts", 5000, []);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(
    "ALM-001",
  );

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || null;

  const handleAcknowledge = async () => {
    if (!selectedAlertId) return;
    try {
      const res = await fetch(`/api/alerts/${selectedAlertId}/acknowledge`, {
        method: "POST",
      });
      if (res.ok) {
        const updatedAlert = await res.json();
        setAlerts((prev) =>
          prev.map((a) => (a.id === updatedAlert.id ? updatedAlert : a)),
        );
        toast.success(t(`Alert Acknowledged`));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to acknowledge alert"));
    }
  };

  const handleAcknowledgeAll = async () => {
    try {
      const res = await fetch(`/api/alerts/acknowledge-all`, {
        method: "POST",
      });
      if (res.ok) {
        await refetchAlerts();
        toast.success(t("All active alerts acknowledged"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to acknowledge alerts"));
    }
  };

  const handleCreateTicket = async () => {
    try {
      const res = await fetch(`/api/tickets`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        toast.success(t(`Ticket created successfully`) + ` (${data.ticketId})`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 flex flex-col gap-6 mx-auto w-full max-w-[1440px]"
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: t("Critical (P0)"),
            value: alerts.filter(
              (a) => a.severity === "P0" && a.status !== "Acknowledged",
            ).length,
            icon: Siren,
            color: "text-red-400",
            bg: "bg-red-400/10",
            border: "border-red-400/30",
          },
          {
            label: t("Severe (P1)"),
            value: alerts.filter(
              (a) => a.severity === "P1" && a.status !== "Acknowledged",
            ).length,
            icon: AlertTriangle,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/30",
          },
          {
            label: t("Warning (P2)"),
            value: alerts.filter(
              (a) => a.severity === "P2" && a.status !== "Acknowledged",
            ).length,
            icon: Bell,
            color: "text-indigo-400",
            bg: "bg-indigo-400/10",
            border: "border-indigo-400/30",
          },
          {
            label: t("Info (P3)"),
            value: 12,
            icon: Info,
            color: "text-[var(--text-muted)]",
            bg: "bg-[var(--bg-base)]",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={cn(
              "rounded-xl p-4 flex items-center justify-between border",
              s.bg,
              s.border,
            )}
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                {s.label}
              </div>
              <div className={cn("text-2xl font-bold", s.color)}>{s.value}</div>
            </div>
            <s.icon className={cn("w-8 h-8 opacity-50", s.color)} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Alerts List */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {t("Active System Alerts")}
            </h3>
            <div className="flex gap-2">
              <span className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-wider px-2 py-1 bg-[var(--border-subtle)] rounded cursor-pointer">
                {t("Filter")}
              </span>
              <span
                onClick={handleAcknowledgeAll}
                className="text-[var(--accent-primary)] text-[11px] font-bold uppercase tracking-wider px-2 py-1 bg-[var(--accent-primary)]/20 rounded cursor-pointer hover:bg-[var(--accent-primary)]/30 transition-colors"
              >
                {t("Acknowledge All")}
              </span>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-base)] text-[var(--text-muted)] uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">{t("Severity")}</th>
                <th className="px-6 py-3">{t("Timestamp")}</th>
                <th className="px-6 py-3">{t("Source")}</th>
                <th className="px-6 py-3 text-right">{t("Event Profile")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-card)] relative">
              <AnimatePresence>
              {alerts.map((a, i) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedAlertId(a.id)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedAlertId === a.id
                      ? "bg-[var(--accent-primary)]/10"
                      : "hover:bg-[var(--border-subtle)]",
                  )}
                >
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                        a.severity === "P0"
                          ? "bg-red-900/30 text-red-400 border border-red-800/40"
                          : a.severity === "P1"
                            ? "bg-amber-900/30 text-amber-400 border border-amber-800/40"
                            : "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30",
                      )}
                    >
                      {a.severity === "P0"
                        ? t("Critical")
                        : a.severity === "P1"
                          ? t("Severe")
                          : t("Warning")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--text-muted)] font-mono text-xs">
                    {a.time}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                    {a.source}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-[var(--text-primary)] font-medium">
                      {t(a.title)}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase mt-1">
                      {t(a.status)}
                    </div>
                  </td>
                </motion.tr>
              ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Alert Detail Pane */}
        {selectedAlert ? (
          <motion.div
            key={selectedAlert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1E1E1E] border border-red-500/30 rounded-xl overflow-hidden shadow-lg flex flex-col"
          >
            <div className="p-6 border-b border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-3 mb-4">
                <Siren className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-bold text-white leading-tight">
                  {t(selectedAlert.title)}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-medium">
                <span className="px-2 py-1 bg-[#0A0A0A] rounded border border-[#2D2D2D] text-gray-400">
                  ID: {selectedAlert.id}
                </span>
                <span className="px-2 py-1 bg-[#0A0A0A] rounded border border-[#2D2D2D] text-gray-400">
                  SRC: {selectedAlert.source}
                </span>
                <span
                  className={cn(
                    "px-2 py-1 bg-[#0A0A0A] rounded border font-bold uppercase",
                    selectedAlert.status === "Acknowledged"
                      ? "border-emerald-500/30 text-emerald-400"
                      : "border-red-500/30 text-red-400",
                  )}
                >
                  {t(selectedAlert.status)}
                </span>
              </div>
            </div>

            <div className="p-6 bg-[#121212] flex-1 space-y-6">
              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  {t("Suggested Action")}
                </h4>
                <p className="text-sm text-gray-300 font-medium">
                  {t(
                    "Trigger forced air sync system immediately. Divert adjacent compressor loads to reduce ambient heat matrix.",
                  )}
                </p>
              </div>

              <div className="pt-4 border-t border-[#2D2D2D] flex flex-col gap-3">
                {selectedAlert.status !== "Acknowledged" && (
                  <button
                    onClick={handleAcknowledge}
                    className="w-full py-2.5 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-bold tracking-wider uppercase rounded-lg transition-colors text-xs"
                  >
                    {t("Acknowledge Alert")}
                  </button>
                )}
                <div className="flex gap-3">
                  {selectedAlert.unitId && (
                    <button
                      onClick={async () => {
                        try {
                          await fetch(`/api/batteries/${selectedAlert.unitId}/control`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "decommission" }),
                          });
                          toast.success(t("Unit successfully stop/decommissioned"));
                        } catch (err) {
                           console.error(err);
                        }
                      }}
                      className="flex-1 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-amber-500/20 transition-colors"
                    >
                      {t("Maintenance Halt")}
                    </button>
                  )}
                  <button
                    onClick={handleCreateTicket}
                    className="flex-1 py-2 bg-[#1E1E1E] border border-[#2D2D2D] text-gray-300 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#2D2D2D] transition-colors"
                  >
                    {t("Create Ticket")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-[var(--bg-card)] border text-center border-[var(--border-subtle)] rounded-xl p-12 flex flex-col items-center justify-center text-[var(--text-muted)] h-full">
            <CheckCircle2 className="w-12 h-12 mb-4 text-emerald-200" />
            <p className="font-medium">
              {t(
                "Select an alert to view investigation details and remediation playbooks.",
              )}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
