import { Head, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    PhoneCall,
    Plus,
    RefreshCw,
    Scale,
    ShieldAlert,
    Siren,
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

    // Filter state
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
        'Brian Aditya - XI RPL 2',
    );
    const [selectedStudentPhone, setSelectedStudentPhone] =
        useState('+62 812-3456-7890');
    const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
    const [selectedStudent360, setSelectedStudent360] =
        useState<PriorityAlert | null>(null);

    // Follow-up form
    const [followupType, setFollowupType] = useState('Panggilan Orang Tua');
    const [followupAssignee, setFollowupAssignee] = useState(
        'Wali Kelas - Hendra Setiawan, S.Pd',
    );
    const [followupNote, setFollowupNote] = useState('');

    // Parent contact form
    const [parentCategory, setParentCategory] = useState('Kehadiran');
    const [parentCustomMessage, setParentCustomMessage] = useState(
        'Yth. Bapak/Ibu, kami menginformasikan catatan kehadiran ananda yang memerlukan koordinasi bersama sekolah.',
    );

    // New case form
    const [caseCategory, setCaseCategory] = useState('Kedisiplinan');
    const [casePriority, setCasePriority] = useState<
        'Tinggi' | 'Sedang' | 'Rendah'
    >('Tinggi');
    const [caseActivity, setCaseActivity] = useState('');

    // Discipline form
    const [newInfraction, setNewInfraction] = useState(
        'Terlambat Masuk Sekolah',
    );
    const [newPoints, setNewPoints] = useState(10);
    const [newDisciplineNotes, setNewDisciplineNotes] = useState('');

    // Role greetings without parentheses
    const roleGreetings: Record<RoleType, { title: string; subtitle: string }> =
        {
            kepala_sekolah: {
                title: 'Kepala Sekolah',
                subtitle:
                    'Pantau kondisi operasional dan arahan tindak lanjut hari ini.',
            },
            wali_kelas: {
                title: 'Wali Kelas XI RPL 2',
                subtitle:
                    'Deteksi sinyal siswa dan lakukan pendampingan segera.',
            },
            guru_bk: {
                title: 'Guru Bimbingan Konseling',
                subtitle: 'Kelola alur kasus siswa dan sesi konseling terarah.',
            },
            bendahara: {
                title: 'Bendahara Sekolah',
                subtitle:
                    'Pantau status pembayaran SPP dan verifikasi tagihan.',
            },
            operator: {
                title: 'Operator Dapodik',
                subtitle:
                    'Validasi data pokok dan anomali sebelum batas sinkronisasi.',
            },
        };

    // Open Student 360 modal
    const handleOpenStudent360 = (alert: PriorityAlert) => {
        setSelectedStudent360(alert);
        setIsStudent360Open(true);
    };

    // Quick action trigger
    const handleTriggerQuickAction = (
        actionType: string,
        studentName?: string,
        studentId?: string,
    ) => {
        if (studentName) setSelectedStudentName(studentName);
        if (studentId) setSelectedStudentId(studentId);

        if (actionType === 'followup') setIsFollowupModalOpen(true);
        else if (actionType === 'parent') setIsParentContactModalOpen(true);
        else if (actionType === 'case') setIsNewCaseModalOpen(true);
        else if (actionType === 'discipline') setIsDisciplineModalOpen(true);
    };

    // Submit Follow-up to database
    const handleCreateFollowup = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/followups',
            {
                student_id: selectedStudentId,
                type: followupType,
                assignee_name: followupAssignee,
                note: followupNote || 'Tindak lanjut pendampingan siswa',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Tindak lanjut berhasil dicatat.');
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
                    toast.error('Gagal mencatat tindak lanjut.');
                },
            },
        );
    };

    // Submit Parent Message to database
    const handleSendParentMessage = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/parent-communications',
            {
                student_id: selectedStudentId,
                category: parentCategory,
                message: parentCustomMessage,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Pesan resmi terkirim ke orang tua.');
                    setIsParentContactModalOpen(false);
                    setParentUpdates((prev) => [
                        {
                            id: String(Date.now()),
                            studentName: selectedStudentName,
                            parentName: 'Wali Murid',
                            category: parentCategory,
                            status: 'Terkirim',
                            acknowledgement: 'Sudah membaca',
                            date: 'Hari ini',
                            message: parentCustomMessage,
                        },
                        ...prev,
                    ]);
                },
                onError: () => {
                    toast.error('Gagal mengirim pesan.');
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
                student_id: selectedStudentId,
                category: caseCategory,
                priority: casePriority,
                last_activity:
                    caseActivity || 'Laporan baru diterima oleh pihak sekolah.',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Kasus baru berhasil dibuka.');
                    setIsNewCaseModalOpen(false);
                    setCaseActivity('');
                    setStats((prev) => ({
                        ...prev,
                        activeCases: prev.activeCases + 1,
                    }));
                    setCases((prev) => [
                        {
                            id: String(Date.now()),
                            code: `CS-2025-${String(prev.length + 90).padStart(3, '0')}`,
                            studentName: selectedStudentName,
                            class: 'XI RPL 2',
                            category: caseCategory,
                            priority: casePriority,
                            stage: 'new',
                            stageLabel: 'Baru Masuk',
                            assignee: 'Guru BK',
                            lastActivity: caseActivity || 'Laporan baru masuk.',
                            lastUpdate: 'Baru saja',
                            timeline: [
                                {
                                    time: 'Hari ini',
                                    title: 'Laporan Kasus Diterima',
                                    actor: 'Wali Kelas',
                                },
                            ],
                        },
                        ...prev,
                    ]);
                },
                onError: () => {
                    toast.error('Gagal membuka kasus baru.');
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
                student_id: selectedStudentId,
                infraction: newInfraction,
                points: newPoints,
                pattern_notes:
                    newDisciplineNotes || 'Pencatatan pembinaan kedisiplinan',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Catatan kedisiplinan tersimpan.');
                    setIsDisciplineModalOpen(false);
                    setNewDisciplineNotes('');
                    setDisciplineList((prev) => [
                        {
                            id: String(Date.now()),
                            studentId: selectedStudentId,
                            studentName: selectedStudentName,
                            class: 'XI RPL 2',
                            infraction: newInfraction,
                            points: newPoints,
                            actionStatus: 'Pembinaan Mandiri',
                            patternNotes:
                                newDisciplineNotes ||
                                'Pencatatan kedisiplinan berkala',
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

    // Toggle checklist on incident
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
        toast.success('Status checklist diperbarui.');
    };

    // Filtered Priority Feed
    const filteredPriorityFeed = priorityFeed.filter((item) => {
        if (feedRiskFilter === 'high') return item.riskLevel === 'high';
        if (feedRiskFilter === 'medium') return item.riskLevel === 'medium';
        return true;
    });

    return (
        <FlowbiteTanggapinLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            onTriggerActionModal={handleTriggerQuickAction}
        >
            <Head title="Dashboard Operasional - Tanggapin" />

            <div className="space-y-8">
                {/* 1. Header & Role Greeting */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-blue-600" />
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                SMK Negeri 1 Harapan • Semester Ganjil
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Selamat Datang, {roleGreetings[currentRole].title}
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {roleGreetings[currentRole].subtitle}
                        </p>
                    </div>

                    {/* Simple Role Selector Pills */}
                    <div className="flex flex-wrap items-center gap-2">
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
                                    'rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all',
                                    currentRole === r
                                        ? 'bg-blue-700 font-semibold text-white shadow-xs'
                                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                {r === 'kepala_sekolah' && 'Kepala Sekolah'}
                                {r === 'wali_kelas' && 'Wali Kelas'}
                                {r === 'guru_bk' && 'Guru BK'}
                                {r === 'bendahara' && 'Bendahara'}
                                {r === 'operator' && 'Operator'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Key Operational Metrics Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {/* Perlu Perhatian */}
                    <div className="space-y-2 rounded-2xl border border-red-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-red-950 dark:bg-[#111c30]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Perlu Perhatian
                            </span>
                            <span className="size-2 rounded-full bg-red-500" />
                        </div>
                        <div className="text-3xl font-extrabold text-red-600 dark:text-red-400">
                            {stats.studentsNeedingAttention}
                        </div>
                        <div className="text-xs text-slate-500">
                            Siswa butuh tindakan
                        </div>
                    </div>

                    {/* Kasus Aktif */}
                    <div className="space-y-2 rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-amber-950 dark:bg-[#111c30]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Kasus Aktif
                            </span>
                            <span className="size-2 rounded-full bg-amber-500" />
                        </div>
                        <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                            {stats.activeCases}
                        </div>
                        <div className="text-xs text-slate-500">
                            Dalam penanganan BK
                        </div>
                    </div>

                    {/* Cek Data Dapodik */}
                    <div className="space-y-2 rounded-2xl border border-blue-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-blue-950 dark:bg-[#111c30]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Validasi Data
                            </span>
                            <span className="size-2 rounded-full bg-blue-500" />
                        </div>
                        <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                            {stats.dataCheckIssues}
                        </div>
                        <div className="text-xs text-slate-500">
                            Perlu diperiksa
                        </div>
                    </div>

                    {/* SPP & Tagihan */}
                    <div className="space-y-2 rounded-2xl border border-purple-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-purple-950 dark:bg-[#111c30]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Tagihan Jatuh Tempo
                            </span>
                            <span className="size-2 rounded-full bg-purple-500" />
                        </div>
                        <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                            {stats.duePayments}
                        </div>
                        <div className="text-xs text-slate-500">
                            Menunggu verifikasi
                        </div>
                    </div>

                    {/* Selesai & Tuntas */}
                    <div className="space-y-2 rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-emerald-950 dark:bg-[#111c30]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Selesai Tuntas
                            </span>
                            <span className="size-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {stats.resolvedThisMonth}
                        </div>
                        <div className="text-xs text-slate-500">
                            Penanganan tuntas
                        </div>
                    </div>
                </div>

                {/* 3. Quick Actions - Friendly Action Buttons */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <button
                        type="button"
                        onClick={() => handleTriggerQuickAction('followup')}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-xs transition-all hover:border-blue-300 hover:shadow-md active:scale-98 dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400">
                            <Plus className="size-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Tindak Lanjut
                            </div>
                            <div className="text-[11px] text-slate-500">
                                Catat pembinaan
                            </div>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTriggerQuickAction('parent')}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-xs transition-all hover:border-emerald-300 hover:shadow-md active:scale-98 dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400">
                            <PhoneCall className="size-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Hubungi Ortu
                            </div>
                            <div className="text-[11px] text-slate-500">
                                Kirim pesan resmi
                            </div>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTriggerQuickAction('case')}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-xs transition-all hover:border-amber-300 hover:shadow-md active:scale-98 dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400">
                            <ShieldAlert className="size-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Kasus Baru
                            </div>
                            <div className="text-[11px] text-slate-500">
                                Rujuk ke guru BK
                            </div>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTriggerQuickAction('discipline')}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-xs transition-all hover:border-purple-300 hover:shadow-md active:scale-98 dark:border-slate-800 dark:bg-[#0f172a]"
                    >
                        <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/70 dark:text-purple-400">
                            <Scale className="size-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Catat Disiplin
                            </div>
                            <div className="text-[11px] text-slate-500">
                                Poin tata tertib
                            </div>
                        </div>
                    </button>
                </div>

                {/* 4. Tab Navigation Bar */}
                <div className="border-b border-slate-200 dark:border-slate-800">
                    <ul className="-mb-px flex flex-wrap gap-2 text-xs font-semibold">
                        {[
                            { id: 'overview', label: 'Ringkasan' },
                            {
                                id: 'early-warning',
                                label: 'Peringatan Dini',
                                count: filteredPriorityFeed.length,
                            },
                            { id: 'class-monitoring', label: 'Pantauan Kelas' },
                            {
                                id: 'cases',
                                label: 'Kasus Siswa',
                                count: cases.length,
                            },
                            {
                                id: 'communication',
                                label: 'Pesan Orang Tua',
                                count: parentUpdates.length,
                            },
                            {
                                id: 'data-check',
                                label: 'Validasi & Tagihan',
                                count: dapodikIssues.length,
                            },
                            { id: 'incidents', label: 'Respons Insiden' },
                        ].map((tab) => (
                            <li key={tab.id}>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'inline-flex items-center gap-2 border-b-2 px-4 py-3 whitespace-nowrap transition-colors',
                                        activeTab === tab.id
                                            ? 'border-blue-700 font-bold text-blue-700 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                                    )}
                                >
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && (
                                        <span
                                            className={cn(
                                                'rounded-full px-2 py-0.5 text-[11px] font-bold',
                                                activeTab === tab.id
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 5. TAB CONTENT - CLEAN & SPACIOUS */}

                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Section A: Priority Early Warning Feed */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Peringatan Dini Siswa
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Siswa yang terdeteksi membutuhkan
                                        perhatian segera.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFeedRiskFilter('all')}
                                        className={cn(
                                            'rounded-lg px-3 py-1.5 text-xs font-medium',
                                            feedRiskFilter === 'all'
                                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400',
                                        )}
                                    >
                                        Semua
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFeedRiskFilter('high')
                                        }
                                        className={cn(
                                            'rounded-lg px-3 py-1.5 text-xs font-medium',
                                            feedRiskFilter === 'high'
                                                ? 'bg-red-600 text-white'
                                                : 'text-slate-600 hover:bg-red-50 hover:text-red-700 dark:text-slate-400',
                                        )}
                                    >
                                        Kritis 3
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFeedRiskFilter('medium')
                                        }
                                        className={cn(
                                            'rounded-lg px-3 py-1.5 text-xs font-medium',
                                            feedRiskFilter === 'medium'
                                                ? 'bg-amber-600 text-white'
                                                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700 dark:text-slate-400',
                                        )}
                                    >
                                        Perhatian 1
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {filteredPriorityFeed.map((alert) => {
                                    const isHigh = alert.riskLevel === 'high';
                                    return (
                                        <div
                                            key={alert.id}
                                            className={cn(
                                                'flex flex-col justify-between gap-4 rounded-xl border p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center',
                                                isHigh
                                                    ? 'border-red-200 bg-red-50/40 dark:border-red-950 dark:bg-red-950/20'
                                                    : 'border-amber-200 bg-amber-50/40 dark:border-amber-950 dark:bg-amber-950/20',
                                            )}
                                        >
                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {alert.studentName} -{' '}
                                                        {alert.class}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                                                            isHigh
                                                                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                                                        )}
                                                    >
                                                        {alert.triggerType}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        {alert.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                                    {alert.summary}
                                                </p>
                                                <div className="text-[11px] text-slate-500">
                                                    Wali:{' '}
                                                    {alert.homeroomTeacher} •
                                                    Ortu: {alert.parentName}
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-wrap items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStudentName(
                                                            `${alert.studentName} - ${alert.class}`,
                                                        );
                                                        setSelectedStudentId(
                                                            alert.studentId,
                                                        );
                                                        setSelectedAlertId(
                                                            alert.id,
                                                        );
                                                        setIsFollowupModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-800"
                                                >
                                                    <Plus className="size-3.5" />
                                                    Tindak Lanjut
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStudentName(
                                                            `${alert.studentName} - ${alert.class}`,
                                                        );
                                                        setSelectedStudentPhone(
                                                            alert.parentPhone,
                                                        );
                                                        setSelectedStudentId(
                                                            alert.studentId,
                                                        );
                                                        setIsParentContactModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                                >
                                                    <PhoneCall className="size-3.5 text-emerald-600" />
                                                    Hubungi Ortu
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenStudent360(
                                                            alert,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                    title="Lihat Detail Siswa"
                                                >
                                                    <Eye className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section B: Class Monitoring Cards */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Kondisi Kelas Terkini
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Tingkat kehadiran dan status pemantauan
                                        per kelas.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab('class-monitoring')
                                    }
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                >
                                    Lihat Selengkapnya
                                    <ArrowRight className="size-3" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {classes.map((cls) => (
                                    <div
                                        key={cls.id}
                                        className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {cls.name}
                                            </span>
                                            <span
                                                className={cn(
                                                    'rounded-full px-2 py-0.5 text-[10px] font-bold',
                                                    cls.healthStatus ===
                                                        'critical'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                        : cls.healthStatus ===
                                                            'warning'
                                                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                                                )}
                                            >
                                                {cls.healthStatus === 'critical'
                                                    ? 'Kritis'
                                                    : cls.healthStatus ===
                                                        'warning'
                                                      ? 'Perhatian'
                                                      : 'Baik'}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            {cls.major} • Wali:{' '}
                                            {cls.homeroomTeacher}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-slate-500">
                                                    Kehadiran
                                                </span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {cls.attendanceRate}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                <div
                                                    className={cn(
                                                        'h-full rounded-full',
                                                        cls.attendanceRate < 90
                                                            ? 'bg-red-500'
                                                            : 'bg-blue-600',
                                                    )}
                                                    style={{
                                                        width: `${cls.attendanceRate}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                                            <span>
                                                {cls.totalStudents} Siswa
                                            </span>
                                            <span className="font-semibold text-amber-600">
                                                {cls.studentsAtRisk} Siswa
                                                Berisiko
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section C: Cases Pipeline Snapshot */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Kasus Siswa Aktif
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Penanganan kasus kolaboratif guru BK dan
                                        wali kelas.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('cases')}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline dark:text-blue-400"
                                >
                                    Semua Kasus
                                    <ArrowRight className="size-3" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {cases.slice(0, 3).map((c) => (
                                    <div
                                        key={c.id}
                                        className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs font-bold text-blue-600">
                                                {c.code}
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {c.stageLabel}
                                            </span>
                                        </div>
                                        <div className="font-bold text-slate-900 dark:text-white">
                                            {c.studentName} - {c.class}
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300">
                                            {c.lastActivity}
                                        </p>
                                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                                            <span>PIC: {c.assignee}</span>
                                            <span>{c.lastUpdate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: EARLY WARNING */}
                {activeTab === 'early-warning' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Peringatan Dini Siswa
                            </h2>
                            <p className="text-xs text-slate-500">
                                Deteksi dini pola absensi, penurunan nilai, dan
                                catatan perilaku siswa.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {filteredPriorityFeed.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/50"
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {alert.studentName} -{' '}
                                                {alert.class}
                                            </span>
                                            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                                                {alert.triggerType}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300">
                                            {alert.summary}
                                        </p>
                                        <div className="text-[11px] text-slate-400">
                                            Saran: {alert.suggestedAction} •
                                            Terdeteksi {alert.timestamp}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedStudentName(
                                                    `${alert.studentName} - ${alert.class}`,
                                                );
                                                setSelectedStudentId(
                                                    alert.studentId,
                                                );
                                                setIsFollowupModalOpen(true);
                                            }}
                                            className="rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                                        >
                                            Tindak Lanjut
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleOpenStudent360(alert)
                                            }
                                            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                        >
                                            Profil Siswa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB: CLASS MONITORING */}
                {activeTab === 'class-monitoring' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Kondisi Kelas Terkini
                            </h2>
                            <p className="text-xs text-slate-500">
                                Ringkasan kesehatan seluruh rombongan belajar
                                sekolah.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {classes.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="space-y-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">
                                                {cls.name}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {cls.major}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
                                            {cls.totalStudents} Siswa
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-300">
                                        Wali Kelas:{' '}
                                        <strong>{cls.homeroomTeacher}</strong>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">
                                                Rata-rata Kehadiran
                                            </span>
                                            <span className="font-bold">
                                                {cls.attendanceRate}%
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-blue-600"
                                                style={{
                                                    width: `${cls.attendanceRate}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-xs font-semibold text-amber-600">
                                        {cls.studentsAtRisk} siswa membutuhkan
                                        pendampingan
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB: CASES */}
                {activeTab === 'cases' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Manajemen Kasus Siswa
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Daftar kasus aktif dan tahapan penanganan
                                    terkoordinasi.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNewCaseModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                            >
                                <Plus className="size-3.5" />
                                Buka Kasus Baru
                            </button>
                        </div>

                        <div className="space-y-3">
                            {cases.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/50"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-blue-600">
                                                {c.code}
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {c.studentName} - {c.class}
                                            </span>
                                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold dark:bg-slate-800">
                                                {c.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300">
                                            {c.lastActivity}
                                        </p>
                                        <div className="text-[11px] text-slate-400">
                                            PIC: {c.assignee} • Pembaruan:{' '}
                                            {c.lastUpdate}
                                        </div>
                                    </div>
                                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        {c.stageLabel}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB: COMMUNICATION */}
                {activeTab === 'communication' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Pesan Resmi Orang Tua
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Komunikasi resmi sekolah dengan konfirmasi
                                    tanda terima.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsParentContactModalOpen(true)
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                            >
                                <Plus className="size-3.5" />
                                Kirim Pesan
                            </button>
                        </div>

                        <div className="space-y-3">
                            {parentUpdates.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Kepada: {msg.studentName}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            {msg.date}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                        {msg.message}
                                    </p>
                                    <div className="flex items-center justify-between pt-1 text-[11px]">
                                        <span className="text-slate-500">
                                            Kategori: {msg.category}
                                        </span>
                                        <span className="font-semibold text-emerald-600">
                                            Status: {msg.acknowledgement}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB: DATA & VALIDATION */}
                {activeTab === 'data-check' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Validasi Dapodik */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Validasi Data Dapodik
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Pemeriksaan anomali data sebelum
                                        sinkronisasi.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        toast.success(
                                            'Validasi data berhasil diperbarui.',
                                        )
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                >
                                    <RefreshCw className="size-3" />
                                    Cek Ulang
                                </button>
                            </div>

                            <div className="space-y-3">
                                {dapodikIssues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="space-y-1 rounded-xl border border-slate-200 p-3.5 text-xs dark:border-slate-800"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {issue.targetName}
                                            </span>
                                            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                                {issue.severity}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300">
                                            {issue.description}
                                        </p>
                                        <div className="text-[11px] text-blue-600">
                                            Tindakan: {issue.action}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SPP & Tagihan */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Tagihan & SPP Siswa
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Daftar status pembayaran administrasi
                                    sekolah.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {paymentList.map((pay) => (
                                    <div
                                        key={pay.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 text-xs dark:border-slate-800"
                                    >
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {pay.studentName} - {pay.class}
                                            </div>
                                            <div className="text-slate-500">
                                                {pay.type} • Jatuh tempo{' '}
                                                {pay.dueDate}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                Rp{' '}
                                                {pay.amount.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </div>
                                            <span className="text-[10px] font-semibold text-amber-600">
                                                {pay.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pantauan Lapangan ATS */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2 dark:border-slate-800 dark:bg-[#0f172a]">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Pantauan Lapangan ATS
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Verifikasi siswa rentan putus sekolah dan
                                    jadwal kunjungan lapangan.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {atsList.map((ats) => (
                                    <div
                                        key={ats.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 text-xs dark:border-slate-800"
                                    >
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {ats.studentName} -{' '}
                                                {ats.lastClass}
                                            </div>
                                            <div className="text-slate-500">
                                                Petugas: {ats.officer} •
                                                Kunjungan: {ats.scheduledVisit}
                                            </div>
                                            <div className="text-[11px] text-amber-600">
                                                Alasan: {ats.reason}
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                            {ats.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: INCIDENTS */}
                {activeTab === 'incidents' && (
                    <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Protokol Respons Insiden
                            </h2>
                            <p className="text-xs text-slate-500">
                                Alur tindakan darurat dan kesiapsiagaan
                                operasional sekolah.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {incidents.map((inc) => (
                                <div
                                    key={inc.id}
                                    className="space-y-4 rounded-xl border border-red-200 bg-red-50/30 p-5 dark:border-red-950 dark:bg-red-950/20"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Siren className="size-5 text-red-600" />
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {inc.title} - Level {inc.level}
                                            </span>
                                        </div>
                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                                            Status: {inc.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                        Petugas Penanggung Jawab:{' '}
                                        <strong>{inc.leadOfficer}</strong>
                                    </p>

                                    <div className="space-y-2 border-t border-red-200/60 pt-3 dark:border-red-900">
                                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                                            Checklist Tindakan:
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {inc.checklist.map((chk) => (
                                                <button
                                                    key={chk.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleChecklist(
                                                            inc.id,
                                                            chk.id,
                                                        )
                                                    }
                                                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 text-left text-xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                                                >
                                                    <span
                                                        className={cn(
                                                            'flex size-4 items-center justify-center rounded border',
                                                            chk.done
                                                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                                                : 'border-slate-300',
                                                        )}
                                                    >
                                                        {chk.done && (
                                                            <CheckCircle2 className="size-3" />
                                                        )}
                                                    </span>
                                                    <span
                                                        className={
                                                            chk.done
                                                                ? 'text-slate-400 line-through'
                                                                : 'text-slate-700 dark:text-slate-200'
                                                        }
                                                    >
                                                        {chk.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL 1: TINDAK LANJUT */}
            {isFollowupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Catat Tindak Lanjut Siswa
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsFollowupModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={handleCreateFollowup}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    readOnly
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Bentuk Tindakan
                                    </label>
                                    <select
                                        value={followupType}
                                        onChange={(e) =>
                                            setFollowupType(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        <option value="Panggilan Orang Tua">
                                            Panggilan Orang Tua
                                        </option>
                                        <option value="Konseling Individu">
                                            Konseling Individu
                                        </option>
                                        <option value="Home Visit">
                                            Kunjungan Rumah
                                        </option>
                                        <option value="Bimbingan Belajar">
                                            Bimbingan Belajar
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Penanggung Jawab
                                    </label>
                                    <input
                                        type="text"
                                        value={followupAssignee}
                                        onChange={(e) =>
                                            setFollowupAssignee(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan Rencana Tindakan
                                </label>
                                <textarea
                                    rows={3}
                                    value={followupNote}
                                    onChange={(e) =>
                                        setFollowupNote(e.target.value)
                                    }
                                    placeholder="Tuliskan catatan pendampingan dan komitmen..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsFollowupModalOpen(false)
                                    }
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                                >
                                    Simpan Tindak Lanjut
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: HUBUNGI ORANG TUA */}
            {isParentContactModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Kirim Pesan ke Orang Tua
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsParentContactModalOpen(false)
                                }
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSendParentMessage}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Nama Siswa
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedStudentName}
                                        readOnly
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        WhatsApp Orang Tua
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedStudentPhone}
                                        readOnly
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori
                                    </label>
                                    <select
                                        value={parentCategory}
                                        onChange={(e) =>
                                            setParentCategory(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        <option value="Kehadiran">
                                            Kehadiran
                                        </option>
                                        <option value="Akademik">
                                            Akademik
                                        </option>
                                        <option value="Kedisiplinan">
                                            Kedisiplinan
                                        </option>
                                        <option value="Administrasi">
                                            Administrasi
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Isi Pesan Resmi
                                </label>
                                <textarea
                                    rows={4}
                                    value={parentCustomMessage}
                                    onChange={(e) =>
                                        setParentCustomMessage(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsParentContactModalOpen(false)
                                    }
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                                >
                                    Kirim Pesan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: KASUS BARU */}
            {isNewCaseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Buka Kasus Siswa Baru
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsNewCaseModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCase} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    readOnly
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori Masalah
                                    </label>
                                    <select
                                        value={caseCategory}
                                        onChange={(e) =>
                                            setCaseCategory(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        <option value="Kedisiplinan">
                                            Kedisiplinan
                                        </option>
                                        <option value="Kehadiran">
                                            Kehadiran
                                        </option>
                                        <option value="Akademik">
                                            Akademik
                                        </option>
                                        <option value="Sosial">
                                            Sosial & Pergaulan
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Prioritas Penanganan
                                    </label>
                                    <select
                                        value={casePriority}
                                        onChange={(e) =>
                                            setCasePriority(
                                                e.target.value as
                                                    | 'Tinggi'
                                                    | 'Sedang'
                                                    | 'Rendah',
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        <option value="Tinggi">Tinggi</option>
                                        <option value="Sedang">Sedang</option>
                                        <option value="Rendah">Rendah</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Uraian Awal Kasus
                                </label>
                                <textarea
                                    rows={3}
                                    value={caseActivity}
                                    onChange={(e) =>
                                        setCaseActivity(e.target.value)
                                    }
                                    placeholder="Jelaskan ringkasan laporan awal kasus..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsNewCaseModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                                >
                                    Buka Kasus
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 4: CATAT DISIPLIN */}
            {isDisciplineModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Catat Kedisiplinan Siswa
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsDisciplineModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={handleCreateDiscipline}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    readOnly
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Jenis Pelanggaran
                                    </label>
                                    <select
                                        value={newInfraction}
                                        onChange={(e) =>
                                            setNewInfraction(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    >
                                        <option value="Terlambat Masuk Sekolah">
                                            Terlambat Masuk Sekolah
                                        </option>
                                        <option value="Atribut Tidak Lengkap">
                                            Atribut Tidak Lengkap
                                        </option>
                                        <option value="Meninggalkan Kelas">
                                            Meninggalkan Kelas
                                        </option>
                                        <option value="Pelanggaran Tata Tertib">
                                            Pelanggaran Tata Tertib
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Poin
                                    </label>
                                    <input
                                        type="number"
                                        value={newPoints}
                                        onChange={(e) =>
                                            setNewPoints(Number(e.target.value))
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan Pembinaan
                                </label>
                                <textarea
                                    rows={3}
                                    value={newDisciplineNotes}
                                    onChange={(e) =>
                                        setNewDisciplineNotes(e.target.value)
                                    }
                                    placeholder="Catat komitmen siswa dan arahan pembina..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsDisciplineModalOpen(false)
                                    }
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                                >
                                    Simpan Catatan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 5: PROFIL SISWA 360 */}
            <Student360Modal
                isOpen={isStudent360Open}
                onClose={() => setIsStudent360Open(false)}
                student={selectedStudent360}
                onFollowUp={(student) => {
                    setSelectedStudentName(
                        `${student.studentName} - ${student.class}`,
                    );
                    setSelectedStudentId(student.studentId);
                    setSelectedAlertId(student.id);
                    setIsFollowupModalOpen(true);
                }}
                onContactParent={(student) => {
                    setSelectedStudentName(
                        `${student.studentName} - ${student.class}`,
                    );
                    setSelectedStudentPhone(student.parentPhone);
                    setSelectedStudentId(student.studentId);
                    setIsParentContactModalOpen(true);
                }}
                onEscalateCase={(student) => {
                    setSelectedStudentName(
                        `${student.studentName} - ${student.class}`,
                    );
                    setSelectedStudentId(student.studentId);
                    setIsNewCaseModalOpen(true);
                }}
            />
        </FlowbiteTanggapinLayout>
    );
}
