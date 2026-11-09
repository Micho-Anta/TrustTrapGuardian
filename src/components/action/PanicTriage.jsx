import React, { useEffect, useState } from "react";
import {
  AlertOctagon,
  CheckCircle2,
  CheckSquare,
  ClipboardCopy,
  ExternalLink,
  LifeBuoy,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Square,
  Trophy
} from "lucide-react";
import {
  CRITICAL_ENGINES,
  EMERGENCY_STEPS,
  OFFICIAL_CHANNELS,
  PREVENTIVE_STEPS,
  REPORTING_DISCLAIMER,
  getTriggeredEngineIds,
  sortGuides
} from "../../data/actGuides";

/* ── Toast Notification Component ── */
function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl pointer-events-none"
      style={{
        transform: "translateX(-50%)",
        background: "linear-gradient(135deg, rgba(93,240,168,0.20), rgba(45,211,138,0.15))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(93,240,168,0.40)",
        color: "#5df0a8",
        boxShadow: "0 20px 60px -15px rgba(0,0,0,0.70), 0 0 30px -10px rgba(93,240,168,0.30)",
        animation: "fadeSlideUp 0.3s ease",
      }}
    >
      <CheckCircle2 className="w-5 h-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Panic Triage (tab ACT) — Ascend polished theme.
 * Props:
 *   scanResult — optional scan result object
 */
