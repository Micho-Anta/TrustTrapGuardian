import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Zap } from "lucide-react";

export default function ScoreGauge({ summary, engines = [] }) {
  if (!summary) return null;

  const { score, triggeredEngines, totalEngines, riskLevel, riskColor, comboBonus, combosTriggered } = summary;

  // Visual calculations for radial circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#10b981"; // emerald
  let textColor = "text-emerald-400";
  let badgeBg = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";

  if (score >= 70) {
    strokeColor = "#ef4444"; // red
    textColor = "text-red-400";
    badgeBg = "bg-red-500/10 border-red-500/30 text-red-300";
  } else if (score >= 35) {
    strokeColor = "#f59e0b"; // amber
    textColor = "text-amber-400";
    badgeBg = "bg-amber-500/10 border-amber-500/30 text-amber-300";
  } else if (score > 0) {
    strokeColor = "#eab308"; // yellow
    textColor = "text-yellow-400";
    badgeBg = "bg-yellow-500/10 border-yellow-500/30 text-yellow-300";
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Radial Gauge ala VirusTotal */}
        <div className="relative flex items-center justify-center">
          <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Animated Score circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered score text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-extrabold tracking-tight ${textColor}`}>
              {score}
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Skor Risiko / 100
            </span>
          </div>
        </div>

        {/* Status & Analysis Summary */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
              {score >= 70 ? (
                <ShieldAlert className="w-4 h-4" />
              ) : score >= 35 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {riskLevel}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
              <span className="font-bold text-white">{triggeredEngines}</span> dari {totalEngines} Modul Menyala
            </span>

            {comboBonus > 1.0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse">
                <Zap className="w-3.5 h-3.5" />
                Combo Multiplier {comboBonus}x
              </span>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {score >= 70
              ? "Teks chat menunjukkan pola penipuan terstruktur dengan teknik manipulasi psikologis dan desakan berbahaya. Jangan lakukan interaksi lanjutan."
              : score >= 35
              ? "Ditemukan beberapa indikator mencurigakan yang lazim digunakan dalam rekayasa sosial. Verifikasi langsung ke kontak resmi sebelum merespon."
              : "Tidak ditemukan pola manipulasi umum yang mencolok. Tetap jaga kerahasiaan data pribadi seperti password dan kode OTP."}
          </p>

          {combosTriggered && combosTriggered.length > 0 && (
            <div className="bg-rose-950/40 border border-rose-800/40 rounded-lg p-2.5 text-xs text-rose-200">
              <span className="font-semibold text-rose-300">Peringatan Kombinasi Modus: </span>
              {combosTriggered.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* 6 Engine Status Bar */}
      <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {engines.map((eng) => {
          const isDanger = eng.status === "DANGER";
          return (
            <div
              key={eng.id}
              className={`p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                isDanger
                  ? "bg-red-950/30 border-red-800/50 text-red-200"
                  : "bg-slate-800/40 border-slate-800 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold truncate" title={eng.name}>
                  {eng.name}
                </span>
                {isDanger ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </div>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider ${
                  isDanger ? "text-red-400" : "text-slate-500"
                }`}
              >
                {isDanger ? "TERDETEKSI" : "BERSIH"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
