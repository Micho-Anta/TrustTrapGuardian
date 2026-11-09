import { useState } from 'react'
import { Shield } from 'lucide-react'
import Scanner from './components/Scanner'
import RiskCard from './components/RiskCard'
import { analyzeTarget } from './heuristics/analyzer'

export default function App() {
  const [result, setResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = (input) => {
    setIsScanning(true)
    setTimeout(() => {
      const scanResult = analyzeTarget(input)
      setResult(scanResult)
      setIsScanning(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">TrustTrapGuardian</h1>
            <p className="text-sm text-slate-400">Sistem Deteksi Heuristik & Verifikasi Kepercayaan Digital</p>
          </div>
        </div>

        <Scanner onScan={handleScan} isScanning={isScanning} />
        <RiskCard result={result} />
      </div>
    </div>
  )
}
