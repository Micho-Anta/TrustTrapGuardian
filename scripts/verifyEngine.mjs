import assert from "node:assert/strict";
import { scanText } from "../src/engine/scannerIndex.js";
import { scrubPrivacy } from "../src/engine/privacyScrubber.js";
import { JUDGE_PRESETS } from "../src/data/judgePresets.js";

console.log("🛡️  MEMULAI VERIFIKASI AUTOMATED ENGINE TEST (MIT-041)...");
let passedTests = 0;

function test(name, fn) {
  try {
    fn();
    passedTests++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────
// SUITE 1: PRIVACY SCRUBBER (SENSOR DATA SENSITIF SISI KLIEN)
// ─────────────────────────────────────────────────────────────
console.log("\n📦 SUITE 1: Privacy Scrubber & Unicode Sanitization");

test("Menyensor NIK 16-digit standar", () => {
  const result = scrubPrivacy("NIK saya adalah 3201012345670001 untuk registrasi");
  assert.ok(!result.sanitizedText.includes("3201012345670001"));
  assert.ok(result.sanitizedText.includes("[NIK_DISAMARKAN]"));
  assert.ok(result.redactions.length > 0);
});

test("Menyensor NIK dengan pemisah strip / spasi (Obfuscation Defense)", () => {
  const result = scrubPrivacy("NIK saya: 3201-0123-4567-0001 mohon diproses");
  assert.ok(!result.sanitizedText.includes("3201-0123-4567-0001"));
  assert.ok(result.sanitizedText.includes("[NIK_DISAMARKAN]"));
});

test("Menyensor Nomor Rekening Bank (termasuk dipisah spasi)", () => {
  const result = scrubPrivacy("Transfer ke rekening Bank Nasional Nusantara 0239 0100 2384 501");
  assert.ok(!result.sanitizedText.includes("0239 0100 2384 501"));
  assert.ok(result.sanitizedText.includes("[REKENING_DISAMARKAN]"));
});

test("Menyensor Nomor Handphone (+62 dan 08xx dengan pemisah)", () => {
  const result = scrubPrivacy("Hubungi saya di nomor 0812-3456-7890 sekarang");
  assert.ok(!result.sanitizedText.includes("0812-3456-7890"));
  assert.ok(result.sanitizedText.includes("[NOMOR_HP_DISAMARKAN]"));
});

test("Menyensor Kode OTP & PIN 6-digit", () => {
  const result = scrubPrivacy("Kode OTP Anda adalah: 593810, jangan bagikan!");
  assert.ok(!result.sanitizedText.includes("593810"));
  assert.ok(result.sanitizedText.includes("[KODE_OTP_DISAMARKAN]"));
});

test("Membersihkan zero-width characters & melakukan normalisasi NFKC", () => {
  // \u200B adalah zero-width space
  const evilInput = "Tr\u200Bans\u200Cfer b\u200Diaya";
  const result = scrubPrivacy(evilInput);
  assert.ok(!result.sanitizedText.includes("\u200B"));
  assert.ok(!result.sanitizedText.includes("\u200C"));
});

// ─────────────────────────────────────────────────────────────
// SUITE 2: SCAM HEURISTIC ENGINE (DETEKSI SKENARIO BAHAYA)
// ─────────────────────────────────────────────────────────────
console.log("\n📦 SUITE 2: Heuristic Detection & Multiplier Scoring");

test("Preset 1: Loker BUMN Palsu (Upfront Fee + Urgensi)", () => {
  const scan = scanText(JUDGE_PRESETS[0].text);
  assert.ok(scan.summary.score >= 70, `Expected score >= 70, got ${scan.summary.score}`);
  assert.equal(scan.summary.riskLevel, "RISIKO TINGGI (BANYAK TANDA BAHAYA TERDETEKSI)");
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("upfront_fee"));
  assert.ok(triggeredIds.includes("artificial_urgency"));
  assert.ok(triggeredIds.includes("identity_mismatch"));
  assert.ok(scan.summary.comboBonus > 1.0);
});

test("Preset 2: Task Scam (Imbalan Fantastis + Deposit Bertingkat)", () => {
  const scan = scanText(JUDGE_PRESETS[1].text);
  assert.ok(scan.summary.score >= 70);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("unrealistic_reward"));
  assert.ok(triggeredIds.includes("upfront_fee"));
});

test("Preset 3: Pancingan File .APK & Resi Paket Palsu", () => {
  const scan = scanText(JUDGE_PRESETS[2].text);
  assert.ok(scan.summary.score >= 70);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("apk_otp_harvester"));
});

test("Preset 4: Link Phishing Hadiah & Domain .xyz", () => {
  const scan = scanText(JUDGE_PRESETS[3].text);
  assert.ok(scan.summary.score >= 70);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("phishing_link"));
  assert.ok(triggeredIds.includes("apk_otp_harvester"));
});

test("Deteksi Modus Baru: Rekening Penampung / Alihkan Saldo Aman", () => {
  const text = "Rekening Anda terindikasi peretasan. Segera alihkan saldo ke rekening penampung sementara agar dana aman.";
  const scan = scanText(text);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("upfront_fee"), "Harus mendeteksi modus rekening penampung");
});

test("Modul Investasi Bodong (Crypto Profit Mingguan + Member VIP): skor >= 35", () => {
  const text = "Hai kak, aku Sarah, kenalan di IG kemarin. Aku punya info investasi crypto profit 30% per minggu, modal minimal 500rb, member VIP dijamin cuan. Join grup telegram ya";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("investment_scam"));
});

