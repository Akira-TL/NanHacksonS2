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
    <div className="p-6 lg:p-8 flex flex-col gap-6 mx-auto w-full max-w-[1440px]">
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
        ].map((s) => (
          <div
            key={s.label}
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
          </div>
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
            <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-card)]">
              {alerts.map((a) => (
                <tr
                  key={a.id}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alert Detail Pane */}
        {selectedAlert ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="p-6 border-b border-rose-200">
              <div className="flex items-center gap-3 mb-4">
                <Siren className="w-6 h-6 text-rose-600" />
                <h3 className="text-lg font-bold text-rose-900 leading-tight">
                  {t(selectedAlert.title)}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-medium">
                <span className="px-2 py-1 bg-[var(--bg-card)] rounded border border-red-800/40 text-red-400">
                  ID: {selectedAlert.id}
                </span>
                <span className="px-2 py-1 bg-[var(--bg-card)] rounded border border-red-800/40 text-red-400">
                  SRC: {selectedAlert.source}
                </span>
                <span
                  className={cn(
                    "px-2 py-1 bg-[var(--bg-card)] rounded border font-bold uppercase",
                    selectedAlert.status === "Acknowledged"
                      ? "border-emerald-800/40 text-emerald-400"
                      : "border-red-800/40 text-red-400",
                  )}
                >
                  {t(selectedAlert.status)}
                </span>
              </div>
            </div>

            <div className="p-6 bg-[var(--bg-card)] flex-1 space-y-6">
              <div>
                <h4 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                  {t("Suggested Action")}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                  {t(
                    "Trigger forced air sync system immediately. Divert adjacent compressor loads to reduce ambient heat matrix.",
                  )}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                {selectedAlert.status !== "Acknowledged" && (
                  <button
                    onClick={handleAcknowledge}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {t("Acknowledge Alert")}
                  </button>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateTicket}
                    className="flex-1 py-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-semibold rounded-lg hover:bg-[var(--border-subtle)] transition-colors"
                  >
                    {t("Create Ticket")}
                  </button>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
}
