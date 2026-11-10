import React, { useState, useRef } from "react";
import {
  Search,
  LifeBuoy,
  BookOpen,
  Code2,
  ShieldCheck
} from "lucide-react";
import OmniboxInput from "./components/scanner/OmniboxInput";
import ScoreGauge from "./components/scanner/ScoreGauge";
import HighlightView from "./components/scanner/HighlightView";
import PanicTriage from "./components/action/PanicTriage";
import WarningCard from "./components/action/WarningCard";
import SpotTheTrap from "./components/learn/SpotTheTrap";
import PrivacyBanner from "./components/learn/PrivacyBanner";
import BackgroundFx from "./components/BackgroundFx";
import { scanText } from "./engine/scannerIndex";
import { JUDGE_PRESETS } from "./data/judgePresets";

export default function AppGuardian() {
  const [activeTab, setActiveTab] = useState("recognize"); // 'recognize' | 'act' | 'learn'
  const [inputText, setInputText] = useState(JUDGE_PRESETS[0].text);
  const [scanResult, setScanResult] = useState(() => scanText(JUDGE_PRESETS[0].text));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Ref untuk scroll ke hasil setelah analisis
  const resultsRef = useRef(null);

  const handleAnalyze = (textToAnalyze) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!text || text.trim() === "") return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = scanText(text);
      setScanResult(result);
      setIsAnalyzing(false);
      // Scroll ke hasil setelah sedikit delay agar DOM sudah ter-render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }, 200);
  };

  const handleClear = () => {
    setInputText("");
    setScanResult(null);
  };

  /** Navigate to ACT tab - called by ScoreGauge seamless handoff button */
  const handleGoToAct = () => {
    setActiveTab("act");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Navigate from LEARN to RECOGNIZE and test scenario text */
  const handleTestFromLearn = (chatText) => {
    setInputText(chatText);
    setActiveTab("recognize");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      handleAnalyze(chatText);
    }, 150);
  };

  /** Change tab with smooth scroll to top */
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs = [
    { id: "recognize", label: "1. Recognize", Icon: Search },
    { id: "act",       label: "2. Act",       Icon: LifeBuoy },
    { id: "learn",     label: "3. Learn",     Icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ color: "var(--ink)" }}>
      <BackgroundFx active={activeTab === "recognize"} />

      {/* ── Top Hackathon Ribbon ── */}
      <div
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        className="px-3 sm:px-4 py-2 sm:py-2.5 text-center text-xs"
      >
        <span className="inline-flex items-center gap-1.5 sm:gap-2 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} aria-hidden="true"></span>
          <span className="sm:hidden font-semibold text-white tracking-wide">
            MIT-WEEK 2026 | The Trust Trap
          </span>
          <span className="hidden sm:inline" style={{ color: "var(--muted)" }}>
            Solusi Kompetisi Web Development MIT-WEEK 2026 |
          </span>
          <span className="hidden sm:inline font-semibold text-white tracking-wide">
            The Trust Trap: Navigating Digital Deception
          </span>
        </span>
      </div>

      {/* ── Floating Glassmorphic Navbar ── */}
      <header
        className="sticky top-0 z-40 transition-all"
        style={{
          background: "rgba(10, 13, 20, 0.72)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 min-w-0">

          {/* Brand mark */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mint triangle brand mark with gentle glow */}
            <span
              className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 transition-transform hover:scale-105"
              style={{ background: "rgba(90,185,252,0.12)", border: "1px solid rgba(90,185,252,0.28)", color: "var(--accent)" }}
              aria-hidden="true"
            >
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <span className="brand-text-mobile">
                  TrustTrap
                </span>
                <span className="brand-text-desktop">
                  TrustTrap Guardian
                </span>
                <span
                  className="hidden sm:inline-block font-mono text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0"
                  style={{
                    background: "rgba(90, 185, 252,0.10)",
                    color: "var(--accent)",
                    border: "1px solid rgba(90, 185, 252,0.22)",
                  }}
                >
                  MIT-041
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
                Deteksi Pola Rekayasa Sosial &amp; Penipuan Digital
              </p>
            </div>
          </div>

          {/* 3-Tab pill navigation */}
          <nav
            className="flex items-center p-1 sm:p-1.5 rounded-full shrink-0 min-w-0"
            style={{
              background: "rgba(19, 24, 36,0.55)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 16px -4px rgba(0,0,0,0.40)",
            }}
          >
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`tab-pill${activeTab === id ? " active" : ""}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(". ")[1]}</span>
              </button>
            ))}
          </nav>

          {/* GitHub link */}
          <div className="hidden md:flex items-center shrink-0">
            <a
              href="https://github.com/Micho-Anta/TrustTrapGuardian"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <Code2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10 relative z-10">

        {/* ── TAB 1: RECOGNIZE ── */}
        {activeTab === "recognize" && (
          <div className="space-y-8 sm:space-y-10">

            {/* Hero header - Strong typography & breathing room */}
            <div className="text-left space-y-3 page-enter">
              <p className="eyebrow">THE TRUST TRAP · NAVIGATING DIGITAL DECEPTION</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Deteksi Rekayasa Sosial &amp;{" "}
                <span className="text-mint-gradient">Manipulasi Chat</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                Tempel teks pesan WhatsApp, tawaran loker, atau tautan mencurigakan.
                Scam Heuristic Engine akan membedah tanda bahaya manipulasi psikologis secara instan dan explainable.
              </p>
            </div>

            {/* Omnibox */}
            <OmniboxInput
              text={inputText}
              setText={setInputText}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              isAnalyzing={isAnalyzing}
              resultsRef={resultsRef}
            />

            {/* Results */}
            {scanResult && (
              <div ref={resultsRef} className="space-y-8 sm:space-y-10 animate-in fade-in duration-300">
                <ScoreGauge
                  summary={scanResult.summary}
                  engines={scanResult.engines}
                  onGoToAct={handleGoToAct}
                />
                <HighlightView scanResult={scanResult} />
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: ACT ── */}
        {activeTab === "act" && (
          <div className="space-y-8 sm:space-y-10">
            <div className="text-left space-y-3 page-enter">
              <p className="eyebrow">LANGKAH PENYELAMATAN · PANIC TRIAGE</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Panduan Darurat &amp;{" "}
                <span className="text-mint-gradient">Kartu Peringatan</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                Panduan darurat langkah demi langkah jika Anda baru menerima chat atau sudah terlanjur melakukan transaksi,
                dilengkapi generator kartu peringatan keluarga.
              </p>
            </div>

            <PanicTriage scanResult={scanResult} />
            <WarningCard scanResult={scanResult} />
          </div>
        )}

        {/* ── TAB 3: LEARN ── */}
        {activeTab === "learn" && (
          <div className="space-y-8 sm:space-y-10">
            <div className="text-left space-y-3 page-enter">
              <p className="eyebrow">EDUKASI · SIMULASI INTERAKTIF</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Pusat Edukasi &amp;{" "}
                <span className="text-mint-gradient">Simulasi Rekayasa Sosial</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                Pelajari bagaimana sindikat penipuan memanfaatkan celah psikologis rasa panik, serakah, dan empati
                melalui simulasi kuis interaktif.
              </p>
            </div>
            <SpotTheTrap onTestInScanner={handleTestFromLearn} />
          </div>
        )}

        {/* Privacy Banner */}
        <PrivacyBanner />
      </main>

      {/* ── Footer ── */}
      <footer
        className="py-8 text-center text-xs"
        style={{
          borderTop: "1px solid var(--border)",
          background: "rgba(10, 13, 20, 0.70)",
          color: "var(--muted)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026{" "}
            <strong className="text-white font-semibold">TrustTrap Guardian</strong>
            {" "}· Tim Nanti Ajah (MIT-041) · Universitas Gunadarma
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Local-First Heuristic Engine</span>
            <span>•</span>
            <span>React 19 + Tailwind CSS v4 + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
