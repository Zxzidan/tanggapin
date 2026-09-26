import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    Award,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    ExternalLink,
    Eye,
    FileSpreadsheet,
    FileText,
    Flame,
    GraduationCap,
    HelpCircle,
    Info,
    Layers,
    MapPin,
    MessageSquare,
    Phone,
    PhoneCall,
    Plus,
    RefreshCw,
    Scale,
    Search,
    Send,
    Shield,
    ShieldAlert,
    Siren,
    Sparkles,
    TrendingDown,
    TrendingUp,
    UploadCloud,
    UserCheck,
    UserX,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import Student360Modal from '@/components/student-360-modal';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type {
    AtsItem,
    CaseItem,
    ClassMonitoringItem,
    DapodikIssue,
    DashboardPageProps,
    DisciplineRecordItem,
    IncidentItem,
    ParentUpdate,
    PaymentItem,
    PriorityAlert,
    RoleType,
    TeacherDocument,
} from '@/types/tanggapin';

export default function Dashboard({
    stats: initialStats,
    priorityFeed: initialPriorityFeed,
    classes: initialClasses,
    cases: initialCases,
    atsList: initialAtsList,
    paymentList: initialPaymentList,
    dapodikIssues: initialDapodikIssues,
    documents: initialDocuments,
    incidents: initialIncidents,
    parentUpdates: initialParentUpdates,
    disciplineList: initialDisciplineList,
}: DashboardPageProps) {
    const [currentRole, setCurrentRole] = useState<RoleType>('kepala_sekolah');
    const [activeTab, setActiveTab] = useState<string>('overview');

    // Local reactive state
    const [stats, setStats] = useState(
        initialStats || {
            studentsNeedingAttention: 12,
            activeCases: 4,
            overdueCases: 2,
            dataCheckIssues: 7,
            duePayments: 18,
            activeIncidents: 1,
            resolvedThisMonth: 24,
        }
    );
    const [priorityFeed, setPriorityFeed] = useState<PriorityAlert[]>(initialPriorityFeed || []);
    const [cases, setCases] = useState<CaseItem[]>(initialCases || []);
    const [incidents, setIncidents] = useState<IncidentItem[]>(initialIncidents || []);
    const [parentUpdates, setParentUpdates] = useState<ParentUpdate[]>(initialParentUpdates || []);
    const [classes, setClasses] = useState<ClassMonitoringItem[]>(initialClasses || []);
    const [atsList, setAtsList] = useState<AtsItem[]>(initialAtsList || []);
    const [paymentList, setPaymentList] = useState<PaymentItem[]>(initialPaymentList || []);
    const [dapodikIssues, setDapodikIssues] = useState<DapodikIssue[]>(initialDapodikIssues || []);
    const [documents] = useState<TeacherDocument[]>(initialDocuments || []);
    const [disciplineList, setDisciplineList] = useState<DisciplineRecordItem[]>(initialDisciplineList || []);

    // Filter states
    const [feedRiskFilter, setFeedRiskFilter] = useState<'all' | 'high' | 'medium'>('all');

    // Modals state
    const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
    const [isParentContactModalOpen, setIsParentContactModalOpen] = useState(false);
    const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
    const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
    const [isStudent360Open, setIsStudent360Open] = useState(false);

    // Selected items for modal
    const [selectedStudentId, setSelectedStudentId] = useState<string>('1');
    const [selectedStudentName, setSelectedStudentName] = useState('Brian Aditya (XI RPL 2)');
    const [selectedStudentPhone, setSelectedStudentPhone] = useState('+62 812-3456-7890');
    const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
    const [selectedStudent360, setSelectedStudent360] = useState<PriorityAlert | null>(null);

    // Follow-up form
    const [followupType, setFollowupType] = useState('Panggilan Orang Tua');
    const [followupAssignee, setFollowupAssignee] = useState('Wali Kelas (Hendra Setiawan, S.Pd)');
    const [followupNote, setFollowupNote] = useState('');

    // Parent contact form
    const [parentCategory, setParentCategory] = useState('Kehadiran');
    const [parentCustomMessage, setParentCustomMessage] = useState(
        'Yth. Bapak/Ibu Wali Murid, kami menginformasikan catatan kehadiran ananda yang memerlukan koordinasi bersama sekolah demi kelancaran proses belajar.'
    );

    // New case form
    const [newCaseCategory, setNewCaseCategory] = useState('Kedisiplinan');
    const [newCasePriority, setNewCasePriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Tinggi');
    const [newCaseDesc, setNewCaseDesc] = useState('');

    // New discipline form
    const [newInfraction, setNewInfraction] = useState('Terlambat Masuk Sekolah');
    const [newPoints, setNewPoints] = useState(10);
    const [newDisciplineNotes, setNewDisciplineNotes] = useState('');

    // Contextual greetings per role (Section 9 Header)
    const roleContexts: Record<RoleType, { name: string; position: string }> = {
        kepala_sekolah: { name: 'Bpk. Neil Sims', position: 'Kepala Sekolah' },
        wali_kelas: { name: 'Bpk. Hendra Setiawan, S.Pd', position: 'Wali Kelas XI RPL 2' },
        guru_bk: { name: 'Ibu Rahmawati, S.Pd', position: 'Koordinator BK & Konseling' },
        bendahara: { name: 'Bpk. Joko Purwanto', position: 'Bendahara Sekolah' },
        operator: { name: 'Ibu Dian Pratiwi', position: 'Operator Dapodik' },
    };

    // Open Student 360 Modal
    const handleOpenStudent360 = (alert: PriorityAlert) => {
        setSelectedStudent360(alert);
        setIsStudent360Open(true);
    };

    // Trigger action from topbar or buttons
    const handleTriggerActionModal = (actionType: string, studentName?: string, studentId?: string) => {
        if (studentName) {
            setSelectedStudentName(studentName);
        }
        if (studentId) {
            setSelectedStudentId(studentId);
        }
        if (actionType === 'followup') {
            setIsFollowupModalOpen(true);
        } else if (actionType === 'parent_contact') {
            setIsParentContactModalOpen(true);
        } else if (actionType === 'new_case') {
            setIsNewCaseModalOpen(true);
        } else if (actionType === 'discipline') {
            setIsDisciplineModalOpen(true);
        }
    };

    // Submit Follow-up to database
    const handleSaveFollowup = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/followups',
            {
                student_id: selectedStudentId || '1',
                type: followupType,
                assignee_name: followupAssignee,
                note: followupNote || 'Follow-up tindakan operasional sekolah',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Follow-up untuk ${selectedStudentName} berhasil disimpan di database!`, {
                        description: `Tindakan: ${followupType} | PIC: ${followupAssignee}`,
                    });
                    if (selectedAlertId) {
                        setPriorityFeed((prev) =>
                            prev.map((item) => (item.id === selectedAlertId ? { ...item, actionTaken: true } : item))
                        );
                    }
                    setStats((prev) => ({
                        ...prev,
                        studentsNeedingAttention: Math.max(0, prev.studentsNeedingAttention - 1),
                        resolvedThisMonth: prev.resolvedThisMonth + 1,
                    }));
                    setIsFollowupModalOpen(false);
                    setFollowupNote('');
                },
                onError: () => {
                    toast.error('Gagal menyimpan follow-up ke database.');
                },
            }
        );
    };

    // Submit Parent Contact to database
    const handleSendParentMessage = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/parent-communications',
            {
                student_id: selectedStudentId || '1',
                category: parentCategory,
                message: parentCustomMessage,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Pesan resmi berhasil dikirim dan tersimpan di database!`);
                    setIsParentContactModalOpen(false);
                    setParentUpdates((prev) => [
                        {
                            id: String(Date.now()),
                            studentName: selectedStudentName,
                            parentName: 'Wali Murid',
                            category: parentCategory,
                            message: parentCustomMessage,
                            date: 'Baru saja',
                            status: 'Terkirim via WhatsApp & Tanggapin App',
                            acknowledgement: 'Perlu ditindaklanjuti',
                        },
                        ...prev,
                    ]);
                },
                onError: () => {
                    toast.error('Gagal mengirim pesan ke orang tua.');
                },
            }
        );
    };

    // Submit New Case to database
    const handleCreateCase = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/cases',
            {
                student_id: selectedStudentId || '1',
                category: newCaseCategory,
                priority: newCasePriority,
                last_activity: newCaseDesc || 'Kasus baru didaftarkan dan menunggu verifikasi BK.',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Kasus baru untuk ${selectedStudentName} berhasil didaftarkan di database!`);
                    setIsNewCaseModalOpen(false);
                    setNewCaseDesc('');
                    setStats((prev) => ({ ...prev, activeCases: prev.activeCases + 1 }));
                },
                onError: () => {
                    toast.error('Gagal mendaftarkan kasus ke database.');
                },
            }
        );
    };

    // Submit Discipline Record to database
    const handleCreateDiscipline = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/discipline-records',
            {
                student_id: selectedStudentId || '1',
                infraction: newInfraction,
                points: newPoints,
                pattern_notes: newDisciplineNotes || 'Pencatatan pembinaan kedisiplinan',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Catatan kedisiplinan untuk ${selectedStudentName} berhasil disimpan!`);
                    setIsDisciplineModalOpen(false);
                    setNewDisciplineNotes('');
                    setDisciplineList((prev) => [
                        {
                            id: String(Date.now()),
                            studentId: selectedStudentId || '1',
                            studentName: selectedStudentName,
                            class: 'Kelas Terdaftar',
                            infraction: newInfraction,
                            points: newPoints,
                            actionStatus: 'Menunggu Pembinaan',
                            patternNotes: newDisciplineNotes || 'Dicatat dari modul kedisiplinan',
                            recordedAt: 'Hari ini',
                        },
                        ...prev,
                    ]);
                },
                onError: () => {
                    toast.error('Gagal menyimpan catatan kedisiplinan.');
                },
            }
        );
    };

    // Toggle Incident Checklist item
    const handleToggleChecklist = (incidentId: string, checklistId: string) => {
        setIncidents((prev) =>
            prev.map((inc) => {
                if (inc.id === incidentId) {
                    return {
                        ...inc,
                        checklist: inc.checklist.map((chk) =>
                            chk.id === checklistId ? { ...chk, done: !chk.done } : chk
                        ),
                    };
                }
                return inc;
            })
        );
        toast.info('Status checklist kesiapsiagaan darurat diperbarui.');
    };

    // Filtered priority alerts
    const filteredPriorityFeed = priorityFeed.filter((item) => {
        if (feedRiskFilter === 'all') return true;
        return item.riskLevel === feedRiskFilter;
    });

    return (
        <FlowbiteTanggapinLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            onTriggerActionModal={handleTriggerActionModal}
        >
            <Head title="Dashboard Operasional — TANGGAPIN" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* 1. CONTEXTUAL OPERATIONAL HEADER (Section 9: Konteks Pengguna) */}
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
                                Kamis, 24 September 2025
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
                                onClick={() => setCurrentRole(r)}
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

                {/* 2. RINGKASAN KONDISI SISWA (Section 9: Metrik Berhierarki dengan Konteks) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                    {/* Primary Highlight Metric: Siswa Perlu Perhatian */}
                    <div
                        onClick={() => setActiveTab('early-warning')}
                        className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 hover:border-red-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
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
                            <span>Tinjau Sinyal</span>
                            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Secondary Metric: Kasus Aktif BK */}
                    <div
                        onClick={() => setActiveTab('cases')}
                        className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
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
                            <span>Alur Kasus</span>
                            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Secondary Metric: Tindak Lanjut Selesai (North Star Metric) */}
                    <div
                        onClick={() => setActiveTab('cases')}
                        className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
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
                    </div>

                    {/* Secondary Metric: Tingkat Kehadiran Sekolah */}
                    <div
                        onClick={() => setActiveTab('class-monitoring')}
                        className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
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
                            <span>Lihat Rombel</span>
                            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* 3. PRIORITAS: PERLU PERHATIAN (Section 9: Bagian Paling Penting Dashboard) */}
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

                                    {/* Action-Oriented Buttons (Section 10: Action Connection) */}
                                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                                        {/* Student 360 Degree View Action */}
                                        <button
                                            type="button"
                                            onClick={() => handleOpenStudent360(alert)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                            title="Buka Profil Siswa 360°"
                                        >
                                            <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                            <span>Profil 360°</span>
                                        </button>

                                        {/* Follow-up Action */}
                                        <button
                                            type="button"
                                            disabled={alert.actionTaken}
                                            onClick={() => {
                                                setSelectedAlertId(alert.id);
                                                setSelectedStudentId(alert.studentId || alert.id);
                                                setSelectedStudentName(`${alert.studentName} (${alert.class})`);
                                                setSelectedStudentPhone(alert.parentPhone);
                                                setFollowupNote(`Tindak lanjut pemicu risiko: ${alert.summary}`);
                                                setIsFollowupModalOpen(true);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors active:scale-95"
                                        >
                                            <Plus className="size-3.5" />
                                            <span>Buat Tindak Lanjut</span>
                                        </button>

                                        {/* Contact Parent Action */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedAlertId(alert.id);
                                                setSelectedStudentId(alert.studentId || alert.id);
                                                setSelectedStudentName(`${alert.studentName} (${alert.class})`);
                                                setSelectedStudentPhone(alert.parentPhone);
                                                setParentCustomMessage(
                                                    `Yth. Bapak/Ibu ${alert.parentName}, kami dari sekolah menginformasikan perkembangan ananda ${alert.studentName}. ${alert.summary}. Mohon berkenan berkoordinasi dengan sekolah demi kelancaran proses belajar.`
                                                );
                                                setIsParentContactModalOpen(true);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                            title="Kirim pesan terstruktur resmi ke orang tua"
                                        >
                                            <PhoneCall className="size-3.5 text-emerald-600" />
                                            <span className="hidden sm:inline">Hubungi Ortu</span>
                                        </button>

                                        {/* Escalate to Case Management */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedAlertId(alert.id);
                                                setSelectedStudentId(alert.studentId || alert.id);
                                                setSelectedStudentName(`${alert.studentName} (${alert.class})`);
                                                setNewCaseDesc(`Eskalasi dari Early Warning: ${alert.summary}`);
                                                setIsNewCaseModalOpen(true);
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

                {/* 4. MODULAR OPERATIONAL TABS NAVIGATION */}
                <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <ul className="flex flex-nowrap sm:flex-wrap -mb-px text-xs font-semibold text-center text-slate-500 dark:text-slate-400 gap-1">
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('overview')}
                                className={cn(
                                    'inline-flex items-center px-3.5 py-3 border-b-2 rounded-t-lg transition-colors gap-2 whitespace-nowrap',
                                    activeTab === 'overview'
                                        ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold'
                                        : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                )}
                            >
                                <Layers className="size-4" />
                                Ikhtisar Operasional
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('early-warning')}
                                className={cn(
                                    'inline-flex items-center px-3.5 py-3 border-b-2 rounded-t-lg transition-colors gap-2 whitespace-nowrap',
                                    activeTab === 'early-warning'
                                        ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold'
                                        : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                )}
                            >
                                <AlertTriangle className="size-4 text-red-500" />
                                Early Warning ({stats.studentsNeedingAttention})
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('class-monitoring')}
                                className={cn(
                                    'inline-flex items-center px-3.5 py-3 border-b-2 rounded-t-lg transition-colors gap-2 whitespace-nowrap',
                                    activeTab === 'class-monitoring'
                                        ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold'
                                        : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                )}
                            >
                                <GraduationCap className="size-4 text-blue-600" />
                                Kondisi Kelas
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('cases')}
                                className={cn(
                                    'inline-flex items-center px-3.5 py-3 border-b-2 rounded-t-lg transition-colors gap-2 whitespace-nowrap',
                                    activeTab === 'cases'
                                        ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold'
                                        : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                )}
                            >
                                <ShieldAlert className="size-4 text-amber-500" />
                                Alur Kasus BK ({cases.length})
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('communication')}
                                className={cn(
                                    'inline-flex items-center px-3.5 py-3 border-b-2 rounded-t-lg transition-colors gap-2 whitespace-nowrap',
                                    activeTab === 'communication'
                                        ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold'
                                        : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                )}
                            >
                                <PhoneCall className="size-4 text-emerald-500" />
                                Komunikasi Ortu ({parentUpdates.length})
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('ats')}
                                className={cn(
                                    'inline-flex items-center px-3.5 py-3 border-b-2 rounded-t-lg transition-colors gap-2 whitespace-nowrap',
                                    activeTab === 'ats'
                                        ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold'
                                        : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                )}
                            >
                                <UserCheck className="size-4 text-emerald-600" />
                                Lapangan ATS ({atsList.length})
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('data-check')}
                                className={cn(
                                    'inline-flex items-center px-3.5 py-3 border-b-2 rounded-t-lg transition-colors gap-2 whitespace-nowrap',
                                    activeTab === 'data-check'
                                        ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold'
                                        : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                )}
                            >
                                <CheckCircle2 className="size-4 text-orange-500" />
                                Cek Data Dapodik ({dapodikIssues.length})
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('payments')}
                                className={cn(
                                    'inline-flex items-center px-3.5 py-3 border-b-2 rounded-t-lg transition-colors gap-2 whitespace-nowrap',
                                    activeTab === 'payments'
                                        ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold'
                                        : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                )}
                            >
                                <CreditCard className="size-4 text-purple-500" />
                                SPP & Tagihan ({paymentList.length})
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('incidents')}
                                className={cn(
                                    'inline-flex items-center px-3.5 py-3 border-b-2 rounded-t-lg transition-colors gap-2 whitespace-nowrap',
                                    activeTab === 'incidents'
                                        ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold'
                                        : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                )}
                            >
                                <Siren className="size-4 text-red-600" />
                                Tanggap Darurat
                            </button>
                        </li>
                    </ul>
                </div>

                {/* 5. TAB DETAILS & CONTENT WORKFLOWS */}

                {/* TAB 1: OVERVIEW (Kondisi Kelas + Follow-up Pipeline) */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Class Health Monitoring (Section 9: Student Signal & Condition) */}
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
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('class-monitoring')}
                                    className="text-xs text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                >
                                    Semua Rombel <ChevronRight className="size-3.5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {classes.map((cls) => {
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
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStudentName(`Siswa ${cls.name}`);
                                                        setIsFollowupModalOpen(true);
                                                    }}
                                                    className="text-blue-700 dark:text-blue-400 font-semibold hover:underline"
                                                >
                                                    + Tangani Kelas
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Case Workflow Summary (Section 13: Case Management) */}
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
                                    onClick={() => handleTriggerActionModal('new_case')}
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

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('cases')}
                                    className="w-full text-center py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors border border-dashed border-blue-200 dark:border-blue-900"
                                >
                                    Buka Papan Kanban Kasus Lengkap ({cases.length} Kasus) →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: EARLY WARNING MONITORING TABLE (Section 12 & 16: Table) */}
                {activeTab === 'early-warning' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Modul 01: Early Warning System (Deteksi Sinyal Risiko Siswa)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Mengenali sinyal penurunan kondisi siswa sebelum menjadi masalah besar. Menampilkan indikator obyektif, bukan vonis.
                                </p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 self-start sm:self-center">
                                12 Siswa Dalam Pantauan
                            </span>
                        </div>

                        {/* Clean Table Layout (Section 16: Table for scanning and comparison) */}
                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                                <thead className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase bg-slate-50 dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-4 py-3">Siswa & Kelas</th>
                                        <th className="px-4 py-3">Pemicu Sinyal</th>
                                        <th className="px-4 py-3">Konteks & Ringkasan</th>
                                        <th className="px-4 py-3">Wali Kelas</th>
                                        <th className="px-4 py-3">Orang Tua</th>
                                        <th className="px-4 py-3 text-center">Tindakan Cepat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {priorityFeed.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162238]/60 transition-colors">
                                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                <div>{item.studentName}</div>
                                                <div className="text-[11px] font-normal text-slate-500">{item.class}</div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span
                                                    className={cn(
                                                        'px-2 py-0.5 rounded text-[10px] font-bold border',
                                                        item.riskLevel === 'high'
                                                            ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                    )}
                                                >
                                                    {item.triggerType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 max-w-xs text-[11px] leading-relaxed">
                                                {item.summary}
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] whitespace-nowrap text-slate-600 dark:text-slate-300">
                                                {item.homeroomTeacher}
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] whitespace-nowrap">
                                                <div className="font-medium text-slate-900 dark:text-white">{item.parentName}</div>
                                                <div className="text-slate-400">{item.parentPhone}</div>
                                            </td>
                                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenStudent360(item)}
                                                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg border border-blue-200 dark:border-blue-900 transition-colors"
                                                    >
                                                        Profil 360°
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedStudentName(`${item.studentName} (${item.class})`);
                                                            setSelectedStudentPhone(item.parentPhone);
                                                            setIsFollowupModalOpen(true);
                                                        }}
                                                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-2xs"
                                                    >
                                                        Follow-up
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedStudentName(`${item.studentName} (${item.class})`);
                                                            setSelectedStudentPhone(item.parentPhone);
                                                            setIsParentContactModalOpen(true);
                                                        }}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
                                                        title="Kirim pesan resmi ke orang tua"
                                                    >
                                                        <PhoneCall className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: CLASS MONITORING (Section 16: Cards for Grouping) */}
                {activeTab === 'class-monitoring' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Modul 02: Kondisi Kelas (Halaman Wali Kelas)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Satu layar terpadu melihat tren kehadiran, peserta didik berisiko, dan status tindak lanjut per rombel.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    toast.success('Pencatatan absensi harian kelas XI RPL 2 siap ditindaklanjuti.');
                                    setSelectedStudentName('Kelas XI RPL 2');
                                    setIsFollowupModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95"
                            >
                                <Plus className="size-3.5" />
                                Catat Absensi Hari Ini
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {classes.map((cls) => {
                                const isGood = cls.attendanceRate >= 95;
                                const isWarning = cls.attendanceRate >= 90 && cls.attendanceRate < 95;

                                return (
                                    <div
                                        key={cls.id}
                                        className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{cls.name}</h4>
                                            <span className="text-[11px] font-semibold text-slate-500">
                                                {cls.totalStudents} Siswa
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-[11px] leading-snug">{cls.major}</p>

                                        <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-slate-500">Tingkat Hadir:</span>
                                                <span className="font-bold text-slate-900 dark:text-white">{cls.attendanceRate}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        'h-full rounded-full transition-all',
                                                        isGood ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'
                                                    )}
                                                    style={{ width: `${cls.attendanceRate}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 block font-medium">Perlu Perhatian</span>
                                                <span className="font-bold text-red-600 text-sm">{cls.studentsAtRisk} siswa</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 block font-medium">Follow-up Pending</span>
                                                <span className="font-bold text-amber-600 text-sm">{cls.pendingFollowups} kasus</span>
                                            </div>
                                        </div>

                                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                                            Wali: <strong className="font-medium text-slate-800 dark:text-slate-200">{cls.homeroomTeacher}</strong>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 4: CASE MANAGEMENT (Section 13: Alur Terstruktur Kanban & Timeline) */}
                {activeTab === 'cases' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Modul 03: Case Management (Papan Alur Penanganan Kasus)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Mengubah koordinasi kasus dari percakapan informal menjadi workflow terstruktur: Baru → Ditugaskan → Konseling → Tuntas.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleTriggerActionModal('new_case')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95"
                            >
                                <Plus className="size-3.5" />
                                Daftarkan Kasus Baru
                            </button>
                        </div>

                        {/* Kanban Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 text-xs">
                            {/* Column 1: Baru Masuk */}
                            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-3">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pb-1.5 border-b border-slate-200 dark:border-slate-800">
                                    <span>1. Baru Masuk</span>
                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                                        {cases.filter((c) => c.stage === 'new').length}
                                    </span>
                                </div>
                                {cases
                                    .filter((c) => c.stage === 'new')
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="p-3 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-900 dark:text-white">{c.studentName}</span>
                                                <span className="text-[10px] text-red-600 font-bold">{c.priority}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{c.lastActivity}</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCases((prev) =>
                                                        prev.map((item) =>
                                                            item.id === c.id
                                                                ? { ...item, stage: 'assigned', stageLabel: 'Ditugaskan ke BK' }
                                                                : item
                                                        )
                                                    );
                                                    toast.success(`Kasus ${c.code} berhasil ditugaskan ke Guru BK!`);
                                                }}
                                                className="w-full text-center py-1.5 text-[11px] bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                Tugaskan ke BK →
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Column 2: Ditugaskan */}
                            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-3">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pb-1.5 border-b border-slate-200 dark:border-slate-800">
                                    <span>2. Ditugaskan</span>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                                        {cases.filter((c) => c.stage === 'assigned').length}
                                    </span>
                                </div>
                                {cases
                                    .filter((c) => c.stage === 'assigned')
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="p-3 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-900 dark:text-white">{c.studentName}</span>
                                                <span className="text-[10px] text-blue-600 font-semibold">{c.category}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{c.lastActivity}</p>
                                            <div className="text-[10px] text-slate-400">PIC: {c.assignee}</div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCases((prev) =>
                                                        prev.map((item) =>
                                                            item.id === c.id
                                                                ? { ...item, stage: 'in_progress', stageLabel: 'Sedang Ditangani' }
                                                                : item
                                                        )
                                                    );
                                                    toast.success(`Kasus ${c.code} masuk ke sesi konseling & penanganan.`);
                                                }}
                                                className="w-full text-center py-1.5 text-[11px] bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-semibold rounded-lg hover:bg-amber-100 transition-colors"
                                            >
                                                Mulai Sesi Konseling →
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Column 3: Sedang Ditangani */}
                            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-3">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pb-1.5 border-b border-slate-200 dark:border-slate-800">
                                    <span>3. Sedang Ditangani</span>
                                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                                        {cases.filter((c) => c.stage === 'in_progress').length}
                                    </span>
                                </div>
                                {cases
                                    .filter((c) => c.stage === 'in_progress')
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="p-3 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-900 dark:text-white">{c.studentName}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">{c.code}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{c.lastActivity}</p>
                                            <div className="text-[10px] text-slate-400">PIC: {c.assignee}</div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCases((prev) =>
                                                        prev.map((item) =>
                                                            item.id === c.id
                                                                ? { ...item, stage: 'resolved', stageLabel: 'Selesai & Terdokumentasi' }
                                                                : item
                                                        )
                                                    );
                                                    setStats((prev) => ({
                                                        ...prev,
                                                        activeCases: Math.max(0, prev.activeCases - 1),
                                                        resolvedThisMonth: prev.resolvedThisMonth + 1,
                                                    }));
                                                    toast.success(`Kasus ${c.code} telah diselesaikan dan tersimpan di arsip digital!`);
                                                }}
                                                className="w-full text-center py-1.5 text-[11px] bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
                                            >
                                                Selesaikan & Arsipkan ✓
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Column 4: Selesai & Arsip */}
                            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-3">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pb-1.5 border-b border-slate-200 dark:border-slate-800">
                                    <span>4. Selesai (Arsip)</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                        {cases.filter((c) => c.stage === 'resolved').length + 18}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                                    <div className="font-semibold text-slate-900 dark:text-white">18 Kasus Bulan Ini</div>
                                    <p className="text-[10px] leading-relaxed">
                                        Seluruh berkas konseling, komitmen siswa, dan laporan ortu tersimpan di arsip digital sekolah.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: PARENT COMMUNICATION (Section 15: Komunikasi Formal & Terstruktur) */}
                {activeTab === 'communication' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Modul 04: Komunikasi Orang Tua Terstruktur
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Komunikasi resmi sekolah ke orang tua berbasis data dengan tanda terima (acknowledgement), menghindari perdebatan di grup chat.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleTriggerActionModal('parent_contact')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95"
                            >
                                <Plus className="size-3.5" />
                                Kirim Pesan Terstruktur
                            </button>
                        </div>

                        <div className="space-y-3">
                            {parentUpdates.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                                >
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">{msg.studentName}</span>
                                            <span className="text-slate-400">• Wali: {msg.parentName}</span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                                                {msg.category}
                                            </span>
                                            <span className="text-slate-400">• {msg.date}</span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070b14] p-3 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed font-normal">
                                            {msg.message}
                                        </p>
                                        <div className="text-[11px] text-slate-500">
                                            Saluran: <strong className="text-slate-700 dark:text-slate-300 font-medium">{msg.status}</strong>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex flex-col items-start md:items-end gap-1">
                                        <span className="text-[10px] text-slate-400 font-medium">Status Tanggapan Ortu:</span>
                                        <span
                                            className={cn(
                                                'px-3 py-1 text-xs font-semibold rounded-full border',
                                                msg.acknowledgement === 'Sudah membaca'
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                            )}
                                        >
                                            {msg.acknowledgement}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 6: LAPANGAN ATS (Anak Tidak Sekolah) */}
                {activeTab === 'ats' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Modul 06: Alur Lapangan ATS (Anak Tidak Sekolah)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Workflow penanganan verifikasi lapangan & intervensi: Ditugaskan → Kunjungan → Terverifikasi → Intervensi → Kembali Sekolah.
                                </p>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                                Tim Satgas Terpadu
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {atsList.map((ats) => (
                                <div
                                    key={ats.id}
                                    className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{ats.studentName}</span>
                                        <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold">
                                            {ats.lastClass}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                                        <MapPin className="size-3.5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{ats.address}</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-1">
                                        <span className="text-[10px] text-slate-400 font-medium block">Identifikasi Hambatan:</span>
                                        <div className="font-medium text-slate-800 dark:text-slate-200">{ats.reason}</div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                                        <span className="text-slate-500">Petugas: {ats.officer}</span>
                                        <span className="font-bold text-amber-600 dark:text-amber-400">
                                            {ats.status}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toast.success(`Hasil verifikasi lapangan ananda ${ats.studentName} berhasil diperbarui!`)}
                                        className="w-full py-2 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-sm transition-colors"
                                    >
                                        Update Catatan Kunjungan Rumah
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 7: DAPODIK CHECK (Anomali Operator) */}
                {activeTab === 'data-check' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Modul 09: Cek Data Dapodik (Deteksi Anomali Operator)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Membantu operator menemukan inkonsistensi data sebelum administrasi resmi cut-off (data kosong, SK belum terunggah, rombel tanpa pengampu).
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toast.success('Sinkronisasi validasi selesai. 7 anomali terverifikasi.')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
                            >
                                <RefreshCw className="size-3.5" />
                                Validasi Ulang Sekarang
                            </button>
                        </div>

                        <div className="space-y-3">
                            {dapodikIssues.map((issue) => (
                                <div
                                    key={issue.id}
                                    className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'px-2 py-0.5 rounded text-[10px] font-bold border',
                                                    issue.severity === 'Error'
                                                        ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                )}
                                            >
                                                {issue.severity}
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">{issue.category}</span>
                                            <span className="text-slate-400">• {issue.targetName}</span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 font-medium">{issue.description}</p>
                                        <div className="text-[11px] text-slate-500">
                                            Field Terkait: <span className="font-mono text-slate-800 dark:text-slate-200">{issue.field}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => toast.success(`Membuka menu perbaikan: ${issue.action}`)}
                                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shrink-0"
                                    >
                                        {issue.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 8: PAYMENTS & SPP */}
                {activeTab === 'payments' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Modul 07: Pembayaran & SPP (Rekonsiliasi Bendahara)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Menghubungkan catatan pembayaran dengan status tindak lanjut, menghindari penagihan keliru kepada siswa rentan.
                                </p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                                18 Tagihan Jatuh Tempo
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                                <thead className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase bg-slate-50 dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-4 py-3">No. Invoice</th>
                                        <th className="px-4 py-3">Siswa & Kelas</th>
                                        <th className="px-4 py-3">Jenis Pembayaran</th>
                                        <th className="px-4 py-3">Nominal</th>
                                        <th className="px-4 py-3">Jatuh Tempo</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {paymentList.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162238]/60 transition-colors">
                                            <td className="px-4 py-3 font-mono font-semibold text-blue-700 dark:text-blue-400">
                                                {p.invoiceNo}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                                {p.studentName} <span className="text-slate-400 font-normal">({p.class})</span>
                                            </td>
                                            <td className="px-4 py-3">{p.type}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                                Rp {p.amount.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">{p.dueDate}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'px-2 py-0.5 rounded text-[10px] font-bold border',
                                                        p.status === 'Lunas'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
                                                            : p.status === 'Terlambat'
                                                            ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                    )}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => toast.success(`Rekonsiliasi ${p.invoiceNo} berhasil diverifikasi!`)}
                                                    className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg border border-blue-200 dark:border-blue-900 transition-colors"
                                                >
                                                    Verifikasi
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 9: INCIDENTS & TANGGAP DARURAT */}
                {activeTab === 'incidents' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                    <Siren className="size-5 text-red-600 animate-pulse" />
                                    Modul 10: Respons Insiden & Kesiapsiagaan Sekolah
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Workflow kesiapan darurat: Insiden → Aktivasi Tim → Verifikasi → Komunikasi Cepat → Respons → Pemulihan.
                                </p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300">
                                Status: Siaga Cuaca Ekstrem
                            </span>
                        </div>

                        {incidents.map((inc) => (
                            <div
                                key={inc.id}
                                className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-red-200 dark:border-red-900/60 space-y-3 text-xs"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{inc.title}</h4>
                                        <div className="text-[11px] text-slate-500">
                                            Komandan Lapangan: <span className="text-slate-900 dark:text-white font-medium">{inc.leadOfficer}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toast.success('Broadcast darurat berhasil dikirim ke seluruh staf & wali murid!')}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors active:scale-95"
                                    >
                                        <PhoneCall className="size-3.5" />
                                        Broadcast Peringatan Darurat
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <span className="font-semibold text-slate-900 dark:text-white text-xs block mb-2">
                                        Checklist Evakuasi & Pengamanan:
                                    </span>
                                    <div className="space-y-2">
                                        {inc.checklist.map((chk) => (
                                            <label
                                                key={chk.id}
                                                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={chk.done}
                                                    onChange={() => handleToggleChecklist(inc.id, chk.id)}
                                                    className="size-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                />
                                                <span
                                                    className={cn(
                                                        'text-xs font-medium',
                                                        chk.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                                                    )}
                                                >
                                                    {chk.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* STUDENT 360° MODAL (Section 11) */}
            {/* ========================================================================= */}
            <Student360Modal
                isOpen={isStudent360Open}
                onClose={() => setIsStudent360Open(false)}
                student={selectedStudent360}
                onFollowUp={(st) => {
                    setSelectedAlertId(st.id);
                    setSelectedStudentName(`${st.studentName} (${st.class})`);
                    setSelectedStudentPhone(st.parentPhone);
                    setFollowupNote(`Tindak lanjut pemicu risiko: ${st.summary}`);
                    setIsFollowupModalOpen(true);
                }}
                onContactParent={(st) => {
                    setSelectedStudentName(`${st.studentName} (${st.class})`);
                    setSelectedStudentPhone(st.parentPhone);
                    setParentCustomMessage(
                        `Yth. Bapak/Ibu ${st.parentName}, kami dari sekolah mengonfirmasi perkembangan ananda ${st.studentName}. ${st.summary}. Mohon berkenan berkoordinasi dengan sekolah.`
                    );
                    setIsParentContactModalOpen(true);
                }}
                onEscalateCase={(st) => {
                    setSelectedStudentName(`${st.studentName} (${st.class})`);
                    setNewCaseDesc(`Eskalasi dari Early Warning: ${st.summary}`);
                    setIsNewCaseModalOpen(true);
                }}
            />

            {/* ========================================================================= */}
            {/* ACTION MODALS (PRD Principle: DATA -> ACTION) */}
            {/* ========================================================================= */}

            {/* Modal 1: Buat Follow-up Siswa */}
            {isFollowupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="size-4 text-amber-500" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    Buat Tindak Lanjut / Follow-up Siswa
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFollowupModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveFollowup} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Target Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    onChange={(e) => setSelectedStudentName(e.target.value)}
                                    className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600/30"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jenis Follow-up
                                    </label>
                                    <select
                                        value={followupType}
                                        onChange={(e) => setFollowupType(e.target.value)}
                                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none"
                                    >
                                        <option value="Panggilan Orang Tua">Panggilan Orang Tua</option>
                                        <option value="Konseling Tatap Muka BK">Konseling Tatap Muka BK</option>
                                        <option value="Home Visit (Kunjungan Rumah)">Home Visit (Kunjungan Rumah)</option>
                                        <option value="Remidial / Pembinaan Belajar">Remidial / Pembinaan Belajar</option>
                                        <option value="Perjanjian Komitmen Siswa">Perjanjian Komitmen Siswa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Penanggung Jawab (PIC)
                                    </label>
                                    <select
                                        value={followupAssignee}
                                        onChange={(e) => setFollowupAssignee(e.target.value)}
                                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none"
                                    >
                                        <option value="Wali Kelas (Hendra Setiawan, S.Pd)">Wali Kelas (Hendra Setiawan, S.Pd)</option>
                                        <option value="Guru BK (Rahmawati, S.Pd)">Guru BK (Rahmawati, S.Pd)</option>
                                        <option value="Kesiswaan (Bpk. Faisal)">Kesiswaan (Bpk. Faisal)</option>
                                        <option value="Tim Satgas ATS">Tim Satgas ATS</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan / Rencana Tindakan
                                </label>
                                <textarea
                                    rows={3}
                                    value={followupNote}
                                    onChange={(e) => setFollowupNote(e.target.value)}
                                    placeholder="Jelaskan langkah konkret yang akan diambil dan batas waktu tindak lanjut..."
                                    className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600/30"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsFollowupModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm"
                                >
                                    Simpan Follow-up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: Hubungi Orang Tua (Pesan Terstruktur) */}
            {isParentContactModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <PhoneCall className="size-4 text-emerald-600" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    Kirim Pesan Resmi Sekolah ke Orang Tua
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsParentContactModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSendParentMessage} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nama Siswa
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedStudentName}
                                        readOnly
                                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kategori Pesan
                                    </label>
                                    <select
                                        value={parentCategory}
                                        onChange={(e) => setParentCategory(e.target.value)}
                                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none"
                                    >
                                        <option value="Kehadiran">Kehadiran / Keterlambatan</option>
                                        <option value="Akademik">Perkembangan Nilai & Tugas</option>
                                        <option value="Kedisiplinan">Pembinaan Perilaku & Tata Tertib</option>
                                        <option value="Pengumuman">Pengumuman & Agenda Penting</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Isi Pesan Resmi Sekolah
                                </label>
                                <textarea
                                    rows={4}
                                    value={parentCustomMessage}
                                    onChange={(e) => setParentCustomMessage(e.target.value)}
                                    className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600/30"
                                    required
                                />
                            </div>

                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                                <strong>Fitur Acknowledgement TANGGAPIN:</strong> Orang tua akan menerima opsi konfirmasi status pembacaan (Sudah Membaca / Butuh Koordinasi Lanjutan) demi kepastian informasi.
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsParentContactModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                                >
                                    <Send className="size-3.5" />
                                    Kirim Pesan Resmi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 3: Buka Kasus BK & Kesiswaan */}
            {isNewCaseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="size-4 text-blue-600" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    Buka Kasus BK & Kesiswaan (Modul 03)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNewCaseModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCase} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    onChange={(e) => setSelectedStudentName(e.target.value)}
                                    className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600/30"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kategori Kasus
                                    </label>
                                    <select
                                        value={newCaseCategory}
                                        onChange={(e) => setNewCaseCategory(e.target.value)}
                                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none"
                                    >
                                        <option value="Kedisiplinan">Kedisiplinan & Tata Tertib</option>
                                        <option value="Kehadiran">Kehadiran (Alpa / Bolos Berulang)</option>
                                        <option value="Akademik">Akademik & Penurunan Nilai</option>
                                        <option value="Sosial">Sosial / Konflik Pertemanan</option>
                                        <option value="Sosial & Perlindungan">Perlindungan Siswa & Anti-Perundungan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tingkat Prioritas
                                    </label>
                                    <select
                                        value={newCasePriority}
                                        onChange={(e) => setNewCasePriority(e.target.value as any)}
                                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none"
                                    >
                                        <option value="Tinggi">Tinggi (Butuh tindakan &lt;24 jam)</option>
                                        <option value="Sedang">Sedang (Konseling terjadwal)</option>
                                        <option value="Rendah">Rendah (Pemantauan biasa)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Deskripsi Kasus & Kronologi
                                </label>
                                <textarea
                                    rows={3}
                                    value={newCaseDesc}
                                    onChange={(e) => setNewCaseDesc(e.target.value)}
                                    placeholder="Jelaskan ringkasan peristiwa, indikasi, atau laporan saksi..."
                                    className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600/30"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsNewCaseModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm"
                                >
                                    Daftarkan Kasus Baru
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal 4: Catat Pelanggaran / Poin Kedisiplinan */}
            {isDisciplineModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Scale className="size-4 text-blue-600" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    Catat Pelanggaran & Pembinaan (Modul 05)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDisciplineModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateDiscipline} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Target Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    onChange={(e) => setSelectedStudentName(e.target.value)}
                                    className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600/30"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jenis Pelanggaran
                                    </label>
                                    <select
                                        value={newInfraction}
                                        onChange={(e) => setNewInfraction(e.target.value)}
                                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none"
                                    >
                                        <option value="Terlambat Masuk Sekolah">Terlambat Masuk Sekolah (&gt;15 menit)</option>
                                        <option value="Atribut Seragam Tidak Lengkap">Atribut Seragam Tidak Lengkap</option>
                                        <option value="Keluar Sekolah Tanpa Surat Izin">Keluar Sekolah Tanpa Surat Izin</option>
                                        <option value="Menggunakan HP di Jam Belajar">Menggunakan HP di Jam Belajar</option>
                                        <option value="Konflik Antar Siswa / Perilaku Tidak Sopan">Konflik Antar Siswa / Perilaku</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Poin Pelanggaran
                                    </label>
                                    <select
                                        value={newPoints}
                                        onChange={(e) => setNewPoints(Number(e.target.value))}
                                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none"
                                    >
                                        <option value={5}>5 Poin (Ringan)</option>
                                        <option value={10}>10 Poin (Sedang)</option>
                                        <option value={15}>15 Poin (Perhatian Khusus)</option>
                                        <option value={25}>25 Poin (Berat / Konseling BK)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan Pola & Rencana Tindakan Restoratif
                                </label>
                                <textarea
                                    rows={3}
                                    value={newDisciplineNotes}
                                    onChange={(e) => setNewDisciplineNotes(e.target.value)}
                                    placeholder="Jelaskan tindakan pembinaan karakter yang disepakati bersama siswa..."
                                    className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600/30"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsDisciplineModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm"
                                >
                                    Simpan Catatan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </FlowbiteTanggapinLayout>
    );
}

// Override default app layout since Dashboard manages its own FlowbiteTanggapinLayout with interactive props
Dashboard.layout = (page: React.ReactNode) => page;
