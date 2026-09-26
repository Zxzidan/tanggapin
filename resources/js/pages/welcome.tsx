import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock,
    FileText,
    GraduationCap,
    Lock,
    PhoneCall,
    Search,
    Shield,
    ShieldAlert,
    Siren,
    Sparkles,
    UserCheck,
    Users,
    WalletCards,
} from 'lucide-react';
import React, { useState } from 'react';
import TanggapinLogo from '@/components/tanggapin-logo';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>().props;
    const [previewTab, setPreviewTab] = useState<'early_warning' | 'cases' | 'class_health' | 'communication'>('early_warning');

    const workflowSteps = [
        {
            number: '01',
            title: 'Kenali Sinyal',
            desc: 'Sistem menangkap indikator awal dari absensi, pola pelanggaran, penurunan nilai, dan catatan pendukung.',
            icon: AlertTriangle,
            badge: 'Deteksi Otomatis',
        },
        {
            number: '02',
            title: 'Tinjau & Validasi',
            desc: 'Wali kelas dan guru BK memahami konteks siswa secara manusiawi tanpa label negatif.',
            icon: Search,
            badge: 'Konteks Siswa 360°',
        },
        {
            number: '03',
            title: 'Tindak Lanjut Tepat',
            desc: 'Tindakan konkret ditentukan dengan PIC yang jelas: konseling, bimbingan belajar, atau home visit.',
            icon: CheckCircle2,
            badge: 'PIC & Target Jelas',
        },
        {
            number: '04',
            title: 'Koordinasi Terstruktur',
            desc: 'Komunikasi resmi sekolah ke orang tua terkirim dengan status acknowledgement yang terukur.',
            icon: PhoneCall,
            badge: 'Resmi & Transparan',
        },
        {
            number: '05',
            title: 'Dokumentasi & Hasil',
            desc: 'Setiap proses tercatat otomatis dalam linimasa digital untuk evaluasi dan akuntabilitas sekolah.',
            icon: GraduationCap,
            badge: 'Terdokumentasi Rapi',
        },
    ];

    const roles = [
        {
            title: 'Wali Kelas',
            badge: 'Garda Depan',
            desc: 'Melihat indikator kesehatan kelas dalam satu layar dan segera bertindak ketika siswa membutuhkan bantuan.',
            icon: GraduationCap,
        },
        {
            title: 'Guru BK & Konseling',
            badge: 'Case Manager',
            desc: 'Mengelola alur kasus dari laporan masuk, sesi konseling, komitmen siswa, hingga dokumentasi selesai.',
            icon: ShieldAlert,
        },
        {
            title: 'Kesiswaan & Disiplin',
            badge: 'Pembinaan',
            desc: 'Memantau pola kedisiplinan berulang dan mengoordinasikan langkah pembinaan secara objektif.',
            icon: Shield,
        },
        {
            title: 'Kepala Sekolah & Yayasan',
            badge: 'Pengambil Keputusan',
            desc: 'Melihat kondisi riil seluruh kelas, efektivitas penanganan kasus, serta kesiapsiagaan sekolah.',
            icon: Users,
        },
    ];

    return (
        <>
            <Head title="TANGGAPIN — Platform Tindak Lanjut Siswa | Kenali lebih cepat. Tanggapi lebih tepat." />

            <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#070b14] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors">
                {/* Navbar */}
                <header className="w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <TanggapinLogo size="md" showDescriptor={true} />
                        </Link>

                        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <a href="#masalah" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                                Masalah & Solusi
                            </a>
                            <a href="#workflow" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                                Alur Kerja
                            </a>
                            <a href="#preview" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                                Tampilan Sistem
                            </a>
                            <a href="#peran" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                                Target Pengguna
                            </a>
                        </div>

                        <nav className="flex items-center gap-2.5">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-all"
                                >
                                    Buka Dashboard
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <a
                                        href="/demo-login"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-all active:scale-95"
                                    >
                                        <Sparkles className="size-3.5" />
                                        <span>Demo Interaktif</span>
                                    </a>
                                    <Link
                                        href={login()}
                                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1">
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
                        <div className="max-w-3xl mx-auto space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/80">
                                <Sparkles className="size-3.5" />
                                <span>Platform Tindak Lanjut Siswa untuk Sekolah Indonesia</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                                Kenali lebih cepat.{' '}
                                <span className="text-blue-700 dark:text-blue-400 block sm:inline">
                                    Tanggapi lebih tepat.
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
                                TANGGAPIN membantu sekolah menghubungkan sinyal kondisi siswa dengan tindak lanjut nyata:
                                mengenali sinyal lebih dini, berkoordinasi terstruktur, dan mendokumentasikan proses pendampingan secara bermartabat.
                            </p>

                            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                                <a
                                    href="/demo-login"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md transition-all active:scale-95"
                                >
                                    Eksplorasi Demo Dashboard
                                    <ArrowRight className="size-4" />
                                </a>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl shadow-xs transition-colors"
                                >
                                    <Lock className="size-4 text-slate-400" />
                                    Portal Masuk Sekolah
                                </Link>
                            </div>

                            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                                    Bukan sekadar arsip Dapodik
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                                    Komunikasi resmi ber-acknowledgement
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Problem & Solution Comparison (PRD & Section 18) */}
                    <section id="masalah" className="py-16 bg-slate-100/70 dark:bg-[#0b1120] border-y border-slate-200 dark:border-slate-800/80">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                                    Tantangan Nyata di Sekolah
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                    Data Tersedia Banyak, Tetapi Tindakan Terlambat
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                                    Sekolah memiliki rekap absensi, nilai, dan pelanggaran. Namun saat masalah siswa memuncak, penanganannya sering reaktif di grup chat informal.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                                {/* The Old Way */}
                                <div className="p-6 rounded-2xl bg-white dark:bg-[#111c30] border border-red-200/80 dark:border-red-950 shadow-xs space-y-4">
                                    <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                                        <AlertTriangle className="size-4" />
                                        <span>Cara Lama: Reaktif & Tersebar</span>
                                    </div>
                                    <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 font-bold">✕</span>
                                            <span>Wali kelas harus menggabungkan absensi, nilai, dan catatan manual secara terpisah.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 font-bold">✕</span>
                                            <span>Siswa baru ditangani setelah pelanggaran bertumpuk atau sudah berbulan-bulan alpa.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 font-bold">✕</span>
                                            <span>Koordinasi penanganan tenggelam di chat WhatsApp tanpa penanggung jawab (PIC) definitif.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 font-bold">✕</span>
                                            <span>Orang tua merasa disalahkan tanpa adanya bukti data pendukung yang terstruktur.</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* The Tanggapin Way */}
                                <div className="p-6 rounded-2xl bg-white dark:bg-[#111c30] border border-blue-200 dark:border-blue-900 shadow-xs space-y-4 ring-1 ring-blue-500/20">
                                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                                        <CheckCircle2 className="size-4 text-blue-600" />
                                        <span>Solusi TANGGAPIN: Tindak Lanjut Terstruktur</span>
                                    </div>
                                    <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                                            <span><strong>Early Warning Otomatis:</strong> Mendeteksi pola ketidakhadiran & penurunan performa lebih dini.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                                            <span><strong>Pendekatan Human-Centered:</strong> Memahami kondisi siswa, bukan melabeli anak bermasalah.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                                            <span><strong>Workflow Kasus Terstruktur:</strong> Alur jelas dari laporan, konseling BK, komitmen, hingga tuntas.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                                            <span><strong>Komunikasi Ber-Acknowledgement:</strong> Pesan resmi berstatus tanda terima untuk kepastian tindak lanjut.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Operational Workflow (Section 18 & 24) */}
                    <section id="workflow" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                                Siklus Operasional Tanggapin
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                Sinyal → Tinjau → Tindak Lanjut → Koordinasi → Hasil
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                                Satu rantai proses sederhana yang memastikan tidak ada siswa yang luput dari pendampingan sekolah.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {workflowSteps.map((step) => {
                                const IconComponent = step.icon;
                                return (
                                    <div
                                        key={step.number}
                                        className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow relative flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xl font-black text-slate-300 dark:text-slate-700 font-mono">
                                                    {step.number}
                                                </span>
                                                <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                                                    <IconComponent className="size-4" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                                {step.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded">
                                                {step.badge}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Live Product Preview (Section 18: Tampilkan Interface Nyata) */}
                    <section id="preview" className="py-16 bg-slate-50 dark:bg-[#090d16] border-t border-slate-200 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-2xl mx-auto mb-10">
                                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                                    Tampilan Produk Nyata
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                    Dashboard Operasional yang Tanggap & Terstruktur
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                                    Bukan template SaaS generik. Dibangun khusus menjawab tiga pertanyaan: apa kondisi siswa, apa yang butuh perhatian, dan apa yang perlu dilakukan.
                                </p>
                            </div>

                            {/* Interactive Preview Container */}
                            <div className="max-w-5xl mx-auto rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                                {/* Preview Top Bar */}
                                <div className="px-4 py-3 bg-slate-100/80 dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="size-3 rounded-full bg-red-400" />
                                        <span className="size-3 rounded-full bg-amber-400" />
                                        <span className="size-3 rounded-full bg-emerald-400" />
                                        <span className="ms-2 text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">
                                            tanggapin.sch.id / dashboard
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                            ● Sistem Siap Pakai
                                        </span>
                                    </div>
                                </div>

                                {/* Preview Tab Selectors */}
                                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 text-xs font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewTab('early_warning')}
                                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                                            previewTab === 'early_warning'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        Early Warning Feed
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewTab('class_health')}
                                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                                            previewTab === 'class_health'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        Indikator Kondisi Kelas
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewTab('cases')}
                                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                                            previewTab === 'cases'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        Alur Kasus BK (Kanban)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewTab('communication')}
                                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                                            previewTab === 'communication'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        Komunikasi Terstruktur
                                    </button>
                                </div>

                                {/* Preview Body Content */}
                                <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-[#070b14]/50 min-h-[320px]">
                                    {previewTab === 'early_warning' && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-red-500 animate-ping" />
                                                    Priority Action Feed — Butuh Tindak Lanjut Segera
                                                </div>
                                                <span className="text-slate-500">4 sinyal prioritas</span>
                                            </div>
                                            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111c30] border border-red-200 dark:border-red-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-white">Brian Aditya</span>
                                                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">XI RPL 2</span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                                            Kehadiran & Nilai
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">• 10 menit lalu</span>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-300 leading-snug">
                                                        Kehadiran menurun drastis (28% ketidakhadiran dalam 14 hari) dan 2 tugas produktif belum terkumpul.
                                                    </p>
                                                    <div className="text-[11px] text-slate-400">
                                                        Wali: Hendra Setiawan, S.Pd • Ortu: Hadi Wicaksono
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded-lg shadow-xs">
                                                        + Buat Follow-up
                                                    </span>
                                                    <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                        Hubungi Ortu
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111c30] border border-amber-200 dark:border-amber-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-white">Ahmad Fauzan</span>
                                                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">X TKJ 1</span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                                            Pola Kedisiplinan
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">• 35 menit lalu</span>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-300 leading-snug">
                                                        Terdeteksi pola berulang: 3x terlambat berurutan dan atribut seragam tidak lengkap. Total 35 poin.
                                                    </p>
                                                    <div className="text-[11px] text-slate-400">
                                                        Wali: Dewi Sartika, M.Kom • Rekomendasi: Konseling BK
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded-lg shadow-xs">
                                                        + Buat Follow-up
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {previewTab === 'class_health' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                                            <div className="p-4 rounded-xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm">XI RPL 2</span>
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                                                        Perlu Perhatian
                                                    </span>
                                                </div>
                                                <div className="text-slate-500 text-[11px]">Rekayasa Perangkat Lunak • 36 Siswa</div>
                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block">Tingkat Hadir</span>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">91%</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block">Butuh Tindak Lanjut</span>
                                                        <span className="font-bold text-red-600">3 siswa</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm">XII AKL 2</span>
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                                                        Kondisi Baik
                                                    </span>
                                                </div>
                                                <div className="text-slate-500 text-[11px]">Akuntansi & Keuangan • 35 Siswa</div>
                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block">Tingkat Hadir</span>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">97%</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block">Butuh Tindak Lanjut</span>
                                                        <span className="font-bold text-emerald-600">1 siswa</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm">XI TKR 3</span>
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200">
                                                        Perlu Intervensi
                                                    </span>
                                                </div>
                                                <div className="text-slate-500 text-[11px]">Teknik Kendaraan Ringan • 32 Siswa</div>
                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block">Tingkat Hadir</span>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">86%</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block">Butuh Tindak Lanjut</span>
                                                        <span className="font-bold text-red-600">4 siswa</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {previewTab === 'cases' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                            <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-2">
                                                <div className="font-bold text-slate-900 dark:text-white text-xs flex justify-between">
                                                    <span>1. Kasus Baru Masuk</span>
                                                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px]">1</span>
                                                </div>
                                                <div className="p-2.5 rounded-lg bg-white dark:bg-[#162238] border border-slate-200 dark:border-slate-700 space-y-1">
                                                    <div className="font-bold text-slate-900 dark:text-white">Dimas Maulana</div>
                                                    <div className="text-[11px] text-slate-500">Peringatan otomatis: Alpa 5 hari berturut-turut.</div>
                                                    <div className="text-[10px] font-semibold text-blue-600 pt-1">Menunggu penugasan Guru BK</div>
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-2">
                                                <div className="font-bold text-slate-900 dark:text-white text-xs flex justify-between">
                                                    <span>2. Sedang Ditangani</span>
                                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px]">2</span>
                                                </div>
                                                <div className="p-2.5 rounded-lg bg-white dark:bg-[#162238] border border-slate-200 dark:border-slate-700 space-y-1">
                                                    <div className="font-bold text-slate-900 dark:text-white">Rian Pratama (CS-2025-089)</div>
                                                    <div className="text-[11px] text-slate-500">Konseling sesi 2 tuntas, surat komitmen dibuat.</div>
                                                    <div className="text-[10px] text-slate-400">PIC: Ibu Rahmawati (Guru BK)</div>
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-2">
                                                <div className="font-bold text-slate-900 dark:text-white text-xs flex justify-between">
                                                    <span>3. Selesai & Terdokumentasi</span>
                                                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px]">18</span>
                                                </div>
                                                <div className="p-2.5 rounded-lg bg-white dark:bg-[#162238] border border-slate-200 dark:border-slate-700 space-y-1">
                                                    <div className="font-bold text-slate-900 dark:text-white">18 Kasus Bulan Ini</div>
                                                    <div className="text-[11px] text-slate-500">Dokumen pembinaan & persetujuan orang tua tersimpan aman di arsip digital.</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {previewTab === 'communication' && (
                                        <div className="p-4 rounded-xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    Pemberitahuan Resmi Sekolah ke Orang Tua
                                                </div>
                                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded font-semibold">
                                                    ✓ Acknowledgement Terverifikasi
                                                </span>
                                            </div>
                                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-slate-700 space-y-1.5">
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="font-bold text-slate-900 dark:text-white">Kepada: Hadi Wicaksono (Wali Brian Aditya)</span>
                                                    <span className="text-slate-400">24 Sep, 08:15</span>
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    “Yth. Bapak Hadi Wicaksono, kami menginformasikan catatan ketidakhadiran ananda Brian yang memerlukan koordinasi bersama sekolah demi kelancaran proses belajar.”
                                                </p>
                                                <div className="flex items-center justify-between text-[11px] pt-1">
                                                    <span className="text-slate-400">Saluran: WhatsApp Terverifikasi & App</span>
                                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Status: Sudah Membaca & Dikonfirmasi</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Target Roles (Section 1) */}
                    <section id="peran" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                                Kolaborasi Antar Peran
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                Didesain Sesuai Tanggung Jawab Ekosistem Sekolah
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                                Setiap pihak sekolah memiliki sudut pandang yang berbeda, namun terhubung dalam satu tujuan bersama: keberhasilan dan perlindungan siswa.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {roles.map((r) => {
                                const IconComponent = r.icon;
                                return (
                                    <div
                                        key={r.title}
                                        className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow"
                                    >
                                        <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3">
                                            <IconComponent className="size-5" />
                                        </div>
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                                {r.title}
                                            </h3>
                                        </div>
                                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                                            {r.badge}
                                        </span>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                                            {r.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Final Call to Action */}
                    <section className="py-16 bg-blue-900 text-white text-center relative overflow-hidden">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-800 text-blue-200 border border-blue-700">
                                Siap Diterapkan di Sekolah Anda
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Mulai Kenali Lebih Cepat, Tanggapi Lebih Tepat Hari Ini
                            </h2>
                            <p className="text-sm sm:text-base text-blue-200 max-w-xl mx-auto font-normal leading-relaxed">
                                Jadikan sekolah Anda tempat di mana setiap anak diperhatikan kondisinya, didampingi proses belajarnya, dan didukung pertumbuhannya.
                            </p>
                            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                                <a
                                    href="/demo-login"
                                    className="px-6 py-3 text-xs sm:text-sm font-bold text-blue-900 bg-white hover:bg-blue-50 rounded-xl shadow-lg transition-transform active:scale-95"
                                >
                                    Masuk ke Demo Dashboard
                                </a>
                                <Link
                                    href={login()}
                                    className="px-5 py-3 text-xs sm:text-sm font-semibold text-white border border-blue-600 hover:bg-blue-800 rounded-xl transition-colors"
                                >
                                    Login Akun Sekolah
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 bg-white dark:bg-[#070b14] text-xs text-slate-500 dark:text-slate-400">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <TanggapinLogo size="sm" showDescriptor={true} />
                        </div>
                        <div className="text-center md:text-right">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                                TANGGAPIN — Platform Tindak Lanjut Siswa
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Kenali lebih cepat. Tanggapi lebih tepat. • Dirancang untuk Ekosistem Pendidikan Indonesia
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
