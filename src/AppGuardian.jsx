import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  LifeBuoy,
  BookOpen,
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

export default function AppGuardian() {
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

  /** Navigate to ACT tab — called by ScoreGauge seamless handoff button */
  const handleGoToAct = () => setActiveTab("act");

  const tabs = [
    { id: "recognize", label: "1. Recognize", Icon: Search },
    { id: "act",       label: "2. Act",       Icon: LifeBuoy },
    { id: "learn",     label: "3. Learn",     Icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ color: "var(--ink)" }}>

      {/* ── Top Hackathon Ribbon ── */}
      <div
        style={{
          background: "linear-gradient(90deg, rgba(58,108,255,0.18) 0%, rgba(12,18,38,0.70) 50%, rgba(93,240,168,0.10) 100%)",
          borderBottom: "1px solid rgba(93,240,168,0.14)",
        }}
        className="px-4 py-2 text-center text-xs"
      >
        <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: "var(--accent)" }}>
          <span style={{ color: "#f59e0b" }}>✦</span>
          <span style={{ color: "var(--muted)" }}>Solusi Kompetisi Web Development MIT-WEEK 2026 —&nbsp;</span>
          <span className="font-semibold" style={{ color: "var(--ink)" }}>The Trust Trap: Navigating Digital Deception</span>
        </span>
      </div>

      {/* ── Glassmorphism Navbar ── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(4, 6, 15, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Brand mark */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Triangle mint brand mark */}
            <span
              className="text-2xl leading-none select-none"
              style={{ color: "var(--accent)", filter: "drop-shadow(0 0 8px rgba(93,240,168,0.6))" }}
              aria-hidden="true"
            >▲</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight" style={{ color: "var(--ink)" }}>
                  TRUST TRAP GUARDIAN
                </span>
                <span
                  className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(93,240,168,0.12)",
                    color: "var(--accent)",
                    border: "1px solid rgba(93,240,168,0.28)",
                  }}
                >
                  MIT-041
                </span>
              </div>
              <p className="text-[11px] hidden sm:block" style={{ color: "var(--muted)" }}>
                VirusTotal-Style Social Engineering &amp; Scam Detector
              </p>
            </div>
          </div>

          {/* 3-Tab pill navigation */}
          <nav
            className="flex items-center p-1 rounded-full"
            style={{
              background: "rgba(12,18,38,0.70)",
              border: "1px solid var(--border)",
            }}
          >
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`tab-pill${activeTab === id ? " active" : ""}`}
              >
                <Icon className="w-3.5 h-3.5" />
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
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors btn-ghost"
              style={{ fontSize: "0.75rem" }}
            >
              <Code2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">

        {/* ── TAB 1: RECOGNIZE ── */}
        {activeTab === "recognize" && (
          <div className="space-y-6">

            {/* Hero header */}
            <div className="text-center sm:text-left space-y-2">
              <p className="eyebrow">THE TRUST TRAP · NAVIGATING DIGITAL DECEPTION</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "var(--ink)" }}>
                Deteksi Rekayasa Sosial &amp;{" "}
                <span className="text-mint-gradient">Manipulasi Chat</span>
              </h1>
              <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
                Tempel teks pesan WhatsApp, tawaran loker, atau link mencurigakan.
                Scam Heuristic Engine akan membedah tanda bahaya manipulasi psikologis secara instan.
              </p>
            </div>

            {/* Omnibox */}
            <OmniboxInput
              text={inputText}
              setText={setInputText}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              isAnalyzing={isAnalyzing}
            />

            {/* Results */}
            {scanResult && (
              <div className="space-y-6 animate-in fade-in duration-300">
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
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-2">
              <p className="eyebrow">LANGKAH PENYELAMATAN · PANIC TRIAGE</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "var(--ink)" }}>
                Panduan Darurat &amp;{" "}
                <span className="text-mint-gradient">Kartu Peringatan</span>
              </h1>
              <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
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
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-2">
              <p className="eyebrow">EDUKASI · SIMULASI INTERAKTIF</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "var(--ink)" }}>
                Pusat Edukasi &amp;{" "}
                <span className="text-mint-gradient">Simulasi Rekayasa Sosial</span>
              </h1>
              <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
                Pelajari bagaimana sindikat penipuan memanfaatkan celah psikologis rasa panik, serakah, dan empati
                melalui simulasi kuis interaktif.
              </p>
            </div>
            <SpotTheTrap />
          </div>
        )}

        {/* Privacy Banner */}
        <PrivacyBanner />
      </main>

      {/* ── Footer ── */}
      <footer
        className="py-6 text-center text-xs"
        style={{
          borderTop: "1px solid var(--border)",
          background: "rgba(4,6,15,0.80)",
          color: "var(--muted)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026{" "}
            <strong style={{ color: "var(--ink)" }}>TrustTrap Guardian</strong>
            {" "}— Tim The Trust Trap | MIT-WEEK 2026
          </div>
          <div className="flex items-center gap-4" style={{ color: "var(--muted)" }}>
            <span>Local-First Heuristic Engine</span>
            <span>•</span>
            <span>React 19 + Tailwind CSS v4 + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
