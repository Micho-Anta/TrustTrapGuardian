/**
 * Text Normalizer for Scam Heuristic Engine
 * Melakukan pra-normalisasi teks salinan khusus pencocokan ekspresi reguler (regex):
 * 1. Penghapusan pemisah antar huruf tunggal (p.u.l.s.a, p u l s a, p-u-l-s-a -> pulsa)
 *    hanya jika polanya huruf tunggal berulang minimal 4 huruf.
 * 2. Pemetaan leetspeak (4->a, 3->e, 1->i, 0->o, 5->s, 7->t) hanya pada token yang memuat huruf.
 * 3. Ekspansi singkatan obrolan umum (tf->transfer, nmr->nomor, jd->jadi, bgt->banget, dsb).
 * 
 * Teks asli dan sensor privasi tidak diubah untuk kebutuhan tampilan dan sorotan bukti.
 */

const LEET_MAP = {
  "4": "a",
  "3": "e",
  "1": "i",
  "0": "o",
  "5": "s",
  "7": "t"
};

const ABBREVIATION_RULES = [
  { pattern: /\bkirimin\b/gi, replacement: "kirim" },
  { pattern: /\btf\b/gi, replacement: "transfer" },
  { pattern: /\bnmr\b/gi, replacement: "nomor" },
  { pattern: /\bjd\b/gi, replacement: "jadi" },
  { pattern: /\bbgt\b/gi, replacement: "banget" },
  { pattern: /\bbrp\b/gi, replacement: "berapa" },
  { pattern: /\bilang\b/gi, replacement: "hilang" }
];

export function normalizeForDetection(text) {
  if (!text || typeof text !== "string") {
    return { normalizedText: "", tokenMap: [] };
  }

  const tokenMap = [];

  // Tahap 1: Hapus pemisah antar huruf tunggal pada kata (minimal 4 huruf)
  // Contoh: p.u.l.s.a, p-u-l-s-a, p_u_l_s_a
  let workingText = text.replace(/\b([a-zA-Z](?:[.\-_][a-zA-Z]){3,})\b/g, (match) => {
    const clean = match.replace(/[.\-_]/g, "");
    tokenMap.push({ original: match, normalized: clean });
    return clean;
  });

  // Contoh spasi: p u l s a
  workingText = workingText.replace(/\b([a-zA-Z](?:\s+[a-zA-Z]){3,})\b/g, (match) => {
    const clean = match.replace(/\s+/g, "");
    tokenMap.push({ original: match, normalized: clean });
    return clean;
  });

  // Tahap 2: Petakan leetspeak di dalam token yang mengandung huruf
  // Hindari token unit nominal, waktu, atau data (misal 150rb, 100k, 5jt, 15menit, 24jam)
  // Hindari juga token redaksi seperti [NIK_DISAMARKAN]
  workingText = workingText.replace(/(\b[a-zA-Z0-9_]+\b)/g, (token) => {
    if (!/[a-zA-Z]/.test(token)) return token;
    if (token.startsWith("[") && token.endsWith("]")) return token;
    if (/^\d+(?:rb|k|jt|juta|ribu|menit|jam|hari|detik|thn|bln|gb|mb|persen|%)$/i.test(token)) return token;
    if (/^(?:rp)\d+$/i.test(token)) return token;

    if (/[431057]/.test(token)) {
      const converted = token.replace(/[431057]/g, (char) => LEET_MAP[char] || char);
      tokenMap.push({ original: token, normalized: converted });
      return converted;
    }
    return token;
  });

  // Tahap 3: Ekspansi singkatan umum
  for (const rule of ABBREVIATION_RULES) {
    workingText = workingText.replace(rule.pattern, (match) => {
      tokenMap.push({ original: match, normalized: rule.replacement });
      return rule.replacement;
    });
  }

  return {
    normalizedText: workingText,
    tokenMap
  };
}
