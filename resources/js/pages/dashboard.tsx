import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    Eye,
    FileText,
    GraduationCap,
    Layers,
    MapPin,
    MessageSquare,
    PhoneCall,
    Plus,
    Scale,
    Shield,
    ShieldAlert,
    Siren,
    Sparkles,
    UserCheck,
    Users,
    WalletCards,
} from 'lucide-react';
import React, { useState } from 'react';
import { useActionModals } from '@/components/action-modals';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type {
    CaseItem,
    ClassMonitoringItem,
    DashboardPageProps,
    PriorityAlert,
    RoleType,
} from '@/types/tanggapin';

export default function Dashboard({
    stats = {
        studentsNeedingAttention: 12,
        activeCases: 4,
        overdueCases: 2,
        dataCheckIssues: 7,
        duePayments: 18,
        activeIncidents: 1,
        resolvedThisMonth: 24,
    },
    priorityFeed = [],
    classes = [],
    cases = [],
}: DashboardPageProps) {
    const {
        openFollowupModal,
        openParentContactModal,
        openNewCaseModal,
        openStudent360Modal,
    } = useActionModals();

    const [currentRole, setCurrentRole] = useState<RoleType>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tanggapin_current_role') as RoleType;
            if (saved && ['kepala_sekolah', 'wali_kelas', 'guru_bk', 'bendahara', 'operator'].includes(saved)) {
                return saved;
            }
        }
        return 'kepala_sekolah';
    });

    const [feedRiskFilter, setFeedRiskFilter] = useState<'all' | 'high' | 'medium'>('all');

    const handleRoleChange = (role: RoleType) => {
        setCurrentRole(role);
        if (typeof window !== 'undefined') {
            localStorage.setItem('tanggapin_current_role', role);
        }
    };

    const roleContexts: Record<RoleType, { name: string; position: string }> = {
        kepala_sekolah: { name: 'Bpk. Neil Sims', position: 'Kepala Sekolah' },
        wali_kelas: { name: 'Bpk. Hendra Setiawan, S.Pd', position: 'Wali Kelas XI RPL 2' },
        guru_bk: { name: 'Ibu Rahmawati, S.Pd', position: 'Koordinator BK & Konseling' },
        bendahara: { name: 'Bpk. Joko Purwanto', position: 'Bendahara Sekolah' },
        operator: { name: 'Ibu Dian Pratiwi', position: 'Operator Dapodik' },
    };

    const filteredPriorityFeed = priorityFeed.filter((item) => {
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

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* 1. CONTEXTUAL OPERATIONAL HEADER */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-700 text-white shadow-2xs">
                                <Sparkles className="size-3" />
                                TANGGAPIN
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                SMK Negeri 1 Harapan • T.A. 2025/2026 Ganjil
                            </span>
                            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                                Dashboard Operasional Sekolah Terintegrasi
                            </span>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight pt-1">
                            Selamat bertugas, {roleContexts[currentRole]?.name}
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Masuk sebagai <strong className="font-semibold text-blue-700 dark:text-blue-400">{roleContexts[currentRole]?.position}</strong>.
                            Sistem mendeteksi <strong className="text-red-600 dark:text-red-400">{stats.studentsNeedingAttention} siswa</strong> yang memerlukan perhatian dan tindak lanjut terarah hari ini.
                        </p>
                    </div>

                    {/* Role Simulator Switcher Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100/80 dark:bg-[#162238] border border-slate-200 dark:border-slate-700 self-start lg:self-center shrink-0">
                        <span className="text-[11px] font-semibold text-slate-500 px-2">Peran:</span>
                        {(['kepala_sekolah', 'wali_kelas', 'guru_bk', 'bendahara', 'operator'] as RoleType[]).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => handleRoleChange(r)}
                                className={cn(
                                    'px-2.5 py-1 text-xs rounded-lg font-medium transition-all',
                                    currentRole === r
                                        ? 'bg-blue-700 text-white font-semibold shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700'
                                )}
                            >
                                {r === 'kepala_sekolah' ? 'Kepsek' : r === 'wali_kelas' ? 'Wali Kelas' : r === 'guru_bk' ? 'Guru BK' : r === 'bendahara' ? 'Bendahara' : 'Operator'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. RINGKASAN KONDISI SISWA (4 Kartu Metrik Utama) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                    {/* Primary Highlight Metric: Siswa Perlu Perhatian */}
                    <Link
                        href="/early-warning"
                        className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 hover:border-red-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                                Butuh Perhatian
                            </span>
                            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 group-hover:scale-105 transition-transform">
                                <AlertTriangle className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-red-700 dark:text-red-400 tracking-tight">
                            {stats.studentsNeedingAttention}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                            Siswa terdeteksi sinyal risiko (absensi, nilai, kedisiplinan)
                        </p>
                        <div className="mt-3 pt-2 border-t border-red-200/60 dark:border-red-900/60 flex items-center justify-between text-[11px] text-red-700 dark:text-red-400 font-semibold">
                            <span>Tinjau Sinyal Early Warning</span>
                            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>

                    {/* Secondary Metric: Kasus Aktif BK */}
                    <Link
                        href="/manajemen-kasus"
                        className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Kasus Aktif BK
                            </span>
                            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 group-hover:scale-105 transition-transform">
                                <ShieldAlert className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 tracking-tight">
                            {stats.activeCases}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                            {stats.overdueCases} kasus butuh evaluasi &gt;48 jam
                        </p>
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                            <span>Alur Kasus BK</span>
                            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>

                    {/* Secondary Metric: Tindak Lanjut Selesai */}
                    <Link
                        href="/manajemen-kasus"
                        className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Terdokumentasi
                            </span>
                            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 group-hover:scale-105 transition-transform">
                                <CheckCircle2 className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
                            {stats.resolvedThisMonth}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                            Tindakan & pendampingan selesai bulan ini
                        </p>
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                            <span>Arsip Dokumen</span>
                            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>

                    {/* Secondary Metric: Tingkat Kehadiran Sekolah */}
                    <Link
                        href="/kondisi-kelas"
                        className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Rata-rata Hadir
                            </span>
                            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 group-hover:scale-105 transition-transform">
                                <GraduationCap className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">
                            92.4%
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                            Akumulasi 4 rombel kejuruan terdaftar
                        </p>
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                            <span>Lihat Rombel & Presensi</span>
                            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>
                </div>

                {/* 3. PRIORITAS: PERLU PERHATIAN (Tindak Lanjut Mendesak) */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="size-2.5 rounded-full bg-red-600 animate-pulse" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Perlu Perhatian — Tindak Lanjut Mendesak
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Sinyal kondisi siswa yang membutuhkan keputusan dan respons hari ini.
                            </p>
                        </div>

                        {/* Filter Severity Pills */}
                        <div className="flex items-center gap-1.5 self-start sm:self-center">
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('all')}
                                className={cn(
                                    'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors',
                                    feedRiskFilter === 'all'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                )}
                            >
                                Semua ({priorityFeed.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('high')}
                                className={cn(
                                    'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors',
                                    feedRiskFilter === 'high'
                                        ? 'bg-red-600 text-white font-semibold'
                                        : 'text-slate-500 hover:bg-red-50 hover:text-red-700'
                                )}
                            >
                                Kritis (3)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('medium')}
                                className={cn(
                                    'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors',
                                    feedRiskFilter === 'medium'
                                        ? 'bg-amber-600 text-white font-semibold'
                                        : 'text-slate-500 hover:bg-amber-50 hover:text-amber-700'
                                )}
                            >
                                Perlu Diperhatikan (1)
                            </button>
                        </div>
                    </div>

                    {/* Alerts Card List */}
                    <div className="space-y-3">
                        {filteredPriorityFeed.map((alert) => {
                            const isHigh = alert.riskLevel === 'high';
                            return (
                                <div
                                    key={alert.id}
                                    className={cn(
                                        'p-4 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4',
                                        alert.actionTaken
                                            ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                                            : isHigh
                                            ? 'bg-white dark:bg-[#111c30] border-red-200/90 dark:border-red-900/60 shadow-xs'
                                            : 'bg-white dark:bg-[#111c30] border-amber-200/90 dark:border-amber-900/60 shadow-xs'
                                    )}
                                >
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                {alert.studentName}
                                            </span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                {alert.class}
                                            </span>
                                            <span
                                                className={cn(
                                                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                                    isHigh
                                                        ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                )}
                                            >
                                                {alert.triggerType}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                • Terdeteksi {alert.timestamp}
                                            </span>
                                            {alert.actionTaken && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                    ✓ Sudah Ditindaklanjuti
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                            {alert.summary}
                                        </p>

                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-4 pt-0.5">
                                            <span>Wali Kelas: <strong className="font-medium text-slate-700 dark:text-slate-300">{alert.homeroomTeacher}</strong></span>
                                            <span>Orang Tua: <strong className="font-medium text-slate-700 dark:text-slate-300">{alert.parentName} ({alert.parentPhone})</strong></span>
                                        </div>
                                    </div>

                                    {/* Action-Oriented Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                                        <button
                                            type="button"
                                            onClick={() => openStudent360Modal(alert)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                            title="Buka Profil Siswa 360°"
                                        >
                                            <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                            <span>Profil 360°</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={alert.actionTaken}
                                            onClick={() => {
                                                openFollowupModal({
                                                    studentId: alert.studentId || alert.id,
                                                    studentName: `${alert.studentName} (${alert.class})`,
                                                    studentPhone: alert.parentPhone,
                                                    note: `Tindak lanjut pemicu risiko: ${alert.summary}`,
                                                });
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors active:scale-95"
                                        >
                                            <Plus className="size-3.5" />
                                            <span>Buat Tindak Lanjut</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                openParentContactModal({
                                                    studentId: alert.studentId || alert.id,
                                                    studentName: `${alert.studentName} (${alert.class})`,
                                                    studentPhone: alert.parentPhone,
                                                    message: `Yth. Bapak/Ibu ${alert.parentName}, kami dari sekolah menginformasikan perkembangan ananda ${alert.studentName}. ${alert.summary}. Mohon berkenan berkoordinasi dengan sekolah demi kelancaran proses belajar.`,
                                                });
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                            title="Kirim pesan terstruktur resmi ke orang tua"
                                        >
                                            <PhoneCall className="size-3.5 text-emerald-600" />
                                            <span className="hidden sm:inline">Hubungi Ortu</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                openNewCaseModal({
                                                    studentId: alert.studentId || alert.id,
                                                    studentName: `${alert.studentName} (${alert.class})`,
                                                    desc: `Eskalasi dari Early Warning: ${alert.summary}`,
                                                });
                                            }}
                                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded-lg border border-transparent hover:border-amber-200 transition-colors"
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

                {/* 4. RINGKASAN OPERASIONAL MULTI-ASPEK (Preview Widget Terpadu) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Class Health Monitoring Preview */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    Indikator Kondisi Kelas (Class Health)
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Mendeteksi kelas yang memerlukan dukungan intervensi guru.
                                </p>
                            </div>
                            <Link
                                href="/kondisi-kelas"
                                className="text-xs text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                            >
                                Semua Rombel <ChevronRight className="size-3.5" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {classes.slice(0, 3).map((cls) => {
                                const isCritical = cls.healthStatus === 'critical';
                                const isWarning = cls.healthStatus === 'warning';

                                return (
                                    <div
                                        key={cls.id}
                                        className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-colors space-y-2.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white text-sm me-2">
                                                    {cls.name}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {cls.major} • {cls.totalStudents} siswa
                                                </span>
                                            </div>
                                            <span
                                                className={cn(
                                                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                                    isCritical
                                                        ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
                                                        : isWarning
                                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
                                                )}
                                            >
                                                {isCritical ? 'Perlu Intervensi' : isWarning ? 'Perlu Perhatian' : 'Kondisi Baik'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-xs py-1">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block font-medium">Kehadiran</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{cls.attendanceRate}%</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block font-medium">Perlu Perhatian</span>
                                                <span className="font-bold text-red-600">{cls.studentsAtRisk} siswa</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block font-medium">Follow-up Pending</span>
                                                <span className="font-bold text-amber-600">{cls.pendingFollowups} pending</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60 dark:border-slate-800 text-slate-500">
                                            <span>Wali: {cls.homeroomTeacher}</span>
                                            <Link
                                                href="/kondisi-kelas"
                                                className="text-blue-700 dark:text-blue-400 font-semibold hover:underline"
                                            >
                                                Detail Rombel →
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Case Workflow Summary Preview */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    Progres Penanganan Kasus (Alur Terstruktur)
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Alur: Baru → Ditugaskan → Ditangani → Selesai
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => openNewCaseModal()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95"
                            >
                                <Plus className="size-3.5" />
                                Buka Kasus
                            </button>
                        </div>

                        <div className="space-y-3">
                            {cases.slice(0, 3).map((c) => (
                                <div
                                    key={c.id}
                                    className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                                                {c.code}
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {c.studentName}
                                            </span>
                                            <span className="text-[11px] text-slate-400">({c.class})</span>
                                        </div>
                                        <span
                                            className={cn(
                                                'text-[10px] font-bold px-2 py-0.5 rounded',
                                                c.priority === 'Tinggi'
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                            )}
                                        >
                                            Prioritas: {c.priority}
                                        </span>
                                    </div>

                                    <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070b14] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed font-normal">
                                        {c.lastActivity}
                                    </p>

                                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                        <span>PIC: <strong className="text-slate-700 dark:text-slate-300 font-medium">{c.assignee}</strong></span>
                                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                                            Tahap: {c.stageLabel}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <Link
                                href="/manajemen-kasus"
                                className="w-full text-center py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors border border-dashed border-blue-200 dark:border-blue-900 block"
                            >
                                Buka Papan Kanban Kasus Lengkap ({cases.length} Kasus) →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 5. AKSES CEPAT MODUL LAINNYA */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                    <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            Pintasan Modul & Tanggap Cepat
                        </h3>
                        <p className="text-[11px] text-slate-500">
                            Pilih modul spesifik untuk melihat data detail dan melakukan tindakan operasional.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
                        <Link
                            href="/early-warning"
                            className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-red-400 transition-all text-center group"
                        >
                            <AlertTriangle className="size-5 mx-auto mb-1.5 text-red-600 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Early Warning</div>
                            <div className="text-[10px] text-slate-500">12 Berisiko</div>
                        </Link>

                        <Link
                            href="/kondisi-kelas"
                            className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all text-center group"
                        >
                            <GraduationCap className="size-5 mx-auto mb-1.5 text-blue-600 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Kondisi Kelas</div>
                            <div className="text-[10px] text-slate-500">4 Rombel</div>
                        </Link>

                        <Link
                            href="/manajemen-kasus"
                            className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all text-center group"
                        >
                            <ShieldAlert className="size-5 mx-auto mb-1.5 text-amber-600 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Kasus BK</div>
                            <div className="text-[10px] text-slate-500">4 Kasus</div>
                        </Link>

                        <Link
                            href="/komunikasi-ortu"
                            className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-all text-center group"
                        >
                            <PhoneCall className="size-5 mx-auto mb-1.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Kontak Ortu</div>
                            <div className="text-[10px] text-slate-500">Pesan Resmi</div>
                        </Link>

                        <Link
                            href="/dapodik"
                            className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-orange-400 transition-all text-center group"
                        >
                            <CheckCircle2 className="size-5 mx-auto mb-1.5 text-orange-600 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Cek Dapodik</div>
                            <div className="text-[10px] text-slate-500">7 Anomali</div>
                        </Link>

                        <Link
                            href="/respons-insiden"
                            className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-red-500 transition-all text-center group"
                        >
                            <Siren className="size-5 mx-auto mb-1.5 text-red-600 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Tanggap Darurat</div>
                            <div className="text-[10px] text-slate-500">Status Siaga</div>
                        </Link>
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

Dashboard.layout = (page: React.ReactNode) => page;
