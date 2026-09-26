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

    return (
        <FlowbiteTanggapinLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
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

                    {/* Fast Switcher Tabs Bar */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                        <button
                            type="button"
                            onClick={() => setActiveTab('overview')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'overview'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            Ikhtisar
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('early-warning')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'early-warning'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            Early Warning
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('class-monitoring')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'class-monitoring'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            Kondisi Kelas
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('cases')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'cases'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            Kasus BK
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('discipline')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'discipline'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            Kedisiplinan
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('communication')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'communication'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            Ortu
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('ats')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'ats'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            ATS
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('payments')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'payments'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            SPP
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('documents')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'documents'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            Dokumen
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('data-check')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'data-check'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                        >
                            Dapodik
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('incidents')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                activeTab === 'incidents'
                                    ? 'bg-red-600 text-white font-semibold shadow-xs'
                                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50'
                            )}
                        >
                            Insiden
                        </button>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. DEDICATED MODULE VIEWS: SWITCHED CLEANLY BY activeTab                  */}
                {/* ========================================================================= */}

                {/* VIEW 1: OVERVIEW DASHBOARD */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        {/* Header Banner & Operational Question (PRD Section 8 & 9) */}
                        <div className="p-5 rounded-base bg-gradient-to-r from-blue-50/90 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/30 border border-blue-100 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-2xs">
                                        <Sparkles className="w-3 h-3" />
                                        TANGGAPIN WORKFLOW
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Tahun Ajaran 2025/2026 • Semester Ganjil
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    “Apa yang membutuhkan perhatian sekolah hari ini?”
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                                    Prinsip Operasional:{' '}
                                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                                        Temukan Masalah → Tentukan PIC → Lakukan Tindakan → Catat Hasil.
                                    </strong>
                                </p>
                            </div>

                            {/* Role Switcher Pills */}
                            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 self-start lg:self-center">
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2">Peran:</span>
                                {(['kepala_sekolah', 'wali_kelas', 'guru_bk', 'bendahara', 'operator'] as RoleType[]).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setCurrentRole(r)}
                                        className={cn(
                                            'px-2.5 py-1 text-xs rounded-md font-medium transition-colors',
                                            currentRole === r
                                                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        )}
                                    >
                                        {r === 'kepala_sekolah' ? 'Kepala Sekolah' : r === 'wali_kelas' ? 'Wali Kelas' : r === 'guru_bk' ? 'Guru BK' : r === 'bendahara' ? 'Bendahara' : 'Operator'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Top 5 Metric Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                            {/* Card 1: Early Warning */}
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

                            {/* Card 2: Kasus BK */}
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
                                    Kasus belum ditangani &gt;48j
                                </p>
                                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                    <span>Buka Timeline</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            {/* Card 3: Data Check */}
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
                                    {stats.dataCheckIssues}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                    Data perlu validasi sebelum cut-off
                                </p>
                                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                    <span>Periksa Anomali</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            {/* Card 4: SPP & Tagihan */}
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

                            {/* Card 5: Tanggap Darurat */}
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

                        {/* Priority Feed (PRD Section 8, 24: DATA → ACTION) */}
                        <div className="p-4 rounded-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-red-500 animate-ping" />
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        Priority Action Feed — Hal Mendesak Hari Ini
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
                            {/* Class Health Preview */}
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

                            {/* Case Pipeline Preview */}
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
                            {classes.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="p-4 rounded-base bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">{cls.name}</h4>
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
                            ))}
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
                                                <button
                                                    type="button"
                                                    onClick={() => toast.success(`Pemberitahuan santun untuk ${pay.studentName} berhasil dikirim ke WhatsApp orang tua!`)}
                                                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded hover:underline"
                                                >
                                                    Kirim Pengingat
                                                </button>
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

                                    <div className="shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => toast.success(`Membuka tindakan koreksi: ${issue.action}`)}
                                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
