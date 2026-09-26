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
    ShieldCheck,
    Siren,
    Sparkles,
    TrendingDown,
    TrendingUp,
    UploadCloud,
    UserCheck,
    UserX,
    Users,
    WalletCards,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { ROLE_CONFIGS } from '@/lib/role-config';
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
    const [stats] = useState(initialStats || {
        studentsNeedingAttention: 12,
        activeCases: 4,
        overdueCases: 2,
        dataCheckIssues: 7,
        duePayments: 18,
        activeIncidents: 1,
        resolvedThisMonth: 24,
    });
    const [priorityFeed, setPriorityFeed] = useState<PriorityAlert[]>(initialPriorityFeed || []);
    const [cases, setCases] = useState<CaseItem[]>(initialCases || []);
    const [incidents, setIncidents] = useState<IncidentItem[]>(initialIncidents || []);
    const [parentUpdates, setParentUpdates] = useState<ParentUpdate[]>(initialParentUpdates || []);
    const [classes, setClasses] = useState<ClassMonitoringItem[]>(initialClasses || []);
    const [atsList, setAtsList] = useState<AtsItem[]>(initialAtsList || []);
    const [paymentList, setPaymentList] = useState<PaymentItem[]>(initialPaymentList || []);
    const [dapodikIssues, setDapodikIssues] = useState<DapodikIssue[]>(initialDapodikIssues || []);
    const [documents] = useState<TeacherDocument[]>(initialDocuments || []);
    const [disciplineList, setDisciplineList] = useState<DisciplineRecordItem[]>(initialDisciplineList || [
        {
            id: '1',
            studentId: '2',
            studentName: 'Ahmad Fauzan',
            class: 'X TKJ 1',
            infraction: 'Terlambat Masuk Sekolah (>15 menit)',
            points: 15,
            actionStatus: 'Sudah Dibina',
            patternNotes: 'Terjadi 3x berurutan pada jam pertama hari Senin & Selasa.',
            recordedAt: '23 Sep 2025',
        },
        {
            id: '2',
            studentId: '1',
            studentName: 'Brian Aditya',
            class: 'XI RPL 2',
            infraction: 'Keluar Area Sekolah Tanpa Surat Izin',
            points: 20,
            actionStatus: 'Menunggu Pembinaan',
            patternNotes: 'Terpantau satpam saat jam istirahat kedua.',
            recordedAt: '24 Sep 2025',
        },
        {
            id: '3',
            studentId: '4',
            studentName: 'Deni Saputra',
            class: 'XI TKR 3',
            infraction: 'Atribut Seragam Tidak Lengkap',
            points: 5,
            actionStatus: 'Tindakan Restoratif Selesai',
            patternNotes: 'Telah membantu perapian perpustakaan sebagai bentuk komitmen.',
            recordedAt: '22 Sep 2025',
        },
    ]);

    // Modals
    const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
    const [isParentContactModalOpen, setIsParentContactModalOpen] = useState(false);
    const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
    const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);

    const [selectedStudentId, setSelectedStudentId] = useState<string>('1');
    const [selectedStudentName, setSelectedStudentName] = useState('Brian Aditya (XI RPL 2)');
    const [selectedStudentPhone, setSelectedStudentPhone] = useState('+62 812-3456-7890');
    const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

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

    // Search & Filter state for modules
    const [earlyWarningSearch, setEarlyWarningSearch] = useState('');
    const [earlyWarningRiskFilter, setEarlyWarningRiskFilter] = useState('all');
    const [documentCategoryFilter, setDocumentCategoryFilter] = useState('all');

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
                note: followupNote,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Follow-up untuk ${selectedStudentName} berhasil disimpan di database!`);
                    setIsFollowupModalOpen(false);
                    setFollowupNote('');
                    if (selectedAlertId) {
                        setPriorityFeed((prev) =>
                            prev.map((item) =>
                                item.id === selectedAlertId ? { ...item, actionTaken: true } : item
                            )
                        );
                    }
                },
                onError: () => {
                    toast.error('Gagal menyimpan follow-up.');
                },
            }
        );
    };

    // Submit Parent Message to database
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
                    toast.success(`Pesan terstruktur berhasil dikirim ke orang tua ${selectedStudentName}!`);
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
                    toast.error('Gagal mengirim pesan.');
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
                last_activity: newCaseDesc || 'Kasus baru dibuat dan menunggu verifikasi BK.',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Kasus baru untuk ${selectedStudentName} berhasil didaftarkan di database!`);
                    setIsNewCaseModalOpen(false);
                    setNewCaseDesc('');
                },
                onError: () => {
                    toast.error('Gagal mendaftarkan kasus.');
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
        toast.info('Status checklist kesiapsiagaan diperbarui.');
    };

    // Metadata for each view
    const tabMeta: Record<string, { title: string; badge: string; desc: string }> = {
        'overview': {
            badge: 'Komando Utama',
            title: 'Ikhtisar & Tindakan Operasional',
            desc: 'Pusat pantauan harian dan penugasan tindakan prioritas sekolah.',
        },
        'early-warning': {
            badge: 'Modul 01',
            title: 'Early Warning (Sistem Peringatan Dini)',
            desc: 'Deteksi pemicu risiko siswa lebih awal sebelum berkembang menjadi masalah besar.',
        },
        'class-monitoring': {
            badge: 'Modul 02',
            title: 'Kondisi Kelas (Class Health Index)',
            desc: 'Pemantauan iklim belajar dan deteksi rombel yang membutuhkan intervensi sistemik.',
        },
        'cases': {
            badge: 'Modul 03',
            title: 'Manajemen Kasus & Alur Timeline BK',
            desc: 'Workflow penanganan kasus terstruktur: Masuk → Ditugaskan → Penanganan → Follow-up → Selesai.',
        },
        'discipline': {
            badge: 'Modul 05',
            title: 'Kedisiplinan & Poin Berkeadilan',
            desc: 'Pencatatan pelanggaran berbasis pembinaan dan tindakan restoratif, bukan sekadar hukuman.',
        },
        'communication': {
            badge: 'Modul 04',
            title: 'Komunikasi Orang Tua & Tanda Terima',
            desc: 'Penyampaian informasi resmi sekolah dengan konfirmasi tanda terima terverifikasi.',
        },
        'ats': {
            badge: 'Modul 06',
            title: 'Alur Lapangan ATS (Anak Tidak Sekolah)',
            desc: 'Penjangkauan lapangan dan home visit bagi siswa rentan putus sekolah.',
        },
        'payments': {
            badge: 'Modul 07',
            title: 'Pembayaran SPP & Skema Keringanan',
            desc: 'Rekonsiliasi iuran sekolah secara humanis tanpa mempermalukan siswa.',
        },
        'documents': {
            badge: 'Modul 08',
            title: 'Dokumen Kinerja Guru & Administrasi',
            desc: 'Repositori terpusat SK Tugas, Modul Ajar Kurikulum Merdeka, dan Sertifikasi.',
        },
        'data-check': {
            badge: 'Modul 09',
            title: 'Cek Data & Validasi Anomali Dapodik',
            desc: 'Audit inkonsistensi data guru, siswa, dan rombel sebelum batas cut-off resmi.',
        },
        'incidents': {
            badge: 'Modul 10',
            title: 'Respons Insiden & Kedaruratan Sekolah',
            desc: 'Pusat komando kesiapsiagaan bencana, SOP darurat, dan siaran peringatan cepat.',
        },
    };

    const activeRoleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.kepala_sekolah;

    const handleRoleChange = (newRole: RoleType) => {
        setCurrentRole(newRole);
        const targetConfig = ROLE_CONFIGS[newRole];
        if (targetConfig && !targetConfig.allowedTabs.includes(activeTab)) {
            setActiveTab('overview');
        }
        toast.info(`Beralih ke peran: ${targetConfig?.title || newRole}`, {
            description: targetConfig?.scopeBadge,
        });
    };

    const handleVerifyPayment = (paymentId: string) => {
        setPaymentList((prev) =>
            prev.map((p) => (p.id === paymentId ? { ...p, status: 'Lunas' as const } : p))
        );
        toast.success('Pembayaran berhasil diverifikasi!', {
            description: 'Status pembayaran telah diubah menjadi Lunas dan kuitansi elektronik telah diterbitkan.',
        });
    };

    const handleResolveDapodikIssue = (issueId: string) => {
        setDapodikIssues((prev) => prev.filter((i) => i.id !== issueId));
        toast.success('Isu Dapodik berhasil diselesaikan!', {
            description: 'Data telah divalidasi dan siap untuk sinkronisasi berikutnya.',
        });
    };

    const handleSyncDapodik = () => {
        toast.loading('Menghubungkan ke server Dapodik pusat...', { id: 'dapodik-sync' });
        setTimeout(() => {
            toast.success('Sinkronisasi Dapodik Berhasil!', {
                id: 'dapodik-sync',
                description: 'Semua 4 rombel dan residu data guru telah tersinkronisasi 100%.',
            });
        }, 1200);
    };

    const handleQuickHomeroomAction = (studentName: string, actionType: 'parent' | 'followup' | 'bk' | 'discipline') => {
        if (actionType === 'parent') {
            setSelectedStudentName(`${studentName} (XI RPL 2)`);
            setSelectedStudentPhone('+62 812-3456-7890');
            setParentCustomMessage(
                `Yth. Bapak/Ibu Wali Murid ${studentName}, saya Hendra Setiawan selaku Wali Kelas XI RPL 2 ingin berkoordinasi mengenai catatan kehadiran ananda. Mohon kesediaannya untuk berdiskusi.`
            );
            setIsParentContactModalOpen(true);
        } else if (actionType === 'followup') {
            setSelectedStudentName(`${studentName} (XI RPL 2)`);
            setFollowupType('Pendampingan Wali Kelas');
            setFollowupAssignee('Wali Kelas (Hendra Setiawan, S.Pd)');
            setFollowupNote(`Evaluasi kehadiran dan pendampingan belajar kelas XI RPL 2 untuk ${studentName}.`);
            setIsFollowupModalOpen(true);
        } else if (actionType === 'bk') {
            setSelectedStudentName(`${studentName} (XI RPL 2)`);
            setNewCaseCategory('Kedisiplinan & Kehadiran');
            setNewCasePriority('Tinggi');
            setNewCaseDesc(`Rujukan kasus dari Wali Kelas XI RPL 2 untuk ananda ${studentName}: penurunan kehadiran signifikan.`);
            setIsNewCaseModalOpen(true);
        } else if (actionType === 'discipline') {
            setSelectedStudentId('1');
            setSelectedStudentName(`${studentName} (XI RPL 2)`);
            setIsDisciplineModalOpen(true);
        }
    };

    // Fast Switcher Tab Definitions filtered dynamically by current role
    const allFastTabs: Array<{ id: string; label: string; overrideLabels?: Partial<Record<RoleType, string>>; isDanger?: boolean }> = [
        { id: 'overview', label: 'Ikhtisar', overrideLabels: { wali_kelas: 'Ikhtisar Kelas', bendahara: 'Ikhtisar SPP', operator: 'Ikhtisar Data' } },
        { id: 'data-check', label: 'Dapodik', overrideLabels: { operator: 'Cek Dapodik (7)' } },
        { id: 'early-warning', label: 'Early Warning', overrideLabels: { wali_kelas: 'Early Warning (3)', bendahara: 'Siswa Rawan Biaya' } },
        { id: 'class-monitoring', label: 'Kondisi Kelas', overrideLabels: { wali_kelas: 'Kelas XI RPL 2' } },
        { id: 'cases', label: 'Kasus BK', overrideLabels: { wali_kelas: 'Rujukan Kasus' } },
        { id: 'discipline', label: 'Kedisiplinan' },
        { id: 'communication', label: 'Ortu', overrideLabels: { bendahara: 'Reminder SPP', wali_kelas: 'Ortu XI RPL 2' } },
        { id: 'ats', label: 'ATS' },
        { id: 'payments', label: 'SPP', overrideLabels: { bendahara: 'Kas & SPP (18)' } },
        { id: 'documents', label: 'Dokumen', overrideLabels: { wali_kelas: 'Modul Ajar Saya' } },
        { id: 'incidents', label: 'Insiden', isDanger: true },
    ];

    const visibleFastTabs = allFastTabs.filter((t) => activeRoleConfig.allowedTabs.includes(t.id));

    return (
        <FlowbiteTanggapinLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            onTriggerActionModal={handleTriggerActionModal}
        >
            <Head title={`${tabMeta[activeTab]?.title || 'Dashboard'} - Tanggapin`} />

            {/* Main Outer Container */}
            <div className="space-y-4">
                {/* 1. Context Breadcrumb & Top Bar */}
                <div className="p-3 sm:p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {tabMeta[activeTab]?.badge || 'Tanggapin'}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <span>Operasional</span>
                            <span>/</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                {tabMeta[activeTab]?.title}
                            </span>
                        </div>
                    </div>

                    {/* Fast Switcher Tabs Bar (Strictly Filtered by Current Role) */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                        {visibleFastTabs.map((tab) => {
                            const isCurrent = activeTab === tab.id;
                            const label = tab.overrideLabels?.[currentRole] || tab.label;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                        isCurrent
                                            ? tab.isDanger
                                                ? 'bg-red-600 text-white font-semibold shadow-xs'
                                                : 'bg-blue-600 text-white font-semibold shadow-xs'
                                            : tab.isDanger
                                            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    )}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. DEDICATED MODULE VIEWS: SWITCHED CLEANLY BY activeTab                  */}
                {/* ========================================================================= */}

                {/* VIEW 1: OVERVIEW DASHBOARD */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        {/* Header Banner & Operational Scope */}
                        <div className="p-5 rounded-base bg-gradient-to-r from-blue-50/90 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/30 border border-blue-100 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-2xs">
                                        <Sparkles className="w-3 h-3" />
                                        TANGGAPIN WORKFLOW
                                    </span>
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                                            currentRole === 'kepala_sekolah' || currentRole === 'operator'
                                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                        )}
                                    >
                                        {activeRoleConfig.scopeBadge}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Tahun Ajaran 2025/2026 • Semester Ganjil
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {activeRoleConfig.overviewTitle}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                                    {activeRoleConfig.overviewSubtitle}
                                </p>
                                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60">
                                    <Info className="w-3.5 h-3.5 shrink-0" />
                                    <span>{activeRoleConfig.overviewPrinciple}</span>
                                </div>
                            </div>

                            {/* Role Switcher Pills */}
                            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 self-start lg:self-center">
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2">Peran:</span>
                                {(['kepala_sekolah', 'operator', 'wali_kelas', 'bendahara', 'guru_bk'] as RoleType[]).map((r) => {
                                    const cfg = ROLE_CONFIGS[r];
                                    const isAll = r === 'kepala_sekolah' || r === 'operator';
                                    return (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => handleRoleChange(r)}
                                            className={cn(
                                                'px-2.5 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1.5',
                                                currentRole === r
                                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            )}
                                        >
                                            <span>{cfg?.shortTitle || r}</span>
                                            <span
                                                className={cn(
                                                    'text-[9px] px-1 py-0.2 rounded font-bold uppercase tracking-wider',
                                                    currentRole === r
                                                        ? 'bg-blue-700 text-blue-100'
                                                        : isAll
                                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                )}
                                            >
                                                {isAll ? 'Semua' : 'Kustom'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ========================================================================= */}
                        {/* ROLE-TAILORED TOP 5 METRIC CARDS                                         */}
                        {/* ========================================================================= */}

                        {/* 1. KEPALA SEKOLAH METRICS (Executive & School-wide) */}
                        {currentRole === 'kepala_sekolah' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                                <div
                                    onClick={() => setActiveTab('early-warning')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Early Warning
                                        </span>
                                        <div className="p-1 rounded-md bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                                        {stats.studentsNeedingAttention}
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Siswa butuh follow-up segera
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Tindak Lanjuti</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('cases')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Kasus BK
                                        </span>
                                        <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                            <ShieldAlert className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                                        {stats.activeCases}
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Kasus belum selesai &gt;48j
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Buka Timeline</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('data-check')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Data Check
                                        </span>
                                        <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                                        {dapodikIssues.length}
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Anomali data sebelum cut-off
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Periksa Anomali</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('payments')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            SPP & Tagihan
                                        </span>
                                        <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                            <CreditCard className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                                        {stats.duePayments}
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Tagihan jatuh tempo & verifikasi
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Rekonsiliasi</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('incidents')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Tanggap Darurat
                                        </span>
                                        <div className="p-1 rounded-md bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                            <Siren className="w-4 h-4 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight flex items-center gap-1.5">
                                        <span>1</span>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                            Waspada
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Siaga cuaca ekstrem musim hujan
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Checklist Darurat</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. OPERATOR DAPODIK METRICS (Data Integrity, SK Guru, Rombel) */}
                        {currentRole === 'operator' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                                <div
                                    onClick={() => setActiveTab('data-check')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Anomali Dapodik
                                        </span>
                                        <div className="p-1 rounded-md bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                                        {dapodikIssues.length} Isu
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Residu NIK/NISN & rombel
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Audit Residu</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('documents')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Verifikasi SK Guru
                                        </span>
                                        <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                                        23 / 25
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        2 SK guru belum diunggah
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Periksa Berkas</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('class-monitoring')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Rombongan Belajar
                                        </span>
                                        <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                            <Users className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                                        4 Rombel
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        141 Siswa terdaftar aktif
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Status Rombel</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('ats')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Residu Siswa ATS
                                        </span>
                                        <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                                        3 Siswa
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Menunggu mutasi Dapodik
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Validasi ATS</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={handleSyncDapodik}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Server Kemdikbud
                                        </span>
                                        <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                            <RefreshCw className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight flex items-center gap-2">
                                        <span>Sinkron</span>
                                        <span className="size-2.5 rounded-full bg-green-500 animate-pulse" />
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Siap sinkronisasi data pusat
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Sinkronkan Sekarang</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. WALI KELAS METRICS (XI RPL 2 - Frontline Homeroom) */}
                        {currentRole === 'wali_kelas' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                                <div
                                    onClick={() => setActiveTab('class-monitoring')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-green-400 dark:hover:border-green-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Kehadiran XI RPL 2
                                        </span>
                                        <div className="p-1 rounded-md bg-green-100 dark:bg-green-950/80 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                            <UserCheck className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-green-600 dark:text-green-400 tracking-tight">
                                        93.8%
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Kondisi Baik (Target: 90%)
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Jurnal Kehadiran</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('early-warning')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Siswa Perlu Bimbingan
                                        </span>
                                        <div className="p-1 rounded-md bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                                        3 Siswa
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Brian, Reza, Dimas (XI RPL 2)
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Dampingi Siswa</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('discipline')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Poin Pelanggaran
                                        </span>
                                        <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                            <Scale className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                                        2 Catatan
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Disiplin XI RPL 2 Terkendali
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Buku Kedisiplinan</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('communication')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            WA Wali Murid
                                        </span>
                                        <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                                        8 Terkirim
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Tanda terima terverifikasi
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Riwayat Pesan</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('documents')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Perangkat Ajar
                                        </span>
                                        <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                                        100% Siap
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Modul Ajar Minggu Ke-8
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Buka Dokumen</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. BENDAHARA METRICS (SPP, Verifikasi Bukti, Kas Sekolah) */}
                        {currentRole === 'bendahara' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                                <div
                                    onClick={() => setActiveTab('payments')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Tunggakan SPP
                                        </span>
                                        <div className="p-1 rounded-md bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                            <CreditCard className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                                        Rp 4.250.000
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        18 Tagihan jatuh tempo
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Kelola Tagihan</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('payments')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Verifikasi Transfer
                                        </span>
                                        <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                            <WalletCards className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                                        5 Bukti
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Menunggu validasi kasir
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Validasi Sekarang</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('payments')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-green-400 dark:hover:border-green-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Realisasi Kas SPP
                                        </span>
                                        <div className="p-1 rounded-md bg-green-100 dark:bg-green-950/80 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-green-600 dark:text-green-400 tracking-tight">
                                        82.4%
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Rp 34.8jt dari Rp 42jt target
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Buku Kas SPP</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('early-warning')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Menunggak &gt;2 Bln
                                        </span>
                                        <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                                        4 Siswa
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Rekomendasi beasiswa/dispensasi
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Mitigasi Kendala</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('communication')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Reminder WA
                                        </span>
                                        <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <Send className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                                        14 Pesan
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Pengingat santun tanpa intimidasi
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Kirim Pengingat</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. GURU BK METRICS (Kasus Konseling, Rawan ATS, Mediasi) */}
                        {currentRole === 'guru_bk' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                                <div
                                    onClick={() => setActiveTab('cases')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Kasus Aktif BK
                                        </span>
                                        <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                            <ShieldAlert className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                                        {stats.activeCases}
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Dalam alur konseling terstruktur
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Buka Kanban BK</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('early-warning')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Early Warning BK
                                        </span>
                                        <div className="p-1 rounded-md bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                                        {stats.studentsNeedingAttention}
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Deteksi risiko sebelum eskalasi
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Pantau Profil</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('ats')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Mitigasi Siswa ATS
                                        </span>
                                        <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <Users className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                                        3 Siswa
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Jadwal home visit & pendampingan
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Alur ATS</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('discipline')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Tindakan Restoratif
                                        </span>
                                        <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                            <Scale className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                                        8 Sesi
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Pembinaan karakter berkeadilan
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Buku Restoratif</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setActiveTab('communication')}
                                    className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Mediasi Wali Murid
                                        </span>
                                        <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                                        2 Sesi
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                        Pertemuan terjadwal minggu ini
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                        <span>Jadwal Mediasi</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ========================================================================= */}
                        {/* ROLE-SPECIFIC MAIN BODY CONTENT SECTIONS                                   */}
                        {/* ========================================================================= */}

                        {/* SECTION A: KEPALA SEKOLAH VIEW (Executive Priority Feed + Previews) */}
                        {currentRole === 'kepala_sekolah' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <span className="size-2.5 rounded-full bg-red-500 animate-ping" />
                                            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                Priority Action Feed — Hal Mendesak Seluruh Sekolah Hari Ini
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <span>North Star Metric:</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                                                {stats.resolvedThisMonth} Tindakan Terselesaikan
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {priorityFeed.map((alert) => (
                                            <div
                                                key={alert.id}
                                                className={cn(
                                                    'p-3.5 rounded-base border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3',
                                                    alert.actionTaken
                                                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                                                        : 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/60 shadow-xs'
                                                )}
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                            {alert.studentName}
                                                        </span>
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                            {alert.class}
                                                        </span>
                                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800">
                                                            {alert.triggerType}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400">
                                                            • {alert.timestamp}
                                                        </span>
                                                        {alert.actionTaken && (
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                                                                ✓ Telah Ditindaklanjuti
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                        {alert.summary}
                                                    </p>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 pt-0.5">
                                                        <span>Wali Kelas: {alert.homeroomTeacher}</span>
                                                        <span>Orang Tua: {alert.parentName} ({alert.parentPhone})</span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                                                    <button
                                                        type="button"
                                                        disabled={alert.actionTaken}
                                                        onClick={() => {
                                                            setSelectedAlertId(alert.id);
                                                            setSelectedStudentName(`${alert.studentName} (${alert.class})`);
                                                            setSelectedStudentPhone(alert.parentPhone);
                                                            setFollowupNote(`Tindak lanjut pemicu risiko: ${alert.summary}`);
                                                            setIsFollowupModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                        Buat Follow-up
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedStudentName(`${alert.studentName} (${alert.class})`);
                                                            setSelectedStudentPhone(alert.parentPhone);
                                                            setParentCustomMessage(
                                                                `Yth. Bapak/Ibu ${alert.parentName}, kami dari sekolah ingin mengonfirmasi perkembangan ananda ${alert.studentName}. ${alert.summary}. Mohon berkenan berkoordinasi dengan sekolah.`
                                                            );
                                                            setIsParentContactModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                                    >
                                                        <PhoneCall className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                                        Hubungi Ortu
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedStudentName(`${alert.studentName} (${alert.class})`);
                                                            setNewCaseDesc(`Eskalasi dari Early Warning: ${alert.summary}`);
                                                            setIsNewCaseModalOpen(true);
                                                        }}
                                                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                        title="Eskalasi ke Kasus BK"
                                                    >
                                                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Split Preview: Class Health & Case Pipeline */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Class Health — Indikator Kondisi Kelas
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Mendeteksi kelas dan rombel yang memerlukan pendampingan.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('class-monitoring')}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                Semua Kelas <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {classes.slice(0, 3).map((cls) => (
                                                <div
                                                    key={cls.id}
                                                    className="p-3 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80"
                                                >
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <div>
                                                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm me-2">
                                                                {cls.name}
                                                            </span>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {cls.major}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={cn(
                                                                'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                                                cls.healthStatus === 'good'
                                                                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200'
                                                                    : cls.healthStatus === 'warning'
                                                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                                    : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
                                                            )}
                                                        >
                                                            {cls.healthStatus === 'good'
                                                                ? 'Kondisi Baik'
                                                                : cls.healthStatus === 'warning'
                                                                ? 'Perlu Perhatian'
                                                                : 'Perlu Intervensi'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 text-xs py-1 text-slate-600 dark:text-slate-300">
                                                        <div>
                                                            <span className="text-[10px] text-slate-400 block">Kehadiran</span>
                                                            <span className="font-bold text-slate-900 dark:text-slate-100">{cls.attendanceRate}%</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] text-slate-400 block">Siswa Berisiko</span>
                                                            <span className="font-bold text-red-600 dark:text-red-400">{cls.studentsAtRisk} siswa</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] text-slate-400 block">Follow-up Pending</span>
                                                            <span className="font-bold text-amber-600 dark:text-amber-400">{cls.pendingFollowups} kasus</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Manajemen Kasus Siswa Aktif
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    SLA penanganan konseling dan bimbingan terkoordinasi.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('cases')}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                Buka Kanban <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {cases.slice(0, 3).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="p-3 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                                                                {item.studentName}
                                                            </span>
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                                                                {item.code}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                            {item.stageLabel}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                                        {item.lastActivity}
                                                    </p>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                                                        <span>PIC: {item.assignee}</span>
                                                        <span>Update: {item.lastUpdate}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION B: OPERATOR VIEW (Dapodik Audit Center + Teacher Documents & Rombel Mapping) */}
                        {currentRole === 'operator' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Pusat Audit Residu & Anomali Dapodik Sebelum Batas Cut-Off
                                                </h3>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Verifikasi ketidaksesuaian data guru, siswa, dan rombongan belajar langsung dari tabel ini.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleSyncDapodik}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                                Sinkronkan ke Server Pusat
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        {dapodikIssues.map((issue) => (
                                            <div
                                                key={issue.id}
                                                className="p-3.5 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
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
                                                        <span className="font-bold text-slate-900 dark:text-slate-100">
                                                            {issue.targetName}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400">
                                                            • Kategori: {issue.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                        {issue.description}
                                                    </p>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                                        Field Dapodik: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{issue.field}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleResolveDapodikIssue(issue.id)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-xs transition-colors"
                                                    >
                                                        ✓ Selesaikan & Validasi
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toast.info(`Membuka tindakan perbaikan: ${issue.action}`)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    >
                                                        {issue.action}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Split Preview: Dokumen Guru & Pemetaan Rombel */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Dokumen & SK Pendidik */}
                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Kelengkapan Dokumen & SK Pendidik
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Monitoring SK Tugas Mengajar dan Perangkat Ajar Kurikulum Merdeka.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('documents')}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                Kelola Berkas <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {documents.slice(0, 3).map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="p-3 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                                                >
                                                    <div className="space-y-0.5">
                                                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                            {doc.title}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                                            Guru: {doc.teacher} • {doc.category}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={cn(
                                                            'px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0',
                                                            doc.status === 'Valid'
                                                                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200'
                                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                        )}
                                                    >
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pemetaan Rombongan Belajar */}
                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Pemetaan 4 Rombongan Belajar (Rombel)
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Dapodik 2025: Pembagian wali kelas dan jumlah siswa terdaftar.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('class-monitoring')}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                Semua Rombel <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {classes.map((cls) => (
                                                <div
                                                    key={cls.id}
                                                    className="p-3 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs"
                                                >
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-slate-100">
                                                            {cls.name} <span className="font-normal text-slate-500">({cls.major})</span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                                            Wali Kelas: {cls.homeroomTeacher}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold text-[11px]">
                                                            36 Siswa
                                                        </span>
                                                        <span className="text-[11px] text-green-600 dark:text-green-400 font-bold">
                                                            ✓ Terverifikasi
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION C: WALI KELAS VIEW (Focused Frontline Class XI RPL 2) */}
                        {currentRole === 'wali_kelas' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="size-2 rounded-full bg-red-500 animate-ping" />
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Siswa XI RPL 2 Butuh Tindakan Segera Hari Ini (Wali Kelas)
                                                </h3>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Pantau perubahan perilaku, absensi, dan penugasan pada 36 siswa rombel binaan Anda.
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                            ⭐ Rombel Binaan: XI RPL 2
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Card 1: Brian Aditya */}
                                        <div className="p-3.5 rounded-base bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                        Brian Aditya
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200">
                                                        Alfa 3 Hari Berturut-turut
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        • Absensi Terakhir: Senin
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    Tidak ada surat izin atau pemberitahuan dari orang tua. Nomor wali murid belum terhubung kembali.
                                                </p>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                                                    <span>Orang Tua: Suryadi (+62 812-3456-7890)</span>
                                                    <span>Poin Disiplin: 20 Poin</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHomeroomAction('Brian Aditya', 'parent')}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-xs transition-colors"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5" />
                                                    WhatsApp Ortu
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHomeroomAction('Brian Aditya', 'followup')}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Catat Bimbingan Wali
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHomeroomAction('Brian Aditya', 'bk')}
                                                    className="px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors"
                                                >
                                                    Rujuk ke BK
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card 2: Reza Pahlevi */}
                                        <div className="p-3.5 rounded-base bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                        Reza Pahlevi
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                                                        Terlambat 3x Minggu Ini
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        • Pelajaran Produktif RPL
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    Kerap terlambat jam pertama dengan alasan kendala kendaraan bermotor. Perlu komitmen kedisiplinan.
                                                </p>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                                                    <span>Orang Tua: Nurul Hidayah (+62 813-9876-5432)</span>
                                                    <span>Poin Disiplin: 10 Poin</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHomeroomAction('Reza Pahlevi', 'parent')}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-green-600" />
                                                    Kontak Ortu
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHomeroomAction('Reza Pahlevi', 'followup')}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Catat Komitmen
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHomeroomAction('Reza Pahlevi', 'discipline')}
                                                    className="px-2.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 rounded-lg border border-red-200 dark:border-red-800 transition-colors"
                                                >
                                                    Input Disiplin
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card 3: Dimas Anggara */}
                                        <div className="p-3.5 rounded-base bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                        Dimas Anggara
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                                                        Penurunan Belajar & Mengantuk
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        • Pemrograman Web
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    Membantu orang tua bekerja malam hari. Tugas projek tertunda namun memiliki etos belajar yang baik.
                                                </p>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                                                    <span>Orang Tua: Bambang Kusumo (+62 856-1122-3344)</span>
                                                    <span>Status: Perlu Pendampingan Khusus</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHomeroomAction('Dimas Anggara', 'followup')}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Bimbingan Belajar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHomeroomAction('Dimas Anggara', 'bk')}
                                                    className="px-2.5 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors"
                                                >
                                                    Konsultasi BK
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Split Preview: Radar Kehadiran & Rekap Harian */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Rekapitulasi Kehadiran Hari Ini (XI RPL 2)
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Total 36 Siswa Terdaftar di Rombel Anda.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('class-monitoring')}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                Rincian Kelas <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 text-center py-2">
                                            <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800">
                                                <span className="text-[10px] text-green-700 dark:text-green-300 font-bold block">HADIR</span>
                                                <span className="text-xl font-extrabold text-green-700 dark:text-green-300">32</span>
                                                <span className="text-[10px] text-green-600 dark:text-green-400">88.9%</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                                                <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold block">SAKIT</span>
                                                <span className="text-xl font-extrabold text-blue-700 dark:text-blue-300">2</span>
                                                <span className="text-[10px] text-blue-600 dark:text-blue-400">5.6%</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                                                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold block">IZIN</span>
                                                <span className="text-xl font-extrabold text-amber-700 dark:text-amber-300">1</span>
                                                <span className="text-[10px] text-amber-600 dark:text-amber-400">2.8%</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
                                                <span className="text-[10px] text-red-700 dark:text-red-300 font-bold block">ALFA</span>
                                                <span className="text-xl font-extrabold text-red-700 dark:text-red-300">1</span>
                                                <span className="text-[10px] text-red-600 dark:text-red-400">2.8%</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <button
                                                type="button"
                                                onClick={() => toast.success('Jurnal kehadiran XI RPL 2 berhasil diperbarui!')}
                                                className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                                            >
                                                + Simpan Jurnal Kelas Hari Ini
                                            </button>
                                        </div>
                                    </div>

                                    {/* Catatan Disiplin & Apresiasi */}
                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Catatan Disiplin & Prestasi XI RPL 2
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Pencatatan pembinaan karakter dan poin berkeadilan.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('discipline')}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                Buku Disiplin <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            <div className="p-3 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1 text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">Brian Aditya</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                                        20 Poin
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                                                    Keluar area sekolah tanpa surat izin saat istirahat kedua.
                                                </p>
                                                <div className="text-[10px] text-amber-600 font-semibold pt-1">
                                                    Status: Menunggu Pembinaan Wali Kelas
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-base bg-green-50/60 dark:bg-green-950/30 border border-green-200 dark:border-green-800/60 space-y-1 text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-green-900 dark:text-green-200">Siti Rahma (XI RPL 2)</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        +25 Poin Apresiasi
                                                    </span>
                                                </div>
                                                <p className="text-green-800 dark:text-green-300 text-[11px]">
                                                    Juara 1 Lomba Kompetensi Siswa (LKS) Web Technologies Tingkat Kota.
                                                </p>
                                                <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold pt-1">
                                                    Status: Penghargaan Upacara Bendera
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION D: BENDAHARA VIEW (SPP Verifications, Overdue List & Budget Allocation) */}
                        {currentRole === 'bendahara' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Antrean Verifikasi Bukti Pembayaran SPP Masuk (Kasir Sekolah)
                                                </h3>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Validasi mutasi rekening koran dan terbitkan kuitansi elektronik resmi untuk orang tua siswa.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('payments')}
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                        >
                                            Kelola Semua Tagihan <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="space-y-2.5">
                                        {/* Pending 1 */}
                                        <div className="p-3.5 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                        Rizky Pratama
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                        X TKJ 1
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                                        Menunggu Verifikasi
                                                    </span>
                                                    <span className="text-[11px] font-mono text-slate-400">
                                                        • Ref: MAND-8839201
                                                    </span>
                                                </div>
                                                <div className="text-slate-700 dark:text-slate-300 font-medium">
                                                    SPP Bulan September 2025 • Transfer Bank Mandiri
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    Nominal: <strong className="text-slate-900 dark:text-slate-100 font-bold">Rp 250.000</strong> • Waktu Upload: Hari ini, 08:30 WIB
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleVerifyPayment('1')}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-xs transition-colors"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                    ✓ Verifikasi & Terbitkan Kuitansi
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => toast.info('Membuka pratinjau bukti transfer Mandiri')}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    Lihat Struk
                                                </button>
                                            </div>
                                        </div>

                                        {/* Pending 2 */}
                                        <div className="p-3.5 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                        Nabila Putri
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                        XI RPL 2
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                                        Menunggu Verifikasi
                                                    </span>
                                                    <span className="text-[11px] font-mono text-slate-400">
                                                        • Ref: BCA-4491022
                                                    </span>
                                                </div>
                                                <div className="text-slate-700 dark:text-slate-300 font-medium">
                                                    Uang Praktik Kejuruan RPL • Transfer BCA Virtual Account
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    Nominal: <strong className="text-slate-900 dark:text-slate-100 font-bold">Rp 350.000</strong> • Waktu Upload: Kemarin, 16:45 WIB
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleVerifyPayment('2')}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-xs transition-colors"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                    ✓ Verifikasi & Terbitkan Kuitansi
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => toast.info('Membuka pratinjau bukti transfer BCA')}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    Lihat Struk
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Split Preview: Siswa Menunggak & Realisasi Kas */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Siswa Menunggak & Kirim Reminder */}
                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Siswa Tunggakan SPP & Kirim Reminder Humanis
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Pemberitahuan santun ke wali murid tanpa mempermalukan siswa.
                                                </p>
                                            </div>
                                            <span className="text-[11px] font-bold text-red-600">18 Belum Bayar</span>
                                        </div>

                                        <div className="space-y-2.5">
                                            <div className="p-3 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-slate-100">Brian Aditya (XI RPL 2)</div>
                                                    <div className="text-[11px] text-red-600 font-semibold">Tunggakan: Rp 500.000 (2 Bulan)</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStudentName('Brian Aditya (XI RPL 2)');
                                                        setSelectedStudentPhone('+62 812-3456-7890');
                                                        setParentCustomMessage(
                                                            'Yth. Bapak/Ibu Wali Murid Brian Aditya, salam hormat dari bagian keuangan SMK Harapan. Mengingatkan tagihan SPP ananda yang telah jatuh tempo. Jika ada kendala, kami siap berkoordinasi untuk skema keringanan.'
                                                        );
                                                        setIsParentContactModalOpen(true);
                                                    }}
                                                    className="px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 rounded border border-green-200 hover:bg-green-100 transition-colors"
                                                >
                                                    💬 WA Santun
                                                </button>
                                            </div>

                                            <div className="p-3 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-slate-100">Deni Saputra (XI TKR 3)</div>
                                                    <div className="text-[11px] text-red-600 font-semibold">Tunggakan: Rp 250.000 (1 Bulan)</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStudentName('Deni Saputra (XI TKR 3)');
                                                        setSelectedStudentPhone('+62 878-5544-3322');
                                                        setParentCustomMessage(
                                                            'Yth. Bapak/Ibu Wali Murid Deni Saputra, menginformasikan tagihan administrasi sekolah ananda periode berjalan. Terima kasih atas kerja samanya.'
                                                        );
                                                        setIsParentContactModalOpen(true);
                                                    }}
                                                    className="px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 rounded border border-green-200 hover:bg-green-100 transition-colors"
                                                >
                                                    💬 WA Santun
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Realisasi Pos Anggaran & Penerimaan */}
                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Realisasi Kas Masuk Berdasarkan Pos
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Penerimaan kas bulan berjalan per pos anggaran.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => toast.success('Mengunduh Buku Kas Pembantu (Format Excel)...')}
                                                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                            >
                                                Unduh BKP
                                            </button>
                                        </div>

                                        <div className="space-y-3 text-xs">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">SPP Bulanan Reguler</span>
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">Rp 28.5jt / Rp 35jt (81.4%)</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '81.4%' }} />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Iuran Praktik Lab/Bengkel</span>
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">Rp 12.4jt / Rp 15jt (82.7%)</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                    <div className="h-full bg-green-600 rounded-full" style={{ width: '82.7%' }} />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">DSP Sarpras & Fasilitas</span>
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">Rp 8.2jt / Rp 10jt (82.0%)</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '82.0%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION E: GURU BK VIEW (Active Case Pipelines & ATS Home Visit) */}
                        {currentRole === 'guru_bk' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Pipeline Kasus Siswa Aktif & Timeline Konseling BK
                                                </h3>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Alur SLA penanganan: Kasus Baru → Ditugaskan → Penanganan → Selesai.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleTriggerActionModal('new_case')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Daftarkan Kasus Konseling Baru
                                        </button>
                                    </div>

                                    <div className="space-y-2.5">
                                        {cases.map((c) => (
                                            <div
                                                key={c.id}
                                                className="p-3.5 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                            {c.studentName}
                                                        </span>
                                                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                            {c.code}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                                            {c.stageLabel}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400">
                                                            • Prioritas: {c.priority}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                        {c.lastActivity}
                                                    </p>
                                                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                                                        <span>PIC Konselor: {c.assignee}</span>
                                                        <span>Update: {c.lastUpdate}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedStudentName(c.studentName);
                                                            setFollowupType('Konseling Individu');
                                                            setFollowupAssignee('Guru BK (Rahmawati, S.Pd)');
                                                            setFollowupNote(`Sesi bimbingan lanjutan untuk kasus ${c.code}`);
                                                            setIsFollowupModalOpen(true);
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                                                    >
                                                        + Catat Sesi Konseling
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTab('cases')}
                                                        className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                                                    >
                                                        Buka Kanban
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Split Preview: Siswa Rawan ATS & Jadwal Mediasi */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Pemantauan Lapangan Siswa Rawan ATS
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Pencegahan anak putus sekolah dan jadwal home visit.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('ats')}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                Alur ATS <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {atsList.slice(0, 2).map((ats) => (
                                                <div
                                                    key={ats.id}
                                                    className="p-3 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1 text-xs"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-slate-900 dark:text-slate-100">{ats.studentName}</span>
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                            {ats.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                                                        Penyebab: {ats.reason}
                                                    </p>
                                                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between">
                                                        <span>Jadwal Kunjungan: {ats.scheduledVisit}</span>
                                                        <span>Petugas: {ats.officer}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Jadwal Mediasi & Konferensi Kasus
                                                </h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    Pertemuan orang tua, wali kelas, dan guru BK.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('communication')}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                Panggilan Ortu <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2.5 text-xs">
                                            <div className="p-3 rounded-base bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-purple-900 dark:text-purple-200">
                                                        Konferensi Kasus: Brian Aditya
                                                    </span>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                        Besok, 09:00 WIB
                                                    </span>
                                                </div>
                                                <p className="text-purple-800 dark:text-purple-300 text-[11px]">
                                                    Dihadiri: Orang Tua, Wali Kelas (Hendra Setiawan), Guru BK (Rahmawati).
                                                </p>
                                            </div>

                                            <div className="p-3 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">
                                                        Konseling Karier: Reza Pahlevi
                                                    </span>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                        Kamis, 13:00 WIB
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                                                    Fokus: Motivasi belajar dan kesiapan penempatan Praktik Kerja Lapangan (PKL).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* VIEW 2: EARLY WARNING MODULE */}
                {activeTab === 'early-warning' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Modul 01: Early Warning & Profil Risiko Siswa
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Mendeteksi pola risiko siswa sebelum berkembang menjadi masalah besar. Sistem menandai pemicu (trigger), bukan vonis/label.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800">
                                    {stats.studentsNeedingAttention} Siswa Dalam Pantauan
                                </span>
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama siswa, kelas, atau pemicu..."
                                    value={earlyWarningSearch}
                                    onChange={(e) => setEarlyWarningSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tingkat Risiko:</span>
                                <select
                                    value={earlyWarningRiskFilter}
                                    onChange={(e) => setEarlyWarningRiskFilter(e.target.value)}
                                    className="p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                >
                                    <option value="all">Semua Risiko</option>
                                    <option value="high">Risiko Tinggi</option>
                                    <option value="medium">Risiko Sedang</option>
                                    <option value="low">Risiko Rendah</option>
                                </select>
                            </div>
                        </div>

                        {/* Early Warning Watchlist Table */}
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                            <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
                                <thead className="text-[11px] text-slate-700 dark:text-slate-200 uppercase bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-3">Siswa & Kelas</th>
                                        <th className="px-4 py-3">Pemicu Risiko (Trigger)</th>
                                        <th className="px-4 py-3">Ringkasan Pemicu</th>
                                        <th className="px-4 py-3">Wali Kelas</th>
                                        <th className="px-4 py-3">Orang Tua</th>
                                        <th className="px-4 py-3 text-center">Tindakan Cepat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {priorityFeed
                                        .filter((item) => {
                                            const matchesSearch =
                                                item.studentName.toLowerCase().includes(earlyWarningSearch.toLowerCase()) ||
                                                item.class.toLowerCase().includes(earlyWarningSearch.toLowerCase()) ||
                                                item.triggerType.toLowerCase().includes(earlyWarningSearch.toLowerCase());
                                            const matchesRisk =
                                                earlyWarningRiskFilter === 'all' || item.riskLevel === earlyWarningRiskFilter;
                                            return matchesSearch && matchesRisk;
                                        })
                                        .map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                    <div>{item.studentName}</div>
                                                    <div className="text-[11px] font-normal text-slate-400">{item.class}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800">
                                                        {item.triggerType}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 max-w-xs text-xs text-slate-700 dark:text-slate-300">
                                                    {item.summary}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    {item.homeroomTeacher}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <div className="font-medium text-slate-900 dark:text-slate-100">{item.parentName}</div>
                                                    <div className="text-slate-400">{item.parentPhone}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedStudentName(`${item.studentName} (${item.class})`);
                                                                setSelectedStudentPhone(item.parentPhone);
                                                                setFollowupNote(`Tindak lanjut pemicu risiko: ${item.summary}`);
                                                                setIsFollowupModalOpen(true);
                                                            }}
                                                            className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                                        >
                                                            Follow-up
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedStudentName(`${item.studentName} (${item.class})`);
                                                                setSelectedStudentPhone(item.parentPhone);
                                                                setParentCustomMessage(`Yth. Bapak/Ibu ${item.parentName}, ananda ${item.studentName}: ${item.summary}.`);
                                                                setIsParentContactModalOpen(true);
                                                            }}
                                                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded transition-colors"
                                                        >
                                                            Hubungi
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PRD Reference Box */}
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">
                                Kriteria Ambang Batas Peringatan Dini (PRD Section 1):
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                                <li><strong>Kehadiran:</strong> Ketidakhadiran &gt;20% dalam 14 hari terakhir atau 3 hari berturut-turut tanpa keterangan.</li>
                                <li><strong>Akademik:</strong> Nilai formatif turun drastis di 2+ mata pelajaran produktif atau tugas terbengkalai.</li>
                                <li><strong>Administrasi:</strong> Keterlambatan SPP berturut-turut yang berindikasi kerentanan ekonomi keluarga.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* VIEW 3: CLASS MONITORING MODULE */}
                {activeTab === 'class-monitoring' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Modul 02: Monitoring Kondisi Kelas (Class Health Index)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Pemantauan rombel sekolah secara real-time untuk mendeteksi anomali kehadiran dan dinamika kelas.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toast.success('Presensi kelas hari ini berhasil disinkronisasi!')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Sinkron Presensi Harian
                            </button>
                        </div>

                        {/* Class Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classes.map((cls) => {
                                const isMyClass = cls.name === 'XI RPL 2' && currentRole === 'wali_kelas';
                                return (
                                <div
                                    key={cls.id}
                                    className={cn(
                                        'p-4 rounded-base border space-y-3 transition-all',
                                        isMyClass
                                            ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700/80 shadow-xs ring-1 ring-blue-400/40'
                                            : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700'
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">{cls.name}</h4>
                                                {isMyClass && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-300">
                                                        ⭐ Kelas Binaan Anda
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{cls.major}</p>
                                        </div>
                                        <span
                                            className={cn(
                                                'text-[11px] font-bold px-2.5 py-1 rounded-full border',
                                                cls.healthStatus === 'good'
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800'
                                                    : cls.healthStatus === 'warning'
                                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                    : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800'
                                            )}
                                        >
                                            {cls.healthStatus === 'good' ? 'Kondisi Prima' : cls.healthStatus === 'warning' ? 'Perlu Perhatian' : 'Kritis'}
                                        </span>
                                    </div>

                                    {/* Attendance Progress Bar */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-600 dark:text-slate-400">Tingkat Kehadiran:</span>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">{cls.attendanceRate}%</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <div
                                                className={cn(
                                                    'h-full rounded-full transition-all',
                                                    cls.attendanceRate >= 90
                                                        ? 'bg-green-500'
                                                        : cls.attendanceRate >= 80
                                                        ? 'bg-amber-500'
                                                        : 'bg-red-500'
                                                )}
                                                style={{ width: `${cls.attendanceRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs py-1 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2">
                                        <div>
                                            <span className="text-[10px] text-slate-400 block">Siswa Berisiko</span>
                                            <span className="font-bold text-red-600 dark:text-red-400 text-sm">{cls.studentsAtRisk} siswa</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block">Follow-up Terbuka</span>
                                            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{cls.pendingFollowups} kasus</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                                        <span className="text-slate-500 dark:text-slate-400">Wali: {cls.homeroomTeacher}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedStudentName(`Siswa ${cls.name}`);
                                                setIsFollowupModalOpen(true);
                                            }}
                                            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                        >
                                            + Catat Follow-up
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* VIEW 4: CASE MANAGEMENT KANBAN */}
                {activeTab === 'cases' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Modul 03: Manajemen Kasus Siswa & Timeline BK
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Alur terstruktur: Masuk → Ditugaskan → Penanganan → Follow-up → Selesai dengan SLA respons 48 jam.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleTriggerActionModal('new_case')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Daftarkan Kasus Baru
                            </button>
                        </div>

                        {/* Kanban Pipeline Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-xs">
                            {/* 1. Kasus Baru */}
                            <div className="p-3.5 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <span>1. Baru Masuk</span>
                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                                        {cases.filter((c) => c.stage === 'new').length}
                                    </span>
                                </div>
                                {cases.filter((c) => c.stage === 'new').map((c) => (
                                    <div key={c.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-900 dark:text-slate-100">{c.studentName}</span>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300">
                                                {c.priority}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300">{c.lastActivity}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCases((prev) =>
                                                    prev.map((item) =>
                                                        item.id === c.id ? { ...item, stage: 'assigned', stageLabel: 'Ditugaskan ke BK' } : item
                                                    )
                                                );
                                                toast.success(`Kasus ${c.code} ditugaskan ke Guru BK!`);
                                            }}
                                            className="w-full py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                        >
                                            Tugaskan ke BK →
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* 2. Ditugaskan */}
                            <div className="p-3.5 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <span>2. Ditugaskan</span>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                        {cases.filter((c) => c.stage === 'assigned').length}
                                    </span>
                                </div>
                                {cases.filter((c) => c.stage === 'assigned').map((c) => (
                                    <div key={c.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-900 dark:text-slate-100">{c.studentName}</span>
                                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{c.category}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300">{c.lastActivity}</p>
                                        <div className="text-[10px] text-slate-400">PIC: {c.assignee}</div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCases((prev) =>
                                                    prev.map((item) =>
                                                        item.id === c.id ? { ...item, stage: 'in_progress', stageLabel: 'Sedang Ditangani' } : item
                                                    )
                                                );
                                                toast.success(`Kasus ${c.code} masuk tahap penanganan konseling.`);
                                            }}
                                            className="w-full py-1 text-xs bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-semibold rounded hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
                                        >
                                            Mulai Konseling →
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* 3. Dalam Penanganan */}
                            <div className="p-3.5 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <span>3. Penanganan</span>
                                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold">
                                        {cases.filter((c) => c.stage === 'in_progress').length}
                                    </span>
                                </div>
                                {cases.filter((c) => c.stage === 'in_progress').map((c) => (
                                    <div key={c.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{c.studentName}</span>
                                        <p className="text-xs text-slate-600 dark:text-slate-300">{c.lastActivity}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCases((prev) =>
                                                    prev.map((item) =>
                                                        item.id === c.id ? { ...item, stage: 'follow_up', stageLabel: 'Perlu Follow-up Ortu' } : item
                                                    )
                                                );
                                                toast.success(`Kasus ${c.code} menunggu follow-up orang tua.`);
                                            }}
                                            className="w-full py-1 text-xs bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold rounded hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                                        >
                                            Jadwalkan Ortu →
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* 4. Follow-up Ortu */}
                            <div className="p-3.5 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <span>4. Follow-up</span>
                                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 text-[10px] font-bold">
                                        {cases.filter((c) => c.stage === 'follow_up').length}
                                    </span>
                                </div>
                                {cases.filter((c) => c.stage === 'follow_up').map((c) => (
                                    <div key={c.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{c.studentName}</span>
                                        <p className="text-xs text-slate-600 dark:text-slate-300">{c.lastActivity}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCases((prev) =>
                                                    prev.map((item) =>
                                                        item.id === c.id ? { ...item, stage: 'resolved', stageLabel: 'Terselesaikan' } : item
                                                    )
                                                );
                                                toast.success(`Kasus ${c.code} dinyatakan terselesaikan!`);
                                            }}
                                            className="w-full py-1 text-xs bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 font-semibold rounded hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                                        >
                                            Selesaikan Kasus ✓
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* 5. Selesai */}
                            <div className="p-3.5 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <span>5. Selesai</span>
                                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-[10px] font-bold">
                                        {cases.filter((c) => c.stage === 'resolved').length}
                                    </span>
                                </div>
                                {cases.filter((c) => c.stage === 'resolved').map((c) => (
                                    <div key={c.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800/60 shadow-2xs space-y-1.5 opacity-80">
                                        <div className="flex items-center gap-1 text-green-600 font-semibold text-xs">
                                            <Check className="w-3.5 h-3.5" />
                                            <span>{c.studentName}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">{c.lastActivity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW 5: DISCIPLINE & POINTS MODULE */}
                {activeTab === 'discipline' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Modul 05: Kedisiplinan & Poin Berkeadilan (Restoratif)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Pencatatan pelanggaran berbasis pembinaan dan tindakan restoratif berkeadilan, bukan sekadar pemberian hukuman.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDisciplineModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Catat Pelanggaran / Poin
                            </button>
                        </div>

                        {/* Discipline Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Catatan</span>
                                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{disciplineList.length} Catatan</div>
                                <span className="text-xs text-slate-500">Semester Ganjil 2025/2026</span>
                            </div>
                            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Dalam Pembinaan</span>
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                                    {disciplineList.filter((d) => d.actionStatus.includes('Menunggu')).length} Siswa
                                </div>
                                <span className="text-xs text-slate-500">Perlu tindak lanjut pembina</span>
                            </div>
                            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Tindakan Restoratif Selesai</span>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {disciplineList.filter((d) => d.actionStatus.includes('Selesai') || d.actionStatus.includes('Sudah')).length} Kasus
                                </div>
                                <span className="text-xs text-slate-500">Komitmen karakter tercapai</span>
                            </div>
                        </div>

                        {/* Discipline Table */}
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                            <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
                                <thead className="text-[11px] text-slate-700 dark:text-slate-200 uppercase bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-3">Siswa & Kelas</th>
                                        <th className="px-4 py-3">Jenis Pelanggaran</th>
                                        <th className="px-4 py-3">Poin</th>
                                        <th className="px-4 py-3">Status Pembinaan</th>
                                        <th className="px-4 py-3">Catatan Pola Berulang</th>
                                        <th className="px-4 py-3">Tanggal</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {disciplineList.map((rec) => (
                                        <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                <div>{rec.studentName}</div>
                                                <div className="text-[11px] font-normal text-slate-400">{rec.class}</div>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                                {rec.infraction}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                    +{rec.points} Poin
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                                                        rec.actionStatus.includes('Selesai') || rec.actionStatus.includes('Sudah')
                                                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200'
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                    )}
                                                >
                                                    {rec.actionStatus}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 max-w-xs text-[11px] text-slate-500 dark:text-slate-400">
                                                {rec.patternNotes}
                                            </td>
                                            <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                                                {rec.recordedAt}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStudentName(`${rec.studentName} (${rec.class})`);
                                                        setIsFollowupModalOpen(true);
                                                    }}
                                                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded hover:underline"
                                                >
                                                    Bina Siswa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* VIEW 6: PARENT COMMUNICATION MODULE */}
                {activeTab === 'communication' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Modul 04: Komunikasi Orang Tua Terstruktur
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Menyediakan komunikasi sekolah–orang tua berbasis data tanpa saling menyalahkan di grup chat, dilengkapi bukti tanda terima.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleTriggerActionModal('parent_contact')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Kirim Pesan Terstruktur
                            </button>
                        </div>

                        <div className="space-y-3">
                            {parentUpdates.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="p-4 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                                >
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-slate-100">{msg.studentName}</span>
                                            <span className="text-[11px] text-slate-400">• Orang Tua: {msg.parentName}</span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                {msg.category}
                                            </span>
                                            <span className="text-[10px] text-slate-400">• {msg.date}</span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 text-xs bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
                                            {msg.message}
                                        </p>
                                        <div className="text-[11px] text-slate-400">
                                            Saluran Pengiriman: <span className="font-medium text-slate-700 dark:text-slate-300">{msg.status}</span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex flex-col items-end gap-1">
                                        <span className="text-[11px] text-slate-400">Tanda Terima (PRD):</span>
                                        <span
                                            className={cn(
                                                'px-3 py-1 text-xs font-semibold rounded-full border',
                                                msg.acknowledgement === 'Sudah membaca'
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800'
                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
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

                {/* VIEW 7: ATS FIELD WORKFLOW MODULE */}
                {activeTab === 'ats' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Modul 06: ATS Field Workflow (Anak Tidak Sekolah)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Workflow penanganan verifikasi lapangan & intervensi: Ditugaskan → Kunjungan → Terverifikasi → Intervensi → Kembali Sekolah.
                                </p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                Satgas ATS Terpadu
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {atsList.map((ats) => (
                                <div
                                    key={ats.id}
                                    className="p-4 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{ats.studentName}</span>
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                            {ats.lastClass}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{ats.address}</span>
                                    </div>
                                    <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                                        <div className="text-[10px] text-slate-400">Identifikasi Kendala Siswa:</div>
                                        <div className="font-medium text-slate-900 dark:text-slate-100">{ats.reason}</div>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                                        <span className="text-slate-400">Petugas: {ats.officer}</span>
                                        <span className="font-bold text-amber-600 dark:text-amber-400">
                                            {ats.status}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toast.success(`Hasil kunjungan rumah ${ats.studentName} berhasil diperbarui!`)}
                                        className="w-full py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        Update Catatan Kunjungan Lapangan
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* VIEW 8: PAYMENTS & SPP MODULE */}
                {activeTab === 'payments' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Modul 07: Pembayaran SPP & Skema Keringanan
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Rekonsiliasi pembayaran iuran sekolah secara transparan dengan pendekatan humanis tanpa mempermalukan siswa.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                    {stats.duePayments} Tagihan Jatuh Tempo
                                </span>
                            </div>
                        </div>

                        {/* Payments Table */}
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                            <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
                                <thead className="text-[11px] text-slate-700 dark:text-slate-200 uppercase bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-3">No. Invoice</th>
                                        <th className="px-4 py-3">Siswa & Kelas</th>
                                        <th className="px-4 py-3">Jenis Tagihan</th>
                                        <th className="px-4 py-3">Nominal</th>
                                        <th className="px-4 py-3">Jatuh Tempo</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {paymentList.map((pay) => (
                                        <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                                {pay.invoiceNo}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                <div>{pay.studentName}</div>
                                                <div className="text-[11px] font-normal text-slate-400">{pay.class}</div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {pay.type}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">
                                                Rp {pay.amount.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-[11px]">
                                                {pay.dueDate}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                                                        pay.status === 'Lunas'
                                                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200'
                                                            : pay.status === 'Menunggu Verifikasi'
                                                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
                                                    )}
                                                >
                                                    {pay.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {pay.status === 'Menunggu Verifikasi' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleVerifyPayment(pay.id)}
                                                            className="px-2 py-1 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded shadow-2xs transition-colors"
                                                        >
                                                            ✓ Verifikasi
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => toast.success(`Pemberitahuan santun untuk ${pay.studentName} berhasil dikirim ke WhatsApp orang tua!`)}
                                                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded hover:underline"
                                                    >
                                                        Kirim Pengingat
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

                {/* VIEW 9: TEACHER DOCUMENTS MODULE */}
                {activeTab === 'documents' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Modul 08: Dokumen Kinerja Guru & Administrasi
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Repositori terpusat SK Pembagian Tugas, Perangkat Ajar Kurikulum Merdeka, dan Sertifikasi Pendidik.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toast.success('Membuka formulir unggah dokumen guru.')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                            >
                                <UploadCloud className="w-3.5 h-3.5" />
                                Unggah Dokumen Guru
                            </button>
                        </div>

                        {/* Documents Table */}
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                            <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
                                <thead className="text-[11px] text-slate-700 dark:text-slate-200 uppercase bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-3">Nama Dokumen</th>
                                        <th className="px-4 py-3">Nama Guru</th>
                                        <th className="px-4 py-3">Kategori</th>
                                        <th className="px-4 py-3">Periode</th>
                                        <th className="px-4 py-3">Ukuran</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                                <span>{doc.title}</span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                                                {doc.teacher}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    {doc.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-[11px]">
                                                {doc.period}
                                            </td>
                                            <td className="px-4 py-3 text-slate-400 text-[11px]">
                                                {doc.size}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                                                        doc.status === 'Valid'
                                                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200'
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                    )}
                                                >
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => toast.success(`Mengunduh dokumen: ${doc.title}`)}
                                                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded hover:underline"
                                                >
                                                    Unduh Dokumen
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* VIEW 10: DAPODIK DATA CHECK MODULE */}
                {activeTab === 'data-check' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Modul 09: Cek Data Dapodik (Deteksi Anomali Operator)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Membantu operator menemukan inkonsistensi data sebelum administrasi resmi cut-off (data kosong, tugas tambahan tanpa SK, rombel kosong).
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toast.success('Sinkronisasi validasi data selesai. 7 anomali terdeteksi.')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Validasi Ulang Sekarang
                            </button>
                        </div>

                        <div className="space-y-3">
                            {dapodikIssues.map((issue) => (
                                <div
                                    key={issue.id}
                                    className="p-4 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'px-2 py-0.5 rounded text-[10px] font-bold',
                                                    issue.severity === 'Error'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                                )}
                                            >
                                                {issue.severity}
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">{issue.category}</span>
                                            <span className="text-[11px] text-slate-400">• {issue.targetName}</span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 font-medium">{issue.description}</p>
                                        <div className="text-[11px] text-slate-400">
                                            Field Terkait: <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold">{issue.field}</span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleResolveDapodikIssue(issue.id)}
                                            className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-2xs"
                                        >
                                            ✓ Tandai Selesai
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => toast.success(`Membuka tindakan koreksi: ${issue.action}`)}
                                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                        >
                                            {issue.action}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* VIEW 11: INCIDENT RESPONSE MODULE */}
                {activeTab === 'incidents' && (
                    <div className="p-5 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                                    <Siren className="w-5 h-5 text-red-600 animate-pulse" />
                                    Modul 10: Respons Insiden & Kesiapsiagaan Sekolah
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                                className="p-4 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-red-200 dark:border-red-900/60 space-y-4 text-xs"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{inc.title}</h4>
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Komandan Lapangan: <span className="text-slate-900 dark:text-slate-100 font-semibold">{inc.leadOfficer}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toast.error('Siaran darurat SMS & WhatsApp telah dikirim ke seluruh staf sekolah!')}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
                                    >
                                        <Siren className="w-3.5 h-3.5" />
                                        Siarkan Notifikasi Darurat
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                                        Checklist Kesiapsiagaan Tim Tanggap Sekolah:
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {inc.checklist.map((chk) => (
                                            <label
                                                key={chk.id}
                                                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={chk.done}
                                                    onChange={() => handleToggleChecklist(inc.id, chk.id)}
                                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                />
                                                <span
                                                    className={cn(
                                                        'text-xs font-medium',
                                                        chk.done
                                                            ? 'line-through text-slate-400'
                                                            : 'text-slate-900 dark:text-slate-100'
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
            {/* ACTION MODALS                                                             */}
            {/* ========================================================================= */}

            {/* Modal 1: Buat Follow-up Siswa */}
            {isFollowupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-base shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    Buat Tindakan / Follow-up Siswa
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFollowupModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
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
                                    className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                                        className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                                        className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                                    className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsFollowupModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-base shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <PhoneCall className="w-4 h-4 text-green-500" />
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    Kirim Pesan Terstruktur ke Orang Tua (Modul 04)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsParentContactModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
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
                                        className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kategori Pesan
                                    </label>
                                    <select
                                        value={parentCategory}
                                        onChange={(e) => setParentCategory(e.target.value)}
                                        className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                                    className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    required
                                />
                            </div>

                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] text-slate-600 dark:text-slate-300">
                                <strong>Fitur Acknowledgement PRD:</strong> Orang tua dapat mengonfirmasi receipt dengan status{' '}
                                <em>"Sudah Membaca"</em> atau <em>"Perlu Ditindaklanjuti"</em>.
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsParentContactModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-xs"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    Kirim Pesan (WhatsApp & App)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 3: Buka Kasus BK */}
            {isNewCaseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-base shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-blue-500" />
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    Buka Kasus BK & Kesiswaan (Modul 03)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNewCaseModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
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
                                    className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                                        className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="Kedisiplinan">Kedisiplinan & Tata Tertib</option>
                                        <option value="Kehadiran">Kehadiran (Bolos / Alpa Menahun)</option>
                                        <option value="Akademik">Akademik & Penurunan Nilai</option>
                                        <option value="Sosial">Sosial / Konflik Antar Teman</option>
                                        <option value="Sosial & Perlindungan">Perlindungan Siswa & Bullying</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Prioritas Kasus
                                    </label>
                                    <select
                                        value={newCasePriority}
                                        onChange={(e) => setNewCasePriority(e.target.value as any)}
                                        className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="Tinggi">Tinggi (&lt;24 jam)</option>
                                        <option value="Sedang">Sedang (Konseling terencana)</option>
                                        <option value="Rendah">Rendah (Pemantauan)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Deskripsi Kasus & Kronologi Singkat
                                </label>
                                <textarea
                                    rows={3}
                                    value={newCaseDesc}
                                    onChange={(e) => setNewCaseDesc(e.target.value)}
                                    placeholder="Jelaskan ringkasan peristiwa, indikasi, dan saksi jika ada..."
                                    className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsNewCaseModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-base shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Scale className="w-4 h-4 text-blue-500" />
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    Catat Pelanggaran & Pembinaan (Modul 05)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDisciplineModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
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
                                    className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                                        className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                                        className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                                    className="w-full p-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsDisciplineModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
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
