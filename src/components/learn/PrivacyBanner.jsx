import React from "react";
import { AlertCircle, Lock } from "lucide-react";
import Disclosure from "../ui/Disclosure";

export default function PrivacyBanner() {
  return (
    <div className="glass-card p-4 sm:p-6">
      <Disclosure
        icon={
          <div
            className="p-2.5 rounded-xl shrink-0"
            style={{
              background: "rgba(90, 185, 252, 0.08)",
              border: "1px solid rgba(90, 185, 252, 0.20)",
            }}
          >
            <Lock className="w-4 h-4 text-[#5ab9fc]" />
          </div>
        }
        title="Jaminan Privasi 100% Sisi Klien (Local-First Architecture)"
        summary="Analisis berjalan lokal di browser tanpa mengirim data ke server."
        badge={
          <span
            className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
            style={{
              background: "rgba(90, 185, 252, 0.08)",
              color: "var(--accent)",
              border: "1px solid rgba(90, 185, 252, 0.22)",
            }}
          >
            Zero Data Stored
          </span>
        }
        defaultOpen={false}
        buttonClassName="bg-transparent border-0 p-2 sm:p-2.5 hover:bg-white/[0.03]"
        panelClassName="pt-3"
      >
        <div className="space-y-4 pt-3 border-t border-white/[0.06] px-2">
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed [overflow-wrap:anywhere] break-words">
            Teks obrolan yang Anda tempel dianalisis langsung di peramban (browser) Anda menggunakan JavaScript lokal.
            Nomor rekening, NIK, dan OTP otomatis disensor sebelum evaluasi.
            Data Anda tidak pernah dikirim, disimpan, atau dicatat ke server luar mana pun.
          </p>

          <div className="pt-3 border-t border-white/[0.06] flex items-start gap-3 text-xs sm:text-sm text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed [overflow-wrap:anywhere] break-words">
              <strong className="text-slate-300 font-semibold">Batasan &amp; Disclaimer: </strong>
              TrustTrap Guardian adalah alat bantu analisis berbasis aturan heuristik (explainable rules) dan rekayasa sosial
              untuk meningkatkan kewaspadaan publik. Hasil analisis bukan merupakan jaminan mutlak 100% kebenaran hukum.
              Selalu gunakan pertimbangan akal sehat dan verifikasi ke kanal resmi berwenang.
            </p>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}
