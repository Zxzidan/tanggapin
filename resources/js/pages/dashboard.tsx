import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    Eye,
    FileText,
    GraduationCap,
    HeartPulse,
    Inbox,
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
    TrendingUp,
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
    incidents,
    parentUpdates,
    atsList,
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

    // Executive Metrics for Kepala Sekolah Monitoring
    const averageAttendance = classList.length > 0
        ? Math.round((classList.reduce((acc, c) => acc + (c.attendanceRate || 0), 0) / classList.length) * 10) / 10
        : 94.2;

    const totalStudentsInClasses = classList.reduce((acc, c) => acc + (c.totalStudents || 0), 0);

    const verifiedDocs = docList.filter((d) => d.status === 'Terverifikasi');
    const docComplianceRate = docList.length > 0
        ? Math.round((verifiedDocs.length / docList.length) * 100)
        : 91;

    const paidPayments = payments.filter((p) => p.status === 'Lunas');
    const totalRevenue = payments.reduce((acc, p) => p.status === 'Lunas' ? acc + (p.amount || 0) : acc, 0);
    const totalBilled = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const paymentRate = totalBilled > 0
        ? Math.round((totalRevenue / totalBilled) * 100)
        : 88;

    const totalCases = caseList.length || 1;
    const handledCases = caseList.filter((c) => c.stage === 'handled_by_bk' || c.stage === 'resolved' || c.isHandledByBk).length;
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
                        ? 'Dashboard Monitoring Perkembangan Sekolah — TANGGAPIN'
                        : 'Ikhtisar & Tindakan — TANGGAPIN'
                }
            />

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

                {currentRole === 'kepala_sekolah' ? (
                    /* ========================================================================= */
                    /* EXECUTIVE SCHOOL MONITORING DASHBOARD (KHUSUS KEPALA SEKOLAH)            */
                    /* ========================================================================= */
                    <div className="space-y-6 sm:space-y-8">
                        {/* 1. EXECUTIVE CONTEXT HEADER */}
                        <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                        <ShieldCheck className="size-3" />
                                        SUPERVISI EKSEKUTIF
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        T.A. 2025/2026 Ganjil • Tanggapin Intelligence
                                    </span>
                                    <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                                        •
                                    </span>
                                    <span className="hidden text-xs font-medium text-emerald-600 dark:text-emerald-400 sm:inline flex items-center gap-1">
                                        <span className="size-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                        Kondisi Sekolah: Kondusif & Normal
                                    </span>
                                </div>

                                <h1 className="pt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                    Dashboard Monitoring Perkembangan Sekolah
                                </h1>

                                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300 max-w-3xl">
                                    Selamat bertugas, <strong className="font-semibold text-slate-900 dark:text-white">{activeRoleConfig.userName}</strong>.
                                    Halaman ini didesain khusus bagi pimpinan sekolah untuk memantau performa terpadu seluruh rombel, efektivitas penanganan kasus kesiswaan, kepatuhan administrasi pendidik, serta transparansi keuangan secara menyeluruh.
                                </p>
                            </div>

                            {/* Action Buttons for Kepala Sekolah */}
                            <div className="flex shrink-0 flex-wrap items-center gap-2.5 self-start lg:self-center">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95 cursor-pointer"
                                >
                                    <Printer className="size-4" />
                                    <span>Cetak Laporan Supervisi</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                    <RefreshCw className="size-3.5 text-slate-500" />
                                    <span>Muat Ulang Data</span>
                                </button>
                            </div>
                        </div>

                        {/* 2. 4 EXECUTIVE KPI SCORECARDS */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* KPI 1: Rata-rata Kehadiran Siswa */}
                            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                            Rata-rata Presensi Rombel
                                        </span>
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                            <GraduationCap className="size-4" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                            {averageAttendance}%
                                        </span>
                                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            <TrendingUp className="size-3" />
                                            +1.8%
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Target Standar: ≥ 90.0% • {classList.length} Rombel Aktif
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                                        <span>Pencapaian Target</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{averageAttendance}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                                            style={{ width: `${Math.min(averageAttendance, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* KPI 2: Efektivitas Layanan BK & Kasus */}
                            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                            Penanganan Kasus BK
                                        </span>
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                            <ShieldAlert className="size-4" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                            {caseResolutionRate}%
                                        </span>
                                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                            {handledCases}/{totalCases} Kasus
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {safeStats.activeCases} kasus dalam pendampingan aktif konselor
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                                        <span>Rasio Penyelesaian</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{caseResolutionRate}% Selesai</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                                            style={{ width: `${Math.min(caseResolutionRate, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* KPI 3: Kepatuhan Berkas GTK */}
                            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                            Administrasi Guru (GTK)
                                        </span>
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                            <FileText className="size-4" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                            {docComplianceRate}%
                                        </span>
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            {verifiedDocs.length}/{docList.length || 1} Berkas
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Modul ajar & perangkat pembelajaran terverifikasi
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                                        <span>Tingkat Kepatuhan GTK</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{docComplianceRate}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                                            style={{ width: `${Math.min(docComplianceRate, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* KPI 4: Arus Kas SPP Sekolah */}
                            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                            Realisasi Kas SPP
                                        </span>
                                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                            <CreditCard className="size-4" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                            {paymentRate}%
                                        </span>
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                            Rp {(totalRevenue / 1_000_000).toFixed(1)} Jt
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {paidPayments.length} transaksi lunas dari {payments.length} tagihan bulan ini
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                                        <span>Kolektibilitas SPP</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{paymentRate}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                                            style={{ width: `${Math.min(paymentRate, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. MATRIKS PENGAWASAN PERKEMBANGAN SELURUH ROMBEL (TABLE VIEW) */}
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-2 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                            Matriks Pemantauan Perkembangan Rombel (Kelas)
                                        </h2>
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Supervisi langsung indikator presensi, deteksi siswa berisiko, dan kondisi ketertiban per rombel.
                                    </p>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    Total Siswa Terpantau: <strong className="font-semibold text-slate-900 dark:text-white">{totalStudentsInClasses || 144} Siswa</strong>
                                </div>
                            </div>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                    <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                        <tr>
                                            <th className="py-3 px-3.5">Rombel & Jurusan</th>
                                            <th className="py-3 px-3.5">Wali Kelas</th>
                                            <th className="py-3 px-3.5 text-center">Siswa</th>
                                            <th className="py-3 px-3.5">Rasio Kehadiran</th>
                                            <th className="py-3 px-3.5 text-center">Siswa Berisiko</th>
                                            <th className="py-3 px-3.5 text-center">Status Rombel</th>
                                            <th className="py-3 px-3.5">Catatan Supervisi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                        {classList.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="py-8 text-center text-slate-400">
                                                    Belum ada data rombel yang dimuat.
                                                </td>
                                            </tr>
                                        ) : (
                                            classList.map((cls) => {
                                                const isCritical = cls.healthStatus === 'critical';
                                                const isWarning = cls.healthStatus === 'warning';

                                                return (
                                                    <tr key={cls.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                        <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white">
                                                            <div className="font-bold">{cls.name}</div>
                                                            <div className="text-[10px] text-slate-400 font-normal">{cls.major}</div>
                                                        </td>
                                                        <td className="py-3 px-3.5">
                                                            <div className="font-medium text-slate-800 dark:text-slate-200">{cls.homeroomTeacher}</div>
                                                            <div className="text-[10px] text-slate-400">Wali Kelas</div>
                                                        </td>
                                                        <td className="py-3 px-3.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                                                            {cls.totalStudents}
                                                        </td>
                                                        <td className="py-3 px-3.5 min-w-[140px]">
                                                            <div className="flex items-center justify-between text-[11px] mb-1">
                                                                <span className="font-bold text-slate-800 dark:text-slate-200">{cls.attendanceRate}%</span>
                                                                <span className="text-[10px] text-slate-400">
                                                                    {cls.attendanceRate >= 95 ? 'Sangat Baik' : cls.attendanceRate >= 90 ? 'Baik' : 'Kurang'}
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                                <div
                                                                    className={cn(
                                                                        'h-full rounded-full',
                                                                        cls.attendanceRate >= 95
                                                                            ? 'bg-blue-600 dark:bg-blue-500'
                                                                            : cls.attendanceRate >= 90
                                                                              ? 'bg-blue-500 dark:bg-blue-600'
                                                                              : 'bg-amber-500'
                                                                    )}
                                                                    style={{ width: `${cls.attendanceRate}%` }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3.5 text-center">
                                                            {cls.studentsAtRisk > 0 ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-300">
                                                                    {cls.studentsAtRisk} siswa
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-400 text-[11px]">Nihil</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-3.5 text-center">
                                                            <span
                                                                className={cn(
                                                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                                                                    isCritical
                                                                        ? 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300'
                                                                        : isWarning
                                                                          ? 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-300'
                                                                          : 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                                )}
                                                            >
                                                                {isCritical ? 'Perlu Intervensi' : isWarning ? 'Perlu Perhatian' : 'Kondisi Baik'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3.5 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                                                            {cls.studentsAtRisk > 0
                                                                ? `${cls.studentsAtRisk} siswa dalam pendampingan rujukan BK.`
                                                                : 'Presensi stabil, iklim kelas tertib dan kondusif.'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 4. DUA KOLOM PENGAWASAN STRATEGIS SEKOLAH */}
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {/* Kolom Kiri: Supervisi Kesiswaan, Disiplin & Layanan BK */}
                            <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                Supervisi Kasus & Layanan Bimbingan Konseling
                                            </h3>
                                        </div>
                                        <p className="mt-0.5 text-[11px] text-slate-500">
                                            Pemantauan status rujukan dari wali kelas dan penanganan oleh Guru BK.
                                        </p>
                                    </div>
                                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        Supervisi Pimpinan
                                    </span>
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
                                                className="space-y-2 rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40"
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
                                                    <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {c.category}
                                                    </span>
                                                </div>

                                                <div className="border-s-2 border-slate-300 ps-2.5 py-0.5 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                                    <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                                                        Catatan Rujukan:
                                                    </div>
                                                    <p className="mt-0.5 leading-relaxed">{c.referralNotes || c.lastActivity}</p>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px] text-slate-500 dark:border-slate-800">
                                                    <span>
                                                        Konselor BK: <strong className="font-medium text-slate-700 dark:text-slate-300">{c.handledByBkName || c.assignee}</strong>
                                                    </span>
                                                    <span className={cn('font-semibold', isHandled ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500')}>
                                                        {isHandled ? '✓ Selesai Ditangani BK' : 'Dalam Penanganan Konseling'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Zero Incident Safety Banner */}
                                <div className="flex items-center gap-3 rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                    <div className="leading-relaxed">
                                        <strong>Indikator Keamanan Sekolah:</strong> Nihil laporan insiden kritis dan perundungan fisik dalam 30 hari terakhir. Lingkungan sekolah aman dan kondusif.
                                    </div>
                                </div>
                            </div>

                            {/* Kolom Kanan: Supervisi Keuangan & Kepatuhan Pendidik (GTK) */}
                            <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                Supervisi Keuangan & Administrasi Pendidik
                                            </h3>
                                        </div>
                                        <p className="mt-0.5 text-[11px] text-slate-500">
                                            Pemantauan kepatuhan perangkat ajar guru dan transparansi penerimaan kas.
                                        </p>
                                    </div>
                                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        Tata Kelola
                                    </span>
                                </div>

                                {/* Rekapitulasi SPP Mini-card */}
                                <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            Ringkasan Penerimaan SPP Bulan Ini
                                        </span>
                                        <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                            {paymentRate}% Lunas
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                                        <div>
                                            <span className="text-slate-400 block text-[10px]">Kas Masuk Terverifikasi:</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                                Rp {(totalRevenue / 1_000_000).toFixed(2)} Juta
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block text-[10px]">Tunggakan / Belum Bayar:</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                                Rp {((totalBilled - totalRevenue) / 1_000_000).toFixed(2)} Juta
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Kepatuhan Modul Ajar GTK */}
                                <div className="space-y-2">
                                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                        Status Modul Ajar & RPP Terverifikasi ({verifiedDocs.length}/{docList.length})
                                    </div>
                                    {docList.slice(0, 3).map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-slate-50/30 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900/30"
                                        >
                                            <div className="min-w-0 flex-1 pe-2">
                                                <div className="truncate font-semibold text-slate-900 dark:text-white">
                                                    {doc.title}
                                                </div>
                                                <div className="truncate text-[10px] text-slate-500">
                                                    Pendidik: {doc.teacher} • Periode {doc.period}
                                                </div>
                                            </div>
                                            <span
                                                className={cn(
                                                    'shrink-0 rounded border px-2 py-0.5 text-[10px] font-medium',
                                                    doc.status === 'Terverifikasi'
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-300'
                                                )}
                                            >
                                                {doc.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Akuntabilitas Dapodik */}
                                <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50/50 p-3 text-xs dark:border-slate-800 dark:bg-[#0f172a]/40">
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white">
                                            Status Residu Data Dapodik
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            {safeStats.dataCheckIssues} anomali residu dalam pengawasan operator
                                        </div>
                                    </div>
                                    <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                        Terkendali
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 5. ARAHAN & CATATAN SUPERVISI KEPALA SEKOLAH */}
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Catatan & Rekomendasi Supervisi Kepala Sekolah
                                        </h3>
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        Evaluasi strategis berkala untuk Wakil Kepala Sekolah, Wali Kelas, dan Dewan Guru.
                                    </p>
                                </div>
                                <span className="text-[11px] text-slate-400 font-mono">
                                    Dokumen Supervisi Digital
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-1">
                                <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/30">
                                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                                        <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">1</span>
                                        Presensi & Pembinaan Kelas
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                                        Tingkat presensi sekolah mencapai {averageAttendance}%. Wali kelas diharapkan memberikan penghargaan kepada rombel berkehadiran prima dan memprioritaskan komunikasi santun pada siswa yang kerap izin.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/30">
                                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                                        <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">2</span>
                                        Efektivitas Konseling BK
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                                        Kolaborasi antara Wali Kelas dan Guru BK berjalan baik dengan tingkat penanganan {caseResolutionRate}%. Penanganan konseling individual terbukti efektif menekan angka keterlambatan berulang.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-[#0f172a]/30">
                                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                                        <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">3</span>
                                        Kesiapan Tata Kelola
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                                        Verifikasi berkas kurikulum guru mencapai {docComplianceRate}% dan arus kas SPP sekolah berada pada level sehat ({paymentRate}%). Sekolah siap menghadapi asesmen dan evaluasi mutu terpadu.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800/80">
                                <span>Status: Hasil Pemantauan Terverifikasi oleh Sistem Tanggapin</span>
                                <span>Terakhir diperbarui: Hari ini</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
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
                                    . Pusat administrasi sekolah, sinkronisasi Dapodik, verifikasi SPP, dan berkas GTK.
                                </>
                            ) : (
                                <>
                                    . Terdeteksi{' '}
                                    <strong className="font-semibold text-slate-900 dark:text-white">
                                        {safeStats.studentsNeedingAttention} siswa
                                    </strong>{' '}
                                    membutuhkan koordinasi dan tindak lanjut hari ini.
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
                                    Kelola akun GTK dan kuota rombel kelas
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
                                    Validasi NISN, NIK, dan residu rombel
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
                                    Monitoring tunggakan dan verifikasi SPP
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
                                    SK penugasan dan perangkat ajar guru
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
                                    Sinyal presensi, nilai, dan ketertiban
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
                                    {safeStats.overdueCases} kasus butuh evaluasi berkala
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
                                    Penanganan tuntas bulan ini
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
                                    Rata-rata presensi seluruh rombel
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
                                Deteksi risiko siswa yang butuh pendampingan segera.
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
                                                    message: `Yth. Bapak Ibu ${alert.parentName}, menginformasikan perkembangan ananda ${alert.studentName}: ${alert.summary}. Mohon koordinasi dengan sekolah.`,
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
                                        Monitoring tunggakan dan verifikasi bukti bayar SPP.
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
                                        Validasi NISN, NIK, dan residu rombel.
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
                                        Pantauan kelas yang butuh perhatian guru.
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
                                        Koordinasi dispensasi dan konfirmasi SPP.
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
                                        Kelengkapan SK dan perangkat ajar guru.
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
                                        Pantau status tindak lanjut rujukan kendala siswa ke Guru BK.
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
                                        Belum ada rujukan siswa ke Guru BK.
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
                                                            {c.bkHandlingNotes || 'Sesi konseling siswa telah dilaksanakan.'}
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
                                        Kendala siswa dari Wali Kelas untuk penanganan BK.
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
                                        Alur: Masuk → Ditugaskan → Ditangani → Selesai
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
                            Akses langsung ke seluruh modul operasional sekolah.
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
                    </>
                )}
            </div>
        </FlowbiteTanggapinLayout>
    );
}

Dashboard.layout = (page: React.ReactNode) => page;
