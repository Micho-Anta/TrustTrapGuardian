import React, { useState } from 'react'
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ShieldAlert,
  KeyRound,
  XCircle,
  FileText,
  LifeBuoy
} from 'lucide-react'

export default function MitigationGuide({ result }) {
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)

  if (!result) return null

  const { target = '', score = 0, status = 'SAFE', findings = [], timestamp } = result

  const isThreat = status === 'DANGEROUS' || status === 'SUSPICIOUS'

  const handleCopyInvestigationReport = () => {
    const formattedDate = timestamp
      ? new Date(timestamp).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' })
      : new Date().toLocaleString('id-ID')

    let report = `=======================================================\n`
    report += `🚨 LAPORAN INVESTIGASI INSIDEN SIBER - TRUSTTRAPGUARDIAN\n`
    report += `=======================================================\n`
    report += `Waktu Pemeriksaan : ${formattedDate}\n`
    report += `Target URL / Objek: ${target || 'Teks / Target Masukan'}\n`
    report += `Klasifikasi Risiko: ${status === 'DANGEROUS' ? 'BERBAHAYA (HIGH RISK)' : status === 'SUSPICIOUS' ? 'MENCURIGAKAN (MEDIUM RISK)' : 'AMAN (LOW RISK)'}\n`
    report += `Skor Risiko Bahaya: ${score} / 100 (${score}%)\n`
    report += `Total Pelanggaran : ${findings.length} Indikator Terdeteksi\n`
    report += `-------------------------------------------------------\n\n`

    report += `RINGKASAN TEMUAN HEURISTIK:\n`
    if (findings.length === 0) {
      report += `• Tidak ditemukan anomali atau pola serangan rekayasa sosial.\n`
    } else {
      findings.forEach((f, idx) => {
        report += `[${idx + 1}] [${f.severity?.toUpperCase() || 'INFO'}] ${f.message}\n`
        if (f.explanation) {
          report += `    Risiko Teknis : ${f.explanation}\n`
        }
        if (f.mitigation) {
          report += `    Langkah Mitigasi: ${f.mitigation}\n`
        }
        report += `\n`
      })
    }

    report += `PANDUAN TINDAKAN MITIGASI DARURAT:\n`
    report += `1. JANGAN memasukkan data login, PIN, NIK, atau rekening bank pada target ini.\n`
    report += `2. Segera tutup tab peramban dan putuskan koneksi jika terdapat file yang terunduh otomatis.\n`
    report += `3. Jika sempat mengisi form, segera ganti kata sandi akun terkait dari perangkat lain dan aktifkan 2FA.\n`
    report += `4. Laporkan bukti ke portal resmi kepolisian (patrolisiber.id) atau perbankan terkait.\n\n`
    report += `Dibuat secara otomatis oleh TrustTrapGuardian Heuristic Security Engine.`

    navigator.clipboard.writeText(report)
    setCopied(true)
    setShowToast(true)

    setTimeout(() => {
      setCopied(false)
    }, 2500)

    setTimeout(() => {
      setShowToast(false)
    }, 3200)
  }

  return (
    <div className="w-full mt-6 space-y-4">
      {/* Toast Notification Sederhana */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-900/90 border border-emerald-500 text-white text-xs font-semibold shadow-2xl backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Laporan berhasil disalin ke clipboard!</span>
        </div>
      )}

      {isThreat ? (
        <div className="rounded-2xl border border-rose-900/60 bg-gradient-to-b from-rose-950/30 to-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur">
          {/* Header Mitigasi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-900/40 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Panduan Aksi Darurat & Mitigasi Segera
                </h3>
                <p className="text-xs text-rose-300/80">
                  Target ini berpotensi membahayakan data pribadi, kredensial, atau keuangan Anda.
                </p>
              </div>
            </div>

            {/* Tombol Salin Format Laporan Investigasi */}
            <button
              onClick={handleCopyInvestigationReport}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border border-rose-700/60 hover:border-rose-500 transition-all flex items-center justify-center gap-2 shrink-0 shadow"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Laporan Tersalin!</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span>Salin Format Laporan Investigasi</span>
                </>
              )}
            </button>
          </div>

          {/* 3 Kotak Rekomendasi Tindakan Segera */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
            {/* Tindakan 1: Jangan Input Data */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/40 space-y-2">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">1. Jangan Masukkan Data</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hindari mengisi username, password, nomor KTP/NIK, rekening, atau kode OTP pada website atau chat ini.
              </p>
            </div>

            {/* Tindakan 2: Tutup Tab Segera */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <XCircle className="w-4 h-4 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">2. Segera Tutup Tab</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tutup halaman ini sekarang juga. Jangan klik tautan unduhan otomatis (.apk, .zip, .mov, atau .exe).
              </p>
            </div>

            {/* Tindakan 3: Ganti Password Darurat */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/40 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <KeyRound className="w-4 h-4 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">3. Ganti Password Darurat</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Jika sudah terlanjur mengisi form, segera ganti password akun tersebut dari perangkat lain dan aktifkan 2FA.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 shadow-lg backdrop-blur flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Target Terindikasi Aman</h4>
              <p className="text-xs text-slate-400">
                Tidak ditemukan ciri phishing, domain acak, atau manipulasi rekayasa sosial. Tetap jaga kerahasiaan kata sandi Anda.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyInvestigationReport}
            className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500 transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Laporan Tersalin!</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Salin Laporan Investigasi</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
