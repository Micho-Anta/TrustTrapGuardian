# 🛡️ The Trust Trap Guardian
> **VirusTotal-Style Social Engineering & Scam Detector for Digital Deception Defense**  
> *Solusi Inovatif Kompetisi Web Development MIT-WEEK 2026*

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.x-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 1. Latar Belakang & Konsep: Mengapa Gaya 'VirusTotal'?

Di Indonesia, lebih dari **90% kejahatan siber** yang menyasar generasi muda dan masyarakat umum di WhatsApp, Telegram, dan Direct Message **bukan menggunakan malware teknis canggih**, melainkan teknik **Rekayasa Sosial (Social Engineering)**: manipulasi psikologis yang mengeksploitasi kepanikan, rasa tergiur, atau empati korban.

Situs populer **VirusTotal** memungkinkan pengguna memeriksa file atau URL menggunakan puluhan mesin antivirus teknis secara transparan. **TrustTrap Guardian** mengadaptasi paradigma visual dan transparansi tersebut untuk **mendeteksi rekayasa sosial dan penipuan digital**:
* **VirusTotal Asli:** Memeriksa trojan, virus teknis, dan hash biner file.
* **TrustTrap Guardian:** Memeriksa pancingan psikologis (loker BUMN fiktif, task scam like video, pancingan file `.APK`, dan desakan transfer dalam hitungan menit).

---

## 🏛️ 2. Arsitektur 3 Pilar Solusi (Recognize, Act, Learn)

Aplikasi ini mengintegrasikan ketiga pilar studi kasus ke dalam satu antarmuka yang kohesif:

```
TrustTrap Guardian
 ├── 1. RECOGNIZE (Bedah Bahaya ala VirusTotal)
 │    ├── Omnibox Scam Analyzer (Teks / Link / Loker)
 │    ├── 6 Preset 1-Klik Pengujian Juri
 │    ├── Radial Score Gauge (0 - 100) & Combo Multiplier
 │    └── Explainable Evidence Highlighter (Stabilo Teks)
 ├── 2. ACT (Langkah Penyelamatan Akun)
 │    ├── Panic Triage (Baru Terima Chat vs Terlanjur Transfer)
 │    ├── Checklist Interaktif Penyelamatan Akun (Endowed Progress)
 │    └── Guardian Alert Card (Format Siap Bagikan ke WhatsApp Keluarga)
 └── 3. LEARN (Simulasi & Edukasi Rekayasa Sosial)
      ├── Kuis Interaktif "Spot The Trap" (3 Skenario Nyata)
      └── Jaminan Privasi 100% Sisi Klien (Zero-Data Storage)
```

### 🧠 Landasan Psikologi Manusia (HCI & Cognitive UX)
Berbeda dari pemindai teknis biasa, antarmuka **TrustTrapGuardian** dirancang menggunakan 4 prinsip psikologi perilaku untuk menangani kondisi mental korban penipuan (*panic paralysis*):
1. **Hick's Law (Penyederhanaan Keputusan):** Memangkas kebingungan korban dengan membagi jalur penyelamatan menjadi 2 pilihan biner tegas (*Baru Terima Chat* vs *Terlanjur Klik/Transfer*).
2. **Cognitive Load Theory (Pengurangan Beban Memori):** Menyajikan tindakan darurat dalam kotak *Time-Boxed* (*Detik 0–30* untuk isolasi jaringan malware `.apk` dan *Menit 1–60* untuk pemblokiran rekening) sehingga pengguna tidak kewalahan membaca teks panjang saat panik.
3. **Affective Design & Regulasi Emosi (*Anti-Shame Loop*):** Menghadirkan *Psychological First Aid Banner* (*"Anda tidak sendirian & jangan malu melapor"*) untuk mematahkan stigma rasa malu (*victim blaming*) yang sering menghambat korban melapor ke OJK/IASC.
4. **Endowed Progress Effect:** Memberikan progres awal 15% pada *Emergency Checklist* sejak pengguna membuka halaman untuk memicu motivasi psikologis menuntaskan seluruh langkah penyelamatan hingga 100%.

---

## ⚙️ 3. Scam Heuristic Engine (6 Modul Deteksi)

Engine bekerja melalui 4 tahap sekuensial instan (0 milidetik):
1. **Tahap 1 — Sensor Privasi Otomatis (Auto-Redaction):** Mengaburkan NIK, Nomor Rekening Bank, dan Kode OTP menjadi token aman `[DATA_DISAMARKAN]` di browser pengguna secara lokal.
2. **Tahap 2 — Evaluasi 6 Modul Independen:**
   * **Modul 1: Upfront Fee & Deposit Trap (Bobot 30 Poin)** — Mendeteksi permintaan uang muka, biaya tiket reservasi interview, deposit misi tugas, atau modus rekening penampung aman.
   * **Modul 2: Artificial Urgency & Fear (Bobot 20 Poin)** — Mendeteksi desakan waktu sempit ("dalam 15 menit", "kuota hangus", ancaman pemblokiran akun).
   * **Modul 3: Unrealistic Reward / Task Scam (Bobot 25 Poin)** — Mendeteksi iming-iming gaji harian jutaan rupiah dari tugas sepele (like YouTube/TikTok).
   * **Modul 4: OTP & APK Harvester (Bobot 40 Poin)** — Mendeteksi jebakan instalasi file `.APK` (undangan/resi palsu) dan pencurian kode OTP/PIN.
   * **Modul 5: Identity & Channel Mismatch (Bobot 25 Poin)** — Mendeteksi pencatutan instansi resmi melalui kontak tidak resmi/personal.
   * **Modul 6: Phishing Link & Domain Inspector (Bobot 35 Poin)** — Memeriksa pemendek link (`bit.ly`, `s.id`), domain murah berisiko (`.xyz`, `.top`), pencatutan brand, serta rasio Shannon Entropy untuk domain terobfuskasi.
