/**
 * Data panduan tab ACT (Panic Triage).
 * Diadaptasi dari referensi scan-to-guidance (act-guides.ts) dan disesuaikan
 * dengan ID engine milik TrustTrap Guardian (src/engine/heuristicRules.js):
 *
 *   scan-to-guidance   ->  TrustTrap Guardian
 *   ------------------------------------------------
 *   otp_apk            ->  apk_otp_harvester
 *   urgency_fear       ->  artificial_urgency
 *   task_scam          ->  unrealistic_reward
 *   channel_mismatch   ->  identity_mismatch
 *   upfront_fee        ->  upfront_fee        (sama)
 *   phishing_link      ->  phishing_link      (sama)
 */

/** Langkah untuk kondisi "Baru Terima Chat" (belum klik / transfer apa pun). */
export const PREVENTIVE_STEPS = [
  {
    id: "prev-1",
    title: "Hentikan Komunikasi & Jangan Balas Chat",
    desc: "Penipu sering memanfaatkan teknik desakan psikologis lanjutan jika Anda terlihat ragu-ragu. Tahan diri dan jangan terpancing berdebat. Membalas juga menandakan nomor Anda aktif."
  },
  {
    id: "prev-2",
    title: "Cek Status Nomor Rekening di CekRekening.id",
    desc: "Periksa apakah nomor rekening pelaku sudah dilaporkan penipuan sebelumnya melalui portal resmi Kominfo: https://cekrekening.id",
    engineId: "upfront_fee"
  },
  {
    id: "prev-3",
    title: "Verifikasi Nomor Kontak di Aplikasi Getcontact / Truecaller",
    desc: "Lihat tag atau label nama yang diberikan pengguna lain terhadap nomor HP pengirim untuk mendeteksi rekam jejak penipuan."
  },
  {
    id: "prev-4",
    title: "Cross-Check ke Call Center Resmi Perusahaan",
    desc: "Jika mengatasnamakan rekrutmen BUMN atau promo Bank, cek langsung akun Instagram/Twitter centang biru atau website berakhiran .co.id / .go.id.",
    engineId: "identity_mismatch"
  },
  {
    id: "prev-5",
    title: "Verifikasi Lewat Jalur Resmi yang Terpisah",
    desc: "Jangan hubungi nomor atau tautan yang ada di dalam chat. Cari kontak resmi lewat situs atau aplikasi asli instansinya.",
    engineId: "identity_mismatch"
  },
  {
    id: "prev-6",
    title: "Blokir & Laporkan Nomor Pengirim",
    desc: "Gunakan fitur 'Laporkan & Blokir' di WhatsApp/Telegram, lalu laporkan nomornya ke aduannomor.id."
  }
];

/** Langkah untuk kondisi "Terlanjur Klik / Transfer". */
export const EMERGENCY_STEPS = [
  {
    id: "emg-1",
    priority: "KRUSIAL (1-15 Menit Pertama)",
    title: "Segera Hubungi Call Center Bank Anda",
    desc: "Minta pemblokiran darurat rekening tujuan dan amankan rekening Anda sendiri. Semakin cepat Anda lapor, semakin besar peluang dana tertahan di rekening penampung.",
    engineId: "upfront_fee"
  },
  {
    id: "emg-2",
    priority: "APLIKASI .APK TERLANJUR DIINSTAL",
    title: "Aktifkan Mode Pesawat (Airplane Mode) Segera!",
    desc: "Putuskan seluruh koneksi internet dan jaringan seluler agar malware .APK tidak dapat mengirim SMS OTP atau mencuri data kredensial Anda ke server penipu. Setelah itu hapus (uninstall) aplikasi asing tersebut.",
    engineId: "apk_otp_harvester"
  },
  {
    id: "emg-3",
    priority: "GANTI PASSWORD & PIN",
    title: "Ganti Semua PIN Perbankan & Password Email dari Perangkat Lain",
    desc: "Gunakan HP atau laptop anggota keluarga lain yang aman untuk mengubah password email, m-Banking, dan e-wallet Anda. Cek juga 'Perangkat Tertaut' di WhatsApp/Google dan cabut perangkat yang tidak dikenal.",
    engineId: "phishing_link"
  },
  {
    id: "emg-4",
    priority: "LAPOR HUKUM",
    title: "Buat Laporan Resmi di PatroliSiber.id & Kantor Polisi",
    desc: "Kumpulkan bukti screenshot chat, mutasi rekening, dan nomor telepon pelaku sebagai lampiran berkas laporan penipuan digital."
  },
  {
    id: "emg-5",
    priority: "JANGAN TERJEBAK LAGI",
    title: "Simpan Bukti & Hentikan Transfer Lanjutan",
    desc: "Jangan transfer lagi dengan alasan 'biaya pencairan', 'pajak', atau 'level berikutnya'. Simpan bukti transfer, chat, dan nomor rekening pelaku, lalu lapor ke bank pengirim dan IASC OJK.",
    engineId: "unrealistic_reward"
  }
];

/**
 * Panduan singkat per modus penipuan (satu panduan untuk tiap engine).
 * `engineId` harus sama dengan id di HEURISTIC_ENGINES.
 */
