import assert from "node:assert/strict";
import { scanText } from "../src/engine/scannerIndex.js";
import { scrubPrivacy } from "../src/engine/privacyScrubber.js";
import { JUDGE_PRESETS } from "../src/data/judgePresets.js";

console.log("🛡️  MEMULAI VERIFIKASI AUTOMATED ENGINE TEST (MIT-041)...");

let passedCount = 0;
let failedCount = 0;
const summaryRows = [];

function runTest(category, name, fn, textToScan = null) {
  try {
    const customScore = fn();
    passedCount++;
    console.log(`  ✅ PASS: [${category}] ${name}`);

    let recordedScore = "-";
    let recordedRisk = "VALID";

    if (textToScan) {
      const scan = scanText(textToScan);
      if (scan) {
        recordedScore = scan.summary.score;
        recordedRisk = scan.summary.riskLevel;
      }
    } else if (typeof customScore === "number") {
      recordedScore = customScore;
    }

    summaryRows.push({
      Kategori: category,
      "Kasus Uji": name,
      Skor: recordedScore,
      "Status Deteksi": recordedRisk,
      Hasil: "PASS"
    });
  } catch (err) {
    failedCount++;
    console.error(`  ❌ FAIL: [${category}] ${name}`);
    console.error("     Detail Error:", err.message);

    summaryRows.push({
      Kategori: category,
      "Kasus Uji": name,
      Skor: "ERR",
      "Status Deteksi": "FAIL",
      Hasil: "FAIL"
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SUITE 1: PRIVACY SCRUBBER (SENSOR DATA SENSITIF SISI KLIEN)
// ─────────────────────────────────────────────────────────────
console.log("\n📦 SUITE 1: Privacy Scrubber & Unicode Sanitization");

runTest("Privacy Scrubber", "Menyensor NIK 16-digit standar", () => {
  const result = scrubPrivacy("NIK saya adalah 3201012345670001 untuk registrasi");
  assert.ok(!result.sanitizedText.includes("3201012345670001"));
  assert.ok(result.sanitizedText.includes("[NIK_DISAMARKAN]"));
  assert.ok(result.redactions.length > 0);
});

runTest("Privacy Scrubber", "Menyensor NIK dengan pemisah strip / spasi (Obfuscation Defense)", () => {
  const result = scrubPrivacy("NIK saya: 3201-0123-4567-0001 mohon diproses");
  assert.ok(!result.sanitizedText.includes("3201-0123-4567-0001"));
  assert.ok(result.sanitizedText.includes("[NIK_DISAMARKAN]"));
});

runTest("Privacy Scrubber", "Menyensor Nomor Rekening Bank (termasuk dipisah spasi)", () => {
  const result = scrubPrivacy("Transfer ke rekening Bank Nasional Nusantara 0239 0100 2384 501");
  assert.ok(!result.sanitizedText.includes("0239 0100 2384 501"));
  assert.ok(result.sanitizedText.includes("[REKENING_DISAMARKAN]"));
});

runTest("Privacy Scrubber", "Menyensor Nomor Handphone (+62 dan 08xx dengan pemisah)", () => {
  const result = scrubPrivacy("Hubungi saya di nomor 0812-3456-7890 sekarang");
  assert.ok(!result.sanitizedText.includes("0812-3456-7890"));
  assert.ok(result.sanitizedText.includes("[NOMOR_HP_DISAMARKAN]"));
});

runTest("Privacy Scrubber", "Menyensor Kode OTP & PIN 6-digit", () => {
  const result = scrubPrivacy("Kode OTP Anda adalah: 593810, jangan bagikan!");
  assert.ok(!result.sanitizedText.includes("593810"));
  assert.ok(result.sanitizedText.includes("[KODE_OTP_DISAMARKAN]"));
});

runTest("Privacy Scrubber", "Membersihkan zero-width characters & melakukan normalisasi NFKC", () => {
  const evilInput = "Tr\u200Bans\u200Cfer b\u200Diaya";
  const result = scrubPrivacy(evilInput);
  assert.ok(!result.sanitizedText.includes("\u200B"));
  assert.ok(!result.sanitizedText.includes("\u200C"));
});

// ─────────────────────────────────────────────────────────────
// SUITE 2: SCAM HEURISTIC ENGINE (SEMUA KASUS BAHAYA & PRESETS)
// ─────────────────────────────────────────────────────────────
console.log("\n📦 SUITE 2: Heuristic Detection & Multiplier Scoring (Kasus Bahaya)");

runTest("Preset 1", "Preset 1: Loker BUMN Palsu (Upfront Fee + Urgensi)", () => {
  const scan = scanText(JUDGE_PRESETS[0].text);
  assert.ok(scan.summary.score >= 70, `Expected score >= 70, got ${scan.summary.score}`);
  assert.equal(scan.summary.riskLevel, "RISIKO TINGGI (BANYAK TANDA BAHAYA TERDETEKSI)");
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("upfront_fee"));
  assert.ok(triggeredIds.includes("artificial_urgency"));
  assert.ok(triggeredIds.includes("identity_mismatch"));
  assert.ok(scan.summary.comboBonus > 1.0);
  return scan.summary.score;
}, JUDGE_PRESETS[0].text);

runTest("Preset 2", "Preset 2: Task Scam (Imbalan Fantastis + Deposit Bertingkat)", () => {
  const scan = scanText(JUDGE_PRESETS[1].text);
  assert.ok(scan.summary.score >= 70);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("unrealistic_reward"));
  assert.ok(triggeredIds.includes("upfront_fee"));
  return scan.summary.score;
}, JUDGE_PRESETS[1].text);

runTest("Preset 3", "Preset 3: Pancingan File .APK & Resi Paket Palsu", () => {
  const scan = scanText(JUDGE_PRESETS[2].text);
  assert.ok(scan.summary.score >= 70);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("apk_otp_harvester"));
  return scan.summary.score;
}, JUDGE_PRESETS[2].text);

runTest("Preset 4", "Preset 4: Link Phishing Hadiah & Domain .xyz", () => {
  const scan = scanText(JUDGE_PRESETS[3].text);
  assert.ok(scan.summary.score >= 70);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("phishing_link"));
  assert.ok(triggeredIds.includes("apk_otp_harvester"));
  return scan.summary.score;
}, JUDGE_PRESETS[3].text);

