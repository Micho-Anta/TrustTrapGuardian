/**
 * Tahap 1: Privacy Scrubber
 * Sensor Privasi Otomatis (Auto-Redaction) Sisi Klien
 * Menyensor NIK (16 digit), Nomor Telepon Indonesia, Rekening Bank, Kode OTP/PIN,
 * dan Angka Identitas Panjang secara lokal di browser sebelum dianalisis lebih lanjut.
 */

export function createRedaction(type, originalLength, replacement, defaultLabel) {
  const item = { type, originalLength, replacement, label: defaultLabel || type };
  Object.defineProperty(item, "toString", {
    value: function () {
      return defaultLabel || type;
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
  return item;
}

export function scrubSensitiveData(rawText = "") {
  if (!rawText || typeof rawText !== "string") {
    return { sanitizedText: "", redactions: [] };
  }

  // Strip zero-width characters & normalize unicode
  let text = rawText
    .replace(/[\u200B-\u200D\u202A-\u202E\uFEFF]/g, "")
    .normalize("NFKC");

  const redactions = [];

  // 1. Redact NIK (16 digit, continuous atau terpisah 4-4-4-4 / 6-6-4 / 2-2-2-6-4)
  const nikRegex = /\b\d{4}[\s.\-]\d{4}[\s.\-]\d{4}[\s.\-]\d{4}\b|\b\d{6}[\s.\-]\d{6}[\s.\-]\d{4}\b|\b\d{1,2}[\s.\-]\d{2}[\s.\-]\d{2}[\s.\-]\d{6}[\s.\-]\d{4}\b|\b\d{16}\b/g;
  if (text.match(nikRegex)) {
    text = text.replace(nikRegex, "[NIK_DISAMARKAN]");
    redactions.push("Nomor Induk Kependudukan (NIK 16-Digit)");
  }

  // 2. Redact Kode OTP & PIN (4-6 digit dengan konteks kata kunci di sekitarnya)
  const otpRegex = /(?:otp|pin|kode\s*(?:verifikasi|rahasia|sms)?)[^\d\n]{0,30}?([0-9]{4,6})\b/gi;
  if (text.match(otpRegex)) {
    text = text.replace(otpRegex, (match, code) => {
      return match.replace(code, "[KODE_OTP_DISAMARKAN]");
    });
    redactions.push("Kode OTP / PIN Transaksi");
  }

  // 3. Redact Nomor Rekening Bank dengan konteks kata kunci rek / rekening
  const rekContextRegex = /(?:rek(?:ening)?[\s\S]{0,30}?)([\d][\d\s.\-]{9,22}[\d])/gi;
  if (text.match(rekContextRegex)) {
    text = text.replace(rekContextRegex, (match, acc) => {
      return match.replace(acc, "[REKENING_DISAMARKAN]");
    });
    redactions.push("Nomor Rekening Bank");
  }

  // 4. Redact Nomor HP Indonesia (+62 atau 08xx) termasuk yang dipisah spasi/hubung
  const phoneRegex = /(?:\+62|62|0)8[1-9][0-9\s.\-]{7,13}[0-9]/g;
  if (text.match(phoneRegex)) {
    text = text.replace(phoneRegex, "[NOMOR_HP_DISAMARKAN]");
    redactions.push("Nomor Handphone Pribadi");
  }

  // 5. Fallback: Tangkap angka panjang standalone 10-16 digit jika belum tersensor
  const longNumRegex = /\b\d[\d\s.\-]{9,20}\d\b/g;
  if (text.match(longNumRegex)) {
    text = text.replace(longNumRegex, "[NOMOR_PANJANG_DISAMARKAN]");
    redactions.push("Nomor Identitas / Akun Panjang");
  }

  return {
    sanitizedText: text,
    redactions: Array.from(new Set(redactions))
  };
}

// Backward-compatibility alias
export function scrubPrivacy(rawText = "") {
  return scrubSensitiveData(rawText);
}

export default scrubSensitiveData;
