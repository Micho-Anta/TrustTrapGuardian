import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  LifeBuoy,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Code2,
  Sparkle,
  ArrowRight
} from "lucide-react";
import Scanner from "./components/Scanner";
import ScoreGauge from "./components/scanner/ScoreGauge";
import HighlightView from "./components/scanner/HighlightView";
import PanicTriage from "./components/action/PanicTriage";
import WarningCard from "./components/action/WarningCard";
import SpotTheTrap from "./components/learn/SpotTheTrap";
import PrivacyBanner from "./components/learn/PrivacyBanner";
import { scanText } from "./engine/scannerIndex";
import { JUDGE_PRESETS } from "./data/judgePresets";

export default function App() {
  const [activeTab, setActiveTab] = useState("scanner"); // 'scanner' | 'action' | 'learn'
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(() => scanText(JUDGE_PRESETS[0].text));
  const [currentTarget, setCurrentTarget] = useState(JUDGE_PRESETS[0].text);

  const handleScan = (targetText) => {
    if (!targetText || !targetText.trim()) return;
    setIsScanning(true);
    setCurrentTarget(targetText);

    setTimeout(() => {
      const result = scanText(targetText);
      setScanResult(result);
      setIsScanning(false);
    }, 200);
  };

  const handlePresetClick = (preset) => {
    handleScan(preset.text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Banner Tag */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 border-b border-indigo-500/20 px-4 py-2 text-center text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Trust Trap: Navigating Digital Deception — </span>
          <span className="text-white font-semibold">Web Development MIT-WEEK 2026</span>
        </span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-slate-300 bg-clip-text text-transparent">
                  TrustTrap Guardian
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v1.0 Engine
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
              onClick={() => setActiveTab("scanner")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "scanner"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>1. Scanner (Recognize)</span>
            </button>

            <button
              onClick={() => setActiveTab("action")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "action"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>2. Tindakan (Act)</span>
            </button>

            <button
              onClick={() => setActiveTab("learn")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "learn"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3. Kuis (Learn)</span>
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
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* TAB 1: SCANNER (RECOGNIZE) */}
        {activeTab === "scanner" && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Deteksi Rekayasa Sosial & Penipuan Chat
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Analisis teks obrolan, link phishing, atau pengumuman loker. Scam Heuristic Engine akan membedah tanda bahaya psikologis secara instan.
              </p>
            </div>

            {/* Komponen Scanner Form */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <Scanner onScan={handleScan} isScanning={isScanning} />

              {/* 4 Preset Skenario Cepat Uji Juri */}
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Skenario Uji 1-Klik Dewan Juri:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {JUDGE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 mb-0.5">
                        <span>{preset.badge}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-200 line-clamp-1">
                        {preset.title}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {preset.tagline}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

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

        {/* TAB 2: ACTION (ACT) */}
        {activeTab === "action" && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Langkah Penyelamatan Akun & Kartu Peringatan
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Panduan darurat langkah demi langkah untuk pemulihan akun serta generator kartu peringatan keluarga untuk disebarkan ke WhatsApp.
              </p>
            </div>

            <PanicTriage />
            <WarningCard scanResult={scanResult} />
          </div>
        )}

        {/* TAB 3: LEARN (KUIS) */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Simulasi Edukasi Rekayasa Sosial
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Asah nalar kritis Anda menghadapi 3 skenario nyata manipulasi digital di Indonesia melalui kuis interaktif.
              </p>
            </div>

            <SpotTheTrap />
          </div>
        )}

        {/* Banner Jaminan Privasi */}
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
