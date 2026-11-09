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
  LifeBuoy,
  Users,
  Terminal,
  Code
} from 'lucide-react'
import RiskMeter from './RiskMeter'

/**
 * Menerjemahkan istilah teknis keamanan siber menjadi bahasa manusia sederhana (Mode User Awam)
 */
function getLaymanExplanation(finding) {
  const msg = (finding.message || '').toLowerCase()
  const exp = (finding.explanation || '').toLowerCase()

  if (msg.includes('punycode') || msg.includes('homograph') || msg.includes('xn--')) {
    return 'Alamat web menggunakan huruf kembar tipuan yang sekilas tampak asli untuk mengelabui mata Anda.'
  }
  if (msg.includes('typosquatting') || msg.includes('brand') || msg.includes('pencatutan')) {
    return 'Situs tiruan yang sengaja memplesetkan nama bank atau merek resmi agar Anda mengira ini website asli.'
  }
  if (msg.includes('entropi') || msg.includes('dga') || msg.includes('acak')) {
    return 'Alamat web terdiri dari susunan huruf acak buatan program otomatis, yang biasa digunakan server penyebar virus.'
  }
  if (msg.includes('tld') || msg.includes('.zip') || msg.includes('.mov') || msg.includes('.top') || msg.includes('.work')) {
    return 'Website ini menggunakan akhiran domain murah yang sering dipakai oleh komplotan penipu siber.'
  }
  if (msg.includes('ip mentah') || msg.includes('alamat ip')) {
    return 'Website memakai deretan angka server mentah, bukan nama resmi. Instansi terpercaya tidak pernah memakai cara ini.'
  }
  if (msg.includes('http') || msg.includes('tidak terenkripsi')) {
    return 'Koneksi halaman ini tidak digembok aman, sehingga kata sandi atau data kartu yang Anda ketik dapat disadap.'
  }
  if (msg.includes('shortlink') || msg.includes('pemendek')) {
    return 'Tautan disamarkan lewat link pendek agar Anda tidak bisa melihat alamat website jebakan yang sebenarnya.'
  }
  if (msg.includes('upfront') || msg.includes('biaya') || msg.includes('deposit')) {
    return 'Pesan meminta transfer uang muka atau deposit saldo dengan alasan biaya registrasi/tiket yang tidak masuk akal.'
  }
  if (msg.includes('urgency') || msg.includes('panik') || msg.includes('menit') || msg.includes('hangus')) {
    return 'Pengirim memberi batas waktu kilat agar Anda panik, tergesa-gesa, dan tidak sempat mengecek kebenaran.'
  }
  if (msg.includes('apk') || msg.includes('otp')) {
    return 'Jebakan berbahaya untuk mencuri kode rahasia OTP SMS Anda atau memasang aplikasi pencuri rekening di HP.'
  }
  return finding.message
}

/**
 * Menghasilkan kode Heuristic ID unik untuk Mode Teknis
 */
function getHeuristicId(finding, index) {
  const msg = (finding.message || '').toLowerCase()
  if (msg.includes('punycode') || msg.includes('xn--')) return 'HEUR-PUNY-01'
  if (msg.includes('tld')) return 'HEUR-TLD-RISK'
  if (msg.includes('typosquatting')) return 'HEUR-TYPO-BRAND'
  if (msg.includes('entropi') || msg.includes('dga')) return 'HEUR-ENTROPY-DGA'
  if (msg.includes('ip')) return 'HEUR-NET-RAWIP'
  if (msg.includes('http')) return 'HEUR-SSL-INSECURE'
  if (msg.includes('shortlink')) return 'HEUR-URL-OBFUSC'
  if (msg.includes('upfront') || msg.includes('deposit')) return 'HEUR-SOC-UPFRONT'
  if (msg.includes('urgency')) return 'HEUR-SOC-URGENCY'
  if (msg.includes('apk') || msg.includes('otp')) return 'HEUR-MAL-HARVEST'
  return `HEUR-RULE-${String(index + 1).padStart(2, '0')}`
}

