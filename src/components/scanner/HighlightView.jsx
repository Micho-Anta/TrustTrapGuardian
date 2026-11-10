import React, { useState } from "react";
import { AlertCircle, Check, CheckCircle, Copy, Info, Lock, ShieldAlert } from "lucide-react";
import Disclosure from "../ui/Disclosure";

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
      return <p className="leading-relaxed text-sm sm:text-base text-slate-200 [overflow-wrap:anywhere] break-words">{sanitizedText}</p>;
    }

    const escapedTokens = allTokens
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);

    const regex = new RegExp(`(${escapedTokens.join("|")})`, "gi");
    const parts = sanitizedText.split(regex);

    return (
      <p className="leading-relaxed text-sm sm:text-base text-slate-200 whitespace-pre-wrap [overflow-wrap:anywhere] break-words">
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

  const dangerEngines = (engines || []).filter((e) => e.status === "DANGER");
  const cleanEngines = (engines || []).filter((e) => e.status !== "DANGER");

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Highlighted Text Box */}
      <div className="glass-card p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#5df0a8] shrink-0" />
            <h3 className="font-bold text-base sm:text-lg text-white">
              Bedah Sorotan Kalimat Manipulatif (Explainable Evidence)
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-amber-200">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500/40 border border-red-400/70"></span>
              Pola Jebakan
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/40 border border-cyan-400"></span>
              Sensor Privasi
            </span>
            <button
              type="button"
              onClick={handleCopySanitized}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#5df0a8] focus-visible:outline-offset-2"
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
            className="rounded-2xl p-3.5 flex items-start gap-3 text-xs"
            style={{
              background: "rgba(6,182,212,0.06)",
              border: "1px solid rgba(6,182,212,0.18)",
              color: "#a5f3fc",
            }}
          >
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
            <div className="leading-relaxed [overflow-wrap:anywhere] break-words">
              <span className="font-bold text-cyan-300">Perlindungan Privasi Aktif: </span>
              Ditemukan dan disamarkan data sensitif: {redactions.join(", ")}. Data ini tidak diproses dalam bentuk mentah.
            </div>
          </div>
        )}
      </div>

      {/* Engine Detail Cards with Progressive Disclosure */}
      <div className="glass-card p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2.5">
            <Info className="w-5 h-5 text-[#5df0a8] shrink-0" />
            <span>Rincian Hasil {engines?.length || 11} Modul Pemeriksaan (Scam Engines)</span>
          </h3>
          <span className="text-xs text-slate-400">
            {dangerEngines.length} terdeteksi · {cleanEngines.length} tanpa temuan
          </span>
        </div>

        {dangerEngines.length > 0 ? (
          <div className="space-y-3">
            {dangerEngines.map((engine) => (
              <Disclosure
                key={engine.id}
                icon={<AlertCircle className="w-4 h-4 shrink-0 text-amber-400" aria-hidden="true" />}
                title={engine.name}
                summary={engine.category}
                badge={
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.28)",
                      color: "#fcd34d",
                    }}
                  >
                    BAHAYA (+{engine.score} Poin)
                  </span>
                }
                defaultOpen={false}
                panelClassName="px-2 pb-2"
              >
                <div
                  className="p-4 sm:p-5 rounded-2xl space-y-3"
                  style={{
                    background: "rgba(12,18,38,0.45)",
                    border: "1px solid rgba(150,175,230,0.08)",
                  }}
                >
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed [overflow-wrap:anywhere] break-words">
                    {engine.explanation}
                  </p>

                  {engine.evidence && engine.evidence.length > 0 && (
                    <div className="text-xs pt-2 border-t border-white/[0.06]">
                      <span className="font-semibold text-slate-300">Bukti Kata/Frasa: </span>
                      <div className="inline-flex flex-wrap gap-1.5 mt-1.5">
                        {engine.evidence.map((ev, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-md font-mono text-[11px] [overflow-wrap:anywhere] break-words"
                            style={{
                              background: "rgba(150,175,230,0.08)",
                              color: "#e2e8f0",
                              border: "1px solid rgba(150,175,230,0.16)",
                            }}
                          >
                            "{ev}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className="text-xs sm:text-sm p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2.5 leading-relaxed"
                    style={{
                      background: "rgba(4,6,15,0.50)",
                      border: "1px solid rgba(150,175,230,0.08)",
                      color: "var(--muted)",
                    }}
                  >
                    <span className="font-bold shrink-0 text-[#5df0a8]">Langkah Cepat:</span>
                    <span className="text-slate-300 [overflow-wrap:anywhere] break-words">{engine.actionStep}</span>
                  </div>
                </div>
              </Disclosure>
            ))}
          </div>
        ) : (
          <div
            className="p-4 rounded-2xl text-xs sm:text-sm text-slate-300 flex items-center gap-2.5"
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.18)",
            }}
          >
            <CheckCircle className="w-4 h-4 shrink-0 text-[#5df0a8]" />
            <span>Tidak ada modul yang mendeteksi pola penipuan pada pesan ini.</span>
          </div>
        )}

        {cleanEngines.length > 0 && (
          <div className="pt-2 border-t border-white/[0.06]">
            <Disclosure
              icon={<CheckCircle className="w-4 h-4 shrink-0 text-[#5df0a8]" aria-hidden="true" />}
              title={`Modul tanpa temuan indikasi (${cleanEngines.length} modul)`}
              badge={
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                  style={{
                    background: "rgba(16,185,129,0.10)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    color: "#10b981",
                  }}
                >
                  TIDAK TERDETEKSI
                </span>
              }
              defaultOpen={false}
              panelClassName="space-y-2.5 pt-3"
            >
              {cleanEngines.map((engine) => (
                <div
                  key={engine.id}
                  className="p-4 rounded-2xl space-y-1.5"
                  style={{
                    background: "rgba(12,18,38,0.30)",
                    border: "1px solid rgba(150,175,230,0.06)",
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#5df0a8]" />
                      <span className="font-bold text-xs sm:text-sm text-white [overflow-wrap:anywhere] break-words">
                        {engine.name}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
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
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0"
                      style={{
                        background: "rgba(16,185,129,0.10)",
                        border: "1px solid rgba(16,185,129,0.22)",
                        color: "#10b981",
                      }}
                    >
                      TIDAK TERDETEKSI
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed [overflow-wrap:anywhere] break-words">
                    {engine.explanation}
                  </p>
                </div>
              ))}
            </Disclosure>
          </div>
        )}
      </div>
    </div>
  );
}
