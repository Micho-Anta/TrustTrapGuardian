import React, { useState, useEffect } from 'react'
import { Shield, Sparkles, ArrowRight, ShieldAlert, Cpu } from 'lucide-react'
import Scanner from './components/Scanner'
import RiskCard from './components/RiskCard'
import ScanHistory from './components/ScanHistory'
import { analyzeTarget } from './heuristics/analyzer'

const STORAGE_KEY = 'trust_trap_scan_history'

// 4 Preset Uji Cepat untuk Demonstrasi Heuristik
const QUICK_PRESETS = [
  {
    label: 'Punycode Attack',
    type: 'Homograph',
    input: 'https://xn--gogle-pra.com/security/login'
  },
  {
    label: 'High-Risk TLD',
    type: '.zip / .mov',
    input: 'http://surat-tagihan-pajak.zip/download'
  },
  {
    label: 'Typosquatting',
    type: 'BCA / Mandiri',
    input: 'http://bca-klik-promo.xyz/login/verify'
  },
  {
    label: 'DGA Random Domain',
    type: 'Entropy Tinggi',
    input: 'http://x89qzm9a218kl.top/gateway'
  }
]

export default function App() {
  const [result, setResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [history, setHistory] = useState([])

  // Load history dari localStorage saat inisialisasi
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 10))
        }
      }
    } catch {
      // Fallback jika parsing gagal
      setHistory([])
    }
  }, [])

  const saveHistory = (newEntry, currentList) => {
    try {
      // Hindari duplikasi langsung di paling atas, batasi 10 item
      const filtered = currentList.filter((item) => item.target !== newEntry.target)
      const updated = [newEntry, ...filtered].slice(0, 10)
      setHistory(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore localStorage error
    }
  }

  const handleScan = (input) => {
    if (!input || !input.trim()) return

    setIsScanning(true)
    setTimeout(() => {
      const scanResult = analyzeTarget(input)
      setResult(scanResult)
      setIsScanning(false)

      // Simpan ke riwayat
      const entry = {
        id: Date.now().toString(),
        target: input.trim(),
        score: scanResult.score,
        status: scanResult.status,
        timestamp: scanResult.timestamp || new Date().toISOString(),
        findingsCount: scanResult.findings.length
      }

      saveHistory(entry, history)
    }, 500)
  }

  const handleClearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Banner Tag */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-b border-cyan-800/30 px-4 py-2 text-center text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-cyan-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>TrustTrapGuardian — </span>
          <span className="text-white font-semibold">Autonomous Heuristic Security & Trust Verification</span>
        </span>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-700/50 text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  TrustTrapGuardian
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Heuristic v2.0
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Sistem Deteksi Rekayasa Sosial, DGA, Punycode, & Typosquatting Sisi Klien
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 self-start sm:self-auto">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Local-First Heuristic Engine</span>
          </div>
        </div>

        {/* Bar Tombol Cepat Skenario Uji (Quick Presets) */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Skenario Uji Cepat (Quick Test Presets):
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">Klik untuk memuat & memindai instan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {QUICK_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleScan(p.input)}
                className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 mb-0.5">
                    <span>{p.type}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-cyan-200 truncate">
                    {p.label}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-1">
                  {p.input}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar Scanner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl">
          <Scanner onScan={handleScan} isScanning={isScanning} />
        </div>

        {/* Hasil Analisis: RiskCard dengan Accordion Temuan & Mitigasi */}
        {result && <RiskCard result={result} />}

        {/* Panel Riwayat Pemindaian (ScanHistory) */}
        <ScanHistory
          history={history}
          onRescan={handleScan}
          onClearHistory={handleClearHistory}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 <strong className="text-slate-400">TrustTrapGuardian</strong> — Navigating Digital Deception
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Client-Side Zero Storage</span>
            <span>•</span>
            <span>React 19 + Tailwind v4 + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
