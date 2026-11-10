import { scrubPrivacy } from "./privacyScrubber.js";
import { normalizeForDetection } from "./textNormalizer.js";
import { HEURISTIC_ENGINES, inspectLinksInText } from "./heuristicRules.js";
import {
  splitSentences,
  isEducationalWarningSentence,
  isOfficialChannelSentence,
  isSharingProhibitionSentence,
  isRequestToSendCodeSentence
} from "./contextGuards.js";

/**
 * Scan text using Scam Heuristic Engine v1.0
 * Alur 4 Tahap:
 * 1. Auto-Redaction Sensor Privasi & Normalisasi Salinan Deteksi
 * 2. Multi-Module Heuristic Examination dengan Context Guards
 * 3. Combo Multiplier Calculation
 * 4. Action & Explanation Mapping
 */
export function scanText(rawText) {
  if (!rawText || rawText.trim() === "") {
    return null;
  }

  // Tahap 1: Sensor Privasi Otomatis (Auto-Redaction)
  const { sanitizedText, redactions } = scrubPrivacy(rawText);

  // Tahap 1b: Salinan Khusus Normalisasi Regex (Teks asli tampilan tetap sanitizedText)
  const { normalizedText, tokenMap } = normalizeForDetection(sanitizedText);

  const engineResults = [];
  const highlightedEvidence = [];
  let totalRawScore = 0;
  const triggeredIds = new Set();

  const sentences = splitSentences(normalizedText);
  const upfrontFeeEvidenceSentences = [];

  // Helper pemeta bukti ke token asli sebelum normalisasi
  const mapWithOriginals = (words) => {
    if (!words || words.length === 0 || tokenMap.length === 0) return words;
    const res = [...words];
    for (const w of words) {
      const wLower = w.toLowerCase();
      for (const t of tokenMap) {
        const normLower = t.normalized.toLowerCase();
        if (wLower.includes(normLower) || normLower.includes(wLower)) {
          res.push(t.original);
        }
      }
    }
    return Array.from(new Set(res));
  };

  // Tahap 2: Pemeriksaan Seluruh Modul Modus Penipuan
  for (const engine of HEURISTIC_ENGINES) {
    const evidenceList = [];
    const matchedPatterns = [];

    if (engine.inspectUrl) {
      // Modul Khusus: Phishing Link & Domain Inspector (Gunakan sanitizedText asli agar URL tidak rusak)
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
    } else if (engine.id === "family_impersonation") {
      // Modul Khusus: Family Impersonation (Wajib Co-occurrence Dua Kelompok)
      // Kelompok A: nomor baru, ganti nomor, hp rusak/hilang, anakmu, darurat, rumah sakit, kecelakaan
      // Kelompok B: pulsa, transfer, kirim uang, talangin, pinjam uang, rekening
      const matchedA = [];
      const matchedB = [];

      for (const item of engine.groupA) {
        const m = normalizedText.match(item.pattern);
        if (m) {
          matchedA.push(...m);
          matchedPatterns.push(item.label);
        }
      }

      for (const item of engine.groupB) {
        const m = normalizedText.match(item.pattern);
        if (m) {
          matchedB.push(...m);
          matchedPatterns.push(item.label);
        }
      }

      if (matchedA.length > 0 && matchedB.length > 0) {
        const combined = mapWithOriginals([...matchedA, ...matchedB]);
        for (const word of combined) {
          evidenceList.push(word);
          highlightedEvidence.push({
            text: word,
            engineId: engine.id,
            engineName: engine.name,
            reason: "Pola penyamaran kerabat meminta uang atau pulsa darurat"
          });
        }
      }
    } else if (engine.id === "illegal_loan") {
      // Modul Khusus: Pinjol Ilegal (Minimal Dua Pola Cocok)
      const matchedRules = [];
      for (const rule of engine.rules) {
        const m = normalizedText.match(rule.pattern);
        if (m) {
          matchedRules.push({ rule, matches: m });
        }
      }

      if (matchedRules.length >= 2) {
        for (const item of matchedRules) {
          matchedPatterns.push(item.rule.label);
          const mappedWords = mapWithOriginals(item.matches);
          for (const word of mappedWords) {
            evidenceList.push(word);
            highlightedEvidence.push({
              text: word,
              engineId: engine.id,
              engineName: engine.name,
              reason: item.rule.label
            });
          }
        }
      }
    } else if (engine.id === "identity_mismatch") {
      // Modul Khusus: Identity & Channel Mismatch
      // Hanya tandai brand/instansi jika juga ditemukan saluran tidak resmi
      const unofficialChannelPatterns = [
        /@gmail\.com|@yahoo\.com|@hotmail\.com/gi,
        /ke\s+wa\s+ini|via\s+whatsapp\s+ini|hubungi\s+wa/gi,
        /rekening\s+bendahara|rekening\s+pribadi|rekening\s+admin/gi,
        /nomor\s+pribadi|nomor\s+ini\s+saja|chat\s+ini/gi,
        /travel\s+rekanan|mitra\s+kami\s+ini/gi,
      ];
      const hasUnofficialChannel = unofficialChannelPatterns.some(
        (pat) => pat.test(normalizedText)
      );

      for (const rule of engine.rules) {
        for (const sentence of sentences) {
          const isBrandRule =
            rule.label.includes("BUMN") ||
            rule.label.includes("Bank Nasional") ||
            rule.label.includes("Instansi");

          if (!isBrandRule || hasUnofficialChannel) {
            const matches = sentence.match(rule.pattern);
            if (matches) {
              const mappedMatches = mapWithOriginals(matches);
              for (const m of mappedMatches) {
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
      }
    } else {
      // Modul Berbasis Pola Kalimat / Regex Standar
      for (const rule of engine.rules) {
        for (const sentence of sentences) {
          // Abaikan kalimat peringatan/edukasi resmi untuk apk_otp_harvester dan upfront_fee
          if (
            (engine.id === "apk_otp_harvester" || engine.id === "upfront_fee") &&
            isEducationalWarningSentence(sentence)
          ) {
            continue;
          }

          const matches = sentence.match(rule.pattern);
          if (matches) {
            const mappedMatches = mapWithOriginals(matches);
            for (const m of mappedMatches) {
              evidenceList.push(m);
              highlightedEvidence.push({
                text: m,
                engineId: engine.id,
                engineName: engine.name,
                reason: rule.label
              });
            }
            matchedPatterns.push(rule.label);

            if (engine.id === "upfront_fee") {
              upfrontFeeEvidenceSentences.push(sentence);
            }
          }
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

  // Evaluasi Khusus: Abaikan upfront_fee jika berada di kanal resmi
  // dan tidak ada desakan waktu (urgency) maupun ketidakcocokan identitas (channel mismatch)
  if (triggeredIds.has("upfront_fee")) {
    const hasUrgency = triggeredIds.has("artificial_urgency");
    const hasIdentityMismatch = triggeredIds.has("identity_mismatch");

    if (!hasUrgency && !hasIdentityMismatch) {
      const allOfficial =
        upfrontFeeEvidenceSentences.length > 0 &&
        upfrontFeeEvidenceSentences.every((s) => isOfficialChannelSentence(s));

      if (allOfficial) {
        triggeredIds.delete("upfront_fee");
        totalRawScore = Math.max(0, totalRawScore - 30);

        const upfrontResult = engineResults.find((e) => e.id === "upfront_fee");
        if (upfrontResult) {
          upfrontResult.status = "CLEAN";
          upfrontResult.score = 0;
          upfrontResult.evidence = [];
          upfrontResult.patterns = [];
        }

        // Hapus temuan upfront_fee dari highlightedEvidence
        for (let i = highlightedEvidence.length - 1; i >= 0; i--) {
          if (highlightedEvidence[i].engineId === "upfront_fee") {
            highlightedEvidence.splice(i, 1);
          }
        }
      }
    }
  }

  // Evaluasi Khusus: Abaikan apk_otp_harvester jika pesan adalah notifikasi SMS OTP resmi asli
  // Aturan: pesan memuat kode OTP DAN kalimat larangan membagikan DAN tidak ada tautan,
  // tidak ada permintaan mengirim kode, tidak ada .apk
  if (triggeredIds.has("apk_otp_harvester")) {
    const hasOtp =
      /(?:kode\s*otp|otp\b|kode\s*verifikasi|pin\s*6\s*digit)/i.test(normalizedText) ||
      /\[KODE_OTP_DISAMARKAN\]/.test(sanitizedText) ||
      redactions.includes("Kode OTP / PIN Transaksi");

    const hasSharingProhibition = sentences.some((s) => isSharingProhibitionSentence(s));

    const linkFindings = inspectLinksInText(sanitizedText);
    const hasLinks =
      linkFindings.length > 0 ||
      /https?:\/\/|www\.|\.xyz\b|\.top\b|bit\.ly/i.test(sanitizedText);

    const hasApk = /\.apk\b/i.test(sanitizedText);

    const hasRequestToSendCode = sentences.some((s) => isRequestToSendCodeSentence(s));

    const isLegitOtpNotification =
      hasOtp &&
      hasSharingProhibition &&
      !hasLinks &&
      !hasApk &&
      !hasRequestToSendCode;

    if (isLegitOtpNotification) {
      triggeredIds.delete("apk_otp_harvester");
      totalRawScore = Math.max(0, totalRawScore - 40);

      const otpResult = engineResults.find((e) => e.id === "apk_otp_harvester");
      if (otpResult) {
        otpResult.status = "CLEAN";
        otpResult.score = 0;
        otpResult.evidence = [];
        otpResult.patterns = [];
      }

      // Hapus temuan apk_otp_harvester dari highlightedEvidence
      for (let i = highlightedEvidence.length - 1; i >= 0; i--) {
        if (highlightedEvidence[i].engineId === "apk_otp_harvester") {
          highlightedEvidence.splice(i, 1);
        }
      }
    }
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

  // Kombinasi Maut 3: APK / OTP + Catut Nama Instansi
  if (triggeredIds.has("apk_otp_harvester") && (triggeredIds.has("identity_mismatch") || triggeredIds.has("phishing_link"))) {
    comboBonus += 0.35;
    combosTriggered.push("Pola Pembajakan Akun Perbankan / Trojan APK dengan Kedok Instansi Resmi");
  }

  // Kombinasi Maut 4: Penyamaran Kerabat + Uang Muka atau Urgensi
  if (
    triggeredIds.has("family_impersonation") &&
    (triggeredIds.has("upfront_fee") || triggeredIds.has("artificial_urgency"))
  ) {
    comboBonus += 0.3;
    combosTriggered.push("Pola Penyamaran Kerabat Disertai Desakan Finansial atau Kondisi Darurat");
  }

  // Kombinasi Maut 5: Pinjol Ilegal + Pemerasan Kontak
  if (triggeredIds.has("illegal_loan") && triggeredIds.has("threat_extortion")) {
    comboBonus += 0.3;
    combosTriggered.push("Pola Jeratan Pinjol Ilegal Disertai Pemerasan dan Ancaman Kontak");
  }

  // Kombinasi Maut 6: Investasi Bodong + Setoran Uang Muka
  if (triggeredIds.has("investment_scam") && triggeredIds.has("upfront_fee")) {
    comboBonus += 0.3;
    combosTriggered.push("Pola Investasi Bodong Berkedok Setoran Modal atau Biaya Registrasi");
  }

  let finalScore = Math.min(100, Math.round(totalRawScore * comboBonus));

  // Tentukan Level Risiko
  let riskLevel = "TIDAK TERDETEKSI";
  let riskColor = "emerald";
  if (finalScore >= 70) {
    riskLevel = "RISIKO TINGGI (BANYAK TANDA BAHAYA TERDETEKSI)";
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
  if (triggeredIds.has("family_impersonation")) {
    recommendedActions.push("Telepon langsung nomor lama kerabat untuk verifikasi suara sebelum mengirimkan pulsa atau uang. Jangan percaya nomor baru.");
  }
  if (triggeredIds.has("illegal_loan")) {
    recommendedActions.push("Jangan berikan izin akses kontak, galeri, atau kamera kepada aplikasi pinjaman. Pinjol berizin resmi OJK dilarang menuntut akses data tersebut.");
  }
  if (triggeredIds.has("threat_extortion")) {
    recommendedActions.push("Jangan penuhi ancaman tebusan pelaku. Amankan bukti percakapan dan segera laporkan ke kanal resmi kepolisian di patrolisiber.id.");
  }
  if (triggeredIds.has("investment_scam")) {
    recommendedActions.push("Periksa legalitas entitas di Satgas Pasti OJK (kontak 157). Jangan transfer modal investasi ke rekening pribadi di grup chat.");
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