export const MODE_GUIDES = [
  {
    engineId: "apk_otp_harvester",
    title: "APK / OTP Dicuri",
    steps: [
      "Aktifkan Mode Pesawat, lalu uninstall aplikasi asing.",
      "Telepon call center bank dari nomor resmi di kartu ATM.",
      "Ganti PIN & sandi m-banking dari perangkat lain."
    ],
    docs: ["Nama file .apk / tangkapan layar", "Waktu instal", "Mutasi rekening terbaru"]
  },
  {
    engineId: "upfront_fee",
    title: "Terlanjur Transfer Biaya",
    steps: [
      "Hentikan transfer lanjutan apa pun.",
      "Lapor ke bank pengirim & IASC secepatnya.",
      "Laporkan rekening pelaku di cekrekening.id."
    ],
    docs: ["Bukti transfer", "Nomor & nama rekening tujuan", "Tangkapan layar chat"]
  },
  {
    engineId: "unrealistic_reward",
    title: "Task Scam / Komisi Tugas",
    steps: [
      "Keluar dari grup tugas, jangan deposit 'level berikutnya'.",
      "Laporkan rekening penampung ke IASC.",
      "Waspadai jasa 'balik dana' berbayar — itu penipuan lanjutan."
    ],
    docs: ["Riwayat deposit", "Link grup Telegram/WA", "Nama akun admin"]
  },
  {
    engineId: "phishing_link",
    title: "Klik Tautan Phishing",
    steps: [
      "Tutup halaman, jangan isi data apa pun.",
      "Jika sempat login, ganti sandi & aktifkan 2FA.",
      "Laporkan situs ke aduankonten.id."
    ],
    docs: ["URL lengkap (sebagai teks)", "Tangkapan layar halaman"]
  },
  {
    engineId: "identity_mismatch",
    title: "Penipu Mengaku Instansi",
    steps: [
      "Hubungi instansi asli lewat kontak di situs resminya.",
      "Laporkan nomor ke aduannomor.id."
    ],
    docs: ["Nomor pengirim", "Tangkapan layar profil & pesan"]
  },
  {
    engineId: "artificial_urgency",
    title: "Ditekan / Diancam",
    steps: [
      "Ambil jeda, ceritakan ke orang terdekat.",
      "Jika ada ancaman/pemerasan, lapor ke patrolisiber.id atau SPKT Polri."
    ],
    docs: ["Pesan ancaman", "Kronologi singkat"]
  }
];

/**
 * Kanal bantuan & pelaporan resmi.
 * `href` terisi -> ditampilkan sebagai kartu tautan; kosong -> kartu info (telepon).
 */
export const OFFICIAL_CHANNELS = [
  {
    id: "cekrekening",
    name: "CekRekening.id",
    role: "Blokir Rekening Bank Penipu",
    contact: "cekrekening.id",
    href: "https://cekrekening.id",
    prep: "Nama bank, nomor rekening, tangkapan layar chat."
  },
  {
    id: "patrolisiber",
    name: "PatroliSiber.id",
    role: "Laporan Resmi Bareskrim Polri",
    contact: "patrolisiber.id · SPKT Polri terdekat",
    href: "https://patrolisiber.id",
    prep: "KTP, kronologi, semua bukti."
  },
  {
    id: "iasc",
    name: "IASC / OJK",
    role: "Penipuan Transaksi Keuangan & Blokir Rekening Penampung",
    contact: "Telp 157 · WA 081157157157",
    href: "https://iasc.ojk.go.id",
    prep: "Kronologi, bukti transfer, nomor rekening terlapor."
  },
  {
    id: "aduannomor",
    name: "Aduan Nomor",
    role: "Lapor Nomor HP/WA Penyebar Penipuan",
    contact: "aduannomor.id",
    href: "https://aduannomor.id",
    prep: "Tangkapan layar pesan dengan nomor pengirim."
  },
  {
    id: "aduankonten",
    name: "Aduan Konten",
    role: "Lapor Situs/Konten Phishing",
    contact: "aduankonten.id",
    href: "https://aduankonten.id",
    prep: "URL sebagai teks dan tangkapan layar."
  },
  {
    id: "bca",
    name: "Call Center Halo BCA",
    role: "Blokir m-Banking & Kartu",
    contact: "1500888 (24 Jam)",
    prep: "Nomor rekening/kartu dan kronologi singkat."
  },
  {
    id: "mandiri-bri",
    name: "Call Center Mandiri / BRI",
    role: "Blokir m-Banking & Kartu",
    contact: "14000 / 1500017",
    prep: "Nomor rekening/kartu dan kronologi singkat."
  }
];

/** Engine yang otomatis membuka mode "Terlanjur Klik / Transfer". */
export const CRITICAL_ENGINES = [
  "apk_otp_harvester",
  "upfront_fee",
  "phishing_link",
  "unrealistic_reward"
];

/** Catatan penutup di bawah daftar kanal pelaporan. */
export const REPORTING_DISCLAIMER =
  "Melapor membantu membatasi akses pelaku dan mempercepat pemblokiran rekening penampung, tetapi tidak menjamin dana kembali. Waspadai jasa \"balik dana\" berbayar — itu sering penipuan lanjutan.";

/** Ambil ID engine yang terdeteksi (status DANGER) dari hasil scanText(). */
export function getTriggeredEngineIds(scanResult) {
  if (!scanResult || !Array.isArray(scanResult.engines)) return [];
  return scanResult.engines.filter((e) => e.status === "DANGER").map((e) => e.id);
}

/** Panduan yang relevan dengan hasil scan tampil lebih dulu; sisanya urutan asli. */
export function sortGuides(triggeredIds = []) {
  const tagged = MODE_GUIDES.map((g) => ({ ...g, relevant: triggeredIds.includes(g.engineId) }));
  return [...tagged.filter((g) => g.relevant), ...tagged.filter((g) => !g.relevant)];
}
