import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    GraduationCap,
    Lock,
    PhoneCall,
    Search,
    Shield,
    ShieldAlert,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import TanggapinLogo from '@/components/tanggapin-logo';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>()
        .props;
    const [previewTab, setPreviewTab] = useState<
        'early_warning' | 'cases' | 'class_health' | 'communication'
    >('early_warning');

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

            <div className="flex min-h-screen flex-col justify-between bg-[#fcfcfd] text-slate-800 transition-colors selection:bg-blue-600 selection:text-white dark:bg-[#070b14] dark:text-slate-100">
                {/* Navbar */}
                <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0b1120]/90">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center">
                            <TanggapinLogo size="md" showDescriptor={true} />
                        </Link>

                        <div className="hidden items-center gap-6 text-xs font-semibold text-slate-600 md:flex dark:text-slate-300">
                            <a
                                href="#masalah"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Masalah & Solusi
                            </a>
                            <a
                                href="#workflow"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Alur Kerja
                            </a>
                            <a
                                href="#preview"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Tampilan Sistem
                            </a>
                            <a
                                href="#peran"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Target Pengguna
                            </a>
                        </div>

                        <nav className="flex items-center gap-2.5">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-800"
                                >
                                    Buka Dashboard
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <a
                                        href="/demo-login"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-95"
                                    >
                                        <ArrowRight className="size-3.5" />
                                        <span>Demo Interaktif</span>
                                    </a>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="hidden rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:inline-block dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
                    <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 text-center sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl space-y-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/80 dark:bg-blue-950/70 dark:text-blue-300">
                                <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                <span>
                                    Platform Tindak Lanjut Siswa untuk Sekolah
                                    Indonesia
                                </span>
                            </div>

                            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                                Kenali lebih cepat.{' '}
                                <span className="block text-blue-700 sm:inline dark:text-blue-400">
                                    Tanggapi lebih tepat.
                                </span>
                            </h1>

                            <p className="mx-auto max-w-2xl text-base leading-relaxed font-normal text-slate-600 sm:text-lg dark:text-slate-300">
                                TANGGAPIN membantu sekolah menghubungkan sinyal
                                kondisi siswa dengan tindak lanjut nyata:
                                mengenali sinyal lebih dini, berkoordinasi
                                terstruktur, dan mendokumentasikan proses
                                pendampingan secara bermartabat.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                                <a
                                    href="/demo-login"
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-800 active:scale-95 sm:text-sm"
                                >
                                    Eksplorasi Demo Dashboard
                                    <ArrowRight className="size-4" />
                                </a>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-semibold text-slate-800 shadow-xs transition-colors hover:bg-slate-50 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80"
                                >
                                    <Lock className="size-4 text-slate-400" />
                                    Portal Masuk Sekolah
                                </Link>
                            </div>

                            <div className="flex items-center justify-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
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
                    <section
                        id="masalah"
                        className="border-y border-slate-200 bg-slate-100/70 py-16 dark:border-slate-800/80 dark:bg-[#0b1120]"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-12 max-w-2xl text-center">
                                <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                    Tantangan Nyata di Sekolah
                                </span>
                                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                                    Data Tersedia Banyak, Tetapi Tindakan
                                    Terlambat
                                </h2>
                                <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                    Sekolah memiliki rekap absensi, nilai, dan
                                    pelanggaran. Namun saat masalah siswa
                                    memuncak, penanganannya sering reaktif di
                                    grup chat informal.
                                </p>
                            </div>

                            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
                                {/* The Old Way */}
                                <div className="space-y-4 rounded-2xl border border-red-200/80 bg-white p-6 shadow-xs dark:border-red-950 dark:bg-[#111c30]">
                                    <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                                        <AlertTriangle className="size-4" />
                                        <span>
                                            Cara Lama: Reaktif & Tersebar
                                        </span>
                                    </div>
                                    <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-red-500">
                                                ✕
                                            </span>
                                            <span>
                                                Wali kelas harus menggabungkan
                                                absensi, nilai, dan catatan
                                                manual secara terpisah.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-red-500">
                                                ✕
                                            </span>
                                            <span>
                                                Siswa baru ditangani setelah
                                                pelanggaran bertumpuk atau sudah
                                                berbulan-bulan alpa.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-red-500">
                                                ✕
                                            </span>
                                            <span>
                                                Koordinasi penanganan tenggelam
                                                di chat WhatsApp tanpa
                                                penanggung jawab PIC definitif.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-red-500">
                                                ✕
                                            </span>
                                            <span>
                                                Orang tua merasa disalahkan
                                                tanpa adanya bukti data
                                                pendukung yang terstruktur.
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                {/* The Tanggapin Way */}
                                <div className="space-y-4 rounded-2xl border border-blue-200 bg-white p-6 shadow-xs ring-1 ring-blue-500/20 dark:border-blue-900 dark:bg-[#111c30]">
                                    <div className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400">
                                        <CheckCircle2 className="size-4 text-blue-600" />
                                        <span>
                                            Solusi TANGGAPIN: Tindak Lanjut
                                            Terstruktur
                                        </span>
                                    </div>
                                    <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                ✓
                                            </span>
                                            <span>
                                                <strong>
                                                    Early Warning Otomatis:
                                                </strong>{' '}
                                                Mendeteksi pola ketidakhadiran &
                                                penurunan performa lebih dini.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                ✓
                                            </span>
                                            <span>
                                                <strong>
                                                    Pendekatan Human-Centered:
                                                </strong>{' '}
                                                Memahami kondisi siswa, bukan
                                                melabeli anak bermasalah.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                ✓
                                            </span>
                                            <span>
                                                <strong>
                                                    Workflow Kasus Terstruktur:
                                                </strong>{' '}
                                                Alur jelas dari laporan,
                                                konseling BK, komitmen, hingga
                                                tuntas.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                ✓
                                            </span>
                                            <span>
                                                <strong>
                                                    Komunikasi
                                                    Ber-Acknowledgement:
                                                </strong>{' '}
                                                Pesan resmi berstatus tanda
                                                terima untuk kepastian tindak
                                                lanjut.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Operational Workflow (Section 18 & 24) */}
                    <section
                        id="workflow"
                        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto mb-14 max-w-2xl text-center">
                            <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                Siklus Operasional Tanggapin
                            </span>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                                Sinyal → Tinjau → Tindak Lanjut → Koordinasi →
                                Hasil
                            </h2>
                            <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                Satu rantai proses sederhana yang memastikan
                                tidak ada siswa yang luput dari pendampingan
                                sekolah.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            {workflowSteps.map((step) => {
                                const IconComponent = step.icon;
                                return (
                                    <div
                                        key={step.number}
                                        className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs dark:border-slate-800 dark:bg-[#0f172a]"
                                    >
                                        <div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="font-mono text-xl font-black text-slate-300 dark:text-slate-700">
                                                    {step.number}
                                                </span>
                                                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                    <IconComponent className="size-4" />
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {step.title}
                                            </h3>
                                            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                                {step.desc}
                                            </p>
                                        </div>
                                        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                                            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/80 dark:text-blue-400">
                                                {step.badge}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Live Product Preview (Section 18: Tampilkan Interface Nyata) */}
                    <section
                        id="preview"
                        className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-[#090d16]"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-10 max-w-2xl text-center">
                                <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                    Tampilan Produk Nyata
                                </span>
                                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                                    Dashboard Operasional yang Tanggap &
                                    Terstruktur
                                </h2>
                                <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                    Bukan template SaaS generik. Dibangun khusus
                                    menjawab tiga pertanyaan: apa kondisi siswa,
                                    apa yang butuh perhatian, dan apa yang perlu
                                    dilakukan.
                                </p>
                            </div>

                            {/* Interactive Preview Container */}
                            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0f172a]">
                                {/* Preview Top Bar */}
                                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/80 px-4 py-3 dark:border-slate-800 dark:bg-[#111c30]">
                                    <div className="flex items-center gap-2">
                                        <span className="size-3 rounded-full bg-red-400" />
                                        <span className="size-3 rounded-full bg-amber-400" />
                                        <span className="size-3 rounded-full bg-emerald-400" />
                                        <span className="ms-2 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                                            tanggapin.sch.id / dashboard
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                                            ● Sistem Siap Pakai
                                        </span>
                                    </div>
                                </div>

                                {/* Preview Tab Selectors */}
                                <div className="flex flex-wrap gap-2 border-b border-slate-200 px-4 py-2 text-xs font-semibold dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPreviewTab('early_warning')
                                        }
                                        className={`rounded-lg px-3 py-1.5 transition-colors ${
                                            previewTab === 'early_warning'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        Early Warning Feed
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPreviewTab('class_health')
                                        }
                                        className={`rounded-lg px-3 py-1.5 transition-colors ${
                                            previewTab === 'class_health'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        Indikator Kondisi Kelas
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewTab('cases')}
                                        className={`rounded-lg px-3 py-1.5 transition-colors ${
                                            previewTab === 'cases'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        Alur Kasus BK
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPreviewTab('communication')
                                        }
                                        className={`rounded-lg px-3 py-1.5 transition-colors ${
                                            previewTab === 'communication'
                                                ? 'bg-blue-700 text-white shadow-xs'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        Komunikasi Terstruktur
                                    </button>
                                </div>

                                {/* Preview Body Content */}
                                <div className="min-h-[320px] bg-slate-50/50 p-5 sm:p-6 dark:bg-[#070b14]/50">
                                    {previewTab === 'early_warning' && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs dark:border-slate-800">
                                                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                                    <span className="size-2 animate-ping rounded-full bg-red-500" />
                                                    Priority Action Feed — Butuh
                                                    Tindak Lanjut Segera
                                                </div>
                                                <span className="text-slate-500">
                                                    4 sinyal prioritas
                                                </span>
                                            </div>
                                            <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-white p-3.5 text-xs shadow-xs sm:flex-row sm:items-center dark:border-red-900/60 dark:bg-[#111c30]">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-white">
                                                            Brian Aditya
                                                        </span>
                                                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            XI RPL 2
                                                        </span>
                                                        <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                                                            Kehadiran & Nilai
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            • 10 menit lalu
                                                        </span>
                                                    </div>
                                                    <p className="leading-snug text-slate-600 dark:text-slate-300">
                                                        Kehadiran menurun
                                                        drastis 28% dalam 14
                                                        hari dan 2 tugas
                                                        produktif belum
                                                        terkumpul.
                                                    </p>
                                                    <div className="text-[11px] text-slate-400">
                                                        Wali: Hendra Setiawan,
                                                        S.Pd • Ortu: Hadi
                                                        Wicaksono
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    <span className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs">
                                                        + Buat Follow-up
                                                    </span>
                                                    <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                        Hubungi Ortu
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-white p-3.5 text-xs shadow-xs sm:flex-row sm:items-center dark:border-amber-900/60 dark:bg-[#111c30]">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-white">
                                                            Ahmad Fauzan
                                                        </span>
                                                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            X TKJ 1
                                                        </span>
                                                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                                            Pola Kedisiplinan
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            • 35 menit lalu
                                                        </span>
                                                    </div>
                                                    <p className="leading-snug text-slate-600 dark:text-slate-300">
                                                        Terdeteksi pola
                                                        berulang: 3x terlambat
                                                        berurutan dan atribut
                                                        seragam tidak lengkap.
                                                        Total 35 poin.
                                                    </p>
                                                    <div className="text-[11px] text-slate-400">
                                                        Wali: Dewi Sartika,
                                                        M.Kom • Rekomendasi:
                                                        Konseling BK
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    <span className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs">
                                                        + Buat Follow-up
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {previewTab === 'class_health' && (
                                        <div className="grid grid-cols-1 gap-3.5 text-xs sm:grid-cols-2 lg:grid-cols-3">
                                            <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                        XI RPL 2
                                                    </span>
                                                    <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                                        Perlu Perhatian
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    Rekayasa Perangkat Lunak •
                                                    36 Siswa
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400">
                                                            Tingkat Hadir
                                                        </span>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                                            91%
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400">
                                                            Butuh Tindak Lanjut
                                                        </span>
                                                        <span className="font-bold text-red-600">
                                                            3 siswa
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                        XII AKL 2
                                                    </span>
                                                    <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                        Kondisi Baik
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    Akuntansi & Keuangan • 35
                                                    Siswa
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400">
                                                            Tingkat Hadir
                                                        </span>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                                            97%
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400">
                                                            Butuh Tindak Lanjut
                                                        </span>
                                                        <span className="font-bold text-emerald-600">
                                                            1 siswa
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                        XI TKR 3
                                                    </span>
                                                    <span className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                                                        Perlu Intervensi
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    Teknik Kendaraan Ringan • 32
                                                    Siswa
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400">
                                                            Tingkat Hadir
                                                        </span>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                                            86%
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400">
                                                            Butuh Tindak Lanjut
                                                        </span>
                                                        <span className="font-bold text-red-600">
                                                            4 siswa
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {previewTab === 'cases' && (
                                        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                                            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
                                                    <span>
                                                        1. Kasus Baru Masuk
                                                    </span>
                                                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">
                                                        1
                                                    </span>
                                                </div>
                                                <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-[#162238]">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        Dimas Maulana
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        Peringatan otomatis:
                                                        Alpa 5 hari
                                                        berturut-turut.
                                                    </div>
                                                    <div className="pt-1 text-[10px] font-semibold text-blue-600">
                                                        Menunggu penugasan Guru
                                                        BK
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
                                                    <span>
                                                        2. Sedang Ditangani
                                                    </span>
                                                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                                                        2
                                                    </span>
                                                </div>
                                                <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-[#162238]">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        Rian Pratama -
                                                        CS-2025-089
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        Konseling sesi 2 tuntas,
                                                        surat komitmen dibuat.
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">
                                                        PIC: Ibu Rahmawati -
                                                        Guru BK
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-[#111c30]">
                                                <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
                                                    <span>
                                                        3. Selesai &
                                                        Terdokumentasi
                                                    </span>
                                                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700">
                                                        18
                                                    </span>
                                                </div>
                                                <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-[#162238]">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        18 Kasus Bulan Ini
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        Dokumen pembinaan &
                                                        persetujuan orang tua
                                                        tersimpan aman di arsip
                                                        digital.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {previewTab === 'communication' && (
                                        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-[#111c30]">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    Pemberitahuan Resmi Sekolah
                                                    ke Orang Tua
                                                </div>
                                                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                                    ✓ Acknowledgement
                                                    Terverifikasi
                                                </span>
                                            </div>
                                            <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-[#162238]">
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        Kepada: Hadi Wicaksono -
                                                        Wali Brian Aditya
                                                    </span>
                                                    <span className="text-slate-400">
                                                        24 Sep, 08:15
                                                    </span>
                                                </div>
                                                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                                                    “Yth. Bapak Hadi Wicaksono,
                                                    kami menginformasikan
                                                    catatan ketidakhadiran
                                                    ananda Brian yang memerlukan
                                                    koordinasi bersama sekolah
                                                    demi kelancaran proses
                                                    belajar.”
                                                </p>
                                                <div className="flex items-center justify-between pt-1 text-[11px]">
                                                    <span className="text-slate-400">
                                                        Saluran: WhatsApp
                                                        Terverifikasi & App
                                                    </span>
                                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                        Status: Sudah Membaca &
                                                        Dikonfirmasi
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Target Roles (Section 1) */}
                    <section
                        id="peran"
                        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
                    >
                        <div className="mx-auto mb-12 max-w-2xl text-center">
                            <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
                                Kolaborasi Antar Peran
                            </span>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                                Didesain Sesuai Tanggung Jawab Ekosistem Sekolah
                            </h2>
                            <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                Setiap pihak sekolah memiliki sudut pandang yang
                                berbeda, namun terhubung dalam satu tujuan
                                bersama: keberhasilan dan perlindungan siswa.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {roles.map((r) => {
                                const IconComponent = r.icon;
                                return (
                                    <div
                                        key={r.title}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs dark:border-slate-800 dark:bg-[#0f172a]"
                                    >
                                        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                            <IconComponent className="size-5" />
                                        </div>
                                        <div className="mb-1 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {r.title}
                                            </h3>
                                        </div>
                                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                            {r.badge}
                                        </span>
                                        <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                            {r.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Final Call to Action */}
                    <section className="relative overflow-hidden bg-blue-900 py-16 text-center text-white">
                        <div className="relative z-10 mx-auto max-w-4xl space-y-4 px-4 sm:px-6 lg:px-8">
                            <span className="rounded-full border border-blue-700 bg-blue-800 px-3 py-1 text-xs font-semibold text-blue-200">
                                Siap Diterapkan di Sekolah Anda
                            </span>
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Mulai Kenali Lebih Cepat, Tanggapi Lebih Tepat
                                Hari Ini
                            </h2>
                            <p className="mx-auto max-w-xl text-sm leading-relaxed font-normal text-blue-200 sm:text-base">
                                Jadikan sekolah Anda tempat di mana setiap anak
                                diperhatikan kondisinya, didampingi proses
                                belajarnya, dan didukung pertumbuhannya.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                                <a
                                    href="/demo-login"
                                    className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-blue-900 shadow-lg transition-transform hover:bg-blue-50 active:scale-95 sm:text-sm"
                                >
                                    Masuk ke Demo Dashboard
                                </a>
                                <Link
                                    href={login()}
                                    className="rounded-xl border border-blue-600 px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-blue-800 sm:text-sm"
                                >
                                    Login Akun Sekolah
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500 dark:border-slate-800/80 dark:bg-[#070b14] dark:text-slate-400">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
                        <div className="flex items-center gap-2">
                            <TanggapinLogo size="sm" showDescriptor={true} />
                        </div>
                        <div className="text-center md:text-right">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                                TANGGAPIN — Platform Tindak Lanjut Siswa
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                                Kenali lebih cepat. Tanggapi lebih tepat. •
                                Dirancang untuk Ekosistem Pendidikan Indonesia
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
