# PRD UI/UX: The Trust Trap – Navigating Digital Deception

*MIT-Week 2026 · Turunan dari Dokumen Blueprint Tim · Fokus: User Interface & User Experience · Versi 1.0*

## 1. Ringkasan Produk

**The Trust Trap** adalah aplikasi web bergaya VirusTotal yang memeriksa **manipulasi psikologis dan modus penipuan** (bukan virus teknis). Pengguna menempelkan teks chat WA/DM, link mencurigakan, atau pengumuman loker ke satu kotak input. Aplikasi menjalankan *Scam Heuristic Engine* berbasis aturan yang dapat dijelaskan, lalu menampilkan skor bahaya, kalimat yang disorot, panduan penyelamatan, dan simulasi latihan.

**Pernyataan UX satu kalimat:** *"Tempel pesan yang bikin ragu, dalam hitungan detik tahu kalimat mana yang jebakan, apa yang harus dilakukan, dan bagaimana mengenalinya lain kali."*

**Kerangka solusi (sesuai studi kasus):** Recognize (Bedah Bahaya) → Act (Langkah Penyelamatan) → Learn (Simulasi Serupa), semuanya dalam satu layar yang utuh dengan tema *Digital Guardian*.

## 2. Tujuan UX dan Metrik Keberhasilan

| # | Tujuan | Ukuran Keberhasilan |
| --- | --- | --- |
| 1 | Kesan pertama juri dalam 5 detik | Juri langsung paham fungsi aplikasi dan melihat omnibox plus 4 tombol skenario tanpa scroll |
| 2 | Alur uji tanpa hambatan | Klik preset → skor + sorotan muncul → unduh kartu peringatan, **tanpa error satu pun** |
| 3 | Transparan, bukan klaim mutlak | Setiap skor selalu disertai bukti kalimat, penjelasan bahasa manusia, dan disclaimer |
| 4 | Menenangkan saat panik | Tab Langkah Penyelamatan memberi panduan berurutan, bernada tenang, dan bisa diselesaikan satu tangan di HP |
| 5 | Privasi terlihat, bukan hanya diklaim | Pengguna melihat bukti sensor otomatis (NIK/rekening/OTP) dan banner privasi |
| 6 | Tanpa gesekan | Tanpa login, tanpa isi data pribadi, tanpa onboarding wajib |

## 3. Persona dan Konteks Penggunaan

| Persona | Situasi | Kebutuhan UX |
| --- | --- | --- |
| **Pengguna ragu** (anak muda Indonesia, pengguna WA/Telegram/DM) | Baru menerima chat HRD palsu, tawaran kerja like YouTube/TikTok, teman "pinjam uang darurat", undian palsu, atau file .APK | Salin-tempel cepat, hasil mudah dipahami, tidak menghakimi |
| **Pengguna panik** | Sudah terlanjur klik link atau transfer | Panduan darurat langkah demi langkah, kalimat menenangkan, tombol besar |
| **Juri lomba** | Menguji link live di laptop atau HP dengan waktu terbatas | Tombol Skenario Uji 1-Klik, alur jelas, kepatuhan juknis terlihat (disclaimer, privasi) |

**Konteks perangkat:** mayoritas pengguna di HP (kasus pakai: copy chat dari WA lalu tempel). Desain **mobile-first**, tetap rapi di laptop untuk juri.

## 4. Prinsip Desain

1. **Satu kotak, satu aksi.** Meniru VirusTotal: omnibox adalah pusat halaman.
2. **Bukti dulu, vonis kedua.** Kalimat yang disorot dan penjelasan mendahului klaim; tidak pernah mengklaim 100% pasti.
3. **Bahasa manusia.** Tidak ada istilah teknis di UI; "Heuristic Engine" ditampilkan sebagai "Pemeriksa Pola Penipuan".
4. **Tenang saat bahaya.** Warna merah dipakai untuk bukti dan skor, bukan untuk membuat pengguna makin takut. Copy di mode darurat menenangkan.
5. **Siap diuji.** Setiap komponen punya preset dan state yang tidak bisa error.
6. **Privasi yang terlihat.** Hasil sensor ditampilkan, bukan disembunyikan.

