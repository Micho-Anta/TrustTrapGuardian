export const JUDGE_PRESETS = [
  {
    id: "preset-1",
    badge: "Preset 1",
    title: "Loker BUMN Palsu",
    category: "Recruitment Scam",
    tagline: "Upfront Fee & Tekanan Waktu",
    text: "Selamat! Berdasarkan seleksi berkas administrasi Rekrutmen Bersama BUMN 2026 PT Telkom Indonesia, Anda dinyatakan Lolos ke tahap interview offline di Jakarta. Mohon konfirmasi kehadiran dengan mentransfer biaya reservasi tiket pesawat dan akomodasi sebesar Rp 1.750.000 ke rekening bendahara panitia BRI 023901002384501 an Surya Travelindo. Biaya akan diganti 100% (reimburse) saat registrasi ulang. Waktu transfer maksimal dalam 15 menit sebelum kuota hangus dan dialihkan ke kandidat cadangan. Kirim bukti transfer ke WA ini.",
    expectedTriggers: ["Upfront Fee", "Artificial Urgency", "Identity Mismatch"]
  },
  {
    id: "preset-2",
    badge: "Preset 2",
    title: "Task Scam Like & Subscribe",
    category: "Part-time Freelance Scam",
    tagline: "Unrealistic Reward & Deposit Tugas",
    text: "Halo Kak! Kami dari Global Media Partner membuka lowongan kerja freelance paruh waktu kerja dari HP tanpa modal pengalaman. Tugas sangat mudah, cukup like & subscribe video YouTube dan follow akun TikTok klien kami. Komisi harian Rp500.000 sampai Rp2.500.000 langsung cair per misi ke e-wallet DANA/OVO Anda! Untuk aktivasi akun dan membuka misi VIP Level 1, silakan top up deposit saldo tugas awal Rp50.000 saja. Modal deposit akan langsung dikembalikan beserta profit 30% dalam 10 menit!",
    expectedTriggers: ["Unrealistic Reward", "Upfront Fee & Deposit", "Artificial Urgency"]
  },
  {
    id: "preset-3",
    badge: "Preset 3",
    title: "Pancingan File .APK & OTP",
    category: "Malware & Account Hijack",
    tagline: "Kurir Paket / Resi Palsu",
    text: "Halo kak, kami dari kurir ekspedisi J&T Express. Ada paket penting atas nama Anda dengan nomor resi JNT9928190223 yang tertahan di gudang transit karena nomor rumah tidak jelas. Tolong cek foto paket dan detail resi di aplikasi pelacakan kami: Surat_Paket_Hilang.apk. Mohon segera diinstal dan dibuka di HP Android Anda. Selain itu, sebutkan 6 digit kode OTP verifikasi yang baru saja masuk lewat SMS ke nomor Anda untuk pembatalan denda keterlambatan paket hari ini.",
    expectedTriggers: ["OTP & APK Harvester", "Artificial Urgency", "Identity Mismatch"]
  },
  {
    id: "preset-4",
    badge: "Preset 4",
    title: "Link Phishing Hadiah Bank",
    category: "Credential Phishing",
    tagline: "Gebyar Poin & Domain Palsu",
    text: "Nasabah Yth PT Bank Central Asia (BCA), nomor rekening Anda terpilih sebagai pemenang Gebyar Undian Akhir Tahun BCA 2026 dengan hadiah saldo tunai Rp 15.000.000. Batas klaim hadiah hanya berlaku hari ini dalam 30 menit! Segera verifikasi kupon pemenang melalui tautan portal resmi: http://bca-klaim-gebyar.xyz/login. Masukkan nomor kartu ATM, PIN 6 digit, dan kode respon token Anda agar hadiah bisa langsung dikreditkan ke saldo tabungan.",
    expectedTriggers: ["Phishing Link", "Artificial Urgency", "Identity Mismatch", "OTP & APK Harvester"]
  }
];
