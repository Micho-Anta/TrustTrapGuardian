import React, { useState } from "react";
import {
  Award,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  XCircle,
  ArrowRight,
  BookOpen,
  DollarSign,
  Clock,
  Briefcase,
  Smartphone,
  Landmark,
  Globe,
  Users,
  CreditCard,
  AlertOctagon,
  TrendingUp
} from "lucide-react";

const THREAT_MATRIX = [
  {
    id: "upfront_fee",
    title: "1. Upfront Fee & Deposit Trap",
    category: "Financial Manipulation",
    icon: DollarSign,
    color: "#f59e0b",
    tactic: "Memanfaatkan sunk cost fallacy & harapan palsu korban dengan meminta komitmen finansial kecil di awal sebelum menuntut nominal berlipat ganda.",
    trigger: "Biaya reservasi, biaya materai, deposit tugas, modal jaminan",
    countermeasure: "Prinsip Zero-Advance-Payment: Rekrutmen & undian resmi tidak pernah memungut biaya di muka."
  },
  {
    id: "artificial_urgency",
    title: "2. Artificial Urgency & Fear",
    category: "Psychological Manipulation",
    icon: Clock,
    color: "#ef4444",
    tactic: "Memicu respons fight-or-flight korban melalui batas waktu sempit (5-15 menit) atau ancaman pemblokiran akun/denda agar nalar kritis lumpuh.",
    trigger: "Dalam 15 menit, sebelum kuota hangus, akun akan dibekukan, denda",
    countermeasure: "Rule of 30 Minutes: Tunda setiap transaksi darurat minimal 30 menit dan diskusikan dengan orang terdekat."
  },
  {
    id: "unrealistic_reward",
    title: "3. Unrealistic Reward / Task Scam",
    category: "Deceptive Employment",
    icon: Briefcase,
    color: "#8b5cf6",
    tactic: "Mengeksploitasi greed bias & teknik foot-in-the-door melalui tugas sepele (like video YouTube/TikTok) dengan komisi fantastis untuk memancing deposit bertingkat.",
    trigger: "Komisi harian Rp500rb - Rp2,5jt, kerja dari HP tanpa modal, misi VIP",
    countermeasure: "Realita Ekonomi: Tidak ada model bisnis legal yang membayar ratusan ribu rupiah untuk klik tombol like video."
  },
  {
    id: "apk_otp_harvester",
    title: "4. OTP & APK Harvester",
    category: "Malware & Credential Theft",
    icon: Smartphone,
    color: "#ec4899",
    tactic: "Menyamarkan file installer malware Android (.APK) sebagai surat undangan nikah, dokumen tilang, atau resi paket untuk menyadap SMS OTP perbankan.",
    trigger: "Undangan_Vip.apk, Surat_Paket.apk, sebutkan kode OTP 6-digit",
    countermeasure: "Aturan Mutlak Dokumen: Surat dan undangan digital resmi berbentuk link web, PDF, atau gambar, bukan file berekstensi .APK."
  },
  {
    id: "identity_mismatch",
    title: "5. Identity & Channel Mismatch",
    category: "Brand Impersonation",
    icon: Landmark,
    color: "#3b82f6",
    tactic: "Mengeksploitasi authority bias dengan mencatut nama & reputasi institusi besar (BUMN, Bank, Kantor Pajak) melalui saluran personal yang tidak resmi.",
    trigger: "WhatsApp personal, nomor seluler biasa, rekening bendahara panitia",
    countermeasure: "Verifikasi Saluran Resmi: Selalu hubungi call center resmi di balik kartu ATM atau cek akun resmi bercentang biru."
  },
  {
    id: "phishing_link",
    title: "6. Phishing Link & Domain Inspector",
    category: "Malicious Infrastructure",
    icon: Globe,
    color: "#06b6d4",
    tactic: "Menggunakan shortlink, domain murah berisiko (.xyz, .top), atau brand spoofing untuk mengelabui korban ke halaman login tiruan.",
    trigger: "bit.ly/xxx, bnn-klaim-gebyar.xyz, domain tiruan brand dengan karakter acak ber-entropy tinggi",
    countermeasure: "Inspeksi URL: Periksa domain induk (TLD) berakhiran resmi seperti .co.id, .id, atau .go.id sebelum memasukkan kredensial."
  },
  {
    id: "family_impersonation",
    title: "7. Family Impersonation / Urgensi Kerabat",
    category: "Social Engineering",
    icon: Users,
    color: "#10b981",
    tactic: "Menyamar sebagai anak atau keluarga yang mengaku ganti nomor HP atau dalam musibah darurat untuk meminta pulsa atau transfer uang kilat.",
    trigger: "Mah nomor baru, hp lama rusak, lagi darurat di rumah sakit, tolong kirimin pulsa/transfer",
    countermeasure: "Verifikasi Panggilan Suara: Segera telepon langsung nomor lama keluarga untuk memastikan identitas sebelum mengirimkan dana."
  },
  {
    id: "illegal_loan",
    title: "8. Pinjol Ilegal & Akses Data Sensitif",
    category: "Predatory Lending",
    icon: CreditCard,
    color: "#f97316",
    tactic: "Menjanjikan pinjaman kilat tanpa jaminan atau SLIK, namun memaksa izin akses kontak telepon dan galeri foto untuk sarana intimidasi.",
    trigger: "Pinjaman online cair 5 menit, tanpa jaminan/SLIK, izinkan akses kontak & galeri",
    countermeasure: "Batasan Akses OJK: Pinjol berizin resmi hanya diizinkan mengakses kamera, mikrofon, dan lokasi (CAMILAN), dilarang mengakses kontak dan galeri."
  },
  {
    id: "threat_extortion",
    title: "9. Ancaman & Pemerasan Kontak",
    category: "Coercion & Extortion",
    icon: AlertOctagon,
    color: "#ef4444",
    tactic: "Mengintimidasi korban dengan ancaman menyebarkan foto, video, atau data pribadi ke seluruh kontak keluarga jika tagihan tidak dilunasi hari ini.",
    trigger: "Bayar hari ini atau sebar foto dan kontak keluargamu, viralkan data",
    countermeasure: "Simpan Bukti & Laporkan: Jangan transfer tebusan karena pemerasan tidak akan berhenti. Amankan bukti tangkapan layar dan lapor ke patrolisiber.id."
  },
  {
    id: "investment_scam",
    title: "10. Investasi Bodong & Skema Ponzi",
    category: "Financial Fraud",
    icon: TrendingUp,
    color: "#a855f7",
    tactic: "Menjanjikan keuntungan berkala tidak wajar dengan klaim tanpa risiko, skema keanggotaan VIP, dan ajakan masuk ke grup chat tertutup.",
    trigger: "Profit 30% per minggu, dijamin cuan, member VIP, modal minimal, join grup telegram",
    countermeasure: "Prinsip 2L (Legal & Logis): Pastikan izin entitas terdaftar di OJK/Bappebti dan tolak tawaran investasi dengan imbal hasil tetap tidak realistis."
  }
];

