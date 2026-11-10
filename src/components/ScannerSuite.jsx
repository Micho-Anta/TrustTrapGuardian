import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Sparkles,
  Trash2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { scanText } from "../engine/scannerIndex";
import { HEURISTIC_ENGINES } from "../engine/heuristicRules";
import { JUDGE_PRESETS } from "../data/judgePresets";

export default function Scanner() {
  const [inputText, setInputText] = useState(JUDGE_PRESETS[0].text);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Scan default preset on initial load
  useEffect(() => {
    handleScan(JUDGE_PRESETS[0].text);
  }, []);

  const handleScan = (textToScan) => {
    const text = textToScan !== undefined ? textToScan : inputText;
    if (!text || text.trim() === "") return;

    setIsScanning(true);
    setTimeout(() => {
      const result = scanText(text);
      setScanResult(result);
      setIsScanning(false);
    }, 150);
  };

  const handleClear = () => {
    setInputText("");
    setScanResult(null);
  };

  const handlePresetSelect = (preset) => {
    setInputText(preset.text);
    handleScan(preset.text);
  };

  const handleCopyAlert = () => {
    if (!scanResult) return;
    const { summary, engines } = scanResult;
    const dangerList = engines
      .filter((e) => e.status === "DANGER")
      .map((e) => `• ${e.name}`)
      .join("\n");

    const message =
      `🚨 *PERINGATAN WASPADA PENIPUAN (TrustTrap Guardian)* 🚨\n\n` +
      `Skor Risiko: *${summary.score}/100* (${summary.riskLevel})\n` +
      `Modus Terdeteksi:\n${dangerList || "Indikasi Mencurigakan"}\n\n` +
      `⚠️ *JANGAN PERNAH:* Transfer uang muka, buka file .APK, atau serahkan kode OTP!\n` +
      `🛡️ Diverifikasi oleh TrustTrap Guardian`;

    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper untuk rendering teks dengan sorotan stabilo
  const renderHighlightedText = () => {
    if (!scanResult?.sanitizedText) return null;

    const { sanitizedText, highlightedEvidence = [] } = scanResult;
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
      return <p className="text-slate-200 leading-relaxed text-sm">{sanitizedText}</p>;
    }

    const escaped = allTokens
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);

    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    const parts = sanitizedText.split(regex);

    return (
      <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
        {parts.map((part, idx) => {
          if (part.startsWith("[") && part.endsWith("]")) {
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-cyan-950/80 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded text-xs font-mono font-medium mx-1"
                title="Data sensitif otomatis disamarkan secara lokal"
              >
                <Lock className="w-3 h-3 text-cyan-400" />
                {part}
              </span>
            );
          }

          const match = highlightedEvidence.find(
            (ev) => ev.text.toLowerCase() === part.toLowerCase()
          );

          if (match) {
            return (
              <mark
                key={idx}
                className="bg-red-500/25 text-red-200 border-b-2 border-red-500 font-semibold px-1 py-0.5 rounded mx-0.5 cursor-help"
                title={`Pola: ${match.engineName} (${match.reason})`}
              >
                {part}
              </mark>
            );
          }

          return <span key={idx}>{part}</span>;
        })}
      </p>
    );
  };

  // Radial calculation
  const score = scanResult?.summary?.score || 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#10b981";
  let scoreTextColor = "text-emerald-400";
  let badgeStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";

  if (score >= 70) {
    strokeColor = "#ef4444";
    scoreTextColor = "text-red-400";
    badgeStyle = "bg-red-500/10 border-red-500/30 text-red-300";
  } else if (score >= 35) {
    strokeColor = "#f59e0b";
    scoreTextColor = "text-amber-400";
    badgeStyle = "bg-amber-500/10 border-amber-500/30 text-amber-300";
  } else if (score > 0) {
    strokeColor = "#eab308";
    scoreTextColor = "text-yellow-400";
    badgeStyle = "bg-yellow-500/10 border-yellow-500/30 text-yellow-300";
  }

  return (
    <div className="space-y-6">
      {/* 4 Preset Skenario Cepat Uji Juri */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Skenario Uji 1-Klik Dewan Juri (Preset Showcase)
            </h3>
          </div>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
            Siap Uji Instan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {JUDGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className="text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {preset.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-200 line-clamp-1">
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

      {/* Omnibox Input Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Tempel Teks Chat WhatsApp / Loker / SMS / Link Phishing</span>
            </label>
            {inputText && (
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Kosongkan
              </button>
            )}
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tempel teks obrolan atau tautan yang mencurigakan di sini..."
            rows={4}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="bg-slate-950/70 px-4 py-3 sm:px-5 rounded-b-2xl border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sensor Privasi Otomatis Aktif (NIK & Rekening aman)</span>
          </div>

          <button
            onClick={() => handleScan(inputText)}
            disabled={!inputText.trim() || isScanning}
            className="w-full sm:w-auto px-6 py-2 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memeriksa {HEURISTIC_ENGINES.length} Modul...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Pindai Manipulasi Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hasil Analisis: Score Gauge & Ringkasan ala VirusTotal */}
      {scanResult && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Radial Gauge */}
              <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 150 150">
                  <circle
                    cx="75"
                    cy="75"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="75"
                    cy="75"
                    r={radius}
                    stroke={strokeColor}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className={`text-3xl font-extrabold tracking-tight ${scoreTextColor}`}>
                    {score}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                    Skor Risiko / 100
                  </span>
                </div>
              </div>

              {/* Status Header */}
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
                    {score >= 70 ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : score >= 35 ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {scanResult.summary.riskLevel}
                  </span>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                    <span className="font-bold text-white">{scanResult.summary.triggeredEngines}</span> dari {scanResult.summary.totalEngines} Modul Menyala
                  </span>

                  {scanResult.summary.comboBonus > 1.0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse">
                      <Zap className="w-3.5 h-3.5" />
                      Combo {scanResult.summary.comboBonus}x
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {score >= 70
                    ? "Teks obrolan menunjukkan ciri kuat rekayasa sosial, manipulasi urgensi waktu, dan indikasi penipuan. Jangan lanjutkan interaksi atau kirim uang."
                    : score >= 35
                    ? "Ditemukan pola kalimat mencurigakan. Lakukan pengecekan silang ke situs resmi sebelum memberikan respon atau data apapun."
                    : "Tidak ditemukan ciri manipulasi penipuan umum. Namun tetaplah berhati-hati dalam menjaga kerahasiaan data pribadi Anda."}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                  <button
                    onClick={handleCopyAlert}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Peringatan Tersalin!" : "Salin Format Peringatan WA"}
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Mini Status Modul Heuristik */}
            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {scanResult.engines.map((eng) => {
                const isDanger = eng.status === "DANGER";
                return (
                  <div
                    key={eng.id}
                    className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                      isDanger
                        ? "bg-red-950/30 border-red-800/50 text-red-200"
                        : "bg-slate-950/40 border-slate-800/60 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold truncate text-[11px]" title={eng.name}>
                        {eng.name}
                      </span>
                      {isDanger ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </div>
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider ${
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

          {/* Sorotan Kalimat Manipulatif (Highlight View) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                <span>Bedah Bukti Kalimat Manipulatif (Text Highlighter)</span>
              </h3>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-red-300">
                  <span className="w-2 h-2 rounded bg-red-500/60"></span>
                  Pola Jebakan
                </span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <span className="w-2 h-2 rounded bg-cyan-500/60"></span>
                  Sensor Privasi
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              {renderHighlightedText()}
            </div>

            {scanResult.redactions && scanResult.redactions.length > 0 && (
              <div className="mt-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-3 flex items-center gap-2 text-xs text-cyan-200">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Data disamarkan demi privasi: {scanResult.redactions.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Rincian Modul yang Terdeteksi */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <AlertCircle className="w-4 h-4 text-indigo-400" />
              <span>Detail Analisis {scanResult.engines.length} Modul Scam Heuristic Engine</span>
            </h3>

            <div className="space-y-2.5">
              {scanResult.engines.map((eng) => {
                const isDanger = eng.status === "DANGER";
                return (
                  <div
                    key={eng.id}
                    className={`p-3.5 rounded-xl border text-xs transition-all ${
                      isDanger
                        ? "bg-red-950/20 border-red-900/40"
                        : "bg-slate-950/40 border-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {isDanger ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                        <span className="font-semibold text-white">{eng.name}</span>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                          {eng.category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDanger
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {isDanger ? `+${eng.score} Poin` : "Aman"}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-2">{eng.explanation}</p>

                    {isDanger && (
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-slate-200 flex items-start gap-1.5">
                        <span className="text-indigo-400 font-semibold shrink-0">Langkah Penyelamatan:</span>
                        <span>{eng.actionStep}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
