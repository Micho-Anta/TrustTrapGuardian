import React, { useState } from "react";
import { Check, Copy, MessageCircle, Share2, ShieldAlert } from "lucide-react";
import Disclosure from "../ui/Disclosure";

// Defang URLs agar link aktif tidak tersebar lewat pesan salin
function defangUrls(text) {
  return text
    .replace(/http/g, "hxxp")
    .replace(/\.xyz/g, "[.]xyz")
    .replace(/\.top/g, "[.]top")
    .replace(/\.click/g, "[.]click")
    .replace(/\.site/g, "[.]site")
    .replace(/\.vip/g, "[.]vip")
    .replace(/\.online/g, "[.]online")
    .replace(/\.cfd/g, "[.]cfd");
}

export default function WarningCard({ scanResult }) {
  const [copied, setCopied] = useState(false);

  if (!scanResult) {
    return (
      <div className="glass-card p-8 sm:p-10 text-center text-slate-400 space-y-3">
        <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
        <p className="text-sm sm:text-base leading-relaxed">
          Silakan lakukan analisis teks terlebih dahulu untuk membuat Kartu Peringatan WhatsApp.
        </p>
      </div>
    );
  }

  const { summary, engines } = scanResult;
  const dangerousEngines = engines.filter((e) => e.status === "DANGER");

  const rawShareText =
    `🚨 *PERINGATAN WASPADA PENIPUAN DIGITAL (TrustTrap Guardian)* 🚨\n\n` +
    `Tingkat Risiko: *${summary.riskLevel}* (Skor: ${summary.score}/100)\n` +
    `Modus Terdeteksi: ${dangerousEngines.map((e) => e.name).join(", ") || "Indikasi Manipulasi"}\n\n` +
    `⚠️ *TIGA LANGKAH PENCEGAHAN UTAMA:*\n` +
    `1. Jangan transfer uang/biaya admin ke rekening pribadi mana pun.\n` +
    `2. Jangan instal file ekstensi .APK atau berikan kode OTP 6-digit.\n` +
    `3. Jangan percaya ancaman pemblokiran dalam hitungan menit.\n\n` +
    `Lindungi keluarga Anda dari jeratan penipuan online!\n` +
    `🛡️ Dianalisis mandiri oleh *The Trust Trap Guardian*`;

  const formattedShareText = defangUrls(rawShareText);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(formattedShareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="glass-card p-6 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-[#5ab9fc]" />
            <span>Kartu Peringatan Siap Bagi (Guardian Family Share)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Format siap dibagikan ke grup WhatsApp keluarga atau kerabat untuk mencegah mereka menjadi korban berikutnya.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-ghost"
            >
              {copied ? <Check className="w-4 h-4 text-[#5ab9fc]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="btn-ascend"
              style={{
                background: "var(--accent)",
                color: "#0a0d14",
                fontWeight: 600,
                borderRadius: "999px",
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim ke WhatsApp</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-400 text-left sm:text-right max-w-sm leading-tight">
            Teks peringatan (tautan sudah didefang) baru dikirim ke WhatsApp ketika pengguna menekan tombol dan memilih penerima. Tidak ada data dikirim otomatis.
          </span>
        </div>
      </div>

      {/* Visual Kartu Peringatan (Collapsed by default inside Disclosure) */}
      <Disclosure
        icon={ShieldAlert}
        title="Pratinjau isi Kartu Peringatan"
        summary="Lihat detail buletin peringatan sebelum dibagikan ke WhatsApp"
        badge={
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
            style={
              summary.score >= 35
                ? { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)", color: "#fcd34d" }
                : { background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7" }
            }
          >
            Skor {summary.score}/100
          </span>
        }
        defaultOpen={false}
        panelClassName="pt-3"
      >
        <div
          className="max-w-xl mx-auto rounded-3xl p-6 sm:p-8 relative overflow-hidden"
          style={{
            background: "rgba(19, 24, 36, 0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(150, 175, 230, 0.14)",
            boxShadow: "0 25px 60px -20px rgba(0,0,0,0.75)",
          }}
        >
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block">
                    SECURITY ADVISORY BULLETIN
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    The Trust Trap: Digital Guardian
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shrink-0 inline-block"
                  style={
                    summary.score >= 70
                      ? { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)", color: "#fca5a5" }
                      : summary.score >= 35
                      ? { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)", color: "#fcd34d" }
                      : { background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7" }
                  }
                >
                  Skor Bahaya {summary.score}/100
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                <span>⚠️ Peringatan: {summary.riskLevel}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pesan yang Anda terima mengandung manipulasi psikologis khas sindikat penipuan digital Indonesia.
              </p>
            </div>

            {/* List of dangerous patterns */}
            {dangerousEngines.length > 0 && (
              <div
                className="space-y-2 p-4 rounded-2xl"
                style={{
                  background: "rgba(10, 13, 20, 0.50)",
                  border: "1px solid rgba(150, 175, 230, 0.08)",
                }}
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Modus Bahaya yang Teridentifikasi:
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {dangerousEngines.map((eng) => (
                    <li key={eng.id} className="flex items-start gap-2.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span className="leading-relaxed">
                        <strong className="text-slate-100 font-semibold">{eng.name}:</strong>{" "}
                        <span className="text-slate-300 [overflow-wrap:anywhere] break-words">{eng.explanation}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Golden Rules */}
            <div
              className="p-4 rounded-2xl text-xs sm:text-sm space-y-1.5 leading-relaxed"
              style={{
                background: "rgba(90, 185, 252, 0.05)",
                border: "1px solid rgba(90, 185, 252, 0.16)",
                color: "#cbd5e1",
              }}
            >
              <div className="font-bold text-[#5ab9fc]">Tiga Langkah Pencegahan Utama:</div>
              <div>1. Jangan pernah transfer uang ke rekening yang diminta.</div>
              <div>2. Jangan instal file berakhiran .APK apapun.</div>
              <div>3. Jangan serahkan kode OTP 6-digit SMS ke siapapun.</div>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}
