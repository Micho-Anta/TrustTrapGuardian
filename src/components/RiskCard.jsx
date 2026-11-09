import React, { useState } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Shield,
  Info,
  LifeBuoy
} from 'lucide-react'

export default function RiskCard({ result }) {
  const [expandedIndices, setExpandedIndices] = useState(new Set([0])) // Expand finding pertama secara default
  const [copied, setCopied] = useState(false)

  if (!result) return null

  const { score, status, findings = [], target = '' } = result

  const statusConfig = {
    SAFE: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30 border-emerald-900/50',
      icon: ShieldCheck,
      badge: 'Aman / Terpercaya',
    },
    SUSPICIOUS: {
      color: 'text-amber-400',
      bg: 'bg-amber-950/30 border-amber-900/50',
      icon: AlertTriangle,
      badge: 'Kecurigaan Terdeteksi',
    },
    DANGEROUS: {
      color: 'text-rose-400',
      bg: 'bg-rose-950/30 border-rose-900/50',
      icon: ShieldAlert,
      badge: 'Risiko Tinggi / Berbahaya',
    },
  }[status] || {
    color: 'text-slate-400',
    bg: 'bg-slate-900 border-slate-800',
    icon: Shield,
    badge: 'Status Tidak Diketahui',
  }

  const StatusIcon = statusConfig.icon

  const toggleAccordion = (index) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleCopyReport = () => {
    let reportText = `🛡️ LAPORAN ANALISIS RISIKO - TRUSTTRAPGUARDIAN 🛡️\n\n`
    if (target) {
      reportText += `Target Analisis: ${target}\n`
    }
    reportText += `Status Keamanan: ${statusConfig.badge}\n`
    reportText += `Skor Risiko: ${score}/100 (${score}%)\n`
    reportText += `Waktu Evaluasi: ${new Date().toLocaleString('id-ID')}\n\n`

    reportText += `DAFTAR TEMUAN HEURISTIK & REKOMENDASI:\n`
    if (findings.length === 0) {
      reportText += `• Tidak ditemukan anomali atau pola jebakan rekayasa sosial umum.\n`
    } else {
      findings.forEach((f, idx) => {
        reportText += `\n[${idx + 1}] [${f.severity.toUpperCase()}] ${f.message}\n`
        if (f.explanation) {
          reportText += `    - Risiko Teknis: ${f.explanation}\n`
        }
        if (f.mitigation) {
          reportText += `    - Langkah Mitigasi: ${f.mitigation}\n`
        }
      })
    }

    reportText += `\n⚠️ Disclaimer: Analisis ini berbasis aturan heuristik canggih (explainable rules) untuk pencegahan penipuan siber.`

    navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30'
      case 'high':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    }
  }

  return (
    <div className={`mt-6 w-full rounded-2xl border p-5 sm:p-6 transition-all ${statusConfig.bg}`}>
      {/* Header Kartu Risiko */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-8 h-8 ${statusConfig.color} shrink-0`} />
          <div>
            <h3 className={`text-base sm:text-lg font-bold ${statusConfig.color}`}>{statusConfig.badge}</h3>
            <p className="text-xs text-slate-400">Tingkat Risiko Terkalkulasi: {score}/100</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100">{score}%</div>
          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5 shadow"
            title="Salin ringkasan laporan ke clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Salin Laporan Risiko</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bagian Accordion Temuan Heuristik */}
      <div className="mt-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Temuan Heuristik & Penjelasan ({findings.length}):
          </p>
          {findings.length > 0 && (
            <span className="text-[11px] text-slate-500">Klik item untuk melihat detail risiko & mitigasi</span>
          )}
        </div>

        {findings.length === 0 ? (
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
            Tidak ada anomali atau pola manipulasi psikologis yang terdeteksi pada target ini.
          </div>
        ) : (
          findings.map((f, i) => {
            const isExpanded = expandedIndices.has(i)
            return (
              <div
                key={i}
                className="rounded-xl border border-slate-800/80 bg-slate-900/80 overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(i)}
                  className="w-full text-left p-3.5 flex items-start sm:items-center justify-between gap-2.5 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getSeverityBadgeClass(
                        f.severity
                      )}`}
                    >
                      {f.severity}
                    </span>
                    <span className="text-xs font-medium text-slate-200 line-clamp-2">{f.message}</span>
                  </div>

                  <div className="text-slate-400 hover:text-slate-200 shrink-0 mt-0.5 sm:mt-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Accordion Body: Penjelasan Teknis & Mitigasi */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 space-y-3 bg-slate-950/40 text-xs">
                    {f.explanation && (
                      <div className="flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-cyan-300 block mb-0.5">Penjelasan Risiko Teknis:</span>
                          <p className="text-slate-300 leading-relaxed">{f.explanation}</p>
                        </div>
                      </div>
                    )}

                    {f.mitigation && (
                      <div className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-200">
                        <LifeBuoy className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-indigo-300 block mb-0.5">Langkah Mitigasi Pengguna:</span>
                          <p className="text-slate-300 leading-relaxed">{f.mitigation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
