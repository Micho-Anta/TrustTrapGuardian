import { ShieldAlert, CheckCircle2 } from 'lucide-react'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">TrustTrapGuardian</h1>
            <p className="text-xs text-slate-400">Security & Trust Verification System</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/40">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tailwind CSS v4 & Lucide React aktif</span>
          </div>
        </div>
      </div>
    </main>
  )
}
