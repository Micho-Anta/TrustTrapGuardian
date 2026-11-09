import React, { useState, useEffect } from 'react'
import { Search, Loader2, AlertCircle, CheckCircle2, Globe, MessageSquare } from 'lucide-react'

const SCAN_STAGES = [
  'Memvalidasi struktur URL & protokol SSL...',
  'Mengecek anomali domain & typosquatting...',
  'Menghitung nilai entropi & skor risiko...'
]

export default function Scanner({ onScan, isScanning }) {
  const [target, setTarget] = useState('')
  const [stageIndex, setStageIndex] = useState(0)
  const [touched, setTouched] = useState(false)

  // Siklus transisi teks bertahap selama isScanning = true
  useEffect(() => {
    let interval = null
    if (isScanning) {
      setStageIndex(0)
      interval = setInterval(() => {
        setStageIndex((prev) => (prev + 1) % SCAN_STAGES.length)
      }, 550)
    } else {
      setStageIndex(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isScanning])

  // Validasi inline
  const trimmed = target.trim()
  let validationError = ''
  let inputType = null // 'url' | 'text' | null

  if (trimmed.length > 0) {
    if (trimmed.length < 3) {
      validationError = 'Input terlalu pendek (minimal 3 karakter).'
    } else if (/^https?:\/\/$/i.test(trimmed)) {
      validationError = 'Format URL belum lengkap. Harap sertakan nama domain atau IP.'
    } else if (/^https?:\/\//i.test(trimmed) || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(trimmed) || trimmed.includes('.')) {
      inputType = 'url'
    } else {
      inputType = 'text'
    }
  }

  const isValid = trimmed.length >= 3 && !validationError

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!isValid || isScanning) return
    onScan(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2.5">
      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value)
              if (!touched) setTouched(true)
            }}
            onBlur={() => setTouched(true)}
            placeholder="Masukkan URL, domain, atau teks chat (contoh: http://192.168.1.1/login)..."
            className={`w-full min-h-[44px] rounded-xl border bg-slate-900/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 transition-all ${
              touched && validationError
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isScanning || !isValid}
          className="min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 shrink-0 select-none cursor-pointer"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Memindai...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Analisis</span>
            </>
          )}
        </button>
      </div>

      {/* Micro-interaction: Loading Stage Progress Transition */}
      {isScanning && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-between text-xs text-cyan-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
            <span className="font-medium animate-pulse">{SCAN_STAGES[stageIndex]}</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/80 shrink-0">
            Tahap {stageIndex + 1}/{SCAN_STAGES.length}
          </span>
        </div>
      )}

      {/* Inline Validation & Helper Indicator */}
      {!isScanning && (
        <div className="flex items-center justify-between px-1 text-xs">
          {touched && validationError ? (
            <div className="flex items-center gap-1.5 text-rose-400 animate-in fade-in duration-150">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          ) : trimmed.length > 0 && isValid ? (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {inputType === 'url' ? 'Format URL / Domain terdeteksi' : 'Format Teks / Chat terdeteksi'} (siap dipindai)
              </span>
            </div>
          ) : (
            <div className="text-slate-500 text-[11px]">
              Ketik URL, alamat IP, domain, atau tempel pesan chat yang mencurigakan.
            </div>
          )}

          {inputType && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {inputType === 'url' ? <Globe className="w-3 h-3 text-cyan-400" /> : <MessageSquare className="w-3 h-3 text-indigo-400" />}
              {inputType}
            </span>
          )}
        </div>
      )}
    </form>
  )
}