runTest("Preset 5", "Preset 5: Kuota Gratis & Link Pendek bit.ly", () => {
  const scan = scanText(JUDGE_PRESETS[4].text);
  assert.ok(scan.summary.score >= 35);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("phishing_link"));
  return scan.summary.score;
}, JUDGE_PRESETS[4].text);

runTest("Financial Trap", "Deteksi Modus Baru: Rekening Penampung / Alihkan Saldo Aman", () => {
  const text = "Rekening Anda terindikasi peretasan. Segera alihkan saldo ke rekening penampung sementara agar dana aman.";
  const scan = scanText(text);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("upfront_fee"), "Harus mendeteksi modus rekening penampung");
  return scan.summary.score;
}, "Rekening Anda terindikasi peretasan. Segera alihkan saldo ke rekening penampung sementara agar dana aman.");

runTest("Investment Scam", "Modul Investasi Bodong (Crypto Profit Mingguan + Member VIP): skor >= 35", () => {
  const text = "Hai kak, aku Sarah, kenalan di IG kemarin. Aku punya info investasi crypto profit 30% per minggu, modal minimal 500rb, member VIP dijamin cuan. Join grup telegram ya";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("investment_scam"));
  return scan.summary.score;
}, "Hai kak, aku Sarah, kenalan di IG kemarin. Aku punya info investasi crypto profit 30% per minggu, modal minimal 500rb, member VIP dijamin cuan. Join grup telegram ya");

runTest("Illegal Loan", "Modul Pinjol Ilegal (Tanpa SLIK + Izin Akses Kontak & Galeri): skor >= 35", () => {
  const text = "Pinjaman online cair 5 juta tanpa jaminan, tanpa slik, proses 5 menit. Download aplikasi di link ini dan izinkan akses kontak & galeri.";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("illegal_loan"));
  return scan.summary.score;
}, "Pinjaman online cair 5 juta tanpa jaminan, tanpa slik, proses 5 menit. Download aplikasi di link ini dan izinkan akses kontak & galeri.");

