import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

export default function Scanner({ onScan, isScanning }) {
  const [target, setTarget] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!target.trim()) return
    onScan(target.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Masukkan URL, domain, atau teks target (contoh: http://192.168.1.1/login)..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3.5 pr-28 text-sm text-slate-100 placeholder-slate-500 shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isScanning || !target.trim()}
          className="absolute right-2 flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
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
    </form>
  )
}
