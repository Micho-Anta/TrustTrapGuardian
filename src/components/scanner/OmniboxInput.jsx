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
    <div className="space-y-6 sm:space-y-8">
      {/* Preset Cards - Clean & Airy */}
      <div className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#5df0a8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Skenario Cepat Uji Juri (1-Click Presets)
            </h3>
          </div>
          <span
            className="text-[11px] px-3 py-1 rounded-full font-medium"
            style={{
              background: "rgba(93, 240, 168, 0.08)",
              color: "var(--accent)",
              border: "1px solid rgba(93, 240, 168, 0.20)",
            }}
          >
            Siap Uji Langsung
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {JUDGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className="text-left p-4 rounded-2xl transition-all group flex flex-col justify-between"
              style={{
                background: "rgba(12, 18, 38, 0.40)",
                border: "1px solid rgba(150, 175, 230, 0.07)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(93, 240, 168, 0.35)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(150, 175, 230, 0.07)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5df0a8]">
                    {preset.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-[#5df0a8]" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-slate-100 line-clamp-1">
                  {preset.title}
                </div>
                <div className="text-xs text-slate-400 line-clamp-1 mt-1 leading-relaxed">
                  {preset.tagline}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Omnibox Textarea - Soft Glass Card */}
      <div className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-white/[0.06]">
          <label className="text-xs sm:text-sm font-medium text-slate-300 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#5df0a8]" />
            <span>Tempel Teks Chat WhatsApp / SMS / Tawaran Loker / Link Mencurigakan</span>
          </label>
          {text && (
            <button
              onClick={onClear}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors hover:bg-red-500/10"
              title="Hapus Teks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: 'Selamat! Anda terpilih kerja freelance like YouTube dengan komisi harian Rp500rb. Segera transfer biaya pendaftaran Rp50rb dalam 15 menit...'"
          rows={5}
          className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
        />

        {/* Footer Action Bar */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5df0a8] shadow-[0_0_8px_rgba(93,240,168,0.6)]"></span>
            <span>Sensor Privasi Aktif (NIK/Rekening/OTP otomatis disamarkan secara lokal)</span>
          </div>

          <button
            onClick={() => onAnalyze(text)}
            disabled={!text.trim() || isAnalyzing}
            className="btn-ascend w-full sm:w-auto"
          >
            {isAnalyzing ? (
              <span>Menganalisis Pola...</span>
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
