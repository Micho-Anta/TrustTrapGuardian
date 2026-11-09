import React, { useState } from "react";
import { Award, CheckCircle, HelpCircle, Lightbulb, RefreshCw, XCircle } from "lucide-react";

export default function SpotTheTrap() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Skenario 1: Undangan Pernikahan Digital via WA",
      chatPreview: "Halo Mas Micho! Kami bermaksud mengundang ke acara pernikahan kami hari Minggu besok. Surat undangan lengkap ada di file ini ya, mohon kehadirannya: SuratUndanganDigital_Vip.apk. Ditunggu kedatangannya!",
      sender: "Nomor Tidak Dikenal (+62 813-9821-xxxx)",
      question: "Mengapa pesan ini berbahaya dan merupakan jebakan rekayasa sosial?",
      options: [
        {
          id: "a",
          text: "Karena pengirimnya tidak mencantumkan tanggal jam pernikahan secara rinci.",
          isCorrect: false,
          reason: "Kurang tepat. Format teks yang tidak lengkap bukanlah ancaman keamanan utama."
        },
        {
          id: "b",
          text: "Karena menggunakan ekstensi file .APK yang merupakan malware pencuri SMS perbankan & OTP.",
          isCorrect: true,
          reason: "Tepat sekali! Dokumen undangan asli biasanya berbentuk link website atau file PDF/gambar, bukan file installer aplikasi Android (.APK) yang berbahaya."
        },
        {
          id: "c",
          text: "Karena pengirim menyapa menggunakan kata 'Halo Mas'.",
          isCorrect: false,
          reason: "Salah. Sapaan ramah adalah hal wajar, namun justru dimanfaatkan penipu untuk menurunkan kewaspadaan korban."
        }
      ]
    },
    {
      id: 2,
      title: "Skenario 2: Tawaran Kerja Freelance Like & Subscribe",
      chatPreview: "Selamat siang Kak! Kami dari PT Digital Agency membuka lowongan freelance paruh waktu. Cukup like 3 video YouTube per hari dapat Rp150.000. Untuk ambil tugas pertama, silakan deposit jaminan tugas Rp30.000 ke rekening admin.",
      sender: "HRD Global Talent (Akun WA Bisnis Palsu)",
      question: "Apa pola psikologis utama yang dimanfaatkan oleh penipu pada skenario ini?",
      options: [
        {
          id: "a",
          text: "Foot-in-the-door technique (meminta deposit kecil dulu sebelum menaikkan jumlah ke jutaan rupiah).",
          isCorrect: true,
          reason: "Tepat sekali! Scammer sengaja meminta deposit nominal kecil (Rp30-50rb) agar korban merasa aman. Setelah itu, korban ditagih jutaan rupiah dengan dalih 'buka penarikan dana'."
        },
        {
          id: "b",
          text: "Ancaman fisik dan pemerasan langsung.",
          isCorrect: false,
          reason: "Salah. Pada tahap awal, penipu task scam bersikap sangat sopan dan menjanjikan keuntungan manis."
        },
        {
          id: "c",
          text: "Pencurian identitas melalui nomor KTP.",
          isCorrect: false,
          reason: "Kurang tepat. Modus ini murni skema deposit uang bertingkat (Ponzi-like Task Scam)."
        }
      ]
    },
    {
      id: 3,
      title: "Skenario 3: Teman Dekat Pinjam Uang Mendesak",
      chatPreview: "Bro Micho, ini nomor baruku. HP lamaku hilang kecopetan di stasiun. Aku lagi butuh banget dana darurat Rp 800.000 buat nebus obat di apotek, ATM-ku keblokir. Bisa tolong transfer ke rek temanku sekarang? Besok pagi langsung kuganti.",
      sender: "Profil Foto Teman Lama tapi Nomor Baru",
      question: "Langkah terbaik apa yang wajib Anda lakukan sebelum mentransfer dana?",
      options: [
        {
          id: "a",
          text: "Langsung transfer karena merasa kasihan melihat teman mengalami musibah.",
          isCorrect: false,
          reason: "Sangat berbahaya! Rasa empati dan desakan darurat palsu adalah senjata utama penipu akun kloning."
        },
        {
          id: "b",
          text: "Telepon biasa (voice call) atau video call langsung ke nomor lama / hubungi kerabatnya untuk verifikasi identitas fisik.",
          isCorrect: true,
          reason: "Benar sekali! Selalu lakukan verifikasi suara atau video di luar chat teks saat ada teman/kerabat yang mendadak meminta transfer ke rekening atas nama orang lain."
        },
        {
          id: "c",
          text: "Kirim uang setengahnya saja agar risiko berkurang.",
          isCorrect: false,
          reason: "Salah. Tetap saja uang Anda akan hilang jika yang meminta adalah penipu."
        }
      ]
    }
  ];

  const handleSelect = (option) => {
    if (showExplanation) return;
    setSelectedOption(option);
    setShowExplanation(true);
    if (option.isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  const curr = scenarios[currentQuestion];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Simulasi Interaktif: Tebak Jebakan Chat (Spot The Trap)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Latih intuisi dan nalar kritis Anda menghadapi 3 skenario penipuan yang paling sering memakan korban di Indonesia.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
          Skenario {currentQuestion + 1} / {scenarios.length}
        </div>
      </div>

      {!quizFinished ? (
        <div className="space-y-5">
          {/* Tampilan Simulasi Chat WhatsApp */}
          <div className="max-w-lg mx-auto bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80 text-slate-400">
              <span className="font-semibold text-slate-300">{curr.sender}</span>
              <span className="text-[10px] text-emerald-400 font-medium">Online</span>
            </div>

            {/* Bubble Chat Scammer */}
            <div className="bg-slate-800/90 text-slate-100 p-3.5 rounded-2xl rounded-tl-sm text-xs sm:text-sm leading-relaxed border border-slate-700/60 shadow">
              {curr.chatPreview}
            </div>
          </div>

          {/* Pertanyaan */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              {curr.question}
            </h3>

            {/* Pilihan Jawaban */}
            <div className="space-y-2.5">
              {curr.options.map((option) => {
                const isSelected = selectedOption?.id === option.id;
                let btnStyle = "bg-slate-950 border-slate-800 hover:border-indigo-500/50 text-slate-200";

                if (showExplanation) {
                  if (option.isCorrect) {
                    btnStyle = "bg-emerald-950/40 border-emerald-500/80 text-emerald-200";
                  } else if (isSelected && !option.isCorrect) {
                    btnStyle = "bg-red-950/40 border-red-500/80 text-red-200";
                  } else {
                    btnStyle = "bg-slate-950/40 border-slate-900 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    disabled={showExplanation}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      {option.id.toUpperCase()}
                    </span>
                    <span className="flex-1 pt-0.5">{option.text}</span>
                    {showExplanation && option.isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {showExplanation && isSelected && !option.isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Penjelasan Edukasi setelah menjawab */}
          {showExplanation && (
            <div className="bg-indigo-950/30 border border-indigo-800/40 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Penjelasan Pola Rekayasa Sosial:
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedOption?.reason}
              </p>

              <div className="pt-2 text-right">
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow"
                >
                  {currentQuestion < scenarios.length - 1 ? "Skenario Berikutnya →" : "Lihat Hasil Akhir →"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Hasil Skor Akhir Kuis */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Simulasi Selesai! Skor Anda: {score} / {scenarios.length}
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {score === 3
              ? "Luar biasa! Nalar kritis Anda sangat tajam dalam mengenali celah manipulasi psikologis penipu digital."
              : "Bagus! Selalu ingat 3 pilar perlindungan: Tahan emosi, jangan klik .APK/link sembarangan, dan verifikasi silang langsung ke sumbernya."}
          </p>

          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Ulangi Simulasi Kuis
          </button>
        </div>
      )}
    </div>
  );
}
