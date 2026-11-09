import { scanText } from '../engine/scannerIndex'

/**
 * Kalkulasi Shannon Entropy (Tingkat Keacakan String)
 * Mengukur derajat entropi informasi dalam satuan bit per karakter.
 * Digunakan secara luas dalam analisis keamanan siber untuk mendeteksi
 * Domain Generation Algorithms (DGA) yang dipakai botnet & ransomware.
 */
export function calculateEntropy(str) {
  if (!str || typeof str !== 'string') return 0
  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '')
  const len = cleanStr.length
  if (len === 0) return 0

  const freq = {}
  for (const ch of cleanStr) {
    freq[ch] = (freq[ch] || 0) + 1
  }

  let entropy = 0
  for (const ch in freq) {
    const p = freq[ch] / len
    entropy -= p * Math.log2(p)
  }

  return Number(entropy.toFixed(3))
}

/**
 * Helper untuk mengekstrak hostname bersih dari URL atau string domain
 */
function extractHostname(input) {
  try {
    let raw = input.trim()
    if (!/^https?:\/\//i.test(raw)) {
      raw = 'http://' + raw
    }
    const parsed = new URL(raw)
    return parsed.hostname.toLowerCase()
  } catch {
    const match = input.match(/(?:https?:\/\/)?([a-zA-Z0-9.\-_]+)/i)
    return match ? match[1].toLowerCase() : input.toLowerCase()
  }
}

/**
 * Daftar domain resmi untuk pengecualian whitelist typosquatting
 */
const OFFICIAL_BRAND_DOMAINS = [
  'google.com', 'google.co.id', 'google.id',
  'paypal.com', 'paypal.me',
  'bca.co.id', 'klikbca.com', 'bca.id',
  'bankmandiri.co.id', 'mandiri.co.id', 'livin.id',
  'bri.co.id', 'ib.bri.co.id', 'brimo.id',
  'binance.com', 'binance.me', 'binance.info'
]

/**
 * Heuristic Analyzer Engine v2.0
 * Menganalisis URL, Domain, DGA, Punycode, Typosquatting, serta Teks Rekayasa Sosial
 */
