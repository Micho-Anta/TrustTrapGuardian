import React, { useEffect, useState } from "react";
import {
  AlertOctagon,
  CheckSquare,
  ClipboardCopy,
  ExternalLink,
  LifeBuoy,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Square
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

/**
 * Panic Triage (tab ACT) — Ascend themed with UX audit upgrades.
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
      setTimeout(() => setReportCopied(false), 3000);
    });
  };

  return (
    <div className="glass-card p-6 space-y-6">

      {/* ── Anti-Shame / Calming Banner ── */}
      <div className="banner-calm flex items-start gap-3">
        <span className="text-2xl shrink-0">🤝</span>
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--accent)" }}>
            Anda tidak sendirian &amp; jangan malu melapor.
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            Jutaan orang mengalami hal serupa. Penipu terlatih memanipulasi siapa pun.
            Fokus utama sekarang adalah <strong style={{ color: "var(--ink)" }}>mengamankan perangkat dan rekening Anda.</strong>
          </p>
        </div>
      </div>

      {/* ── Header & Tab Switcher ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--ink)" }}>
            <LifeBuoy className="w-5 h-5" style={{ color: "var(--accent)" }} />
            Panduan Penyelamatan &amp; Tindakan Darurat
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Pilih kondisi Anda saat ini untuk panduan langkah demi langkah yang terarah.
          </p>
        </div>

        <div
          className="flex items-center p-1 rounded-full text-xs font-semibold"
          style={{ background: "rgba(4,6,15,0.60)", border: "1px solid var(--border)" }}
        >
          <button
            onClick={() => setActiveTab("preventive")}
            className="px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
            style={
              activeTab === "preventive"
                ? { background: "linear-gradient(180deg,#5df0a8,#2fd38a)", color: "var(--accent-on)", boxShadow: "0 4px 12px -4px rgba(93,240,168,0.5)" }
                : { color: "var(--muted)" }
            }
          >
            <ShieldCheck className="w-4 h-4" />
            Baru Terima Chat
          </button>
          <button
            onClick={() => setActiveTab("emergency")}
            className="px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
            style={
              activeTab === "emergency"
                ? { background: "linear-gradient(180deg,#ef4444,#b91c1c)", color: "#fff", boxShadow: "0 4px 12px -4px rgba(239,68,68,0.5)" }
                : { color: "var(--muted)" }
            }
          >
            <AlertOctagon className="w-4 h-4" />
            Terlanjur Klik / Transfer
          </button>
        </div>
      </div>

      {/* ── 2 Flash Action Cards (Emergency only) ── */}
      {activeTab === "emergency" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Flash Card 1 — APK */}
          <div className="flash-card-urgent flex gap-3">
            <span className="text-2xl shrink-0">⏱️</span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: "#f87171" }}>
                DETIK KE 0–30 (Jika Install .APK)
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--ink)" }}>
                Aktifkan Mode Pesawat &amp; Matikan Wi-Fi Sekarang!
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                Putuskan koneksi agar malware tidak bisa mencuri OTP atau data perbankan Anda.
                Lalu uninstall aplikasi asing tersebut.
              </p>
            </div>
          </div>

          {/* Flash Card 2 — OTP / Transfer */}
          <div className="flash-card-urgent flex gap-3">
            <span className="text-2xl shrink-0">📞</span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: "#f87171" }}>
                MENIT KE 1–60 (Jika Kasih OTP / Transfer)
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--ink)" }}>
                Hubungi Call Center Resmi di Belakang Kartu ATM
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                Minta blokir darurat rekening tujuan sebelum dana dicairkan. Waktu adalah segalanya.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Scan Context ── */}
      {scanResult && (
        <div
          className="p-4 rounded-xl space-y-2"
          style={{ background: "rgba(93,240,168,0.06)", border: "1px solid rgba(93,240,168,0.20)" }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: "var(--accent)" }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
            Dari Hasil Scan Anda
            <span className="normal-case font-medium" style={{ color: "var(--muted)" }}>
              · {triggeredEngines.length} modus terdeteksi
            </span>
          </p>
          {recommendedActions.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {recommendedActions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Progress Checklist ── */}
      <div className="space-y-2">
        <div
          className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          <span>Checklist · {doneCount}/{steps.length} selesai</span>
          <button
            onClick={() => setCompletedSteps({})}
            className="px-2 py-1 rounded-lg normal-case tracking-normal flex items-center gap-1 transition-colors"
            style={{ background: "rgba(150,175,230,0.08)", border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            <RotateCcw className="w-3 h-3" />
            Ulang
          </button>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(150,175,230,0.10)" }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: activeTab === "emergency"
                ? "linear-gradient(90deg,#ef4444,#b91c1c)"
                : "linear-gradient(90deg,#5df0a8,#2fd38a)",
            }}
          />
        </div>
      </div>

      {/* ── Interactive Checklist ── */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isDone = !!completedSteps[step.id];
          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className="p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 select-none"
              style={
                isDone
                  ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", opacity: 0.75 }
                  : activeTab === "emergency"
                  ? { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.28)" }
                  : { background: "rgba(150,175,230,0.04)", border: "1px solid var(--border)" }
              }
            >
              <button className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckSquare className="w-5 h-5" style={{ color: "#10b981" }} />
                ) : (
                  <Square className="w-5 h-5" style={{ color: "rgba(150,175,230,0.35)" }} />
                )}
              </button>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  {step.priority && (
                    <span
                      className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded"
                      style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.30)" }}
                    >
                      {step.priority}
                    </span>
                  )}
                  {step.relevant && (
                    <span
                      className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                      style={{ background: "rgba(93,240,168,0.12)", color: "var(--accent)", border: "1px solid rgba(93,240,168,0.28)" }}
                    >
                      Relevan dengan hasil scan
                    </span>
                  )}
                </div>
                <h4
                  className="text-sm font-semibold"
                  style={{ color: isDone ? "var(--muted)" : "var(--ink)", textDecoration: isDone ? "line-through" : "none" }}
                >
                  {step.title}
                </h4>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Guide Per Fraud Mode ── */}
      <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        <h4
          className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5"
          style={{ color: "var(--muted)" }}
        >
          <LifeBuoy className="w-4 h-4" style={{ color: "var(--accent)" }} />
          Panduan Per Modus Penipuan
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guides.map((g) => (
            <div
              key={g.engineId}
              className="p-4 rounded-xl text-xs"
              style={
                g.relevant
                  ? { background: "rgba(93,240,168,0.06)", border: "1px solid rgba(93,240,168,0.22)" }
                  : { background: "rgba(150,175,230,0.03)", border: "1px solid var(--border)" }
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <h5 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{g.title}</h5>
                {g.relevant && (
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{ background: "rgba(93,240,168,0.12)", color: "var(--accent)", border: "1px solid rgba(93,240,168,0.28)" }}
                  >
                    Relevan dengan hasil scan
                  </span>
                )}
              </div>
              <ol className="list-decimal pl-4 mt-2 space-y-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                {g.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="mt-3 text-[11px]" style={{ color: "rgba(150,175,230,0.45)" }}>Siapkan: {g.docs.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Official Channels ── */}
      <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        <h4
          className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5"
          style={{ color: "var(--muted)" }}
        >
          <PhoneCall className="w-4 h-4" style={{ color: "var(--accent)" }} />
          Kanal Bantuan &amp; Pelaporan Resmi Nasional
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OFFICIAL_CHANNELS.map((c) =>
            c.href ? (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl transition-all flex items-start justify-between gap-2 text-xs group"
                style={{ background: "rgba(4,6,15,0.60)", border: "1px solid var(--border)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(93,240,168,0.35)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div>
                  <div className="font-semibold" style={{ color: "var(--ink)" }}>{c.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>{c.role}</div>
                  <div className="text-[11px] font-mono mt-1" style={{ color: "var(--accent)" }}>{c.contact}</div>
                  <div className="text-[10px] mt-1" style={{ color: "rgba(150,175,230,0.45)" }}>Siapkan: {c.prep}</div>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--muted)" }} />
              </a>
            ) : (
              <div key={c.id} className="p-3 rounded-xl text-xs" style={{ background: "rgba(4,6,15,0.60)", border: "1px solid var(--border)" }}>
                <div className="font-semibold" style={{ color: "var(--ink)" }}>{c.name}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>{c.role}</div>
                <div className="text-[11px] font-mono mt-1" style={{ color: "var(--accent)" }}>{c.contact}</div>
                <div className="text-[10px] mt-1" style={{ color: "rgba(150,175,230,0.45)" }}>Siapkan: {c.prep}</div>
              </div>
            )
          )}
        </div>

        {/* ── Copy Report Button ── */}
        <div className="mt-4">
          <button
            onClick={handleCopyReport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm transition-all"
            style={{
              background: reportCopied
                ? "rgba(93,240,168,0.15)"
                : "rgba(93,240,168,0.08)",
              border: reportCopied
                ? "1px solid rgba(93,240,168,0.45)"
                : "1px solid rgba(93,240,168,0.25)",
              color: "var(--accent)",
            }}
            onMouseEnter={e => {
              if (!reportCopied) {
                e.currentTarget.style.background = "rgba(93,240,168,0.14)";
                e.currentTarget.style.borderColor = "rgba(93,240,168,0.40)";
              }
            }}
            onMouseLeave={e => {
              if (!reportCopied) {
                e.currentTarget.style.background = "rgba(93,240,168,0.08)";
                e.currentTarget.style.borderColor = "rgba(93,240,168,0.25)";
              }
            }}
          >
            <ClipboardCopy className="w-4 h-4" />
            {reportCopied
              ? "✅ Format Laporan Tersalin! Kirim ke WA IASC OJK / Bank"
              : "Salin Format Laporan Resmi (WA IASC OJK / Bank)"}
          </button>
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "rgba(150,175,230,0.45)" }}>
            {REPORTING_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
