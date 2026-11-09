import React, { useEffect, useState } from "react";
import {
  AlertOctagon,
  CheckSquare,
  ExternalLink,
  LifeBuoy,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Square
} from "lucide-react";
import {
  CRITICAL_ENGINES,
  EMERGENCY_STEPS,
  OFFICIAL_CHANNELS,
  PREVENTIVE_STEPS,
  REPORTING_DISCLAIMER,
  getTriggeredEngineIds,
  sortGuides
} from "../../data/actGuides";

/**
 * Panic Triage (tab ACT).
 * `scanResult` bersifat opsional (hasil scanText()). Tanpa prop ini komponen
 * tampil seperti sebelumnya sebagai panduan umum; dengan prop ini panduan
 * otomatis menyesuaikan modus penipuan yang terdeteksi.
 */
export default function PanicTriage({ scanResult = null }) {
  const triggeredEngines = getTriggeredEngineIds(scanResult);
  const recommendedActions = scanResult?.recommendedActions ?? [];
  const hasCritical = triggeredEngines.some((id) => CRITICAL_ENGINES.includes(id));
  const scanKey = triggeredEngines.join(",");

  const [activeTab, setActiveTab] = useState(hasCritical ? "emergency" : "preventive"); // 'preventive' | 'emergency'
  const [completedSteps, setCompletedSteps] = useState({});

  // Saat hasil scan berganti: buka mode yang sesuai & kosongkan checklist.
  useEffect(() => {
    setActiveTab(hasCritical ? "emergency" : "preventive");
    setCompletedSteps({});
  }, [scanKey, hasCritical]);

  const toggleStep = (id) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Langkah yang relevan dengan hasil scan tampil paling atas (urutan lain tetap).
  const steps = (activeTab === "preventive" ? PREVENTIVE_STEPS : EMERGENCY_STEPS)
    .map((s) => ({ ...s, relevant: !!s.engineId && triggeredEngines.includes(s.engineId) }))
    .sort((a, b) => Number(b.relevant) - Number(a.relevant));

  const doneCount = steps.filter((s) => completedSteps[s.id]).length;
  const progress = steps.length ? (doneCount / steps.length) * 100 : 0;
  const guides = sortGuides(triggeredEngines);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header Panic Triage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-indigo-400" />
            Panduan Penyelamatan & Tindakan Darurat (Panic Triage)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pilih kondisi Anda saat ini untuk panduan langkah demi langkah yang terarah dan menenangkan.
          </p>
        </div>

        {/* Tab Switcher Kondisi */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("preventive")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "preventive"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Baru Terima Chat
          </button>
          <button
            onClick={() => setActiveTab("emergency")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "emergency"
                ? "bg-red-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            Terlanjur Klik / Transfer
          </button>
        </div>
      </div>

      {/* Konteks hasil scan */}
      {scanResult && (
        <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Dari Hasil Scan Anda
            <span className="normal-case font-medium text-slate-400">
              · {triggeredEngines.length} modus terdeteksi
            </span>
          </p>
          {recommendedActions.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300 leading-relaxed">
              {recommendedActions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Progress Checklist */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>
            Checklist · {doneCount}/{steps.length} selesai
          </span>
          <button
            onClick={() => setCompletedSteps({})}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 normal-case tracking-normal flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Ulang
          </button>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all ${activeTab === "emergency" ? "bg-red-500" : "bg-indigo-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist Interaktif */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isDone = !!completedSteps[step.id];
          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                isDone
                  ? "bg-emerald-950/20 border-emerald-800/40 opacity-75"
                  : activeTab === "emergency"
                  ? "bg-red-950/20 border-red-900/40 hover:border-red-700/60"
                  : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <button className="mt-0.5 text-indigo-400 shrink-0">
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  {step.priority && (
                    <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      {step.priority}
                    </span>
                  )}
                  {step.relevant && (
                    <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Relevan dengan hasil scan
                    </span>
                  )}
                </div>
                <h4 className={`text-sm font-semibold ${isDone ? "line-through text-slate-400" : "text-white"}`}>
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Panduan per Modus Penipuan */}
      <div className="pt-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <LifeBuoy className="w-4 h-4 text-indigo-400" />
          Panduan Per Modus Penipuan
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guides.map((g) => (
            <div
              key={g.engineId}
              className={`p-4 rounded-xl border text-xs ${
                g.relevant
                  ? "bg-indigo-950/20 border-indigo-500/40"
                  : "bg-slate-950/50 border-slate-800"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h5 className="text-sm font-semibold text-white">{g.title}</h5>
                {g.relevant && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Relevan dengan hasil scan
                  </span>
                )}
              </div>
              <ol className="list-decimal pl-4 mt-2 space-y-1 text-slate-300 leading-relaxed">
                {g.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="mt-3 text-[11px] text-slate-500">Siapkan: {g.docs.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nomor Kontak Darurat Resmi Indonesia */}
      <div className="pt-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          Kanal Bantuan & Pelaporan Resmi Nasional
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OFFICIAL_CHANNELS.map((c) =>
            c.href ? (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-start justify-between gap-2 text-xs group"
              >
                <div>
                  <div className="font-semibold text-white group-hover:text-indigo-300">{c.name}</div>
                  <div className="text-[11px] text-slate-400">{c.role}</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">{c.contact}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Siapkan: {c.prep}</div>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-indigo-400" />
              </a>
            ) : (
              <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="font-semibold text-white">{c.name}</div>
                <div className="text-[11px] text-slate-400">{c.role}</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">{c.contact}</div>
                <div className="text-[10px] text-slate-500 mt-1">Siapkan: {c.prep}</div>
              </div>
            )
          )}
        </div>

        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">{REPORTING_DISCLAIMER}</p>
      </div>
    </div>
  );
}