## 5. Arsitektur Informasi dan User Flow

### 5.1 Struktur Halaman (Single Page)

| Zona | Isi | Komponen |
| --- | --- | --- |
| A. Header | Logo + nama "The Trust Trap", tagline, tautan ke PrivacyBanner | `PrivacyBanner.jsx` |
| B. Omnibox | Kotak input besar + tombol **Periksa** + 4 tombol Skenario Uji Juri | `OmniboxInput.jsx` |
| C. Hasil | Skor radial, ringkasan, daftar modul yang menyala, teks tersorot | `ScoreGauge.jsx`, `HighlightView.jsx` |
| D. Tab Guardian | 1. Bedah Bahaya (Recognize) · 2. Langkah Penyelamatan (Act) · 3. Simulasi Serupa (Learn) | `PanicTriage.jsx`, `WarningCard.jsx`, `SpotTheTrap.jsx` |
| E. Footer | Disclaimer: hasil berbasis pencocokan pola, bukan jaminan 100% | `PrivacyBanner.jsx` |

### 5.2 Alur Utama

1. Pengguna membuka halaman → melihat omnibox dan 4 tombol skenario.
2. **Jalur A (pengguna nyata):** tempel teks → klik **Periksa**. **Jalur B (juri):** klik salah satu preset → teks terisi otomatis dan analisis langsung berjalan.
3. Sistem menampilkan *skeleton* singkat → hasil muncul: skor radial, level risiko, teks tersensor, kalimat tersorot, kartu modul.
4. Pengguna berpindah tab: **Bedah Bahaya** (default) → **Langkah Penyelamatan** → **Simulasi Serupa**.
5. Pengguna mengunduh **Kartu Peringatan WA** untuk dibagikan ke teman/keluarga.

### 5.3 Alur Darurat (Panic Triage)

Di tab Langkah Penyelamatan, pengguna memilih dulu situasinya:

- **"Baru terima chat"** → langkah pencegahan: jangan balas, jangan klik, cek ke jalur resmi, blokir dan laporkan.
- **"Terlanjur klik / transfer"** → langkah penyelamatan berurutan dengan checklist interaktif (amankan akun, hubungi bank, ubah kata sandi, dan seterusnya).

Catatan: pilihan ini juga muncul otomatis sebagai saran bila modul OTP & APK atau Upfront Fee menyala.

## 6. Spesifikasi Layar dan Komponen

### 6.1 Omnibox Scam Analyzer (`OmniboxInput.jsx`)

**Tujuan:** tempat memasukkan Teks Chat WA/DM, Link/URL, atau Pengumuman Loker tanpa login.

| Elemen | Spesifikasi |
| --- | --- |
| Textarea | Besar, minimal 5 baris di mobile, tumbuh otomatis. Placeholder: *"Tempel chat WA, link mencurigakan, atau info loker di sini…"* |
| Tombol **Periksa** | Tombol utama (primary), nonaktif bila input kosong, menampilkan loading saat proses |
| Tombol **Hapus** | Tombol sekunder, mengosongkan input dan hasil |
| Penghitung karakter | Kecil, di sudut kotak |
| Catatan privasi mikro | Di bawah kotak: *"Tanpa login. Nomor sensitif disensor otomatis."* |
| **4 Tombol Skenario Uji Juri** | Baris chip/kartu kecil di bawah omnibox, berlabel jelas (lihat 6.2). Klik = isi teks + langsung analisis |

### 6.2 Skenario Uji Juri 1-Klik (`judgePresets.js`)

