import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    Eye,
    GraduationCap,
    PhoneCall,
    Plus,
    ShieldAlert,
    Siren,
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
        studentsNeedingAttention: 12,
        activeCases: 4,
        overdueCases: 2,
        dataCheckIssues: 7,
        duePayments: 18,
        activeIncidents: 1,
        resolvedThisMonth: 24,
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

            <div className="mx-auto max-w-7xl space-y-8">
                {/* 1. OPERATIONAL CONTEXT HEADER */}
                <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-blue-700 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                                TANGGAPIN
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                                SMK Negeri 1 Harapan • T.A. 2025/2026 Ganjil
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                                •
                            </span>
                            <span className="hidden text-xs font-medium text-slate-500 sm:inline">
                                {activeRoleConfig.scopeBadge}
                            </span>
                        </div>

                        <h1 className="pt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Selamat bertugas, {activeRoleConfig.userName}
                        </h1>

                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Masuk sebagai{' '}
                            <strong className="font-semibold text-blue-700 dark:text-blue-400">
                                {activeRoleConfig.title}
                            </strong>
                            . Terdeteksi{' '}
                            <strong className="font-semibold text-slate-900 dark:text-white">
                                {safeStats.studentsNeedingAttention} siswa
                            </strong>{' '}
                            yang memerlukan perhatian dan koordinasi terarah
                            hari ini.
                        </p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex shrink-0 flex-wrap items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-slate-100/80 p-1.5 lg:self-center dark:border-slate-700 dark:bg-[#162238]">
                        <span className="px-2 text-[11px] font-semibold text-slate-500">
                            Peran:
                        </span>
                        {(Object.keys(ROLE_CONFIGS) as RoleType[]).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => handleRoleChange(r)}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                                    currentRole === r
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white',
                                )}
                            >
                                {ROLE_CONFIGS[r].shortTitle}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. RINGKASAN KONDISI SISWA (4 Kartu Metrik Utama - Single Accent Palette) */}
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
                    {/* Metric 1: Siswa Butuh Perhatian */}
                    <Link
                        href="/early-warning"
                        className="group block cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-600 hover:shadow-sm dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                Butuh Perhatian
                            </span>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-blue-700 transition-colors group-hover:border-blue-300 group-hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400">
                                <AlertTriangle className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {safeStats.studentsNeedingAttention}
                        </div>
                        <p className="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                            Sinyal risiko kehadiran, capaian belajar, atau
                            ketertiban
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-blue-700 dark:border-slate-800 dark:text-blue-400">
                            <span>Tinjau Sinyal Risiko</span>
                            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </Link>

                    {/* Metric 2: Kasus Aktif BK */}
                    <Link
                        href="/manajemen-kasus"
                        className="group block cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-600 hover:shadow-sm dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                Kasus Aktif BK
                            </span>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-blue-700 transition-colors group-hover:border-blue-300 group-hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400">
                                <ShieldAlert className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {safeStats.activeCases}
                        </div>
                        <p className="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                            {safeStats.overdueCases} pendampingan perlu evaluasi
                            berkala
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-blue-700 dark:border-slate-800 dark:text-blue-400">
                            <span>Alur Kasus BK</span>
                            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </Link>

                    {/* Metric 3: Tindak Lanjut Selesai */}
                    <Link
                        href="/manajemen-kasus"
                        className="group block cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-600 hover:shadow-sm dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                Terdokumentasi
                            </span>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-blue-700 transition-colors group-hover:border-blue-300 group-hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400">
                                <CheckCircle2 className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {safeStats.resolvedThisMonth}
                        </div>
                        <p className="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                            Langkah pendampingan terselesaikan bulan ini
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-blue-700 dark:border-slate-800 dark:text-blue-400">
                            <span>Arsip Catatan</span>
                            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </Link>

                    {/* Metric 4: Rata-rata Kehadiran */}
                    <Link
                        href="/kondisi-kelas"
                        className="group block cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-600 hover:shadow-sm dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                Rata-rata Hadir
                            </span>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-blue-700 transition-colors group-hover:border-blue-300 group-hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400">
                                <GraduationCap className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            92.4%
                        </div>
                        <p className="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                            Rangkuman presensi 4 rombel kejuruan
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-blue-700 dark:border-slate-800 dark:text-blue-400">
                            <span>Pantau Presensi Rombel</span>
                            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </Link>
                </div>

                {/* 3. PERINGATAN DINI & TINDAK LANJUT MENDESAK */}
                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-blue-700 dark:bg-blue-400" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Perlu Perhatian — Tindak Lanjut Terarah
                                </h2>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
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
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'all'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Semua: {feed.length}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('high')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'high'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Kritis: 3
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('medium')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'medium'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Perlu Diperhatikan: 1
                            </button>
                        </div>
                    </div>

                    {/* Alerts Card List */}
                    <div className="space-y-3.5">
                        {filteredPriorityFeed.map((alert) => {
                            const isHigh = alert.riskLevel === 'high';
                            return (
                                <div
                                    key={alert.id}
                                    className={cn(
                                        'flex flex-col justify-between gap-4 rounded-xl border p-4.5 transition-all lg:flex-row lg:items-center',
                                        alert.actionTaken
                                            ? 'border-slate-200 bg-slate-50/60 opacity-60 dark:border-slate-800 dark:bg-slate-900/40'
                                            : 'border-slate-200 bg-white shadow-2xs hover:border-slate-300 dark:border-slate-800 dark:bg-[#111c30]',
                                    )}
                                >
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {alert.studentName}
                                            </span>
                                            <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {alert.class}
                                            </span>
                                            <span
                                                className={cn(
                                                    'rounded border px-2 py-0.5 text-[10px] font-semibold',
                                                    isHigh
                                                        ? 'border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                                                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
                                                )}
                                            >
                                                {alert.triggerType}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                • Terdeteksi {alert.timestamp}
                                            </span>
                                            {alert.actionTaken && (
                                                <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    Sudah Ditindaklanjuti
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs leading-relaxed font-normal text-slate-700 dark:text-slate-300">
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
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500"
                                            title="Buka Profil Siswa 360 Derajat"
                                        >
                                            <Eye className="size-3.5 text-blue-700 dark:text-blue-400" />
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
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 active:scale-95 disabled:opacity-50"
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
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                            title="Kirim pesan terstruktur resmi ke orang tua"
                                        >
                                            <PhoneCall className="size-3.5 text-slate-500" />
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
                                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800"
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

                {/* 4. DUA KOLOM OPERASIONAL BERDASARKAN PERAN (Role-tailored Spotlight) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Primary Left Widget */}
                    {currentRole === 'bendahara' ? (
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
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
                                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                >
                                    Semua Tagihan{' '}
                                    <ChevronRight className="size-3.5" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {payments.slice(0, 3).map((p) => (
                                    <div
                                        key={p.id}
                                        className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#111c30]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {p.studentName}
                                            </span>
                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
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
                                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                >
                                    Semua Isu{' '}
                                    <ChevronRight className="size-3.5" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {dapodikList.slice(0, 3).map((d) => (
                                    <div
                                        key={d.id}
                                        className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#111c30]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {d.targetName}
                                            </span>
                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
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
                                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                >
                                    Semua Rombel{' '}
                                    <ChevronRight className="size-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {classList.slice(0, 3).map((cls) => {
                                    const isCritical =
                                        cls.healthStatus === 'critical';
                                    const isWarning =
                                        cls.healthStatus === 'warning';

                                    return (
                                        <div
                                            key={cls.id}
                                            className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-[#111c30]"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="me-2 text-sm font-bold text-slate-900 dark:text-white">
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
                                                        'rounded border px-2 py-0.5 text-[10px] font-semibold',
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
                                                    <span className="block text-[10px] font-medium text-slate-400">
                                                        Kehadiran
                                                    </span>
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                                        {cls.attendanceRate}%
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] font-medium text-slate-400">
                                                        Perlu Perhatian
                                                    </span>
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {cls.studentsAtRisk}{' '}
                                                        siswa
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] font-medium text-slate-400">
                                                        Tindak Lanjut Pending
                                                    </span>
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">
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
                                                    className="font-semibold text-blue-700 hover:underline dark:text-blue-400"
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
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
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
                                    className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                >
                                    Pesan Ortu →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {feed.slice(0, 3).map((f) => (
                                    <div
                                        key={f.id}
                                        className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#111c30]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">
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
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
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
                                    className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                >
                                    Semua Berkas →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {docList.slice(0, 3).map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#111c30]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {doc.title}
                                            </span>
                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
                    ) : (
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Progres Penanganan Kasus Terstruktur
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Alur tahapan: Baru → Ditugaskan →
                                        Ditangani → Selesai
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openNewCaseModal()}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 active:scale-95"
                                >
                                    <Plus className="size-3.5" />
                                    Buka Kasus
                                </button>
                            </div>

                            <div className="space-y-3">
                                {caseList.slice(0, 3).map((c) => (
                                    <div
                                        key={c.id}
                                        className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#111c30]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                                                    {c.code}
                                                </span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {c.studentName}
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    • {c.class}
                                                </span>
                                            </div>
                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                Prioritas: {c.priority}
                                            </span>
                                        </div>

                                        <p className="rounded-lg border border-slate-200 bg-white p-3 leading-relaxed font-normal text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-300">
                                            {c.lastActivity}
                                        </p>

                                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                                            <span>
                                                PIC:{' '}
                                                <strong className="font-medium text-slate-700 dark:text-slate-300">
                                                    {c.assignee}
                                                </strong>
                                            </span>
                                            <span className="font-semibold text-blue-700 dark:text-blue-400">
                                                Tahap: {c.stageLabel}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                <Link
                                    href="/manajemen-kasus"
                                    className="block w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-center text-xs font-semibold text-blue-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800/40"
                                >
                                    Buka Papan Kanban Kasus Lengkap —{' '}
                                    {caseList.length} Kasus →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. AKSES PINTASAN MODUL (Single Blue Accent) */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Pintasan Modul & Tanggap Cepat
                        </h3>
                        <p className="text-[11px] text-slate-500">
                            Navigasi langsung ke modul spesifik sesuai kebutuhan
                            tugas Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-1 sm:grid-cols-3 lg:grid-cols-6">
                        <Link
                            href="/early-warning"
                            className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center transition-all hover:border-blue-500 hover:bg-white dark:border-slate-800 dark:bg-[#111c30] dark:hover:border-blue-500"
                        >
                            <AlertTriangle className="mx-auto mb-2 size-5 text-blue-700 transition-transform group-hover:scale-110 dark:text-blue-400" />
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Early Warning
                            </div>
                            <div className="text-[10px] text-slate-500">
                                {safeStats.studentsNeedingAttention} Berisiko
                            </div>
                        </Link>

                        <Link
                            href="/kondisi-kelas"
                            className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center transition-all hover:border-blue-500 hover:bg-white dark:border-slate-800 dark:bg-[#111c30] dark:hover:border-blue-500"
                        >
                            <GraduationCap className="mx-auto mb-2 size-5 text-blue-700 transition-transform group-hover:scale-110 dark:text-blue-400" />
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Kondisi Kelas
                            </div>
                            <div className="text-[10px] text-slate-500">
                                {classList.length || 4} Rombel
                            </div>
                        </Link>

                        <Link
                            href="/manajemen-kasus"
                            className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center transition-all hover:border-blue-500 hover:bg-white dark:border-slate-800 dark:bg-[#111c30] dark:hover:border-blue-500"
                        >
                            <ShieldAlert className="mx-auto mb-2 size-5 text-blue-700 transition-transform group-hover:scale-110 dark:text-blue-400" />
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Kasus BK
                            </div>
                            <div className="text-[10px] text-slate-500">
                                {safeStats.activeCases} Kasus Aktif
                            </div>
                        </Link>

                        <Link
                            href="/komunikasi-ortu"
                            className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center transition-all hover:border-blue-500 hover:bg-white dark:border-slate-800 dark:bg-[#111c30] dark:hover:border-blue-500"
                        >
                            <PhoneCall className="mx-auto mb-2 size-5 text-blue-700 transition-transform group-hover:scale-110 dark:text-blue-400" />
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Kontak Ortu
                            </div>
                            <div className="text-[10px] text-slate-500">
                                Pesan Resmi
                            </div>
                        </Link>

                        <Link
                            href="/dapodik"
                            className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center transition-all hover:border-blue-500 hover:bg-white dark:border-slate-800 dark:bg-[#111c30] dark:hover:border-blue-500"
                        >
                            <CheckCircle2 className="mx-auto mb-2 size-5 text-blue-700 transition-transform group-hover:scale-110 dark:text-blue-400" />
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Cek Dapodik
                            </div>
                            <div className="text-[10px] text-slate-500">
                                {safeStats.dataCheckIssues} Catatan
                            </div>
                        </Link>

                        <Link
                            href="/respons-insiden"
                            className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center transition-all hover:border-blue-500 hover:bg-white dark:border-slate-800 dark:bg-[#111c30] dark:hover:border-blue-500"
                        >
                            <Siren className="mx-auto mb-2 size-5 text-blue-700 transition-transform group-hover:scale-110 dark:text-blue-400" />
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Tanggap Darurat
                            </div>
                            <div className="text-[10px] text-slate-500">
                                SOP & Insiden
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

Dashboard.layout = (page: React.ReactNode) => page;
