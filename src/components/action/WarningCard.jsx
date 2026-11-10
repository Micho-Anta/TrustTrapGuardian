import React, { useState } from "react";
import { Check, Copy, MessageCircle, Share2, ShieldAlert } from "lucide-react";

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
            <Share2 className="w-5 h-5 text-[#5df0a8]" />
            <span>Kartu Peringatan Siap Bagi (Guardian Family Share)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Format siap dibagikan ke grup WhatsApp keluarga atau kerabat untuk mencegah mereka menjadi korban berikutnya.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="btn-ghost"
            >
              {copied ? <Check className="w-4 h-4 text-[#5df0a8]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="btn-ascend"
              style={{
                background: "linear-gradient(180deg, #5df0a8, #2fd38a)",
                color: "#032018",
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

      {/* Visual Kartu Peringatan (Preview Card) - Clean & Elegant */}
      <div
        className="max-w-xl mx-auto rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          background: "rgba(12, 18, 38, 0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(239, 68, 68, 0.20)",
          boxShadow: "0 25px 60px -20px rgba(0,0,0,0.75)",
        }}
      >
        {/* Soft Ambient glow */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-red-500/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 block">
                  SECURITY ADVISORY BULLETIN
                </span>
                <span className="text-sm sm:text-base font-extrabold text-white">
                  The Trust Trap: Digital Guardian
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-red-300 bg-red-500/10 border border-red-500/25 px-3 py-1 rounded-full">
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
                background: "rgba(4, 6, 15, 0.50)",
                border: "1px solid rgba(150, 175, 230, 0.06)",
              }}
            >
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Modus Bahaya yang Teridentifikasi:
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                {dangerousEngines.map((eng) => (
                  <li key={eng.id} className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold">•</span>
                    <span className="leading-relaxed">
                      <strong className="text-red-300 font-semibold">{eng.name}:</strong>{" "}
                      <span className="text-slate-300">{eng.explanation}</span>
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
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.20)",
              color: "#fca5a5",
            }}
          >
            <div className="font-bold text-red-300">Tiga Langkah Pencegahan Utama:</div>
            <div>1. Jangan pernah transfer uang ke rekening yang diminta.</div>
            <div>2. Jangan instal file berakhiran .APK apapun.</div>
            <div>3. Jangan serahkan kode OTP 6-digit SMS ke siapapun.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
