import React from "react";
import { Search, Sparkles, Trash2, ArrowRight } from "lucide-react";
import { JUDGE_PRESETS } from "../../data/judgePresets";

export default function OmniboxInput({ text, setText, onAnalyze, onClear, isAnalyzing }) {
  const handlePresetSelect = (preset) => {
    setText(preset.text);
    // Instant scan trigger
    setTimeout(() => {
      onAnalyze(preset.text);
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Preset Cards */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" style={{ color: "#f59e0b" }} />
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink)" }}>
            Skenario Cepat Uji Juri (1-Click Presets)
          </h3>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "rgba(245,158,11,0.10)",
              color: "#fcd34d",
              border: "1px solid rgba(245,158,11,0.20)",
            }}
          >
            Siap Uji Langsung
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {JUDGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className="text-left p-3 rounded-xl transition-all group flex flex-col justify-between"
              style={{
                background: "rgba(12,18,38,0.70)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(93,240,168,0.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                    {preset.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" style={{ color: "var(--muted)" }} />
                </div>
                <div className="text-xs sm:text-sm font-semibold line-clamp-1" style={{ color: "var(--ink)" }}>
                  {preset.title}
                </div>
                <div className="text-[11px] line-clamp-1 mt-0.5" style={{ color: "var(--muted)" }}>
                  {preset.tagline}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Omnibox Textarea */}
      <div
        className="rounded-2xl shadow-2xl transition-all"
        style={{
          background: "rgba(12,18,38,0.70)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--border)",
        }}
        onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(93,240,168,0.40)"}
        onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border)"}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: "1px solid rgba(150,175,230,0.10)" }}>
            <label className="text-xs font-medium flex items-center gap-2" style={{ color: "var(--muted)" }}>
              <Search className="w-4 h-4" style={{ color: "var(--accent)" }} />
              <span>Tempel Teks Chat WhatsApp / SMS / Tawaran Loker / Link Mencurigakan</span>
            </label>
            {text && (
              <button
                onClick={onClear}
                className="text-xs flex items-center gap-1 transition-colors"
                style={{ color: "var(--muted)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
                title="Hapus Teks"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: 'Selamat! Anda terpilih kerja freelance like YouTube dengan komisi harian Rp500rb. Segera transfer biaya pendaftaran Rp50rb dalam 15 menit...'"
            rows={5}
            className="w-full bg-transparent text-sm sm:text-base focus:outline-none resize-none leading-relaxed"
            style={{ color: "var(--ink)" }}
          />
        </div>

        {/* Footer Action Bar */}
        <div
          className="px-4 py-3 sm:px-5 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ background: "rgba(4,6,15,0.50)", borderTop: "1px solid rgba(150,175,230,0.08)" }}
        >
          <div className="text-xs flex items-center gap-2" style={{ color: "var(--muted)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }}></span>
            <span>Sensor Privasi Aktif (NIK/Rekening/OTP otomatis disamarkan)</span>
          </div>

          <button
            onClick={() => onAnalyze(text)}
            disabled={!text.trim() || isAnalyzing}
            className="btn-ascend w-full sm:w-auto"
          >
            {isAnalyzing ? (
              <span>Menganalisis...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Bedah Pesan Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