| # | Label Tombol | Isi Skenario (aman, fiktif) | Modul yang Diharapkan Menyala |
| --- | --- | --- | --- |
| 1 | Loker BUMN Palsu | Undangan interview yang meminta transfer biaya reservasi tiket pesawat dan hotel ke agen travel | Upfront Fee, Urgency, Identity Mismatch |
| 2 | Task Scam Like & Subscribe | Kerja paruh waktu dari HP, komisi Rp500.000/hari hanya dengan like video YouTube, lalu minta deposit saldo tugas | Unrealistic Reward, Upfront Fee |
| 3 | Pancingan .APK & OTP | Chat kurir/undangan pernikahan yang menyuruh unduh file .APK atau minta 6 digit OTP dengan alasan pembatalan biaya | OTP & APK Harvester, Urgency |
| 4 | Link Phishing Hadiah Bank | Pengumuman pemenang undian bank, batas klaim 30 menit, tautan seperti `klaim-poin-bank.xyz` | Phishing Link, Urgency, Unrealistic Reward |

**Perilaku:** tombol aktif (selected) setelah diklik; mengklik preset lain mengganti isi dan hasil; tidak ada dialog konfirmasi.

### 6.3 Skor Radial (`ScoreGauge.jsx`)

| Elemen | Spesifikasi |
| --- | --- |
| Lingkaran skor | Gaya VirusTotal: lingkaran radial berisi angka skor (contoh 85) dengan animasi mengisi singkat |
| Indeks indikator | Teks pendamping: **"3/6 Pola Manipulasi Terdeteksi"** (dari `triggeredEngines` / `totalEngines`) |
| Level risiko | Label berwarna dari `riskLevel`, contoh: **TINGGI (INDIKASI KUAT PENIPUAN)** |
| Disclaimer | Satu baris di bawah skor: *"Hasil ini berbasis pencocokan pola rekayasa sosial, bukan jaminan mutlak 100% aman atau berbahaya."* (dari `summary.disclaimer`) |

**Ambang level risiko (asumsi tim, belum ada di blueprint, sepakati di rapat awal):**

| Skor | Level | Warna |
| --- | --- | --- |
| 0–29 | RENDAH | Hijau |
| 30–59 | SEDANG | Kuning/oranye |
| 60–100 | TINGGI (INDIKASI KUAT PENIPUAN) | Merah |

Skor dibatasi maksimal 100. Skor 0 menampilkan pesan "Tidak ada pola penipuan terdeteksi" disertai pengingat bahwa ini bukan jaminan aman.

### 6.4 Stabilo Otomatis (`HighlightView.jsx`)

**Tujuan:** menunjukkan bukti, yaitu kalimat/kata mana yang memicu alarm.

| Elemen | Spesifikasi |
| --- | --- |
| Teks tersensor | Menampilkan `sanitizedText` (bukan teks asli) |
| Sorotan | Frasa dari `evidence` diberi latar merah lembut; satu warna per kategori modul bila memungkinkan |
| Interaktif | Hover/tap pada sorotan memunculkan tooltip berisi nama modul + penjelasan singkat; klik membuka kartu modul terkait |
| Penanda sensor | Placeholder seperti `[DATA_DISAMARKAN]` tampil sebagai *chip* abu-abu bergembok agar jelas bahwa data disensor |
| Legenda | Baris kecil: warna sorotan = modul apa |

> **Catatan konsistensi:** blueprint memakai dua placeholder berbeda (`[DATA_DISAMARKAN]` di teks proses dan `[NOMOR_DISAMARKAN]` di contoh JSON). Sepakati satu format sebelum UI dibuat.

### 6.5 Tab 1: Bedah Bahaya / Recognize

Isi: daftar **kartu modul** dari array `engines`.

