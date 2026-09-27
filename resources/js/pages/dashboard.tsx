import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Clock,
    CreditCard,
    Eye,
    FileText,
    GraduationCap,
    HeartPulse,
    Menu,
    PhoneCall,
    Plus,
    Printer,
    RefreshCw,
    Scale,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Siren,
    Sparkles,
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
    incidents: _incidents,
    parentUpdates: _parentUpdates,
    atsList: _atsList,
}: DashboardPageProps) {
    const {
        openFollowupModal,
        openParentContactModal,
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

    // Executive & Academic Metrics
    const averageAttendance =
        classList.length > 0
            ? Math.round(
                  (classList.reduce(
                      (acc, c) => acc + (c.attendanceRate || 0),
                      0,
                  ) /
                      classList.length) *
                      10,
              ) / 10
            : 94.2;

    const totalStudentsInClasses = classList.reduce(
        (acc, c) => acc + (c.totalStudents || 0),
        0,
    );

    const verifiedDocs = docList.filter((d) => d.status === 'Terverifikasi');
    const docComplianceRate =
        docList.length > 0
            ? Math.round((verifiedDocs.length / docList.length) * 100)
            : 91;

    const paidPayments = payments.filter((p) => p.status === 'Lunas');
    const totalRevenue = payments.reduce(
        (acc, p) => (p.status === 'Lunas' ? acc + (p.amount || 0) : acc),
        0,
    );
    const totalBilled = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const paymentRate =
        totalBilled > 0
            ? Math.round((totalRevenue / totalBilled) * 100)
            : 88;

    const totalCases = caseList.length || 1;
    const handledCases = caseList.filter(
        (c) =>
            c.stage === 'handled_by_bk' ||
            c.stage === 'resolved' ||
            c.isHandledByBk,
    ).length;
    const caseResolutionRate = Math.round((handledCases / totalCases) * 100);

    return (
        <FlowbiteTanggapinLayout
            activeTab="overview"
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
        >
            <Head
                title={
                    currentRole === 'kepala_sekolah'
                        ? 'Dashboard Supervisi Sekolah — TANGGAPIN'
                        : `Dashboard ${activeRoleConfig.title} — TANGGAPIN`
                }
            />

            <div className="mx-auto max-w-7xl space-y-7 pb-12">
                {/* Mobile Quick Navigation Bar */}
                <div className="flex sm:hidden items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent('toggle-tanggapin-sidebar'),
                                )
                            }
                            className="flex size-9 items-center justify-center rounded-lg bg-blue-700 text-white transition-all active:scale-95"
                            aria-label="Buka Menu Sidebar"
                        >
                            <Menu className="size-4" />
                        </button>
                        <div>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                                Navigasi Dashboard
                            </span>
                            <span className="text-[11px] text-slate-500">
                                Buka modul dan menu peran
                            </span>
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
                        <Shield className="size-3" />
                        {activeRoleConfig.shortTitle}
                    </span>
                </div>

                {currentRole === 'kepala_sekolah' ? (
                    /* ========================================================================= */
                    /* EXECUTIVE DASHBOARD (KEPALA SEKOLAH)                                      */
                    /* ========================================================================= */
                    <div className="space-y-7">
                        {/* 1. Executive Context Header */}
                        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-700 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                        <ShieldCheck className="size-3" />
                                        SUPERVISI EKSEKUTIF
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        T.A. 2025/2026 Ganjil • Terpadu
                                    </span>
                                    <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                                        •
                                    </span>
                                    <span className="hidden text-xs text-slate-600 dark:text-slate-400 sm:inline">
                                        Status Sekolah: Terkendali & Kondusif
                                    </span>
                                </div>

                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Dashboard Supervisi & Mutu Sekolah
                                </h1>

                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                                    Selamat bertugas, <strong className="font-semibold text-slate-900 dark:text-white">{activeRoleConfig.userName}</strong>. Pantau perkembangan rombel, kepatuhan perangkat ajar guru, dan akuntabilitas sekolah.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 flex-wrap items-center gap-2.5 self-start lg:self-center">
                                <Link
                                    href="/supervisi-akademik"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
                                >
                                    <Sparkles className="size-3.5" />
                                    <span>AI Supervisi GTK</span>
                                </Link>
                                <Link
                                    href="/evaluasi-sekolah"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
                                >
                                    <BarChart3 className="size-3.5" />
                                    <span>AI Rapor Mutu</span>
                                </Link>
                                <Link
                                    href="/persetujuan-sekolah"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                    <ShieldCheck className="size-3.5 text-blue-600" />
                                    <span>Persetujuan</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-95 cursor-pointer"
                                >
                                    <Printer className="size-3.5" />
                                    <span>Cetak</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                    <RefreshCw className="size-3.5 text-slate-400" />
                                    <span>Segarkan</span>
                                </button>
                            </div>
                        </div>

                        {/* 2. 4 Executive KPI Scorecards */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {/* KPI 1 */}
                            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                            Rata-rata Presensi
                                        </span>
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                            <GraduationCap className="size-4" />
                                        </div>
                                    </div>
                                    <div className="mt-2.5 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {averageAttendance}%
                                        </span>
                                        <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                            +1.8% stabil
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Target: ≥ 90.0% • {classList.length} Rombel Aktif
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-700 dark:bg-blue-500"
                                            style={{ width: `${Math.min(averageAttendance, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* KPI 2 */}
                            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                            Penanganan Siswa
                                        </span>
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                            <ShieldAlert className="size-4" />
                                        </div>
                                    </div>
                                    <div className="mt-2.5 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {caseResolutionRate}%
                                        </span>
                                        <span className="text-xs font-medium text-slate-500">
                                            {handledCases}/{totalCases} Selesai
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Rujukan wali kelas dan konseling tertangani
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-700 dark:bg-blue-500"
                                            style={{ width: `${Math.min(caseResolutionRate, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* KPI 3 */}
                            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                            Administrasi Guru (GTK)
                                        </span>
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                            <FileText className="size-4" />
                                        </div>
                                    </div>
                                    <div className="mt-2.5 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {docComplianceRate}%
                                        </span>
                                        <span className="text-xs font-medium text-slate-500">
                                            {verifiedDocs.length}/{docList.length || 1} Berkas
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Modul ajar dan perangkat kurikulum
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-700 dark:bg-blue-500"
                                            style={{ width: `${Math.min(docComplianceRate, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* KPI 4 */}
                            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                            Realisasi Kas SPP
                                        </span>
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                            <CreditCard className="size-4" />
                                        </div>
                                    </div>
                                    <div className="mt-2.5 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {paymentRate}%
                                        </span>
                                        <span className="text-xs font-medium text-slate-500">
                                            Rp {(totalRevenue / 1_000_000).toFixed(1)} Jt
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {paidPayments.length} transaksi lunas bulan ini
                                    </p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-700 dark:bg-blue-500"
                                            style={{ width: `${Math.min(paymentRate, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Matriks Pemantauan Seluruh Rombel */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                        Matriks Pemantauan Rombel
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Supervisi presensi, ketertiban, dan kondisi kelas binaan.
                                    </p>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    Total: <strong className="font-semibold text-slate-900 dark:text-white">{totalStudentsInClasses || 144} Siswa</strong>
                                </div>
                            </div>

                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                    <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                        <tr>
                                            <th className="py-3 px-4">Rombel</th>
                                            <th className="py-3 px-4">Wali Kelas</th>
                                            <th className="py-3 px-4 text-center">Siswa</th>
                                            <th className="py-3 px-4">Presensi</th>
                                            <th className="py-3 px-4 text-center">Perlu Perhatian</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                        {classList.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-slate-400">
                                                    Belum ada data rombel.
                                                </td>
                                            </tr>
                                        ) : (
                                            classList.map((cls) => (
                                                <tr key={cls.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                                                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                                                        <div className="font-bold">{cls.name}</div>
                                                        <div className="text-[10px] text-slate-400">{cls.major}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-medium text-slate-800 dark:text-slate-200">{cls.homeroomTeacher}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                                                        {cls.totalStudents}
                                                    </td>
                                                    <td className="py-3.5 px-4 min-w-[130px]">
                                                        <div className="flex items-center justify-between text-[11px] mb-1">
                                                            <span className="font-bold text-slate-800 dark:text-slate-200">{cls.attendanceRate}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full bg-blue-700 dark:bg-blue-500"
                                                                style={{ width: `${cls.attendanceRate}%` }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        {cls.studentsAtRisk > 0 ? (
                                                            <span className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                                {cls.studentsAtRisk} siswa
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 text-[11px]">Nihil</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                            {cls.healthStatus === 'critical' ? 'Intervensi' : cls.healthStatus === 'warning' ? 'Perhatian' : 'Kondusif'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 4. Strategic Overview Columns */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Left: Case & Counseling Supervision */}
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Supervisi Rujukan & Kasus Siswa
                                        </h3>
                                        <p className="text-[11px] text-slate-500">
                                            Rujukan dari wali kelas dan penanganan Guru BK.
                                        </p>
                                    </div>
                                    <Link
                                        href="/manajemen-kasus"
                                        className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                    >
                                        Semua Kasus →
                                    </Link>
                                </div>

                                <div className="space-y-3 pt-1">
                                    {caseList.slice(0, 3).map((c) => {
                                        const isHandled =
                                            c.isHandledByBk ||
                                            c.stage === 'handled_by_bk' ||
                                            c.stage === 'resolved' ||
                                            !!c.handledAt;

                                        return (
                                            <div
                                                key={c.id}
                                                className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
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
                                                        {c.category}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                                                    {c.referralNotes || c.lastActivity}
                                                </p>
                                                <div className="flex items-center justify-between border-t border-slate-200/80 pt-2 text-[11px] text-slate-500 dark:border-slate-800">
                                                    <span>Konselor: {c.handledByBkName || c.assignee}</span>
                                                    <span className="font-semibold text-blue-700 dark:text-blue-400">
                                                        {isHandled ? '✓ Selesai' : 'Dalam Proses'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right: Finance & Document Compliance */}
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Kepatuhan Dokumen GTK & Keuangan
                                        </h3>
                                        <p className="text-[11px] text-slate-500">
                                            Status kelengkapan modul ajar dan kas SPP.
                                        </p>
                                    </div>
                                    <Link
                                        href="/dokumen-guru"
                                        className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                    >
                                        Semua Dokumen →
                                    </Link>
                                </div>

                                <div className="space-y-3 pt-1">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                Realisasi Kas SPP
                                            </span>
                                            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                {paymentRate}% Lunas
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                                            <div>
                                                <span className="text-slate-400 block text-[10px]">Terverifikasi:</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                                    Rp {(totalRevenue / 1_000_000).toFixed(2)} Jt
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px]">Tunggakan:</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                                    Rp {((totalBilled - totalRevenue) / 1_000_000).toFixed(2)} Jt
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {docList.slice(0, 2).map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                        >
                                            <div className="min-w-0 flex-1 pe-2">
                                                <div className="truncate font-semibold text-slate-900 dark:text-white">
                                                    {doc.title}
                                                </div>
                                                <div className="truncate text-[10px] text-slate-500">
                                                    {doc.teacher} • {doc.period}
                                                </div>
                                            </div>
                                            <span className="shrink-0 rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {doc.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 5. Shortcuts for Kepala Sekolah */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Pintasan Supervisi Eksekutif
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Akses instan modul supervisi dan persetujuan sekolah.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-5">
                                <Link
                                    href="/supervisi-akademik"
                                    className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                >
                                    <Sparkles className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                        AI Supervisi GTK
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        Evaluasi Kurikulum
                                    </div>
                                </Link>

                                <Link
                                    href="/evaluasi-sekolah"
                                    className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                >
                                    <BarChart3 className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                        AI Rapor Mutu
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        Standar Kemendikbud
                                    </div>
                                </Link>

                                <Link
                                    href="/persetujuan-sekolah"
                                    className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                >
                                    <ShieldCheck className="size-3.5 text-blue-700 dark:text-blue-400" />
                                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                        Pusat Persetujuan
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        Otorisasi Kebijakan
                                    </div>
                                </Link>

                                <Link
                                    href="/kondisi-kelas"
                                    className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                >
                                    <GraduationCap className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                        Kondisi Rombel
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        {classList.length} Kelas Aktif
                                    </div>
                                </Link>

                                <Link
                                    href="/pembayaran"
                                    className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                >
                                    <CreditCard className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                        Keuangan SPP
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        Rekonsiliasi Kas
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ========================================================================= */
                    /* ROLE-TAILORED OPERATIONAL DASHBOARDS                                      */
                    /* ========================================================================= */
                    <div className="space-y-7">
                        {/* 1. Context Header */}
                        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-md bg-blue-700 px-2.5 py-0.5 text-[10px] font-bold text-white">
                                        TANGGAPIN
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        T.A. 2025/2026 Ganjil
                                    </span>
                                    <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                                        •
                                    </span>
                                    <span className="hidden text-xs text-slate-600 dark:text-slate-400 sm:inline">
                                        {activeRoleConfig.scopeBadge}
                                    </span>
                                </div>

                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Selamat bertugas, {activeRoleConfig.userName}
                                </h1>

                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                                    {activeRoleConfig.roleDesc}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 self-start lg:self-center">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
                                    <Shield className="size-3.5" />
                                    Peran: {activeRoleConfig.title}
                                </span>
                            </div>
                        </div>

                        {/* 2. Role-Specific Metric Cards */}
                        {currentRole === 'operator' ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <Link
                                    href="/kelola-pengguna"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Kelola Pengguna
                                            </span>
                                            <Users className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            Akun GTK
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Kelola akun guru & kuota rombel
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Buka Akun GTK</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/dapodik"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Residu Dapodik
                                            </span>
                                            <CheckCircle2 className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {safeStats.dataCheckIssues}
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Validasi NISN & residu rombel
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Tinjau Residu</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/pembayaran"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Keuangan SPP
                                            </span>
                                            <CreditCard className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {safeStats.duePayments}
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Monitoring tagihan & bukti bayar
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Kelola SPP</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/dokumen-guru"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Dokumen GTK
                                            </span>
                                            <FileText className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {docList.length} Berkas
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            SK penugasan & perangkat ajar
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Verifikasi Berkas</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>
                            </div>
                        ) : currentRole === 'guru' ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <Link
                                    href="/dokumen-guru"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Perangkat Ajar
                                            </span>
                                            <FileText className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {docList.length} Modul
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Modul Ajar & ATP Kurikulum Merdeka
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Buka Modul Ajar</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/dokumen-guru"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Pra-Audit AI
                                            </span>
                                            <Sparkles className="size-4 text-blue-600 transition-colors group-hover:text-blue-700" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-400">
                                            93 / 100
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Kesesuaian CP, TP & Asesmen
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Uji Kelayakan AI</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/kondisi-kelas"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Murid yang Diajar
                                            </span>
                                            <Users className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {totalStudentsInClasses || 108} Siswa
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Tersebar di {classList.length || 3} rombel
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Pantau Murid</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/rapor-siswa"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Asesmen Capaian
                                            </span>
                                            <GraduationCap className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            88.6%
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Ketuntasan Tujuan Pembelajaran
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Input Asesmen</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>
                            </div>
                        ) : currentRole === 'wali_kelas' ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <Link
                                    href="/early-warning"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Sinyal Anak Wali
                                            </span>
                                            <AlertTriangle className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {safeStats.studentsNeedingAttention} Siswa
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Presensi & ketertiban anak wali
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Tinjau Sinyal</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/kondisi-kelas"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Poin Disiplin
                                            </span>
                                            <Scale className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {safeStats.activeCases} Catatan
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Pembinaan karakter anak wali
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Buka Disiplin</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/manajemen-kasus"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Rujukan ke Guru BK
                                            </span>
                                            <ShieldAlert className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {safeStats.activeCases} Kasus
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Dikoordinasikan dengan konselor
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Status Rujukan</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/kondisi-kelas"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Presensi Rombel
                                            </span>
                                            <GraduationCap className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            94.8%
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Kehadiran rombel binaan bulan ini
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Rekap Presensi</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>
                            </div>
                        ) : currentRole === 'bendahara' ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <Link
                                    href="/pembayaran"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Realisasi SPP
                                            </span>
                                            <CreditCard className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {paymentRate}%
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Tercapai dari target bulan berjalan
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Buka SPP</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/pembayaran"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Tagihan Tertunda
                                            </span>
                                            <AlertTriangle className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {safeStats.duePayments} Siswa
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Jatuh tempo butuh reminder santun
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Daftar Tagihan</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/analisis-keuangan"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                AI Arus Kas
                                            </span>
                                            <Sparkles className="size-4 text-blue-600 transition-colors group-hover:text-blue-700" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-400">
                                            Sehat
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Proyeksi kas operasional lancar
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Analisis Kas</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/laporan-keuangan"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Kas Masuk
                                            </span>
                                            <BarChart3 className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            Rp {(totalRevenue / 1_000_000).toFixed(1)} Jt
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Penerimaan terverifikasi bulan ini
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Buku Kas Umum</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            /* Default / Guru BK */
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <Link
                                    href="/early-warning"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Perlu Konseling
                                            </span>
                                            <AlertTriangle className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {safeStats.studentsNeedingAttention} Siswa
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Sinyal presensi & kendala belajar
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Tinjau Siswa</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/manajemen-kasus"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Kasus Aktif BK
                                            </span>
                                            <ShieldAlert className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {safeStats.activeCases} Kasus
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Dalam sesi bimbingan terjadwal
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Papan Kasus</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/manajemen-kasus"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Konseling Tuntas
                                            </span>
                                            <CheckCircle2 className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {safeStats.resolvedThisMonth}
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Selesai didampingi bulan ini
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Arsip Layanan</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>

                                <Link
                                    href="/kondisi-kelas"
                                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0b1120] dark:hover:border-slate-700"
                                >
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                                Rata-rata Hadir
                                            </span>
                                            <GraduationCap className="size-4 text-slate-400 transition-colors group-hover:text-blue-700 dark:text-slate-500" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            92.4%
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Presensi lintas rombel
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-700 dark:border-slate-800 dark:text-blue-400">
                                        <span>Pantau Rombel</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* 3. Early Warning Priority Feed (Shown only for Wali Kelas and Guru BK) */}
                        {(currentRole === 'wali_kelas' || currentRole === 'guru_bk') && (
                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                            Perlu Perhatian & Tindak Lanjut
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Sinyal risiko siswa yang membutuhkan penanganan.
                                        </p>
                                    </div>

                                    {/* Filter Severity Pills */}
                                    <div className="flex items-center gap-1.5 self-start sm:self-center">
                                        <button
                                            type="button"
                                            onClick={() => setFeedRiskFilter('all')}
                                            className={cn(
                                                'rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
                                                feedRiskFilter === 'all'
                                                    ? 'bg-blue-700 text-white'
                                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                            )}
                                        >
                                            Semua: {feed.length}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFeedRiskFilter('high')}
                                            className={cn(
                                                'rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
                                                feedRiskFilter === 'high'
                                                    ? 'bg-blue-700 text-white'
                                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                            )}
                                        >
                                            Kritis: {feed.filter((f) => f.riskLevel === 'high').length}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFeedRiskFilter('medium')}
                                            className={cn(
                                                'rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
                                                feedRiskFilter === 'medium'
                                                    ? 'bg-blue-700 text-white'
                                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                            )}
                                        >
                                            Perhatian: {feed.filter((f) => f.riskLevel === 'medium').length}
                                        </button>
                                    </div>
                                </div>

                                {/* Feed Items */}
                                <div className="space-y-3 pt-1">
                                    {filteredPriorityFeed.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-colors lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0f172a]/40"
                                        >
                                            <div className="flex-1 space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                                                        {alert.studentName}
                                                    </span>
                                                    <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {alert.class}
                                                    </span>
                                                    <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                        {alert.triggerType}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        • {alert.timestamp}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {alert.summary}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                                                    <span>Wali Kelas: {alert.homeroomTeacher}</span>
                                                    <span>Ortu: {alert.parentName} ({alert.parentPhone})</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex shrink-0 flex-wrap items-center gap-2 self-start lg:self-center">
                                                <button
                                                    type="button"
                                                    onClick={() => openStudent360Modal(alert)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                                                >
                                                    <Eye className="size-3.5 text-blue-700" />
                                                    <span>Profil 360</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openFollowupModal({
                                                            studentId: alert.studentId || alert.id,
                                                            studentName: `${alert.studentName} — ${alert.class}`,
                                                            studentPhone: alert.parentPhone,
                                                            note: `Tindak lanjut: ${alert.summary}`,
                                                        })
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-800 cursor-pointer"
                                                >
                                                    <Plus className="size-3.5" />
                                                    <span>Tindak Lanjut</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openParentContactModal({
                                                            studentId: alert.studentId || alert.id,
                                                            studentName: `${alert.studentName} — ${alert.class}`,
                                                            studentPhone: alert.parentPhone,
                                                            message: `Yth. Bapak/Ibu ${alert.parentName}, ananda ${alert.studentName}: ${alert.summary}. Mohon koordinasi dengan sekolah.`,
                                                        })
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                                                >
                                                    <PhoneCall className="size-3.5 text-slate-400" />
                                                    <span>Hubungi Ortu</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. Role-Tailored Middle Split Sections */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Role = Guru (Guru Mapel) */}
                            {currentRole === 'guru' ? (
                                <>
                                    {/* Left: Modul Ajar & Kurikulum Merdeka */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Modul Ajar Kurikulum Merdeka
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Kelola Modul Ajar, ATP, dan kelengkapan ajar.
                                                </p>
                                            </div>
                                            <Link
                                                href="/dokumen-guru"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Semua Modul →
                                            </Link>
                                        </div>

                                        <div className="space-y-3 pt-1">
                                            {docList.slice(0, 3).map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {doc.title}
                                                        </span>
                                                        <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                            {doc.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500">
                                                        Mapel Kejuruan • Periode {doc.period} • Terakreditasi
                                                    </p>
                                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[11px] dark:border-slate-800">
                                                        <span className="text-slate-500">Pra-Audit AI: 94/100</span>
                                                        <Link
                                                            href="/dokumen-guru"
                                                            className="font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                                        >
                                                            Uji Dokumen →
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Monitoring Siswa & Capaian Belajar */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Capaian Belajar Murid yang Diajar
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Pantau capaian asesmen & remedial per kelas.
                                                </p>
                                            </div>
                                            <Link
                                                href="/kondisi-kelas"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Semua Murid →
                                            </Link>
                                        </div>

                                        <div className="space-y-3 pt-1">
                                            {classList.slice(0, 3).map((cls) => (
                                                <div
                                                    key={cls.id}
                                                    className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="font-bold text-slate-900 dark:text-white">
                                                                {cls.name}
                                                            </span>
                                                            <span className="text-slate-400 text-xs ml-1">
                                                                ({cls.totalStudents} siswa)
                                                            </span>
                                                        </div>
                                                        <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            Ketuntasan: 91%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                        <span>Wali: {cls.homeroomTeacher}</span>
                                                        <span>Perlu Pengayaan: {cls.studentsAtRisk} Siswa</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : currentRole === 'bendahara' ? (
                                <>
                                    {/* Left: SPP */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Tagihan & Verifikasi SPP
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Verifikasi transfer dan penerimaan SPP.
                                                </p>
                                            </div>
                                            <Link
                                                href="/pembayaran"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Semua Tagihan →
                                            </Link>
                                        </div>
                                        <div className="space-y-3 pt-1">
                                            {payments.slice(0, 3).map((p) => (
                                                <div
                                                    key={p.id}
                                                    className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {p.studentName}
                                                        </span>
                                                        <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                            {p.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                                                        <span>{p.class} • Tempo {p.dueDate}</span>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                                            Rp {p.amount.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Reminder Tagihan Ortu */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Reminder Tagihan Orang Tua
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Pemberitahuan santun tagihan berkala.
                                                </p>
                                            </div>
                                            <Link
                                                href="/reminder-spp"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Pusat Reminder →
                                            </Link>
                                        </div>
                                        <div className="space-y-3 pt-1">
                                            {feed.slice(0, 3).map((f) => (
                                                <div
                                                    key={f.id}
                                                    className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {f.studentName}
                                                        </span>
                                                        <span className="text-[11px] text-slate-500">
                                                            Wali: {f.parentName}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                                        Status tagihan SPP semester berjalan dalam pengingat santun.
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : currentRole === 'operator' ? (
                                <>
                                    {/* Left: Dapodik Residu */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Validasi Residu Dapodik
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Pengecekan anomali data siswa & rombel.
                                                </p>
                                            </div>
                                            <Link
                                                href="/dapodik"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Semua Residu →
                                            </Link>
                                        </div>
                                        <div className="space-y-3 pt-1">
                                            {dapodikList.slice(0, 3).map((d) => (
                                                <div
                                                    key={d.id}
                                                    className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
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

                                    {/* Right: Dokumen Guru */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Dokumen & SK Pendidik
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Verifikasi SK pengampu dan modul ajar.
                                                </p>
                                            </div>
                                            <Link
                                                href="/dokumen-guru"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Semua Berkas →
                                            </Link>
                                        </div>
                                        <div className="space-y-3 pt-1">
                                            {docList.slice(0, 3).map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {doc.title}
                                                        </span>
                                                        <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                            {doc.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500">
                                                        Pendidik: {doc.teacher} • Periode {doc.period}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : currentRole === 'wali_kelas' ? (
                                <>
                                    {/* Left: Kondisi Rombel Anak Wali */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Kondisi Rombel Anak Wali
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Pantauan presensi & perkembangan anak wali.
                                                </p>
                                            </div>
                                            <Link
                                                href="/kondisi-kelas"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Detail Rombel →
                                            </Link>
                                        </div>

                                        <div className="space-y-3 pt-1">
                                            {classList.slice(0, 3).map((cls) => (
                                                <div
                                                    key={cls.id}
                                                    className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="font-bold text-slate-900 dark:text-white">
                                                                {cls.name}
                                                            </span>
                                                            <span className="text-slate-400 text-xs ml-1">
                                                                • {cls.totalStudents} Siswa
                                                            </span>
                                                        </div>
                                                        <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                            Presensi {cls.attendanceRate}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                                        <span>Wali: {cls.homeroomTeacher}</span>
                                                        <span>Perlu Didampingi: {cls.studentsAtRisk} siswa</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Rujukan ke Guru BK */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Status Rujukan Siswa ke BK
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Tindak lanjut kendala siswa oleh Guru BK.
                                                </p>
                                            </div>
                                            <Link
                                                href="/manajemen-kasus"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Pusat Rujukan →
                                            </Link>
                                        </div>

                                        <div className="space-y-3 pt-1">
                                            {caseList.slice(0, 3).map((c) => {
                                                const isHandled =
                                                    c.isHandledByBk ||
                                                    c.stage === 'handled_by_bk' ||
                                                    c.stage === 'resolved' ||
                                                    !!c.handledAt;

                                                return (
                                                    <div
                                                        key={c.id}
                                                        className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                                                                    {c.code}
                                                                </span>
                                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                                    {c.studentName}
                                                                </span>
                                                            </div>
                                                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                {isHandled ? '✓ Ditangani BK' : 'Antrean BK'}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                                            {c.referralNotes || c.lastActivity}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Default / Guru BK */
                                <>
                                    {/* Left: Kondisi Rombel */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Kondisi Rombel Lintas Kelas
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Pantauan rombel untuk intervensi konseling.
                                                </p>
                                            </div>
                                            <Link
                                                href="/kondisi-kelas"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Semua Rombel →
                                            </Link>
                                        </div>
                                        <div className="space-y-3 pt-1">
                                            {classList.slice(0, 3).map((cls) => (
                                                <div
                                                    key={cls.id}
                                                    className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-slate-900 dark:text-white">
                                                            {cls.name} ({cls.totalStudents} siswa)
                                                        </span>
                                                        <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                            Hadir: {cls.attendanceRate}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                        <span>Wali: {cls.homeroomTeacher}</span>
                                                        <span>Rawan: {cls.studentsAtRisk} siswa</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Rujukan Masuk BK */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Rujukan Masuk dari Wali Kelas
                                                </h3>
                                                <p className="text-[11px] text-slate-500">
                                                    Kendala siswa untuk bimbingan konseling.
                                                </p>
                                            </div>
                                            <Link
                                                href="/manajemen-kasus"
                                                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                            >
                                                Papan Kasus →
                                            </Link>
                                        </div>
                                        <div className="space-y-3 pt-1">
                                            {caseList.slice(0, 3).map((c) => (
                                                <div
                                                    key={c.id}
                                                    className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                                                                {c.code}
                                                            </span>
                                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                                {c.studentName}
                                                            </span>
                                                        </div>
                                                        <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            {c.priority}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                                        {c.referralNotes || c.lastActivity}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[11px] text-slate-500 dark:border-slate-800">
                                                        <span>Perujuk: {c.referredByName || 'Wali Kelas'}</span>
                                                        <Link
                                                            href="/manajemen-kasus"
                                                            className="font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                                        >
                                                            Tangani →
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 5. Role-Tailored Module Shortcuts */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Pintasan Modul Operasional
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Akses cepat ke modul sesuai kewenangan peran Anda.
                                </p>
                            </div>

                            {currentRole === 'guru' ? (
                                <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
                                    <Link
                                        href="/dokumen-guru"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <FileText className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Modul Ajar Guru
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Kurikulum Merdeka
                                        </div>
                                    </Link>

                                    <Link
                                        href="/dokumen-guru"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <Sparkles className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Pra-Audit AI
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Kesiapan Modul Ajar
                                        </div>
                                    </Link>

                                    <Link
                                        href="/kondisi-kelas"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <Users className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Murid yang Diajar
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Lintas Rombel
                                        </div>
                                    </Link>

                                    <Link
                                        href="/rapor-siswa"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <GraduationCap className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Asesmen Capaian
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Formatif & Sumatif
                                        </div>
                                    </Link>
                                </div>
                            ) : currentRole === 'wali_kelas' ? (
                                <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-5">
                                    <Link
                                        href="/early-warning"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <AlertTriangle className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Early Warning
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Sinyal Anak Wali
                                        </div>
                                    </Link>

                                    <Link
                                        href="/kondisi-kelas"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <GraduationCap className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Siswa Anak Wali
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Presensi & Karakter
                                        </div>
                                    </Link>

                                    <Link
                                        href="/manajemen-kasus"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <ShieldAlert className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Rujukan ke BK
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Status Penanganan
                                        </div>
                                    </Link>

                                    <Link
                                        href="/rapor-siswa"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <Sparkles className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Rapor Anak Wali
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Sintesis AI
                                        </div>
                                    </Link>

                                    <Link
                                        href="/komunikasi-ortu"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <PhoneCall className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Kontak Orang Tua
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Pesan Tanda Terima
                                        </div>
                                    </Link>
                                </div>
                            ) : currentRole === 'bendahara' ? (
                                <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
                                    <Link
                                        href="/pembayaran"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <CreditCard className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Pembayaran & SPP
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Rekonsiliasi Kas
                                        </div>
                                    </Link>

                                    <Link
                                        href="/analisis-keuangan"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <Sparkles className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            AI Keuangan
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Analisis Arus Kas
                                        </div>
                                    </Link>

                                    <Link
                                        href="/laporan-keuangan"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <BarChart3 className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Buku Kas Umum
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Laporan Pembukuan
                                        </div>
                                    </Link>

                                    <Link
                                        href="/reminder-spp"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <PhoneCall className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Reminder SPP
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Pemberitahuan Ortu
                                        </div>
                                    </Link>
                                </div>
                            ) : currentRole === 'operator' ? (
                                <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-5">
                                    <Link
                                        href="/kelola-pengguna"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <Users className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Kelola Pengguna
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Akun GTK & Staf
                                        </div>
                                    </Link>

                                    <Link
                                        href="/dapodik"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <CheckCircle2 className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Cek Dapodik
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Residu & Validasi
                                        </div>
                                    </Link>

                                    <Link
                                        href="/pembayaran"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <CreditCard className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Keuangan SPP
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Pembayaran Siswa
                                        </div>
                                    </Link>

                                    <Link
                                        href="/dokumen-guru"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <FileText className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Dokumen GTK
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            SK & Modul Ajar
                                        </div>
                                    </Link>

                                    <Link
                                        href="/respons-insiden"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <Siren className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Tanggap Darurat
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            SOP & Insiden
                                        </div>
                                    </Link>
                                </div>
                            ) : (
                                /* Default / Guru BK */
                                <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-6">
                                    <Link
                                        href="/early-warning"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <AlertTriangle className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Early Warning
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Deteksi Dini
                                        </div>
                                    </Link>

                                    <Link
                                        href="/kondisi-kelas"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <GraduationCap className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Kondisi Kelas
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Semua Rombel
                                        </div>
                                    </Link>

                                    <Link
                                        href="/pemantau-atribut"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <Scale className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Kamera Atribut
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            AI Vision Disiplin
                                        </div>
                                    </Link>

                                    <Link
                                        href="/manajemen-kasus"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <ShieldAlert className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Kasus BK
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Layanan Konseling
                                        </div>
                                    </Link>

                                    <Link
                                        href="/rapor-siswa"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <Sparkles className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Rapor Bimbingan
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Sintesis AI Karakter
                                        </div>
                                    </Link>

                                    <Link
                                        href="/alur-ats"
                                        className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/40 dark:hover:border-slate-700"
                                    >
                                        <HeartPulse className="mx-auto mb-2 size-5 text-blue-700 dark:text-blue-400" />
                                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Mitigasi ATS
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Anak Tidak Sekolah
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </FlowbiteTanggapinLayout>
    );
}

Dashboard.layout = (page: React.ReactNode) => page;
