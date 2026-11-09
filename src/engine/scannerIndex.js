import { scrubSensitiveData, scrubPrivacy } from "./privacyScrubber";
import { HEURISTIC_ENGINES, inspectLinksInText } from "./heuristicRules";

/**
 * Scan text using Scam Heuristic Engine v1.0
 * Alur 4 Tahap:
 * 1. Auto-Redaction Sensor Privasi (Local-First Scrubber)
 * 2. 6-Module Heuristic Examination (Explainable Rules)
 * 3. Combo Multiplier Calculation
 * 4. Action & Explanation Mapping
 */
export function scanText(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim() === "") {
    return null;
  }

  // Tahap 1: Sensor Privasi Otomatis (Auto-Redaction)
  const scrubberFn = typeof scrubSensitiveData === "function" ? scrubSensitiveData : scrubPrivacy;
  const { sanitizedText, redactions } = scrubberFn(rawText);

  const engineResults = [];
  const highlightedEvidence = [];
  let totalRawScore = 0;
  const triggeredIds = new Set();

  // Daftarkan token sensor ke highlightedEvidence agar UI HighlightView & ScannerSuite memecah dan menampilkan pill sensor
  if (Array.isArray(redactions) && redactions.length > 0) {
    for (const r of redactions) {
      const token = typeof r === "object" && r !== null ? r.replacement : r;
      if (token && typeof token === "string") {
        highlightedEvidence.push({
          text: token,
          engineId: "privacy_scrubber",
          engineName: "Privacy Scrubber",
          reason: "Sensor Privasi Otomatis"
        });
      }
    }
  }

  // Tahap 2: Pemeriksaan 6 Modul Modus Penipuan
  for (const engine of HEURISTIC_ENGINES) {
    const evidenceList = [];
    const matchedPatterns = [];

    if (engine.inspectUrl) {
      // Modul Khusus: Phishing Link & Domain Inspector
      const linkFindings = inspectLinksInText(sanitizedText);
      if (linkFindings.length > 0) {
        for (const finding of linkFindings) {
          evidenceList.push(finding.url);
          matchedPatterns.push(finding.reason);
          highlightedEvidence.push({
            text: finding.url,
            engineId: engine.id,
            engineName: engine.name,
            reason: finding.reason
          });
        }
      }
    } else if (Array.isArray(engine.rules)) {
      // Modul Berbasis Pola Kalimat / Regex
      for (const rule of engine.rules) {
        // Buat regex baru untuk mencegah efek caching lastIndex pada global flag
        const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
        const matches = sanitizedText.match(regex);
        if (matches) {
          for (const m of matches) {
            evidenceList.push(m);
            highlightedEvidence.push({
              text: m,
              engineId: engine.id,
              engineName: engine.name,
              reason: rule.label
            });
          }
          matchedPatterns.push(rule.label);
        }
      }
    }

    const uniqueEvidence = Array.from(new Set(evidenceList));
    const isTriggered = uniqueEvidence.length > 0;

    if (isTriggered) {
      triggeredIds.add(engine.id);
      totalRawScore += engine.baseWeight;
    }

    engineResults.push({
      id: engine.id,
      name: engine.name,
      category: engine.category,
      status: isTriggered ? "DANGER" : "CLEAN",
      score: isTriggered ? engine.baseWeight : 0,
      evidence: uniqueEvidence,
      patterns: Array.from(new Set(matchedPatterns)),
      explanation: engine.explanation,
      actionStep: engine.actionStep
    });
  }

  // Tahap 3: Pengali Kombinasi (Combo Multiplier)
  let comboBonus = 1.0;
  const combosTriggered = [];

  // Kombinasi Maut 1: Uang di Muka + Urgensi Waktu
  if (triggeredIds.has("upfront_fee") && triggeredIds.has("artificial_urgency")) {
    comboBonus += 0.25;
    combosTriggered.push("Kombinasi Tekanan Waktu + Permintaan Uang Muka (High Urgency Trap)");
  }

  // Kombinasi Maut 2: Imbalan Fantastis + Deposit Tugas (Task Scam)
  if (triggeredIds.has("unrealistic_reward") && triggeredIds.has("upfront_fee")) {
    comboBonus += 0.3;
    combosTriggered.push("Pola Klasik Task Scam: Imbalan Mudah + Deposit Bertingkat");
  }

  // Kombinasi Maut 3: APK / OTP + Catut Nama Instansi atau Phishing Link
  if (triggeredIds.has("apk_otp_harvester") && (triggeredIds.has("identity_mismatch") || triggeredIds.has("phishing_link"))) {
    comboBonus += 0.35;
    combosTriggered.push("Pola Pembajakan Akun Perbankan / Trojan APK dengan Kedok Instansi Resmi");
  }

  const finalScore = Math.min(100, Math.round(totalRawScore * comboBonus));

  // Tentukan Level Risiko dan Warna Status
  let riskLevel = "AMAN / BERSIH";
  let riskColor = "emerald";
  if (finalScore >= 70) {
    riskLevel = "TINGGI (INDIKASI KUAT PENIPUAN)";
    riskColor = "red";
  } else if (finalScore >= 35) {
    riskLevel = "WASPADA (INDIKASI SEDANG / MENCURIGAKAN)";
    riskColor = "amber";
  } else if (finalScore > 0) {
    riskLevel = "POTENSI RISIKO (PERLU CEK SILANG)";
    riskColor = "yellow";
  }

  // Tahap 4: Pemetaan Tindakan Rekomendasi
  const recommendedActions = [];
  if (triggeredIds.has("apk_otp_harvester")) {
    recommendedActions.push("JANGAN PERNAH instal file .APK yang dikirimkan atau menyerahkan kode OTP / PIN 6-digit kepada siapa pun.");
  }
  if (triggeredIds.has("upfront_fee")) {
    recommendedActions.push("Hentikan komunikasi segera dan JANGAN mentransfer uang sepeser pun dengan alasan apapun.");
  }
  if (triggeredIds.has("phishing_link")) {
    recommendedActions.push("Jangan klik tautan tersebut. Hubungi institusi bersangkutan melalui portal resmi atau call center terverifikasi.");
  }
  if (triggeredIds.has("artificial_urgency")) {
    recommendedActions.push("Tunda aksi minimal 30 menit dan diskusikan pesan ini dengan rekan atau keluarga yang tenang.");
  }
  if (triggeredIds.has("identity_mismatch")) {
    recommendedActions.push("Lakukan cross-check langsung ke portal resmi atau kanal media sosial resmi instansi.");
  }
  if (recommendedActions.length === 0) {
    recommendedActions.push("Pesan tidak menunjukkan ciri manipulasi rekayasa sosial umum, namun tetaplah waspada terhadap permintaan data sensitif.");
  }

  return {
    sanitizedText,
    redactions,
    summary: {
      score: finalScore,
      rawScore: totalRawScore,
      comboBonus: Number(comboBonus.toFixed(2)),
      combosTriggered,
      triggeredEngines: triggeredIds.size,
      totalEngines: HEURISTIC_ENGINES.length,
      riskLevel,
      riskColor,
      disclaimer: "Hasil analisis ini berbasis pencocokan pola heuristik & rekayasa sosial, bukan klaim jaminan mutlak 100%."
    },
    engines: engineResults,
    highlightedEvidence,
    recommendedActions
  };
}

export default scanText;