test("Modul Pinjol Ilegal (Tanpa SLIK + Izin Akses Kontak & Galeri): skor >= 35", () => {
  const text = "Pinjaman online cair 5 juta tanpa jaminan, tanpa slik, proses 5 menit. Download aplikasi di link ini dan izinkan akses kontak & galeri.";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("illegal_loan"));
});

test("Modul Family Impersonation (Ganti Nomor + Minta Pulsa): skor >= 35", () => {
  const text = "Mah ini aku nomor baru, hp lama rusak. Tolong kirimin pulsa dulu 200rb ya, nanti aku ganti, penting banget";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("family_impersonation"));
});

test("Modul Family Impersonation (Darurat RS + Transfer Rekening): skor >= 35", () => {
  const text = "Ini aku lagi darurat di rumah sakit, tolong transfer 3 juta ke rekening 1234567890 sekarang";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("family_impersonation"));
});

test("Modul Ancaman & Pemerasan (Sebar Foto/Kontak + Paksaan Bayar): skor >= 35", () => {
  const text = "Bayar hutangmu hari ini atau kami sebar foto dan kontak keluargamu";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("threat_extortion"));
});

test("Modul Brand Spoofing (shopee-id-verifikasi.com non-official): skor >= 35", () => {
  const text = "Akun Shopee kamu bermasalah, verifikasi sekarang di https://shopee-id-verifikasi.com/login";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("phishing_link"));
});

test("Kasus Kurir + APK + .top menghasilkan skor 100", () => {
  const text = "Halo paket Anda tertahan di gudang J&T. Silakan unduh dan pasang resi_pengiriman.apk di https://jnt-tracking.top untuk konfirmasi.";
  const scan = scanText(text);
  assert.equal(scan.summary.score, 100);
});

test("Kasus Lotere + link bit.ly menghasilkan skor >= 35", () => {
  const text = "Congratulations! You won the UK National Lottery jackpot of 1,000,000 GBP. Claim your prize immediately at https://bit.ly/uk-lottery-claim before it expires in 15 minutes.";
  const scan = scanText(text);
  assert.ok(scan.summary.score >= 35, `Expected score >= 35, got ${scan.summary.score}`);
});

// ─────────────────────────────────────────────────────────────
// SUITE 3: ANTI FALSE-POSITIVE & ETHICAL BOUNDARIES
// ─────────────────────────────────────────────────────────────
console.log("\n📦 SUITE 3: Anti False-Positive & Case Study Compliance");

test("Preset 6: Pesan Normal Kontrol (Skor 0 / TIDAK TERDETEKSI)", () => {
  const scan = scanText(JUDGE_PRESETS[5].text);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  assert.equal(scan.summary.triggeredEngines, 0);
  assert.ok(scan.summary.riskColor === "emerald");
});

test("Pesan Edukasi Resmi Bank tidak menghasilkan False Positive", () => {
  const cleanBankMsg = "Pengingat Keamanan Bank Nasional Nusantara: Jaga selalu kerahasiaan PIN dan password m-banking Anda. Petugas bank tidak pernah meminta OTP. Info resmi hubungi 150000 atau kunjungi situs www.banknusantara.co.id";
  const scan = scanText(cleanBankMsg);
  // Harus skor rendah dan tidak menyalakan upfront fee atau phishing
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("upfront_fee"));
  assert.ok(!triggeredIds.includes("phishing_link"));
});

test("Pesan peringatan resmi OTP menghasilkan skor 0 (TIDAK TERDETEKSI)", () => {
  const otpWarning = "Info resmi: jangan berikan kode OTP kepada siapa pun termasuk pihak yang mengaku dari bank.";
  const scan = scanText(otpWarning);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("apk_otp_harvester"));
});

test("Tagihan resmi PLN Mobile menghasilkan skor <= 15", () => {
  const plnBill = "Tagihan listrik bulan ini Rp 250.000, jatuh tempo tanggal 20. Bayar lewat aplikasi PLN Mobile resmi, transfer biaya admin Rp 2.500 sudah termasuk.";
  const scan = scanText(plnBill);
  assert.ok(scan.summary.score <= 15, `Expected score <= 15, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("upfront_fee"));
});

test("Frasa kerahasiaan penipu (jangan beritahu siapa pun) tidak dianggap peringatan resmi", () => {
  const secrecyScam = "Kode OTP Anda 482910 telah dikirim. Berikan kepada petugas dan jangan beritahu siapa pun atau keluarga karena ini rahasia sistem.";
  const scan = scanText(secrecyScam);
  assert.ok(scan.summary.score >= 40, `Expected score >= 40, got ${scan.summary.score}`);
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(triggeredIds.includes("apk_otp_harvester"), "apk_otp_harvester harus terdeteksi");
});

test("Pesan ganti nomor tanpa permintaan finansial tidak memicu family_impersonation (Skor 0)", () => {
  const safeFamily = "Mah, aku pakai nomor baru, simpan ya";
  const scan = scanText(safeFamily);
  assert.equal(scan.summary.score, 0);
  assert.equal(scan.summary.riskLevel, "TIDAK TERDETEKSI");
  const triggeredIds = scan.engines.filter(e => e.status === "DANGER").map(e => e.id);
  assert.ok(!triggeredIds.includes("family_impersonation"));
});

test("Input kosong / whitespace menghasilkan return null secara aman", () => {
  assert.equal(scanText(""), null);
  assert.equal(scanText("   \n\t  "), null);
  assert.equal(scanText(null), null);
});

console.log(`\n🎉 SELURUH ${passedTests} PENGUJIAN OTOMATIS ENGINE BERHASIL 100% TANPA ERROR!`);