runTest("Family Impersonation", "Modul Family Impersonation (Ganti Nomor + Minta Pulsa): skor >= 35", () => {
  const text = "Mah ini aku nomor baru, hp lama rusak. Tolong kirimin pulsa dulu 200rb ya, nanti aku ganti, penting banget";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("family_impersonation"));
  return scan.summary.score;
}, "Mah ini aku nomor baru, hp lama rusak. Tolong kirimin pulsa dulu 200rb ya, nanti aku ganti, penting banget");

runTest("Family Impersonation", "Modul Family Impersonation (Darurat RS + Transfer Rekening): skor >= 35", () => {
  const text = "Ini aku lagi darurat di rumah sakit, tolong transfer 3 juta ke rekening 1234567890 sekarang";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("family_impersonation"));
  return scan.summary.score;
}, "Ini aku lagi darurat di rumah sakit, tolong transfer 3 juta ke rekening 1234567890 sekarang");

runTest("Threat & Extortion", "Modul Ancaman & Pemerasan (Sebar Foto/Kontak + Paksaan Bayar): skor >= 35", () => {
  const text = "Bayar hutangmu hari ini atau kami sebar foto dan kontak keluargamu";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("threat_extortion"));
  return scan.summary.score;
}, "Bayar hutangmu hari ini atau kami sebar foto dan kontak keluargamu");

runTest("Brand Spoofing", "Modul Brand Spoofing (shopee-id-verifikasi.com non-official): skor >= 35", () => {
  const text = "Akun Shopee kamu bermasalah, verifikasi sekarang di https://shopee-id-verifikasi.com/login";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("phishing_link"));
  return scan.summary.score;
}, "Akun Shopee kamu bermasalah, verifikasi sekarang di https://shopee-id-verifikasi.com/login");

runTest("Malware Infrastructure", "Kasus Kurir + APK + .top menghasilkan skor 100", () => {
  const text = "Halo paket Anda tertahan di gudang J&T. Silakan unduh dan pasang resi_pengiriman.apk di https://jnt-tracking.top untuk konfirmasi.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 100);
  return scan.summary.score;
}, "Halo paket Anda tertahan di gudang J&T. Silakan unduh dan pasang resi_pengiriman.apk di https://jnt-tracking.top untuk konfirmasi.");

runTest("Lottery Shortlink", "Kasus Lotere + link bit.ly menghasilkan skor >= 35", () => {
  const text = "Congratulations! You won the UK National Lottery jackpot of 1,000,000 GBP. Claim your prize immediately at https://bit.ly/uk-lottery-claim before it expires in 15 minutes.";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  return scan.summary.score;
}, "Congratulations! You won the UK National Lottery jackpot of 1,000,000 GBP. Claim your prize immediately at https://bit.ly/uk-lottery-claim before it expires in 15 minutes.");

runTest("Task Scam Reviewer", "Modul Task Scam Reviewer TikTok Shop + Top Up Modal (skor >= 35)", () => {
  const text = "Kamu terpilih jadi reviewer produk TikTok Shop, komisi 200rb per tugas. Top up modal 100rb untuk tugas pertama, pasti dikembalikan";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("unrealistic_reward"), "Modul unrealistic_reward harus terpicu");
  assert.ok(triggeredIds.includes("upfront_fee"), "Modul upfront_fee harus terpicu");
  assert.ok(scan.summary.combosTriggered.some(c => c.includes("Task Scam")), "Combo Task Scam harus terpicu");
  return scan.summary.score;
}, "Kamu terpilih jadi reviewer produk TikTok Shop, komisi 200rb per tugas. Top up modal 100rb untuk tugas pertama, pasti dikembalikan");

// ─────────────────────────────────────────────────────────────
// SUITE 3: ANTI FALSE-POSITIVE & 8+ PESAN AMAN
// ─────────────────────────────────────────────────────────────
console.log("\n📦 SUITE 3: Anti False-Positive & Pesan Aman (Skor 0 atau < 35)");

