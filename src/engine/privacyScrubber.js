/**
 * Privacy Scrubber: Sensor Privasi Otomatis (Auto-Redaction)
 * Memastikan privasi pengguna 100% terjaga sebelum teks dianalisis lebih lanjut.
 * Angka sensitif seperti NIK, Rekening Bank, Kode OTP, dan PIN disamarkan secara lokal.
 */

export function scrubPrivacy(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { sanitizedText: "", redactions: [] };
  }

  // Strip zero-width characters & normalize unicode
  let text = rawText
    .replace(/[\u200B-\u200D\u202A-\u202E\uFEFF]/g, "")
    .normalize("NFKC");

  const redactions = [];

  // 1. Redact NIK (16 digit, termasuk yang dipisah spasi/titik/hubung)
  // Pola: 16 digit berurutan ATAU 16 digit dipisah spasi/titik/hubung
  const nikRegex = /\b\d{1,2}[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{6}[\s.\-]?\d{4}\b|\b\d{16}\b/g;
  if (nikRegex.test(text)) {
    text = text.replace(nikRegex, "[NIK_DISAMARKAN]");
    redactions.push("Nomor Induk Kependudukan (NIK 16-Digit)");
  }

  // 2. Redact Kode OTP & PIN (4-6 digit dengan konteks kata kunci di sekitarnya)
  const otpRegex = /(?:otp|pin|kode\s*(?:verifikasi|rahasia|sms)?)[\s:=-]*([0-9]{4,6})\b/gi;
  if (otpRegex.test(text)) {
    text = text.replace(otpRegex, (match, code) => {
      return match.replace(code, "[KODE_OTP_DISAMARKAN]");
    });
    redactions.push("Kode OTP / PIN Transaksi");
  }

  // 3. Redact Nomor Rekening Bank (10–16 digit, termasuk yang dipisah spasi/titik/hubung)
  const rekContextRegex = /(?:rek(?:ening)?[\s\S]{0,30}?)([\d][\d\s.\-]{9,22}[\d])/gi;
  if (rekContextRegex.test(text)) {
    text = text.replace(rekContextRegex, (match, acc) => {
      return match.replace(acc, "[REKENING_DISAMARKAN]");
    });
    redactions.push("Nomor Rekening Bank");
  } else {
    // Tangkap angka panjang standalone 10-16 digit (termasuk dengan spasi/hubung)
    const longNumRegex = /\b\d[\d\s.\-]{9,20}\d\b/g;
    if (longNumRegex.test(text)) {
      text = text.replace(longNumRegex, "[NOMOR_PANJANG_DISAMARKAN]");
      redactions.push("Nomor Identitas / Akun Panjang");
    }
  }

  // 4. Redact Nomor HP Indonesia (+62 atau 08xx) termasuk yang dipisah spasi/hubung
  const phoneRegex = /(?:\+62|62|0)8[1-9][0-9\s.\-]{7,13}[0-9]/g;
  if (phoneRegex.test(text)) {
    text = text.replace(phoneRegex, "[NOMOR_HP_DISAMARKAN]");
    redactions.push("Nomor Handphone Pribadi");
  }

  return {
    sanitizedText: text,
    redactions: Array.from(new Set(redactions))
  };
}