export default function SpotTheTrap({ onTestInScanner }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Skenario 1: Undangan Pernikahan Digital via WA",
      chatPreview: "Halo Kak! Kami bermaksud mengundang ke acara pernikahan kami hari Minggu besok. Surat undangan lengkap ada di file ini ya, mohon kehadirannya: SuratUndanganDigital_Vip.apk. Ditunggu kedatangannya!",
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
          reason: "Kurang tepat. Nomor tidak dikenal tidak selalu berarti penipu, kerabat bisa ganti nomor. Ancaman nyata adalah ekstensi .APK yang digunakan sebagai 'undangan', bukan identitas pengirim semata."
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
      chatPreview: "Bro, ini nomor baruku. HP lamaku hilang kecopetan di stasiun. Aku lagi butuh banget dana darurat Rp 800.000 buat nebus obat di apotek, ATM-ku keblokir. Bisa tolong transfer ke rek temanku sekarang? Besok pagi langsung kuganti.",
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
    <div className="space-y-8 sm:space-y-10">
      {/* ── Section Kuis Interaktif ── */}
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

              {/* Tombol Uji Teks Ini di Scanner Tab 1 */}
              {typeof onTestInScanner === "function" && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onTestInScanner(curr.chatPreview)}
                    className="text-xs text-[#5df0a8] hover:text-[#2fd38a] flex items-center gap-1.5 transition-all font-semibold px-3 py-1.5 rounded-full hover:bg-[#5df0a8]/10 border border-[#5df0a8]/25"
                    title="Bedah teks skenario ini langsung di Tab 1 (Recognize)"
                  >
                    <span>🔍 Uji Teks Ini di Scanner Tab 1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
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

      {/* Kamus Pola Manipulasi Rekayasa Sosial (Threat Matrix) */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#5df0a8]" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Kamus {THREAT_MATRIX.length} Pola Manipulasi Rekayasa Sosial (Threat Matrix)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Pemetaan taktik psikologis, kata pemicu, dan benteng pertahanan dari {THREAT_MATRIX.length} modul Scam Heuristic Engine.
              </p>
            </div>
          </div>
          <span
            className="text-[11px] font-mono px-3 py-1 rounded-full text-slate-300"
            style={{ background: "rgba(150, 175, 230, 0.08)", border: "1px solid rgba(150, 175, 230, 0.12)" }}
          >
            HCI &amp; Threat Intelligence
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {THREAT_MATRIX.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl space-y-3.5 transition-all flex flex-col justify-between"
                style={{
                  background: "rgba(12, 18, 38, 0.35)",
                  border: "1px solid rgba(150, 175, 230, 0.07)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-2 rounded-xl"
                        style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <span className="font-bold text-sm sm:text-base text-white">{item.title}</span>
                    </div>
                  </div>

                  <span
                    className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mb-2.5"
                    style={{ background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}25` }}
                  >
                    {item.category}
                  </span>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.tactic}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/[0.06] text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Kata/Pola Pemicu:</span>
                    <span className="text-slate-200 font-mono text-[11px] leading-relaxed">{item.trigger}</span>
                  </div>
                  <div className="p-2.5 rounded-xl" style={{ background: "rgba(4, 6, 15, 0.45)", border: "1px solid rgba(150, 175, 230, 0.05)" }}>
                    <span className="text-[#5df0a8] font-semibold block text-[11px] mb-0.5">🛡️ Benteng Pertahanan:</span>
                    <span className="text-slate-300 text-[11px] leading-relaxed">{item.countermeasure}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