runTest("Safe Control", "Preset 6: Pesan Normal Kontrol (Skor 0 / TIDAK TERDETEKSI)", () => {
  const scan = scanText(JUDGE_PRESETS[5].text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  assert.equal(scan.summary.triggeredEngines, 0);
  assert.ok(scan.summary.riskColor === "emerald");
  return scan.summary.score;
}, JUDGE_PRESETS[5].text);

runTest("Safe Official", "Pesan Edukasi Resmi Bank tidak menghasilkan False Positive", () => {
  const cleanBankMsg = "Pengingat Keamanan Bank Nasional Nusantara: Jaga selalu kerahasiaan PIN dan password m-banking Anda. Petugas bank tidak pernah meminta OTP. Info resmi hubungi 150000 atau kunjungi situs www.banknusantara.co.id";
  const scan = scanText(cleanBankMsg);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("upfront_fee"));
  assert.ok(!triggeredIds.includes("phishing_link"));
  assert.ok(scan.summary.score < 35);
  return scan.summary.score;
}, "Pengingat Keamanan Bank Nasional Nusantara: Jaga selalu kerahasiaan PIN dan password m-banking Anda. Petugas bank tidak pernah meminta OTP. Info resmi hubungi 150000 atau kunjungi situs www.banknusantara.co.id");