3. **Tahap 3 — Pengali Kombinasi (Combo Multiplier):** Memberikan penalti pengali (hingga 1.35x) saat pola berbahaya saling berkelindan (contoh: biaya admin + batas 15 menit).
4. **Tahap 4 — Pemetaan Tindakan (Action Mapper):** Menghasilkan langkah mitigasi spesifik dan penjelasan berbasis bahasa manusia (*explainable AI / rules*).

---

## 🎯 4. Skenario Uji 1-Klik untuk Dewan Juri (Preset Showcase)

Tersedia 6 tombol instan di halaman utama untuk mempermudah penilaian dewan juri tanpa perlu mengetik manual:
* **Preset 1 (Loker BUMN Palsu):** Undangan interview rekrutmen PT Telekomunikasi Nusantara (Persero) palsu yang meminta transfer biaya reservasi tiket Rp 1.750.000 ke rekening panitia Bank Nasional Nusantara dalam 15 menit.
* **Preset 2 (Task Scam Like & Subscribe):** Tawaran freelance paruh waktu kerja HP bergaji Rp500.000 - Rp2.500.000 per misi dengan syarat deposit Rp50.000.
* **Preset 3 (Pancingan File .APK & OTP):** Modus kurir ekspedisi mengabarkan paket pending dan meminta instal file `Surat_Paket_Hilang.apk` serta meminta kode OTP SMS.
* **Preset 4 (Link Phishing Hadiah Bank):** Pengumuman pemenang undian Bank Nasional Nusantara Rp15.000.000 yang mengarahkan ke domain palsu `bnn-klaim-gebyar.xyz`.
* **Preset 5 (Kuota Gratis & Link Pendek):** Tautan pemendek `bit.ly` dengan klaim kuota internet gratis 50GB.
* **Preset 6 (Pesan Edukasi Resmi / Kontrol):** Pengingat jadwal kerja kelompok normal (kontrol baseline tanpa manipulasi).

---

## 🔒 5. Kepatuhan Privasi & Standar Keamanan (Privacy-First)

* **100% Client-Side Processing:** Teks dianalisis langsung di memori browser pengguna melalui JavaScript murni.
* **Zero External Storage:** Tidak ada data teks, NIK, atau nomor rekening pengguna yang dikirim ke server backend atau disimpan di database cloud.
* **URL Defanging:** URL pada teks laporan otomatis didefang (`http` -> `hxxp`, `.xyz` -> `[.]xyz`) untuk mencegah penyebaran link aktif.
* **Explainable & Transparent:** Hasil analisis dilengkapi transparansi kalkulasi formula dewan juri dan *disclaimer* bahwa sistem mendeteksi pola tanpa klaim aman mutlak.

---

## 🚀 6. Panduan Menjalankan Proyek Secara Lokal

### Prasyarat
* Node.js versi 18 atau lebih tinggi
* npm / pnpm / yarn

### Langkah Instalasi
```bash
# 1. Clone repositori
git clone https://github.com/Micho-Anta/TrustTrapGuardian.git
cd TrustTrapGuardian

# 2. Instal dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka peramban di `http://localhost:5173` untuk melihat aplikasi secara interaktif.

### Build untuk Produksi
```bash
npm run build
npm run preview
```

---

## 🛠️ 7. Struktur Repositori

```
TrustTrapGuardian/
├── public/                     # Aset statis & Favicon
├── src/
│   ├── data/
│   │   ├── mockResult.json     # Kontrak data standar keluaran engine
│   │   ├── judgePresets.js     # 6 preset uji juri 1-klik (entitas fiktif aman)
│   │   └── actGuides.js        # Data panduan darurat & kanal resmi
│   ├── engine/
│   │   ├── privacyScrubber.js  # Sensor otomatis NIK, Rekening, OTP, HP (NFKC + zero-width scrub)
│   │   ├── heuristicRules.js   # 6 modul heuristik & Shannon Entropy checker
│   │   └── scannerIndex.js     # Alur eksekusi 4 tahap & scoring combo
│   ├── components/
│   │   ├── scanner/
│   │   │   ├── OmniboxInput.jsx  # Input bar, limit 4000 char & preset juri
│   │   │   ├── ScoreGauge.jsx    # Radial gauge risiko ala VirusTotal & tooltip rumus
│   │   │   └── HighlightView.jsx # Teks stabilo interaktif & rincian modul
│   │   ├── action/
│   │   │   ├── PanicTriage.jsx   # Checklist darurat, endowed progress & format laporan
│   │   │   └── WarningCard.jsx   # Generator kartu peringatan siap kirim ke WA (defanged)
│   │   └── learn/
│   │       ├── SpotTheTrap.jsx   # Kuis simulasi 3 skenario nyata
│   │       └── PrivacyBanner.jsx # Banner disclaimer & privasi lokal
│   ├── AppGuardian.jsx         # Layout utama 3 pilar navigasi (Ascend Glassmorphism)
│   ├── index.css               # Design tokens & styling Tailwind CSS v4
│   └── main.jsx                # Titik masuk React
├── vercel.json                 # Security headers (CSP, X-Frame-Options, dll.)
├── package.json
├── vite.config.js              # Plugin Vite & Tailwind CSS
└── README.md                   # Dokumentasi lengkap proyek
```

---

## 🏆 Tim Pengembang
**Tim Nanti Ajah (MIT-041) — Universitas Gunadarma**  
*Solusi Kompetisi Web Development MIT-WEEK 2026*  
*Repository:* [https://github.com/Micho-Anta/TrustTrapGuardian](https://github.com/Micho-Anta/TrustTrapGuardian)
