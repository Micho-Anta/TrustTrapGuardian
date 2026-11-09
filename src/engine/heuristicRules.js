/**
 * Scam Heuristic Engine Rules
 * 6 Modul Deteksi Modus Penipuan Rekayasa Sosial & Phishing
 */

export const HEURISTIC_ENGINES = [
  {
    id: "upfront_fee",
    name: "Upfront Fee & Deposit Trap",
    category: "Financial Manipulation",
    baseWeight: 30,
    explanation: "Meminta uang di muka sebagai syarat rekrutmen kerja, pencairan hadiah, atau deposit tugas. Instansi resmi dan undian legal tidak pernah memungut biaya di awal.",
    actionStep: "Jangan transfer uang sepeser pun. Rekrutmen & undian resmi tidak pernah meminta transfer biaya reservasi/administrasi di awal.",
    rules: [
      { pattern: /(?:biaya\s*(?:admin|reservasi|pendaftaran|materai|tiket|registrasi|asuransi))/gi, label: "Permintaan Biaya Administrasi/Reservasi" },
      { pattern: /(?:deposit\s*(?:tugas|saldo|awal|misi))/gi, label: "Pola Deposit Tugas" },
      { pattern: /(?:top\s*up\s*(?:deposit|saldo\s*tugas))/gi, label: "Top Up Saldo Misi" },
      { pattern: /(?:transfer\s*(?:biaya|uang|dana|sebesar|rp))/gi, label: "Instruksi Transfer Uang di Muka" },
      { pattern: /(?:modal\s*deposit|uang\s*jaminan)/gi, label: "Klausa Modal Jaminan" }
    ]
  },
  {
    id: "artificial_urgency",
    name: "Artificial Urgency & Fear",
    category: "Psychological Manipulation",
    baseWeight: 20,
    explanation: "Menciptakan tekanan batas waktu atau ancaman pemblokiran/denda agar korban panik dan tidak sempat mengecek silang kebenarannya.",
    actionStep: "Tarik napas dan tahan diri. Penipu sengaja menyalakan rasa panik agar nalar kritis Anda hilang.",
    rules: [
      { pattern: /(?:dalam\s*(?:waktu\s*)?(?:15|30|10|5)\s*menit)/gi, label: "Batas Waktu Ketat (Hitungan Menit)" },
      { pattern: /(?:sebelum\s*(?:kuota\s*)?hangus)/gi, label: "Manipulasi Kuota Hangus" },
      { pattern: /(?:akun\s*(?:anda\s*)?(?:diblokir|dibekukan|ditangguhkan))/gi, label: "Ancaman Pemblokiran Akun" },
      { pattern: /(?:denda\s*keterlambatan|tindakan\s*hukum)/gi, label: "Ancaman Denda / Sanksi" },
      { pattern: /(?:berlaku\s*hari\s*ini\s*saja|segera\s*(?:transfer|klaim|konfirmasi))/gi, label: "Tekanan Urgensi Hari Ini" },
      { pattern: /(?:darurat\s*tolong\s*transfer)/gi, label: "Pura-pura Kondisi Darurat" }
    ]
  },
  {
    id: "unrealistic_reward",
    name: "Unrealistic Reward / Task Scam",
    category: "Deceptive Employment",
    baseWeight: 25,
    explanation: "Menawarkan komisi tidak masuk akal untuk tugas yang sangat sepele tanpa keahlian khusus. Modus klasik untuk memancing deposit bertingkat.",
    actionStep: "Tinggalkan tawaran tersebut. Skema bayar misi / like video adalah pintu masuk jeratan penipuan berantai.",
    rules: [
      { pattern: /(?:komisi\s*harian\s*(?:rp)?\s*[0-9]+)/gi, label: "Janji Komisi Harian Fantastis" },
      { pattern: /(?:cukup\s*like\s*(?:&|dan)?\s*subscribe)/gi, label: "Tugas Sepele Like & Subscribe" },
      { pattern: /(?:kerja\s*(?:dari|lewat)\s*hp\s*(?:tanpa\s*modal)?)/gi, label: "Iming-iming Kerja HP Mudah" },
      { pattern: /(?:dibayar\s*per\s*misi|misi\s*vip)/gi, label: "Sistem Komisi Per Misi" },
      { pattern: /(?:profit\s*[0-9]{2,3}%|keuntungan\s*instan)/gi, label: "Iming-iming Profit Instan" },
      { pattern: /(?:modal\s*kecil\s*untung\s*besar)/gi, label: "Skema Cepat Kaya" }
    ]
  },
  {
    id: "apk_otp_harvester",
    name: "OTP & APK Harvester",
    category: "Malware & Credential Theft",
    baseWeight: 40,
    explanation: "Berusaha mencuri akses akun lewat kode OTP/PIN atau memancing pemasangan aplikasi berbahaya (.APK sniffing) yang dapat membajak SMS perbankan.",
    actionStep: "JANGAN KLIK dan JANGAN PERNAH INSTAL file .APK yang dikirim via chat! Jangan pernah membagikan 6 digit kode OTP ke siapa pun.",
    rules: [
      { pattern: /(?:[a-zA-Z0-9_\-]+\.apk\b)/gi, label: "Pancingan File Ekstensi Berbahaya (.APK)" },
      { pattern: /(?:kode\s*otp\b|sebutkan\s*(?:kode|pin)|pin\s*6\s*digit)/gi, label: "Permintaan Penyerahan Kode OTP / PIN" },
      { pattern: /(?:surat_.*\.apk|undangan_.*\.apk|paket_.*\.apk|resi_.*\.apk)/gi, label: "Kedok File Surat/Paket .APK" },
      { pattern: /(?:instal\s*(?:dan\s*buka|aplikasi)|pasang\s*aplikasi)/gi, label: "Paksaan Menginstal Aplikasi Eksternal" },
      { pattern: /(?:token\s*anda|kode\s*respon\s*token)/gi, label: "Pencurian Respon Token Perbankan" }
    ]
  },
  {
    id: "identity_mismatch",
    name: "Identity & Channel Mismatch",
    category: "Brand Impersonation",
    baseWeight: 25,
    explanation: "Mencatut nama institusi besar (BUMN, Bank, Ekspedisi, Pajak) menggunakan kanal personal yang tidak dapat diverifikasi secara resmi.",
    actionStep: "Verifikasi melalui akun resmi bercentang biru atau hotline resmi di situs utama institusi bersangkutan.",
    rules: [
      { pattern: /(?:pt\s*telkom\s*indonesia|rekrutmen\s*bersama\s*bumn|seleksi\s*bumn)/gi, label: "Catut Nama Instansi BUMN" },
      { pattern: /(?:bank\s*(?:central\s*asia|bca|bri|mandiri|bni))/gi, label: "Catut Nama Bank Nasional" },
      { pattern: /(?:j&t\s*express|jnt|pos\s*indonesia|sicepat)/gi, label: "Catut Nama Jasa Ekspedisi" },
      { pattern: /(?:gebyar\s*(?:undian|hadiah|poin))/gi, label: "Pencatutan Program Gebyar Hadiah" },
      { pattern: /(?:djp|kantor\s*pajak|kemensos|bansos)/gi, label: "Pencatutan Lembaga Pemerintah" }
    ]
  },
  {
    id: "phishing_link",
    name: "Phishing Link & Domain Inspector",
    category: "Malicious Infrastructure",
    baseWeight: 35,
    explanation: "Menggunakan tautan pemendek (shortlink) atau domain murah/mencurigakan (.xyz, .top, tiruan brand) yang mengarah ke situs penipuan.",
    actionStep: "Hindari membuka tautan! Periksa apakah domain berakhiran resmi seperti .co.id, .id, atau .go.id.",
    inspectUrl: true
  }
];

