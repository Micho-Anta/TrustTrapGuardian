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
      {/* 4 Tombol Skenario Uji 1-Klik Khusus Juri */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Skenario Cepat Uji Juri (1-Click Presets)
          </h3>
          <span className="text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded-full font-medium">
            Siap Uji Langsung
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {JUDGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className="text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {preset.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-indigo-200 line-clamp-1">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {preset.tagline}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Kotak Input Omnibox Utama */}
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Tempel Teks Chat WhatsApp / SMS / Tawaran Loker / Link Mencurigakan</span>
            </label>
            {text && (
              <button
                onClick={onClear}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
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
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Footer Omnibox Action Bar */}
        <div className="bg-slate-950/60 px-4 py-3 sm:px-5 rounded-b-2xl border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Sensor Privasi Aktif (NIK/Rekening/OTP otomatis disamarkan)</span>
          </div>

          <button
            onClick={() => onAnalyze(text)}
            disabled={!text.trim() || isAnalyzing}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <span>Menganalisis...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analisis Pola Manipulasi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
