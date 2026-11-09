import React from "react";
import { AlertCircle, Lock, ShieldCheck } from "lucide-react";

export default function PrivacyBanner() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Jaminan Privasi 100% Sisi Klien (Local-First Architecture)
              <span className="text-[10px] bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 px-2 py-0.5 rounded-full font-medium">
                Zero Data Stored
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Teks obrolan yang Anda tempel dianalisis langsung di peramban (browser) Anda menggunakan JavaScript lokal. Nomor rekening, NIK, dan OTP otomatis disensor sebelum evaluasi. Data Anda tidak pernah dikirim, disimpan, atau dicatat ke server luar mana pun.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer Resmi Juknis */}
      <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Batasan & Disclaimer: </strong>
          TrustTrap Guardian adalah alat bantu analisis berbasis aturan heuristik (explainable rules) dan rekayasa sosial untuk meningkatkan kewaspadaan publik. Hasil analisis bukan merupakan jaminan mutlak 100% kebenaran hukum. Selalu gunakan pertimbangan akal sehat dan verifikasi ke kanal resmi berwenang.
        </p>
      </div>
    </div>
  );
}
