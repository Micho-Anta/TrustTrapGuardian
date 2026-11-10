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
  TrendingUp,
  Heart
} from "lucide-react";
import Disclosure from "../ui/Disclosure";

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
  },
  {
    id: "romance_advance_fee",
    title: "11. Romance Scam & Biaya Kiriman Paket",
    category: "Emotional Manipulation",
    icon: Heart,
    color: "#f43f5e",
    tactic: "Mengeksploitasi kedekatan emosional dan profil fiktif luar negeri (dokter, militer, pilot) untuk memancing pengiriman hadiah mewah yang berujung permintaan biaya bea cukai.",
    trigger: "Dokter di Suriah/London, suka profilmu, ngobrol lebih dekat, kirim paket hadiah, butuh biaya bea cukai",
    countermeasure: "Prinsip Cek Fisik: Jangan pernah mentransfer biaya paket/hadiah ke orang asing yang belum pernah Anda temui secara fisik. Cek foto profil dengan pencarian gambar balik."
  }
];

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const INITIAL_SCENARIOS = [
  {
    id: 1,
    title: "Skenario 1: Undangan Seleksi Loker BUMN",
    sender: "Panitia Rekrutmen Bersama BUMN (Akun WA Bisnis)",
    chatPreview: "Selamat! Anda dinyatakan lolos seleksi administrasi BUMN PT Telekomunikasi Nusantara (Persero). Undangan interview offline di Jakarta tanggal 25. Wajib transfer biaya reservasi tiket & hotel Rp1.750.000 ke rekening Surya Travelindo dalam waktu 30 menit. Biaya diganti 100% saat registrasi.",
    question: "Apa tanda bahaya paling fatal yang membuktikan pesan ini adalah penipuan?",
    options: [
      {
        id: "s1-a",
        text: "Rekrutmen resmi instansi BUMN tidak pernah memungut biaya transportasi dan tidak menunjuk travel agent berbayar.",
        isCorrect: true,
        reason: "Tepat sekali! Seluruh proses rekrutmen BUMN resmi selalu gratis tanpa pungutan biaya reservasi tiket apa pun."
      },
      {
        id: "s1-b",
        text: "Karena lokasi wawancara diselenggarakan di Jakarta pada tanggal 25.",
        isCorrect: false,
        reason: "Kurang tepat. Lokasi dan jadwal wawancara adalah hal lumrah. Tanda bahaya fatalnya adalah pungutan biaya reservasi di muka."
      },
      {
        id: "s1-c",
        text: "Karena pengirim menggunakan format akun WhatsApp bisnis.",
        isCorrect: false,
        reason: "Salah. Akun bisnis biasa bisa dibuat siapa saja. Bukti penipuan kuncinya adalah jebakan uang di muka (upfront fee)."
      }
    ]
  },
  {
    id: 2,
    title: "Skenario 2: Lowongan Freelance Like & Subscribe",
    sender: "HRD Global Media Partner (Akun WA Personal)",
    chatPreview: "Halo Kak! Kami membuka lowongan freelance paruh waktu kerja dari HP tanpa modal. Cukup like 3 video YouTube dan follow TikTok dapat komisi Rp150.000 per hari. Untuk aktivasi akun dan ambil tugas perdana, silakan transfer deposit tugas Rp30.000 ke rekening admin.",
    question: "Taktik psikologis apa yang sedang dimanfaatkan oleh pelaku pada pesan ini?",
    options: [
      {
        id: "s2-a",
        text: "Foot-in-the-door technique (meminta deposit kecil dulu sebelum menuntut setoran jutaan rupiah).",
        isCorrect: true,
        reason: "Tepat sekali! Scammer sengaja meminta deposit awal yang kecil (Rp30-50rb) agar korban merasa aman sebelum menjerat ke deposit bertingkat jutaan rupiah."
      },
      {
        id: "s2-b",
        text: "Pencurian identitas melalui nomor KTP dan KK.",
        isCorrect: false,
        reason: "Kurang tepat. Pada pesan ini, modus utamanya adalah skema perputaran deposit bertingkat (task scam)."
      },
      {
        id: "s2-c",
        text: "Pemerasan langsung dengan intimidasi fisik.",
        isCorrect: false,
        reason: "Salah. Di awal interaksi, pelaku task scam bersikap sangat sopan dan menjanjikan imbalan manis."
      }
    ]
  },
  {
    id: 3,
    title: "Skenario 3: Kurir Ekspedisi & File APK Resi",
    sender: "Kurir Ekspedisi Nusantara Express",
    chatPreview: "Halo Kak, paket penting Anda tertahan di gudang transit karena alamat kurang lengkap. Mohon cek foto paket dan nomor resi di aplikasi pelacakan kami: Resi_Pengiriman_Paket.apk. Silakan instal sekarang di HP Android Anda.",
    question: "Mengapa pesan kurir ini sangat berbahaya bagi keamanan rekening dan data Anda?",
    options: [
      {
        id: "s3-a",
        text: "File berekstensi .APK adalah malware Android yang dapat membaca SMS OTP dan membajak mobile banking.",
        isCorrect: true,
        reason: "Benar sekali! Kurir ekspedisi resmi hanya memberikan nomor resi teks atau tautan situs resmi, tidak pernah membagikan file installer .APK."
      },
      {
        id: "s3-b",
        text: "Karena paketnya tertahan di gudang transit ekspedisi.",
        isCorrect: false,
        reason: "Paket tertahan adalah kendala pengiriman biasa. Bahaya kritisnya terletak pada file berekstensi .APK yang dikirimkan."
      },
      {
        id: "s3-c",
        text: "Karena kurir menghubungi via chat WhatsApp bukan telepon suara.",
        isCorrect: false,
        reason: "Kurir sering berkoordinasi lewat chat. Namun permintaan menginstal file .APK adalah ciri mutlak malware."
      }
    ]
  },
  {
    id: 4,
    title: "Skenario 4: Nomor Baru 'Keluarga' Minta Pulsa",
    sender: "Nomor Baru Mengaku Anak / Kerabat (+62 858-1234-xxxx)",
    chatPreview: "Mah ini aku pakai nomor baru, HP lamaku rusak jatuh di jalan. Tolong kirimin pulsa 200rb dulu ke nomor ini ya Mah, penting banget buat hubungi kantor, nanti sore aku ganti.",
    question: "Langkah penyelamatan pertama apa yang paling bijak dilakukan sebelum bertindak?",
    options: [
      {
        id: "s4-a",
        text: "Telepon biasa (voice call) langsung ke nomor lama anak untuk verifikasi suara sebelum mengirimkan pulsa.",
        isCorrect: true,
        reason: "Tepat sekali! Selalu lakukan konfirmasi suara atau video ke nomor lama kerabat untuk memastikan identitas sebelum mentransfer dana atau pulsa."
      },
      {
        id: "s4-b",
        text: "Langsung mengirimkan pulsa 200rb karena cemas anak mengalami kendala di kantor.",
        isCorrect: false,
        reason: "Sangat berisiko! Penipu memanfaatkan rasa panik dan kasih sayang keluarga agar korban bertindak tanpa nalar kritis."
      },
      {
        id: "s4-c",
        text: "Kirim pulsa setengahnya saja (100rb) untuk jaga-jaga.",
        isCorrect: false,
        reason: "Keliru. Jika pengirim adalah penipu, pulsa Anda tetap hilang dan penipu akan menuntut permintaan lainnya."
      }
    ]
  },
  {
    id: 5,
    title: "Skenario 5: Tawaran Pinjol Ilegal Minta Akses Kontak",
    sender: "Dana Cepat Kilat (SMS Blast)",
    chatPreview: "Butuh dana mendesak? Pinjaman online langsung cair Rp 10.000.000 tanpa jaminan, tanpa SLIK/BI Checking, proses 5 menit. Unduh aplikasi kami di link ini dan izinkan akses kontak telepon & galeri foto Anda.",
    question: "Mengapa permintaan izin akses kontak dan galeri foto merupakan tanda bahaya besar?",
    options: [
      {
        id: "s5-a",
        text: "Pinjol legal OJK dilarang mengakses kontak dan galeri. Data tersebut akan dipakai pinjol ilegal untuk teror dan pemerasan.",
        isCorrect: true,
        reason: "Tepat sekali! Fintech lending resmi berizin OJK hanya boleh mengakses kamera, mikrofon, dan lokasi (CAMILAN). Akses kontak dan galeri adalah sarana teror pinjol ilegal."
      },
      {
        id: "s5-b",
        text: "Karena bunga pinjaman yang ditawarkan terlalu murah.",
        isCorrect: false,
        reason: "Bunga pinjol ilegal justru sangat mencekik. Bahaya privasi fatalnya adalah penyedotan seluruh kontak telepon untuk intimidasi."
      },
      {
        id: "s5-c",
        text: "Karena proses pencairan dana memerlukan waktu 5 menit.",
        isCorrect: false,
        reason: "Proses cepat hanyalah pancingan pemasaran. Bahaya intinya adalah peretasan privasi kontak keluarga."
      }
    ]
  },
  {
    id: "s6",
    title: "Skenario 6: Tautan Brand Palsu (Domain Mirip)",
    sender: "Pusat Bantuan Akun Pelanggan (SMS / Chat)",
    chatPreview: "Peringatan Keamanan: Terdeteksi aktivitas login mencurigakan pada akun belanja Anda. Akun akan dibekukan permanen dalam 15 menit. Segera verifikasi kepemilikan akun Anda sekarang di https://shopee-id-verifikasi.example/login",
    question: "Bagaimana cara mengenali bahwa tautan pada pesan tersebut adalah situs phishing?",
    options: [
      {
        id: "s6-a",
        text: "Nama domain menggunakan embel-embel 'shopee-id-verifikasi' yang bukan domain resmi platform bersangkutan.",
        isCorrect: true,
        reason: "Benar sekali! Pelaku melakukan brand spoofing dengan menyelipkan nama merek di domain pihak ketiga. Domain resmi berakhiran .co.id atau .com resmi platform."
      },
      {
        id: "s6-b",
        text: "Karena tautan tersebut menggunakan protokol HTTPS.",
        isCorrect: false,
        reason: "Salah paham umum. Protokol HTTPS (ikon gembok) saat ini juga bisa dipakai situs phishing. Yang paling menentukan adalah nama domain induknya."
      },
      {
        id: "s6-c",
        text: "Karena peringatan dikirimkan pada malam hari.",
        isCorrect: false,
        reason: "Waktu pengiriman tidak menentukan keaslian. Tanda bahayanya adalah nama domain tiruan dan manipulasi urgensi 15 menit."
      }
    ]
  },
  {
    id: 7,
    title: "Skenario 7: Investasi Profit Harian & Grup Telegram",
    sender: "Mentor Trading Sukses (DM Telegram)",
    chatPreview: "Halo Kak! Mau penghasilan pasif modal minim? Join program investasi aset crypto kami, profit 35% per minggu dijamin cuan tanpa risiko rugi. Buka slot member VIP dengan modal awal Rp500.000. Gabung grup Telegram privat kami sekarang!",
    question: "Klaim apa pada tawaran ini yang melanggar prinsip dasar investasi legal?",
    options: [
      {
        id: "s7-a",
        text: "Janji imbal hasil tetap tinggi (35%/minggu) dengan klaim 'dijamin tanpa risiko' adalah ciri klasik skema Ponzi bodong.",
        isCorrect: true,
        reason: "Tepat sekali! Prinsip investasi legal adalah high return = high risk. Tidak ada investasi sah di dunia yang menjamin keuntungan pasti tanpa risiko kerugian."
      },
      {
        id: "s7-b",
        text: "Penggunaan media Telegram untuk sarana komunikasi.",
        isCorrect: false,
        reason: "Telegram hanyalah media perpesanan. Ciri penipuannya adalah iming-iming keuntungan fantastis yang dijamin tanpa risiko."
      },
      {
        id: "s7-c",
        text: "Karena modal awal yang disyaratkan sebesar Rp500.000.",
        isCorrect: false,
        reason: "Besaran modal bukan masalah utama. Masalah fatalnya adalah janji keuntungan tidak masuk akal yang disamarkan sebagai investasi resmi."
      }
    ]
  },
  {
    id: 8,
    title: "Skenario 8: Notifikasi Mutasi Transaksi Resmi Bank",
    sender: "Bank Nasional Nusantara (SMS Banking Resmi)",
    chatPreview: "BNN Notifikasi: Rekening 02390100xxxx telah menerima transfer dana masuk Rp 500.000 pada 10/11 08:30 WIB. Saldo akhir Rp 2.450.000. Hubungi call center resmi 150000 jika transaksi tidak Anda kenali.",
    question: "Bagaimana Anda menyikapi pesan notifikasi perbankan ini?",
    options: [
      {
        id: "s8-a",
        text: "Pesan ini adalah notifikasi resmi yang wajar (tidak meminta OTP, tidak ada tautan mencurigakan, dan tidak meminta transfer biaya).",
        isCorrect: true,
        reason: "Luar biasa! Nalar kritis Anda seimbang. Tidak semua pesan adalah penipuan. Notifikasi ini hanya memberi tahu transaksi masuk tanpa tautan berbahaya dan menyertakan hotline resmi."
      },
      {
        id: "s8-b",
        text: "Pasti penipuan karena menyebutkan nominal saldo rekening secara terbuka.",
        isCorrect: false,
        reason: "Kurang tepat. Notifikasi mutasi resmi SMS banking memang lazim memuat nominal dana masuk dan nomor rekening yang sebagian digitnya disamarkan."
      },
      {
        id: "s8-c",
        text: "Berbahaya karena mengarahkan nasabah menghubungi nomor telepon 150000.",
        isCorrect: false,
        reason: "Salah. Nomor 150000 adalah format hotline resmi perbankan nasional, bukan nomor seluler pribadi atau link phising."
      }
    ]
  }
];

