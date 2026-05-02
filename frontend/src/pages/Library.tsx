import {
  FileText,
  Download,
  PlayCircle,
  BookOpen,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";

const resources = [
  {
    id: "res_1",
    title: "Thermal Matrix Calibration Guide",
    type: "PDF Document",
    icon: FileText,
    date: "May 01, 2026",
    size: "2.4 MB",
  },
  {
    id: "res_2",
    title: "Emergency Cooling Protocol v2.1",
    type: "SOP",
    icon: BookOpen,
    date: "Apr 28, 2026",
    size: "1.1 MB",
  },
  {
    id: "res_3",
    title: "Compressor Maintenance Training",
    type: "Video",
    icon: PlayCircle,
    date: "Apr 15, 2026",
    size: "145 MB",
  },
  {
    id: "res_4",
    title: "Energy Dispatch Formulas Reference",
    type: "PDF Document",
    icon: FileText,
    date: "Mar 10, 2026",
    size: "4.8 MB",
  },
];

export function ResourceLibrary() {
  const { t } = useAppContext();
  const [activeRes, setActiveRes] = useState<string | null>(null);
  const [downloadingItems, setDownloadingItems] = useState<
    Record<string, boolean>
  >({});
  const [downloadedItems, setDownloadedItems] = useState<
    Record<string, boolean>
  >({});

  const handleDownload = (e: React.MouseEvent, resId: string) => {
    e.stopPropagation();
    if (downloadingItems[resId] || downloadedItems[resId]) return;

    setDownloadingItems((prev) => ({ ...prev, [resId]: true }));
    toast(t("Downloading Resource..."));

    setTimeout(() => {
      setDownloadingItems((prev) => ({ ...prev, [resId]: false }));
      setDownloadedItems((prev) => ({ ...prev, [resId]: true }));
      toast.success(t("Download Complete"));

      // Reset after a while
      setTimeout(() => {
        setDownloadedItems((prev) => ({ ...prev, [resId]: false }));
      }, 3000);
    }, 2000);
  };

  const selectedRes = resources.find((r) => r.id === activeRes);

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 mx-auto w-full max-w-[1440px]">
      <div className="flex justify-between items-center bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-subtle)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {t("Resource Library")}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t("Operational manuals, guides, and training procedures.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div
            key={res.id}
            onClick={() => setActiveRes(res.id)}
            className="bg-[var(--bg-card)] border text-left border-[var(--border-subtle)] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer hover:border-[var(--accent-primary)]/30"
          >
            {/* List rendering */}
            <div>
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center mb-4">
                <res.icon className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-1">
                {t(res.title)}
              </h3>
              <p className="text-sm font-medium text-[var(--text-muted)]">
                {t(res.type)} • {res.size}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                {res.date}
              </span>
              <button
                onClick={(e) => handleDownload(e, res.id)}
                className={`p-2 rounded transition-colors ${
                  downloadedItems[res.id]
                    ? "text-emerald-400 bg-emerald-900/30"
                    : "text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
                }`}
              >
                {downloadingItems[res.id] ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                ) : downloadedItems[res.id] ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeRes && selectedRes && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setActiveRes(null)}
        >
          <div
            className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-base)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded shrink-0 bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                  <selectedRes.icon className="w-4 h-4 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">
                    {t(selectedRes.title)}
                  </h3>
                  <div className="text-xs font-medium text-[var(--text-muted)]">
                    {t(selectedRes.type)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDownload(e, selectedRes.id)}
                  className={`px-3 py-1.5 border rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                    downloadedItems[selectedRes.id]
                      ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/30"
                      : "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-base)]"
                  }`}
                >
                  {downloadingItems[selectedRes.id] ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />{" "}
                      {t("Downloading...")}
                    </>
                  ) : downloadedItems[selectedRes.id] ? (
                    <>
                      <CheckCircle className="w-4 h-4" />{" "}
                      {t("Download Complete")}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> {t("Download")}
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveRes(null)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[var(--bg-base)] p-8 flex items-center justify-center overflow-auto relative font-mono">
              {selectedRes.type === "Video" ? (
                <div className="w-full max-w-3xl aspect-video bg-black/50 rounded-xl flex items-center justify-center border border-[var(--border-muted)] shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[var(--accent-primary)]/20"></div>
                  <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-all cursor-pointer z-10" />
                  <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded overflow-hidden">
                    <div className="w-1/3 h-full bg-[var(--accent-primary)]"></div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-3xl bg-[var(--bg-card)] shadow-xl min-h-[800px] border border-[var(--border-subtle)] rounded p-12 text-[var(--text-primary)]">
                  <h1 className="text-3xl font-bold font-sans mb-8 border-b pb-4">
                    {t(selectedRes.title)}
                  </h1>
                  <p className="mb-6 leading-relaxed text-sm">
                    {t(
                      "This is a simulated document view for standard operating procedures and references.",
                    )}
                    <br />
                    {t(
                      "The actual content would be loaded from a secure documentation repository or CMS.",
                    )}
                  </p>
                  <p className="mb-6 leading-relaxed text-sm">
                    <strong>{t("1.0 Scope and Applicability")}</strong>
                    <br />
                    <br />
                    {t(
                      "This procedure applies to all Level 2 and Level 3 operators maintaining the thermal management matrices and core subsystem distribution networks.",
                    )}
                  </p>
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded my-8 text-sm text-slate-600">
                    {t(
                      "Confidential. Property of Silicon-Melt Core Operations.",
                    )}{" "}
                    <br />
                    {t("Distribution limited to authorized personnel.")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