export function analyzeTarget(input) {
  if (!input || typeof input !== 'string') {
    return {
      target: '',
      score: 0,
      status: 'SAFE',
      findings: []
    }
  }

  const trimmed = input.trim()
  const findings = []
  let score = 0

  const isUrlOrDomain =
    /^https?:\/\//i.test(trimmed) ||
    /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(trimmed) ||
    trimmed.includes('.')

  if (isUrlOrDomain) {
    const hostname = extractHostname(trimmed)
    const hostParts = hostname.split('.')
    const mainDomain = hostParts.length >= 2 ? hostParts.slice(-2).join('.') : hostname
    const domainLabel = hostParts.length >= 2 ? hostParts[hostParts.length - 2] : hostParts[0]

    // 1. DETEKSI PUNYCODE / HOMOGRAPH ATTACK (awalan 'xn--')
    if (hostname.includes('xn--') || trimmed.toLowerCase().includes('xn--')) {
      score += 50
      findings.push({
        severity: 'critical',
        message: 'Penyusupan Punycode / Homograph Attack (awalan xn--)',
        explanation: 'Domain menggunakan format pengkodean Punycode (awalan "xn--") untuk menyamarkan huruf non-Latin (Cyrillic/Yunani) agar terlihat mirip dengan karakter alfabet Latin. Ini adalah teknik penipuan visual tingkat tinggi.',
        mitigation: 'JANGAN buka tautan ini atau masukkan data sensitif apa pun. Ketik alamat website resmi secara manual di address bar peramban Anda.'
      })
    }

    // 2. DETEKSI TLD BERISIKO TINGGI (.zip, .mov, .top, .work, .country, .kim, dll)
    const highRiskTlds = [
      { tld: '.zip', weight: 40, reason: 'Sering dipakai malware phising karena menyerupai nama file arsip (.zip).' },
      { tld: '.mov', weight: 40, reason: 'Menyerupai ekstensi file video (.mov) yang dapat mengelabui korban untuk mengeklik.' },
      { tld: '.top', weight: 35, reason: 'TLD murah dengan frekuensi penyalahgunaan spam & phishing global sangat tinggi.' },
      { tld: '.work', weight: 30, reason: 'Banyak dimanfaatkan untuk kedok lowongan kerja palsu & task scam.' },
      { tld: '.country', weight: 35, reason: 'Ekstensi dengan reputasi buruk pada basis data registri keamanan siber.' },
      { tld: '.kim', weight: 35, reason: 'Domain murah yang sering digunakan sindikat penipuan digital tanpa verifikasi ketat.' },
      { tld: '.xyz', weight: 30, reason: 'Ekstensi domain murah yang mendominasi situs pancingan phising instan.' },
      { tld: '.click', weight: 30, reason: 'Sering digunakan untuk pancingan click-fraud dan malware gateway.' },
      { tld: '.site', weight: 25, reason: 'Ekstensi berbiaya rendah dengan regulasi kepemilikan yang longgar.' },
      { tld: '.online', weight: 25, reason: 'Kerap dipakai untuk membuat tiruan landing page perbankan atau hadiah palsu.' },
      { tld: '.vip', weight: 30, reason: 'Banyak dimanfaatkan dalam kedok skema investasi bodong & judi online.' }
    ]

    for (const item of highRiskTlds) {
      if (hostname.endsWith(item.tld) || hostname.includes(item.tld + '.')) {
        score += item.weight
        findings.push({
          severity: 'high',
          message: `Domain Menggunakan TLD Berisiko Tinggi (${item.tld})`,
          explanation: `Ekstensi domain ${item.tld} diidentifikasi memiliki reputasi buruk. ${item.reason}`,
          mitigation: 'Hindari mengunduh file atau mengisi form login pada website dengan ekstensi ini sebelum memverifikasi legitimasi entitas pengelola.'
        })
        break
      }
    }

    // 3. DETEKSI TYPOSQUATTING & BRAND SPOOFING (google, paypal, bca, mandiri, bri, binance)
    const targetBrands = [
      {
        name: 'Google',
        canonical: 'google.com',
        regex: /(?:g[o0]{2}gle|g[o0]gle|goog1e|googel|googIe|google-)/i
      },
      {
        name: 'PayPal',
        canonical: 'paypal.com',
        regex: /(?:paypa[l1]|pay-pal|peypal|paypol|paypal-)/i
      },
      {
        name: 'BCA',
        canonical: 'bca.co.id',
        regex: /(?:bca-|klikbca-|klik-bca|-bca\b|bca[0-9]|bca-login)/i
      },
      {
        name: 'Mandiri',
        canonical: 'bankmandiri.co.id',
        regex: /(?:mand1ri|mandiiri|mandiri-|livin-|mandiri-promo)/i
      },
      {
        name: 'BRI',
        canonical: 'bri.co.id',
        regex: /(?:bri-|br1\b|brii|brimo-|bri-link|bri-poin)/i
      },
      {
        name: 'Binance',
        canonical: 'binance.com',
        regex: /(?:b1nance|binence|binanse|binance-|binance-gift|binance-airdrop)/i
      }
    ]

    const isOfficial = OFFICIAL_BRAND_DOMAINS.some(off => hostname === off || hostname.endsWith('.' + off))

    if (!isOfficial) {
      for (const b of targetBrands) {
        if (b.regex.test(hostname)) {
          score += 45
          findings.push({
            severity: 'critical',
            message: `Indikasi Kuat Typosquatting Brand Populer (${b.name})`,
            explanation: `Nama domain mencoba memalsukan atau mencatut merek resmi '${b.name}' melalui manipulasi karakter, ejaan tipuan, atau penggabungan kata (-login, -promo, -verify) di luar domain kanonis (${b.canonical}).`,
            mitigation: `Segera tinggalkan situs ini! Buka hanya alamat resmi (${b.canonical}) atau gunakan aplikasi resmi dari Google Play Store / Apple App Store.`
          })
          break
        }
      }
    }

    // 4. KALKULASI SHANNON ENTROPY (Deteksi Domain Acak / DGA)
    const entropyVal = calculateEntropy(domainLabel)
    if (domainLabel.length >= 8 && entropyVal >= 3.65) {
      score += 40
      findings.push({
        severity: 'high',
        message: `Entropi Karakter Sangat Tinggi (${entropyVal} bit) - Indikasi DGA`,
        explanation: `Nama domain '${domainLabel}' memiliki skor Shannon Entropy sebesar ${entropyVal} bit per karakter. Tingkat keacakan setinggi ini adalah karakteristik khas Domain Generation Algorithm (DGA) yang dihasilkan otomatis oleh malware untuk menghindari pemblokiran DNS statis.`,
        mitigation: 'Blokir koneksi ke domain ini dan lakukan pemindaian keamanan (antivirus) pada perangkat Anda jika tautan ini sempat terbuka.'
      })
    }

    // 5. DETEKSI PENGGUNAAN ALAMAT IP MENTAH
    const ipPattern = /(?:https?:\/\/)?(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?/i
    if (ipPattern.test(trimmed)) {
      score += 45
      findings.push({
        severity: 'critical',
        message: 'Penggunaan Alamat IP Mentah (Bukan Nama Domain Resmi)',
        explanation: 'Website menggunakan alamat numerik IP langsung tanpa nama domain berizin. Praktik ini lazim digunakan penyerang untuk menghindari verifikasi identitas DNS serta penyaringan filter keamanan web.',
        mitigation: 'Institusi perbankan, e-commerce, dan layanan resmi tidak pernah menggunakan alamat IP mentah untuk pengguna publik. Jangan lakukan login atau transaksi!'
      })
    }

    // 6. DETEKSI PROTOKOL HTTP TANPA ENKRIPSI
    if (/^http:\/\//i.test(trimmed) && /(login|admin|bank|akun|masuk|auth|verifikasi|dana)/i.test(trimmed)) {
      score += 25
      findings.push({
        severity: 'high',
        message: 'Protokol HTTP Tidak Terenkripsi pada Titik Masuk Sensitif',
        explanation: 'Halaman ini meminta otentikasi login atau verifikasi akun menggunakan protokol HTTP polos (port 80). Seluruh data kata sandi dan username dapat disadap dengan mudah oleh pihak ketiga di jaringan yang sama.',
        mitigation: 'Jangan pernah memasukkan kredensial login pada halaman HTTP. Pastikan selalu terdapat ikon gembok HTTPS terenkripsi.'
      })
    }

    // 7. DETEKSI URL SHORTENER
    if (/(?:bit\.ly|s\.id|t\.ly|tinyurl\.com|cutt\.ly|is\.gd|rb\.gy)\b/i.test(trimmed)) {
      score += 20
      findings.push({
        severity: 'medium',
        message: 'Penggunaan Layanan Pemendek URL (Shortlink)',
        explanation: 'Tautan menggunakan pemendek URL yang menyembunyikan alamat target sesungguhnya. Aktor penipuan sering menggunakan metode ini untuk menghindari filter deteksi tautan pada chat WhatsApp/SMS.',
        mitigation: 'Gunakan alat expander URL untuk melihat tujuan akhir tautan sebelum mengekliknya.'
      })
    }
  }

  // 8. PEMERIKSAAN TEKS CHAT / REKAYASA SOSIAL DARI HEURISTIC ENGINE
  const textAnalysis = scanText(trimmed)
  if (textAnalysis) {
    for (const eng of textAnalysis.engines) {
      if (eng.status === 'DANGER') {
        const severity = eng.score >= 35 ? 'critical' : eng.score >= 25 ? 'high' : 'medium'
        const exists = findings.some(f => f.message.toLowerCase().includes(eng.name.toLowerCase()))
        if (!exists) {
          findings.push({
            severity,
            message: `${eng.name}: ${eng.explanation}`,
            explanation: `Pola kalimat dalam pesan memicu alarm heuristik kategori '${eng.category}'. ${eng.explanation}`,
            mitigation: eng.actionStep
          })
          score += eng.score
        }
      }
    }

    if (textAnalysis.summary.combosTriggered && textAnalysis.summary.combosTriggered.length > 0) {
      findings.push({
        severity: 'critical',
        message: `Kombinasi Modus Berbahaya: ${textAnalysis.summary.combosTriggered.join(', ')}`,
        explanation: 'Terdeteksi sinergi beberapa pola manipulasi secara serentak (misal: tekanan waktu ketat dikombinasikan dengan instruksi transfer biaya admin). Ini adalah indikator kuat penipuan terorganisir.',
        mitigation: 'Hentikan percakapan seketika dan jangan tanggapi desakan waktu yang diberikan pengirim.'
      })
      score = Math.round(score * 1.25)
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
    target: trimmed,
    score,
    status,
    findings,
    timestamp: new Date().toISOString()
  }
}