| Elemen Kartu | Sumber Data | Tampilan |
| --- | --- | --- |
| Nama modul | `name` | Judul kartu, mis. *Upfront Fee & Deposit Trap* |
| Kategori | `category` | Label kecil (badge) |
| Status | `status` | Badge **DANGER** (merah). Modul yang tidak menyala ditampilkan sebagai "Aman" (abu/hijau) dalam daftar ringkas |
| Bukti | `evidence` | Kutipan frasa yang memicu, ditampilkan sebagai chip |
| Penjelasan | `explanation` | Satu-dua kalimat bahasa manusia |
| Langkah | `actionStep` | Kotak instruksi singkat di bawah kartu |
| Bobot | Bobot modul | Opsional, ditampilkan kecil: "+30 poin" |

**Daftar 6 modul yang harus punya kartu dan ikon:**

| Modul | Bobot | Fokus pesan UI |
| --- | --- | --- |
| 1. Upfront Fee & Deposit Trap | 30 | Rekrutmen/undian resmi tidak minta transfer di awal |
| 2. Artificial Urgency & Fear | 20 | Tekanan waktu agar korban tidak sempat mengecek |
| 3. Unrealistic Reward / Task Scam | 25 | Imbalan besar untuk tugas sepele |
| 4. OTP & APK Harvester | 40 | OTP/PIN rahasia dan file .APK berbahaya |
| 5. Identity & Channel Mismatch | 25 | Mengaku instansi besar tapi pakai @gmail.com, forms.gle, wa.me |
| 6. Phishing Link & Domain Inspector | 30–40 | Link pendek, domain murah (.xyz/.top/.click), tiruan brand |

**Banner Combo Multiplier:** bila kombinasi pola memicu pengali 1,25x, tampilkan satu baris di atas daftar kartu: *"Kombinasi pola terdeteksi: skor dinaikkan 1,25x karena beberapa tanda muncul bersamaan."*

### 6.6 Tab 2: Langkah Penyelamatan / Act (`PanicTriage.jsx`)

| Elemen | Spesifikasi |
| --- | --- |
| Pemilih situasi | Dua kartu besar: **"Baru terima chat"** dan **"Terlanjur klik / transfer"** |
| Nada copy | Menenangkan dan langsung ke tindakan. Contoh pembuka mode darurat: *"Tenang, kamu tidak sendirian. Ikuti langkah berikut satu per satu."* |
| Checklist interaktif | Setiap langkah punya checkbox besar; progres "2 dari 5 selesai"; langkah selesai ditandai dan diredupkan |
| Langkah dinamis | Ditambah dari `recommendedActions` dan `actionStep` modul yang menyala (Action Mapper) |
| Checklist penyelamatan akun | Bagian terpisah: amankan akun, ganti kata sandi, aktifkan verifikasi dua langkah, hubungi pihak bank/penyedia layanan |
| Tombol aksi cepat | Tombol besar: **Salin langkah**, **Bagikan peringatan** |

### 6.7 Kartu Peringatan WA (`WarningCard.jsx`)

**Tujuan:** pembeda utama tema Digital Guardian: pengguna membagikan peringatan ke grup/keluarga.

| Elemen | Spesifikasi |
| --- | --- |
| Pratinjau | Kartu bergaya poster rasio sesuai tampilan status/chat WA (disarankan 4:5 atau 1:1) |
| Isi kartu | Judul "WASPADA PENIPUAN", jenis modus (dari modul teratas), 2–3 tanda bahaya, 2 langkah aman, nama aplikasi, disclaimer singkat |
| Privasi | Hanya memakai teks tersensor; tidak menampilkan nomor, nama, atau teks mentah pengguna |
| Tombol | **Unduh Gambar** (utama), **Salin Teks Peringatan** (sekunder) |
| Umpan balik | Toast "Kartu berhasil diunduh"; bila gagal, pesan ramah plus opsi salin teks |

### 6.8 Tab 3: Simulasi Serupa / Learn (`SpotTheTrap.jsx`)