export default function RiskCard({ result }) {
  const [viewMode, setViewMode] = useState('layman') // 'layman' | 'technical'
  const [expandedIndices, setExpandedIndices] = useState(new Set([0])) // Expand finding pertama secara default
  const [copied, setCopied] = useState(false)

  if (!result) return null

  const { score, status, findings = [], target = '' } = result

  const statusConfig = {
    SAFE: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/20 border-emerald-900/40',
      icon: ShieldCheck,
      badge: 'Aman / Terpercaya',
      summary: 'Tidak ditemukan indikator ancaman rekayasa sosial atau kejanggalan domain pada target ini.'
    },
    SUSPICIOUS: {
      color: 'text-amber-400',
      bg: 'bg-amber-950/20 border-amber-900/40',
      icon: AlertTriangle,
      badge: 'Kecurigaan Terdeteksi',
      summary: 'Ditemukan beberapa anomali struktur atau desakan waktu. Diperlukan kewaspadaan dan verifikasi silang.'
    },
    DANGEROUS: {
      color: 'text-rose-400',
      bg: 'bg-rose-950/20 border-rose-900/40',
      icon: ShieldAlert,
      badge: 'Risiko Tinggi / Berbahaya',
      summary: 'Target menunjukkan ciri kuat serangan manipulasi siber terorganisir (phishing/trojan/social engineering).'
    },
  }[status] || {
    color: 'text-slate-400',
    bg: 'bg-slate-900 border-slate-800',
    icon: Shield,
    badge: 'Status Tidak Diketahui',
    summary: 'Evaluasi heuristik selesai.'
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

    reportText += `TEMUAN HEURISTIK & MITIGASI:\n`
    if (findings.length === 0) {
      reportText += `• Tidak ada anomali atau pola jebakan rekayasa sosial yang terdeteksi.\n`
    } else {
      findings.forEach((f, idx) => {
        const id = getHeuristicId(f, idx)
        reportText += `\n[${idx + 1}] [${id}] [${f.severity.toUpperCase()}] ${f.message}\n`
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
    <div className={`mt-6 w-full rounded-2xl border p-5 sm:p-6 transition-all shadow-xl backdrop-blur ${statusConfig.bg}`}>
      {/* Header Visualisasi Risiko (Integrasi RiskMeter) */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-5 border-b border-slate-800/80 gap-6">
        {/* Semi-circle Gauge */}
        <RiskMeter score={score} status={status} />

        {/* Ringkasan Status & Tombol Salin */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig.badge}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
              <strong className="text-white">{findings.length}</strong> Pola Terdeteksi
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {statusConfig.summary}
          </p>

          <div className="pt-1">
            <button
              onClick={handleCopyReport}
              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500 transition-all inline-flex items-center gap-2 shadow"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Laporan Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>Salin Laporan Risiko</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DUAL-MODE COPYWRITING TOGGLE TABS */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Daftar Temuan Analisis ({findings.length}):
          </p>

          {/* Toggle Switch: User Awam vs Forensik/IT */}
          <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('layman')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'layman'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Mode Ringkas (User Awam)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('technical')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'technical'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Mode Teknis (Forensik/IT)</span>
            </button>
          </div>
        </div>

        {/* Accordion Findings */}
        {findings.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
            Tidak ada anomali atau pola manipulasi psikologis yang terdeteksi pada target ini.
          </div>
        ) : (
          <div className="space-y-2.5">
            {findings.map((f, i) => {
              const isExpanded = expandedIndices.has(i)
              const heuristicId = getHeuristicId(f, i)
              const laymanText = getLaymanExplanation(f)

              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/80 overflow-hidden transition-all shadow-sm"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(i)}
                    className="w-full text-left p-3.5 min-h-[44px] flex items-start sm:items-center justify-between gap-2.5 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
                      {viewMode === 'technical' ? (
                        <>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-indigo-500/30 shrink-0">
                            {heuristicId}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getSeverityBadgeClass(
                              f.severity
                            )}`}
                          >
                            {f.severity}
                          </span>
                          <span className="text-xs font-medium text-slate-200 line-clamp-1">{f.message}</span>
                        </>
                      ) : (
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase shrink-0 ${getSeverityBadgeClass(
                                f.severity
                              )}`}
                            >
                              {f.severity === 'critical' ? 'Bahaya' : f.severity === 'high' ? 'Waspada' : 'Perhatian'}
                            </span>
                            <span className="text-xs font-bold text-white">{f.message}</span>
                          </div>
                          <p className="text-[11px] text-cyan-300/90 leading-relaxed font-normal">
                            💡 {laymanText}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-slate-400 hover:text-slate-200 shrink-0 mt-0.5 sm:mt-0 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Accordion Body: Penjelasan Teknis & Mitigasi */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 space-y-3 bg-slate-950/50 text-xs">
                      {viewMode === 'technical' && (
                        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                          <Code className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Rule ID: {heuristicId}</span>
                          <span>•</span>
                          <span>Severity: {f.severity.toUpperCase()}</span>
                        </div>
                      )}

                      {f.explanation && (
                        <div className="flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-cyan-300 block mb-0.5">
                              {viewMode === 'technical' ? 'Analisis Forensik & Resiko Teknis:' : 'Mengapa ini berbahaya?'}
                            </span>
                            <p className="text-slate-300 leading-relaxed">{f.explanation}</p>
                          </div>
                        </div>
                      )}

                      {f.mitigation && (
                        <div className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-200">
                          <LifeBuoy className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-emerald-300 block mb-0.5">Langkah Mitigasi:</span>
                            <p className="text-slate-300 leading-relaxed">{f.mitigation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
