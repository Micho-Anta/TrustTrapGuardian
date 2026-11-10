import React, { useState } from "react";
import { AlertCircle, Check, CheckCircle, Copy, Info, Lock, ShieldAlert } from "lucide-react";

export default function HighlightView({ scanResult }) {
  const [copiedSanitized, setCopiedSanitized] = useState(false);

  if (!scanResult) return null;

  const { sanitizedText, redactions, engines, highlightedEvidence } = scanResult;

  const handleCopySanitized = () => {
    if (!sanitizedText) return;
    navigator.clipboard.writeText(sanitizedText);
    setCopiedSanitized(true);
    setTimeout(() => setCopiedSanitized(false), 2200);
  };

  // Highlight matches in text
  const renderHighlightedText = () => {
    if (!sanitizedText) return null;

    const evidenceWords = highlightedEvidence.map((h) => h.text).filter(Boolean);
    const redactionTokens = [
      "[NIK_DISAMARKAN]",
      "[KODE_OTP_DISAMARKAN]",
      "[REKENING_DISAMARKAN]",
      "[NOMOR_PANJANG_DISAMARKAN]",
      "[NOMOR_HP_DISAMARKAN]"
    ];

    const allTokens = [...new Set([...evidenceWords, ...redactionTokens])];
    if (allTokens.length === 0) {
      return <p className="leading-relaxed text-sm sm:text-base text-slate-200">{sanitizedText}</p>;
    }

    const escapedTokens = allTokens
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);

    const regex = new RegExp(`(${escapedTokens.join("|")})`, "gi");
    const parts = sanitizedText.split(regex);

    return (
      <p className="leading-relaxed text-sm sm:text-base text-slate-200 whitespace-pre-wrap">
        {parts.map((part, index) => {
          const lowerPart = part.toLowerCase();

          if (part.startsWith("[") && part.endsWith("]")) {
            return (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium mx-1"
                style={{
                  background: "rgba(6,182,212,0.10)",
                  color: "#67e8f9",
                  border: "1px solid rgba(6,182,212,0.25)",
                }}
                title="Data sensitif otomatis disamarkan oleh Privacy Scrubber"
              >
                <Lock className="w-3 h-3 inline text-cyan-400" />
                {part}
              </span>
            );
          }

          const matchedEv = highlightedEvidence.find(
            (ev) => ev.text.toLowerCase() === lowerPart
          );

          if (matchedEv) {
            return (
              <mark
                key={index}
                className="font-semibold px-1.5 py-0.5 rounded-md mx-0.5 cursor-help transition-all"
                style={{
                  background: "rgba(239,68,68,0.18)",
                  color: "#fca5a5",
                  borderBottom: "2px solid #ef4444",
                }}
                title={`Modul: ${matchedEv.engineName} (${matchedEv.reason})`}
              >
                {part}
              </mark>
            );
          }

          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Highlighted Text Box */}
      <div className="glass-card p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#5df0a8]" />
            <h3 className="font-bold text-base sm:text-lg text-white">
              Bedah Sorotan Kalimat Manipulatif (Explainable Evidence)
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-red-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500/50 border border-red-400"></span>
              Pola Jebakan
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/40 border border-cyan-400"></span>
              Sensor Privasi
            </span>
            <button
              onClick={handleCopySanitized}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
              style={{
                background: "rgba(150, 175, 230, 0.08)",
                border: "1px solid rgba(150, 175, 230, 0.15)",
                color: copiedSanitized ? "#5df0a8" : "var(--ink)",
              }}
              title="Salin teks yang telah disamarkan data pribadinya"
            >
              {copiedSanitized ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#5df0a8]" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin Teks Tersensor</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl"
          style={{
            background: "rgba(4, 6, 15, 0.45)",
            border: "1px solid rgba(150, 175, 230, 0.06)",
          }}
        >
          {renderHighlightedText()}
        </div>

        {redactions && redactions.length > 0 && (
          <div
            className="rounded-2xl p-4 flex items-start gap-3 text-xs"
            style={{
              background: "rgba(6,182,212,0.06)",
              border: "1px solid rgba(6,182,212,0.18)",
              color: "#a5f3fc",
            }}
          >
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
            <div className="leading-relaxed">
              <span className="font-bold text-cyan-300">Perlindungan Privasi Aktif: </span>
              Ditemukan dan disamarkan data sensitif: {redactions.join(", ")}. Data ini tidak diproses dalam bentuk mentah.
            </div>
          </div>
        )}
      </div>

      {/* Engine Detail Cards - No Heavy Borders */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2.5">
          <Info className="w-5 h-5 text-[#5df0a8]" />
          <span>Rincian Hasil {engines?.length || 10} Modul Pemeriksaan (Scam Engines)</span>
        </h3>

        <div className="space-y-3.5">
          {engines.map((engine) => {
            const isDanger = engine.status === "DANGER";
            return (
              <div
                key={engine.id}
                className="p-5 rounded-2xl transition-all"
                style={
                  isDanger
                    ? {
                        background: "rgba(239,68,68,0.06)",
                        border: "1px solid rgba(239,68,68,0.20)",
                      }
                    : {
                        background: "rgba(12,18,38,0.30)",
                        border: "1px solid rgba(150,175,230,0.06)",
                      }
                }
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    {isDanger ? (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0 text-[#5df0a8]" />
                    )}
                    <span className="font-bold text-sm sm:text-base text-white">{engine.name}</span>
                    <span
                      className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: "rgba(150,175,230,0.06)",
                        color: "var(--muted)",
                        border: "1px solid rgba(150,175,230,0.10)",
                      }}
                    >
                      {engine.category}
                    </span>
                  </div>

                  <span
                    className="text-xs font-bold px-3 py-0.5 rounded-full self-start sm:self-auto"
                    style={
                      isDanger
                        ? { background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }
                        : { background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }
                    }
                  >
                    {isDanger ? `BAHAYA (+${engine.score} Poin)` : "TIDAK TERDETEKSI"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 mb-3 leading-relaxed">
                  {engine.explanation}
                </p>

                {isDanger && (
                  <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                    {engine.evidence && engine.evidence.length > 0 && (
                      <div className="text-xs">
                        <span className="font-semibold text-red-300">Bukti Kata/Frasa: </span>
                        <div className="inline-flex flex-wrap gap-1.5 mt-1.5">
                          {engine.evidence.map((ev, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-md font-mono text-[11px]"
                              style={{
                                background: "rgba(239,68,68,0.12)",
                                color: "#fca5a5",
                                border: "1px solid rgba(239,68,68,0.24)",
                              }}
                            >
                              "{ev}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div
                      className="text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5 leading-relaxed"
                      style={{
                        background: "rgba(4,6,15,0.50)",
                        border: "1px solid rgba(150,175,230,0.06)",
                        color: "var(--muted)",
                      }}
                    >
                      <span className="font-bold shrink-0 text-[#5df0a8]">Langkah Cepat:</span>
                      <span className="text-slate-300">{engine.actionStep}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
