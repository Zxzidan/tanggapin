import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calculator,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Coins,
    Copy,
    Download,
    Eye,
    FileCheck,
    FileSpreadsheet,
    FileText,
    GraduationCap,
    HelpCircle,
    Info,
    Layers,
    MessageSquare,
    PhoneCall,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
    WalletCards,
    X,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import TanggapinLogo from '@/components/tanggapin-logo';
import { cn } from '@/lib/utils';
import { dashboard, login } from '@/routes';

const DEMO_ROLES = [
    {
        id: 'kepala_sekolah',
        title: 'Kepala Sekolah',
        desc: 'Akses penuh eksekutif 11 modul, koordinasi darurat & evaluasi sekolah.',
        badge: 'Pengambil Kebijakan',
        icon: Shield,
    },
    {
        id: 'wali_kelas',
        title: 'Wali Kelas',
        desc: 'Monitoring absensi harian, pembinaan siswa & kontak wali murid rombel.',
        badge: 'Garis Depan Kelas',
        icon: GraduationCap,
    },
    {
        id: 'guru_bk',
        title: 'Guru BK',
        desc: 'Layanan konseling empatik, penanganan kasus mediasi & mitigasi ATS.',
        badge: 'Layanan Bimbingan Konseling',
        icon: ShieldAlert,
    },
    {
        id: 'bendahara',
        title: 'Bendahara Sekolah',
        desc: 'Rekonsiliasi SPP, verifikasi bukti bayar & bantuan afirmasi siswa.',
        badge: 'Keuangan & SPP',
        icon: Users,
    },
    {
        id: 'operator',
        title: 'Operator Sekolah',
        desc: 'Verifikasi residu data Dapodik, SK pengampu guru & sinkronisasi data.',
        badge: 'Verifikasi Data & Admin',
        icon: CheckCircle2,
    },
];

const BUSINESS_PILLARS = [
    {
        number: '01',
        title: 'Langganan B2B SaaS Sekolah (ARR)',
        desc: 'Model langganan tahunan/semester yang selaras dengan siklus pencairan Dana BOS (BOSP). Menghasilkan pendapatan berulang dengan churn rate sangat rendah karena menjadi database historis perkembangan siswa.',
        badge: 'Pilar Utama Pendapatan',
        icon: Layers,
    },
    {
        number: '02',
        title: 'WhatsApp Official Business Gateway',
        desc: 'Layanan add-on broadcast resmi centang hijau (verified BSP). Menghilangkan risiko nomor guru diblokir saat mengirim notifikasi absensi darurat, tunggakan SPP, dan surat undangan resmi bertanda-terima.',
        badge: 'Margin Tinggi & Add-on',
        icon: MessageSquare,
    },
    {
        number: '03',
        title: 'Agregator Yayasan & Cabang Dinas',
        desc: 'Lisensi Enterprise tingkat grup yayasan pendidikan (BPK Penabur, Muhammadiyah, Al-Azhar, Ma\'arif) dan Kantor Dinas Pendidikan untuk memantau data residu Dapodik & early warning ratusan sekolah serentak.',
        badge: 'Kontrak Multi-Unit',
        icon: Building2,
    },
    {
        number: '04',
        title: 'Bimtek Kepatuhan TPPK & Akreditasi',
        desc: 'Paket bimbingan teknis SOP sekolah ramah anak, pelatihan tim TPPK sesuai Permendikbudristek No. 46/2023, serta pemenuhan instrumen akreditasi mutu Rapor Pendidikan sekolah.',
        badge: 'Layanan Bernilai Tinggi',
        icon: ShieldCheck,
    },
];

const PRICING_PLANS = [
    {
        id: 'perintis',
        name: 'Paket Perintis',
        badge: 'Sekolah Berkembang',
        description: 'Ideal untuk sekolah skala dasar/perintis dengan kebutuhan sistem pendampingan awal.',
        monthlyPrice: 450000,
        annualMonthlyEquivalent: 360000,
        annualTotal: 4320000,
        annualSavings: 1080000,
        targetAudience: 'SD / SMP / Madrasah (< 300 Siswa)',
        features: [
            'Kapasitas s.d. 300 siswa & 10 rombel',
            'Modul Deteksi Sinyal & Early Warning',
            'Manajemen Kasus Konseling BK Dasar',
            'Pantauan Kesehatan Kelas per Rombel',
            'Notifikasi Komunikasi Orang Tua Dasar',
            'Draf Ringkasan Evaluasi Siswa Standar',
            'Ekspor Rekap Laporan Format Excel & PDF',
            '3 Akun Akses: Kepala Sekolah, Wali Kelas, Guru BK',
            'Dukungan Helpdesk via Email & Dokumentasi Lengkap',
            'Dokumen Kwitansi & BAST Standar BOS',
        ],
        highlight: false,
        ctaText: 'Pilih Paket Perintis',
    },
    {
        id: 'unggulan',
        name: 'Paket Unggulan',
        badge: 'Paling Diminati Sekolah',
        description: 'Solusi terlengkap 11 modul + AI Generator Rapor & Notifikasi WhatsApp Resmi ke Orang Tua.',
        monthlyPrice: 890000,
        annualMonthlyEquivalent: 712000,
        annualTotal: 8544000,
        annualSavings: 2136000,
        targetAudience: 'SMP / SMA / SMK Mandiri (s.d. 800 Siswa)',
        features: [
            'Semua fitur Paket Perintis tercakup',
            'Mengelola s.d. 35 Rombel / Kelas Aktif',
            'Pusat Kontrol Operator: Kelola Akun Wali Kelas, Bendahara & Kepsek',
            'Fitur AI: Generator Rapor Perkembangan Siswa Otomatis',
            'Kirim Rapor Langsung ke WhatsApp Ortu (Tanda Terima Sah)',
            'Sintesis AI: Narasi Karakter & Rekomendasi Pendampingan Rumah',
            'Kapasitas s.d. 800 Siswa Terintegrasi',
            '11 Modul Operasional Tanggapin Lengkap',
            'Modul Alur ATS (Anak Tidak Sekolah) & Satgas Kunjungan',
            'Deteksi Residu Data & Validasi Dapodik',
            'WhatsApp Official Gateway (Tanda Terima Baca Terverifikasi)',
            'Rekonsiliasi SPP Terpadu & Proteksi Siswa Afirmasi',
            'Modul Kesiapsiagaan Insiden & Tim TPPK Permendikbud 46/2023',
            '5 Akun Peran (+ Operator Dapodik & Bendahara Sekolah)',
            '1x Sesi Pelatihan Online Tim Sekolah (2 Jam Interaktif)',
            'Prioritas Support WhatsApp Fast-Response',
            'Paket Lengkap SPJ BOS: Surat Penawaran, BAST & E-Faktur',
        ],
        highlight: true,
        ctaText: 'Pilih Paket Unggulan',
    },
    {
        id: 'yayasan',
        name: 'Paket Yayasan & Dinas',
        badge: 'Multi-Sekolah & Korporasi',
        description: 'Pengawasan multi-unit terpusat untuk Yayasan Pendidikan, Pesantren Terpadu, atau Cabang Dinas.',
        monthlyPrice: 1850000,
        annualMonthlyEquivalent: 1480000,
        annualTotal: 17760000,
        annualSavings: 4440000,
        targetAudience: 'Grup Yayasan / Multi-Kampus (> 800 Siswa)',
        features: [
            'Semua fitur Paket Unggulan tercakup',
            'Kapasitas Kelas Tanpa Batas (Unlimited Rombel)',
            'Kapasitas Siswa Tanpa Batas (> 800 Siswa)',
            'Fitur AI: Batch Generator Rapor Siswa Seluruh Unit Sekolah',
            'Distribusi Rapor Massal Terjadwal ke WhatsApp Seluruh Orang Tua',
            'Master Dashboard Pengawasan Multi-Sekolah Terpusat',
            'Konsolidasi Residu Dapodik & Statistik ATS Lintas Unit',
            'Kustomisasi SOP & Alur Penanganan Insiden Sekolah',
            'Opsi Integrasi Presensi Mesin RFID / Kartu Pintar',
            'Dedicated Account Manager & Kunjungan Pendampingan On-site',
            'Perjanjian Kerahasiaan Data (NDA) & Jaminan SLA 99.9%',
            'Bimbingan Teknis Standarisasi TPPK & Sertifikat Kesiapsiagaan',
        ],
        highlight: false,
        ctaText: 'Konsultasi Yayasan & Dinas',
    },
];

