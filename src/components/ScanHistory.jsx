import React from 'react'
import { History, RotateCcw, Trash2, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react'

export default function ScanHistory({ history = [], onRescan, onClearHistory }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'SAFE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            Aman
          </span>
        )
      case 'SUSPICIOUS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            Waspada
          </span>
        )
      case 'DANGEROUS':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-3 h-3" />
            Bahaya
          </span>
        )
    }
  }

  const formatTime = (isoString) => {
    if (!isoString) return ''
    try {
      const date = new Date(isoString)
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-3.5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Riwayat Pemindaian Terakhir</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {history.length}/10
          </span>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
            title="Bersihkan seluruh riwayat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          <History className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-60" />
          <p>Belum ada riwayat pemindaian.</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Maksimal 10 hasil pemindaian terakhir akan disimpan secara lokal di browser Anda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="group p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(item.status)}
                  <span className="text-xs font-black text-slate-200">
                    Skor: <span className={item.score >= 70 ? 'text-rose-400' : item.score >= 30 ? 'text-amber-400' : 'text-emerald-400'}>{item.score}%</span>
                  </span>
                  {item.timestamp && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatTime(item.timestamp)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-300 font-mono truncate" title={item.target}>
                  {item.target}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => onRescan(item.target)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 border border-slate-700 hover:border-cyan-500"
                >
                  <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                  <span>Scan Ulang</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
