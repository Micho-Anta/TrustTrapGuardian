/**
 * Scam Heuristic Engine Rules
 * 10 Modul Deteksi Modus Penipuan Rekayasa Sosial & Phishing
 */

import { isOfficialDomain } from "../data/officialDomains.js";

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
      { pattern: /\b(?:me|men|di)?transfer\s+(?:biaya|uang|dana|tiket|reservasi|admin|deposit|\d+(?:\s*(?:juta|ribu|rb|k))?)\b/gi, label: "Instruksi Transfer Uang di Muka" },
      { pattern: /(?:modal\s*deposit|uang\s*jaminan)/gi, label: "Klausa Modal Jaminan" },
      { pattern: /(?:rekening\s*(?:penampung|sementara)|alihkan\s*saldo|amankan\s*saldo)/gi, label: "Modus Rekening Penampung Aman" }
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
      { pattern: /(?:(?:dalam\s*waktu|dalam|proses)\s*(?:15|30|10|5|\d+)\s*menit)/gi, label: "Batas Waktu Ketat (Hitungan Menit)" },
      { pattern: /(?:sebelum\s*(?:kuota\s*)?hangus)/gi, label: "Manipulasi Kuota Hangus" },
      { pattern: /(?:akun\s*(?:anda\s*)?(?:diblokir|dibekukan|ditangguhkan))/gi, label: "Ancaman Pemblokiran Akun" },
      { pattern: /(?:denda\s*keterlambatan|tindakan\s*hukum)/gi, label: "Ancaman Denda / Sanksi" },
      { pattern: /(?:berlaku\s*hari\s*ini\s*saja|segera\s*(?:transfer|klaim|konfirmasi|verifikasi))/gi, label: "Tekanan Urgensi Hari Ini" },
      { pattern: /(?:darurat(?:\s+di\s+rumah\s+sakit|\s+tolong|\s+butuh)?|\bdarurat\b)/gi, label: "Pura-pura Kondisi Darurat" },
      { pattern: /(?:penting\s*banget|mendesak|sangat\s*penting|butuh\s*(?:cepat|sekarang))/gi, label: "Manipulasi Urgensi Mendesak" }
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
      { pattern: /(?:(?:instal|pasang|download|unduh)\s*(?:dan\s*buka|aplikasi))/gi, label: "Paksaan Menginstal/Download Aplikasi Eksternal" },
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
      { pattern: /(?:pt\s*telekomunikasi\s*nusantara|rekrutmen\s*bersama\s*bumn|seleksi\s*bumn)/gi, label: "Catut Nama Instansi BUMN" },
      { pattern: /(?:bank\s*nasional\s*nusantara|(?:bank\s*)?(?:bca|bri|mandiri|bni)\b)/gi, label: "Catut Nama Bank Nasional" },
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
    explanation: "Menggunakan tautan pemendek (shortlink), domain tiruan brand, atau domain murah berisiko (.xyz, .top) yang mengarah ke situs penipuan.",
    actionStep: "Hindari membuka tautan! Periksa apakah domain berakhiran resmi seperti .co.id, .id, atau .go.id.",
    inspectUrl: true
  },
  {
    id: "family_impersonation",
    name: "Family Impersonation / Urgensi Kerabat",
    category: "Social Engineering",
    baseWeight: 30,
    explanation: "Menyamar sebagai anak atau keluarga yang mengaku ganti nomor atau dalam kondisi darurat musibah untuk meminta pulsa atau transfer uang.",
    actionStep: "Telepon langsung nomor lama kerabat untuk verifikasi suara sebelum mengirimkan pulsa atau uang. Jangan percaya nomor baru.",
    groupA: [
      { pattern: /nomor\s*baru/gi, label: "Klaim Nomor Baru" },
      { pattern: /ganti\s*nomor/gi, label: "Klaim Ganti Nomor" },
      { pattern: /hp\s*(?:lama\s*)?(?:rusak|hilang|error)/gi, label: "Klaim HP Lama Rusak/Hilang" },
      { pattern: /aku\s*(?:anakmu|anak\s*mama)/gi, label: "Pengakuan Sebagai Anak" },
      { pattern: /\bdarurat\b/gi, label: "Klaim Situasi Darurat" },
      { pattern: /rumah\s*sakit/gi, label: "Klaim Berada di Rumah Sakit" },
      { pattern: /kecelakaan/gi, label: "Klaim Mengalami Kecelakaan" }
    ],
    groupB: [
      { pattern: /\bpulsa\b/gi, label: "Permintaan Pengisian Pulsa" },
      { pattern: /\btransfer\b/gi, label: "Permintaan Transfer Uang" },
      { pattern: /kirim(?:in)?\s*uang/gi, label: "Permintaan Kirim Uang" },
      { pattern: /talangin/gi, label: "Permintaan Talangan Dana" },
      { pattern: /pinjam(?:in)?\s*uang/gi, label: "Permintaan Pinjaman Uang" },
      { pattern: /\brekening\b/gi, label: "Penyebutan Nomor Rekening" }
    ],
    rules: [
      { pattern: /(?:nomor\s*baru|ganti\s*nomor|hp\s*(?:lama\s*)?(?:rusak|hilang|error)|aku\s*(?:anakmu|anak\s*mama)|darurat|rumah\s*sakit|kecelakaan)/gi, label: "Identitas / Musibah Kerabat Palsu" },
      { pattern: /(?:pulsa|transfer|kirim(?:in)?\s*uang|talangin|pinjam(?:in)?\s*uang|rekening)/gi, label: "Permintaan Dana / Pulsa Darurat" }
    ]
  },
  {
    id: "illegal_loan",
    name: "Pinjol Ilegal & Akses Data Sensitif",
    category: "Predatory Lending",
    baseWeight: 30,
    explanation: "Penawaran pinjaman kilat tanpa jaminan atau SLIK yang meminta izin akses kontak, galeri, atau kamera untuk sarana intimidasi.",
    actionStep: "Tolak pinjaman tersebut dan jangan instal aplikasinya. Pinjol resmi OJK dilarang meminta akses kontak telepon dan galeri foto.",
    rules: [
      { pattern: /pinjaman\s*(?:online\s*)?cair/gi, label: "Janji Pinjaman Online Cepat Cair" },
      { pattern: /tanpa\s*(?:jaminan|slik|bi\s*checking)/gi, label: "Klaim Tanpa Jaminan / SLIK / BI Checking" },
      { pattern: /proses\s*\d+\s*menit/gi, label: "Klaim Proses Kilat Hitungan Menit" },
      { pattern: /(?:akses\s*(?:kontak|galeri|kamera)|izinkan\s*akses)/gi, label: "Permintaan Izin Akses Data Sensitif" }
    ]
  },
  {
    id: "threat_extortion",
    name: "Ancaman & Pemerasan Kontak",
    category: "Coercion & Extortion",
    baseWeight: 35,
    explanation: "Ancaman menyebarkan foto, video, atau data pribadi ke daftar kontak keluarga disertai paksaan membayar tagihan atau hutang segera.",
    actionStep: "Jangan panik dan jangan transfer uang tebusan. Amankan bukti tangkapan layar dan segera laporkan ke kepolisian lewat patrolisiber.id.",
    rules: [
      { pattern: /(?:sebar|viralkan|kirim)\s+(?:foto|data|kontak|video)/gi, label: "Ancaman Penyebaran Foto/Data/Kontak/Video" },
      { pattern: /(?:hubungi|menghubungi)\s+(?:keluarga|kontak)(?:\s+kamu|\s+keluargamu)?/gi, label: "Ancaman Teror ke Kontak Keluarga" },
      { pattern: /bayar\s+(?:hutang(?:mu)?|tagihan(?:mu)?)\s+(?:hari\s*ini|sekarang)\s+atau/gi, label: "Ultimatum Paksaan Bayar Hutang/Tagihan" }
    ]
  },
  {
    id: "investment_scam",
    name: "Investasi Bodong & Skema Ponzi",
    category: "Financial Fraud",
    baseWeight: 30,
    explanation: "Tawaran investasi dengan janji imbal hasil tetap tidak wajar, klaim tanpa risiko, member VIP berbayar, dan undangan ke grup privat.",
    actionStep: "Cek legalitas entitas di Satgas Pasti OJK (kontak 157). Jangan tergiur janji keuntungan pasti tanpa risiko di grup chat privat.",
    rules: [
      { pattern: /profit\s*\d+\s*%\s*(?:per|\/)\s*(?:hari|minggu|bulan)/gi, label: "Janji Profit Periode Tidak Wajar" },
      { pattern: /dijamin\s*(?:cuan|profit|untung)/gi, label: "Klaim Garansi Pasti Untung" },
      { pattern: /member\s*vip/gi, label: "Skema Keanggotaan Member VIP" },
      { pattern: /modal\s*(?:minimal\s*)?\d+(?:rb|k|jt|juta|ribu)?/gi, label: "Pola Modal Minimal Investasi" },
      { pattern: /join\s*grup\s*(?:telegram|whatsapp)/gi, label: "Undangan Bergabung ke Grup Chat Privat" },
      { pattern: /tanpa\s*risiko/gi, label: "Klaim Palsu Investasi Tanpa Risiko" }
    ]
  }
];