export default function SpotTheTrap({ onTestInScanner }) {
  const [quizScenarios, setQuizScenarios] = useState(() =>
    INITIAL_SCENARIOS.map((s) => ({
      ...s,
      options: shuffleArray(s.options)
    }))
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

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
    if (currentQuestion < quizScenarios.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setQuizScenarios(
      INITIAL_SCENARIOS.map((s) => ({
        ...s,
        options: shuffleArray(s.options)
      }))
    );
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  const curr = quizScenarios[currentQuestion];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ── Section Kuis Interaktif ── */}
      <div className="glass-card p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.06] gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
              <Lightbulb className="w-5 h-5 text-[#5ab9fc]" />
              <span>Simulasi Interaktif: Tebak Jebakan Chat (Spot The Trap)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Latih intuisi dan nalar kritis Anda menghadapi {quizScenarios.length} skenario chat (termasuk pesan resmi) yang paling sering ditemui sehari-hari.
            </p>
          </div>

          <div
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full text-slate-300 self-start sm:self-auto"
            style={{ background: "rgba(19, 24, 36,0.40)", border: "1px solid var(--border)" }}
          >
            Skenario {currentQuestion + 1} / {quizScenarios.length}
          </div>
        </div>

        {!quizFinished ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Tampilan Simulasi Chat WhatsApp - Clean & Airy */}
            <div
              className="max-w-xl mx-auto rounded-3xl p-5 sm:p-6 space-y-3.5"
              style={{
                background: "rgba(10, 13, 20, 0.50)",
                border: "1px solid rgba(150, 175, 230, 0.08)",
              }}
            >
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06] text-slate-400">
                <span className="font-semibold text-slate-300">{curr.sender}</span>
                <span className="text-[11px] text-[#5ab9fc] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5ab9fc]"></span>
                  Online
                </span>
              </div>

              {/* Bubble Chat Scammer */}
              <div
                className="p-4 rounded-2xl rounded-tl-sm text-xs sm:text-sm leading-relaxed text-slate-100 [overflow-wrap:anywhere] break-words"
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
                    className="text-xs text-[#5ab9fc] hover:text-[#86cdfd] flex items-center gap-1.5 transition-all font-semibold px-3 py-1.5 rounded-full hover:bg-[#5ab9fc]/10 border border-[#5ab9fc]/25"
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
                <HelpCircle className="w-5 h-5 text-[#5ab9fc]" />
                <span>{curr.question}</span>
              </h3>

              {/* Pilihan Jawaban */}
              <div className="space-y-3">
                {curr.options.map((option, idx) => {
                  const isSelected = selectedOption?.id === option.id;
                  const letter = String.fromCharCode(65 + idx);
                  let bgStyle = "rgba(19, 24, 36, 0.35)";
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
                      bgStyle = "rgba(19, 24, 36, 0.15)";
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
                          e.currentTarget.style.borderColor = "rgba(90, 185, 252, 0.35)";
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
                        {letter}
                      </span>
                      <span className="flex-1 pt-0.5 leading-relaxed">{option.text}</span>
                      {showExplanation && option.isCorrect && (
                        <CheckCircle className="w-5 h-5 text-[#5ab9fc] shrink-0 mt-0.5" />
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
                  background: "rgba(90, 185, 252, 0.05)",
                  border: "1px solid rgba(90, 185, 252, 0.18)",
                }}
              >
                <div className="font-bold flex items-center gap-2 text-[#5ab9fc]">
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
                    <span>{currentQuestion < quizScenarios.length - 1 ? "Skenario Berikutnya →" : "Lihat Hasil Akhir →"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Hasil Skor Akhir Kuis */
          <div className="text-center py-10 space-y-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-[#5ab9fc]"
              style={{
                background: "rgba(90, 185, 252, 0.10)",
                border: "1px solid rgba(90, 185, 252, 0.25)",
              }}
            >
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Simulasi Selesai! Skor Anda: <span className="text-mint-gradient">{score} / {quizScenarios.length}</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
              {score >= 7
                ? "Luar biasa! Nalar kritis Anda sangat tajam dan seimbang dalam mengenali celah manipulasi psikologis sekaligus membedakan pesan resmi yang aman."
                : score >= 5
                ? "Bagus! Anda sudah memahami sebagian besar pola rekayasa sosial. Terus tingkatkan kehati-hatian pada detail domain dan izin akses data sensitif."
                : "Tetap waspada! Selalu ingat 3 pilar perlindungan: Tahan emosi, jangan klik .APK/link sembarangan, dan verifikasi silang langsung ke kanal resmi."}
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
            <BookOpen className="w-5 h-5 text-[#5ab9fc] shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Kamus {THREAT_MATRIX.length} Pola Manipulasi Rekayasa Sosial
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Ketuk pola untuk melihat taktik, pemicu, dan cara menghindarinya.
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

        <div className="space-y-2.5">
          {THREAT_MATRIX.map((item) => {
            const Icon = item.icon;
            return (
              <Disclosure
                key={item.id}
                icon={
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${item.color}15`,
                      color: item.color,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                }
                title={item.title}
                badge={
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold tracking-wide uppercase"
                    style={{
                      background: `${item.color}12`,
                      color: item.color,
                      border: `1px solid ${item.color}25`,
                    }}
                  >
                    {item.category}
                  </span>
                }
                buttonClassName="py-2.5 px-3.5"
                defaultOpen={false}
                panelClassName="pt-2"
              >
                <div
                  className="p-4 rounded-2xl space-y-3"
                  style={{
                    background: "rgba(19, 24, 36, 0.35)",
                    border: "1px solid rgba(150, 175, 230, 0.08)",
                  }}
                >
                  <p className="text-xs text-slate-300 leading-relaxed [overflow-wrap:anywhere] break-words">
                    {item.tactic}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-white/[0.05] text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-400">Trigger Phrases: </span>
                      <span className="text-red-300 font-mono [overflow-wrap:anywhere] break-words">{item.trigger}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Benteng Nalar: </span>
                      <span className="text-[#5ab9fc] [overflow-wrap:anywhere] break-words">{item.countermeasure}</span>
                    </div>
                  </div>
                </div>
              </Disclosure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
