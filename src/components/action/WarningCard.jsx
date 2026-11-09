import React, { useState } from "react";
import { Check, Copy, MessageCircle, Share2, ShieldAlert } from "lucide-react";

export default function WarningCard({ scanResult }) {
  const [copied, setCopied] = useState(false);

  if (!scanResult) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm">Silakan lakukan analisis teks terlebih dahulu untuk membuat Kartu Peringatan WhatsApp.</p>
      </div>
    );
  }

  const { summary, engines } = scanResult;
  const dangerousEngines = engines.filter((e) => e.status === "DANGER");

  const formattedShareText = `🚨 *PERINGATAN WASPADA PENIPUAN DIGITAL (TrustTrap Guardian)* 🚨\n\n` +
    `Tingkat Risiko: *${summary.riskLevel}* (Skor: ${summary.score}/100)\n` +
    `Modus Terdeteksi: ${dangerousEngines.map((e) => e.name).join(", ") || "Indikasi Manipulasi"}\n\n` +
    `⚠️ *JANGAN LAKUKAN:*\n` +
    `1. Jangan transfer uang/biaya admin ke rekening pribadi mana pun.\n` +
    `2. Jangan instal file ekstensi .APK atau berikan kode OTP 6-digit.\n` +
    `3. Jangan percaya ancaman pemblokiran dalam hitungan menit.\n\n` +
    `Lindungi keluarga Anda dari jeratan penipuan online!\n` +
    `🛡️ Dianalisis mandiri oleh *The Trust Trap Guardian*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(formattedShareText)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            Kartu Peringatan Siap Bagi (Guardian Family Share)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Format siap bagikan ke grup WhatsApp keluarga atau kerabat untuk mencegah mereka menjadi korban berikutnya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Tersalin!" : "Salin Teks"}
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            Kirim ke WhatsApp
          </button>
        </div>
      </div>

      {/* Visual Kartu Peringatan (Preview Card) */}
      <div className="max-w-xl mx-auto rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-red-500/40 p-6 shadow-2xl relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl -z-0"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 block">
                  SECURITY ADVISORY BULLETIN
                </span>
                <span className="text-sm font-extrabold text-white">
                  The Trust Trap: Digital Guardian
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">
                Skor Bahaya {summary.score}/100
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-1">
              ⚠️ Peringatan: {summary.riskLevel}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pesan yang Anda terima mengandung manipulasi psikologis khas sindikat penipuan digital Indonesia.
            </p>
          </div>

          {/* List of dangerous patterns */}
          {dangerousEngines.length > 0 && (
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Modus Bahaya yang Teridentifikasi:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {dangerousEngines.map((eng) => (
                  <li key={eng.id} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>
                      <strong className="text-red-300">{eng.name}:</strong> {eng.explanation}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Golden Rules */}
          <div className="p-3 bg-red-950/30 rounded-xl border border-red-800/40 text-xs text-red-200 space-y-1">
            <div className="font-bold text-red-300">Tiga Larangan Mutlak:</div>
            <div>1. Jangan pernah transfer uang ke rekening yang diminta.</div>
            <div>2. Jangan instal file berakhiran .APK apapun.</div>
            <div>3. Jangan serahkan kode OTP 6-digit SMS ke siapapun.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
