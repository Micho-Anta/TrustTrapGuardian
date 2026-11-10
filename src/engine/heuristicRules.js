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
      { pattern: /(?:biaya\s*(?:admin|administrasi|reservasi|pendaftaran|materai|tiket|registrasi|asuransi|pengiriman|ongkir|talangan))/gi, label: "Permintaan Biaya Administrasi/Reservasi" },
      { pattern: /(?:deposit\s*(?:tugas|saldo|awal|misi|jaminan|dana|akun))/gi, label: "Pola Deposit Tugas" },
      { pattern: /(?:top\s*up\s*(?:deposit|saldo\s*tugas|saldo|dana))/gi, label: "Top Up Saldo Misi" },
      { pattern: /(?:\b(?:me|men|di)?transfer\s+(?:biaya|uang|dana|tiket|reservasi|admin|deposit|sebesar|rp|ke\s*rekening)\b|transfer\s*(?:biaya|uang|dana|sebesar|rp|ke\s*rekening))/gi, label: "Instruksi Transfer Uang di Muka" },
      { pattern: /(?:modal\s*deposit|uang\s*jaminan|dana\s*talangan)/gi, label: "Klausa Modal Jaminan" },
      { pattern: /(?:rekening\s*(?:penampung|sementara)|alihkan\s*saldo|amankan\s*saldo)/gi, label: "Modus Rekening Penampung Aman" },
      { pattern: /(?:reimburse\s*100%|uang\s*akan\s*diganti)/gi, label: "Iming-iming Reimburse Biaya" }
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
      { pattern: /(?:dalam\s*(?:waktu\s*)?(?:[0-9]+)\s*(?:menit|jam|detik))/gi, label: "Batas Waktu Ketat (Hitungan Menit)" },
      { pattern: /(?:sebelum\s*(?:kuota\s*)?hangus|waktu\s*(?:transfer\s*)?maksimal)/gi, label: "Manipulasi Batas Waktu / Kuota Hangus" },
      { pattern: /(?:akun\s*(?:anda\s*)?(?:diblokir|dibekukan|ditangguhkan|terancam))/gi, label: "Ancaman Pemblokiran Akun" },
      { pattern: /(?:denda\s*keterlambatan|tindakan\s*hukum|sanksi\s*pidana)/gi, label: "Ancaman Denda / Sanksi" },
      { pattern: /(?:berlaku\s*hari\s*ini\s*saja|hanya\s*berlaku\s*hari\s*ini|batas\s*klaim)/gi, label: "Tekanan Urgensi Hari Ini" },
      { pattern: /(?:segera\s*(?:transfer|klaim|konfirmasi|verifikasi|diinstal))/gi, label: "Desakan Aksi Instan" },
      { pattern: /(?:darurat\s*tolong\s*transfer|kesempatan\s*terakhir)/gi, label: "Pura-pura Kondisi Darurat" }
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
      { pattern: /(?:komisi\s*harian\s*(?:rp)?\s*[0-9.]+|gaji\s*harian)/gi, label: "Janji Komisi Harian Fantastis" },
      { pattern: /(?:cukup\s*like\s*(?:&|dan)?\s*subscribe|follow\s*akun|tonton\s*video)/gi, label: "Tugas Sepele Like & Subscribe" },
      { pattern: /(?:kerja\s*(?:dari|lewat)\s*hp\s*(?:tanpa\s*modal)?|lowongan\s*kerja\s*freelance\s*paruh\s*waktu)/gi, label: "Iming-iming Kerja HP Tanpa Pengalaman" },
      { pattern: /(?:dibayar\s*per\s*misi|cair\s*per\s*misi|misi\s*vip)/gi, label: "Sistem Komisi Per Misi" },
      { pattern: /(?:profit\s*[0-9]{1,3}%|keuntungan\s*instan|kembali\s*beserta\s*profit)/gi, label: "Iming-iming Profit Instan" },
      { pattern: /(?:modal\s*kecil\s*untung\s*besar|cepat\s*kaya|penghasilan\s*tambahan\s*mudah)/gi, label: "Skema Cepat Kaya" }
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
      { pattern: /(?:kode\s*otp\b|sebutkan\s*(?:[0-9]+\s*digit\s*)?(?:kode\s*)?otp|pin\s*[0-9]+\s*digit|nomor\s*kartu\s*atm)/gi, label: "Permintaan Penyerahan Kode OTP / PIN / Kartu" },
      { pattern: /(?:surat_.*\.apk|undangan_.*\.apk|paket_.*\.apk|resi_.*\.apk)/gi, label: "Kedok File Surat/Paket .APK" },
      { pattern: /(?:instal\s*(?:dan\s*buka|aplikasi)|pasang\s*aplikasi|buka\s*di\s*hp\s*android|segera\s*diinstal)/gi, label: "Paksaan Menginstal Aplikasi Eksternal" },
      { pattern: /(?:token\s*anda|kode\s*respon\s*token|m-token)/gi, label: "Pencurian Respon Token Perbankan" }
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
      { pattern: /(?:pt\s*(?:telekomunikasi\s*nusantara|telkom\s*indonesia|pln|pertamina)|rekrutmen\s*bersama\s*bumn|seleksi\s*(?:berkas\s*)?bumn)/gi, label: "Catut Nama Instansi BUMN" },
      { pattern: /(?:bank\s*nasional\s*nusantara|bank\s*(?:central\s*asia|bca|bri|mandiri|bni|cimb|bsi)|pt\s*bank\s*central\s*asia|(?:bank\s*)?(?:bca|bri|mandiri|bni)\b)/gi, label: "Catut Nama Bank Nasional" },
      { pattern: /(?:j&t\s*express|jnt|pos\s*indonesia|sicepat|jne|kurir\s*ekspedisi)/gi, label: "Catut Nama Jasa Ekspedisi" },
      { pattern: /(?:gebyar\s*(?:undian|hadiah|poin|akhir\s*tahun)|pemenang\s*undian|kupon\s*pemenang)/gi, label: "Pencatutan Program Gebyar Hadiah" },
      { pattern: /(?:djp|ditjen\s*pajak|kantor\s*pajak|kemensos|bansos|surat\s*tilang)/gi, label: "Pencatutan Lembaga Pemerintah" }
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
  if (!text || typeof text !== "string") return [];
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  const matches = text.match(urlRegex) || [];
  const findings = [];

  const suspiciousTlds = [".xyz", ".top", ".click", ".site", ".work", ".info", ".vip", ".club", ".online", ".buzz", ".live", ".space", ".cfd", ".gq", ".ml", ".tk", ".ga", ".zip", ".mov", ".icu"];
  const shorteners = ["bit.ly", "s.id", "t.ly", "tinyurl.com", "is.gd", "cutt.ly", "rb.gy", "linktr.ee"];
  const spoofedBrands = [
    "bca", "bri", "mandiri", "bni", "bsi", "cimb", "telkom", "shopee", "tokopedia",
    "dana", "ovo", "gopay", "shopeepay", "linkaja", "pajak", "kupon", "klaim",
    "gebyar", "hadiah", "pln", "bpjs"
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
      if (urlLower.includes(brand) && !urlLower.includes(".co.id") && !urlLower.includes(".go.id") && !urlLower.match(/\.(com|net|org)\//)) {
        findings.push({
          url: rawUrl,
          reason: `Domain mencatut merek '${brand}' dengan nama domain pihak ketiga yang tidak resmi`,
          severity: "CRITICAL"
        });
      }
    }

    // Cek Punycode / Homograph Attack
    if (urlLower.includes("xn--")) {
      findings.push({
        url: rawUrl,
        reason: "Terdeteksi Punycode Homograph Attack (karakter tiruan menyerupai karakter alfabet asli)",
        severity: "CRITICAL"
      });
    }

    // Cek IP Address langsung
    const ipPattern = /(?:https?:\/\/)(?:[0-9]{1,3}\.){3}[0-9]{1,3}/i;
    if (ipPattern.test(rawUrl)) {
      findings.push({
        url: rawUrl,
        reason: "Menggunakan IP Address langsung tanpa nama domain terverifikasi",
        severity: "HIGH"
      });
    }

    // Cek Shannon Entropy untuk domain panjang >= 8 karakter (tanda domain acak/obfuscated)
    const domainBase = domain.split(".")[0];
    if (domainBase.length >= 8) {
      const entropy = normalizedEntropy(domainBase);
      if (entropy >= 0.85) {
        findings.push({
          url: rawUrl,
          reason: `Domain '${domain}' memiliki karakter acak/obfuscated (Entropy Tinggi: ${entropy.toFixed(2)}) — ciri umum domain phishing`,
          severity: "HIGH"
        });
      }
    }
  }

  return findings;
}