runTest("Safe Message 1", "Pesan Aman 1: Info Jadwal Kuliah Resmi (Skor 0 / TIDAK TERDETEKSI)", () => {
  const text = "Pengumuman: Perkuliahan Algoritma dan Pemrograman besok Kamis pukul 08.00 WIB ditiadakan dan diganti tugas mandiri di Google Classroom.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Pengumuman: Perkuliahan Algoritma dan Pemrograman besok Kamis pukul 08.00 WIB ditiadakan dan diganti tugas mandiri di Google Classroom.");

runTest("Safe Message 2", "Pesan Aman 2: Kerja Kelompok Kampus (Skor 0 / TIDAK TERDETEKSI)", () => {
  const text = "Halo teman-teman, jangan lupa besok kita kumpul kerja kelompok jam 14.00 di perpustakaan lantai 2 ya. Bawa laptop masing-masing.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Halo teman-teman, jangan lupa besok kita kumpul kerja kelompok jam 14.00 di perpustakaan lantai 2 ya. Bawa laptop masing-masing.");

runTest("Safe Message 3", "Pesan Aman 3: Peringatan OTP Resmi Bank (Skor 0 / TIDAK TERDETEKSI)", () => {
  const otpWarning = "Info resmi: jangan berikan kode OTP kepada siapa pun termasuk pihak yang mengaku dari bank.";
  const scan = scanText(otpWarning);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("apk_otp_harvester"));
  return scan.summary.score;
}, "Info resmi: jangan berikan kode OTP kepada siapa pun termasuk pihak yang mengaku dari bank.");

runTest("Safe Message 4", "Pesan Aman 4: Tagihan Resmi PLN Mobile (Skor <= 15)", () => {
  const plnBill = "Tagihan listrik bulan ini Rp 250.000, jatuh tempo tanggal 20. Bayar lewat aplikasi PLN Mobile resmi, transfer biaya admin Rp 2.500 sudah termasuk.";
  const scan = scanText(plnBill);
  assert.ok(scan.summary.score <= 15, `Expected score <= 15, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("upfront_fee"));
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Tagihan listrik bulan ini Rp 250.000, jatuh tempo tanggal 20. Bayar lewat aplikasi PLN Mobile resmi, transfer biaya admin Rp 2.500 sudah termasuk.");

runTest("Safe Message 5", "Pesan Aman 5: Kerabat Ganti Nomor Tanpa Minta Uang (Skor 0 / TIDAK TERDETEKSI)", () => {
  const safeFamily = "Mah, aku pakai nomor baru, simpan ya";
  const scan = scanText(safeFamily);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("family_impersonation"));
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Mah, aku pakai nomor baru, simpan ya");

runTest("Safe Message 6", "Pesan Aman 6: Notifikasi Mutasi Rekening Resmi Tanpa Tautan (Skor 0 / TIDAK TERDETEKSI)", () => {
  const text = "Notifikasi Transaksi Bank Nasional Nusantara: Rekening 0239xxx menerima transfer masuk Rp 500.000 pada 10/11 08:30 WIB. Saldo akhir Rp 2.450.000.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Notifikasi Transaksi Bank Nasional Nusantara: Rekening 0239xxx menerima transfer masuk Rp 500.000 pada 10/11 08:30 WIB. Saldo akhir Rp 2.450.000.");

runTest("Safe Message 7", "Pesan Aman 7: Driver Ojek Online Sudah di Depan (Skor 0 / TIDAK TERDETEKSI)", () => {
  const text = "Siang kak, saya driver ojek online sudah sampai di depan pagar rumah sesuai titik ya.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Siang kak, saya driver ojek online sudah sampai di depan pagar rumah sesuai titik ya.");

runTest("Safe Message 8", "Pesan Aman 8: Pengingat Rapat Organisasi Internal (Skor 0 / TIDAK TERDETEKSI)", () => {
  const text = "Halo rekan panitia, pengingat rapat evaluasi divisi perlengkapan malam ini pukul 19.30 WIB via Google Meet internal.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Halo rekan panitia, pengingat rapat evaluasi divisi perlengkapan malam ini pukul 19.30 WIB via Google Meet internal.");

runTest("Safe OTP SMS", "SMS OTP Asli dengan Larangan Berbagi: 'Kode OTP BNN Anda 482913. Jangan berikan...' (Skor < 35)", () => {
  const text = "Kode OTP BNN Anda 482913. Jangan berikan kode ini kepada siapa pun. Berlaku 5 menit.";
  const scan = scanText(text);
  assert.ok(scan.summary.score < 35, `Expected score < 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("apk_otp_harvester"), "Modul apk_otp_harvester tidak boleh terpicu pada SMS OTP resmi");
  return scan.summary.score;
}, "Kode OTP BNN Anda 482913. Jangan berikan kode ini kepada siapa pun. Berlaku 5 menit.");

runTest("Safe Message 9", "Pesan Aman 9: Notifikasi Pengiriman Paket Resmi Ekspedisi (Skor 0 / TIDAK TERDETEKSI)", () => {
  const text = "Paket dengan nomor resi JP1234567890 sedang dibawa kurir menuju alamat Anda. Harap pastikan ada penerima di lokasi.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Paket dengan nomor resi JP1234567890 sedang dibawa kurir menuju alamat Anda. Harap pastikan ada penerima di lokasi.");

runTest("Safe Message 10", "Pesan Aman 10: Pengingat Jadwal Janji Temu Faskes Resmi (Skor 0 / TIDAK TERDETEKSI)", () => {
  const text = "Pengingat: Jadwal konsultasi dokter gigi Anda di Klinik Sehat Nusantara besok Sabtu pukul 10.00 WIB. Harap hadir 15 menit sebelum jadwal.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Pengingat: Jadwal konsultasi dokter gigi Anda di Klinik Sehat Nusantara besok Sabtu pukul 10.00 WIB. Harap hadir 15 menit sebelum jadwal.");

runTest("Safe Message 11", "Pesan Aman 11: Ucapan Selamat Ulang Tahun Personal (Skor 0 / TIDAK TERDETEKSI)", () => {
  const text = "Selamat ulang tahun ya Andi! Semoga panjang umur, sehat selalu, dan sukses dalam karier dan studinya.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Selamat ulang tahun ya Andi! Semoga panjang umur, sehat selalu, dan sukses dalam karier dan studinya.");

runTest("Safe Family Routine 1", "Pesan Aman 12: Pengingat Uang Kos dari Orang Tua (Skor < 35)", () => {
  const text = "Nak, besok transfer uang kos ya, ibu udah kirim ke rekening kamu kemarin";
  const scan = scanText(text);
  assert.ok(scan.summary.score < 35, `Expected score < 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("upfront_fee"), "Modul upfront_fee tidak boleh terpicu pada transfer rutin keluarga");
  return scan.summary.score;
}, "Nak, besok transfer uang kos ya, ibu udah kirim ke rekening kamu kemarin");

runTest("Safe Family Routine 2", "Pesan Aman 13: Konfirmasi Uang Kuliah Mahasiswa ke Orang Tua (Skor < 35)", () => {
  const text = "Pah, uang kuliah semester ini udah aku transfer ya";
  const scan = scanText(text);
  assert.ok(scan.summary.score < 35, `Expected score < 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("upfront_fee"), "Modul upfront_fee tidak boleh terpicu pada transfer uang kuliah");
  return scan.summary.score;
}, "Pah, uang kuliah semester ini udah aku transfer ya");

runTest("Safe Sales Commission", "Pesan Aman 14: Komisi Penjualan Ditransfer Resmi (Skor < 35)", () => {
  const text = "Komisi penjualan bulan ini Rp 2.000.000 sudah ditransfer ke rekening kamu ya";
  const scan = scanText(text);
  assert.ok(scan.summary.score < 35, `Expected score < 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("unrealistic_reward"), "Modul unrealistic_reward tidak boleh terpicu");
  assert.ok(!triggeredIds.includes("upfront_fee"), "Modul upfront_fee tidak boleh terpicu");
  return scan.summary.score;
}, "Komisi penjualan bulan ini Rp 2.000.000 sudah ditransfer ke rekening kamu ya");

runTest("Safe Book Reviewer", "Pesan Aman 15: Reviewer Buku Perpustakaan Kampus (Skor 0 / TIDAK TERDETEKSI)", () => {
  const text = "Aku jadi reviewer buku di perpustakaan kampus, rapat evaluasi jam 3 ya";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 0, `Expected score 0, got ${scan.summary.score}`);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const dangerEngines = scan.engines.filter(e => e.status === "DANGER" && e.score >= 30);
  assert.equal(dangerEngines.length, 0);
  return scan.summary.score;
}, "Aku jadi reviewer buku di perpustakaan kampus, rapat evaluasi jam 3 ya");

// ─────────────────────────────────────────────────────────────
// SUITE 4: SPECIAL TESTS (SECRECY EXCEPTION & BOUNDARIES)
// ─────────────────────────────────────────────────────────────
console.log("\n📦 SUITE 4: Special Verification & Boundary Checks");

runTest("Secrecy Exception", "Tes Khusus: 'jangan beritahu siapa pun soal transfer ini' tetap memicu skor risiko", () => {
  const text = "Segera transfer biaya administrasi Rp 500.000 ke rekening bendahara, dan jangan beritahu siapa pun soal transfer ini.";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 30, `Expected score >= 30, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("upfront_fee"), "Modul upfront_fee harus tetap terpicu");
  return scan.summary.score;
}, "Segera transfer biaya administrasi Rp 500.000 ke rekening bendahara, dan jangan beritahu siapa pun soal transfer ini.");

runTest("Guard Drop Impersonation", "Guard Gugur: Nomor baru + uang kos ke rekening ini (skor >= 35)", () => {
  const text = "Mah ini nomor baru aku, hp lama hilang. Transfer uang kos dulu ya ke rekening ini";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("family_impersonation"), "Modul family_impersonation harus terpicu");
  assert.ok(triggeredIds.includes("upfront_fee"), "Modul upfront_fee harus tetap terpicu karena guard gugur");
  return scan.summary.score;
}, "Mah ini nomor baru aku, hp lama hilang. Transfer uang kos dulu ya ke rekening ini");

runTest("Guard Drop Urgency & Secrecy", "Guard Gugur: Uang kos 15 menit + rekening penampung + rahasia (skor >= 35)", () => {
  const text = "Transfer uang kos sekarang dalam 15 menit ke rekening penampung ini, jangan beritahu siapa pun";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("upfront_fee"), "Modul upfront_fee harus tetap terpicu karena guard gugur");
  assert.ok(triggeredIds.includes("artificial_urgency"), "Modul artificial_urgency harus terpicu");
  return scan.summary.score;
}, "Transfer uang kos sekarang dalam 15 menit ke rekening penampung ini, jangan beritahu siapa pun");

runTest("Boundary Check", "Input kosong / whitespace menghasilkan return null secara aman", () => {
  assert.equal(scanText(""), null);
  assert.equal(scanText("   \n\t  "), null);
  assert.equal(scanText(null), null);
});

// ─────────────────────────────────────────────────────────────
// SUITE 5: OBFUSCATION & TEXT NORMALIZATION DEFENSE
// ─────────────────────────────────────────────────────────────
console.log("\n📦 SUITE 5: Obfuscation Defense & Normalisasi Teks (Skor >= 35)");

runTest("Obfuscation Leetspeak", "Normalisasi Leetspeak: 'tr4nsf3r b14y4 4dm1n 150rb s3k4r4ng' (skor >= 35)", () => {
  const text = "tr4nsf3r b14y4 4dm1n 150rb s3k4r4ng";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("upfront_fee"), "Harus mendeteksi upfront_fee dari tr4nsf3r b14y4 4dm1n");
  return scan.summary.score;
}, "tr4nsf3r b14y4 4dm1n 150rb s3k4r4ng");

runTest("Obfuscation Spaced", "Normalisasi Pemisah Huruf: 'kirim p.u.l.s.a 100rb dulu ya, nomor baru nih hp lama hilang' (skor >= 35)", () => {
  const text = "kirim p.u.l.s.a 100rb dulu ya, nomor baru nih hp lama hilang";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("family_impersonation"), "Harus mendeteksi family_impersonation dari p.u.l.s.a dan nomor baru");
  return scan.summary.score;
}, "kirim p.u.l.s.a 100rb dulu ya, nomor baru nih hp lama hilang");

