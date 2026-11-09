import React, { useEffect, useState } from 'react'
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react'

export default function RiskMeter({ score = 0, status = 'SAFE' }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  // Counter animation dari 0 ke target score
  useEffect(() => {
    let startTimestamp = null
    const duration = 900 // ms
    const startScore = animatedScore
    const targetScore = Math.min(100, Math.max(0, score))

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      // Easing cubic easeOut: 1 - (1 - t)^3
      const easeOutProgress = 1 - Math.pow(1 - progress, 3)
      const currentVal = Math.round(startScore + (targetScore - startScore) * easeOutProgress)
      setAnimatedScore(currentVal)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    const animId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(animId)
  }, [score])

  // Color determination based on score
  let color = '#10b981' // Green (0-25)
  let statusText = 'Aman'
  let textColorClass = 'text-emerald-400'
  let strokeGradient = 'url(#safeGradient)'
  let Icon = ShieldCheck

  if (animatedScore > 60) {
    color = '#f43f5e' // Red (61-100)
    statusText = 'Berbahaya'
    textColorClass = 'text-rose-400'
    strokeGradient = 'url(#dangerGradient)'
    Icon = ShieldAlert
  } else if (animatedScore > 25) {
    color = '#f59e0b' // Yellow/Orange (26-60)
    statusText = 'Mencurigakan'
    textColorClass = 'text-amber-400'
    strokeGradient = 'url(#warningGradient)'
    Icon = AlertTriangle
  }

  // Semi-circle SVG calculations
  // Semi-circle path length: r = 70 => arc length = Math.PI * 70 ≈ 219.91
  const arcLength = 219.91
  const progressOffset = arcLength - (animatedScore / 100) * arcLength

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Semi-Circle SVG Gauge */}
      <div className="relative w-48 h-28 flex items-center justify-center">
        <svg className="w-48 h-28 overflow-visible" viewBox="0 0 180 100">
          <defs>
            <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Animated Score Arc */}
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke={strokeGradient}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={progressOffset}
            className="transition-[stroke-dashoffset] duration-300 ease-out"
          />
        </svg>

        {/* Center Counter Display */}
        <div className="absolute top-12 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5">
            <Icon className={`w-5 h-5 ${textColorClass}`} />
            <span className={`text-3xl font-black tracking-tight ${textColorClass}`}>
              {animatedScore}%
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
            Tingkat Risiko
          </span>
        </div>
      </div>

      {/* Progress Bar Bertingkat 3-Tier */}
      <div className="w-full max-w-xs mt-2 space-y-1.5">
        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold text-center">
          <span className={animatedScore <= 25 ? 'text-emerald-400' : 'text-slate-600'}>
            Aman (0-25%)
          </span>
          <span className={animatedScore > 25 && animatedScore <= 60 ? 'text-amber-400' : 'text-slate-600'}>
            Waspada (26-60%)
          </span>
          <span className={animatedScore > 60 ? 'text-rose-400' : 'text-slate-600'}>
            Bahaya (61-100%)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 h-2">
          {/* Segment 1: Hijau */}
          <div
            className={`rounded-full transition-all duration-500 ${
              animatedScore > 0 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-800'
            }`}
          />
          {/* Segment 2: Kuning/Oranye */}
          <div
            className={`rounded-full transition-all duration-500 ${
              animatedScore > 25 ? 'bg-amber-500 shadow-sm shadow-amber-500/50' : 'bg-slate-800'
            }`}
          />
          {/* Segment 3: Merah */}
          <div
            className={`rounded-full transition-all duration-500 ${
              animatedScore > 60 ? 'bg-rose-500 shadow-sm shadow-rose-500/50' : 'bg-slate-800'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
