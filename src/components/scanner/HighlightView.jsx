import React from "react";
import { AlertCircle, CheckCircle, Info, Lock, ShieldAlert } from "lucide-react";

export default function HighlightView({ scanResult }) {
  if (!scanResult) return null;

  const { sanitizedText, redactions, engines, highlightedEvidence } = scanResult;

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
      return <p className="leading-relaxed text-sm sm:text-base" style={{ color: "var(--ink)" }}>{sanitizedText}</p>;
    }

    const escapedTokens = allTokens
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);

    const regex = new RegExp(`(${escapedTokens.join("|")})`, "gi");
    const parts = sanitizedText.split(regex);

    return (
      <p className="leading-relaxed text-sm sm:text-base whitespace-pre-wrap" style={{ color: "var(--ink)" }}>
        {parts.map((part, index) => {
          const lowerPart = part.toLowerCase();

          if (part.startsWith("[") && part.endsWith("]")) {
            return (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium mx-1"
                style={{
                  background: "rgba(6,182,212,0.12)",
                  color: "#67e8f9",
                  border: "1px solid rgba(6,182,212,0.30)",
                }}
                title="Data sensitif otomatis disamarkan oleh Privacy Scrubber"
              >
                <Lock className="w-3 h-3 inline" style={{ color: "#22d3ee" }} />
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
                className="font-semibold px-1 py-0.5 rounded mx-0.5 cursor-help transition-all"
                style={{
                  background: "rgba(239,68,68,0.20)",
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
    <div className="space-y-6">
      {/* Highlighted Text Box */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 mb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <h3 className="font-semibold text-base" style={{ color: "var(--ink)" }}>
              Bedah Sorotan Kalimat Manipulatif (Explainable Evidence)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5" style={{ color: "#fca5a5" }}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(239,68,68,0.50)", border: "1px solid #ef4444" }}></span>
              Pola Jebakan
            </span>
            <span className="flex items-center gap-1.5" style={{ color: "#67e8f9" }}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(6,182,212,0.40)", border: "1px solid #06b6d4" }}></span>
              Sensor Privasi
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(4,6,15,0.60)", border: "1px solid var(--border)" }}>
          {renderHighlightedText()}
        </div>

        {redactions && redactions.length > 0 && (
          <div
            className="rounded-xl p-3 flex items-start gap-2.5 text-xs"
            style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.22)", color: "#a5f3fc" }}
          >
            <Lock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#22d3ee" }} />
            <div>
              <span className="font-semibold" style={{ color: "#67e8f9" }}>Perlindungan Privasi Aktif: </span>
              Ditemukan dan disamarkan data sensitif: {redactions.join(", ")}. Data ini tidak diproses dalam bentuk mentah.
            </div>
          </div>
        )}
      </div>

      {/* 6 Engine Detail Cards */}
      <div className="glass-card p-5 sm:p-6">
        <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: "var(--ink)" }}>
          <Info className="w-5 h-5" style={{ color: "var(--accent)" }} />
          Rincian Hasil 6 Modul Pemeriksaan (Scam Engines)
        </h3>

        <div className="space-y-3">
          {engines.map((engine) => {
            const isDanger = engine.status === "DANGER";
            return (
              <div
                key={engine.id}
                className="p-4 rounded-xl transition-all"
                style={
                  isDanger
                    ? { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.28)" }
                    : { background: "rgba(150,175,230,0.04)", border: "1px solid var(--border)" }
                }
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isDanger ? (
                      <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#f87171" }} />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#10b981" }} />
                    )}
                    <span className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{engine.name}</span>
                    <span
                      className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded"
                      style={{ background: "rgba(150,175,230,0.08)", color: "var(--muted)", border: "1px solid var(--border)" }}
                    >
                      {engine.category}
                    </span>
                  </div>

                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto"
                    style={
                      isDanger
                        ? { background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.30)", color: "#f87171" }
                        : { background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.30)", color: "#10b981" }
                    }
                  >
                    {isDanger ? `BAHAYA (+${engine.score} Poin)` : "AMAN"}
                  </span>
                </div>

                <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                  {engine.explanation}
                </p>

                {isDanger && (
                  <div className="space-y-2 pt-2" style={{ borderTop: "1px solid rgba(239,68,68,0.15)" }}>
                    {engine.evidence && engine.evidence.length > 0 && (
                      <div className="text-xs">
                        <span className="font-semibold" style={{ color: "#f87171" }}>Bukti Kata/Frasa: </span>
                        <div className="inline-flex flex-wrap gap-1 mt-1">
                          {engine.evidence.map((ev, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded font-mono text-[11px]"
                              style={{
                                background: "rgba(239,68,68,0.15)",
                                color: "#fca5a5",
                                border: "1px solid rgba(239,68,68,0.30)",
                              }}
                            >
                              "{ev}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div
                      className="text-xs p-2.5 rounded-lg flex items-start gap-2"
                      style={{ background: "rgba(4,6,15,0.60)", border: "1px solid var(--border)", color: "var(--muted)" }}
                    >
                      <span className="font-bold shrink-0" style={{ color: "var(--accent)" }}>Langkah Cepat:</span>
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
