import React from "react";
import { AlertCircle, CheckCircle, Info, Lock, ShieldAlert } from "lucide-react";

export default function HighlightView({ scanResult }) {
  if (!scanResult) return null;

  const { sanitizedText, redactions, engines, highlightedEvidence } = scanResult;

  // Highlight matches in text
  const renderHighlightedText = () => {
    if (!sanitizedText) return null;

    // Collect all tokens to highlight: both redactions and evidence words
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
      return <p className="text-slate-200 leading-relaxed text-sm sm:text-base">{sanitizedText}</p>;
    }

    // Escape regex characters
    const escapedTokens = allTokens
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);

    const regex = new RegExp(`(${escapedTokens.join("|")})`, "gi");
    const parts = sanitizedText.split(regex);

    return (
      <p className="text-slate-200 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
        {parts.map((part, index) => {
          const lowerPart = part.toLowerCase();

          // Check if it's a privacy redaction token
          if (part.startsWith("[") && part.endsWith("]")) {
            return (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded text-xs font-mono font-medium mx-1"
                title="Data sensitif otomatis disamarkan oleh Privacy Scrubber"
              >
                <Lock className="w-3 h-3 text-cyan-400 inline" />
                {part}
              </span>
            );
          }

          // Check if it matches an evidence trigger
          const matchedEv = highlightedEvidence.find(
            (ev) => ev.text.toLowerCase() === lowerPart
          );

          if (matchedEv) {
            return (
              <mark
                key={index}
                className="bg-red-500/20 text-red-200 border-b-2 border-red-500 font-semibold px-1 py-0.5 rounded mx-0.5 cursor-help transition-all hover:bg-red-500/30"
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
    <div className="space-y-6">
      {/* Box Sorotan Stabilo Teks (Highlighted View) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">
              Bedah Sorotan Kalimat Manipulatif (Explainable Evidence)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-red-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500/50 border border-red-400"></span>
              Pola Jebakan
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/50 border border-cyan-400"></span>
              Sensor Privasi
            </span>
          </div>
        </div>

        {/* Teks dengan Stabilo */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
          {renderHighlightedText()}
        </div>

        {/* Rangkuman Sensor Privasi jika ada */}
        {redactions && redactions.length > 0 && (
          <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-cyan-200">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">Perlindungan Privasi Aktif: </span>
              Ditemukan dan disamarkan data sensitif: {redactions.join(", ")}. Data ini tidak diproses dalam bentuk mentah.
            </div>
          </div>
        )}
      </div>

      {/* Rincian 6 Modul Deteksi (Tab Detail ala VirusTotal) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <h3 className="font-semibold text-white text-base mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-400" />
          Rincian Hasil 6 Modul Pemeriksaan (Scam Engines)
        </h3>

        <div className="space-y-3">
          {engines.map((engine) => {
            const isDanger = engine.status === "DANGER";
            return (
              <div
                key={engine.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDanger
                    ? "bg-red-950/20 border-red-900/40"
                    : "bg-slate-950/40 border-slate-800/60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isDanger ? (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    <span className="font-semibold text-sm text-white">{engine.name}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {engine.category}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                      isDanger
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    {isDanger ? `BAHAYA (+${engine.score} Poin)` : "AMAN"}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                  {engine.explanation}
                </p>

                {isDanger && (
                  <div className="space-y-2 pt-2 border-t border-red-950/50">
                    {engine.evidence && engine.evidence.length > 0 && (
                      <div className="text-xs">
                        <span className="font-semibold text-red-300">Bukti Kata/Frasa: </span>
                        <div className="inline-flex flex-wrap gap-1 mt-1">
                          {engine.evidence.map((ev, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-red-900/40 text-red-200 border border-red-800/60 font-mono text-[11px]"
                            >
                              "{ev}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-slate-200 flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">Langkah Cepat:</span>
                      <span>{engine.actionStep}</span>
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
