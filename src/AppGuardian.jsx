import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  LifeBuoy,
  BookOpen,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Code2
} from "lucide-react";
import OmniboxInput from "./components/scanner/OmniboxInput";
import ScoreGauge from "./components/scanner/ScoreGauge";
import HighlightView from "./components/scanner/HighlightView";
import PanicTriage from "./components/action/PanicTriage";
import WarningCard from "./components/action/WarningCard";
import SpotTheTrap from "./components/learn/SpotTheTrap";
import PrivacyBanner from "./components/learn/PrivacyBanner";
import { scanText } from "./engine/scannerIndex";
import { JUDGE_PRESETS } from "./data/judgePresets";

export default function App() {
  const [activeTab, setActiveTab] = useState("recognize"); // 'recognize' | 'act' | 'learn'
  const [inputText, setInputText] = useState(JUDGE_PRESETS[0].text);
  const [scanResult, setScanResult] = useState(() => scanText(JUDGE_PRESETS[0].text));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (textToAnalyze) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!text || text.trim() === "") return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = scanText(text);
      setScanResult(result);
      setIsAnalyzing(false);
    }, 200);
  };

  const handleClear = () => {
    setInputText("");
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Notification Bar / Hackathon Tag */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 border-b border-indigo-500/20 px-4 py-2 text-center text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Solusi Kompetisi Web Development MIT-WEEK 2026 — </span>
          <span className="text-white font-semibold">The Trust Trap: Navigating Digital Deception</span>
        </span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-clip-text text-transparent">
                  TrustTrap Guardian
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Heuristic v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                VirusTotal-Style Social Engineering & Scam Detector
              </p>
            </div>
          </div>

          {/* 3 Pillar Tabs Navigation */}
          <nav className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("recognize")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "recognize"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>1. Recognize</span>
            </button>

            <button
              onClick={() => setActiveTab("act")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "act"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>2. Act</span>
            </button>

            <button
              onClick={() => setActiveTab("learn")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "learn"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3. Learn</span>
            </button>
          </nav>

          {/* GitHub Link */}
          <div className="hidden md:flex items-center">
            <a
              href="https://github.com/Micho-Anta/TrustTrapGuardian"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* TAB 1: RECOGNIZE (Bedah Bahaya ala VirusTotal) */}
        {activeTab === "recognize" && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Deteksi Rekayasa Sosial & Manipulasi Chat
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Tempel teks pesan WhatsApp, tawaran loker, atau link mencurigakan. Scam Heuristic Engine akan membedah tanda bahaya manipulasi psikologis secara instan.
              </p>
            </div>

            {/* Omnibox Input + 4 Presets Juri */}
            <OmniboxInput
              text={inputText}
              setText={setInputText}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              isAnalyzing={isAnalyzing}
            />

            {/* Hasil Analisis: Score Gauge & Highlight View */}
            {scanResult && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <ScoreGauge
                  summary={scanResult.summary}
                  engines={scanResult.engines}
                />

                <HighlightView scanResult={scanResult} />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACT (Langkah Penyelamatan & Kartu Peringatan) */}
        {activeTab === "act" && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Langkah Penyelamatan Akun & Kartu Peringatan
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Panduan darurat langkah demi langkah jika Anda baru menerima chat atau sudah terlanjur melakukan transaksi, dilengkapi generator kartu peringatan keluarga.
              </p>
            </div>

            {/* Panic Triage Component */}
            <PanicTriage />

            {/* Shareable Warning Card */}
            <WarningCard scanResult={scanResult} />
          </div>
        )}

        {/* TAB 3: LEARN (Simulasi Interaktif & Edukasi Modus) */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pusat Edukasi & Simulasi Rekayasa Sosial
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Pelajari bagaimana sindikat penipuan memanfaatkan celah psikologis rasa panik, serakah, dan empati melalui simulasi kuis interaktif.
              </p>
            </div>

            {/* Interactive Spot The Trap Quiz */}
            <SpotTheTrap />
          </div>
        )}

        {/* Banner Transparansi Privasi & Disclaimer */}
        <PrivacyBanner />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 <strong className="text-slate-400">TrustTrap Guardian</strong> — Tim The Trust Trap | MIT-WEEK 2026
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Local-First Heuristic Engine</span>
            <span>•</span>
            <span className="text-slate-500">React 19 + Tailwind CSS v4 + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
