import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react'

export default function RiskCard({ result }) {
  if (!result) return null

  const { score, status, findings } = result

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
  }[status]

  const StatusIcon = statusConfig.icon

  return (
    <div className={`mt-6 w-full rounded-2xl border p-5 transition-all ${statusConfig.bg}`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-7 h-7 ${statusConfig.color}`} />
          <div>
            <h3 className={`text-base font-bold ${statusConfig.color}`}>{statusConfig.badge}</h3>
            <p className="text-xs text-slate-400">Tingkat Risiko: {score}/100</p>
          </div>
        </div>
        <div className="text-2xl font-black tracking-tight text-slate-100">{score}%</div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Temuan Heuristik:</p>
        {findings.length === 0 ? (
          <p className="text-xs text-slate-400">Tidak ada anomali atau pola jebakan yang terdeteksi.</p>
        ) : (
          findings.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
              <span className="font-mono text-cyan-400">[{f.severity.toUpperCase()}]</span>
              <span>{f.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
