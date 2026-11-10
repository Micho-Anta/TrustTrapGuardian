/**
 * Context Guards: Pemeriksaan Konteks Kalimat & Negasi
 * Mencegah false positive pada pesan edukasi resmi dan tagihan kanal resmi.
 */

/**
 * Memecah teks menjadi potongan kalimat secara aman tanpa memutus angka desimal/ribuan.
 */
export function splitSentences(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .split(/\n+|(?<=[.!?]+)\s+(?=[^\d\s])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Mendeteksi frasa kerahasiaan yang justru merupakan ciri khas penipuan.
 * Contoh: "jangan beritahu siapa pun", "jangan kasih tahu keluarga", "rahasiakan".
 * Frasa seperti ini TIDAK boleh dianggap sebagai kalimat peringatan resmi.
 */
export function isScamSecrecySentence(sentence) {
  if (!sentence) return false;
  const s = sentence.toLowerCase();

  const secrecyPatterns = [
    /jangan\s+(?:pernah\s+)?(?:beritahu|beri\s*tahu|kasih\s*tahu|cerita(?:kan)?|bicara)\s+(?:ke\s+|kepada\s+)?(?:siapa\s*pun|siapapun|keluarga|orang\s*tua|teman|rekan|orang\s*lain|siapa\s*saja)/i,
    /\b(?:rahasiakan|dirahasiakan)\b/i,
    /jangan\s+(?:sampai\s+)?(?:ada\s+yang\s+tahu|bocor)/i,
    /bersifat\s+rahasia\s+(?:jangan|dan)/i,
  ];

  return secrecyPatterns.some((pattern) => pattern.test(s));
}

/**
 * Mendeteksi apakah kalimat berisi pola peringatan atau negasi terhadap tindakan berisiko.
 * Contoh: "jangan berikan kode OTP", "tidak pernah meminta", "waspada", "info resmi".
 */
export function isEducationalWarningSentence(sentence) {
  if (!sentence) return false;

  // Pengecualian mutlak: jika memuat ciri kerahasiaan penipu, tolak status peringatan
  if (isScamSecrecySentence(sentence)) {
    return false;
  }

  const s = sentence.toLowerCase();

  const warningPatterns = [
    // Negasi penyerahan kredensial sensitif
    /jangan\s+(?:pernah\s+)?(?:berikan|bagikan|kasih|sebarkan|kirim|serahkan|menyerahkan|memberikan|membagikan)\s+[^.!?\n]{0,50}?(?:otp|pin|kode|password|kata\s*sandi)/i,
    
    // Negasi permintaan dari institusi resmi
    /tidak\s+(?:pernah\s+)?(?:meminta|menagih)\b/i,
    
    // Kata kunci penanda edukasi dan himbauan resmi
    /\b(?:waspada(?:lah)?|hati[- ]hati|himbauan|imbauan|peringatan)\b/i,
    /\b(?:info(?:rmasi)?\s+resmi|edukasi|pengingat\s+keamanan|tips\s+keamanan)\b/i,
    /\b(?:modus\s+penipuan|indikasi\s+penipuan|kejahatan\s+siber)\b/i,
  ];

  return warningPatterns.some((pattern) => pattern.test(s));
}

/**
 * Mendeteksi kalimat larangan penyerahan/pembagian kode OTP atau PIN.
 * Contoh: "Jangan berikan kode ini kepada siapa pun.", "Jangan bagikan kode OTP Anda."
 */
export function isSharingProhibitionSentence(sentence) {
  if (!sentence) return false;
  if (isScamSecrecySentence(sentence)) return false;
  const s = sentence.toLowerCase();

  const patterns = [
    /jangan\s+(?:pernah\s+)?(?:berikan|bagikan|kasih|sebarkan|kirim|serahkan|menyerahkan|memberikan|membagikan|beritahu|beritahukan)\s+[^.!?\n]{0,50}?(?:otp|pin|kode|password|kata\s*sandi|rahasia|ini)/i,
    /tidak\s+(?:pernah\s+)?(?:meminta|menagih)\s+[^.!?\n]{0,50}?(?:otp|pin|kode|password)/i,
    /(?:jaga|menjaga)\s+kerahasiaan\s+(?:kode|otp|pin|password)/i,
    /jangan\s+(?:berikan|kasih|bagikan|share)\s+(?:ke|kepada)?\s*(?:siapa\s*pun|siapapun|pihak\s*mana\s*pun)/i,
    /bersifat\s+rahasia[,\s]+jangan\s+(?:berikan|bagikan|kasih|share)/i
  ];

  return patterns.some((p) => p.test(s)) || isEducationalWarningSentence(sentence);
}

/**
 * Mendeteksi kalimat permintaan aktif untuk mengirim atau menyerahkan kode OTP/PIN.
 * Contoh: "Kirim kode OTP kamu ke saya sekarang", "Sebutkan kode OTP yang masuk".
 */
export function isRequestToSendCodeSentence(sentence) {
  if (!sentence) return false;
  if (isSharingProhibitionSentence(sentence)) return false;
  const s = sentence.toLowerCase();

  const patterns = [
    /(?:kirim(?:kan)?|sebutkan|serahkan|kasih(?:kan)?|bagi(?:kan)?|berikan|ketik|masukkan|forward|balas|reply)\s+[^.!?\n]{0,35}?(?:kode|otp|pin|token|password)/i,
    /(?:kode|otp|pin|token)\s+[^.!?\n]{0,35}?(?:kirim(?:kan)?|sebutkan|serahkan|ke\s+(?:saya|kami|nomor|sini|wa)|via\s+wa)/i,
    /minta\s+(?:kode|otp|pin)/i
  ];

  return patterns.some((p) => p.test(s));
}

/**
 * Mendeteksi apakah kalimat memuat penanda kanal pembayaran resmi.
 * Contoh: "aplikasi resmi", "PLN Mobile", "melalui aplikasi", "sudah termasuk".
 */
export function isOfficialChannelSentence(sentence) {
  if (!sentence) return false;
  const s = sentence.toLowerCase();

  const officialMarkers = [
    /aplikasi\s+resmi/i,
    /pln\s*mobile/i,
    /(?:melalui|lewat|via)\s+aplikasi/i,
    /sudah\s+termasuk/i,
    /kanal\s+resmi/i,
    /tagihan\s+resmi/i,
  ];

  return officialMarkers.some((p) => p.test(s));
}

/**
 * Mendeteksi kalimat transfer kebutuhan rutin keluarga atau arah uang masuk ke penerima.
 * Contoh: "uang kos", "uang kuliah", "ibu udah kirim ke rekening kamu".
 */
export function isFamilyRoutineFinancialSentence(sentence) {
  if (!sentence) return false;
  if (isScamSecrecySentence(sentence)) return false;
  const s = sentence.toLowerCase();

  const incomingDirection =
    /(?:udah|sudah)\s+(?:[a-zA-Z]+\s+)?(?:kirim|transfer|ditransfer|dikirim)\s+ke\s+rekening\s+(?:kamu|mu|adek|kakak)/i;
  const routineNeeds =
    /uang\s+(?:kos|kuliah|jajan|saku|bulanan|belanja|sekolah|ukt|spp)\b/i;

  return incomingDirection.test(s) || routineNeeds.test(s);
}

/**
 * Memeriksa apakah guard kebutuhan rutin keluarga harus gugur.
 * Gugur jika ada salah satu:
 * 1. Kelompok A family_impersonation ("nomor baru", "hp lama rusak/hilang", dsb)
 * 2. Modul artificial_urgency menyala
 * 3. Ada tautan atau file .apk
 * 4. Ada frasa kerahasiaan ("jangan beritahu siapa pun")
 * 5. Rekening tujuan tidak dikenal ("rekening penampung", "rekening ini")
 */
export function shouldDropFamilyRoutineGuard({
  normalizedText,
  sentences,
  hasUrgency,
  hasLinks,
  hasApk
}) {
  const text = normalizedText.toLowerCase();

  // 1. Kelompok A family_impersonation
  const groupAPatterns = [
    /nomor\s*baru/i,
    /ganti\s*nomor/i,
    /hp\s*(?:lama\s*|aku\s*|ku\s*)?(?:rusak|hilang|error)/i,
    /aku\s*(?:anakmu|anak\s*mama)/i,
    /\bdarurat\b/i,
    /rumah\s*sakit/i,
    /kecelakaan/i
  ];
  if (groupAPatterns.some((p) => p.test(text))) return true;

  // 2. Modul artificial_urgency menyala
  if (hasUrgency) return true;

  // 3. Ada tautan atau file .apk
  if (hasLinks || hasApk) return true;

  // 4. Ada frasa kerahasiaan
  if (sentences.some((s) => isScamSecrecySentence(s))) return true;

  // 5. Rekening tujuan tidak dikenal
  if (
    /(?:rekening\s*(?:penampung|sementara|ini|tersebut|berikut)|ke\s+rekening\s+ini)/i.test(
      text
    )
  ) {
    return true;
  }

  return false;
}