export default function PanicTriage({ scanResult = null }) {
  const triggeredEngines = getTriggeredEngineIds(scanResult);
  const recommendedActions = scanResult?.recommendedActions ?? [];
  const hasCritical = triggeredEngines.some((id) => CRITICAL_ENGINES.includes(id));
  const scanKey = triggeredEngines.join(",");

  const [activeTab, setActiveTab] = useState(hasCritical ? "emergency" : "preventive");
  const [completedSteps, setCompletedSteps] = useState({});
  const [reportCopied, setReportCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    setActiveTab(hasCritical ? "emergency" : "preventive");
    setCompletedSteps({});
  }, [scanKey, hasCritical]);

  const toggleStep = (id) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const steps = (activeTab === "preventive" ? PREVENTIVE_STEPS : EMERGENCY_STEPS)
    .map((s) => ({ ...s, relevant: !!s.engineId && triggeredEngines.includes(s.engineId) }))
    .sort((a, b) => Number(b.relevant) - Number(a.relevant));

  const doneCount = steps.filter((s) => completedSteps[s.id]).length;
  const allDone = steps.length > 0 && doneCount === steps.length;
  const progress = steps.length ? (doneCount / steps.length) * 100 : 0;
  const guides = sortGuides(triggeredEngines);

  // ── Copy Report Draft ──
  const handleCopyReport = () => {
    const now = new Date();
    const dateStr = now.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    const draft = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "📋 LAPORAN KEJADIAN PENIPUAN DIGITAL",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `Tanggal & Waktu Kejadian : ${dateStr} WIB`,
      `Modus Terdeteksi         : ${triggeredEngines.length > 0 ? triggeredEngines.join(", ") : "Tidak diketahui"}`,
      "",
      "KRONOLOGI SINGKAT:",
      "1. [Tuliskan kapan pertama kali dihubungi penipu]",
      "2. [Tuliskan apa yang diminta / ditawarkan penipu]",
      "3. [Tuliskan tindakan yang sudah dilakukan korban]",
      "4. [Tuliskan kerugian: nominal / data yang diserahkan]",
      "",
      "IDENTITAS PELAKU (jika diketahui):",
      "• Nama/Alias  : -",
      "• No. HP/WA   : -",
      "• No. Rekening: -",
      "• Link/URL    : -",
      "",
      "BUKTI YANG TERSEDIA:",
      "• Screenshot chat : Ada / Tidak",
      "• Bukti transfer  : Ada / Tidak",
      "• File .APK       : Ada / Tidak",
      "",
      "Diverifikasi oleh TrustTrap Guardian (trusttrapguardian.app)",
      "Laporkan ke: IASC OJK (157) | PatroliSiber.id | Polri (110)",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ].join("\n");

    navigator.clipboard.writeText(draft).then(() => {
      setReportCopied(true);
      setToastVisible(true);
      setTimeout(() => setReportCopied(false), 3000);
      setTimeout(() => setToastVisible(false), 3200);
    });
  };

  return (
    <>
      {/* ── Global Toast Notification ── */}
      <Toast message="✅ Format Laporan Berhasil Disalin ke Clipboard!" visible={toastVisible} />

      <div className="glass-card p-6 sm:p-8 space-y-8">

        {/* ── Anti-Shame / Calming Banner ── */}
        <div className="banner-calm flex items-start gap-3.5">
          <span className="text-2xl shrink-0 mt-0.5">🤝</span>
          <div>
            <p className="text-sm sm:text-base font-semibold mb-1 text-[#5df0a8]">
              Anda tidak sendirian &amp; jangan malu melapor.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Jutaan orang mengalami hal serupa. Penipu terlatih memanipulasi siapa pun.
              Fokus utama sekarang adalah <strong className="text-white font-semibold">mengamankan perangkat dan rekening Anda.</strong>
            </p>
          </div>
        </div>

        {/* ── Header & Tab Switcher ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
              <LifeBuoy className="w-5 h-5 text-[#5df0a8]" />
              <span>Panduan Penyelamatan &amp; Tindakan Darurat</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pilih kondisi Anda saat ini untuk panduan langkah demi langkah yang terarah.
            </p>
          </div>

          <div
            className="flex items-center p-1.5 rounded-full text-xs font-semibold self-start sm:self-auto"
            style={{ background: "rgba(12,18,38,0.50)", border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => setActiveTab("preventive")}
              className="px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5"
              style={
                activeTab === "preventive"
                  ? {
                      background: "linear-gradient(180deg, #5df0a8, #2fd38a)",
                      color: "var(--accent-on)",
                      boxShadow: "0 4px 16px -4px rgba(93,240,168,0.45)",
                    }
                  : { color: "var(--muted)" }
              }
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Baru Terima Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("emergency")}
              className="px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5"
              style={
                activeTab === "emergency"
                  ? {
                      background: "linear-gradient(180deg, #ef4444, #dc2626)",
                      color: "#fff",
                      boxShadow: "0 4px 16px -4px rgba(239,68,68,0.45)",
                    }
                  : { color: "var(--muted)" }
              }
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Terlanjur Klik / Transfer</span>
            </button>
          </div>
        </div>

        {/* ── 2 Flash Action Cards (Emergency only) ── */}
        {activeTab === "emergency" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Flash Card 1 — APK */}
            <div className="flash-card-urgent flex gap-3.5">
              <span className="text-2xl shrink-0 mt-0.5">⏱️</span>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider mb-1 text-red-400">
                  DETIK KE 0–30 (Jika Install .APK)
                </p>
                <p className="text-sm sm:text-base font-bold text-white mb-1">
                  Aktifkan Mode Pesawat &amp; Matikan Wi-Fi Sekarang!
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Putuskan koneksi agar malware tidak bisa mencuri OTP atau data perbankan Anda.
                  Lalu segera uninstall aplikasi asing tersebut.
                </p>
              </div>
            </div>

            {/* Flash Card 2 — OTP / Transfer */}
            <div className="flash-card-urgent flex gap-3.5">
              <span className="text-2xl shrink-0 mt-0.5">📞</span>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider mb-1 text-red-400">
                  MENIT KE 1–60 (Jika Kasih OTP / Transfer)
                </p>
                <p className="text-sm sm:text-base font-bold text-white mb-1">
                  Hubungi Call Center Resmi di Belakang Kartu ATM
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Minta blokir darurat rekening tujuan sebelum dana dicairkan. Waktu adalah segalanya dalam penyelamatan dana.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Scan Context ── */}
        {scanResult && (
          <div
            className="p-5 rounded-2xl space-y-2.5"
            style={{ background: "rgba(93,240,168,0.05)", border: "1px solid rgba(93,240,168,0.16)" }}
          >
            <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#5df0a8]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Dari Hasil Scan Anda</span>
              <span className="normal-case font-medium text-slate-400">
                · {triggeredEngines.length} modus terdeteksi
              </span>
            </p>
            {recommendedActions.length > 0 && (
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {recommendedActions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ── Progress Checklist ── */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Checklist · {doneCount}/{steps.length} selesai</span>
            <button
              onClick={() => setCompletedSteps({})}
              className="px-3 py-1 rounded-full text-xs normal-case tracking-normal flex items-center gap-1.5 transition-colors"
              style={{
                background: "rgba(150,175,230,0.06)",
                border: "1px solid rgba(150,175,230,0.10)",
                color: "var(--muted)",
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(150,175,230,0.08)" }}>
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${progress}%`,
                background: activeTab === "emergency"
                  ? "linear-gradient(90deg,#ef4444,#dc2626)"
                  : "linear-gradient(90deg,#5df0a8,#2fd38a)",
              }}
            />
          </div>
        </div>

        {/* ── ALL DONE: Success Appreciation Banner ── */}
        {allDone && (
          <div
            className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(93,240,168,0.08))",
              border: "1px solid rgba(16,185,129,0.35)",
              boxShadow: "0 0 40px -15px rgba(93,240,168,0.30)",
            }}
          >
            <div
              className="p-2.5 rounded-2xl shrink-0"
              style={{ background: "rgba(93,240,168,0.15)", border: "1px solid rgba(93,240,168,0.30)" }}
            >
              <Trophy className="w-6 h-6 text-[#5df0a8]" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-[#5df0a8] mb-1">
                🎉 Luar biasa! Semua langkah penyelamatan telah selesai.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Anda telah mengambil semua tindakan perlindungan yang tepat. Simpan bukti dan nomor laporan Anda.
                Lanjutkan pemantauan rekening selama 1×24 jam ke depan.
              </p>
            </div>
          </div>
        )}

        {/* ── Interactive Checklist ── */}
        <div className="space-y-3.5">
          {steps.map((step) => {
            const isDone = !!completedSteps[step.id];
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className="p-5 rounded-2xl cursor-pointer transition-all flex items-start gap-4 select-none"
                style={
                  isDone
                    ? { background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.20)", opacity: 0.8 }
                    : activeTab === "emergency"
                    ? { background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.20)" }
                    : { background: "rgba(12,18,38,0.30)", border: "1px solid rgba(150,175,230,0.06)" }
                }
              >
                <button className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-[#5df0a8]" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {step.priority && (
                      <span
                        className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full"
                        style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)" }}
                      >
                        {step.priority}
                      </span>
                    )}
                    {step.relevant && (
                      <span
                        className="inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full"
                        style={{ background: "rgba(93,240,168,0.10)", color: "var(--accent)", border: "1px solid rgba(93,240,168,0.22)" }}
                      >
                        Relevan dengan hasil scan
                      </span>
                    )}
                  </div>
                  <h4
                    className="text-sm sm:text-base font-bold"
                    style={{ color: isDone ? "var(--muted)" : "#ffffff", textDecoration: isDone ? "line-through" : "none" }}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm mt-1 text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Guide Per Fraud Mode ── */}
        <div className="pt-6 border-t border-white/[0.06]">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-slate-300">
            <LifeBuoy className="w-4 h-4 text-[#5df0a8]" />
            <span>Panduan Per Modus Penipuan</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((g) => (
              <div
                key={g.engineId}
                className="p-5 rounded-2xl text-xs sm:text-sm"
                style={
                  g.relevant
                    ? { background: "rgba(93,240,168,0.05)", border: "1px solid rgba(93,240,168,0.20)" }
                    : { background: "rgba(12,18,38,0.30)", border: "1px solid rgba(150,175,230,0.06)" }
                }
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h5 className="text-sm sm:text-base font-bold text-white">{g.title}</h5>
                  {g.relevant && (
                    <span
                      className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full"
                      style={{ background: "rgba(93,240,168,0.10)", color: "var(--accent)", border: "1px solid rgba(93,240,168,0.22)" }}
                    >
                      Relevan
                    </span>
                  )}
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-300 leading-relaxed">
                  {g.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p className="mt-3 text-xs text-slate-400">Siapkan: {g.docs.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Official Channels ── */}
        <div className="pt-6 border-t border-white/[0.06] space-y-5">
          <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-300">
            <PhoneCall className="w-4 h-4 text-[#5df0a8]" />
            <span>Kanal Bantuan &amp; Pelaporan Resmi Nasional</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {OFFICIAL_CHANNELS.map((c) =>
              c.href ? (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl transition-all flex items-start justify-between gap-2.5 text-xs group"
                  style={{ background: "rgba(12,18,38,0.35)", border: "1px solid rgba(150,175,230,0.06)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(93,240,168,0.30)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(150,175,230,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div>
                    <div className="font-bold text-white group-hover:text-[#5df0a8] transition-colors">{c.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.role}</div>
                    <div className="text-xs font-mono font-semibold mt-1.5 text-[#5df0a8]">{c.contact}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Siapkan: {c.prep}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-[#5df0a8] transition-colors mt-0.5" />
                </a>
              ) : (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl text-xs"
                  style={{ background: "rgba(12,18,38,0.35)", border: "1px solid rgba(150,175,230,0.06)" }}
                >
                  <div className="font-bold text-white">{c.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{c.role}</div>
                  <div className="text-xs font-mono font-semibold mt-1.5 text-[#5df0a8]">{c.contact}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Siapkan: {c.prep}</div>
                </div>
              )
            )}
          </div>

          {/* ── Copy Report Button (Mint Capsule) ── */}
          <div className="pt-2">
            <button
              onClick={handleCopyReport}
              className="btn-ascend w-full sm:w-auto"
              style={{
                background: "linear-gradient(180deg, #5df0a8, #2fd38a)",
                color: "#032018",
                fontWeight: 600,
                borderRadius: "999px",
                boxShadow: "0 10px 28px -6px rgba(93,240,168,0.45)",
              }}
            >
              <ClipboardCopy className="w-4 h-4" />
              <span>
                {reportCopied
                  ? "Format Laporan Tersalin!"
                  : "Salin Format Laporan Resmi (WA IASC OJK / Bank)"}
              </span>
            </button>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              {REPORTING_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
