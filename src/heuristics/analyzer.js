import { scanText } from '../engine/scannerIndex'

/**
 * Heuristic Analyzer Engine
 * Menganalisis URL, Alamat IP, Domain, serta Teks Chat / Rekayasa Sosial
 * Mengembalikan format { score, status, findings } untuk RiskCard
 */
export function analyzeTarget(input) {
  if (!input || typeof input !== 'string') {
    return {
      score: 0,
      status: 'SAFE',
      findings: []
    }
  }

  const trimmed = input.trim()
  const findings = []
  let score = 0

  // 1. Deteksi Ciri URL / Domain / Alamat IP
  const isUrlOrDomain =
    /^https?:\/\//i.test(trimmed) ||
    /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(trimmed) ||
    trimmed.includes('.')

  if (isUrlOrDomain) {
    // A. Penggunaan Alamat IP langsung (e.g. http://192.168.1.1/login)
    const ipPattern = /(?:https?:\/\/)?(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?/i
    if (ipPattern.test(trimmed)) {
      score += 45
      findings.push({
        severity: 'critical',
        message: 'Penggunaan alamat IP mentah alih-alih nama domain terdaftar (indikasi kuat server tiruan/phishing).'
      })
    }

    // B. Protokol HTTP tidak aman pada halaman login/akun
    if (/^http:\/\//i.test(trimmed) && /(login|admin|bank|akun|masuk|auth|verifikasi)/i.test(trimmed)) {
      score += 25
      findings.push({
        severity: 'high',
        message: 'Protokol HTTP tidak terenkripsi digunakan pada target halaman login/kredensial sensitif.'
      })
    }

    // C. TLD (Top-Level Domain) Berisiko Tinggi
    const suspiciousTlds = [/\.xyz\b/i, /\.top\b/i, /\.click\b/i, /\.site\b/i, /\.work\b/i, /\.info\b/i, /\.vip\b/i, /\.club\b/i, /\.online\b/i]
    for (const tld of suspiciousTlds) {
      if (tld.test(trimmed)) {
        score += 30
        findings.push({
          severity: 'high',
          message: `Ekstensi domain berisiko tinggi (${tld.source.replace(/\\b|\\/g, '')}) lazim digunakan oleh jaringan phising.`
        })
        break
      }
    }

    // D. Layanan Pemendek URL (Shortener)
    if (/(?:bit\.ly|s\.id|t\.ly|tinyurl\.com|cutt\.ly|is\.gd)\b/i.test(trimmed)) {
      score += 20
      findings.push({
        severity: 'medium',
        message: 'Penggunaan shortlink (pemendek URL) menyembunyikan identitas alamat domain target sesungguhnya.'
      })
    }

    // E. Brand Spoofing / Typosquatting
    if (/(bca|bri|mandiri|bni|telkom|shopee|dana)-[a-z0-9]/i.test(trimmed) && !/\.(?:co\.id|id|go\.id)/i.test(trimmed)) {
      score += 40
      findings.push({
        severity: 'critical',
        message: 'Pencatutan nama institusi/perbankan resmi pada nama domain pihak ketiga yang tidak terverifikasi.'
      })
    }
  }

  // 2. Evaluasi Teks Chat / Rekayasa Sosial melalui Scam Heuristic Engine
  const textAnalysis = scanText(trimmed)
  if (textAnalysis) {
    for (const eng of textAnalysis.engines) {
      if (eng.status === 'DANGER') {
        const severity = eng.score >= 35 ? 'critical' : eng.score >= 25 ? 'high' : 'medium'
        const exists = findings.some(f => f.message.toLowerCase().includes(eng.name.toLowerCase()))
        if (!exists) {
          findings.push({
            severity,
            message: `${eng.name}: ${eng.explanation}`
          })
          score += eng.score
        }
      }
    }

    if (textAnalysis.summary.combosTriggered && textAnalysis.summary.combosTriggered.length > 0) {
      findings.push({
        severity: 'critical',
        message: `Kombinasi Modus Bahaya: ${textAnalysis.summary.combosTriggered.join(', ')}`
      })
      score = Math.round(score * 1.2)
    }
  }

  // Normalisasi skor (0-100)
  score = Math.min(100, Math.max(0, score))

  let status = 'SAFE'
  if (score >= 70) {
    status = 'DANGEROUS'
  } else if (score >= 30) {
    status = 'SUSPICIOUS'
  }

  return {
    score,
    status,
    findings
  }
}
