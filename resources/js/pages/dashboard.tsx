import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    Eye,
    FileText,
    GraduationCap,
    Inbox,
    Menu,
    PhoneCall,
    Plus,
    Shield,
    ShieldAlert,
    Siren,
    Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useActionModals } from '@/components/action-modals';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { ROLE_CONFIGS } from '@/lib/role-config';
import { cn } from '@/lib/utils';
import type { DashboardPageProps, RoleType } from '@/types/tanggapin';

export default function Dashboard({
    stats,
    priorityFeed,
    classes,
    cases,
    paymentList,
    dapodikIssues,
    documents,
}: DashboardPageProps) {
    const {
        openFollowupModal,
        openParentContactModal,
        openNewCaseModal,
        openStudent360Modal,
    } = useActionModals();

    const safeStats = stats ?? {
        studentsNeedingAttention: 1,
        activeCases: 1,
        overdueCases: 0,
        dataCheckIssues: 1,
        duePayments: 1,
        activeIncidents: 1,
        resolvedThisMonth: 1,
    };
    const feed = priorityFeed ?? [];
    const classList = classes ?? [];
    const caseList = cases ?? [];
    const payments = paymentList ?? [];
    const dapodikList = dapodikIssues ?? [];
    const docList = documents ?? [];

    const page = usePage<{
        auth?: { user?: { name?: string; email?: string; role?: RoleType } };
    }>();
    const authRole = page.props.auth?.user?.role;

    const [currentRole, setCurrentRole] = useState<RoleType>(() => {
        if (authRole && Object.keys(ROLE_CONFIGS).includes(authRole)) {
            return authRole;
        }
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(
                'tanggapin_current_role',
            ) as RoleType;
            if (saved && Object.keys(ROLE_CONFIGS).includes(saved)) {
                return saved;
            }
        }
        return 'kepala_sekolah';
    });

    useEffect(() => {
        if (authRole && Object.keys(ROLE_CONFIGS).includes(authRole)) {
            setCurrentRole(authRole);
            if (typeof window !== 'undefined') {
                localStorage.setItem('tanggapin_current_role', authRole);
            }
        }
    }, [authRole]);

    const activeRoleConfig =
        ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.kepala_sekolah;

    const [feedRiskFilter, setFeedRiskFilter] = useState<
        'all' | 'high' | 'medium'
    >('all');

    const handleRoleChange = (role: RoleType) => {
        setCurrentRole(role);
        if (typeof window !== 'undefined') {
            localStorage.setItem('tanggapin_current_role', role);
        }
    };

    const filteredPriorityFeed = feed.filter((item) => {
        if (feedRiskFilter === 'all') return true;
        return item.riskLevel === feedRiskFilter;
    });

    return (
        <FlowbiteTanggapinLayout
            activeTab="overview"
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
        >
            <Head title="Ikhtisar & Tindakan — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* Mobile Quick Navigation Bar with Hamburger Strip */}
                <div className="flex sm:hidden items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent('toggle-tanggapin-sidebar'),
                                )
                            }
                            className="flex size-8.5 items-center justify-center rounded-lg bg-blue-600 text-white transition-all active:scale-95"
                            aria-label="Buka Menu Sidebar"
                        >
                            <Menu className="size-4.5" />
                        </button>
                        <div>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white block leading-tight">
                                Navigasi Dashboard
                            </span>
                            <span className="text-[10px] text-slate-500">
                                Ketuk tombol menu untuk fitur lainnya
                            </span>
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
                        <Shield className="size-3" />
                        {activeRoleConfig.shortTitle}
                    </span>
                </div>

                {/* 1. OPERATIONAL CONTEXT HEADER */}
                <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                TANGGAPIN
                            </span>
                            <span className="text-xs text-slate-500">
                                Sistem Operasional Sekolah • T.A. 2025/2026
                                Ganjil
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                                •
                            </span>
                            <span className="hidden text-xs text-slate-500 sm:inline">
                                {activeRoleConfig.scopeBadge}
                            </span>
                        </div>

                        <h1 className="pt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Selamat bertugas, {activeRoleConfig.userName}
                        </h1>

                        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300 max-w-3xl">
                            Masuk sebagai{' '}
                            <strong className="font-semibold text-blue-600 dark:text-blue-400">
                                {activeRoleConfig.title}
                            </strong>
                            {currentRole === 'operator' ? (
                                <>
                                    . Pusat pengelolaan administrasi sekolah, pembuatan & aktivasi akun GTK, sinkronisasi Dapodik, verifikasi SPP, dan kelengkapan berkas operasional.
                                </>
                            ) : (
                                <>
                                    . Terdeteksi{' '}
                                    <strong className="font-semibold text-slate-900 dark:text-white">
                                        {safeStats.studentsNeedingAttention} siswa
                                    </strong>{' '}
                                    yang memerlukan perhatian dan koordinasi terarah
                                    hari ini.
                                </>
                            )}
                        </p>
                    </div>

                    {/* Role Status Badge */}
                    <div className="flex shrink-0 items-center gap-2 self-start lg:self-center">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
                            <Shield className="size-3.5" />
                            Peran: {activeRoleConfig.title}
                        </span>
                    </div>
                </div>

                {/* 2. RINGKASAN METRIK OPERASIONAL & KONDISI (Berdasarkan Peran) */}
                {currentRole === 'operator' ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Metric 1: Kelola Pengguna GTK */}
                        <Link
                            href="/kelola-pengguna"
                            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                        >
                            <div>
                                <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                                        Kelola Pengguna
                                    </span>
                                    <Users className="size-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Akun GTK
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Atur akun Wali Kelas, Bendahara, Kepsek & kuota kelas
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-600 dark:border-slate-800 dark:text-blue-400">
                                <span>Buka Kelola Pengguna</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>

                        {/* Metric 2: Data Dapodik & Residu */}
                        <Link
                            href="/dapodik"
                            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                        >
                            <div>
                                <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                                        Residu Dapodik
                                    </span>
                                    <CheckCircle2 className="size-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {safeStats.dataCheckIssues}
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Anomali NIK/NISN & residu pemetaan rombel
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-600 dark:border-slate-800 dark:text-blue-400">
                                <span>Tinjau Data Residu</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>

                        {/* Metric 3: Pembayaran & Tagihan SPP */}
                        <Link
                            href="/pembayaran"
                            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                        >
                            <div>
                                <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                                        Keuangan SPP
                                    </span>
                                    <CreditCard className="size-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {safeStats.duePayments}
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Tagihan aktif & bukti transfer verifikasi SPP
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-600 dark:border-slate-800 dark:text-blue-400">
                                <span>Kelola Pembayaran</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>

                        {/* Metric 4: Dokumen & Administrasi GTK */}
                        <Link
                            href="/dokumen-guru"
                            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                        >
                            <div>
                                <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                                        Dokumen GTK
                                    </span>
                                    <FileText className="size-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {docList.length} Berkas
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    SK penugasan, silabus, dan perangkat ajar guru
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-600 dark:border-slate-800 dark:text-blue-400">
                                <span>Verifikasi Berkas</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Metric 1: Siswa Butuh Perhatian */}
                        <Link
                            href="/early-warning"
                            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                        >
                            <div>
                                <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                                        Butuh Perhatian
                                    </span>
                                    <AlertTriangle className="size-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {safeStats.studentsNeedingAttention}
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Sinyal risiko kehadiran, capaian belajar, atau ketertiban
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-600 dark:border-slate-800 dark:text-blue-400">
                                <span>Tinjau Sinyal Risiko</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>

                        {/* Metric 2: Kasus Aktif BK */}
                        <Link
                            href="/manajemen-kasus"
                            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                        >
                            <div>
                                <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                                        Kasus Aktif BK
                                    </span>
                                    <ShieldAlert className="size-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {safeStats.activeCases}
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    {safeStats.overdueCases} pendampingan perlu evaluasi berkala
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-600 dark:border-slate-800 dark:text-blue-400">
                                <span>Alur Kasus BK</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>

                        {/* Metric 3: Tindak Lanjut Selesai */}
                        <Link
                            href="/manajemen-kasus"
                            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                        >
                            <div>
                                <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                                        Terdokumentasi
                                    </span>
                                    <CheckCircle2 className="size-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {safeStats.resolvedThisMonth}
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Langkah pendampingan terselesaikan bulan ini
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-600 dark:border-slate-800 dark:text-blue-400">
                                <span>Arsip Catatan</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>

                        {/* Metric 4: Rata-rata Kehadiran */}
                        <Link
                            href="/kondisi-kelas"
                            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                        >
                            <div>
                                <div className="mb-2.5 flex items-center justify-between">
                                    <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                                        Rata-rata Hadir
                                    </span>
                                    <GraduationCap className="size-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    92.4%
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Rangkuman presensi 4 rombel kejuruan
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-600 dark:border-slate-800 dark:text-blue-400">
                                <span>Pantau Presensi Rombel</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    </div>
                )}

                {/* 3. PERINGATAN DINI & TINDAK LANJUT MENDESAK (Disembunyikan untuk Role Operator) */}
                {currentRole !== 'operator' && (
                    <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-3.5 sm:flex-row sm:items-center dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                    Perlu Perhatian — Tindak Lanjut Terarah
                                </h2>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Indikasi awal siswa yang membutuhkan
                                pendampingan dan keputusan hari ini.
                            </p>
                        </div>

                        {/* Filter Severity Pills */}
                        <div className="flex items-center gap-1.5 self-start sm:self-center">
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('all')}
                                className={cn(
                                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                )}
                            >
                                Semua: {feed.length}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('high')}
                                className={cn(
                                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'high'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                )}
                            >
                                Kritis: {feed.filter(f => f.riskLevel === 'high').length}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('medium')}
                                className={cn(
                                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'medium'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                )}
                            >
                                Perlu Diperhatikan: {feed.filter(f => f.riskLevel === 'medium').length}
                            </button>
                        </div>
                    </div>

                    {/* Alerts List */}
                    <div className="space-y-3">
                        {filteredPriorityFeed.map((alert) => {
                            const isHigh = alert.riskLevel === 'high';
                            return (
                                <div
                                    key={alert.id}
                                    className={cn(
                                        'flex flex-col justify-between gap-4 rounded-lg border p-4 transition-colors lg:flex-row lg:items-center',
                                        alert.actionTaken
                                            ? 'border-slate-200/70 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-900/30'
                                            : 'border-slate-200/90 bg-slate-50/30 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:bg-[#0f172a]/70',
                                    )}
                                >
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                                                {alert.studentName}
                                            </span>
                                            <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {alert.class}
                                            </span>
                                            <span
                                                className={cn(
                                                    'rounded border px-1.5 py-0.5 text-[10px] font-medium',
                                                    isHigh
                                                        ? 'border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                                                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400',
                                                )}
                                            >
                                                {alert.triggerType}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                • Terdeteksi {alert.timestamp}
                                            </span>
                                            {alert.actionTaken && (
                                                <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    Sudah Ditindaklanjuti
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                            {alert.summary}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 pt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                            <span>
                                                Wali Kelas:{' '}
                                                <strong className="font-medium text-slate-700 dark:text-slate-300">
                                                    {alert.homeroomTeacher}
                                                </strong>
                                            </span>
                                            <span>
                                                Wali Murid:{' '}
                                                <strong className="font-medium text-slate-700 dark:text-slate-300">
                                                    {alert.parentName} •{' '}
                                                    {alert.parentPhone}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex shrink-0 flex-wrap items-center gap-2 self-start lg:self-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openStudent360Modal(alert)
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                            title="Buka Profil Siswa 360 Derajat"
                                        >
                                            <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                            <span>Profil 360</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={alert.actionTaken}
                                            onClick={() => {
                                                openFollowupModal({
                                                    studentId:
                                                        alert.studentId ||
                                                        alert.id,
                                                    studentName: `${alert.studentName} — ${alert.class}`,
                                                    studentPhone:
                                                        alert.parentPhone,
                                                    note: `Tindak lanjut sinyal risiko: ${alert.summary}`,
                                                });
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                                        >
                                            <Plus className="size-3.5" />
                                            <span>Buat Tindak Lanjut</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                openParentContactModal({
                                                    studentId:
                                                        alert.studentId ||
                                                        alert.id,
                                                    studentName: `${alert.studentName} — ${alert.class}`,
                                                    studentPhone:
                                                        alert.parentPhone,
                                                    message: `Yth. Bapak Ibu ${alert.parentName}, kami dari sekolah menginformasikan perkembangan siswa ${alert.studentName}. ${alert.summary}. Mohon berkenan berkoordinasi dengan sekolah demi kelancaran proses belajar.`,
                                                });
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                            title="Kirim pesan terstruktur resmi ke orang tua"
                                        >
                                            <PhoneCall className="size-3.5 text-slate-400" />
                                            <span className="hidden sm:inline">
                                                Hubungi Ortu
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                openNewCaseModal({
                                                    studentId:
                                                        alert.studentId ||
                                                        alert.id,
                                                    studentName: `${alert.studentName} — ${alert.class}`,
                                                    desc: `Eskalasi dari Early Warning: ${alert.summary}`,
                                                });
                                            }}
                                            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                            title="Eskalasi ke Kasus BK"
                                        >
                                            <ShieldAlert className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}

                {/* 4. DUA KOLOM OPERASIONAL BERDASARKAN PERAN (Role-tailored Spotlight) */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Primary Left Widget */}
                    {currentRole === 'bendahara' ? (
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Daftar Tagihan & Verifikasi SPP
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Monitoring tunggakan dan verifikasi
                                        bukti transfer ortu.
                                    </p>
                                </div>
                                <Link
                                    href="/pembayaran"
                                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Semua Tagihan{' '}
                                    <ChevronRight className="size-3.5" />
                                </Link>
                            </div>
                            <div className="space-y-2.5">
                                {payments.slice(0, 3).map((p) => (
                                    <div
                                        key={p.id}
                                        className="space-y-1.5 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800/80 dark:bg-[#0f172a]/40"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {p.studentName}
                                            </span>
                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {p.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-500">
                                            <span>
                                                {p.class} • {p.dueDate}
                                            </span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                Rp{' '}
                                                {p.amount.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : currentRole === 'operator' ? (
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Anomali Data Dapodik & Residu
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Validasi NISN, NIK, dan pemetaan rombel
                                        pembelajaran.
                                    </p>
                                </div>
                                <Link
                                    href="/dapodik"
                                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Semua Isu{' '}
                                    <ChevronRight className="size-3.5" />
                                </Link>
                            </div>
                            <div className="space-y-2.5">
                                {dapodikList.slice(0, 3).map((d) => (
                                    <div
                                        key={d.id}
                                        className="space-y-1 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800/80 dark:bg-[#0f172a]/40"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {d.targetName}
                                            </span>
                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {d.category}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                            {d.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Indikator Kondisi Kelas
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Pantauan kelas yang memerlukan dukungan
                                        koordinasi guru.
                                    </p>
                                </div>
                                <Link
                                    href="/kondisi-kelas"
                                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Semua Rombel{' '}
                                    <ChevronRight className="size-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-2.5">
                                {classList.slice(0, 3).map((cls) => {
                                    const isCritical =
                                        cls.healthStatus === 'critical';
                                    const isWarning =
                                        cls.healthStatus === 'warning';

                                    return (
                                        <div
                                            key={cls.id}
                                            className="space-y-2 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3.5 transition-colors hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="me-2 text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                                                        {cls.name}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {cls.major} •{' '}
                                                        {cls.totalStudents}{' '}
                                                        siswa
                                                    </span>
                                                </div>
                                                <span
                                                    className={cn(
                                                        'rounded border px-2 py-0.5 text-[10px] font-medium',
                                                        isCritical
                                                            ? 'border-slate-300 bg-slate-200 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                                                            : isWarning
                                                              ? 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                              : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400',
                                                    )}
                                                >
                                                    {isCritical
                                                        ? 'Perlu Intervensi'
                                                        : isWarning
                                                          ? 'Perlu Perhatian'
                                                          : 'Kondisi Baik'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 py-1 text-xs">
                                                <div>
                                                    <span className="block text-[10px] text-slate-400">
                                                        Kehadiran
                                                    </span>
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {cls.attendanceRate}%
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] text-slate-400">
                                                        Perlu Perhatian
                                                    </span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {cls.studentsAtRisk}{' '}
                                                        siswa
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] text-slate-400">
                                                        Tindak Lanjut Pending
                                                    </span>
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                        {cls.pendingFollowups}{' '}
                                                        pending
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px] text-slate-500 dark:border-slate-800">
                                                <span>
                                                    Wali: {cls.homeroomTeacher}
                                                </span>
                                                <Link
                                                    href="/kondisi-kelas"
                                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Detail Rombel →
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Secondary Right Widget */}
                    {currentRole === 'bendahara' ? (
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Komunikasi & Reminder Pembayaran
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Koordinasi dengan wali murid terkait
                                        dispensasi SPP.
                                    </p>
                                </div>
                                <Link
                                    href="/komunikasi-ortu"
                                    className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Pesan Ortu →
                                </Link>
                            </div>
                            <div className="space-y-2.5">
                                {feed.slice(0, 3).map((f) => (
                                    <div
                                        key={f.id}
                                        className="space-y-1 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800/80 dark:bg-[#0f172a]/40"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {f.studentName}
                                            </span>
                                            <span className="text-[11px] text-slate-500">
                                                {f.parentName}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                            {f.summary}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : currentRole === 'operator' ? (
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Verifikasi Dokumen Guru
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Kelengkapan SK, silabus, dan perangkat
                                        ajar pengajar.
                                    </p>
                                </div>
                                <Link
                                    href="/dokumen-guru"
                                    className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Semua Berkas →
                                </Link>
                            </div>
                            <div className="space-y-2.5">
                                {docList.slice(0, 3).map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="space-y-1 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800/80 dark:bg-[#0f172a]/40"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {doc.title}
                                            </span>
                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {doc.status}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                            Pengajar: {doc.teacher} • Periode:{' '}
                                            {doc.period}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : currentRole === 'wali_kelas' ? (
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert className="size-4 text-blue-600 dark:text-blue-400" />
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Tracking Rujukan Kendala Siswa ke Guru BK
                                        </h3>
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                        Pantau status penanganan rujukan kendala siswa binaan Anda ke Guru BK secara real-time.
                                    </p>
                                </div>
                                <Link
                                    href="/kondisi-kelas"
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Laporkan Rujukan Siswa</span>
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {caseList.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400 dark:border-slate-800">
                                        Belum ada rujukan kendala siswa yang dilaporkan ke Guru BK.
                                    </div>
                                ) : (
                                    caseList.slice(0, 4).map((c) => {
                                        const isHandled =
                                            c.isHandledByBk ||
                                            c.stage === 'handled_by_bk' ||
                                            c.stage === 'resolved' ||
                                            !!c.handledAt;

                                        return (
                                            <div
                                                key={c.id}
                                                className={cn(
                                                    'space-y-2 rounded-lg border p-3.5 text-xs transition-colors',
                                                    isHandled
                                                        ? 'border-slate-200/90 bg-slate-50/40 dark:border-slate-800 dark:bg-[#0f172a]/30'
                                                        : 'border-slate-200/90 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/40',
                                                )}
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                            {c.code}
                                                        </span>
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {c.studentName}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400">
                                                            • {c.class}
                                                        </span>
                                                    </div>

                                                    {/* Real-time Tracking Badge */}
                                                    {isHandled ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                            <CheckCircle2 className="size-3 text-blue-600 dark:text-blue-400" />
                                                            Sudah Ditangani oleh Guru BK
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            <Clock className="size-3 text-slate-400" />
                                                            Menunggu Penanganan Guru BK
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Kendala yang dilaporkan oleh Wali Kelas */}
                                                <div className="border-s-2 border-slate-300 ps-2.5 py-0.5 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                                    <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                                                        Kendala yang Dilaporkan Wali Kelas:
                                                    </div>
                                                    <p className="mt-0.5 leading-relaxed">{c.referralNotes || c.lastActivity}</p>
                                                </div>

                                                {/* Bukti & Catatan Hasil Penanganan Guru BK */}
                                                {isHandled ? (
                                                    <div className="border-s-2 border-blue-500 bg-blue-50/30 p-2.5 text-slate-700 rounded-e-md dark:bg-blue-950/20 dark:text-slate-200">
                                                        <div className="flex flex-wrap items-center justify-between text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                                                            <span>
                                                                Tindakan Guru BK: {c.bkActionType || 'Konseling Siswa'}
                                                            </span>
                                                            <span className="text-[10px] font-normal text-slate-400">
                                                                {c.handledAt || c.lastUpdate}
                                                            </span>
                                                        </div>
                                                        <div className="mt-0.5 text-[10px] text-slate-500">
                                                            Konselor:{' '}
                                                            <strong className="text-slate-800 dark:text-slate-200">
                                                                {c.handledByBkName || c.assignee}
                                                            </strong>
                                                        </div>
                                                        <p className="mt-1 border-t border-slate-200/60 pt-1 text-[11px] leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
                                                            {c.bkHandlingNotes || 'Sesi bimbingan & konseling telah berhasil dilaksanakan bersama siswa.'}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                                                        <span>
                                                            PIC Guru BK:{' '}
                                                            <strong className="font-medium text-slate-700 dark:text-slate-300">
                                                                {c.assignee}
                                                            </strong>
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            Dalam antrean jadwal konseling
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}

                                <Link
                                    href="/kondisi-kelas"
                                    className="block w-full rounded-lg border border-dashed border-slate-200 py-2 text-center text-xs font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-blue-400 dark:hover:bg-slate-800/40"
                                >
                                    Kelola Binaan & Rujukan Siswa di Kondisi Kelas →
                                </Link>
                            </div>
                        </div>
                    ) : currentRole === 'guru_bk' ? (
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Inbox className="size-4 text-blue-600 dark:text-blue-400" />
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Rujukan Siswa Masuk dari Wali Kelas
                                        </h3>
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                        Daftar kendala siswa yang dilaporkan Wali Kelas untuk ditangani melalui layanan BK.
                                    </p>
                                </div>
                                <Link
                                    href="/manajemen-kasus"
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95"
                                >
                                    <span>Papan Kasus Rujukan BK →</span>
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {caseList.slice(0, 3).map((c) => {
                                    const isHandled =
                                        c.isHandledByBk ||
                                        c.stage === 'handled_by_bk' ||
                                        c.stage === 'resolved' ||
                                        !!c.handledAt;

                                    return (
                                        <div
                                            key={c.id}
                                            className="space-y-2 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800/80 dark:bg-[#0f172a]/40"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                        {c.code}
                                                    </span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {c.studentName}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        • {c.class}
                                                    </span>
                                                </div>
                                                <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    Prioritas: {c.priority}
                                                </span>
                                            </div>

                                            <div className="border-s-2 border-blue-500 bg-blue-50/30 p-2.5 rounded-e-md text-[11px] dark:bg-blue-950/20">
                                                <div className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                                                    Perujuk: {c.referredByName || 'Wali Kelas'}
                                                </div>
                                                <p className="mt-0.5 text-slate-600 leading-relaxed dark:text-slate-300">
                                                    {c.referralNotes || c.lastActivity}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-1 text-[11px]">
                                                <span className="text-slate-500">
                                                    Status:{' '}
                                                    <strong className={isHandled ? 'text-blue-600 font-semibold dark:text-blue-400' : 'text-slate-600 font-medium dark:text-slate-400'}>
                                                        {isHandled ? '✓ Sudah Ditangani oleh Guru BK' : 'Menunggu Penanganan BK'}
                                                    </strong>
                                                </span>
                                                <Link
                                                    href="/manajemen-kasus"
                                                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    {isHandled ? 'Lihat Arsip →' : 'Tangani Sekarang →'}
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}

                                <Link
                                    href="/manajemen-kasus"
                                    className="block w-full rounded-lg border border-dashed border-slate-200 py-2 text-center text-xs font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-blue-400 dark:hover:bg-slate-800/40"
                                >
                                    Buka Papan Rujukan Lengkap — {caseList.length} Rujukan →
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Progres Penanganan Kasus Terstruktur
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Alur tahapan: Rujukan Masuk → Ditugaskan → Ditangani → Selesai
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openNewCaseModal()}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95"
                                >
                                    <Plus className="size-3.5" />
                                    Buka Kasus
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {caseList.slice(0, 3).map((c) => (
                                    <div
                                        key={c.id}
                                        className="space-y-1.5 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800/80 dark:bg-[#0f172a]/40"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                    {c.code}
                                                </span>
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {c.studentName}
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    • {c.class}
                                                </span>
                                            </div>
                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                Prioritas: {c.priority}
                                            </span>
                                        </div>

                                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                            {c.lastActivity}
                                        </p>

                                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                                            <span>
                                                PIC:{' '}
                                                <strong className="font-medium text-slate-700 dark:text-slate-300">
                                                    {c.assignee}
                                                </strong>
                                            </span>
                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                Tahap: {c.stageLabel}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                <Link
                                    href="/manajemen-kasus"
                                    className="block w-full rounded-lg border border-dashed border-slate-200 py-2 text-center text-xs font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-blue-400 dark:hover:bg-slate-800/40"
                                >
                                    Buka Papan Kanban Kasus Lengkap —{' '}
                                    {caseList.length} Kasus →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. AKSES PINTASAN MODUL (Single Blue Accent) */}
                <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="border-b border-slate-200/80 pb-3 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Pintasan Modul & Tanggap Cepat
                        </h3>
                        <p className="text-[11px] text-slate-500">
                            Navigasi langsung ke modul spesifik sesuai kebutuhan
                            tugas Anda.
                        </p>
                    </div>

                    {currentRole === 'operator' ? (
                        <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-5">
                            <Link
                                href="/kelola-pengguna"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <Users className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Kelola Pengguna
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    Akun & Kuota Kelas
                                </div>
                            </Link>

                            <Link
                                href="/dapodik"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <CheckCircle2 className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Cek Dapodik
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    {safeStats.dataCheckIssues} Residu Data
                                </div>
                            </Link>

                            <Link
                                href="/pembayaran"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <CreditCard className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Pembayaran SPP
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    {safeStats.duePayments} Tagihan Aktif
                                </div>
                            </Link>

                            <Link
                                href="/dokumen-guru"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <FileText className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Dokumen GTK
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    {docList.length} Berkas Guru
                                </div>
                            </Link>

                            <Link
                                href="/respons-insiden"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <Siren className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Tanggap Darurat
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    SOP & Insiden
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-6">
                            <Link
                                href="/early-warning"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <AlertTriangle className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Early Warning
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    {safeStats.studentsNeedingAttention} Berisiko
                                </div>
                            </Link>

                            <Link
                                href="/kondisi-kelas"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <GraduationCap className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    {currentRole === 'wali_kelas' || currentRole === 'guru_bk' ? 'Data Siswa & Poin' : 'Kondisi Kelas'}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    {classList.length || 4} Rombel
                                </div>
                            </Link>

                            <Link
                                href="/manajemen-kasus"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <ShieldAlert className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Kasus BK
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    {safeStats.activeCases} Kasus Aktif
                                </div>
                            </Link>

                            <Link
                                href="/komunikasi-ortu"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <PhoneCall className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Kontak Ortu
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    Pesan Resmi
                                </div>
                            </Link>

                            <Link
                                href="/dapodik"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <CheckCircle2 className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Cek Dapodik
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    {safeStats.dataCheckIssues} Catatan
                                </div>
                            </Link>

                            <Link
                                href="/respons-insiden"
                                className="group rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                            >
                                <Siren className="mx-auto mb-2 size-5 text-blue-600 dark:text-blue-400" />
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Tanggap Darurat
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    SOP & Insiden
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

Dashboard.layout = (page: React.ReactNode) => page;
