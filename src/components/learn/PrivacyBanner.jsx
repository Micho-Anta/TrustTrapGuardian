import React from "react";
import { AlertCircle, Lock } from "lucide-react";

export default function PrivacyBanner() {
  return (
    <div className="glass-card p-6 sm:p-8 space-y-5">
      <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-5">
        {/* Icon */}
        <div
          className="p-3 rounded-2xl shrink-0 mt-0.5"
          style={{
            background: "rgba(93, 240, 168, 0.08)",
            border: "1px solid rgba(93, 240, 168, 0.20)",
          }}
        >
          <Lock className="w-5 h-5 text-[#5df0a8]" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h4 className="text-sm sm:text-base font-bold text-white">
              Jaminan Privasi 100% Sisi Klien (Local-First Architecture)
            </h4>
            <span
              className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
              style={{
                background: "rgba(93, 240, 168, 0.08)",
                color: "var(--accent)",
                border: "1px solid rgba(93, 240, 168, 0.22)",
              }}
            >
              Zero Data Stored
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Teks obrolan yang Anda tempel dianalisis langsung di peramban (browser) Anda menggunakan JavaScript lokal.
            Nomor rekening, NIK, dan OTP otomatis disensor sebelum evaluasi.
            Data Anda tidak pernah dikirim, disimpan, atau dicatat ke server luar mana pun.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="pt-4 border-t border-white/[0.06] flex items-start gap-3 text-xs sm:text-sm text-slate-400"
      >
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300 font-semibold">Batasan &amp; Disclaimer: </strong>
          TrustTrap Guardian adalah alat bantu analisis berbasis aturan heuristik (explainable rules) dan rekayasa sosial
          untuk meningkatkan kewaspadaan publik. Hasil analisis bukan merupakan jaminan mutlak 100% kebenaran hukum.
          Selalu gunakan pertimbangan akal sehat dan verifikasi ke kanal resmi berwenang.
        </p>
      </div>
    </div>
  );
}
