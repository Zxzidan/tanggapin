import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    Award,
    Bot,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    FileCheck2,
    FileText,
    GraduationCap,
    HeartPulse,
    Loader2,
    MessageCircle,
    PhoneCall,
    Printer,
    QrCode,
    RefreshCw,
    Search,
    Send,
    Share2,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { StudentForReportItem, StudentReportItem } from '@/types/tanggapin';

interface RaporSiswaProps {
    students: StudentForReportItem[];
    stats: {
        totalStudents: number;
        reportsGenerated: number;
        reportsSent: number;
        confirmedByParents: number;
    };
}

export default function RaporSiswa({ students, stats }: RaporSiswaProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Active report modal state
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [activeStudent, setActiveStudent] = useState<StudentForReportItem | null>(null);
    const [activeReport, setActiveReport] = useState<StudentReportItem | null>(null);

    // Loading states
    const [generatingStudentId, setGeneratingStudentId] = useState<string | null>(null);
    const [sendingReportId, setSendingReportId] = useState<string | null>(null);
    const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

    // Extract unique classes for filter
    const classList = useMemo(() => {
        const classes = new Set<string>();
        students.forEach((s) => {
            if (s.class) classes.add(s.class);
        });
        return Array.from(classes);
    }, [students]);

    // Filtered students
    const filteredStudents = useMemo(() => {
        return students.filter((s) => {
            const matchesSearch =
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.nisn.includes(searchQuery) ||
                s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesClass =
                selectedClass === 'all' || s.class === selectedClass;
            const matchesStatus =
                selectedStatus === 'all' ||
                (selectedStatus === 'none' && !s.hasReport) ||
                (selectedStatus === 'generated' &&
                    s.latestReport?.status === 'generated') ||
                (selectedStatus === 'sent' &&
                    s.latestReport?.status === 'sent');

            return matchesSearch && matchesClass && matchesStatus;
        });
    }, [students, searchQuery, selectedClass, selectedStatus]);

    // Handle AI Generation
    const handleGenerateAiReport = (student: StudentForReportItem) => {
        setGeneratingStudentId(student.id);
        router.post(
            '/student-reports/generate',
            {
                student_id: student.id,
                period: '2025/2026 Ganjil',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setGeneratingStudentId(null);
                    setNotificationMessage(
                        `Rapor perkembangan ananda ${student.name} berhasil di-generate secara cerdas oleh AI!`,
                    );
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
                onError: () => {
                    setGeneratingStudentId(null);
                    alert('Gagal membuat rapor AI. Silakan coba kembali.');
                },
            },
        );
    };

    // Handle Sending Report to Parent WhatsApp
    const handleSendReport = (report: StudentReportItem, student: StudentForReportItem) => {
        setSendingReportId(report.id);
        router.post(
            `/student-reports/${report.id}/send`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSendingReportId(null);
                    setNotificationMessage(
                        `Dokumen Rapor ${report.reportCode} berhasil dikirim ke WhatsApp Orang Tua (${student.parentName})!`,
                    );
                    // Update active report state if open in modal
                    if (activeReport && activeReport.id === report.id) {
                        setActiveReport({
                            ...activeReport,
                            status: 'sent',
                            acknowledgement: 'Sudah Dibaca & Dikonfirmasi Orang Tua',
                            sentAt: 'Baru saja',
                        });
                    }
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
                onError: () => {
                    setSendingReportId(null);
                    alert('Gagal mengirim rapor ke orang tua. Silakan periksa jaringan.');
                },
            },
        );
    };

    // Open Modal
    const handleOpenModal = (student: StudentForReportItem) => {
        setActiveStudent(student);
        setActiveReport(student.latestReport);
        setIsReportModalOpen(true);
    };

    return (
        <FlowbiteTanggapinLayout activeTab="reports">
            <Head title="Rapor Siswa (AI) & Pengiriman Ortu — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Toast Notification Banner */}
                {notificationMessage && (
                    <div className="flex items-center justify-between rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-blue-900 shadow-sm dark:border-blue-800 dark:bg-blue-950/70 dark:text-blue-200">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium">
                                {notificationMessage}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotificationMessage(null)}
                            className="text-blue-700 hover:text-blue-900 dark:text-blue-300"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {/* Hero Header Section */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-blue-100/20 p-6 shadow-xs dark:border-slate-800 dark:from-[#0f172a] dark:via-blue-950/20 dark:to-slate-900">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/80 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                    <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                                    AI Assistive Intelligence Engine
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                    <PhoneCall className="size-3 text-blue-600 dark:text-blue-400" />
                                    WhatsApp Official Dispatch
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                Pembuatan Rapor Siswa Otomatis & Pengiriman Orang Tua
                            </h1>
                            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                Sintesis cerdas data presensi, catatan pembinaan BK, dan keteraturan belajar menjadi lembar evaluasi perkembangan karakter siswa yang objektif. Otomatis terkirim resmi ke WhatsApp orang tua dengan tanda terima digital berkekuatan hukum.
                            </p>
                        </div>

                        {/* Quick AI Info Badge */}
                        <div className="flex shrink-0 flex-col rounded-xl border border-blue-200/80 bg-white/80 p-4 shadow-xs backdrop-blur-xs sm:w-80 dark:border-blue-900/50 dark:bg-slate-800/80">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                                <Bot className="size-4" />
                                <span>Efisiensi Administrasi Guru</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                Menghemat hingga <strong>85% waktu kerja</strong> wali kelas dalam merangkum narasi rapor deskriptif per siswa setiap akhir semester.
                            </p>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
                                <span>Akurasi Data: Presensi & BK</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">100% Real-time</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Siswa Terdata
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <Users className="size-5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.totalStudents} Siswa
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Rombel aktif terintegrasi sistem
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Rapor Digenerate AI
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <Sparkles className="size-5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.reportsGenerated} Rapor
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                            <CheckCircle2 className="size-3.5" />
                            <span>
                                {stats.totalStudents > 0
                                    ? Math.round((stats.reportsGenerated / stats.totalStudents) * 100)
                                    : 0}
                                % dari target semester ini
                            </span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Terkirim ke WhatsApp Ortu
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <Send className="size-5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.reportsSent} Rapor
                        </div>
                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                            Langsung diterima di nomor HP orang tua
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Tanda Terima Terkonfirmasi
                            </span>
                            <div className="rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <FileCheck2 className="size-5" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.confirmedByParents} Dibaca
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Bukti digital acknowledgement sah
                        </p>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama siswa, NISN, atau nama orang tua..."
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="all">Semua Kelas</option>
                            {classList.map((cls) => (
                                <option key={cls} value={cls}>
                                    Kelas {cls}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="all">Semua Status Rapor</option>
                            <option value="none">Belum Ada Rapor</option>
                            <option value="generated">Draf AI Siap Kirim</option>
                            <option value="sent">Sudah Dikirim ke Ortu</option>
                        </select>
                    </div>
                </div>

                {/* Students Report Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-5 py-3.5">Identitas Siswa & Kelas</th>
                                    <th className="px-5 py-3.5">Kehadiran & Risiko</th>
                                    <th className="px-5 py-3.5">Status Rapor AI</th>
                                    <th className="px-5 py-3.5">Ringkasan Narasi AI</th>
                                    <th className="px-5 py-3.5">Wali Murid & Kontak</th>
                                    <th className="px-5 py-3.5 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-10 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            Tidak ada data siswa yang cocok dengan filter pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const report = student.latestReport;
                                        const isGenerating = generatingStudentId === student.id;
                                        const isSending = Boolean(report && sendingReportId === report.id);

                                        return (
                                            <tr
                                                key={student.id}
                                                className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                                            >
                                                {/* Student Identity */}
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {student.name}
                                                    </div>
                                                    <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                        NISN: {student.nisn} • Kelas {student.class}
                                                    </div>
                                                    <div className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                                        Wali: {student.homeroomTeacher}
                                                    </div>
                                                </td>

                                                {/* Attendance & Risk */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-semibold text-slate-900 dark:text-white">
                                                            {student.attendanceRate}%
                                                        </div>
                                                        <span
                                                            className={cn(
                                                                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border',
                                                                student.riskLevel === 'high'
                                                                    ? 'border-blue-300 bg-blue-100 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200'
                                                                    : student.riskLevel === 'medium'
                                                                      ? 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                                                                      : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
                                                            )}
                                                        >
                                                            {student.riskLevel === 'high'
                                                                ? 'Perlu Atensi'
                                                                : student.riskLevel === 'medium'
                                                                  ? 'Waspada'
                                                                  : 'Kondusif'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                                        <div
                                                            className={cn(
                                                                'h-full rounded-full',
                                                                student.attendanceRate < 80
                                                                    ? 'bg-blue-900 dark:bg-blue-400'
                                                                    : student.attendanceRate < 90
                                                                      ? 'bg-blue-500'
                                                                      : 'bg-blue-600',
                                                            )}
                                                            style={{
                                                                width: `${Math.min(100, student.attendanceRate)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </td>

                                                {/* Report Status */}
                                                <td className="px-5 py-4">
                                                    {!report ? (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                            <Clock className="size-3" />
                                                            Belum Dibuat
                                                        </span>
                                                    ) : report.status === 'sent' ? (
                                                        <div className="space-y-1">
                                                            <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                                <CheckCircle2 className="size-3 text-blue-600 dark:text-blue-400" />
                                                                Terkirim ke Ortu
                                                            </span>
                                                            <div className="text-[10px] text-slate-400">
                                                                {report.sentAt ?? 'Terkirim'}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-1 text-[11px] font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                            <Sparkles className="size-3 text-blue-600 dark:text-blue-400" />
                                                            Draf AI Siap Kirim
                                                        </span>
                                                    )}
                                                </td>

                                                {/* AI Narrative Preview */}
                                                <td className="max-w-xs px-5 py-4">
                                                    {report ? (
                                                        <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                                            {report.aiCharacterSummary}
                                                        </p>
                                                    ) : (
                                                        <span className="text-[11px] italic text-slate-400">
                                                            Klik tombol Generate AI untuk membuat narasi otomatis.
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Parent Contact */}
                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-slate-800 dark:text-slate-200">
                                                        {student.parentName}
                                                    </div>
                                                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                                                        <PhoneCall className="size-3 text-blue-600" />
                                                        <span>{student.parentPhone}</span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {!report ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleGenerateAiReport(student)}
                                                                disabled={isGenerating}
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-800 disabled:opacity-50"
                                                            >
                                                                {isGenerating ? (
                                                                  <>
                                                                        <Loader2 className="size-3.5 animate-spin" />
                                                                        <span>Generating...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Sparkles className="size-3.5" />
                                                                        <span>Generate AI</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleOpenModal(student)}
                                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                                                >
                                                                    <FileText className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                                    <span>Buka Rapor</span>
                                                                </button>

                                                                {report.status !== 'sent' ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSendReport(report, student)}
                                                                        disabled={isSending}
                                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-800 disabled:opacity-50"
                                                                    >
                                                                        {isSending ? (
                                                                            <>
                                                                                <Loader2 className="size-3.5 animate-spin" />
                                                                                <span>Mengirim...</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Send className="size-3.5" />
                                                                                <span>Kirim WhatsApp</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSendReport(report, student)}
                                                                        disabled={isSending}
                                                                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-[11px] font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                                                        title="Kirim ulang salinan dokumen ke WhatsApp"
                                                                    >
                                                                        <RefreshCw className="size-3" />
                                                                        <span>Kirim Ulang</span>
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Feature Architecture & Legal Info Card */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <div className="rounded-md bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                <Sparkles className="size-4" />
                            </div>
                            <span>Prinsip AI Rapor Edukasi</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Algoritma AI Tanggapin menganalisis data historis absensi harian, tren penurunan jam pelajaran, poin disiplin, dan catatan wali kelas. Narasi yang dihasilkan berfokus pada pendekatan apresiatif dan solutif, menghindari pelabelan negatif.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <div className="rounded-md bg-slate-100 p-1.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <ShieldCheck className="size-4" />
                            </div>
                            <span>Keabsahan & Tanda Terima Sah</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Setiap pengiriman rapor via WhatsApp menyertakan kode autentikasi unik (SHA hash) dan link konfirmasi digital. Saat orang tua membuka rapor, waktu baca tercatat otomatis sebagai bukti koordinasi resmi sekolah.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <div className="rounded-md bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                <HeartPulse className="size-4" />
                            </div>
                            <span>Pencegahan ATS Dini</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Rapor otomatis ini menjadi jembatan pencegahan putus sekolah. Rekomendasi rumah yang jelas mempermudah orang tua mendampingi ananda sebelum masalah absensi berkembang menjadi risiko putus sekolah.
                        </p>
                    </div>
                </div>
            </div>

            {/* Official Student Report Card Modal (Lembar Rapor Resmi) */}
            {isReportModalOpen && activeStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
                        {/* Modal Action Header (Non-printable) */}
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/80">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                    <FileText className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Pratinjau Lembar Rapor Resmi & Tanda Terima
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Format resmi lembar perkembangan siswa untuk arsip & orang tua
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    <Printer className="size-3.5" />
                                    <span>Cetak / PDF</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Official Report Sheet */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-950">
                                {/* Kop Surat Resmi Sekolah */}
                                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 dark:border-slate-300">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-14 items-center justify-center rounded-xl bg-blue-900 text-white font-black text-xl tracking-wider">
                                            TP
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                PEMERINTAH PROVINSI / YAYASAN PENDIDIKAN
                                            </div>
                                            <div className="text-base font-black uppercase text-slate-900 dark:text-white">
                                                SMK NEGERI TERPADU TANGGAPIN
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                Jl. Edukasi Prestasi No. 46, Jakarta • Terakreditasi A • Sistem Terpadu BOSP
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden text-right text-[11px] text-slate-500 sm:block">
                                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                                            {activeReport?.reportCode ?? 'RPR-2026-DRAFT'}
                                        </div>
                                        <div>Tahun Ajaran 2025/2026</div>
                                    </div>
                                </div>

                                <div className="mt-4 text-center">
                                    <h2 className="text-base font-bold uppercase tracking-wide text-slate-900 underline underline-offset-4 dark:text-white">
                                        LEMBAR EVALUASI & PERKEMBANGAN KARAKTER SISWA
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Semester Ganjil — Tahun Ajaran 2025/2026
                                    </p>
                                </div>

                                {/* Identitas Siswa */}
                                <div className="mt-6 rounded-lg bg-slate-50 p-4 text-xs dark:bg-slate-900/80">
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-28 text-slate-500">Nama Siswa</span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                : {activeStudent.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-28 text-slate-500">Rombel / Kelas</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                : {activeStudent.class}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-28 text-slate-500">NISN</span>
                                            <span className="font-mono text-slate-900 dark:text-white">
                                                : {activeStudent.nisn}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-28 text-slate-500">Wali Kelas</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                : {activeStudent.homeroomTeacher}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-28 text-slate-500">Nama Orang Tua</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                : {activeStudent.parentName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-28 text-slate-500">WhatsApp Ortu</span>
                                            <span className="font-mono text-slate-900 dark:text-white">
                                                : {activeStudent.parentPhone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 1: Presensi & Kedisiplinan */}
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:border-slate-800 dark:text-slate-200">
                                        <Calendar className="size-4 text-blue-600" />
                                        <span>I. Rekapitulasi Presensi & Kedisiplinan</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <div className="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800">
                                            <span className="text-[11px] text-slate-500">Tingkat Kehadiran</span>
                                            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                                {activeReport?.attendanceRate ?? activeStudent.attendanceRate}%
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800">
                                            <span className="text-[11px] text-slate-500">Sakit (S)</span>
                                            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                                {activeReport?.sickCount ?? 0} hari
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800">
                                            <span className="text-[11px] text-slate-500">Izin (I)</span>
                                            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                                {activeReport?.permissionCount ?? 0} hari
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800">
                                            <span className="text-[11px] text-slate-500">Alpha / Tanpa Ket.</span>
                                            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                                {activeReport?.unexcusedCount ?? 0} hari
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-blue-50/60 px-4 py-2.5 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                                        <span>Status Kedisiplinan: <strong>{activeReport?.disciplineStatus ?? 'Dalam Evaluasi'}</strong></span>
                                        <span>Akumulasi Poin: <strong>{activeReport?.disciplinePoints ?? 0} Poin</strong></span>
                                    </div>
                                </div>

                                {/* Section 2: AI Evaluasi Karakter */}
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:border-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="size-4 text-blue-600" />
                                            <span>II. Sintesis Naratif Evaluasi Karakter (Asisten AI)</span>
                                        </div>
                                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                            AI-Generated • Terverifikasi
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 text-xs leading-relaxed text-slate-800 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-slate-200">
                                        {activeReport?.aiCharacterSummary ?? (
                                            <div className="italic text-slate-500">
                                                Narasi AI belum dibuat. Klik tombol &apos;Generate AI&apos; pada baris siswa untuk memicu generator narasi.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section 3: Catatan Akademik & Capaian Belajar */}
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:border-slate-800 dark:text-slate-200">
                                        <GraduationCap className="size-4 text-blue-600" />
                                        <span>III. Catatan Akademik & Capaian Belajar</span>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                                        {activeReport?.aiAcademicNotes ?? (
                                            <div className="italic text-slate-500">
                                                Capaian pembelajaran memenuhi kompetensi standar kurikulum merdeka dengan evaluasi berkala.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section 4: Rekomendasi Kolaboratif untuk Orang Tua */}
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:border-slate-800 dark:text-slate-200">
                                        <HeartPulse className="size-4 text-blue-600" />
                                        <span>IV. Panduan Kolaboratif Pendampingan Orang Tua di Rumah</span>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                                        <div className="whitespace-pre-line">
                                            {activeReport?.parentRecommendations ?? (
                                                <div className="italic text-slate-500">
                                                    1. Dampingi kegiatan belajar mandiri siswa di rumah.\n2. Jaga komunikasi terbuka dengan wali kelas.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pengesahan & Digital Verification */}
                                <div className="mt-8 border-t border-slate-200 pt-6 text-xs dark:border-slate-800">
                                    <div className="grid grid-cols-1 items-center justify-between gap-6 sm:grid-cols-3">
                                        <div className="text-center sm:text-left">
                                            <div className="text-[11px] text-slate-500">Mengetahui,</div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                Kepala Sekolah
                                            </div>
                                            <div className="mt-8 font-bold underline text-slate-900 dark:text-white">
                                                Drs. H. Mulyadi, M.Pd.
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                NIP. 19740512 199802 1 003
                                            </div>
                                        </div>

                                        {/* QR Code Verification Stamp */}
                                        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-900">
                                            <QrCode className="size-10 text-slate-700 dark:text-slate-300" />
                                            <div className="mt-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                                VERIFIKASI DIGITAL SAH
                                            </div>
                                            <div className="text-[9px] text-slate-400">
                                                {activeReport?.reportCode ?? 'TANGGAPIN-VERIFIED'}
                                            </div>
                                        </div>

                                        <div className="text-center sm:text-right">
                                            <div className="text-[11px] text-slate-500">Wali Kelas,</div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                {activeStudent.class}
                                            </div>
                                            <div className="mt-8 font-bold underline text-slate-900 dark:text-white">
                                                {activeStudent.homeroomTeacher}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Pendidik Bersertifikat
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer / Dispatch Actions */}
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row dark:border-slate-800 dark:bg-slate-800/80">
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <PhoneCall className="size-4 text-blue-600" />
                                <span>
                                    Nomor Tujuan:{' '}
                                    <strong className="font-mono text-slate-900 dark:text-white">
                                        {activeStudent.parentPhone}
                                    </strong>{' '}
                                    ({activeStudent.parentName})
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Tutup Pratinjau
                                </button>

                                {activeReport && (
                                    <button
                                        type="button"
                                        onClick={() => handleSendReport(activeReport, activeStudent)}
                                        disabled={sendingReportId === activeReport.id}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-800 disabled:opacity-50"
                                    >
                                        {sendingReportId === activeReport.id ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                <span>Mengirim ke WhatsApp...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="size-4" />
                                                <span>
                                                    {activeReport.status === 'sent'
                                                        ? 'Kirim Ulang ke WhatsApp'
                                                        : 'Kirim Resmi ke WhatsApp Ortu'}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FlowbiteTanggapinLayout>
    );
}