// Helper khusus pengecekan URL / Link Phishing
export function inspectLinksInText(text) {
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  const matches = text.match(urlRegex) || [];
  const findings = [];

  const suspiciousTlds = [".xyz", ".top", ".click", ".site", ".work", ".info", ".vip", ".club", ".online", ".buzz", ".live", ".space", ".cfd", ".gq", ".ml", ".tk", ".ga"];
  const shorteners = ["bit.ly", "s.id", "t.ly", "tinyurl.com", "is.gd", "cutt.ly", "rb.gy"];
  const spoofedBrands = ["bca", "bri", "mandiri", "bni", "telkom", "shopee", "tokopedia", "dana", "pajak", "kupon", "klaim", "gebyar", "hadiah"];

  for (const rawUrl of matches) {
    const urlLower = rawUrl.toLowerCase();

    // Cek Shortener
    for (const sh of shorteners) {
      if (urlLower.includes(sh)) {
        findings.push({
          url: rawUrl,
          reason: `Link pemendek URL (${sh}) berisiko menyembunyikan alamat target asli`,
          severity: "HIGH"
        });
      }
    }

    // Cek TLD Mencurigakan
    for (const tld of suspiciousTlds) {
      if (urlLower.includes(tld)) {
        findings.push({
          url: rawUrl,
          reason: `Domain menggunakan ekstensi berisiko tinggi (${tld}) sering dipakai phishing`,
          severity: "CRITICAL"
        });
      }
    }

    // Cek Spoofed Brands dalam domain tidak resmi
    for (const brand of spoofedBrands) {
      if (urlLower.includes(brand) && !urlLower.includes(".co.id") && !urlLower.includes(".id") && !urlLower.includes(".go.id") && !urlLower.includes(".com/")) {
        findings.push({
          url: rawUrl,
          reason: `Domain mencatut merek '${brand}' dengan nama domain pihak ketiga yang tidak resmi`,
          severity: "CRITICAL"
        });
      }
    }
  }

  return findings;
}
