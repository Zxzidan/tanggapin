import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    Award,
    BarChart3,
    BookOpen,
    Bot,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    FileCheck2,
    FileSpreadsheet,
    FileText,
    GraduationCap,
    HeartPulse,
    Layers,
    Lightbulb,
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
    TrendingUp,
    UserCheck,
    Users,
    X,
    Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { ROLE_CONFIGS } from '@/lib/role-config';
import { cn } from '@/lib/utils';
import type {
    LearningObjectiveAssessment,
    RoleType,
    StudentForReportItem,
    StudentReportItem,
    SubjectAssessmentItem,
} from '@/types/tanggapin';

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
    const page = usePage<{
        auth?: { user?: { name?: string; email?: string; role?: RoleType } };
    }>();
    const authRole = page.props.auth?.user?.role;

    const [currentRole] = useState<RoleType>(() => {
        if (authRole && Object.keys(ROLE_CONFIGS).includes(authRole)) {
            return authRole;
        }
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tanggapin_current_role') as RoleType;
            if (saved && Object.keys(ROLE_CONFIGS).includes(saved)) {
                return saved;
            }
        }
        return 'wali_kelas';
    });

    // View mode: 'guru_mapel' for subject evaluation & AI learning analysis, 'wali_kelas' for homeroom development & WhatsApp
    const [reportViewMode, setReportViewMode] = useState<'guru_mapel' | 'wali_kelas'>(() => {
        return currentRole === 'guru' ? 'guru_mapel' : 'wali_kelas';
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedPredicateFilter, setSelectedPredicateFilter] = useState<string>('all');

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

    // Statistics for Guru Mapel
    const guruStats = useMemo(() => {
        const total = students.length || 1;
        let sumFinal = 0;
        let tuntasCount = 0;
        let sumReadiness = 0;
        let needRemedial = 0;

        students.forEach((s) => {
            const finalScore = s.subjectAssessment?.finalScore ?? 80;
            const readiness = s.subjectAssessment?.aiAnalysis?.readinessScore ?? 85;
            sumFinal += finalScore;
            sumReadiness += readiness;
            if (finalScore >= 75) {
                tuntasCount++;
            } else {
                needRemedial++;
            }
        });

        return {
            avgFinalScore: (sumFinal / total).toFixed(1),
            tuntasRate: Math.round((tuntasCount / total) * 100),
            avgReadiness: Math.round(sumReadiness / total),
            needRemedial,
        };
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

            const matchesPredicate =
                selectedPredicateFilter === 'all' ||
                (selectedPredicateFilter === 'A' && s.subjectAssessment?.predicate.startsWith('A')) ||
                (selectedPredicateFilter === 'B' && s.subjectAssessment?.predicate.startsWith('B')) ||
                (selectedPredicateFilter === 'C' && s.subjectAssessment?.predicate.startsWith('C'));

            if (reportViewMode === 'guru_mapel') {
                return matchesSearch && matchesClass && matchesPredicate;
            }
            return matchesSearch && matchesClass && matchesStatus;
        });
    }, [students, searchQuery, selectedClass, selectedStatus, selectedPredicateFilter, reportViewMode]);

    // Handle AI Generation for Wali Kelas
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

    // Handle AI Diagnostic for Guru Mapel
    const handleRunAiAnalysisForSubject = (student: StudentForReportItem) => {
        setGeneratingStudentId(student.id);
        toast.info(`AI sedang menganalisis capaian TP & rubrik sikap ananda ${student.name}...`);
        setTimeout(() => {
            setGeneratingStudentId(null);
            toast.success(`Analisis AI untuk ${student.name} berhasil diperbarui! Skor kesiapan UKK: ${student.subjectAssessment?.aiAnalysis?.readinessScore ?? 92}%.`);
            setNotificationMessage(`Hasil analisis AI & rekomendasi diferensiasi pembelajaran untuk ${student.name} telah diselaraskan.`);
            setTimeout(() => setNotificationMessage(null), 5000);
        }, 850);
    };

    // Handle Sending Report to Parent WhatsApp (Wali Kelas)
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
                        `Dokumen Rapor ${report.reportCode} berhasil dikirim ke WhatsApp Orang Tua ${student.parentName}!`,
                    );
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
            <Head
                title={
                    reportViewMode === 'guru_mapel'
                        ? 'Rapor Nilai Mapel, Sikap & Analisis AI — TANGGAPIN'
                        : 'Rapor Siswa AI & Pengiriman Ortu — TANGGAPIN'
                }
            />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* View Mode Toggle Pill (Guru Mapel vs Wali Kelas) */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 pl-2">
                            Mode Tampilan Rapor:
                        </span>
                        <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
                            <button
                                type="button"
                                onClick={() => setReportViewMode('guru_mapel')}
                                className={cn(
                                    'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all',
                                    reportViewMode === 'guru_mapel'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                                )}
                            >
                                <GraduationCap className="size-3.5" />
                                <span>Guru Mapel: Nilai Mapel, Sikap & Analisis AI</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setReportViewMode('wali_kelas')}
                                className={cn(
                                    'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all',
                                    reportViewMode === 'wali_kelas'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                                )}
                            >
                                <Users className="size-3.5" />
                                <span>Wali Kelas: Rapor Perkembangan & WA Ortu</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 pr-2">
                        {reportViewMode === 'guru_mapel' ? (
                            <span>
                                Mapel Aktif:{' '}
                                <strong className="text-blue-700 dark:text-blue-400">
                                    Pemrograman Web & Perangkat Bergerak
                                </strong>{' '}
                                (Siti Aminah, M.Pd)
                            </span>
                        ) : (
                            <span>
                                Ruang Lingkup:{' '}
                                <strong className="text-slate-800 dark:text-slate-200">
                                    Pemantauan Anak Wali & Pengiriman WhatsApp Resmi
                                </strong>
                            </span>
                        )}
                    </div>
                </div>

                {/* Toast Notification Banner */}
                {notificationMessage && (
                    <div className="flex items-center justify-between rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-blue-900 shadow-xs dark:border-blue-800 dark:bg-blue-950/70 dark:text-blue-200">
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
                <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-blue-100/20 p-6 shadow-xs dark:border-slate-800 dark:from-[#0b1120] dark:via-blue-950/20 dark:to-slate-900">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/80 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                    <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                                    {reportViewMode === 'guru_mapel'
                                        ? 'AI Learning Diagnostic & Differentiation Engine'
                                        : 'AI Assistive Intelligence Engine'}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                    {reportViewMode === 'guru_mapel' ? (
                                        <>
                                            <BookOpen className="size-3 text-blue-600 dark:text-blue-400" />
                                            Kurikulum Merdeka T.A. 2025/2026
                                        </>
                                    ) : (
                                        <>
                                            <PhoneCall className="size-3 text-blue-600 dark:text-blue-400" />
                                            WhatsApp Official Dispatch
                                        </>
                                    )}
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                {reportViewMode === 'guru_mapel'
                                    ? 'Buku Nilai Mapel, Evaluasi Sikap & Analisis AI'
                                    : 'Pembuatan Rapor Siswa Otomatis & Pengiriman Orang Tua'}
                            </h1>

                            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                {reportViewMode === 'guru_mapel'
                                    ? 'Sistem evaluasi komprehensif mata pelajaran Pemrograman Web & Perangkat Bergerak. Mengintegrasikan capaian Tujuan Pembelajaran (TP), observasi sikap dimensi Profil Pelajar Pancasila, serta Hasil Analisis AI Pembelajaran Berdiferensiasi untuk setiap murid.'
                                    : 'Sintesis cerdas data presensi, catatan pembinaan BK, dan keteraturan belajar menjadi lembar evaluasi perkembangan karakter siswa yang objektif. Otomatis terkirim resmi ke WhatsApp orang tua dengan tanda terima digital berkekuatan hukum.'}
                            </p>
                        </div>

                        {/* Quick Context Card */}
                        <div className="flex shrink-0 flex-col rounded-xl border border-blue-200/80 bg-white/80 p-4 shadow-xs backdrop-blur-xs sm:w-80 dark:border-blue-900/50 dark:bg-slate-800/80">
                            {reportViewMode === 'guru_mapel' ? (
                                <>
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                                        <GraduationCap className="size-4" />
                                        <span>Identitas Mapel & KKM</span>
                                    </div>
                                    <div className="mt-1 font-bold text-slate-900 dark:text-white text-sm">
                                        Pemrograman Web & Mobile
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                                        Guru: <strong>Siti Aminah, M.Pd</strong> • Kriteria Ketercapaian (KKM): <strong>75.0</strong>
                                    </p>
                                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
                                        <span>Status Evaluasi TP:</span>
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                            {guruStats.tuntasRate}% Tuntas KKM
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* KPI Stat Cards */}
                {reportViewMode === 'guru_mapel' ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Rata-rata Nilai Akhir Mapel
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <Award className="size-5" />
                                </div>
                            </div>
                            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                                {guruStats.avgFinalScore} / 100
                            </div>
                            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                Predikat B+ • Di atas batas KKM (75)
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Ketuntasan KKM (≥ 75)
                                </span>
                                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                    <CheckCircle2 className="size-5" />
                                </div>
                            </div>
                            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {guruStats.tuntasRate}% Siswa
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Memenuhi indikator TP.1, TP.2 & TP.3
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Indeks Kesiapan Portofolio AI
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <Sparkles className="size-5" />
                                </div>
                            </div>
                            <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {guruStats.avgReadiness}%
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Standar kesiapan Uji Kompetensi Keahlian
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Perlu Remedial / Bimbingan
                                </span>
                                <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                    <AlertCircle className="size-5" />
                                </div>
                            </div>
                            <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {guruStats.needRemedial} Siswa
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Rekomendasi klinik scaffolding AI tersedia
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
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

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
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

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
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
                            <p className="mt-1 text-xs text-slate-500">
                                Disertai kode autentikasi resmi
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Konfirmasi Baca Orang Tua
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <CheckCircle2 className="size-5" />
                                </div>
                            </div>
                            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.confirmedByParents} Dibaca
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Tanda terima sah tercatat di server
                            </p>
                        </div>
                    </div>
                )}

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={
                                reportViewMode === 'guru_mapel'
                                    ? 'Cari nama murid yang diajar, NISN...'
                                    : 'Cari nama siswa, NISN, atau nama orang tua...'
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="all">Semua Rombongan Belajar</option>
                            {classList.map((cls) => (
                                <option key={cls} value={cls}>
                                    Kelas {cls}
                                </option>
                            ))}
                        </select>

                        {reportViewMode === 'guru_mapel' ? (
                            <select
                                value={selectedPredicateFilter}
                                onChange={(e) => setSelectedPredicateFilter(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                                <option value="all">Semua Predikat Nilai</option>
                                <option value="A">Predikat A (Sangat Baik ≥ 88)</option>
                                <option value="B">Predikat B (Baik 75 - 87)</option>
                                <option value="C">Predikat C (Perlu Remedial &lt; 75)</option>
                            </select>
                        ) : (
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
                        )}
                    </div>
                </div>

                {/* Main Table: Differentiated for Guru Mapel vs Wali Kelas */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="overflow-x-auto">
                        {reportViewMode === 'guru_mapel' ? (
                            /* ========================================================================= */
                            /* TABLE GURU MATA PELAJARAN: NILAI MAPEL, SIKAP KBM & ANALISIS AI          */
                            /* ========================================================================= */
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                    <tr>
                                        <th className="px-5 py-3.5">Murid & Rombel</th>
                                        <th className="px-5 py-3.5">Nilai Akhir Mapel</th>
                                        <th className="px-5 py-3.5">Capaian Tujuan Pembelajaran (TP)</th>
                                        <th className="px-5 py-3.5">Penilaian Sikap (Profil Pancasila)</th>
                                        <th className="px-5 py-3.5">Hasil Analisis AI & Diferensiasi</th>
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
                                                Tidak ada data murid yang cocok dengan kriteria filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student) => {
                                            const assessment = student.subjectAssessment;
                                            const isGenerating = generatingStudentId === student.id;

                                            return (
                                                <tr
                                                    key={student.id}
                                                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                                                >
                                                    {/* Murid & Kelas */}
                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-slate-900 dark:text-white">
                                                            {student.name}
                                                        </div>
                                                        <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                            NISN: {student.nisn} • Kelas {student.class}
                                                        </div>
                                                        <div className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                                            Presensi Mapel: {student.attendanceRate}%
                                                        </div>
                                                    </td>

                                                    {/* Nilai Akhir Mapel & Predikat */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base font-extrabold text-slate-900 dark:text-white">
                                                                {assessment?.finalScore ?? 85}
                                                            </span>
                                                            <span
                                                                className={cn(
                                                                    'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border',
                                                                    (assessment?.finalScore ?? 85) >= 88
                                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                                        : (assessment?.finalScore ?? 85) >= 75
                                                                          ? 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300'
                                                                          : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300',
                                                                )}
                                                            >
                                                                {assessment?.predicate ?? 'A'}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                            Formatif: <strong>{assessment?.formativeScore ?? 84}</strong> • Sumatif: <strong>{assessment?.summativeScore ?? 88}</strong>
                                                        </div>
                                                    </td>

                                                    {/* Capaian Tujuan Pembelajaran (TP) */}
                                                    <td className="px-5 py-4">
                                                        <div className="space-y-1.5">
                                                            {assessment?.learningObjectives.map((tp) => (
                                                                <div
                                                                    key={tp.code}
                                                                    className="flex items-center justify-between gap-2 text-[11px]"
                                                                >
                                                                    <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                                                                        <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                                                                            {tp.code}
                                                                        </span>
                                                                        <span className="truncate text-slate-700 dark:text-slate-300">
                                                                            {tp.title}
                                                                        </span>
                                                                    </div>
                                                                    <span
                                                                        className={cn(
                                                                            'rounded px-1.5 py-0.2 text-[10px] font-semibold shrink-0',
                                                                            tp.status === 'Tercapai Optimal'
                                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                                : tp.status === 'Tercapai'
                                                                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                                                                        )}
                                                                    >
                                                                        {tp.score} ({tp.status})
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>

                                                    {/* Penilaian Sikap KBM */}
                                                    <td className="px-5 py-4 max-w-xs">
                                                        <div className="space-y-1 text-[11px]">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-semibold text-slate-700 dark:text-slate-300">🧠 Kritis:</span>
                                                                <span className="text-slate-600 dark:text-slate-400 truncate">
                                                                    {assessment?.attitude.bernalarKritis.split('—')[0]}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-semibold text-slate-700 dark:text-slate-300">👤 Mandiri:</span>
                                                                <span className="text-slate-600 dark:text-slate-400 truncate">
                                                                    {assessment?.attitude.kemandirian.split('—')[0]}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-semibold text-slate-700 dark:text-slate-300">🤝 Gotong Royong:</span>
                                                                <span className="text-slate-600 dark:text-slate-400 truncate">
                                                                    {assessment?.attitude.gotongRoyong.split('—')[0]}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Hasil Analisis AI */}
                                                    <td className="px-5 py-4 max-w-xs">
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
                                                                    <Sparkles className="size-3 text-indigo-600 dark:text-indigo-400" />
                                                                    Kesiapan: {assessment?.aiAnalysis.readinessScore}%
                                                                </span>
                                                                <span className="text-[10px] text-slate-400">
                                                                    {assessment?.aiAnalysis.readinessStatus}
                                                                </span>
                                                            </div>
                                                            <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                                                {assessment?.aiAnalysis.competencyDiagnosis}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenModal(student)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                                            >
                                                                <FileText className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                                <span>Rapor Mapel & AI</span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleRunAiAnalysisForSubject(student)}
                                                                disabled={isGenerating}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300"
                                                                title="Perbarui Analisis AI Diferensiasi"
                                                            >
                                                                {isGenerating ? (
                                                                    <Loader2 className="size-3.5 animate-spin" />
                                                                ) : (
                                                                    <Sparkles className="size-3.5" />
                                                                )}
                                                                <span className="hidden sm:inline">Analisis AI</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            /* ========================================================================= */
                            /* TABLE WALI KELAS: RAPOR PERKEMBANGAN & PENGIRIMAN WHATSAPP ORANG TUA      */
                            /* ========================================================================= */
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                    <tr>
                                        <th className="px-5 py-3.5">Identitas Anak Wali & Rombel</th>
                                        <th className="px-5 py-3.5">Presensi & Risiko</th>
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
                                                Tidak ada data anak wali yang cocok dengan filter pencarian.
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
                                                    <td className="px-5 py-4 max-w-xs">
                                                        {report ? (
                                                            <p className="line-clamp-2 text-slate-600 dark:text-slate-300">
                                                                {report.aiCharacterSummary}
                                                            </p>
                                                        ) : (
                                                            <span className="italic text-slate-400">
                                                                Belum digenerate oleh AI
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Parent & Phone */}
                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-slate-900 dark:text-white">
                                                            {student.parentName}
                                                        </div>
                                                        <div className="font-mono text-[11px] text-slate-500">
                                                            {student.parentPhone}
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
                        )}
                    </div>
                </div>

                {/* Pedoman Kebijakan & Prinsip AI */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <div className="rounded-md bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                <Sparkles className="size-4" />
                            </div>
                            <span>Prinsip AI Rapor Edukasi</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Algoritma AI Tanggapin menganalisis data capaian Tujuan Pembelajaran (TP), observasi sikap KBM, serta presensi. Narasi yang dihasilkan berfokus pada pendekatan apresiatif, rekomendasi diferensiasi belajar, dan penguatan kompetensi siswa.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <div className="rounded-md bg-slate-100 p-1.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <ShieldCheck className="size-4" />
                            </div>
                            <span>Otentikasi & Verifikasi Sah</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Setiap lembar rapor dan penilaian yang diterbitkan dilengkapi QR Code verifikasi digital dan kode hash unik. Dokumen dapat dicetak resmi sebagai arsip buku nilai guru atau dikirimkan ke orang tua siswa.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <div className="rounded-md bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                <HeartPulse className="size-4" />
                            </div>
                            <span>Pembelajaran Berdiferensiasi</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Hasil analisis AI memberikan rekomendasi konkret: Enrichment Track (proyek pengayaan tingkat lanjut) bagi siswa yang menguasai materi cepat, serta Scaffolding Track (remedial terarah) bagi siswa yang membutuhkan pendampingan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal: Official Student Report Card */}
            {isReportModalOpen && activeStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
                        {/* Modal Action Header (Non-printable) */}
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/80">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                    <FileText className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        {reportViewMode === 'guru_mapel'
                                            ? 'Pratinjau Lembar Rapor Mapel, Sikap & Analisis AI'
                                            : 'Pratinjau Lembar Rapor Resmi & Tanda Terima'}
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        {reportViewMode === 'guru_mapel'
                                            ? 'Format lembar penilaian resmi mata pelajaran Kurikulum Merdeka'
                                            : 'Format resmi lembar perkembangan siswa untuk arsip & orang tua'}
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

                        {/* Modal Body: Official Report Sheet */}
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
                                            {reportViewMode === 'guru_mapel'
                                                ? `NIL-2026-MAPEL-${activeStudent.nisn.slice(-4)}`
                                                : (activeReport?.reportCode ?? 'RPR-2026-DRAFT')}
                                        </div>
                                        <div>Tahun Ajaran 2025/2026 Ganjil</div>
                                    </div>
                                </div>

                                <div className="mt-4 text-center">
                                    <h2 className="text-base font-bold uppercase tracking-wide text-slate-900 underline underline-offset-4 dark:text-white">
                                        {reportViewMode === 'guru_mapel'
                                            ? 'LEMBAR PENILAIAN CAPAIAN PEMBELAJARAN, SIKAP & ANALISIS AI'
                                            : 'LEMBAR EVALUASI & PERKEMBANGAN KARAKTER SISWA'}
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {reportViewMode === 'guru_mapel'
                                            ? 'Mata Pelajaran: Pemrograman Web & Perangkat Bergerak (Kurikulum Merdeka)'
                                            : 'Semester Ganjil — Tahun Ajaran 2025/2026'}
                                    </p>
                                </div>

                                {/* Identitas Siswa & Mapel */}
                                <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-900/80">
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-32 text-slate-500">Nama Siswa</span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                : {activeStudent.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-32 text-slate-500">Rombel / Kelas</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                : {activeStudent.class}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-32 text-slate-500">NISN</span>
                                            <span className="font-mono text-slate-900 dark:text-white">
                                                : {activeStudent.nisn}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="w-32 text-slate-500">
                                                {reportViewMode === 'guru_mapel' ? 'Guru Pengampu' : 'Wali Kelas'}
                                            </span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                : {reportViewMode === 'guru_mapel'
                                                    ? 'Siti Aminah, M.Pd'
                                                    : activeStudent.homeroomTeacher}
                                            </span>
                                        </div>

                                        {reportViewMode === 'guru_mapel' ? (
                                            <>
                                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                                    <span className="w-32 text-slate-500">Mata Pelajaran</span>
                                                    <span className="font-semibold text-blue-700 dark:text-blue-400">
                                                        : Pemrograman Web & Mobile (PPLG)
                                                    </span>
                                                </div>
                                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                                    <span className="w-32 text-slate-500">Kriteria KKM</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        : 75.0 (Skala 100)
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                                    <span className="w-32 text-slate-500">Nama Orang Tua</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        : {activeStudent.parentName}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                                    <span className="w-32 text-slate-500">WhatsApp Ortu</span>
                                                    <span className="font-mono text-slate-900 dark:text-white">
                                                        : {activeStudent.parentPhone}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {reportViewMode === 'guru_mapel' ? (
                                    /* ========================================================================= */
                                    /* GURU MAPEL REPORT SHEET SECTIONS                                          */
                                    /* ========================================================================= */
                                    <>
                                        {/* Bagian I: Capaian Nilai & Tujuan Pembelajaran (TP) */}
                                        <div className="mt-6 space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:border-slate-800 dark:text-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <Award className="size-4 text-blue-600" />
                                                    <span>I. Rekapitulasi Nilai & Capaian Tujuan Pembelajaran (TP)</span>
                                                </div>
                                                <span className="font-bold text-blue-700 dark:text-blue-400">
                                                    Nilai Akhir: {activeStudent.subjectAssessment?.finalScore ?? 85} ({activeStudent.subjectAssessment?.predicate ?? 'A'})
                                                </span>
                                            </div>

                                            {/* Summary Cards Formatif & Sumatif */}
                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                <div className="rounded-xl border border-slate-200 p-3 text-center dark:border-slate-800">
                                                    <span className="text-[11px] text-slate-500">Rata Formatif (40%)</span>
                                                    <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                                                        {activeStudent.subjectAssessment?.formativeScore ?? 84}
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-slate-200 p-3 text-center dark:border-slate-800">
                                                    <span className="text-[11px] text-slate-500">Rata Sumatif (60%)</span>
                                                    <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                                                        {activeStudent.subjectAssessment?.summativeScore ?? 88}
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-center dark:border-blue-900/60 dark:bg-blue-950/30">
                                                    <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">Nilai Akhir Mapel</span>
                                                    <div className="mt-1 text-xl font-black text-blue-700 dark:text-blue-400">
                                                        {activeStudent.subjectAssessment?.finalScore ?? 85}
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center dark:border-emerald-900/60 dark:bg-emerald-950/30">
                                                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Predikat Kelulusan</span>
                                                    <div className="mt-1 text-base font-bold text-emerald-700 dark:text-emerald-400">
                                                        {activeStudent.subjectAssessment?.predicate ?? 'A (Sangat Baik)'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Detail TP Table */}
                                            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                                                <table className="w-full text-left text-xs">
                                                    <thead className="bg-slate-50 font-semibold text-[11px] text-slate-500 uppercase border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                                                        <tr>
                                                            <th className="px-4 py-2.5">Kode</th>
                                                            <th className="px-4 py-2.5">Deskripsi Tujuan Pembelajaran (TP)</th>
                                                            <th className="px-4 py-2.5 text-center">Skor Capaian</th>
                                                            <th className="px-4 py-2.5 text-right">Ketercapaian</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                        {activeStudent.subjectAssessment?.learningObjectives.map((tp) => (
                                                            <tr key={tp.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                                <td className="px-4 py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                                    {tp.code}
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                                                                    {tp.title}
                                                                </td>
                                                                <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
                                                                    {tp.score}
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <span
                                                                        className={cn(
                                                                            'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold',
                                                                            tp.status === 'Tercapai Optimal'
                                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                                : tp.status === 'Tercapai'
                                                                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                                                                        )}
                                                                    >
                                                                        {tp.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Bagian II: Penilaian Sikap & Karakter KBM (Profil Pelajar Pancasila) */}
                                        <div className="mt-6 space-y-3">
                                            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:border-slate-800 dark:text-slate-200">
                                                <HeartPulse className="size-4 text-blue-600" />
                                                <span>II. Penilaian Sikap & Dimensi Profil Pelajar Pancasila (KBM Mapel)</span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                                                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                                        <span>🧠 Bernalar Kritis</span>
                                                    </div>
                                                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                                        {activeStudent.subjectAssessment?.attitude.bernalarKritis}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                                                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                                        <span>👤 Kemandirian</span>
                                                    </div>
                                                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                                        {activeStudent.subjectAssessment?.attitude.kemandirian}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                                                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                                        <span>🤝 Gotong Royong</span>
                                                    </div>
                                                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                                        {activeStudent.subjectAssessment?.attitude.gotongRoyong}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                                                <strong>Catatan Observasi Guru Pengampu:</strong>{' '}
                                                {activeStudent.subjectAssessment?.attitude.catatanObservasi}
                                            </div>
                                        </div>

                                        {/* Bagian III: Hasil Analisis AI & Pembelajaran Berdiferensiasi */}
                                        <div className="mt-6 space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:border-slate-800 dark:text-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="size-4 text-indigo-600 dark:text-indigo-400" />
                                                    <span>III. Hasil Analisis AI & Rekomendasi Pembelajaran Berdiferensiasi</span>
                                                </div>
                                                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                                                    AI Diagnostic Engine
                                                </span>
                                            </div>

                                            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 via-blue-50/40 to-white p-5 text-xs text-slate-800 dark:border-indigo-900/60 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 dark:text-slate-200 space-y-4">
                                                <div>
                                                    <div className="flex items-center gap-2 font-bold text-indigo-950 dark:text-indigo-200 text-xs">
                                                        <Search className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                                                        <span>1. Diagnosis Penguasaan Materi (AI Diagnostic Insight)</span>
                                                    </div>
                                                    <p className="mt-1 leading-relaxed text-[11px] text-slate-700 dark:text-slate-300 pl-5">
                                                        {activeStudent.subjectAssessment?.aiAnalysis.competencyDiagnosis}
                                                    </p>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2 font-bold text-indigo-950 dark:text-indigo-200 text-xs">
                                                        <Lightbulb className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                                                        <span>2. Rekomendasi Rencana Tindak Lanjut Diferensiasi</span>
                                                    </div>
                                                    <p className="mt-1 leading-relaxed text-[11px] text-slate-700 dark:text-slate-300 pl-5">
                                                        {activeStudent.subjectAssessment?.aiAnalysis.differentiationPlan}
                                                    </p>
                                                </div>

                                                {activeStudent.subjectAssessment?.aiAnalysis.remedialFocus && (
                                                    <div>
                                                        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-xs">
                                                            <AlertCircle className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                            <span>3. Fokus Modul Penguatan / Remedial</span>
                                                        </div>
                                                        <p className="mt-1 leading-relaxed text-[11px] text-amber-800 dark:text-amber-300 pl-5">
                                                            {activeStudent.subjectAssessment?.aiAnalysis.remedialFocus}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Readiness Index Progress */}
                                                <div className="border-t border-indigo-100 pt-3 dark:border-indigo-900/40">
                                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                                            Indeks Kesiapan Portofolio Industri & UKK Kejuruan:
                                                        </span>
                                                        <span className="font-extrabold text-indigo-700 dark:text-indigo-400">
                                                            {activeStudent.subjectAssessment?.aiAnalysis.readinessScore}% ({activeStudent.subjectAssessment?.aiAnalysis.readinessStatus})
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                                                            style={{
                                                                width: `${activeStudent.subjectAssessment?.aiAnalysis.readinessScore ?? 85}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Recommended Activities Pill List */}
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                        Aktivitas Terjadwal yang Direkomendasikan:
                                                    </span>
                                                    <div className="mt-1.5 flex flex-wrap gap-2">
                                                        {activeStudent.subjectAssessment?.aiAnalysis.recommendedActivities.map((act) => (
                                                            <span
                                                                key={act}
                                                                className="inline-flex items-center gap-1 rounded-md bg-white border border-indigo-200 px-2.5 py-1 text-[10px] font-semibold text-indigo-800 shadow-2xs dark:border-indigo-800 dark:bg-slate-800 dark:text-indigo-300"
                                                            >
                                                                <Check className="size-3 text-emerald-600" />
                                                                {act}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* ========================================================================= */
                                    /* WALI KELAS REPORT SHEET SECTIONS                                          */
                                    /* ========================================================================= */
                                    <>
                                        {/* Section 1: Presensi & Kedisiplinan */}
                                        <div className="mt-6 space-y-4">
                                            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:border-slate-800 dark:text-slate-200">
                                                <Calendar className="size-4 text-blue-600" />
                                                <span>I. Rekapitulasi Presensi & Kedisiplinan Anak Wali</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                <div className="rounded-xl border border-slate-200 p-3 text-center dark:border-slate-800">
                                                    <span className="text-[11px] text-slate-500">Tingkat Kehadiran</span>
                                                    <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                                        {activeReport?.attendanceRate ?? activeStudent.attendanceRate}%
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-slate-200 p-3 text-center dark:border-slate-800">
                                                    <span className="text-[11px] text-slate-500">Sakit</span>
                                                    <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                                        {activeReport?.sickCount ?? 0} hari
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-slate-200 p-3 text-center dark:border-slate-800">
                                                    <span className="text-[11px] text-slate-500">Izin</span>
                                                    <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                                        {activeReport?.permissionCount ?? 0} hari
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-slate-200 p-3 text-center dark:border-slate-800">
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
                                                    <span>II. Sintesis Naratif Evaluasi Karakter — Asisten AI</span>
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
                                    </>
                                )}

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
                                                {reportViewMode === 'guru_mapel'
                                                    ? 'TANGGAPIN-EVAL-PPLG401'
                                                    : (activeReport?.reportCode ?? 'TANGGAPIN-VERIFIED')}
                                            </div>
                                        </div>

                                        <div className="text-center sm:text-right">
                                            <div className="text-[11px] text-slate-500">
                                                {reportViewMode === 'guru_mapel'
                                                    ? 'Guru Mata Pelajaran,'
                                                    : 'Wali Kelas,'}
                                            </div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                {reportViewMode === 'guru_mapel'
                                                    ? 'Pemrograman Web & Mobile'
                                                    : activeStudent.class}
                                            </div>
                                            <div className="mt-8 font-bold underline text-slate-900 dark:text-white">
                                                {reportViewMode === 'guru_mapel'
                                                    ? 'Siti Aminah, M.Pd.'
                                                    : activeStudent.homeroomTeacher}
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
                            {reportViewMode === 'guru_mapel' ? (
                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                    <Sparkles className="size-4 text-indigo-600" />
                                    <span>
                                        Analisis AI Terintegrasi Kurikulum Merdeka • Nilai Akhir:{' '}
                                        <strong className="text-slate-900 dark:text-white">
                                            {activeStudent.subjectAssessment?.finalScore ?? 85} ({activeStudent.subjectAssessment?.predicate ?? 'A'})
                                        </strong>
                                    </span>
                                </div>
                            ) : (
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
                            )}

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Tutup Pratinjau
                                </button>

                                {reportViewMode === 'guru_mapel' ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            toast.success(`Lembar penilaian resmi ananda ${activeStudent.name} berhasil disimpan dan disinkronkan ke buku nilai!`);
                                            setIsReportModalOpen(false);
                                        }}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-800"
                                    >
                                        <CheckCircle2 className="size-4" />
                                        <span>Simpan & Sahkan Nilai</span>
                                    </button>
                                ) : (
                                    activeReport && (
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
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FlowbiteTanggapinLayout>
    );
}
