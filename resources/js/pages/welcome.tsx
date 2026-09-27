import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUp,
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
    Menu,
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
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import TanggapinLogo from '@/components/tanggapin-logo';
import AuroraCharacterBackground from '@/components/aurora-character-background';
import { AnimatedStepper, Step } from '@/components/animated-stepper';
import DashboardVideoPreview from '@/components/dashboard-video-preview';
import MixpanelPricing from '@/components/mixpanel-pricing';
import CinematicHeadline from '@/components/cinematic-headline';
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



const PRICING_PLANS = [
    {
        id: 'perintis',
        name: 'Paket Perintis',
        badge: 'Sekolah Berkembang',
        description: 'Ideal untuk sekolah skala dasar dengan kebutuhan pendampingan siswa.',
        monthlyPrice: 450000,
        annualMonthlyEquivalent: 360000,
        annualTotal: 4320000,
        annualSavings: 1080000,
        targetAudience: 'SD / SMP / Madrasah di bawah 300 Siswa',
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
        description: 'Solusi lengkap 11 modul, AI Generator Rapor, dan pesan resmi orang tua.',
        monthlyPrice: 890000,
        annualMonthlyEquivalent: 712000,
        annualTotal: 8544000,
        annualSavings: 2136000,
        targetAudience: 'SMP / SMA / SMK Mandiri hingga 800 Siswa',
        features: [
            'Semua fitur Paket Perintis tercakup',
            'Mengelola s.d. 35 Rombel Kelas Aktif',
            'Pusat Kontrol Operator: Akun Wali Kelas, Bendahara, Kepsek',
            'Fitur AI: Generator Rapor Perkembangan Siswa Otomatis',
            'Kirim Rapor Langsung ke WhatsApp Ortu Tanda Terima Sah',
            'Sintesis AI: Narasi Karakter & Rekomendasi Pendampingan',
            'Kapasitas s.d. 800 Siswa Terintegrasi',
            '11 Modul Operasional Tanggapin Lengkap',
            'Modul Alur ATS Anak Tidak Sekolah & Satgas Kunjungan',
            'Deteksi Residu Data & Validasi Dapodik',
            'WhatsApp Official Gateway Tanda Terima Terverifikasi',
            'Rekonsiliasi SPP Terpadu & Proteksi Siswa Afirmasi',
            'Modul Kesiapsiagaan Insiden & Tim TPPK Permendikbud 46/2023',
            '5 Akun Peran termasuk Operator Dapodik & Bendahara Sekolah',
            '1 Sesi Pelatihan Online Tim Sekolah 2 Jam Interaktif',
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
        description: 'Pengawasan terpusat multi unit untuk Yayasan, Pesantren, atau Dinas.',
        monthlyPrice: 1850000,
        annualMonthlyEquivalent: 1480000,
        annualTotal: 17760000,
        annualSavings: 4440000,
        targetAudience: 'Grup Yayasan atau Multi Kampus di atas 800 Siswa',
        features: [
            'Semua fitur Paket Unggulan tercakup',
            'Kapasitas Kelas dan Rombel Tanpa Batas',
            'Kapasitas Siswa Tanpa Batas di atas 800 Siswa',
            'Fitur AI: Batch Generator Rapor Siswa Seluruh Unit',
            'Distribusi Rapor Massal Terjadwal ke WhatsApp Orang Tua',
            'Master Dashboard Pengawasan Multi Sekolah Terpusat',
            'Konsolidasi Residu Dapodik & Statistik ATS Lintas Unit',
            'Kustomisasi SOP & Alur Penanganan Insiden Sekolah',
            'Opsi Integrasi Presensi Mesin RFID atau Kartu Pintar',
            'Dedicated Account Manager & Pendampingan On-site',
            'Perjanjian Kerahasiaan Data NDA & Jaminan SLA 99.9%',
            'Bimbingan Teknis Standarisasi TPPK & Sertifikat Kesiapsiagaan',
        ],
        highlight: false,
        ctaText: 'Konsultasi Yayasan & Dinas',
    },
];

const PRICING_FAQS = [
    {
        q: 'Apakah biaya langganan Tanggapin boleh dibiayai menggunakan Dana BOS atau BOSP?',
        a: 'Bisa. Sesuai Permendikbudristek No. 63 Tahun 2023 tentang Juknis BOSP, sekolah dapat mengalokasikan dana BOS reguler maupun kinerja pada komponen pemeliharaan sarana prasarana serta administrasi sekolah. Kami menyediakan kelengkapan SPJ seperti surat penawaran, BAST, kuitansi resmi, dan faktur pajak.',
    },
    {
        q: 'Bagaimana mekanisme pembayaran jika disesuaikan dengan siklus pencairan Dana BOS?',
        a: 'Tanggapin menyediakan opsi termin per semester atau tahunan dengan jatuh tempo fleksibel mengikuti jadwal pencairan dana BOS Tahap I dan Tahap II sekolah.',
    },
    {
        q: 'Berapa lama proses implementasi dan integrasi data awal dari Dapodik?',
        a: 'Cukup beberapa menit. Operator sekolah mengekspor daftar siswa dari Dapodik ke Excel atau CSV, lalu sistem Tanggapin mengimpor data secara otomatis.',
    },
    {
        q: 'Apakah ada biaya tersembunyi atau biaya per siswa tambahan?',
        a: 'Tidak ada. Biaya langganan bersifat flat per paket. Tidak ada biaya server, tidak ada biaya lisensi per guru, dan seluruh pembaruan fitur sudah termasuk tanpa biaya tambahan selama masa aktif berlangganan.',
    },
    {
        q: 'Bagaimana dengan privasi data siswa dan kerahasiaan konseling guru BK?',
        a: 'Tanggapin menerapkan enkripsi data dan pembatasan hak akses berbasis peran. Catatan rahasia konseling BK hanya dapat diakses oleh Guru BK bersangkutan dan Kepala Sekolah.',
    },
    {
        q: 'Apakah sekolah mendapatkan pelatihan dan pendampingan untuk para guru?',
        a: 'Ya. Sekolah mendapatkan panduan lengkap, video tutorial, serta sesi orientasi online untuk seluruh guru dan staf.',
    },
    {
        q: 'Bagaimana cara kerja fitur AI Generator Rapor Siswa & pengiriman WhatsApp ke orang tua?',
        a: 'AI mengolah presensi dan catatan kedisiplinan menjadi narasi perkembangan karakter siswa. Rapor dapat dikirim langsung ke WhatsApp orang tua dengan bukti tanda terima digital resmi.',
    },
];

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>()
        .props;

    // Shrinking Sticky Header & Scroll-to-Top State
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 100);
            setShowScrollTop(scrollY > 350);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSmoothScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        targetId: string,
    ) => {
        e.preventDefault();
        const id = targetId.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 84;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
        setIsMobileMenuOpen(false);
    };

    const [isDemoRoleModalOpen, setIsDemoRoleModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

    // Proposal Generator Form State
    const [proposalSchoolName, setProposalSchoolName] = useState<string>('SMA Negeri 1 Prestasi');
    const [proposalLevel, setProposalLevel] = useState<string>('SMA');
    const [proposalStudentCount, setProposalStudentCount] = useState<number>(450);
    const [proposalPlan, setProposalPlan] = useState<'perintis' | 'unggulan' | 'yayasan'>('unggulan');
    const [proposalCopied, setProposalCopied] = useState<boolean>(false);

    const formatRupiah = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };

    const directRoleMap: Record<string, string> = {
        operator: '/operator',
        guru_bk: '/guru-bk',
        wali_kelas: '/wali-kelas',
        kepala_sekolah: '/kepala-sekolah',
        bendahara: '/bendahara',
    };
    const handleSelectDemoRole = (roleId: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('tanggapin_current_role', roleId);
            window.location.href = directRoleMap[roleId] || `/demo-login?role=${roleId}`;
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
Paket Pilihan : ${planObj.name} • ${planObj.targetAudience}

DASAR HUKUM PENGANGGARAN DANA BOSP / BOS:
1. Permendikbudristek No. 46 Tahun 2023 tentang PPKSP dan TPPK Sekolah.
2. Permendikbudristek No. 63 Tahun 2023 tentang Petunjuk Teknis Dana BOSP.
   - Komponen Pemeliharaan Sarana dan Prasarana Sistem Informasi Sekolah.
   - Komponen Administrasi Kegiatan Sekolah dan Tata Kelola Siswa.

RINCIAN INVESTASI LAYANAN:
- Nama Paket        : ${planObj.name}
- Periode Langganan : 1 Tahun Ajaran Penuh • 12 Bulan atau 2 Termin BOS
- Tarif Normal      : ${formatRupiah(planObj.monthlyPrice)} / bulan
- Tarif Komitmen BOS: ${formatRupiah(planObj.annualMonthlyEquivalent)} / bulan • Diskon 20% Termin Tahunan
- Total Investasi   : ${formatRupiah(planObj.annualTotal)} / tahun
- Rincian Termin    : Tahap I: ${formatRupiah(planObj.annualTotal / 2)} | Tahap II: ${formatRupiah(planObj.annualTotal / 2)}

KELENGKAPAN ADMINISTRASI SPJ BOS YANG DISEDIAKAN:
1. Surat Penawaran Resmi & Rincian Anggaran Belanja RAB
2. Perjanjian Kerja Sama PKS atau Surat Perintah Kerja SPK
3. Berita Acara Serah Terima Pekerjaan BAST & Laporan Aktivasi Sistem
4. Faktur Pajak Resmi E-Faktur PPN & Kuitansi Pembayaran Terverifikasi

TARGET CAPAIAN OPERASIONAL:
- Generator Rapor Karakter AI: Sintesis cerdas presensi dan kedisiplinan siswa otomatis.
- Otomasi Pengiriman WhatsApp Ortu: Lembar rapor terkirim instan dengan tanda terima sah.
- Mempertahankan retensi siswa dari risiko Anak Tidak Sekolah ATS agar alokasi BOS aman.
- Efisiensi administrasi wali kelas dan guru BK hingga 45 jam kerja per bulan.
- Kepatuhan pencatatan insiden Tim TPPK sekolah sesuai Permendikbudristek No. 46/2023.

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

            <div className="relative min-h-screen flex flex-col justify-between text-slate-900 transition-colors selection:bg-blue-600 selection:text-white dark:text-slate-100 overflow-x-hidden">
                {/* 1. Shrinking Sticky Header: Centered & Spacious Navigation */}
                <header
                    className={cn(
                        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
                        isScrolled
                            ? 'h-16 bg-white/85 dark:bg-[#070b14]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-xs'
                            : 'h-20 bg-transparent border-b border-transparent shadow-none'
                    )}
                >
                    <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Logo Left */}
                        <div className="flex items-center shrink-0">
                            <Link href="/" className="flex items-center">
                                <TanggapinLogo size="md" showDescriptor={true} />
                            </Link>
                        </div>

                        {/* Centered Navigation with Generous Spacing */}
                        <nav className="hidden lg:flex items-center justify-center flex-1 mx-8 gap-8 text-[13px] font-semibold text-slate-600 dark:text-slate-300">
                            <a
                                href="#fitur"
                                onClick={(e) => handleSmoothScroll(e, '#fitur')}
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Alur Fitur
                            </a>
                            <a
                                href="#preview"
                                onClick={(e) => handleSmoothScroll(e, '#preview')}
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Simulasi
                            </a>
                            <a
                                href="#peran"
                                onClick={(e) => handleSmoothScroll(e, '#peran')}
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Pengguna
                            </a>
                            <a
                                href="#perbandingan"
                                onClick={(e) => handleSmoothScroll(e, '#perbandingan')}
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Perbandingan
                            </a>
                            <a
                                href="#harga"
                                onClick={(e) => handleSmoothScroll(e, '#harga')}
                                className="flex items-center gap-1.5 rounded-full bg-blue-50/80 px-3 py-1 font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
                            >
                                <Coins className="size-3.5" />
                                Biaya & Paket
                            </a>
                            <a
                                href="#faq"
                                onClick={(e) => handleSmoothScroll(e, '#faq')}
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                FAQ BOS
                            </a>
                        </nav>

                        {/* Actions Right */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            {auth?.user ? (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                    >
                                        Masuk Akun Lain
                                    </Link>
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-800"
                                    >
                                        <span>Buka Dashboard</span>
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="hidden sm:inline-flex rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setIsDemoRoleModalOpen(true)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-98"
                                    >
                                        <span>Coba Demo</span>
                                        <ArrowRight className="size-3.5" />
                                    </button>
                                </>
                            )}

                            {/* 3-Strip Hamburger Menu Button (Mobile / Tablet < lg) */}
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex lg:hidden items-center justify-center p-2 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-blue-400 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                                aria-label="Toggle navigation menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="size-5" />
                                ) : (
                                    <Menu className="size-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown Menu with 3-strip navigation links */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden w-full border-t border-slate-200/90 bg-white/95 px-5 py-5 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-[#070b14]/95 animate-in fade-in slide-in-from-top-2 duration-200">
                            <nav className="flex flex-col gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                                <a
                                    href="#fitur"
                                    onClick={(e) => handleSmoothScroll(e, '#fitur')}
                                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                                >
                                    <span>Alur Fitur</span>
                                    <ArrowRight className="size-4 text-slate-400" />
                                </a>
                                <a
                                    href="#preview"
                                    onClick={(e) => handleSmoothScroll(e, '#preview')}
                                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                                >
                                    <span>Simulasi Dashboard</span>
                                    <ArrowRight className="size-4 text-slate-400" />
                                </a>
                                <a
                                    href="#peran"
                                    onClick={(e) => handleSmoothScroll(e, '#peran')}
                                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                                >
                                    <span>Pengguna & Peran</span>
                                    <ArrowRight className="size-4 text-slate-400" />
                                </a>
                                <a
                                    href="#perbandingan"
                                    onClick={(e) => handleSmoothScroll(e, '#perbandingan')}
                                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                                >
                                    <span>Perbandingan Tanggapin</span>
                                    <ArrowRight className="size-4 text-slate-400" />
                                </a>
                                <a
                                    href="#harga"
                                    onClick={(e) => handleSmoothScroll(e, '#harga')}
                                    className="flex items-center justify-between rounded-xl bg-blue-50 px-3.5 py-2.5 font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Coins className="size-4" />
                                        Biaya & Paket BOS
                                    </span>
                                    <ArrowRight className="size-4 text-blue-600 dark:text-blue-400" />
                                </a>
                                <a
                                    href="#faq"
                                    onClick={(e) => handleSmoothScroll(e, '#faq')}
                                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                                >
                                    <span>FAQ BOS Sekolah</span>
                                    <ArrowRight className="size-4 text-slate-400" />
                                </a>

                                <div className="mt-2 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
                                    {auth?.user ? (
                                        <>
                                            <Link
                                                href={dashboard()}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-center text-sm font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
                                            >
                                                Buka Dashboard
                                                <ArrowRight className="size-4" />
                                            </Link>
                                            <Link
                                                href="/login"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
                                            >
                                                Masuk Akun Lain
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    setIsDemoRoleModalOpen(true);
                                                }}
                                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-center text-sm font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
                                            >
                                                <span>Coba Demo Langsung</span>
                                                <ArrowRight className="size-4" />
                                            </button>
                                            <Link
                                                href="/login"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
                                            >
                                                Masuk Akun
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </div>
                    )}
                </header>

                {/* 2. Hero Section - Refined Minimalist Editorial (Zero AI Slop) */}
                <main className="flex-1">
                    <section className="relative overflow-hidden w-full pt-24 sm:pt-28 pb-14 sm:pb-16 text-center">
                        {/* Interactive Aurora Floating Character Background (Hero only, full width smooth fade out at bottom) */}
                        <AuroraCharacterBackground />

                        {/* Bottom smooth gradient transition ensuring seamless dissolution at 75% zoom and wider viewports */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f8fafc] dark:from-[#090d16] via-[#f8fafc]/70 dark:via-[#090d16]/70 to-transparent pointer-events-none z-1" />

                        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-3xl space-y-6">
                            {/* Minimalist Editorial Pill Tag */}
                            <div className="inline-flex items-center justify-center">
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1 text-xs font-medium text-slate-700 shadow-2xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
                                    <span className="size-1.5 rounded-full bg-blue-600" />
                                    Platform Operasional Tindak Lanjut Siswa Sekolah
                                </span>
                            </div>

                            {/* Clean, Dignified Display Typography with Cinematic Mask Slide Animation */}
                            <CinematicHeadline
                                text="Deteksi Lebih Awal. Dampingi Lebih Tepat."
                                as="h1"
                                className="text-4xl leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
                                highlightText="Dampingi Lebih Tepat."
                                highlightClassName="text-blue-700 dark:text-blue-400"
                            />

                            {/* Human-Centered Plain Indonesian Subtext (Zero AI Slop) */}
                            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                                Tanggapin menghubungkan catatan presensi harian, kendala belajar, dan penanganan BK menjadi langkah pendampingan nyata yang terkoordinasi jelas antara wali kelas, guru BK, dan orang tua.
                            </p>

                            {/* Primary Interactive CTA Area */}
                            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDemoRoleModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-98 sm:text-sm"
                                >
                                    Coba Demo Langsung
                                    <ArrowRight className="size-4" />
                                </button>
                                <a
                                    href="#preview"
                                    onClick={(e) => handleSmoothScroll(e, '#preview')}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-semibold text-slate-800 shadow-xs transition-colors hover:bg-slate-50 sm:text-sm dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    <Eye className="size-4 text-slate-500" />
                                    Lihat Simulasi Sistem
                                </a>
                                <a
                                    href="#harga"
                                    onClick={(e) => handleSmoothScroll(e, '#harga')}
                                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/60 px-5 py-3.5 text-xs font-bold text-blue-700 shadow-xs transition-colors hover:bg-blue-100 sm:text-sm dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/40"
                                >
                                    <Coins className="size-4 text-blue-700 dark:text-blue-400" />
                                    Biaya & Paket
                                </a>
                            </div>

                            {/* Value Anchors */}
                            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                                    Alur tindak lanjut terkoordinasi
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                                    Komunikasi resmi ber-tanda terima
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                                    100% Sesuai Juknis BOS & TPPK
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                    {/* 2. Feature Flow with AnimatedStepper Showcase & Bento Grid */}
                    <section
                        id="fitur"
                        className="mx-auto max-w-7xl px-4 py-14 sm:py-16 sm:px-6 lg:px-8 scroll-mt-24"
                    >
                        <div className="mx-auto mb-10 max-w-3xl text-center">
                            <span className="text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                Alur Fitur Terpadu
                            </span>
                            <div className="mt-1">
                                <CinematicHeadline
                                    text="4 Langkah Nyata Dari Data Menjadi Solusi"
                                    as="h2"
                                    className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
                                    highlightText="Dari Data Menjadi Solusi"
                                    highlightClassName="text-blue-700 dark:text-blue-400"
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                Jelajahi bagaimana Tanggapin menghubungkan deteksi sinyal dini, telaah konteks siswa 360°, penugasan tindak lanjut, hingga pelaporan otomatis ke orang tua.
                            </p>
                        </div>

                        {/* Interactive Animated Stepper Showcase */}
                        <div className="mb-12">
                            <AnimatedStepper
                                onFinalStepCompleted={() => setIsDemoRoleModalOpen(true)}
                                nextButtonText="Langkah Selanjutnya"
                                backButtonText="Sebelumnya"
                            >
                                <Step title="Langkah 1: Deteksi Sinyal Otomatis & Early Warning">
                                    <p className="mb-4">
                                        Algoritma cerdas Tanggapin menganalisis data presensi harian, grafik nilai produktif, dan pola ketertiban siswa tanpa rekapitulasi manual yang membebani guru.
                                    </p>
                                    <div className="rounded-xl border border-blue-200/70 bg-blue-50/40 p-4 sm:p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                    <ShieldAlert className="size-4.5" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                        Sinyal Peringatan: 3 Hari Berturut-turut Alfa
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        Siswa: Rian Prasetya Kelas XI-RPL 2 • Indikasi Risiko Drop Out
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="self-start sm:self-auto rounded-md bg-blue-900 text-white dark:bg-blue-600 px-2.5 py-1 text-[10px] font-bold">
                                                Prioritas Tinggi
                                            </span>
                                        </div>
                                    </div>
                                </Step>

                                <Step title="Langkah 2: Konteks Siswa 360° & Konseling BK">
                                    <p className="mb-4">
                                        Wali kelas dan Guru BK meninjau profil lengkap siswa sebelum mengambil keputusan: riwayat pembinaan, catatan keluarga, dan linimasa konseling berprivasi tinggi.
                                    </p>
                                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/40">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                                            <div className="rounded-lg border border-slate-200/60 bg-white p-3 shadow-2xs dark:border-slate-700/60 dark:bg-slate-800">
                                                <div className="text-base font-bold text-blue-700 dark:text-blue-400">92.4%</div>
                                                <div className="text-[11px] text-slate-500">Tingkat Kehadiran</div>
                                            </div>
                                            <div className="rounded-lg border border-slate-200/60 bg-white p-3 shadow-2xs dark:border-slate-700/60 dark:bg-slate-800">
                                                <div className="text-base font-bold text-slate-900 dark:text-slate-100">2 Sesi</div>
                                                <div className="text-[11px] text-slate-500">Konseling BK</div>
                                            </div>
                                            <div className="rounded-lg border border-slate-200/60 bg-white p-3 shadow-2xs dark:border-slate-700/60 dark:bg-slate-800">
                                                <div className="text-base font-bold text-blue-700 dark:text-blue-400">Terkendali</div>
                                                <div className="text-[11px] text-slate-500">Status Pembinaan</div>
                                            </div>
                                        </div>
                                    </div>
                                </Step>

                                <Step title="Langkah 3: Rencana Tindak Lanjut & Penugasan PIC">
                                    <p className="mb-4">
                                        Langkah intervensi didelegasikan dengan PIC terukur: konseling individual, bimbingan remedial, kunjungan rumah home visit, atau pelibatan Tim TPPK.
                                    </p>
                                    <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                        <div className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-slate-100 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-800/50">
                                            <span className="flex items-center gap-2 font-medium">
                                                <CheckCircle2 className="size-4 text-blue-700 dark:text-blue-400" />
                                                Home visit bersama Tim Kesiswaan & Satgas ATS
                                            </span>
                                            <span className="text-[10px] font-semibold text-slate-400">PIC: Guru BK</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-slate-100 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-800/50">
                                            <span className="flex items-center gap-2 font-medium">
                                                <CheckCircle2 className="size-4 text-blue-700 dark:text-blue-400" />
                                                Penyusunan komitmen kehadiran & target kelas
                                            </span>
                                            <span className="text-[10px] font-semibold text-slate-400">PIC: Wali Kelas</span>
                                        </div>
                                    </div>
                                </Step>

                                <Step title="Langkah 4: Generator Rapor AI & WhatsApp Ber-Tanda Terima">
                                    <p className="mb-4">
                                        Asisten AI menyusun evaluasi perkembangan karakter secara objektif, lalu mendistribusikannya otomatis ke WhatsApp orang tua dengan tanda terima digital resmi.
                                    </p>
                                    <div className="rounded-xl border border-blue-200/70 bg-blue-50/40 p-4 sm:p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-blue-950 dark:text-blue-300">
                                                Notifikasi WhatsApp Resmi Terverifikasi
                                            </span>
                                            <span className="rounded-md bg-blue-700 px-2 py-0.5 text-[9px] font-bold text-white">
                                                Tanda Terima Sah
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                                            "Laporan perkembangan karakter dan kehadiran ananda Rian Prasetya telah berhasil diterima dan dikonfirmasi oleh wali murid pada 08:15 WIB."
                                        </p>
                                    </div>
                                </Step>
                            </AnimatedStepper>
                        </div>
                    </section>

                    {/* 3. Interactive Live Dashboard Video Simulation */}
                    <section
                        id="preview"
                        className="border-y border-slate-200/80 bg-slate-50/50 backdrop-blur-xs py-14 sm:py-20 dark:border-slate-800/80 dark:bg-[#0b1120] scroll-mt-24"
                    >
                        <DashboardVideoPreview
                            onExploreDemo={() => setIsDemoRoleModalOpen(true)}
                        />
                    </section>

                    {/* 4. Target User Roles Section */}
                    <section
                        id="peran"
                        className="mx-auto max-w-7xl px-4 py-14 sm:py-16 sm:px-6 lg:px-8 scroll-mt-24"
                    >
                        <div className="mx-auto mb-10 sm:mb-12 max-w-3xl text-center">
                            <span className="text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                Pengguna Sekolah
                            </span>
                            <div className="mt-1">
                                <CinematicHeadline
                                    text="Satu Alur untuk Seluruh Tim Sekolah"
                                    as="h2"
                                    className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
                                    highlightText="Seluruh Tim Sekolah"
                                    highlightClassName="text-blue-700 dark:text-blue-400"
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                Tanggapin menyesuaikan tampilan antarmuka sesuai
                                tanggung jawab masing-masing pendidik.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {roles.map((r) => {
                                const IconComponent = r.icon;
                                return (
                                    <div
                                        key={r.title}
                                        className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-[#0f172a]"
                                    >
                                        <div className="flex size-9 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                            <IconComponent className="size-4.5" />
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

                    {/* 5. Editorial Comparison - The Tanggapin Difference */}
                    <section
                        id="perbandingan"
                        className="border-y border-slate-200/80 bg-slate-50/50 backdrop-blur-xs py-14 sm:py-16 dark:border-slate-800/80 dark:bg-[#0b1120] scroll-mt-24"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-10 sm:mb-12 max-w-3xl text-center">
                                <span className="text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                    Perbandingan Pendekatan
                                </span>
                                <div className="mt-1">
                                    <CinematicHeadline
                                        text="Mengapa Cara Lama Perlu Ditingkatkan"
                                        as="h2"
                                        className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
                                        highlightText="Perlu Ditingkatkan"
                                        highlightClassName="text-blue-700 dark:text-blue-400"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                    Data operasional sekolah sering terpisah dan
                                    lebih banyak digunakan untuk laporan
                                    administratif daripada penyelamatan siswa.
                                </p>
                            </div>

                            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Cara Lama */}
                                <div className="space-y-5 rounded-xl border border-slate-200/80 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0f172a]">
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
                                <div className="space-y-5 rounded-xl border border-blue-200/80 bg-white p-6 sm:p-7 dark:border-blue-900/60 dark:bg-[#111c30]">
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



                    {/* 7. Biaya & Paket Investasi Sekolah (Pricing) */}
                    <MixpanelPricing
                        onSelectPlan={(planId) => {
                            setProposalPlan(planId);
                            setIsProposalModalOpen(true);
                        }}
                    />

                    {/* 8. FAQ Biaya & Pengadaan BOS Section */}
                    <section
                        id="faq"
                        className="border-t border-slate-200/80 bg-slate-50/70 py-14 sm:py-16 dark:border-slate-800/80 dark:bg-[#0b1120] scroll-mt-24"
                    >
                        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-10 text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
                                    <HelpCircle className="size-3.5" />
                                    Tanya Jawab Pengadaan
                                </span>
                                <div className="mt-3">
                                    <CinematicHeadline
                                        text="Pertanyaan Umum Seputar Biaya & Pengadaan BOS"
                                        as="h2"
                                        className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
                                        highlightText="Biaya & Pengadaan BOS"
                                        highlightClassName="text-blue-700 dark:text-blue-400"
                                    />
                                </div>
                                <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                    Informasi lengkap bagi Kepala Sekolah, Bendahara BOS, dan Pengurus Yayasan sebelum memulai implementasi.
                                </p>
                            </div>

                            {/* FAQ Accordion with Fluid Motion Animation */}
                            <div className="space-y-3.5">
                                {PRICING_FAQS.map((faq, index) => {
                                    const isOpen = faqOpenIndex === index;
                                    return (
                                        <motion.div
                                            key={index}
                                            layout
                                            className={cn(
                                                'overflow-hidden rounded-xl border bg-white transition-all duration-200 dark:bg-[#0f172a]',
                                                isOpen
                                                    ? 'border-blue-300 shadow-xs dark:border-blue-800/80'
                                                    : 'border-slate-200/80 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                                            )}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                                                className="flex w-full items-center justify-between p-5 text-left text-xs font-bold sm:text-sm cursor-pointer select-none"
                                            >
                                                <span className={cn('transition-colors', isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white')}>
                                                    {faq.q}
                                                </span>
                                                <motion.div
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                    className={cn(
                                                        'ml-4 flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                                                        isOpen
                                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                    )}
                                                >
                                                    <ChevronDown className="size-4" />
                                                </motion.div>
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        key="content"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                        className="overflow-hidden border-t border-slate-100 dark:border-slate-800/80"
                                                    >
                                                        <div className="px-5 pt-3 pb-5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                                            {faq.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* 10. Final Call to Action Section */}
                    <section className="border-t border-slate-200 bg-slate-50 py-14 sm:py-16 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
                            <CinematicHeadline
                                text="Mulai Terapkan Tanggapin di Sekolah Anda"
                                as="h2"
                                className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
                                highlightText="Tanggapin di Sekolah Anda"
                                highlightClassName="text-blue-700 dark:text-blue-400"
                            />
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

                {/* 11. Rich Footer - High Contrast & Clearly Visible Text */}
                <footer className="relative z-20 border-t border-slate-800 bg-[#070b14] py-12 sm:py-14 text-xs text-slate-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
                            {/* Brand & Mission */}
                            <div className="space-y-4 lg:col-span-2">
                                <TanggapinLogo size="md" showDescriptor={true} variant="light" />
                                <p className="max-w-sm text-xs leading-relaxed text-slate-300">
                                    Platform operasional sekolah terpadu untuk deteksi dini risiko siswa, penanganan kasus BK beretika, pencegahan Anak Tidak Sekolah ATS, dan kepatuhan regulasi TPPK Kemendikbudristek.
                                </p>
                                <div className="inline-block rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-[11px] text-slate-300">
                                    ✓ 100% Kompatibel dengan Petunjuk Teknis Dana BOSP Permendikbudristek No. 63/2023.
                                </div>
                            </div>

                            {/* Navigasi Utama */}
                            <div className="space-y-3">
                                <div className="text-sm font-bold text-white tracking-tight">
                                    Navigasi
                                </div>
                                <ul className="space-y-2.5 text-xs text-slate-300">
                                    <li>
                                        <a href="#fitur" onClick={(e) => handleSmoothScroll(e, '#fitur')} className="hover:text-white transition-colors">Alur Fitur</a>
                                    </li>
                                    <li>
                                        <a href="#preview" onClick={(e) => handleSmoothScroll(e, '#preview')} className="hover:text-white transition-colors">Simulasi Interaktif</a>
                                    </li>
                                    <li>
                                        <a href="#peran" onClick={(e) => handleSmoothScroll(e, '#peran')} className="hover:text-white transition-colors">Pengguna Sekolah</a>
                                    </li>
                                    <li>
                                        <a href="#perbandingan" onClick={(e) => handleSmoothScroll(e, '#perbandingan')} className="hover:text-white transition-colors">Perbandingan</a>
                                    </li>
                                    <li>
                                        <a href="#harga" onClick={(e) => handleSmoothScroll(e, '#harga')} className="hover:text-white transition-colors">Biaya & Paket BOS</a>
                                    </li>
                                    <li>
                                        <a href="#faq" onClick={(e) => handleSmoothScroll(e, '#faq')} className="hover:text-white transition-colors">FAQ BOS</a>
                                    </li>
                                </ul>
                            </div>

                            {/* 11 Modul Terpadu */}
                            <div className="space-y-3">
                                <div className="text-sm font-bold text-white tracking-tight">
                                    Modul Unggulan
                                </div>
                                <ul className="space-y-2.5 text-xs text-slate-300">
                                    <li>Early Warning Presensi Siswa</li>
                                    <li>Alur Linimasa Kasus BK</li>
                                    <li>Mitigasi Anak Tidak Sekolah ATS</li>
                                    <li>Validasi Residu Dapodik</li>
                                    <li>Tim Siaga TPPK & Insiden</li>
                                    <li>Generator Rapor Karakter AI</li>
                                </ul>
                            </div>

                            {/* Kontak & Legalitas */}
                            <div className="space-y-3">
                                <div className="text-sm font-bold text-white tracking-tight">
                                    Kemitraan & Dukungan
                                </div>
                                <p className="text-xs text-slate-400">
                                    Konsultasi Rencana Anggaran Sekolah RKAS & Pengadaan SIPLah:
                                </p>
                                <div className="space-y-1.5 text-xs">
                                    <div className="font-semibold text-white">
                                        halo@tanggapin.sch.id
                                    </div>
                                    <div className="text-slate-300">Hotline: +62 812-9988-7766</div>
                                    <div className="text-slate-400">Senin – Jumat pukul 08.00 – 17.00 WIB</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 sm:flex-row text-xs text-slate-400">
                            <div>
                                © {new Date().getFullYear()} TANGGAPIN. Hak Cipta Dilindungi Undang-Undang.
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-slate-300 font-medium">Deteksi lebih cepat. Tindak lebih tepat.</span>
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
                            className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
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

                            <div className="max-h-[70vh] space-y-2 overflow-y-auto p-5 sm:p-6">
                                {DEMO_ROLES.map((role) => {
                                    const IconComp = role.icon;
                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() =>
                                                handleSelectDemoRole(role.id)
                                            }
                                            className="group flex w-full items-start gap-3.5 rounded-lg border border-slate-200/80 p-3.5 text-left transition-all hover:border-blue-700 hover:bg-blue-50/40 hover:shadow-2xs dark:border-slate-800 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
                                        >
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-200/80 bg-blue-50 text-blue-700 transition-colors group-hover:border-blue-700 group-hover:bg-blue-700 group-hover:text-white dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                                                <IconComp className="size-4.5" />
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
                                                <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
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
                            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
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
                                            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                                                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                                                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                                                        'flex cursor-pointer items-center justify-between rounded-lg border p-3 text-xs transition-all',
                                                        proposalPlan === plan.id
                                                            ? 'border-blue-700 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30'
                                                            : 'border-slate-200/80 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
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

                                    <div className="rounded-lg border border-blue-200/80 bg-blue-50/60 p-3 text-[11px] text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                                        <p className="font-semibold">Kode Rekening RKAS Dana BOS:</p>
                                        <p className="mt-0.5 text-blue-800 dark:text-blue-300/80">
                                            Komponen Pemeliharaan Sarana / Sistem Informasi Manajemen Sekolah Digital Permendikbud 63/2023.
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
                                        <pre className="max-h-[360px] overflow-auto rounded-lg border border-slate-200 bg-white p-4 font-mono text-[11px] leading-relaxed text-slate-800 shadow-inner select-all dark:border-slate-800 dark:bg-[#0b1120] dark:text-slate-200">
                                            {generateProposalText()}
                                        </pre>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5 pt-3">
                                        <button
                                            type="button"
                                            onClick={handleCopyProposal}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                        >
                                            {proposalCopied ? (
                                                <>
                                                    <Check className="size-3.5 text-blue-700 dark:text-blue-400" />
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
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition-all hover:bg-blue-800 active:scale-98"
                                        >
                                            <Download className="size-3.5" />
                                            <span>Unduh File TXT</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Floating Scroll-Up Button with Smooth Framer Motion Entrance */}
                <AnimatePresence>
                    {showScrollTop && (
                        <motion.button
                            type="button"
                            onClick={scrollToTop}
                            initial={{ opacity: 0, y: 16, scale: 0.85 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.85 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            aria-label="Kembali ke atas"
                            title="Kembali ke atas"
                            className="fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full border border-blue-200/90 bg-white/95 text-blue-700 shadow-lg backdrop-blur-md transition-colors hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-900/70 dark:bg-slate-900/95 dark:text-blue-400 dark:hover:border-blue-500 dark:hover:bg-blue-600 dark:hover:text-white cursor-pointer"
                        >
                            <ArrowUp className="size-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