| Elemen | Spesifikasi |
| --- | --- |
| Format | Kuis singkat **"Tebak Jebakan Chat"** dengan **3 skenario** |
| Per skenario | Chat contoh → pengguna menandai kalimat yang mencurigakan atau memilih jebakan yang dipakai → umpan balik instan |
| Umpan balik | Benar/salah disertai penjelasan satu kalimat dan modul terkait |
| Progres | "Skenario 1 dari 3" + skor akhir dan ajakan bagikan kartu peringatan |
| Tanpa tekanan | Tidak ada timer; salah menjawab tidak dihukum, hanya diberi penjelasan |

### 6.9 Banner Privasi dan Disclaimer (`PrivacyBanner.jsx`)

- **Banner atas:** *"Tanpa login. Data sensitif (NIK, rekening, OTP) disensor otomatis sebelum diperiksa."*
- **Footer/disclaimer tetap:** hasil adalah pencocokan pola, bukan jaminan mutlak.
- **Bagian "Apa yang disensor?":** menampilkan daftar `redactions` pada setiap hasil, contoh *"Nomor Panjang (Rekening/NIK)"*.

## 7. Pemetaan Kontrak Data ke Elemen UI

Semua UI membaca satu format dari mesin (`mockResult.json`), sehingga Orang 2 dan 3 dapat membangun tampilan sebelum mesin selesai.

| Field JSON | Dipakai di | Elemen UI |
| --- | --- | --- |
| `sanitizedText` | HighlightView | Teks chat tersensor |
| `redactions` | PrivacyBanner / HighlightView | Daftar "Apa yang disensor?" |
| `summary.score` | ScoreGauge | Angka dan isi lingkaran |
| `summary.triggeredEngines` / `totalEngines` | ScoreGauge | "3/6 Pola Manipulasi Terdeteksi" |
| `summary.riskLevel` | ScoreGauge | Label berwarna |
| `summary.disclaimer` | ScoreGauge / footer | Teks disclaimer |
| `engines[].name`, `category`, `status` | Tab Bedah Bahaya | Judul, badge kategori, badge status kartu |
| `engines[].evidence` | HighlightView + kartu | Frasa yang disorot dan chip bukti |
| `engines[].explanation` | Tab Bedah Bahaya | Penjelasan bahasa manusia |
| `engines[].actionStep` | Kartu + PanicTriage | Instruksi spesifik per modul |
| `recommendedActions` | PanicTriage | Daftar langkah checklist |

## 8. Sistem Visual

### 8.1 Gaya

Terinspirasi VirusTotal: bersih, banyak ruang kosong, kartu putih/gelap bersudut membulat, satu aksi utama. Karakter *Digital Guardian*: tegas namun menenangkan, bukan menakut-nakuti.

### 8.2 Warna Semantik (rekomendasi)

| Peran | Penggunaan | Catatan |
| --- | --- | --- |
| Biru/navy | Brand, tombol utama, header | Kesan terpercaya |
| Merah | Skor TINGGI, status DANGER, sorotan bukti | Hanya untuk bahaya, bukan dekorasi |
| Oranye/kuning | Risiko SEDANG, peringatan |  |
| Hijau | RENDAH, langkah selesai |  |
| Abu | Teks sekunder, chip sensor, modul tidak menyala |  |

**Aturan:** status tidak boleh hanya dibedakan lewat warna. Selalu sertakan ikon dan teks (aksesibilitas buta warna).

### 8.3 Tipografi dan Ikon

- Satu keluarga huruf sans-serif yang terbaca jelas di HP (mis. Inter atau Poppins) dengan fallback sistem.
- Skor memakai ukuran sangat besar; label berukuran sedang; disclaimer kecil tetapi tetap terbaca.
- Satu set ikon konsisten untuk 6 modul (uang, jam, hadiah, kunci/APK, identitas, tautan), tanpa emoji campur-aduk.

### 8.4 Mode Terang/Gelap

Disarankan mengikuti preferensi sistem; skor dan sorotan harus tetap kontras di kedua mode.

## 9. Microcopy (Bahasa Indonesia, Nada Peduli)

