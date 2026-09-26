import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    GraduationCap,
    PhoneCall,
    Search,
    Shield,
    ShieldAlert,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import TanggapinLogo from '@/components/tanggapin-logo';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';

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

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>()
        .props;

    // Interactive Preview State
    const [previewTab, setPreviewTab] = useState<
        'early_warning' | 'class_health' | 'cases' | 'communication'
    >('early_warning');
    const [interactiveActionDone, setInteractiveActionDone] = useState(false);
    const [isDemoRoleModalOpen, setIsDemoRoleModalOpen] = useState(false);

    const handleSelectDemoRole = (roleId: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('tanggapin_current_role', roleId);
            window.location.href = `/demo-login?role=${roleId}`;
        }
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

                        <div className="hidden items-center gap-8 text-xs font-semibold text-slate-600 md:flex dark:text-slate-300">
                            <a
                                href="#prinsip"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Prinsip Kerja
                            </a>
                            <a
                                href="#preview"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Simulasi Interaktif
                            </a>
                            <a
                                href="#perbandingan"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Pendekatan Operasional
                            </a>
                            <a
                                href="#peran"
                                className="transition-colors hover:text-blue-700 dark:hover:text-blue-400"
                            >
                                Pengguna Sekolah
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
                                    <Link
                                        href={register()}
                                        className="hidden rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:inline-block dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Daftar
                                    </Link>
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
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                <span className="size-1.5 rounded-full bg-blue-600" />
                                <span>
                                    Platform Operasional Tindak Lanjut Sekolah
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
                                    Integrasi data tanpa kerumitan
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

                    {/* 7. Final Call to Action Section */}
                    <section className="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Mulai Terapkan Tanggapin di Sekolah Anda
                            </h2>
                            <p className="mx-auto max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                Hubungkan data sekolah dengan tindakan
                                pendampingan yang tepat waktu dan terkoordinasi.
                            </p>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDemoRoleModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-98 sm:text-sm"
                                >
                                    Buka Demo Dashboard Operasional
                                    <ArrowRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* 8. Footer */}
                <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-400">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
                        <div>
                            Tanggapin • Platform Tindak Lanjut Siswa Sekolah
                        </div>
                        <div>Deteksi lebih cepat. Tindak lebih tepat.</div>
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
            </div>
        </>
    );
}