const PRICING_FAQS = [
    {
        q: 'Apakah biaya langganan Tanggapin boleh dibiayai menggunakan Dana BOS / BOSP?',
        a: 'Tentu saja. Sesuai Permendikbudristek No. 63 Tahun 2023 tentang Petunjuk Teknis Pengelolaan BOSP, sekolah diperbolehkan mengalokasikan dana BOS reguler maupun kinerja pada komponen Pemeliharaan Sarana dan Prasarana (pengembangan/pemeliharaan sistem informasi sekolah berbasis teknologi) serta Komponen Administrasi Kegiatan Sekolah. Kami menyediakan seluruh kelengkapan administrasi SPJ mulai dari surat penawaran, BAST, kuitansi resmi, hingga faktur pajak.',
    },
    {
        q: 'Bagaimana mekanisme pembayaran jika disesuaikan dengan siklus pencairan Dana BOS?',
        a: 'Kami memahami bahwa sekolah menganggarkan operasional per termin pencairan Dana BOS (Tahap I di awal semester dan Tahap II di pertengahan tahun). Tanggapin menyediakan opsi penagihan per semester atau tahunan dengan jatuh tempo yang fleksibel mengikuti tanggal cairnya transfer kas daerah/rekening BOS sekolah.',
    },
    {
        q: 'Berapa lama proses implementasi dan integrasi data awal dari Dapodik?',
        a: 'Prosesnya instan dan mudah. Operator sekolah hanya perlu mengekspor daftar siswa dan rombongan belajar dari aplikasi Dapodik ke format Excel/CSV. Sistem Tanggapin siap mengimpor data tersebut dalam hitungan menit, dan sekolah dapat langsung beroperasi di hari yang sama.',
    },
    {
        q: 'Apakah ada biaya tersembunyi atau biaya per siswa tambahan?',
        a: 'Tidak ada. Biaya langganan Tanggapin bersifat flat per paket sekolah selama berada dalam batas kuota siswa. Tidak ada biaya instalasi server (karena berbasis cloud modern), tidak ada biaya lisensi per guru, dan semua pembaruan fitur (update modul) diberikan gratis selama masa aktif berlangganan.',
    },
    {
        q: 'Bagaimana dengan privasi data siswa dan kerahasiaan konseling guru BK?',
        a: 'Tanggapin dirancang dengan prinsip enkripsi ujung-ke-ujung dan kontrol hak akses ketat (Role-Based Access Control). Catatan rahasia konseling BK hanya dapat dibaca oleh Guru BK yang bersangkutan dan Kepala Sekolah, tanpa bisa diakses oleh staf lain. Kami tidak pernah membagikan atau menjual data sekolah kepada pihak ketiga.',
    },
    {
        q: 'Apakah sekolah mendapatkan pelatihan dan pendampingan untuk para guru?',
        a: 'Ya. Seluruh sekolah mitra mendapatkan akses ke dokumentasi panduan operasional, video tutorial langkah demi langkah, serta webinar orientasi interaktif bagi Kepala Sekolah, Wali Kelas, Guru BK, Operator, dan Bendahara.',
    },
    {
        q: 'Bagaimana cara kerja fitur AI Generator Rapor Siswa & pengiriman WhatsApp ke orang tua?',
        a: 'Asisten AI Tanggapin secara otomatis mengolah rekapitulasi presensi harian, tren keaktifan kelas, dan poin catatan kedisiplinan siswa menjadi narasi evaluasi karakter yang konstruktif dan rekomendasi pendampingan di rumah. Dokumen rapor resmi ini dapat langsung dikirim ke WhatsApp orang tua dengan satu klik, lengkap dengan tanda terima digital (acknowledgement) yang mencatat waktu baca orang tua secara sah.',
    },
];

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>()
        .props;

    // Interactive Preview State
    const [previewTab, setPreviewTab] = useState<
        'early_warning' | 'class_health' | 'cases' | 'communication'
    >('early_warning');
    const [interactiveActionDone, setInteractiveActionDone] = useState(false);
    const [isDemoRoleModalOpen, setIsDemoRoleModalOpen] = useState(false);

    // Business Model & Pricing State
    const [billingCycle, setBillingCycle] = useState<'annually' | 'monthly'>('annually');
    const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

    // ROI Calculator State
    const [roiStudentCount, setRoiStudentCount] = useState<number>(450);
    const [roiSchoolLevel, setRoiSchoolLevel] = useState<'SD' | 'SMP' | 'SMA' | 'SMK'>('SMA');

    // Proposal Generator Form State
    const [proposalSchoolName, setProposalSchoolName] = useState<string>('SMA Negeri 1 Prestasi');
    const [proposalLevel, setProposalLevel] = useState<string>('SMA');
    const [proposalStudentCount, setProposalStudentCount] = useState<number>(450);
    const [proposalPlan, setProposalPlan] = useState<'perintis' | 'unggulan' | 'yayasan'>('unggulan');
    const [proposalCopied, setProposalCopied] = useState<boolean>(false);

    const formatRupiah = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };

    // Calculation for ROI
    const bosRates: Record<string, number> = {
        SD: 900000,
        SMP: 1100000,
        SMA: 1500000,
        SMK: 1600000,
    };
    const currentBosRate = bosRates[roiSchoolLevel] || 1500000;
    const estimatedAtsSaved = Math.max(1, Math.round(roiStudentCount * 0.02)); // 2% dropout risk prevented
    const totalBosProtected = estimatedAtsSaved * currentBosRate;
    const teacherHoursSaved = Math.round((roiStudentCount / 30) * 3); // ~3 hrs per class/month
    const unggulanAnnualCost = 8544000;
    const roiMultiplier = (totalBosProtected / unggulanAnnualCost).toFixed(1);

    const handleSelectDemoRole = (roleId: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('tanggapin_current_role', roleId);
            window.location.href = `/demo-login?role=${roleId}`;
        }
    };

    const generateProposalText = () => {
        const planObj = PRICING_PLANS.find((p) => p.id === proposalPlan) || PRICING_PLANS[1];
        const todayStr = new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        return `================================================================================
PROPOSAL PENGADAAN & IMPLEMENTASI SISTEM INFORMASI OPERASIONAL SEKOLAH
APLIKASI TANGGAPIN — SISTEM TINDAK LANJUT SISWA & MITIGASI RISIKO TERPADU
================================================================================

Nomor Surat   : 014/PROP-TGP/BOS/${new Date().getFullYear()}
Tanggal       : ${todayStr}
Instansi      : ${proposalSchoolName || 'Sekolah Pemohon'}
Jenjang       : ${proposalLevel}
Estimasi Siswa: ${proposalStudentCount} Siswa
Paket Pilihan : ${planObj.name} (${planObj.targetAudience})

DASAR HUKUM PENGANGGARAN DANA BOSP / BOS:
1. Permendikbudristek No. 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Satuan Pendidikan (PPKSP / TPPK).
2. Permendikbudristek No. 63 Tahun 2023 tentang Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOSP).
   - Komponen Pemeliharaan Sarana & Prasarana Sekolah (Sistem Informasi Manajemen Sekolah Berbasis Cloud).
   - Komponen Administrasi Kegiatan Sekolah & Tata Kelola Pembinaan Siswa.

RINCIAN INVESTASI LAYANAN:
- Nama Paket        : ${planObj.name}
- Periode Langganan : 1 Tahun Ajaran Penuh (12 Bulan / 2 Termin BOS)
- Tarif Normal      : ${formatRupiah(planObj.monthlyPrice)} / bulan
- Tarif Komitmen BOS: ${formatRupiah(planObj.annualMonthlyEquivalent)} / bulan (Diskon 20% Termin Tahunan)
- Total Investasi   : ${formatRupiah(planObj.annualTotal)} / tahun
- Rincian Termin    : Tahap I: ${formatRupiah(planObj.annualTotal / 2)} | Tahap II: ${formatRupiah(planObj.annualTotal / 2)}

KELENGKAPAN ADMINISTRASI SPJ BOS YANG DISEDIAKAN:
1. Surat Penawaran Resmi & Rincian Anggaran Belanja (RAB)
2. Perjanjian Kerja Sama (PKS / Surat Perintah Kerja)
3. Berita Acara Serah Terima Pekerjaan (BAST) & Laporan Aktivasi Sistem
4. Faktur Pajak Resmi (E-Faktur PPN) & Kuitansi Pembayaran Terverifikasi

TARGET CAPAIAN OPERASIONAL:
- Generator Rapor Karakter AI: Sintesis cerdas data presensi & kedisiplinan menjadi narasi evaluasi perkembangan siswa otomatis.
- Otomasi Pengiriman WhatsApp Ortu: Lembar rapor terkirim instan ke kontak orang tua dengan tanda terima digital berkekuatan hukum.
- Mempertahankan retensi siswa dari risiko Anak Tidak Sekolah (ATS) sehingga pagu alokasi Dana BOS tetap aman.
- Efisiensi administrasi wali kelas & guru BK hingga ~45 jam kerja per bulan.
- Kepatuhan 100% audit inspektorat atas pencatatan insiden Tim TPPK sekolah (Permendikbudristek No. 46/2023).

Dibuat Oleh:
Tim Kemitraan Sekolah — TANGGAPIN
Website: tanggapin.sch.id | Email: kemitraan@tanggapin.sch.id
Hotline Layanan BOS: +62 812-9988-7766
================================================================================`;
    };

    const handleCopyProposal = () => {
        const text = generateProposalText();
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setProposalCopied(true);
            toast.success('Draf ringkasan proposal BOS berhasil disalin ke clipboard!');
            setTimeout(() => setProposalCopied(false), 3000);
        }
    };

    const handleDownloadProposal = () => {
        const text = generateProposalText();
        const element = document.createElement('a');
        const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = `Proposal_BOS_Tanggapin_${(proposalSchoolName || 'Sekolah').replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('File proposal BOS berhasil diunduh!');
    };

    const bentoFeatures = [
        {
            number: '01',
            title: 'Deteksi Sinyal Otomatis',
            desc: 'Sistem merangkum data absensi, nilai produktif, dan pola ketertiban tanpa rekap manual berulang.',
            icon: ShieldAlert,
            badge: 'Peringatan Dini',
        },
        {
            number: '02',
            title: 'Konteks Siswa 360 Derajat',
            desc: 'Wali kelas dan guru BK melihat kondisi riil siswa secara menyeluruh dan bermartabat sebelum bertindak.',
            icon: Search,
            badge: 'Profil Lengkap',
        },
        {
            number: '03',
            title: 'Tindak Lanjut & Penugasan PIC',
            desc: 'Langkah pendampingan terbagi jelas: konseling individu, bimbingan belajar, atau kunjungan rumah.',
            icon: CheckCircle2,
            badge: 'Target Jelas',
        },
        {
            number: '04',
            title: 'Komunikasi Ber-Tanda Terima',
            desc: 'Pemberitahuan resmi terkirim ke wali murid dengan status konfirmasi baca demi kepastian koordinasi.',
            icon: PhoneCall,
            badge: 'Konfirmasi Terukur',
        },
    ];

    const roles = [
        {
            title: 'Wali Kelas',
            desc: 'Memantau kesehatan rombel dan mengambil inisiatif pendampingan seawal mungkin.',
            icon: GraduationCap,
        },
        {
            title: 'Guru BK & Konseling',
            desc: 'Mengelola linimasa kasus dari laporan masuk, sesi konseling, komitmen siswa, hingga tuntas.',
            icon: ShieldAlert,
        },
        {
            title: 'Kesiswaan & Pembinaan',
            desc: 'Mencatat rekapitulasi poin tata tertib dan mengoordinasikan langkah pembinaan secara objektif.',
            icon: Shield,
        },
        {
            title: 'Kepala Sekolah',
            desc: 'Melihat efektivitas penanganan kasus dan kesiapsiagaan operasional seluruh sekolah.',
            icon: Users,
        },
    ];

    return (
        <>
            <Head title="Tanggapin - Platform Tindak Lanjut Siswa Sekolah" />

            <div className="flex min-h-screen flex-col justify-between bg-white text-slate-900 transition-colors selection:bg-blue-600 selection:text-white dark:bg-[#070b14] dark:text-slate-100">
                {/* 1. Header / Navbar */}
                <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#070b14]/90">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center">
                            <TanggapinLogo size="md" showDescriptor={true} />
                        </Link>

                        <div className="hidden items-center gap-6 text-xs font-semibold text-slate-600 lg:flex dark:text-slate-300">
                            <a
                                href="#prinsip"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Prinsip
                            </a>
                            <a
                                href="#preview"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Simulasi
                            </a>
                            <a
                                href="#peran"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Pengguna
                            </a>
                            <a
                                href="#bisnis"
                                className="flex items-center gap-1.5 transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                <TrendingUp className="size-3.5 text-blue-600 dark:text-blue-400" />
                                Ide Bisnis
                            </a>
                            <a
                                href="#harga"
                                className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
                            >
                                <Coins className="size-3.5" />
                                Biaya & Paket
                            </a>
                            <a
                                href="#faq"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                FAQ BOS
                            </a>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-800"
                                >
                                    Buka Dashboard
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsDemoRoleModalOpen(true)
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-98"
                                    >
                                        <span>Coba Demo Langsung</span>
                                        <ArrowRight className="size-3.5" />
                                    </button>
                                    <Link
                                        href={login()}
                                        className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setIsDemoRoleModalOpen(true)}
                                        className="hidden rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 sm:inline-block dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                    >
                                        Pilih Peran Demo
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* 2. Hero Section - Refined Editorial Minimalist (Apple Design Craft) */}
                <main className="flex-1">
                    <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 text-center sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl space-y-6">
                            {/* Monochromatic Pill Tag */}
                            <div className="inline-flex flex-wrap items-center justify-center gap-2">
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                    <span className="size-1.5 rounded-full bg-blue-600" />
                                    <span>
                                        Platform Operasional Tindak Lanjut Sekolah
                                    </span>
                                </div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                                    <Coins className="size-3.5" />
                                    Mulai Rp 360rb/bln • 100% Legal Dana BOS / BOSP
                                </span>
                            </div>

                            {/* Display Typography with Tight Tracking */}
                            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                                Deteksi lebih cepat.{' '}
                                <span className="block text-blue-700 sm:inline dark:text-blue-400">
                                    Tindak lebih tepat.
                                </span>
                            </h1>

                            {/* Human-Centered Plain Indonesian Subtext */}
                            <p className="mx-auto max-w-2xl text-base leading-relaxed font-normal text-slate-600 sm:text-lg dark:text-slate-300">
                                Sekolah memiliki data absensi, nilai, dan
                                ketertiban. Tanggapin menyatukannya menjadi alur
                                pendampingan yang jelas: kenali sinyal lebih
                                dini, koordinasikan tindakan, dan dokumentasikan
                                hasil secara terukur.
                            </p>

                            {/* Primary Interactive CTA Area */}
                            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsDemoRoleModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-98 sm:text-sm"
                                >
                                    Eksplorasi Dashboard Interaktif
                                    <ArrowRight className="size-4" />
                                </button>
                                <a
                                    href="#harga"
                                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/60 px-5 py-3.5 text-xs font-bold text-blue-700 shadow-xs transition-colors hover:bg-blue-100 sm:text-sm dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/40"
                                >
                                    <Coins className="size-4 text-blue-700 dark:text-blue-400" />
                                    Lihat Biaya & Paket
                                </a>
                                <a
                                    href="#preview"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-semibold text-slate-800 shadow-xs transition-colors hover:bg-slate-50 sm:text-sm dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    <Eye className="size-4 text-slate-500" />
                                    Lihat Simulasi Alur Kerja
                                </a>
                            </div>

                            {/* Value Anchors */}
                            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                                    Bukan sekadar arsip administrasi
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                                    Komunikasi resmi ber-tanda terima
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                                    100% Kompatibel Juknis Dana BOS / BOSP
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                                    Kepatuhan TPPK Permendikbud 46/2023
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Interactive Live Simulation Sandbox (Apple Prototype Principle) */}
                    <section
                        id="preview"
                        className="border-y border-slate-200/80 bg-slate-50/70 py-20 dark:border-slate-800/80 dark:bg-[#0b1120]"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-10 max-w-3xl text-center">
                                <span className="text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                    Simulasi Interaktif
                                </span>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                    Coba Alur Nyata Tanggapin Langsung di Sini
                                </h2>
                                <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                    Pilih skenario operasional di bawah untuk
                                    melihat bagaimana sistem merespons kondisi
                                    siswa secara real-time.
                                </p>
                            </div>

                            {/* Faux OS Window Shell */}
                            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                                {/* Window Chrome Top Bar */}
                                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-[#111c30]">
                                    <div className="flex items-center gap-2">
                                        <span className="size-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        <span className="size-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        <span className="size-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        <span className="ms-2 font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
                                            tanggapin.sch.id / operasional
                                        </span>
                                    </div>
                                    <span className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                        Sistem Aktif & Terhubung
                                    </span>
                                </div>

                                {/* Preview Tab Selectors */}
                                <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold dark:border-slate-800 dark:bg-[#0f172a]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPreviewTab('early_warning')
                                        }
                                        className={cn(
                                            'rounded-lg px-3.5 py-1.5 transition-colors',
                                            previewTab === 'early_warning'
                                                ? 'bg-blue-700 text-white'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                        )}
                                    >
                                        Peringatan Dini Siswa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPreviewTab('class_health')
                                        }
                                        className={cn(
                                            'rounded-lg px-3.5 py-1.5 transition-colors',
                                            previewTab === 'class_health'
                                                ? 'bg-blue-700 text-white'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                        )}
                                    >
                                        Pantauan Kelas
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewTab('cases')}
                                        className={cn(
                                            'rounded-lg px-3.5 py-1.5 transition-colors',
                                            previewTab === 'cases'
                                                ? 'bg-blue-700 text-white'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                        )}
                                    >
                                        Alur Kasus BK
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPreviewTab('communication')
                                        }
                                        className={cn(
                                            'rounded-lg px-3.5 py-1.5 transition-colors',
                                            previewTab === 'communication'
                                                ? 'bg-blue-700 text-white'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                        )}
                                    >
                                        Pesan Orang Tua
                                    </button>
                                </div>

                                {/* Interactive Preview Canvas */}
                                <div className="min-h-[340px] bg-slate-50/50 p-6 sm:p-8 dark:bg-[#070b14]/50">
                                    {/* 1. Early Warning Tab Interactive */}
                                    {previewTab === 'early_warning' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs dark:border-slate-800">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    Peringatan Dini Siswa Butuh
                                                    Tindakan
                                                </span>
                                                <span className="text-slate-500">
                                                    Klik tombol untuk mencoba
                                                    aksi langsung
                                                </span>
                                            </div>

                                            {/* Student Card 1 Dummy */}
                                            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-xs shadow-xs dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-slate-900 dark:text-white">
                                                                Siswa Contoh —
                                                                Kelas X
                                                            </span>
                                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                Kehadiran &
                                                                Nilai
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">
                                                                10 menit lalu
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-300">
                                                            Kehadiran turun
                                                            dalam dua pekan
                                                            terakhir dan tugas
                                                            belum diselesaikan.
                                                        </p>
                                                        <div className="text-[11px] text-slate-500">
                                                            Wali: Wali Kelas •
                                                            Wali Murid: Orang
                                                            Tua Siswa
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setInteractiveActionDone(
                                                                    !interactiveActionDone,
                                                                )
                                                            }
                                                            className={cn(
                                                                'rounded-lg px-3.5 py-2 text-xs font-semibold transition-all',
                                                                interactiveActionDone
                                                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                                    : 'bg-blue-700 text-white hover:bg-blue-800',
                                                            )}
                                                        >
                                                            {interactiveActionDone
                                                                ? 'Tindak Lanjut Tercatat'
                                                                : '+ Tindak Lanjut'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setIsDemoRoleModalOpen(
                                                                    true,
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                                        >
                                                            Hubungi Ortu
                                                        </button>
                                                    </div>
                                                </div>

                                                {interactiveActionDone && (
                                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        Status tindakan
                                                        tersimpan: Wali kelas
                                                        menjadwalkan konsultasi
                                                        belajar individu pekan
                                                        ini.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. Class Health Interactive */}
                                    {previewTab === 'class_health' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs dark:border-slate-800">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    Kondisi Kesehatan Kelas
                                                </span>
                                                <span className="text-slate-500">
                                                    Semester Ganjil 2025/2026
                                                </span>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex justify-between font-bold">
                                                    <span>Kelas X</span>
                                                    <span className="text-blue-700 dark:text-blue-400">
                                                        91% Kehadiran
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-slate-500">
                                                    Wali: Wali Kelas • 36 Siswa
                                                </p>
                                                <div className="mt-3 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <div
                                                        className="h-full rounded-full bg-blue-700"
                                                        style={{
                                                            width: '91%',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-400">
                                                    2 siswa terdeteksi
                                                    membutuhkan pendampingan
                                                    wali kelas.
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. Cases Tab Interactive */}
                                    {previewTab === 'cases' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs dark:border-slate-800">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    Alur Kasus Siswa
                                                </span>
                                                <span className="text-slate-500">
                                                    Linimasa penanganan objektif
                                                </span>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        Kasus CS-001 — Siswa
                                                        Contoh
                                                    </span>
                                                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                        Tahap 1: Konseling
                                                        Berjalan
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-slate-600 dark:text-slate-300">
                                                    Kategori: Kerentanan
                                                    Belajar. Sesi konseling
                                                    telah dijadwalkan bersama
                                                    Guru BK dan wali kelas.
                                                </p>
                                                <div className="mt-3 text-[11px] text-slate-500">
                                                    Penanggung Jawab: Guru BK •
                                                    Evaluasi: Pekan Berjalan
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. Communication Tab Interactive */}
                                    {previewTab === 'communication' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs dark:border-slate-800">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    Pemberitahuan Resmi Sekolah
                                                    ke Orang Tua
                                                </span>
                                                <span className="text-slate-500">
                                                    Status konfirmasi baca
                                                    terverifikasi
                                                </span>
                                            </div>

                                            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-xs dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        Kepada: Orang Tua / Wali
                                                        Murid
                                                    </span>
                                                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        Terkonfirmasi Sudah
                                                        Membaca
                                                    </span>
                                                </div>
                                                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                                                    Yth. Orang tua / wali murid,
                                                    kami menginformasikan
                                                    catatan perkembangan siswa
                                                    yang memerlukan koordinasi
                                                    bersama sekolah demi
                                                    kelancaran belajar.
                                                </p>
                                                <div className="text-[11px] text-slate-500">
                                                    Kanal: Pesan Resmi Sekolah •
                                                    Waktu: Hari ini, 08:15 WIB
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. Bento Box Feature Grid (Minimalist UI Directive) */}
                    <section
                        id="prinsip"
                        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <span className="text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                Prinsip Desain Produk
                            </span>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                Alur Nyata dari Data Menjadi Solusi
                            </h2>
                            <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                Setiap modul Tanggapin dirancang dengan satu
                                prinsip: temukan masalah lebih awal, tentukan
                                penanggung jawab, ambil tindakan, dan simpan
                                hasilnya.
                            </p>
                        </div>

                        {/* Asymmetrical Bento Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {bentoFeatures.map((f) => {
                                const IconComponent = f.icon;
                                return (
                                    <div
                                        key={f.number}
                                        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-sm dark:border-slate-800 dark:bg-[#0f172a]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                                <IconComponent className="size-5" />
                                            </div>
                                            <span className="font-mono text-sm font-bold text-slate-400">
                                                {f.number}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {f.title}
                                            </h3>
                                            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                                {f.desc}
                                            </p>
                                        </div>
                                        <div className="pt-2">
                                            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                                {f.badge}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* 5. Editorial Comparison - The Tanggapin Difference */}
                    <section
                        id="perbandingan"
                        className="border-y border-slate-200/80 bg-slate-50/70 py-24 dark:border-slate-800/80 dark:bg-[#0b1120]"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-16 max-w-3xl text-center">
                                <span className="text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                    Perbandingan Pendekatan
                                </span>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                    Mengapa Cara Lama Perlu Ditingkatkan
                                </h2>
                                <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                    Data operasional sekolah sering terpisah dan
                                    lebih banyak digunakan untuk laporan
                                    administratif daripada penyelamatan siswa.
                                </p>
                            </div>

                            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Cara Lama */}
                                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#0f172a]">
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                                        Cara Lama di Sekolah
                                    </div>
                                    <ul className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                                        <li className="flex items-start gap-3">
                                            <span className="font-bold text-slate-400">
                                                •
                                            </span>
                                            <span>
                                                Wali kelas menggabungkan
                                                absensi, nilai, dan catatan
                                                manual secara terpisah.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="font-bold text-slate-400">
                                                •
                                            </span>
                                            <span>
                                                Siswa baru ditangani setelah
                                                masalah menumpuk atau sudah
                                                berbulan-bulan alpa.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="font-bold text-slate-400">
                                                •
                                            </span>
                                            <span>
                                                Koordinasi penanganan tenggelam
                                                di chat WhatsApp tanpa
                                                penanggung jawab definitif.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="font-bold text-slate-400">
                                                •
                                            </span>
                                            <span>
                                                Orang tua merasa terkejut karena
                                                tidak ada informasi awal yang
                                                terstruktur.
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Solusi Tanggapin */}
                                <div className="space-y-5 rounded-2xl border border-blue-200 bg-white p-8 dark:border-blue-900/60 dark:bg-[#111c30]">
                                    <div className="text-sm font-bold text-blue-700 dark:text-blue-400">
                                        Solusi Terpadu Tanggapin
                                    </div>
                                    <ul className="space-y-4 text-xs text-slate-700 dark:text-slate-200">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="size-4 shrink-0 text-blue-700 dark:text-blue-400" />
                                            <span>
                                                <strong>
                                                    Peringatan Dini:
                                                </strong>{' '}
                                                Mendeteksi pola risiko sebelum
                                                menjadi masalah besar.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="size-4 shrink-0 text-blue-700 dark:text-blue-400" />
                                            <span>
                                                <strong>
                                                    Pendekatan Manusiawi:
                                                </strong>{' '}
                                                Memahami konteks siswa, bukan
                                                melabeli anak bermasalah.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="size-4 shrink-0 text-blue-700 dark:text-blue-400" />
                                            <span>
                                                <strong>
                                                    Alur Kasus Rapi:
                                                </strong>{' '}
                                                Dari laporan, konseling BK,
                                                komitmen siswa, hingga arsip
                                                digital.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="size-4 shrink-0 text-blue-700 dark:text-blue-400" />
                                            <span>
                                                <strong>
                                                    Komunikasi Terukur:
                                                </strong>{' '}
                                                Pesan resmi sekolah disertai
                                                status tanda terima orang tua.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. Target User Roles Section */}
                    <section
                        id="peran"
                        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <span className="text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                Pengguna Sekolah
                            </span>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                Satu Alur untuk Seluruh Tim Sekolah
                            </h2>
                            <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                Tanggapin menyesuaikan tampilan antarmuka sesuai
                                tanggung jawab masing-masing pendidik.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {roles.map((r) => {
                                const IconComponent = r.icon;
                                return (
                                    <div
                                        key={r.title}
                                        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f172a]"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                            <IconComponent className="size-5" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">
                                            {r.title}
                                        </h3>
                                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                            {r.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* 7. Model Bisnis & Nilai Strategis Section */}
                    <section
                        id="bisnis"
                        className="border-t border-slate-200/80 bg-slate-50/70 py-24 dark:border-slate-800/80 dark:bg-[#0b1120]"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-16 max-w-3xl text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
                                    <TrendingUp className="size-3.5" />
                                    Model Bisnis & Nilai Strategis
                                </span>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Bagaimana Tanggapin Tumbuh & Menghasilkan Nilai Nyata
                                </h2>
                                <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                    Model bisnis B2B SaaS sekolah terpadu yang dirancang selaras dengan ekosistem pendidikan nasional: terintegrasi dengan pos anggaran Dana BOS (BOSP), kepatuhan regulasi TPPK Kemendikbudristek, dan penyelamatan retensi kuota siswa.
                                </p>
                            </div>

                            {/* 4 Pilar Bisnis Grid */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {BUSINESS_PILLARS.map((p) => {
                                    const IconComp = p.icon;
                                    return (
                                        <div
                                            key={p.number}
                                            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-blue-700 hover:shadow-sm dark:border-slate-800 dark:bg-[#0f172a] dark:hover:border-blue-600"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex size-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400">
                                                        <IconComp className="size-5" />
                                                    </div>
                                                    <span className="font-mono text-xs font-bold text-slate-400">
                                                        {p.number}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {p.badge}
                                                    </span>
                                                    <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                                                        {p.title}
                                                    </h3>
                                                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                                        {p.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Interactive ROI & Dana BOS Protection Calculator */}
                            <div className="mt-14 overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 p-6 shadow-sm sm:p-10 dark:border-blue-900/60 dark:from-blue-950/20 dark:via-[#0f172a] dark:to-[#070b14]">
                                <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-center dark:border-slate-800">
                                    <div className="space-y-2">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                            <Calculator className="size-3.5" />
                                            <span>Simulasi Pengembalian Investasi (ROI)</span>
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                            Kalkulator Perlindungan Pagu Dana BOS Sekolah
                                        </h3>
                                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                            Putus sekolah (ATS) langsung mengurangi kuota penerimaan Dana BOS tahun berikutnya. Lihat berapa anggaran sekolah yang terlindungi dengan deteksi dini.
                                        </p>
                                    </div>

                                    {/* School Level Selector */}
                                    <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                        {(['SD', 'SMP', 'SMA', 'SMK'] as const).map((lvl) => (
                                            <button
                                                key={lvl}
                                                type="button"
                                                onClick={() => setRoiSchoolLevel(lvl)}
                                                className={cn(
                                                    'rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all',
                                                    roiSchoolLevel === lvl
                                                        ? 'bg-blue-700 text-white shadow-xs'
                                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                                )}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                                    {/* Slider Controls */}
                                    <div className="space-y-6 lg:col-span-5">
                                        <div>
                                            <div className="flex items-center justify-between text-xs font-semibold">
                                                <span className="text-slate-700 dark:text-slate-300">
                                                    Jumlah Siswa Terdaftar:
                                                </span>
                                                <span className="rounded-md bg-blue-100 px-2.5 py-1 font-mono text-sm font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                    {roiStudentCount} Siswa
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={100}
                                                max={1200}
                                                step={25}
                                                value={roiStudentCount}
                                                onChange={(e) => setRoiStudentCount(Number(e.target.value))}
                                                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-700 dark:bg-slate-800"
                                            />
                                            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-400">
                                                <span>100 Siswa</span>
                                                <span>600 Siswa</span>
                                                <span>1.200 Siswa</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 rounded-xl border border-slate-200 bg-white/70 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/60">
                                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                                <span>Standar Dana BOS {roiSchoolLevel}:</span>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                    {formatRupiah(currentBosRate)} / siswa / thn
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                                <span>Estimasi Risiko Drop-out (ATS):</span>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                    ~2% ({estimatedAtsSaved} Siswa)
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                                <span>Biaya Langganan Tanggapin:</span>
                                                <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                                                    {formatRupiah(unggulanAnnualCost)} / thn
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setIsProposalModalOpen(true)}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-98"
                                        >
                                            <FileSpreadsheet className="size-4" />
                                            <span>Buat Draf Proposal Resmi Dana BOS</span>
                                        </button>
                                    </div>

                                    {/* 3 Calculated Metrics Display */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
                                        <div className="space-y-2 rounded-2xl border border-blue-200 bg-white p-5 shadow-xs dark:border-blue-900/70 dark:bg-[#111c30]">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
                                                Pagu BOS Diamankan
                                            </span>
                                            <div className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-blue-400">
                                                {formatRupiah(totalBosProtected)}
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                Potensi dana BOS yang diselamatkan dari mempertahankan {estimatedAtsSaved} siswa rentan agar tidak putus sekolah.
                                            </p>
                                        </div>

                                        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#111c30]">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                <Zap className="size-4 text-blue-600 dark:text-blue-400" />
                                                Jam Kerja Dihemat
                                            </span>
                                            <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                                ~{teacherHoursSaved} Jam
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                Per bulan untuk wali kelas & guru BK dalam rekapitulasi, follow-up, dan koordinasi berulang.
                                            </p>
                                        </div>

                                        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#111c30]">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                Daya Ungkit Investasi
                                            </span>
                                            <div className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                                                {roiMultiplier}x Lipat
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                Biaya sistem langsung impas (break-even) dan memberikan surplus perlindungan operasional sekolah.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 8. Biaya & Paket Investasi Sekolah Section */}
                    <section
                        id="harga"
                        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto mb-12 max-w-3xl text-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
                                <Coins className="size-3.5" />
                                Transparan & Resmi Dana BOS
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Pilihan Paket Investasi Sekolah
                            </h2>
                            <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                Skema pembiayaan flat tanpa biaya tersembunyi. 100% legal dan memenuhi ketentuan pertanggungjawaban SPJ Dana BOSP / BOS Reguler maupun Kinerja.
                            </p>

                            {/* Billing Switch (Monthly vs Annually) */}
                            <div className="mt-8 flex items-center justify-center">
                                <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100 p-1.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-900">
                                    <button
                                        type="button"
                                        onClick={() => setBillingCycle('annually')}
                                        className={cn(
                                            'flex items-center gap-2 rounded-xl px-4 py-2 transition-all',
                                            billingCycle === 'annually'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                        )}
                                    >
                                        <span>Tahunan (Rekomendasi BOS)</span>
                                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                                            Hemat 20%
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBillingCycle('monthly')}
                                        className={cn(
                                            'rounded-xl px-4 py-2 transition-all',
                                            billingCycle === 'monthly'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                        )}
                                    >
                                        Bulanan
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 3 Pricing Cards Grid */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {PRICING_PLANS.map((plan) => {
                                const isHighlight = plan.highlight;
                                const effectivePrice =
                                    billingCycle === 'annually'
                                        ? plan.annualMonthlyEquivalent
                                        : plan.monthlyPrice;

                                return (
                                    <div
                                        key={plan.id}
                                        className={cn(
                                            'relative flex flex-col justify-between rounded-3xl p-8 transition-all',
                                            isHighlight
                                                ? 'border-2 border-blue-700 bg-white shadow-xl dark:border-blue-500 dark:bg-[#111c30]'
                                                : 'border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-[#0f172a]'
                                        )}
                                    >
                                        {/* Highlight Badge */}
                                        {isHighlight && (
                                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-3.5 py-1 text-xs font-bold text-white shadow-sm dark:bg-blue-600">
                                                    <Sparkles className="size-3.5" />
                                                    {plan.badge}
                                                </span>
                                            </div>
                                        )}

                                        <div>
                                            {/* Plan Header */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                        {plan.name}
                                                    </h3>
                                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                        {plan.targetAudience}
                                                    </p>
                                                </div>
                                                {!isHighlight && (
                                                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {plan.badge}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                                {plan.description}
                                            </p>

                                            {/* Price Tag */}
                                            <div className="mt-6 border-y border-slate-200/80 py-5 dark:border-slate-800">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                                        {formatRupiah(effectivePrice)}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-500">
                                                        / bulan
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                    {billingCycle === 'annually' ? (
                                                        <span>
                                                            Ditagih tahunan{' '}
                                                            <strong>{formatRupiah(plan.annualTotal)}</strong> / tahun
                                                            (Hemat {formatRupiah(plan.annualSavings)})
                                                        </span>
                                                    ) : (
                                                        <span>Ditagih setiap bulan, fleksibel dibatalkan kapan saja.</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Feature List */}
                                            <div className="mt-6 space-y-3">
                                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Fitur & Layanan Tercakup:
                                                </div>
                                                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                                                    {plan.features.map((feat, idx) => (
                                                        <li key={idx} className="flex items-start gap-2.5">
                                                            <Check className="size-4 shrink-0 text-blue-700 dark:text-blue-400" />
                                                            <span className="leading-snug">{feat}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Plan Action CTA */}
                                        <div className="mt-8 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProposalPlan(plan.id as any);
                                                    setIsProposalModalOpen(true);
                                                }}
                                                className={cn(
                                                    'inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all active:scale-98 sm:text-sm',
                                                    isHighlight
                                                        ? 'bg-blue-700 text-white shadow-xs hover:bg-blue-800'
                                                        : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                                )}
                                            >
                                                <span>{plan.ctaText}</span>
                                                <ArrowRight className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* SPJ Dana BOS Legal Compliance Banner */}
                        <div className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-400">
                                        <FileCheck className="size-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                                Kelengkapan Administrasi SPJ Dana BOS 100% Terpenuhi
                                            </h4>
                                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                Siap Audit BPK / Inspektorat
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300">
                                            Pengadaan resmi disertai <strong>Surat Penawaran, BAST, PKS / SPK, E-Faktur PPN,</strong> dan <strong>Kuitansi Resmi</strong> yang sesuai juknis BOS Permendikbudristek No. 63/2023.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-3 self-start md:self-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsProposalModalOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                    >
                                        <Download className="size-3.5" />
                                        <span>Unduh Draf Proposal RKAS</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 9. FAQ Biaya & Pengadaan BOS Section */}
                    <section
                        id="faq"
                        className="border-t border-slate-200/80 bg-slate-50/70 py-24 dark:border-slate-800/80 dark:bg-[#0b1120]"
                    >
                        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-14 text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
                                    <HelpCircle className="size-3.5" />
                                    Tanya Jawab Pengadaan
                                </span>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Pertanyaan Umum Seputar Biaya & Pengadaan BOS
                                </h2>
                                <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                    Informasi lengkap bagi Kepala Sekolah, Bendahara BOS, dan Pengurus Yayasan sebelum memulai implementasi.
                                </p>
                            </div>

                            {/* FAQ Accordion */}
                            <div className="space-y-3.5">
                                {PRICING_FAQS.map((faq, index) => {
                                    const isOpen = faqOpenIndex === index;
                                    return (
                                        <div
                                            key={index}
                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-[#0f172a]"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                                                className="flex w-full items-center justify-between p-5 text-left text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
                                            >
                                                <span>{faq.q}</span>
                                                <div className="ml-4 flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                    {isOpen ? (
                                                        <ChevronUp className="size-4" />
                                                    ) : (
                                                        <ChevronDown className="size-4" />
                                                    )}
                                                </div>
                                            </button>
                                            {isOpen && (
                                                <div className="border-t border-slate-100 px-5 pt-3 pb-5 text-xs leading-relaxed text-slate-600 dark:border-slate-800/80 dark:text-slate-300">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* 10. Final Call to Action Section */}
                    <section className="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Mulai Terapkan Tanggapin di Sekolah Anda
                            </h2>
                            <p className="mx-auto max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                Hubungkan data sekolah dengan tindakan pendampingan yang tepat waktu, lindungi pagu alokasi Dana BOS dari risiko drop-out siswa, dan wujudkan ekosistem sekolah ramah anak.
                            </p>
                            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
                                <button
                                    type="button"
                                    onClick={() => setIsDemoRoleModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-98 sm:text-sm"
                                >
                                    Buka Demo Dashboard Operasional
                                    <ArrowRight className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsProposalModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-semibold text-slate-800 shadow-xs transition-colors hover:bg-slate-50 sm:text-sm dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    <FileSpreadsheet className="size-4 text-blue-600 dark:text-blue-400" />
                                    Simulasi Anggaran & Proposal BOS
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* 11. Rich Footer */}
                <footer className="border-t border-slate-200 bg-white py-14 text-xs text-slate-500 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-400">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
                            {/* Brand & Mission */}
                            <div className="space-y-4 lg:col-span-2">
                                <TanggapinLogo size="md" showDescriptor={true} />
                                <p className="max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Platform operasional sekolah terpadu untuk deteksi dini risiko siswa, penanganan kasus BK beretika, pencegahan Anak Tidak Sekolah (ATS), dan kepatuhan regulasi TPPK Kemendikbudristek.
                                </p>
                                <div className="text-[11px] text-slate-500">
                                    100% Kompatibel dengan Petunjuk Teknis Pengelolaan Dana BOSP Permendikbudristek No. 63/2023.
                                </div>
                            </div>

                            {/* Navigasi Utama */}
                            <div className="space-y-3">
                                <div className="font-bold text-slate-900 dark:text-white">
                                    Navigasi
                                </div>
                                <ul className="space-y-2 text-xs">
                                    <li>
                                        <a href="#prinsip" className="hover:text-blue-700 dark:hover:text-blue-400">Prinsip Kerja</a>
                                    </li>
                                    <li>
                                        <a href="#preview" className="hover:text-blue-700 dark:hover:text-blue-400">Simulasi Interaktif</a>
                                    </li>
                                    <li>
                                        <a href="#peran" className="hover:text-blue-700 dark:hover:text-blue-400">Pengguna Sekolah</a>
                                    </li>
                                    <li>
                                        <a href="#bisnis" className="hover:text-blue-700 dark:hover:text-blue-400">Ide & Model Bisnis</a>
                                    </li>
                                    <li>
                                        <a href="#harga" className="hover:text-blue-700 dark:hover:text-blue-400">Biaya & Paket BOS</a>
                                    </li>
                                </ul>
                            </div>

                            {/* 11 Modul Terpadu */}
                            <div className="space-y-3">
                                <div className="font-bold text-slate-900 dark:text-white">
                                    Modul Unggulan
                                </div>
                                <ul className="space-y-2 text-xs">
                                    <li>Early Warning Siswa</li>
                                    <li>Alur Linimasa Kasus BK</li>
                                    <li>Mitigasi Anak Tidak Sekolah</li>
                                    <li>Validasi Residu Dapodik</li>
                                    <li>Tim Siaga TPPK & Insiden</li>
                                    <li>Rekonsiliasi SPP & Afirmasi</li>
                                </ul>
                            </div>

                            {/* Kontak & Legalitas */}
                            <div className="space-y-3">
                                <div className="font-bold text-slate-900 dark:text-white">
                                    Kemitraan & Dukungan
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    Konsultasi Rencana Anggaran Sekolah (RKAS) & Pengadaan SIPLah:
                                </p>
                                <div className="space-y-1 text-xs">
                                    <div className="font-semibold text-slate-900 dark:text-white">
                                        halo@tanggapin.sch.id
                                    </div>
                                    <div>Hotline: +62 812-9988-7766</div>
                                    <div>Senin – Jumat (08.00 – 17.00 WIB)</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row dark:border-slate-800">
                            <div>
                                © {new Date().getFullYear()} TANGGAPIN. Hak Cipta Dilindungi Undang-Undang.
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <span>Deteksi lebih cepat. Tindak lebih tepat.</span>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* Demo Role Selection Modal */}
                {isDemoRoleModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs duration-150 fade-in"
                        onClick={() => setIsDemoRoleModalOpen(false)}
                    >
                        <div
                            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Pilih Peran Demo
                                    </h3>
                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                        Pilih peran untuk langsung masuk ke
                                        dashboard operasional sesuai
                                        kewenangannya.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsDemoRoleModalOpen(false)
                                    }
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                    aria-label="Tutup"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <div className="max-h-[70vh] space-y-2.5 overflow-y-auto p-6">
                                {DEMO_ROLES.map((role) => {
                                    const IconComp = role.icon;
                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() =>
                                                handleSelectDemoRole(role.id)
                                            }
                                            className="group flex w-full items-start gap-4 rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-blue-700 hover:bg-blue-50/40 hover:shadow-xs dark:border-slate-800 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
                                        >
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition-colors group-hover:border-blue-700 group-hover:bg-blue-700 group-hover:text-white dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                                                <IconComp className="size-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center justify-between gap-1.5">
                                                    <span className="text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                                                        {role.title}
                                                    </span>
                                                    <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-400">
                                                        {role.badge}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                                    {role.desc}
                                                </p>
                                            </div>
                                            <div className="self-center pl-2 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-700 dark:text-slate-600 dark:group-hover:text-blue-400">
                                                <ArrowRight className="size-4" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-right dark:border-slate-800 dark:bg-slate-900/50">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsDemoRoleModalOpen(false)
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Proposal & Estimasi BOS Generator Modal */}
                {isProposalModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs duration-150 fade-in"
                        onClick={() => setIsProposalModalOpen(false)}
                    >
                        <div
                            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                        <FileSpreadsheet className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                            Draf Rencana Anggaran & Proposal BOS
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            RAB siap pakai untuk diajukan ke Kepala Sekolah atau Bendahara BOS
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsProposalModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                    aria-label="Tutup"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Modal Body: Split 2 Columns */}
                            <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
                                {/* Parameters Form */}
                                <div className="space-y-4 border-b border-slate-200 p-6 lg:col-span-5 lg:border-r lg:border-b-0 dark:border-slate-800">
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Data Kebutuhan Sekolah
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Nama Satuan Pendidikan
                                        </label>
                                        <input
                                            type="text"
                                            value={proposalSchoolName}
                                            onChange={(e) => setProposalSchoolName(e.target.value)}
                                            placeholder="Contoh: SMA Negeri 1 Harapan"
                                            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Jenjang
                                            </label>
                                            <select
                                                value={proposalLevel}
                                                onChange={(e) => setProposalLevel(e.target.value)}
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            >
                                                <option value="SD">SD / MI</option>
                                                <option value="SMP">SMP / MTs</option>
                                                <option value="SMA">SMA / MA</option>
                                                <option value="SMK">SMK</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Estimasi Siswa
                                            </label>
                                            <input
                                                type="number"
                                                value={proposalStudentCount}
                                                onChange={(e) => setProposalStudentCount(Math.max(10, Number(e.target.value)))}
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Pilihan Paket Layanan
                                        </label>
                                        <div className="mt-1.5 space-y-2">
                                            {PRICING_PLANS.map((plan) => (
                                                <label
                                                    key={plan.id}
                                                    onClick={() => setProposalPlan(plan.id as any)}
                                                    className={cn(
                                                        'flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-all',
                                                        proposalPlan === plan.id
                                                            ? 'border-blue-700 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30'
                                                            : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <input
                                                            type="radio"
                                                            name="plan"
                                                            checked={proposalPlan === plan.id}
                                                            onChange={() => setProposalPlan(plan.id as any)}
                                                            className="text-blue-700"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white">
                                                                {plan.name}
                                                            </div>
                                                            <div className="text-[10px] text-slate-500">
                                                                {plan.targetAudience}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                                                        {formatRupiah(plan.annualTotal)}/thn
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-[11px] text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                                        <p className="font-semibold">Kode Rekening RKAS Dana BOS:</p>
                                        <p className="mt-0.5 text-blue-800 dark:text-blue-300/80">
                                            Komponen Pemeliharaan Sarana / Sistem Informasi Manajemen Sekolah Digital (Permendikbud 63/2023).
                                        </p>
                                    </div>
                                </div>

                                {/* Formatted Document Live Preview */}
                                <div className="flex flex-col justify-between bg-slate-50/70 p-6 lg:col-span-7 dark:bg-[#070b14]/70">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Pratinjau Draf Dokumen Proposal
                                            </span>
                                            <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                Format Teks Resmi
                                            </span>
                                        </div>
                                        <pre className="max-h-[360px] overflow-auto rounded-xl border border-slate-200 bg-white p-4 font-mono text-[11px] leading-relaxed text-slate-800 shadow-inner select-all dark:border-slate-800 dark:bg-[#0b1120] dark:text-slate-200">
                                            {generateProposalText()}
                                        </pre>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5 pt-3">
                                        <button
                                            type="button"
                                            onClick={handleCopyProposal}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                        >
                                            {proposalCopied ? (
                                                <>
                                                    <Check className="size-3.5 text-emerald-600" />
                                                    <span>Tersalin!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-3.5" />
                                                    <span>Salin Draf Proposal</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDownloadProposal}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-98"
                                        >
                                            <Download className="size-3.5" />
                                            <span>Unduh File (.txt)</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