| Konteks | Teks |
| --- | --- |
| Judul utama | **Ragu sama pesan ini? Cek dulu sebelum percaya.** |
| Sub-judul | Tempel chat, link, atau info loker. Kami tunjukkan kalimat mana yang jebakan. |
| Tombol utama | Periksa Sekarang |
| Loading | Memeriksa 6 pola penipuan… |
| Hasil tinggi | Banyak tanda penipuan ditemukan. Jangan transfer atau kirim kode apa pun dulu. |
| Hasil rendah | Belum ada pola penipuan yang terdeteksi. Tetap cek ke jalur resmi bila ada permintaan uang atau kode. |
| Input kosong | Tempel dulu pesan yang ingin diperiksa. |
| Mode darurat | Tenang, kamu tidak sendirian. Ikuti langkah berikut satu per satu. |
| Kartu diunduh | Kartu peringatan tersimpan. Bagikan ke keluarga dan teman. |
| Disclaimer | Hasil ini berbasis pencocokan pola, bukan jaminan mutlak aman atau berbahaya. |

**Pedoman:** hindari kata menyalahkan ("kamu bodoh", "kamu tertipu"); gunakan kalimat aktif dan ajakan tindakan.

## 10. State dan Kasus Tepi

| State | Perilaku UI |
| --- | --- |
| Awal (kosong) | Omnibox + 4 preset terlihat; area hasil menampilkan ilustrasi/penjelasan singkat "Cara kerja" |
| Loading | Skeleton skor dan kartu; tombol Periksa menjadi loading, tidak bisa diklik ganda |
| Hasil ada | Skor, sorotan, kartu, tab aktif di Bedah Bahaya |
| Tidak ada pola terdeteksi | Skor rendah, pesan netral, tetap tampilkan disclaimer dan tab Simulasi |
| Input berupa URL saja | Hasil fokus pada modul Phishing Link & Domain Inspector; sorotan pada domain |
| Teks sangat panjang | Batas karakter dengan pesan ramah; hasil tetap bisa di-scroll |
| Teks mengandung data sensitif | Chip sensor tampil, daftar `redactions` terisi, teks asli tidak pernah ditampilkan ulang |
| Gagal memproses / error | Pesan ramah plus tombol **Coba lagi**; mesin selalu fallback ke aturan (rule-based) bila AI API gagal, tanpa mengubah tampilan |
| Gagal unduh kartu | Toast error + alternatif salin teks |
| Offline/jaringan lemah | Mesin berjalan di sisi klien, sehingga analisis tetap bisa berjalan; hanya unduhan/aset eksternal yang terdampak |

## 11. Aksesibilitas dan Responsif

- **Mobile-first:** tata letak satu kolom di HP; di laptop, omnibox dan hasil dapat berdampingan atau bertumpuk dengan lebar baca nyaman.
- **Target sentuh** minimal 44×44 px, khususnya checkbox checklist darurat dan tombol preset.
- **Kontras teks** memenuhi WCAG AA; sorotan merah tetap terbaca.
- **Keyboard:** tab order logis, fokus terlihat, tombol bisa dijalankan dengan Enter/Spasi, pintasan opsional Ctrl+Enter untuk Periksa.
- **Pembaca layar:** skor dan level risiko dibacakan (`aria-live` saat hasil muncul); sorotan memiliki label teks, bukan hanya warna.
- **Gerak:** animasi skor singkat dan menghormati `prefers-reduced-motion`.
- **Bahasa:** seluruh UI Bahasa Indonesia, atribut `lang="id"`.

## 12. Pembagian Tanggung Jawab UI/UX per Anggota

