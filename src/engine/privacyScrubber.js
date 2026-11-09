/**
 * Privacy Scrubber: Sensor Privasi Otomatis (Auto-Redaction)
 * Memastikan privasi pengguna 100% terjaga sebelum teks dianalisis lebih lanjut.
 * Angka sensitif seperti NIK, Rekening Bank, Kode OTP, dan PIN disamarkan secara lokal.
 */

export function scrubPrivacy(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { sanitizedText: "", redactions: [] };
  }

  let text = rawText;
  const redactions = [];

  // 1. Redact NIK (16 digit angka berurutan)
  const nikRegex = /\b\d{16}\b/g;
  if (nikRegex.test(text)) {
    text = text.replace(nikRegex, "[NIK_DISAMARKAN]");
    redactions.push("Nomor Induk Kependudukan (NIK 16-Digit)");
  }

  // 2. Redact Kode OTP & PIN (4-6 digit dengan konteks kata kunci di sekitarnya)
  const otpRegex = /(?:otp|pin|kode\s*(?:verifikasi|rahasia|sms)?)\s*[:=-]?\s*([0-9]{4,6})\b/gi;
  if (otpRegex.test(text)) {
    text = text.replace(otpRegex, (match, code) => {
      return match.replace(code, "[KODE_OTP_DISAMARKAN]");
    });
    redactions.push("Kode OTP / PIN Transaksi");
  }

  // 3. Redact Nomor Rekening Bank (10 sampai 15 digit angka)
  const rekRegex = /(?:rek(?:ening)?|rekening\s*(?:bri|bca|mandiri|bni|cimb|bsi)?)\s*[:=-]?\s*(\b\d{9,16}\b)/gi;
  if (rekRegex.test(text)) {
    text = text.replace(rekRegex, (match, acc) => {
      return match.replace(acc, "[REKENING_DISAMARKAN]");
    });
    redactions.push("Nomor Rekening Bank");
  } else {
    // Tangkap angka panjang standalone 10-15 digit jika ada
    const longNumRegex = /\b\d{10,15}\b/g;
    if (longNumRegex.test(text)) {
      text = text.replace(longNumRegex, "[NOMOR_PANJANG_DISAMARKAN]");
      redactions.push("Nomor Identitas / Akun Panjang");
    }
  }

  // 4. Redact Nomor HP Indonesia (+62 atau 08xx-xxxx-xxxx)
  const phoneRegex = /(?:\+62|62|0)8[1-9][0-9]{7,10}\b/g;
  if (phoneRegex.test(text)) {
    text = text.replace(phoneRegex, "[NOMOR_HP_DISAMARKAN]");
    redactions.push("Nomor Handphone Pribadi");
  }

  return {
    sanitizedText: text,
    redactions: Array.from(new Set(redactions))
  };
}