runTest("Obfuscation Slang", "Normalisasi Singkatan Obrolan: 'mam, hp aku ilang jd ini nmr baru ya. bisa tf dulu ga 500rb, urgent bgt' (skor >= 35)", () => {
  const text = "mam, hp aku ilang jd ini nmr baru ya. bisa tf dulu ga 500rb, urgent bgt";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("family_impersonation"), "Harus mendeteksi family_impersonation dari nmr baru dan tf");
  return scan.summary.score;
}, "mam, hp aku ilang jd ini nmr baru ya. bisa tf dulu ga 500rb, urgent bgt");

runTest("OTP Request Attack", "Permintaan Aktif Kode OTP: 'Kirim kode OTP kamu ke saya sekarang' (skor >= 35)", () => {
  const text = "Kirim kode OTP kamu ke saya sekarang";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("apk_otp_harvester"), "Modul apk_otp_harvester harus tetap terpicu pada permintaan kode");
  return scan.summary.score;
}, "Kirim kode OTP kamu ke saya sekarang");

runTest("Brand Spoofing Generic", "Modul Brand Spoofing Generic Word: 'tokopedia-order.id' (skor >= 35)", () => {
  const text = "tokopedia-order.id";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("phishing_link"), "Modul phishing_link harus terpicu pada domain tiruan tokopedia-order.id");
  return scan.summary.score;
}, "tokopedia-order.id");

