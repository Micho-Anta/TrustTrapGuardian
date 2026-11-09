import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Zap } from "lucide-react";

/**
 * ScoreGauge — Ascend themed.
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
  let badgeBg = "rgba(16,185,129,0.12)";
  let badgeBorder = "rgba(16,185,129,0.35)";
  let badgeText = "#6ee7b7";

  if (score >= 70) {
    strokeColor = "#ef4444";
    textColor = "#f87171";
    badgeBg = "rgba(239,68,68,0.12)";
    badgeBorder = "rgba(239,68,68,0.35)";
    badgeText = "#fca5a5";
  } else if (score >= 35) {
    strokeColor = "#f59e0b";
    textColor = "#fbbf24";
    badgeBg = "rgba(245,158,11,0.12)";
    badgeBorder = "rgba(245,158,11,0.35)";
    badgeText = "#fcd34d";
  } else if (score > 0) {
    strokeColor = "#eab308";
    textColor = "#facc15";
    badgeBg = "rgba(234,179,8,0.12)";
    badgeBorder = "rgba(234,179,8,0.35)";
    badgeText = "#fde047";
  }

  // Show Seamless Handoff button for HIGH or MEDIUM risk
  const showHandoff = score >= 35 && typeof onGoToAct === "function";

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Radial Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Glow filter */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Background track */}
            <circle cx="80" cy="80" r={radius} stroke="rgba(150,175,230,0.10)" strokeWidth="12" fill="transparent" />
            {/* Score arc */}
            <circle
              cx="80" cy="80" r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              filter="url(#glow)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered score text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight" style={{ color: textColor }}>
              {score}
            </span>
            <span className="text-xs uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
              Skor Risiko / 100
            </span>
          </div>
        </div>

        {/* Status & Analysis Summary */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
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
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: "rgba(150,175,230,0.08)", border: "1px solid var(--border)", color: "var(--muted)" }}
            >
              <span className="font-bold" style={{ color: "var(--ink)" }}>{triggeredEngines}</span>
              &nbsp;dari {totalEngines} Modul Menyala
            </span>

            {comboBonus > 1.0 && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.40)", color: "#fca5a5" }}
              >
                <Zap className="w-3.5 h-3.5" />
                Combo Multiplier {comboBonus}x
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {score >= 70
              ? "Teks chat menunjukkan pola penipuan terstruktur dengan teknik manipulasi psikologis dan desakan berbahaya. Jangan lakukan interaksi lanjutan."
              : score >= 35
              ? "Ditemukan beberapa indikator mencurigakan yang lazim digunakan dalam rekayasa sosial. Verifikasi langsung ke kontak resmi sebelum merespon."
              : "Tidak ditemukan pola manipulasi umum yang mencolok. Tetap jaga kerahasiaan data pribadi seperti password dan kode OTP."}
          </p>

          {combosTriggered && combosTriggered.length > 0 && (
            <div
              className="rounded-xl p-2.5 text-xs"
              style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
            >
              <span className="font-semibold" style={{ color: "#f87171" }}>Peringatan Kombinasi Modus: </span>
              {combosTriggered.join(", ")}
            </div>
          )}

          {/* ── Seamless Handoff Button ── */}
          {showHandoff && (
            <button
              onClick={onGoToAct}
              className="w-full sm:w-auto mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.20), rgba(239,68,68,0.10))",
                border: "1px solid rgba(239,68,68,0.45)",
                color: "#fca5a5",
                boxShadow: "0 4px 20px -6px rgba(239,68,68,0.40)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(239,68,68,0.30), rgba(239,68,68,0.15))";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.65)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(239,68,68,0.20), rgba(239,68,68,0.10))";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.45)";
              }}
            >
              🚨 Terlanjur Klik / Transfer? Buka Penyelamatan Darurat →
            </button>
          )}
        </div>
      </div>

      {/* 6 Engine Status Mini Bar */}
      <div
        className="pt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {engines.map((eng) => {
          const isDanger = eng.status === "DANGER";
          return (
            <div
              key={eng.id}
              className="p-2.5 rounded-xl text-xs flex flex-col justify-between transition-all"
              style={
                isDanger
                  ? { background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.30)", color: "#fca5a5" }
                  : { background: "rgba(150,175,230,0.05)", border: "1px solid var(--border)", color: "var(--muted)" }
              }
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold truncate" title={eng.name}>{eng.name}</span>
                {isDanger ? (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: "#f87171" }} />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(150,175,230,0.30)" }} />
                )}
              </div>
              <span
                className="text-[10px] uppercase font-bold tracking-wider"
                style={{ color: isDanger ? "#f87171" : "rgba(150,175,230,0.40)" }}
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
