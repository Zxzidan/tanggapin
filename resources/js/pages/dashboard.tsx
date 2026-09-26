import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Eye,
    GraduationCap,
    Layers,
    MapPin,
    PhoneCall,
    Plus,
    RefreshCw,
    Scale,
    Send,
    ShieldAlert,
    Siren,
    Sparkles,
    UserCheck,
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
        },
    );
    const [priorityFeed, setPriorityFeed] = useState<PriorityAlert[]>(
        initialPriorityFeed || [],
    );
    const [cases, setCases] = useState<CaseItem[]>(initialCases || []);
    const [incidents, setIncidents] = useState<IncidentItem[]>(
        initialIncidents || [],
    );
    const [parentUpdates, setParentUpdates] = useState<ParentUpdate[]>(
        initialParentUpdates || [],
    );
    const [classes] = useState<ClassMonitoringItem[]>(initialClasses || []);
    const [atsList] = useState<AtsItem[]>(initialAtsList || []);
    const [paymentList] = useState<PaymentItem[]>(initialPaymentList || []);
    const [dapodikIssues] = useState<DapodikIssue[]>(
        initialDapodikIssues || [],
    );
    const [_documents] = useState<TeacherDocument[]>(initialDocuments || []);
    const [_disciplineList, setDisciplineList] = useState<
        DisciplineRecordItem[]
    >(initialDisciplineList || []);

    // Filter states
    const [feedRiskFilter, setFeedRiskFilter] = useState<
        'all' | 'high' | 'medium'
    >('all');

    // Modals state
    const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
    const [isParentContactModalOpen, setIsParentContactModalOpen] =
        useState(false);
    const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
    const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
    const [isStudent360Open, setIsStudent360Open] = useState(false);

    // Selected items for modal
    const [selectedStudentId, setSelectedStudentId] = useState<string>('1');
    const [selectedStudentName, setSelectedStudentName] = useState(
        'Brian Aditya (XI RPL 2)',
    );
    const [selectedStudentPhone, setSelectedStudentPhone] =
        useState('+62 812-3456-7890');
    const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
    const [selectedStudent360, setSelectedStudent360] =
        useState<PriorityAlert | null>(null);

    // Follow-up form
    const [followupType, setFollowupType] = useState('Panggilan Orang Tua');
    const [followupAssignee, setFollowupAssignee] = useState(
        'Wali Kelas (Hendra Setiawan, S.Pd)',
    );
    const [followupNote, setFollowupNote] = useState('');

    // Parent contact form
    const [parentCategory, setParentCategory] = useState('Kehadiran');
    const [parentCustomMessage, setParentCustomMessage] = useState(
        'Yth. Bapak/Ibu Wali Murid, kami menginformasikan catatan kehadiran ananda yang memerlukan koordinasi bersama sekolah demi kelancaran proses belajar.',
    );

    // New case form
    const [newCaseCategory, setNewCaseCategory] = useState('Kedisiplinan');
    const [newCasePriority, setNewCasePriority] = useState<
        'Tinggi' | 'Sedang' | 'Rendah'
    >('Tinggi');
    const [newCaseDesc, setNewCaseDesc] = useState('');

    // New discipline form
    const [newInfraction, setNewInfraction] = useState(
        'Terlambat Masuk Sekolah',
    );
    const [newPoints, setNewPoints] = useState(10);
    const [newDisciplineNotes, setNewDisciplineNotes] = useState('');

    // Contextual greetings per role (Section 9 Header)
    const roleContexts: Record<RoleType, { name: string; position: string }> = {
        kepala_sekolah: { name: 'Bpk. Neil Sims', position: 'Kepala Sekolah' },
        wali_kelas: {
            name: 'Bpk. Hendra Setiawan, S.Pd',
            position: 'Wali Kelas XI RPL 2',
        },
        guru_bk: {
            name: 'Ibu Rahmawati, S.Pd',
            position: 'Koordinator BK & Konseling',
        },
        bendahara: {
            name: 'Bpk. Joko Purwanto',
            position: 'Bendahara Sekolah',
        },
        operator: { name: 'Ibu Dian Pratiwi', position: 'Operator Dapodik' },
    };

    // Open Student 360 Modal
    const handleOpenStudent360 = (alert: PriorityAlert) => {
        setSelectedStudent360(alert);
        setIsStudent360Open(true);
    };

    // Trigger action from topbar or buttons
    const handleTriggerActionModal = (
        actionType: string,
        studentName?: string,
        studentId?: string,
    ) => {
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
                    toast.success(
                        `Follow-up untuk ${selectedStudentName} berhasil disimpan di database!`,
                        {
                            description: `Tindakan: ${followupType} | PIC: ${followupAssignee}`,
                        },
                    );
                    if (selectedAlertId) {
                        setPriorityFeed((prev) =>
                            prev.map((item) =>
                                item.id === selectedAlertId
                                    ? { ...item, actionTaken: true }
                                    : item,
                            ),
                        );
                    }
                    setStats((prev) => ({
                        ...prev,
                        studentsNeedingAttention: Math.max(
                            0,
                            prev.studentsNeedingAttention - 1,
                        ),
                        resolvedThisMonth: prev.resolvedThisMonth + 1,
                    }));
                    setIsFollowupModalOpen(false);
                    setFollowupNote('');
                },
                onError: () => {
                    toast.error('Gagal menyimpan follow-up ke database.');
                },
            },
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
                    toast.success(
                        `Pesan resmi berhasil dikirim dan tersimpan di database!`,
                    );
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
            },
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
                last_activity:
                    newCaseDesc ||
                    'Kasus baru didaftarkan dan menunggu verifikasi BK.',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Kasus baru untuk ${selectedStudentName} berhasil didaftarkan di database!`,
                    );
                    setIsNewCaseModalOpen(false);
                    setNewCaseDesc('');
                    setStats((prev) => ({
                        ...prev,
                        activeCases: prev.activeCases + 1,
                    }));
                },
                onError: () => {
                    toast.error('Gagal mendaftarkan kasus ke database.');
                },
            },
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
                pattern_notes:
                    newDisciplineNotes || 'Pencatatan pembinaan kedisiplinan',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Catatan kedisiplinan untuk ${selectedStudentName} berhasil disimpan!`,
                    );
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
                            patternNotes:
                                newDisciplineNotes ||
                                'Dicatat dari modul kedisiplinan',
                            recordedAt: 'Hari ini',
                        },
                        ...prev,
                    ]);
                },
                onError: () => {
                    toast.error('Gagal menyimpan catatan kedisiplinan.');
                },
            },
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
                            chk.id === checklistId
                                ? { ...chk, done: !chk.done }
                                : chk,
                        ),
                    };
                }
                return inc;
            }),
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

            <div className="mx-auto max-w-7xl space-y-6">
                {/* 1. CONTEXTUAL OPERATIONAL HEADER (Section 9: Konteks Pengguna) */}
                <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-700 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                                <Sparkles className="size-3" />
                                TANGGAPIN
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                                SMK Negeri 1 Harapan • T.A. 2025/2026 Ganjil
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                                •
                            </span>
                            <span className="hidden text-xs font-medium text-slate-500 sm:inline">
                                Kamis, 24 September 2025
                            </span>
                        </div>

                        <h1 className="pt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Selamat bertugas, {roleContexts[currentRole]?.name}
                        </h1>

                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Masuk sebagai{' '}
                            <strong className="font-semibold text-blue-700 dark:text-blue-400">
                                {roleContexts[currentRole]?.position}
                            </strong>
                            . Sistem mendeteksi{' '}
                            <strong className="text-red-600 dark:text-red-400">
                                {stats.studentsNeedingAttention} siswa
                            </strong>{' '}
                            yang memerlukan perhatian dan tindak lanjut terarah
                            hari ini.
                        </p>
                    </div>

                    {/* Role Simulator Switcher Pills */}
                    <div className="flex shrink-0 flex-wrap items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-slate-100/80 p-1.5 lg:self-center dark:border-slate-700 dark:bg-[#162238]">
                        <span className="px-2 text-[11px] font-semibold text-slate-500">
                            Peran:
                        </span>
                        {(
                            [
                                'kepala_sekolah',
                                'wali_kelas',
                                'guru_bk',
                                'bendahara',
                                'operator',
                            ] as RoleType[]
                        ).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setCurrentRole(r)}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                                    currentRole === r
                                        ? 'bg-blue-700 font-semibold text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white',
                                )}
                            >
                                {r === 'kepala_sekolah'
                                    ? 'Kepsek'
                                    : r === 'wali_kelas'
                                      ? 'Wali Kelas'
                                      : r === 'guru_bk'
                                        ? 'Guru BK'
                                        : r === 'bendahara'
                                          ? 'Bendahara'
                                          : 'Operator'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. RINGKASAN KONDISI SISWA (Section 9: Metrik Berhierarki dengan Konteks) */}
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4">
                    {/* Primary Highlight Metric: Siswa Perlu Perhatian */}
                    <div
                        onClick={() => setActiveTab('early-warning')}
                        className="group cursor-pointer rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-2xs transition-all hover:border-red-400 hover:shadow-xs dark:border-red-900/60 dark:bg-red-950/20"
                    >
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-red-700 uppercase dark:text-red-400">
                                Butuh Perhatian
                            </span>
                            <div className="rounded-lg bg-red-100 p-1.5 text-red-700 transition-transform group-hover:scale-105 dark:bg-red-900/50 dark:text-red-300">
                                <AlertTriangle className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-red-700 dark:text-red-400">
                            {stats.studentsNeedingAttention}
                        </div>
                        <p className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-400">
                            Siswa terdeteksi sinyal risiko (absensi, nilai,
                            kedisiplinan)
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-red-200/60 pt-2 text-[11px] font-semibold text-red-700 dark:border-red-900/60 dark:text-red-400">
                            <span>Tinjau Sinyal</span>
                            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </div>

                    {/* Secondary Metric: Kasus Aktif BK */}
                    <div
                        onClick={() => setActiveTab('cases')}
                        className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-amber-400 hover:shadow-xs dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                Kasus Aktif BK
                            </span>
                            <div className="rounded-lg bg-amber-50 p-1.5 text-amber-700 transition-transform group-hover:scale-105 dark:bg-amber-950/60 dark:text-amber-300">
                                <ShieldAlert className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-amber-700 dark:text-amber-400">
                            {stats.activeCases}
                        </div>
                        <p className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-400">
                            {stats.overdueCases} kasus butuh evaluasi &gt;48 jam
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-semibold text-blue-700 dark:border-slate-800 dark:text-blue-400">
                            <span>Alur Kasus</span>
                            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </div>

                    {/* Secondary Metric: Tindak Lanjut Selesai (North Star Metric) */}
                    <div
                        onClick={() => setActiveTab('cases')}
                        className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-emerald-400 hover:shadow-xs dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                Terdokumentasi
                            </span>
                            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700 transition-transform group-hover:scale-105 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <CheckCircle2 className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
                            {stats.resolvedThisMonth}
                        </div>
                        <p className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-400">
                            Tindakan & pendampingan selesai bulan ini
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-semibold text-blue-700 dark:border-slate-800 dark:text-blue-400">
                            <span>Arsip Dokumen</span>
                            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </div>

                    {/* Secondary Metric: Tingkat Kehadiran Sekolah */}
                    <div
                        onClick={() => setActiveTab('class-monitoring')}
                        className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-blue-400 hover:shadow-xs dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                Rata-rata Hadir
                            </span>
                            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 transition-transform group-hover:scale-105 dark:bg-blue-950/60 dark:text-blue-300">
                                <GraduationCap className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-blue-700 dark:text-blue-400">
                            92.4%
                        </div>
                        <p className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-400">
                            Akumulasi 4 rombel kejuruan terdaftar
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-semibold text-blue-700 dark:border-slate-800 dark:text-blue-400">
                            <span>Lihat Rombel</span>
                            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </div>
                </div>

                {/* 3. PRIORITAS: PERLU PERHATIAN (Section 9: Bagian Paling Penting Dashboard) */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="size-2.5 animate-pulse rounded-full bg-red-600" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Perlu Perhatian — Tindak Lanjut Mendesak
                                </h2>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Sinyal kondisi siswa yang membutuhkan keputusan
                                dan respons hari ini.
                            </p>
                        </div>

                        {/* Filter Severity Pills */}
                        <div className="flex items-center gap-1.5 self-start sm:self-center">
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('all')}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'all'
                                        ? 'bg-slate-900 font-semibold text-white dark:bg-white dark:text-slate-900'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
                                )}
                            >
                                Semua ({priorityFeed.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('high')}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'high'
                                        ? 'bg-red-600 font-semibold text-white'
                                        : 'text-slate-500 hover:bg-red-50 hover:text-red-700',
                                )}
                            >
                                Kritis (3)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('medium')}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'medium'
                                        ? 'bg-amber-600 font-semibold text-white'
                                        : 'text-slate-500 hover:bg-amber-50 hover:text-amber-700',
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
                                        'flex flex-col justify-between gap-4 rounded-xl border p-4 transition-all lg:flex-row lg:items-center',
                                        alert.actionTaken
                                            ? 'border-slate-200 bg-slate-50/60 opacity-60 dark:border-slate-800 dark:bg-slate-900/40'
                                            : isHigh
                                              ? 'border-red-200/90 bg-white shadow-xs dark:border-red-900/60 dark:bg-[#111c30]'
                                              : 'border-amber-200/90 bg-white shadow-xs dark:border-amber-900/60 dark:bg-[#111c30]',
                                    )}
                                >
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {alert.studentName}
                                            </span>
                                            <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {alert.class}
                                            </span>
                                            <span
                                                className={cn(
                                                    'rounded-full border px-2 py-0.5 text-[10px] font-bold',
                                                    isHigh
                                                        ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                        : 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                                                )}
                                            >
                                                {alert.triggerType}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                • Terdeteksi {alert.timestamp}
                                            </span>
                                            {alert.actionTaken && (
                                                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                    ✓ Sudah Ditindaklanjuti
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
                                                Orang Tua:{' '}
                                                <strong className="font-medium text-slate-700 dark:text-slate-300">
                                                    {alert.parentName} (
                                                    {alert.parentPhone})
                                                </strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action-Oriented Buttons (Section 10: Action Connection) */}
                                    <div className="flex shrink-0 flex-wrap items-center gap-2 self-start lg:self-center">
                                        {/* Student 360 Degree View Action */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleOpenStudent360(alert)
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
                                                setSelectedStudentId(
                                                    alert.studentId || alert.id,
                                                );
                                                setSelectedStudentName(
                                                    `${alert.studentName} (${alert.class})`,
                                                );
                                                setSelectedStudentPhone(
                                                    alert.parentPhone,
                                                );
                                                setFollowupNote(
                                                    `Tindak lanjut pemicu risiko: ${alert.summary}`,
                                                );
                                                setIsFollowupModalOpen(true);
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 active:scale-95 disabled:opacity-50"
                                        >
                                            <Plus className="size-3.5" />
                                            <span>Buat Tindak Lanjut</span>
                                        </button>

                                        {/* Contact Parent Action */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedAlertId(alert.id);
                                                setSelectedStudentId(
                                                    alert.studentId || alert.id,
                                                );
                                                setSelectedStudentName(
                                                    `${alert.studentName} (${alert.class})`,
                                                );
                                                setSelectedStudentPhone(
                                                    alert.parentPhone,
                                                );
                                                setParentCustomMessage(
                                                    `Yth. Bapak/Ibu ${alert.parentName}, kami dari sekolah menginformasikan perkembangan ananda ${alert.studentName}. ${alert.summary}. Mohon berkenan berkoordinasi dengan sekolah demi kelancaran proses belajar.`,
                                                );
                                                setIsParentContactModalOpen(
                                                    true,
                                                );
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                            title="Kirim pesan terstruktur resmi ke orang tua"
                                        >
                                            <PhoneCall className="size-3.5 text-emerald-600" />
                                            <span className="hidden sm:inline">
                                                Hubungi Ortu
                                            </span>
                                        </button>

                                        {/* Escalate to Case Management */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedAlertId(alert.id);
                                                setSelectedStudentId(
                                                    alert.studentId || alert.id,
                                                );
                                                setSelectedStudentName(
                                                    `${alert.studentName} (${alert.class})`,
                                                );
                                                setNewCaseDesc(
                                                    `Eskalasi dari Early Warning: ${alert.summary}`,
                                                );
                                                setIsNewCaseModalOpen(true);
                                            }}
                                            className="rounded-lg border border-transparent p-2 text-slate-500 transition-colors hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/60"
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
                <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-800">
                    <ul className="-mb-px flex flex-nowrap gap-1 text-center text-xs font-semibold text-slate-500 sm:flex-wrap dark:text-slate-400">
                        <li>
                            <button
                                type="button"
                                onClick={() => setActiveTab('overview')}
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-3 whitespace-nowrap transition-colors',
                                    activeTab === 'overview'
                                        ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent hover:border-slate-300 hover:text-slate-900 dark:hover:text-white',
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
                                    'inline-flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-3 whitespace-nowrap transition-colors',
                                    activeTab === 'early-warning'
                                        ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent hover:border-slate-300 hover:text-slate-900 dark:hover:text-white',
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
                                    'inline-flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-3 whitespace-nowrap transition-colors',
                                    activeTab === 'class-monitoring'
                                        ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent hover:border-slate-300 hover:text-slate-900 dark:hover:text-white',
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
                                    'inline-flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-3 whitespace-nowrap transition-colors',
                                    activeTab === 'cases'
                                        ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent hover:border-slate-300 hover:text-slate-900 dark:hover:text-white',
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
                                    'inline-flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-3 whitespace-nowrap transition-colors',
                                    activeTab === 'communication'
                                        ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent hover:border-slate-300 hover:text-slate-900 dark:hover:text-white',
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
                                    'inline-flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-3 whitespace-nowrap transition-colors',
                                    activeTab === 'ats'
                                        ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent hover:border-slate-300 hover:text-slate-900 dark:hover:text-white',
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
                                    'inline-flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-3 whitespace-nowrap transition-colors',
                                    activeTab === 'data-check'
                                        ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent hover:border-slate-300 hover:text-slate-900 dark:hover:text-white',
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
                                    'inline-flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-3 whitespace-nowrap transition-colors',
                                    activeTab === 'payments'
                                        ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent hover:border-slate-300 hover:text-slate-900 dark:hover:text-white',
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
                                    'inline-flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-3 whitespace-nowrap transition-colors',
                                    activeTab === 'incidents'
                                        ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                        : 'border-transparent hover:border-slate-300 hover:text-slate-900 dark:hover:text-white',
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
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {/* Class Health Monitoring (Section 9: Student Signal & Condition) */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Indikator Kondisi Kelas (Class Health)
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Mendeteksi kelas yang memerlukan
                                        dukungan intervensi guru.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab('class-monitoring')
                                    }
                                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                >
                                    Semua Rombel{' '}
                                    <ChevronRight className="size-3.5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {classes.map((cls) => {
                                    const isCritical =
                                        cls.healthStatus === 'critical';
                                    const isWarning =
                                        cls.healthStatus === 'warning';

                                    return (
                                        <div
                                            key={cls.id}
                                            className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-[#111c30]"
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
                                                        'rounded-full border px-2 py-0.5 text-[10px] font-bold',
                                                        isCritical
                                                            ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                            : isWarning
                                                              ? 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                                              : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
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
                                                    <span className="font-bold text-red-600">
                                                        {cls.studentsAtRisk}{' '}
                                                        siswa
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] font-medium text-slate-400">
                                                        Follow-up Pending
                                                    </span>
                                                    <span className="font-bold text-amber-600">
                                                        {cls.pendingFollowups}{' '}
                                                        pending
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px] text-slate-500 dark:border-slate-800">
                                                <span>
                                                    Wali: {cls.homeroomTeacher}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStudentName(
                                                            `Siswa ${cls.name}`,
                                                        );
                                                        setIsFollowupModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className="font-semibold text-blue-700 hover:underline dark:text-blue-400"
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
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Progres Penanganan Kasus (Alur
                                        Terstruktur)
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Alur: Baru → Ditugaskan → Ditangani →
                                        Selesai
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleTriggerActionModal('new_case')
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 active:scale-95"
                                >
                                    <Plus className="size-3.5" />
                                    Buka Kasus
                                </button>
                            </div>

                            <div className="space-y-3">
                                {cases.slice(0, 3).map((c) => (
                                    <div
                                        key={c.id}
                                        className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-[#111c30]"
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
                                                    ({c.class})
                                                </span>
                                            </div>
                                            <span
                                                className={cn(
                                                    'rounded px-2 py-0.5 text-[10px] font-bold',
                                                    c.priority === 'Tinggi'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                                                )}
                                            >
                                                Prioritas: {c.priority}
                                            </span>
                                        </div>

                                        <p className="rounded-lg border border-slate-200 bg-white p-2.5 leading-relaxed font-normal text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-300">
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

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('cases')}
                                    className="w-full rounded-lg border border-dashed border-blue-200 py-2 text-center text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/50"
                                >
                                    Buka Papan Kanban Kasus Lengkap (
                                    {cases.length} Kasus) →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: EARLY WARNING MONITORING TABLE (Section 12 & 16: Table) */}
                {activeTab === 'early-warning' && (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Modul 01: Early Warning System (Deteksi
                                    Sinyal Risiko Siswa)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Mengenali sinyal penurunan kondisi siswa
                                    sebelum menjadi masalah besar. Menampilkan
                                    indikator obyektif, bukan vonis.
                                </p>
                            </div>
                            <span className="self-start rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700 sm:self-center dark:bg-red-950 dark:text-red-300">
                                12 Siswa Dalam Pantauan
                            </span>
                        </div>

                        {/* Clean Table Layout (Section 16: Table for scanning and comparison) */}
                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:bg-[#111c30] dark:text-slate-300">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Siswa & Kelas
                                        </th>
                                        <th className="px-4 py-3">
                                            Pemicu Sinyal
                                        </th>
                                        <th className="px-4 py-3">
                                            Konteks & Ringkasan
                                        </th>
                                        <th className="px-4 py-3">
                                            Wali Kelas
                                        </th>
                                        <th className="px-4 py-3">Orang Tua</th>
                                        <th className="px-4 py-3 text-center">
                                            Tindakan Cepat
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {priorityFeed.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-[#162238]/60"
                                        >
                                            <td className="px-4 py-3.5 font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                <div>{item.studentName}</div>
                                                <div className="text-[11px] font-normal text-slate-500">
                                                    {item.class}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span
                                                    className={cn(
                                                        'rounded border px-2 py-0.5 text-[10px] font-bold',
                                                        item.riskLevel ===
                                                            'high'
                                                            ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                            : 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                                                    )}
                                                >
                                                    {item.triggerType}
                                                </span>
                                            </td>
                                            <td className="max-w-xs px-4 py-3.5 text-[11px] leading-relaxed">
                                                {item.summary}
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] whitespace-nowrap text-slate-600 dark:text-slate-300">
                                                {item.homeroomTeacher}
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] whitespace-nowrap">
                                                <div className="font-medium text-slate-900 dark:text-white">
                                                    {item.parentName}
                                                </div>
                                                <div className="text-slate-400">
                                                    {item.parentPhone}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenStudent360(
                                                                item,
                                                            )
                                                        }
                                                        className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
                                                    >
                                                        Profil 360°
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedStudentName(
                                                                `${item.studentName} (${item.class})`,
                                                            );
                                                            setSelectedStudentPhone(
                                                                item.parentPhone,
                                                            );
                                                            setIsFollowupModalOpen(
                                                                true,
                                                            );
                                                        }}
                                                        className="rounded-lg bg-blue-700 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800"
                                                    >
                                                        Follow-up
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedStudentName(
                                                                `${item.studentName} (${item.class})`,
                                                            );
                                                            setSelectedStudentPhone(
                                                                item.parentPhone,
                                                            );
                                                            setIsParentContactModalOpen(
                                                                true,
                                                            );
                                                        }}
                                                        className="rounded-lg border border-slate-200 p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-slate-800"
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
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Modul 02: Kondisi Kelas (Halaman Wali Kelas)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Satu layar terpadu melihat tren kehadiran,
                                    peserta didik berisiko, dan status tindak
                                    lanjut per rombel.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    toast.success(
                                        'Pencatatan absensi harian kelas XI RPL 2 siap ditindaklanjuti.',
                                    );
                                    setSelectedStudentName('Kelas XI RPL 2');
                                    setIsFollowupModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 active:scale-95"
                            >
                                <Plus className="size-3.5" />
                                Catat Absensi Hari Ini
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {classes.map((cls) => {
                                const isGood = cls.attendanceRate >= 95;
                                const isWarning =
                                    cls.attendanceRate >= 90 &&
                                    cls.attendanceRate < 95;

                                return (
                                    <div
                                        key={cls.id}
                                        className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-[#111c30]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                                {cls.name}
                                            </h4>
                                            <span className="text-[11px] font-semibold text-slate-500">
                                                {cls.totalStudents} Siswa
                                            </span>
                                        </div>
                                        <p className="text-[11px] leading-snug text-slate-500">
                                            {cls.major}
                                        </p>

                                        <div className="space-y-1.5 border-t border-slate-200 pt-2 dark:border-slate-800">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-slate-500">
                                                    Tingkat Hadir:
                                                </span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {cls.attendanceRate}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                <div
                                                    className={cn(
                                                        'h-full rounded-full transition-all',
                                                        isGood
                                                            ? 'bg-emerald-500'
                                                            : isWarning
                                                              ? 'bg-amber-500'
                                                              : 'bg-red-500',
                                                    )}
                                                    style={{
                                                        width: `${cls.attendanceRate}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                                            <div className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-[#070b14]">
                                                <span className="block text-[10px] font-medium text-slate-400">
                                                    Perlu Perhatian
                                                </span>
                                                <span className="text-sm font-bold text-red-600">
                                                    {cls.studentsAtRisk} siswa
                                                </span>
                                            </div>
                                            <div className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-[#070b14]">
                                                <span className="block text-[10px] font-medium text-slate-400">
                                                    Follow-up Pending
                                                </span>
                                                <span className="text-sm font-bold text-amber-600">
                                                    {cls.pendingFollowups} kasus
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-200 pt-1 text-[11px] text-slate-500 dark:border-slate-800">
                                            Wali:{' '}
                                            <strong className="font-medium text-slate-800 dark:text-slate-200">
                                                {cls.homeroomTeacher}
                                            </strong>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 4: CASE MANAGEMENT (Section 13: Alur Terstruktur Kanban & Timeline) */}
                {activeTab === 'cases' && (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Modul 03: Case Management (Papan Alur
                                    Penanganan Kasus)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Mengubah koordinasi kasus dari percakapan
                                    informal menjadi workflow terstruktur: Baru
                                    → Ditugaskan → Konseling → Tuntas.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    handleTriggerActionModal('new_case')
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 active:scale-95"
                            >
                                <Plus className="size-3.5" />
                                Daftarkan Kasus Baru
                            </button>
                        </div>

                        {/* Kanban Columns */}
                        <div className="grid grid-cols-1 gap-3.5 text-xs md:grid-cols-4">
                            {/* Column 1: Baru Masuk */}
                            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-[#111c30]">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                                    <span>1. Baru Masuk</span>
                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        {
                                            cases.filter(
                                                (c) => c.stage === 'new',
                                            ).length
                                        }
                                    </span>
                                </div>
                                {cases
                                    .filter((c) => c.stage === 'new')
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-[#070b14]"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {c.studentName}
                                                </span>
                                                <span className="text-[10px] font-bold text-red-600">
                                                    {c.priority}
                                                </span>
                                            </div>
                                            <p className="text-[11px] leading-relaxed font-normal text-slate-600 dark:text-slate-400">
                                                {c.lastActivity}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCases((prev) =>
                                                        prev.map((item) =>
                                                            item.id === c.id
                                                                ? {
                                                                      ...item,
                                                                      stage: 'assigned',
                                                                      stageLabel:
                                                                          'Ditugaskan ke BK',
                                                                  }
                                                                : item,
                                                        ),
                                                    );
                                                    toast.success(
                                                        `Kasus ${c.code} berhasil ditugaskan ke Guru BK!`,
                                                    );
                                                }}
                                                className="w-full rounded-lg bg-blue-50 py-1.5 text-center text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950/70 dark:text-blue-300"
                                            >
                                                Tugaskan ke BK →
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Column 2: Ditugaskan */}
                            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-[#111c30]">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                                    <span>2. Ditugaskan</span>
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                        {
                                            cases.filter(
                                                (c) => c.stage === 'assigned',
                                            ).length
                                        }
                                    </span>
                                </div>
                                {cases
                                    .filter((c) => c.stage === 'assigned')
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-[#070b14]"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {c.studentName}
                                                </span>
                                                <span className="text-[10px] font-semibold text-blue-600">
                                                    {c.category}
                                                </span>
                                            </div>
                                            <p className="text-[11px] leading-relaxed font-normal text-slate-600 dark:text-slate-400">
                                                {c.lastActivity}
                                            </p>
                                            <div className="text-[10px] text-slate-400">
                                                PIC: {c.assignee}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCases((prev) =>
                                                        prev.map((item) =>
                                                            item.id === c.id
                                                                ? {
                                                                      ...item,
                                                                      stage: 'in_progress',
                                                                      stageLabel:
                                                                          'Sedang Ditangani',
                                                                  }
                                                                : item,
                                                        ),
                                                    );
                                                    toast.success(
                                                        `Kasus ${c.code} masuk ke sesi konseling & penanganan.`,
                                                    );
                                                }}
                                                className="w-full rounded-lg bg-amber-50 py-1.5 text-center text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300"
                                            >
                                                Mulai Sesi Konseling →
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Column 3: Sedang Ditangani */}
                            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-[#111c30]">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                                    <span>3. Sedang Ditangani</span>
                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                        {
                                            cases.filter(
                                                (c) =>
                                                    c.stage === 'in_progress',
                                            ).length
                                        }
                                    </span>
                                </div>
                                {cases
                                    .filter((c) => c.stage === 'in_progress')
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-[#070b14]"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {c.studentName}
                                                </span>
                                                <span className="font-mono text-[10px] text-slate-400">
                                                    {c.code}
                                                </span>
                                            </div>
                                            <p className="text-[11px] leading-relaxed font-normal text-slate-600 dark:text-slate-400">
                                                {c.lastActivity}
                                            </p>
                                            <div className="text-[10px] text-slate-400">
                                                PIC: {c.assignee}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCases((prev) =>
                                                        prev.map((item) =>
                                                            item.id === c.id
                                                                ? {
                                                                      ...item,
                                                                      stage: 'resolved',
                                                                      stageLabel:
                                                                          'Selesai & Terdokumentasi',
                                                                  }
                                                                : item,
                                                        ),
                                                    );
                                                    setStats((prev) => ({
                                                        ...prev,
                                                        activeCases: Math.max(
                                                            0,
                                                            prev.activeCases -
                                                                1,
                                                        ),
                                                        resolvedThisMonth:
                                                            prev.resolvedThisMonth +
                                                            1,
                                                    }));
                                                    toast.success(
                                                        `Kasus ${c.code} telah diselesaikan dan tersimpan di arsip digital!`,
                                                    );
                                                }}
                                                className="w-full rounded-lg bg-emerald-50 py-1.5 text-center text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300"
                                            >
                                                Selesaikan & Arsipkan ✓
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Column 4: Selesai & Arsip */}
                            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-[#111c30]">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                                    <span>4. Selesai (Arsip)</span>
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                        {cases.filter(
                                            (c) => c.stage === 'resolved',
                                        ).length + 18}
                                    </span>
                                </div>
                                <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-400">
                                    <div className="font-semibold text-slate-900 dark:text-white">
                                        18 Kasus Bulan Ini
                                    </div>
                                    <p className="text-[10px] leading-relaxed">
                                        Seluruh berkas konseling, komitmen
                                        siswa, dan laporan ortu tersimpan di
                                        arsip digital sekolah.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: PARENT COMMUNICATION (Section 15: Komunikasi Formal & Terstruktur) */}
                {activeTab === 'communication' && (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Modul 04: Komunikasi Orang Tua Terstruktur
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Komunikasi resmi sekolah ke orang tua
                                    berbasis data dengan tanda terima
                                    (acknowledgement), menghindari perdebatan di
                                    grup chat.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    handleTriggerActionModal('parent_contact')
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 active:scale-95"
                            >
                                <Plus className="size-3.5" />
                                Kirim Pesan Terstruktur
                            </button>
                        </div>

                        <div className="space-y-3">
                            {parentUpdates.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs md:flex-row md:items-center dark:border-slate-800 dark:bg-[#111c30]"
                                >
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {msg.studentName}
                                            </span>
                                            <span className="text-slate-400">
                                                • Wali: {msg.parentName}
                                            </span>
                                            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                                {msg.category}
                                            </span>
                                            <span className="text-slate-400">
                                                • {msg.date}
                                            </span>
                                        </div>
                                        <p className="rounded-lg border border-slate-200 bg-white p-3 leading-relaxed font-normal text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-300">
                                            {msg.message}
                                        </p>
                                        <div className="text-[11px] text-slate-500">
                                            Saluran:{' '}
                                            <strong className="font-medium text-slate-700 dark:text-slate-300">
                                                {msg.status}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 flex-col items-start gap-1 md:items-end">
                                        <span className="text-[10px] font-medium text-slate-400">
                                            Status Tanggapan Ortu:
                                        </span>
                                        <span
                                            className={cn(
                                                'rounded-full border px-3 py-1 text-xs font-semibold',
                                                msg.acknowledgement ===
                                                    'Sudah membaca'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                    : 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
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
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Modul 06: Alur Lapangan ATS (Anak Tidak
                                    Sekolah)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Workflow penanganan verifikasi lapangan &
                                    intervensi: Ditugaskan → Kunjungan →
                                    Terverifikasi → Intervensi → Kembali
                                    Sekolah.
                                </p>
                            </div>
                            <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                Tim Satgas Terpadu
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                            {atsList.map((ats) => (
                                <div
                                    key={ats.id}
                                    className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-[#111c30]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {ats.studentName}
                                        </span>
                                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                            {ats.lastClass}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-red-500" />
                                        <span>{ats.address}</span>
                                    </div>
                                    <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-[#070b14]">
                                        <span className="block text-[10px] font-medium text-slate-400">
                                            Identifikasi Hambatan:
                                        </span>
                                        <div className="font-medium text-slate-800 dark:text-slate-200">
                                            {ats.reason}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[11px] dark:border-slate-800">
                                        <span className="text-slate-500">
                                            Petugas: {ats.officer}
                                        </span>
                                        <span className="font-bold text-amber-600 dark:text-amber-400">
                                            {ats.status}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toast.success(
                                                `Hasil verifikasi lapangan ananda ${ats.studentName} berhasil diperbarui!`,
                                            )
                                        }
                                        className="w-full rounded-lg bg-blue-700 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
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
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Modul 09: Cek Data Dapodik (Deteksi Anomali
                                    Operator)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Membantu operator menemukan inkonsistensi
                                    data sebelum administrasi resmi cut-off
                                    (data kosong, SK belum terunggah, rombel
                                    tanpa pengampu).
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    toast.success(
                                        'Sinkronisasi validasi selesai. 7 anomali terverifikasi.',
                                    )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
                            >
                                <RefreshCw className="size-3.5" />
                                Validasi Ulang Sekarang
                            </button>
                        </div>

                        <div className="space-y-3">
                            {dapodikIssues.map((issue) => (
                                <div
                                    key={issue.id}
                                    className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs md:flex-row md:items-center dark:border-slate-800 dark:bg-[#111c30]"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'rounded border px-2 py-0.5 text-[10px] font-bold',
                                                    issue.severity === 'Error'
                                                        ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                        : 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                                                )}
                                            >
                                                {issue.severity}
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {issue.category}
                                            </span>
                                            <span className="text-slate-400">
                                                • {issue.targetName}
                                            </span>
                                        </div>
                                        <p className="font-medium text-slate-700 dark:text-slate-300">
                                            {issue.description}
                                        </p>
                                        <div className="text-[11px] text-slate-500">
                                            Field Terkait:{' '}
                                            <span className="font-mono text-slate-800 dark:text-slate-200">
                                                {issue.field}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toast.success(
                                                `Membuka menu perbaikan: ${issue.action}`,
                                            )
                                        }
                                        className="shrink-0 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800"
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
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Modul 07: Pembayaran & SPP (Rekonsiliasi
                                    Bendahara)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Menghubungkan catatan pembayaran dengan
                                    status tindak lanjut, menghindari penagihan
                                    keliru kepada siswa rentan.
                                </p>
                            </div>
                            <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                18 Tagihan Jatuh Tempo
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:bg-[#111c30] dark:text-slate-300">
                                    <tr>
                                        <th className="px-4 py-3">
                                            No. Invoice
                                        </th>
                                        <th className="px-4 py-3">
                                            Siswa & Kelas
                                        </th>
                                        <th className="px-4 py-3">
                                            Jenis Pembayaran
                                        </th>
                                        <th className="px-4 py-3">Nominal</th>
                                        <th className="px-4 py-3">
                                            Jatuh Tempo
                                        </th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {paymentList.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-[#162238]/60"
                                        >
                                            <td className="px-4 py-3 font-mono font-semibold text-blue-700 dark:text-blue-400">
                                                {p.invoiceNo}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                                {p.studentName}{' '}
                                                <span className="font-normal text-slate-400">
                                                    ({p.class})
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {p.type}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                                Rp{' '}
                                                {p.amount.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {p.dueDate}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'rounded border px-2 py-0.5 text-[10px] font-bold',
                                                        p.status === 'Lunas'
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                            : p.status ===
                                                                'Terlambat'
                                                              ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                              : 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                                                    )}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toast.success(
                                                            `Rekonsiliasi ${p.invoiceNo} berhasil diverifikasi!`,
                                                        )
                                                    }
                                                    className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
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
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                            <div>
                                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                    <Siren className="size-5 animate-pulse text-red-600" />
                                    Modul 10: Respons Insiden & Kesiapsiagaan
                                    Sekolah
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Workflow kesiapan darurat: Insiden →
                                    Aktivasi Tim → Verifikasi → Komunikasi Cepat
                                    → Respons → Pemulihan.
                                </p>
                            </div>
                            <span className="rounded-full border border-red-300 bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                                Status: Siaga Cuaca Ekstrem
                            </span>
                        </div>

                        {incidents.map((inc) => (
                            <div
                                key={inc.id}
                                className="space-y-3 rounded-xl border border-red-200 bg-slate-50/70 p-4 text-xs dark:border-red-900/60 dark:bg-[#111c30]"
                            >
                                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                            {inc.title}
                                        </h4>
                                        <div className="text-[11px] text-slate-500">
                                            Komandan Lapangan:{' '}
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {inc.leadOfficer}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toast.success(
                                                'Broadcast darurat berhasil dikirim ke seluruh staf & wali murid!',
                                            )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:scale-95"
                                    >
                                        <PhoneCall className="size-3.5" />
                                        Broadcast Peringatan Darurat
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <span className="mb-2 block text-xs font-semibold text-slate-900 dark:text-white">
                                        Checklist Evakuasi & Pengamanan:
                                    </span>
                                    <div className="space-y-2">
                                        {inc.checklist.map((chk) => (
                                            <label
                                                key={chk.id}
                                                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 transition-colors hover:bg-slate-100/60 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800/60"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={chk.done}
                                                    onChange={() =>
                                                        handleToggleChecklist(
                                                            inc.id,
                                                            chk.id,
                                                        )
                                                    }
                                                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span
                                                    className={cn(
                                                        'text-xs font-medium',
                                                        chk.done
                                                            ? 'text-slate-400 line-through'
                                                            : 'text-slate-800 dark:text-slate-200',
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
                    setFollowupNote(
                        `Tindak lanjut pemicu risiko: ${st.summary}`,
                    );
                    setIsFollowupModalOpen(true);
                }}
                onContactParent={(st) => {
                    setSelectedStudentName(`${st.studentName} (${st.class})`);
                    setSelectedStudentPhone(st.parentPhone);
                    setParentCustomMessage(
                        `Yth. Bapak/Ibu ${st.parentName}, kami dari sekolah mengonfirmasi perkembangan ananda ${st.studentName}. ${st.summary}. Mohon berkenan berkoordinasi dengan sekolah.`,
                    );
                    setIsParentContactModalOpen(true);
                }}
                onEscalateCase={(st) => {
                    setSelectedStudentName(`${st.studentName} (${st.class})`);
                    setNewCaseDesc(
                        `Eskalasi dari Early Warning: ${st.summary}`,
                    );
                    setIsNewCaseModalOpen(true);
                }}
            />

            {/* ========================================================================= */}
            {/* ACTION MODALS (PRD Principle: DATA -> ACTION) */}
            {/* ========================================================================= */}

            {/* Modal 1: Buat Follow-up Siswa */}
            {isFollowupModalOpen && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="size-4 text-amber-500" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
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

                        <form
                            onSubmit={handleSaveFollowup}
                            className="space-y-3"
                        >
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Target Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    onChange={(e) =>
                                        setSelectedStudentName(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Jenis Follow-up
                                    </label>
                                    <select
                                        value={followupType}
                                        onChange={(e) =>
                                            setFollowupType(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Panggilan Orang Tua">
                                            Panggilan Orang Tua
                                        </option>
                                        <option value="Konseling Tatap Muka BK">
                                            Konseling Tatap Muka BK
                                        </option>
                                        <option value="Home Visit (Kunjungan Rumah)">
                                            Home Visit (Kunjungan Rumah)
                                        </option>
                                        <option value="Remidial / Pembinaan Belajar">
                                            Remidial / Pembinaan Belajar
                                        </option>
                                        <option value="Perjanjian Komitmen Siswa">
                                            Perjanjian Komitmen Siswa
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Penanggung Jawab (PIC)
                                    </label>
                                    <select
                                        value={followupAssignee}
                                        onChange={(e) =>
                                            setFollowupAssignee(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Wali Kelas (Hendra Setiawan, S.Pd)">
                                            Wali Kelas (Hendra Setiawan, S.Pd)
                                        </option>
                                        <option value="Guru BK (Rahmawati, S.Pd)">
                                            Guru BK (Rahmawati, S.Pd)
                                        </option>
                                        <option value="Kesiswaan (Bpk. Faisal)">
                                            Kesiswaan (Bpk. Faisal)
                                        </option>
                                        <option value="Tim Satgas ATS">
                                            Tim Satgas ATS
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan / Rencana Tindakan
                                </label>
                                <textarea
                                    rows={3}
                                    value={followupNote}
                                    onChange={(e) =>
                                        setFollowupNote(e.target.value)
                                    }
                                    placeholder="Jelaskan langkah konkret yang akan diambil dan batas waktu tindak lanjut..."
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsFollowupModalOpen(false)
                                    }
                                    className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800"
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
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <PhoneCall className="size-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Kirim Pesan Resmi Sekolah ke Orang Tua
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsParentContactModalOpen(false)
                                }
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSendParentMessage}
                            className="space-y-3"
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Nama Siswa
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedStudentName}
                                        readOnly
                                        className="w-full rounded-lg border border-slate-300 bg-slate-100 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        WhatsApp Orang Tua
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedStudentPhone}
                                        readOnly
                                        className="w-full rounded-lg border border-slate-300 bg-slate-100 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori Pesan
                                    </label>
                                    <select
                                        value={parentCategory}
                                        onChange={(e) =>
                                            setParentCategory(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Kehadiran">
                                            Kehadiran / Keterlambatan
                                        </option>
                                        <option value="Akademik">
                                            Perkembangan Nilai & Tugas
                                        </option>
                                        <option value="Kedisiplinan">
                                            Pembinaan Perilaku & Tata Tertib
                                        </option>
                                        <option value="Pengumuman">
                                            Pengumuman & Agenda Penting
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Isi Pesan Resmi Sekolah
                                </label>
                                <textarea
                                    rows={4}
                                    value={parentCustomMessage}
                                    onChange={(e) =>
                                        setParentCustomMessage(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-[11px] leading-relaxed text-slate-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-slate-300">
                                <strong>
                                    Fitur Acknowledgement TANGGAPIN:
                                </strong>{' '}
                                Orang tua akan menerima opsi konfirmasi status
                                pembacaan (Sudah Membaca / Butuh Koordinasi
                                Lanjutan) demi kepastian informasi.
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsParentContactModalOpen(false)
                                    }
                                    className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"
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
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="size-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
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
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    onChange={(e) =>
                                        setSelectedStudentName(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori Kasus
                                    </label>
                                    <select
                                        value={newCaseCategory}
                                        onChange={(e) =>
                                            setNewCaseCategory(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Kedisiplinan">
                                            Kedisiplinan & Tata Tertib
                                        </option>
                                        <option value="Kehadiran">
                                            Kehadiran (Alpa / Bolos Berulang)
                                        </option>
                                        <option value="Akademik">
                                            Akademik & Penurunan Nilai
                                        </option>
                                        <option value="Sosial">
                                            Sosial / Konflik Pertemanan
                                        </option>
                                        <option value="Sosial & Perlindungan">
                                            Perlindungan Siswa &
                                            Anti-Perundungan
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Tingkat Prioritas
                                    </label>
                                    <select
                                        value={newCasePriority}
                                        onChange={(e) =>
                                            setNewCasePriority(
                                                e.target.value as any,
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Tinggi">
                                            Tinggi (Butuh tindakan &lt;24 jam)
                                        </option>
                                        <option value="Sedang">
                                            Sedang (Konseling terjadwal)
                                        </option>
                                        <option value="Rendah">
                                            Rendah (Pemantauan biasa)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Deskripsi Kasus & Kronologi
                                </label>
                                <textarea
                                    rows={3}
                                    value={newCaseDesc}
                                    onChange={(e) =>
                                        setNewCaseDesc(e.target.value)
                                    }
                                    placeholder="Jelaskan ringkasan peristiwa, indikasi, atau laporan saksi..."
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsNewCaseModalOpen(false)}
                                    className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800"
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
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Scale className="size-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
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

                        <form
                            onSubmit={handleCreateDiscipline}
                            className="space-y-3"
                        >
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Target Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    onChange={(e) =>
                                        setSelectedStudentName(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Jenis Pelanggaran
                                    </label>
                                    <select
                                        value={newInfraction}
                                        onChange={(e) =>
                                            setNewInfraction(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Terlambat Masuk Sekolah">
                                            Terlambat Masuk Sekolah (&gt;15
                                            menit)
                                        </option>
                                        <option value="Atribut Seragam Tidak Lengkap">
                                            Atribut Seragam Tidak Lengkap
                                        </option>
                                        <option value="Keluar Sekolah Tanpa Surat Izin">
                                            Keluar Sekolah Tanpa Surat Izin
                                        </option>
                                        <option value="Menggunakan HP di Jam Belajar">
                                            Menggunakan HP di Jam Belajar
                                        </option>
                                        <option value="Konflik Antar Siswa / Perilaku Tidak Sopan">
                                            Konflik Antar Siswa / Perilaku
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Poin Pelanggaran
                                    </label>
                                    <select
                                        value={newPoints}
                                        onChange={(e) =>
                                            setNewPoints(Number(e.target.value))
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value={5}>
                                            5 Poin (Ringan)
                                        </option>
                                        <option value={10}>
                                            10 Poin (Sedang)
                                        </option>
                                        <option value={15}>
                                            15 Poin (Perhatian Khusus)
                                        </option>
                                        <option value={25}>
                                            25 Poin (Berat / Konseling BK)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan Pola & Rencana Tindakan Restoratif
                                </label>
                                <textarea
                                    rows={3}
                                    value={newDisciplineNotes}
                                    onChange={(e) =>
                                        setNewDisciplineNotes(e.target.value)
                                    }
                                    placeholder="Jelaskan tindakan pembinaan karakter yang disepakati bersama siswa..."
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsDisciplineModalOpen(false)
                                    }
                                    className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800"
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
