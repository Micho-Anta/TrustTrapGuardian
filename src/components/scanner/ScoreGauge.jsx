import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Zap, ArrowRight, Info } from "lucide-react";

/**
 * ScoreGauge — Ascend polished theme.
 * Props:
 *   summary   — scan summary object
 *   engines   — array of engine results
 *   onGoToAct — callback to switch parent tab to 'act' (Seamless Handoff)
 */
export default function ScoreGauge({ summary, engines = [], onGoToAct }) {
  if (!summary) return null;

  const { score, triggeredEngines, totalEngines, riskLevel, comboBonus, combosTriggered } = summary;

  // Visual calculations for radial circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#10b981";
  let textColor = "#10b981";
  let badgeBg = "rgba(16,185,129,0.10)";
  let badgeBorder = "rgba(16,185,129,0.25)";
  let badgeText = "#6ee7b7";

  if (score >= 70) {
    strokeColor = "#ef4444";
    textColor = "#f87171";
    badgeBg = "rgba(239,68,68,0.10)";
    badgeBorder = "rgba(239,68,68,0.25)";
    badgeText = "#fca5a5";
  } else if (score >= 35) {
    strokeColor = "#f59e0b";
    textColor = "#fbbf24";
    badgeBg = "rgba(245,158,11,0.10)";
    badgeBorder = "rgba(245,158,11,0.25)";
    badgeText = "#fcd34d";
  } else if (score > 0) {
    strokeColor = "#eab308";
    textColor = "#facc15";
    badgeBg = "rgba(234,179,8,0.10)";
    badgeBorder = "rgba(234,179,8,0.25)";
    badgeText = "#fde047";
  }

  // Show Seamless Handoff button for HIGH or MEDIUM risk
  const showHandoff = score >= 35 && typeof onGoToAct === "function";

  return (
    <div className="glass-card p-6 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
        {/* Radial Gauge with atmospheric glow & formula explanation */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative flex items-center justify-center">
            <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
              <defs>
                <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Background track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="rgba(150,175,230,0.08)"
                strokeWidth="11"
                fill="transparent"
              />
              {/* Score arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="11"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                filter="url(#scoreGlow)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Centered score text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold tracking-tight" style={{ color: textColor }}>
                {score}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
                Skor Risiko / 100
              </span>
            </div>
          </div>

          {/* Keterangan / Tooltip Formula Kalkulasi Dewan Juri */}
          <div
            className="mt-3 text-[10px] sm:text-[11px] font-mono text-slate-400 text-center flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              background: "rgba(12,18,38,0.50)",
              border: "1px solid rgba(150,175,230,0.08)",
            }}
            title="Transparansi Rumus Penilaian Heuristik"
          >
            <Info className="w-3 h-3 text-[#5df0a8] shrink-0" />
            <span>Formula: Min(100, Base Score × Combo Multiplier 1.25x)</span>
          </div>
        </div>

        {/* Status & Analysis Summary */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
            >
              {score >= 70 ? (
                <ShieldAlert className="w-4 h-4" />
              ) : score >= 35 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {riskLevel}
            </span>

            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium text-slate-300"
              style={{ background: "rgba(150,175,230,0.06)", border: "1px solid rgba(150,175,230,0.09)" }}
            >
              <span className="font-bold text-white">{triggeredEngines}</span>
              &nbsp;dari {totalEngines} Modul Menyala
            </span>

            {comboBonus > 1.0 && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold animate-pulse"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
              >
                <Zap className="w-3.5 h-3.5 text-red-400" />
                Combo Multiplier {comboBonus}x
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {score >= 70
              ? "Teks chat menunjukkan pola penipuan terstruktur dengan teknik manipulasi psikologis dan desakan berbahaya. Jangan lakukan interaksi lanjutan."
              : score >= 35
              ? "Ditemukan beberapa indikator mencurigakan yang lazim digunakan dalam rekayasa sosial. Verifikasi langsung ke kontak resmi sebelum merespon."
              : "Tidak ditemukan pola manipulasi umum yang mencolok. Tetap jaga kerahasiaan data pribadi seperti password dan kode OTP."}
          </p>

          {combosTriggered && combosTriggered.length > 0 && (
            <div
              className="rounded-2xl p-3 text-xs"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)", color: "#fca5a5" }}
            >
              <span className="font-semibold text-red-300">Peringatan Kombinasi Modus: </span>
              {combosTriggered.join(", ")}
            </div>
          )}

          {/* ── Seamless Handoff Button (Pill Capsule Mint Glow) ── */}
          {showHandoff && (
            <div className="pt-2">
              <button
                onClick={onGoToAct}
                className="btn-ascend w-full sm:w-auto"
                style={{
                  background: "linear-gradient(180deg, #5df0a8, #2fd38a)",
                  color: "#032018",
                  fontWeight: 600,
                  borderRadius: "999px",
                  boxShadow: "0 10px 28px -6px rgba(93,240,168,0.45)",
                }}
              >
                <span>🚨 Terlanjur Klik / Transfer? Buka Penyelamatan Darurat</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6 Engine Status Mini Bar - Cleaner & Thinner Borders */}
      <div className="pt-6 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {engines.map((eng) => {
          const isDanger = eng.status === "DANGER";
          return (
            <div
              key={eng.id}
              className="p-3 rounded-2xl text-xs flex flex-col justify-between transition-all"
              style={
                isDanger
                  ? { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#fca5a5" }
                  : { background: "rgba(12,18,38,0.30)", border: "1px solid rgba(150,175,230,0.06)", color: "var(--muted)" }
              }
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-semibold truncate text-slate-200" title={eng.name}>
                  {eng.name}
                </span>
                {isDanger ? (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                )}
              </div>
              <span
                className="text-[10px] uppercase font-bold tracking-wider"
                style={{ color: isDanger ? "#f87171" : "rgba(150,175,230,0.35)" }}
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
