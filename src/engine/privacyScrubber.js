/**
 * Tahap 1: Privacy Scrubber
 * Menyensor NIK (16 digit), Nomor Telepon Indonesia, dan Nomor Rekening (10-15 digit)
 * secara lokal di browser sebelum dianalisis lebih lanjut.
 */

function createRedaction(type, originalLength, replacement, defaultLabel) {
  const item = { type, originalLength, replacement };
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
  let sanitizedText = rawText;
  const redactions = [];

  // 1. Sensor NIK (16 digit angka berurutan)
  const nikRegex = /\b\d{16}\b/g;
  sanitizedText = sanitizedText.replace(nikRegex, (match) => {
    redactions.push(createRedaction("NIK", match.length, "[NIK_DISENSOR]", "Nomor Induk Kependudukan (NIK)"));
    return "[NIK_DISENSOR]";
  });

  // 2. Sensor Nomor Telepon / WhatsApp Indonesia (+62 / 62 / 08 diikuti 8-12 digit)
  const phoneRegex = /(\+62|62|08)[0-9\s\-]{8,14}\b/g;
  sanitizedText = sanitizedText.replace(phoneRegex, (match) => {
    redactions.push(createRedaction("PHONE", match.trim().length, "[NOMOR_HP_DISENSOR]", "Nomor HP/WhatsApp"));
    return "[NOMOR_HP_DISENSOR]";
  });

  // 3. Sensor Nomor Rekening Bank (10 sampai 15 digit angka berurutan)
  const accountRegex = /\b\d{10,15}\b/g;
  sanitizedText = sanitizedText.replace(accountRegex, (match) => {
    redactions.push(createRedaction("BANK_ACCOUNT", match.length, "[REKENING_DISENSOR]", "Nomor Rekening Bank"));
    return "[REKENING_DISENSOR]";
  });

  return { sanitizedText, redactions };
}

// Backward-compatibility alias
export function scrubPrivacy(rawText = "") {
  return scrubSensitiveData(rawText);
}

export default scrubSensitiveData;