// Helper: Hitung Shannon Entropy ternormalisasi
function normalizedEntropy(str) {
  if (!str || str.length < 2) return 0;
  const freq = {};
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
  const len = str.length;
  let H = 0;
  for (const count of Object.values(freq)) {
    const p = count / len;
    H -= p * Math.log2(p);
  }
  return H / Math.log2(len);
}

// Helper khusus pengecekan URL / Link Phishing
export function inspectLinksInText(text) {
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  const matches = text.match(urlRegex) || [];
  const findings = [];

  const suspiciousTlds = [".xyz", ".top", ".click", ".site", ".work", ".info", ".vip", ".club", ".online", ".buzz", ".live", ".space", ".cfd", ".gq", ".ml", ".tk", ".ga"];
  const shorteners = ["bit.ly", "s.id", "t.ly", "tinyurl.com", "is.gd", "cutt.ly", "rb.gy"];

  const brandTokens = [
    "shopee", "tokopedia", "gopay", "dana", "ovo", "bca", "bri", "bni", "mandiri",
    "jne", "jnt", "sicepat", "pln", "bpjs", "lazada", "traveloka", "telkomsel",
    "whatsapp", "instagram", "tiktok"
  ];
  const baitWords = [
    "verifikasi", "login", "klaim", "promo", "cek", "resi", "update", "akun", "secure", "hadiah"
  ];

  for (const rawUrl of matches) {
    const urlLower = rawUrl.toLowerCase();

    // Ekstrak hostname/domain
    let domain = "";
    try {
      const urlObj = new URL(rawUrl.startsWith("www.") ? "https://" + rawUrl : rawUrl);
      domain = urlObj.hostname;
    } catch {
      domain = urlLower.replace(/^https?:\/\//, "").split("/")[0];
    }

    const domainLower = domain.toLowerCase();

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
      if (domainLower.endsWith(tld) || urlLower.includes(tld)) {
        findings.push({
          url: rawUrl,
          reason: `Domain menggunakan ekstensi berisiko tinggi (${tld}) sering dipakai phishing`,
          severity: "CRITICAL"
        });
      }
    }

    // Cek Deteksi Brand Spoofing (Token Brand + Kata Pancingan pada Domain Tidak Resmi)
    const hasBrandToken = brandTokens.some((b) => domainLower.includes(b));
    const hasBaitWord = baitWords.some((w) => domainLower.includes(w) || urlLower.includes(w));
    if (hasBrandToken && hasBaitWord && !isOfficialDomain(domainLower)) {
      findings.push({
        url: rawUrl,
        reason: "Nama brand dipakai di domain yang bukan domain resminya",
        severity: "CRITICAL"
      });
    }

    // Cek Shannon Entropy untuk domain panjang >= 8 karakter (tanda domain acak/obfuscated)
    const domainBase = domainLower.split(".")[0];
    if (domainBase.length >= 8 && !isOfficialDomain(domainLower)) {
      const entropy = normalizedEntropy(domainBase);
      if (entropy >= 0.85) {
        findings.push({
          url: rawUrl,
          reason: `Domain '${domain}' memiliki karakter acak/obfuscated (Entropy Tinggi: ${entropy.toFixed(2)}) - ciri umum domain phishing`,
          severity: "HIGH"
        });
      }
    }
  }

  return findings;
}
