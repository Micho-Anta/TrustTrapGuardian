import React, { useState } from "react";
import { AlertOctagon, CheckSquare, ExternalLink, LifeBuoy, PhoneCall, ShieldCheck, Square } from "lucide-react";

export default function PanicTriage() {
  const [activeTab, setActiveTab] = useState("preventive"); // 'preventive' | 'emergency'
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (id) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const preventiveSteps = [
    {
      id: "prev-1",
      title: "Hentikan Komunikasi & Jangan Balas Chat",
      desc: "Penipu sering memanfaatkan teknik desakan psikologis lanjutan jika Anda terlihat ragu-ragu. Tahan diri dan jangan terpancing berdebat."
    },
    {
      id: "prev-2",
      title: "Cek Status Nomor Rekening di CekRekening.id",
      desc: "Periksa apakah nomor rekening pelaku sudah dilaporkan penipuan sebelumnya melalui portal resmi Kominfo: https://cekrekening.id"
    },
    {
      id: "prev-3",
      title: "Verifikasi Nomor Kontak di Aplikasi Getcontact / Truecaller",
      desc: "Lihat tag atau label nama yang diberikan pengguna lain terhadap nomor HP pengirim untuk mendeteksi rekam jejak penipuan."
    },
    {
      id: "prev-4",
      title: "Cross-Check ke Call Center Resmi Perusahaan",
      desc: "Jika mengatasnamakan rekrutmen BUMN atau promo Bank, cek langsung akun Instagram/Twitter centang biru atau website berakhiran .co.id / .go.id."
    }
  ];

  const emergencySteps = [
    {
      id: "emg-1",
      priority: "KRUSIAL (1-15 Menit Pertama)",
      title: "Segera Hubungi Call Center Bank Anda",
      desc: "Minta pemblokiran darurat rekening tujuan dan amankan rekening Anda sendiri. Semakin cepat Anda lapor, semakin besar peluang dana tertahan di rekening penampung."
    },
    {
      id: "emg-2",
      priority: "APLIKASI .APK TERLANJUR DIINSTAL",
      title: "Aktifkan Mode Pesawat (Airplane Mode) Segera!",
      desc: "Putuskan seluruh koneksi internet dan jaringan seluler agar malware .APK tidak dapat mengirim SMS OTP atau mencuri data kredensial Anda ke server penipu."
    },
    {
      id: "emg-3",
      priority: "GANTI PASSWORD & PIN",
      title: "Ganti Semua PIN Perbankan & Password Email dari Perangkat Lain",
      desc: "Gunakan HP atau laptop anggota keluarga lain yang aman untuk mengubah password email, m-Banking, dan e-wallet Anda."
    },
    {
      id: "emg-4",
      priority: "LAPOR HUKUM",
      title: "Buat Laporan Resmi di PatroliSiber.id & Kantor Polisi",
      desc: "Kumpulkan bukti screenshot chat, mutasi rekening, dan nomor telepon pelaku sebagai lampiran berkas laporan penipuan digital."
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header Panic Triage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-indigo-400" />
            Panduan Penyelamatan & Tindakan Darurat (Panic Triage)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pilih kondisi Anda saat ini untuk panduan langkah demi langkah yang terarah dan menenangkan.
          </p>
        </div>

        {/* Tab Switcher Kondisi */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("preventive")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "preventive"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Baru Terima Chat
          </button>
          <button
            onClick={() => setActiveTab("emergency")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "emergency"
                ? "bg-red-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            Terlanjur Klik / Transfer
          </button>
        </div>
      </div>

      {/* Checklist Interaktif */}
      <div className="space-y-3">
        {(activeTab === "preventive" ? preventiveSteps : emergencySteps).map((step) => {
          const isDone = !!completedSteps[step.id];
          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                isDone
                  ? "bg-emerald-950/20 border-emerald-800/40 opacity-75"
                  : activeTab === "emergency"
                  ? "bg-red-950/20 border-red-900/40 hover:border-red-700/60"
                  : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <button className="mt-0.5 text-indigo-400 shrink-0">
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </button>

              <div className="flex-1">
                {step.priority && (
                  <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 mb-1">
                    {step.priority}
                  </span>
                )}
                <h4 className={`text-sm font-semibold ${isDone ? "line-through text-slate-400" : "text-white"}`}>
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nomor Kontak Darurat Resmi Indonesia */}
      <div className="pt-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          Kanal Bantuan & Pelaporan Resmi Nasional
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="https://cekrekening.id"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between text-xs group"
          >
            <div>
              <div className="font-semibold text-white group-hover:text-indigo-300">CekRekening.id</div>
              <div className="text-[11px] text-slate-400">Blokir Rekening Bank Penipu</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
          </a>

          <a
            href="https://patrolisiber.id"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between text-xs group"
          >
            <div>
              <div className="font-semibold text-white group-hover:text-indigo-300">PatroliSiber.id</div>
              <div className="text-[11px] text-slate-400">Laporan Resmi Bareskrim Polri</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
          </a>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="font-semibold text-white">Call Center Halo BCA</div>
            <div className="text-[11px] text-emerald-400 font-mono">1500888 (24 Jam)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="font-semibold text-white">Call Center Mandiri / BRI</div>
            <div className="text-[11px] text-emerald-400 font-mono">14000 / 1500017</div>
          </div>
        </div>
      </div>
    </div>
  );
}