| Anggota | Tanggung Jawab UI/UX | File Utama |
| --- | --- | --- |
| **Orang 1 – The Brain** | Menjamin keluaran JSON sesuai kontrak; menyediakan `evidence` dengan posisi/frasa yang bisa disorot; nama placeholder sensor konsisten | `engine/*` |
| **Orang 2 – The Face** | Halaman utama, omnibox, 4 tombol preset, skor radial, stabilo interaktif, sistem visual dan responsif | `scanner/OmniboxInput.jsx`, `ScoreGauge.jsx`, `HighlightView.jsx`, `judgePresets.js` |
| **Orang 3 – The Shield** | Tab Langkah Penyelamatan, panic triage, checklist, generator dan unduhan Kartu Peringatan WA | `action/PanicTriage.jsx`, `WarningCard.jsx` |
| **Orang 4 – The Closer** | Tab Simulasi (3 skenario), banner privasi dan disclaimer, uji lintas perangkat, deploy, README dan video demo yang menampilkan alur UX | `learn/SpotTheTrap.jsx`, `PrivacyBanner.jsx`, `README.md` |

**Aturan kerja:** Orang 2 dan 3 membangun UI dari `mockResult.json` pada jam pertama, tanpa menunggu mesin.

## 13. Kriteria Penerimaan (Acceptance Criteria)

| ID | Kriteria | Lulus bila |
| --- | --- | --- |
| AC-1 | Halaman utama | Omnibox dan 4 tombol skenario terlihat tanpa scroll di laptop dan HP |
| AC-2 | Preset 1-klik | Masing-masing dari 4 preset mengisi teks dan menampilkan hasil dalam satu klik |
| AC-3 | Skor | Skor radial, "X/6 pola", dan level risiko tampil konsisten dengan JSON |
| AC-4 | Sorotan | Kalimat bukti tersorot dan dapat di-hover/tap untuk melihat penjelasan |
| AC-5 | Sensor | NIK/rekening/OTP tampil sebagai chip sensor; teks asli tidak ditampilkan |
| AC-6 | Disclaimer | Pernyataan "bukan jaminan mutlak 100%" selalu terlihat pada hasil |
| AC-7 | Tab Act | Mode "Terlanjur klik/transfer" memberi langkah berurutan, checklist interaktif, dan nada menenangkan |
| AC-8 | Kartu WA | Kartu dapat diunduh tanpa error dan tidak memuat data sensitif |
| AC-9 | Tab Learn | Kuis 3 skenario berjalan dengan umpan balik instan |
| AC-10 | Stabilitas | Tidak ada error pada alur: preset → hasil → tab → unduh kartu, di HP dan laptop |
| AC-11 | Tanpa login | Seluruh fitur dapat dipakai tanpa akun atau input data pribadi |

## 14. Checklist Pra-Submit Sesuai Pertanyaan Panduan Juri

1. **Bisakah juri membuka link live, klik satu skenario, melihat skor + kalimat tersorot, lalu mengunduh kartu peringatan tanpa error?** → AC-1, AC-2, AC-3, AC-4, AC-8, AC-10
2. **Apakah tab Langkah Penyelamatan memberi panduan darurat yang jelas dan menenangkan saat pengguna sudah terlanjur klik/transfer?** → AC-7
3. **Apakah aplikasi otomatis menyensor NIK/rekening/OTP dan menampilkan disclaimer bukan jaminan 100%?** → AC-5, AC-6

## 15. Di Luar Lingkup dan Asumsi

**Di luar lingkup:** akun pengguna/login, penyimpanan riwayat pengecekan, pelaporan ke pihak berwenang, ekstensi browser, dan pemeriksaan malware teknis ala antivirus.

**Asumsi yang perlu disepakati tim (tidak ditentukan eksplisit di blueprint):**

- Ambang level risiko RENDAH/SEDANG/TINGGI (bagian 6.3).
- Format placeholder sensor yang seragam (bagian 6.4).
- Palet warna, tipografi, dan rasio kartu peringatan (bagian 8 dan 6.7).
- Status modul selain `DANGER` (mis. `CLEAR`) untuk modul yang tidak menyala.
- Isi final tiga skenario kuis Tebak Jebakan.