runTest("Fake Job Upfront Fee", "Pungutan Biaya Loker Palsu: 'Dibutuhkan admin online shop... bayar seragam 150rb dulu' (skor >= 35)", () => {
  const text = "Dibutuhkan admin online shop... bayar seragam 150rb dulu";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("upfront_fee"), "Modul upfront_fee harus terpicu pada pungutan biaya seragam");
  return scan.summary.score;
}, "Dibutuhkan admin online shop... bayar seragam 150rb dulu");

// ─────────────────────────────────────────────────────────────
// TABEL RINGKASAN & LAPORAN AKHIR
// ─────────────────────────────────────────────────────────────
console.log("\n📊 TABEL SKOR & HASIL VERIFIKASI ENGINE (MIT-041):\n");
console.table(summaryRows);

console.log("\n📈 RINGKASAN AKHIR PENGUJIAN:");
console.log(`  - Total Pengujian : ${passedCount + failedCount}`);
console.log(`  - Lulus (PASS)    : ${passedCount}`);
console.log(`  - Gagal (FAIL)    : ${failedCount}`);

if (failedCount > 0) {
  console.error(`\n❌ TERDAPAT ${failedCount} PENGUJIAN YANG GAGAL. Keluar dengan kode 1.`);
  process.exit(1);
} else {
  console.log(`\n🎉 SELURUH ${passedCount} PENGUJIAN OTOMATIS ENGINE BERHASIL 100% TANPA ERROR!`);
  process.exit(0);
}
