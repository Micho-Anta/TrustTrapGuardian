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
          text: "Karena nomor pengirimnya tidak tersimpan di kontak kita sehingga pasti penipu.",
          isCorrect: false,
          reason: "Kurang tepat. Nomor tidak dikenal tidak selalu berarti penipu — kerabat bisa ganti nomor. Ancaman nyata adalah ekstensi .APK yang digunakan sebagai 'undangan', bukan identitas pengirim semata."
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
    <div className="glass-card p-6 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.06] gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
            <Lightbulb className="w-5 h-5 text-[#5df0a8]" />
            <span>Simulasi Interaktif: Tebak Jebakan Chat (Spot The Trap)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Latih intuisi dan nalar kritis Anda menghadapi 3 skenario penipuan yang paling sering memakan korban di Indonesia.
          </p>
        </div>

        <div
          className="text-xs font-semibold px-3.5 py-1.5 rounded-full text-slate-300 self-start sm:self-auto"
          style={{ background: "rgba(12,18,38,0.40)", border: "1px solid var(--border)" }}
        >
          Skenario {currentQuestion + 1} / {scenarios.length}
        </div>
      </div>

      {!quizFinished ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Tampilan Simulasi Chat WhatsApp - Clean & Airy */}
          <div
            className="max-w-xl mx-auto rounded-3xl p-5 sm:p-6 space-y-3.5"
            style={{
              background: "rgba(4, 6, 15, 0.50)",
              border: "1px solid rgba(150, 175, 230, 0.08)",
            }}
          >
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06] text-slate-400">
              <span className="font-semibold text-slate-300">{curr.sender}</span>
              <span className="text-[11px] text-[#5df0a8] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5df0a8]"></span>
                Online
              </span>
            </div>

            {/* Bubble Chat Scammer */}
            <div
              className="p-4 rounded-2xl rounded-tl-sm text-xs sm:text-sm leading-relaxed text-slate-100"
              style={{
                background: "rgba(30, 41, 69, 0.60)",
                border: "1px solid rgba(150, 175, 230, 0.10)",
              }}
            >
              {curr.chatPreview}
            </div>
          </div>

          {/* Pertanyaan */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-[#5df0a8]" />
              <span>{curr.question}</span>
            </h3>

            {/* Pilihan Jawaban */}
            <div className="space-y-3">
              {curr.options.map((option) => {
                const isSelected = selectedOption?.id === option.id;
                let bgStyle = "rgba(12, 18, 38, 0.35)";
                let borderStyle = "rgba(150, 175, 230, 0.07)";
                let textColor = "text-slate-200";

                if (showExplanation) {
                  if (option.isCorrect) {
                    bgStyle = "rgba(16, 185, 129, 0.08)";
                    borderStyle = "rgba(16, 185, 129, 0.35)";
                    textColor = "text-emerald-200";
                  } else if (isSelected && !option.isCorrect) {
                    bgStyle = "rgba(239, 68, 68, 0.08)";
                    borderStyle = "rgba(239, 68, 68, 0.35)";
                    textColor = "text-red-200";
                  } else {
                    bgStyle = "rgba(12, 18, 38, 0.15)";
                    borderStyle = "rgba(150, 175, 230, 0.03)";
                    textColor = "text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3.5 ${textColor}`}
                    style={{
                      background: bgStyle,
                      borderColor: borderStyle,
                    }}
                    onMouseEnter={(e) => {
                      if (!showExplanation) {
                        e.currentTarget.style.borderColor = "rgba(93, 240, 168, 0.35)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!showExplanation) {
                        e.currentTarget.style.borderColor = borderStyle;
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    <span
                      className="w-7 h-7 rounded-xl font-bold flex items-center justify-center shrink-0 text-xs"
                      style={{
                        background: "rgba(150, 175, 230, 0.08)",
                        color: "var(--accent)",
                      }}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <span className="flex-1 pt-0.5 leading-relaxed">{option.text}</span>
                    {showExplanation && option.isCorrect && (
                      <CheckCircle className="w-5 h-5 text-[#5df0a8] shrink-0 mt-0.5" />
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
            <div
              className="p-5 sm:p-6 rounded-2xl space-y-3.5 text-xs sm:text-sm"
              style={{
                background: "rgba(93, 240, 168, 0.05)",
                border: "1px solid rgba(93, 240, 168, 0.18)",
              }}
            >
              <div className="font-bold flex items-center gap-2 text-[#5df0a8]">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Penjelasan Pola Rekayasa Sosial:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedOption?.reason}
              </p>

              <div className="pt-2 text-right">
                <button
                  onClick={handleNext}
                  className="btn-ascend"
                >
                  <span>{currentQuestion < scenarios.length - 1 ? "Skenario Berikutnya →" : "Lihat Hasil Akhir →"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Hasil Skor Akhir Kuis */
        <div className="text-center py-10 space-y-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-[#5df0a8]"
            style={{
              background: "rgba(93, 240, 168, 0.10)",
              border: "1px solid rgba(93, 240, 168, 0.25)",
            }}
          >
            <Award className="w-10 h-10" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Simulasi Selesai! Skor Anda: <span className="text-mint-gradient">{score} / {scenarios.length}</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            {score === 3
              ? "Luar biasa! Nalar kritis Anda sangat tajam dalam mengenali celah manipulasi psikologis penipu digital."
              : "Bagus! Selalu ingat 3 pilar perlindungan: Tahan emosi, jangan klik .APK/link sembarangan, dan verifikasi silang langsung ke sumbernya."}
          </p>

          <div className="pt-3">
            <button
              onClick={handleRestart}
              className="btn-ascend"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ulangi Simulasi Kuis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
