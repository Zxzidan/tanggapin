import { Head } from '@inertiajs/react';
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
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type {
    AtsItem,
    CaseItem,
    ClassMonitoringItem,
    DapodikIssue,
    DashboardPageProps,
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
}: DashboardPageProps) {
    const [currentRole, setCurrentRole] = useState<RoleType>('kepala_sekolah');
    const [activeTab, setActiveTab] = useState<string>('overview');

    // Local reactive state
    const [stats, setStats] = useState(initialStats || {
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

    // Modals
    const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
    const [isParentContactModalOpen, setIsParentContactModalOpen] = useState(false);
    const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
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

    // Trigger action from topbar or buttons
    const handleTriggerActionModal = (actionType: string, studentName?: string) => {
        if (studentName) {
            setSelectedStudentName(studentName);
        }
        if (actionType === 'followup') {
            setIsFollowupModalOpen(true);
        } else if (actionType === 'parent_contact') {
            setIsParentContactModalOpen(true);
        } else if (actionType === 'new_case') {
            setIsNewCaseModalOpen(true);
        }
    };

    // Submit Follow-up
    const handleSaveFollowup = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`Follow-up untuk ${selectedStudentName} berhasil dibuat!`, {
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
    };

    // Submit Parent Contact
    const handleSendParentMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const newMsg: ParentUpdate = {
            id: `msg-${Date.now()}`,
            studentName: selectedStudentName,
            parentName: 'Orang Tua Siswa',
            category: parentCategory,
            message: parentCustomMessage,
            date: 'Baru saja',
            status: 'Terkirim via WhatsApp & Tanggapin App',
            acknowledgement: 'Perlu ditindaklanjuti',
        };
        setParentUpdates([newMsg, ...parentUpdates]);
        toast.success(`Pesan terstruktur berhasil dikirim ke orang tua ${selectedStudentName}!`);
        setIsParentContactModalOpen(false);
    };

    // Submit New Case
    const handleCreateCase = (e: React.FormEvent) => {
        e.preventDefault();
        const newCaseItem: CaseItem = {
            id: `case-${Date.now()}`,
            code: `CS-2025-${Math.floor(100 + Math.random() * 900)}`,
            studentName: selectedStudentName,
            class: 'XI RPL 2',
            category: newCaseCategory,
            priority: newCasePriority,
            stage: 'new',
            stageLabel: 'Baru Masuk',
            assignee: 'Koordinator BK',
            lastActivity: newCaseDesc || 'Kasus baru dibuat dan menunggu verifikasi BK.',
            lastUpdate: 'Baru saja',
            timeline: [{ time: 'Hari ini', title: 'Kasus dibuat', actor: 'Petugas Sekolah' }],
        };
        setCases([newCaseItem, ...cases]);
        setStats((prev) => ({ ...prev, activeCases: prev.activeCases + 1 }));
        toast.success(`Kasus ${newCaseItem.code} untuk ${selectedStudentName} berhasil didaftarkan!`);
        setIsNewCaseModalOpen(false);
        setNewCaseDesc('');
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

    return (
        <FlowbiteTanggapinLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            onTriggerActionModal={handleTriggerActionModal}
        >
            <Head title="Dashboard Operasional - Tanggapin" />

            {/* Container matching user's Flowbite template outer wrapper: p-4 border-1 border-default border-dashed rounded-base */}
            <div className="p-4 border-1 border-default border-dashed rounded-base bg-neutral-primary-soft dark:bg-neutral-900 shadow-2xs space-y-5">
                {/* 1. Header Banner & Operational Question (PRD Section 8 & 9) */}
                <div className="p-4 sm:p-5 rounded-base bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 dark:from-neutral-800/80 dark:via-neutral-900 dark:to-neutral-800/50 border border-blue-100 dark:border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white shadow-2xs">
                                <Sparkles className="w-3 h-3" />
                                TANGGAPIN WORKFLOW
                            </span>
                            <span className="text-xs text-body font-medium">
                                Tahun Ajaran 2025/2026 • Semester Ganjil
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-heading tracking-tight">
                            “Apa yang membutuhkan perhatian sekolah hari ini?”
                        </h1>
                        <p className="text-xs sm:text-sm text-body mt-0.5">
                            Prinsip Operasional:{' '}
                            <strong className="text-heading font-semibold">
                                Temukan Masalah → Tentukan PIC → Lakukan Tindakan → Catat Hasil.
                            </strong>
                        </p>
                    </div>

                    {/* Role Switcher Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-neutral-secondary-soft p-1.5 rounded-base border border-default self-start lg:self-center">
                        <span className="text-[11px] font-semibold text-fg-disabled px-2">Peran:</span>
                        <button
                            type="button"
                            onClick={() => setCurrentRole('kepala_sekolah')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded font-medium transition-colors',
                                currentRole === 'kepala_sekolah'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-body hover:bg-neutral-tertiary'
                            )}
                        >
                            Kepala Sekolah
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentRole('wali_kelas')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded font-medium transition-colors',
                                currentRole === 'wali_kelas'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-body hover:bg-neutral-tertiary'
                            )}
                        >
                            Wali Kelas
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentRole('guru_bk')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded font-medium transition-colors',
                                currentRole === 'guru_bk'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-body hover:bg-neutral-tertiary'
                            )}
                        >
                            Guru BK
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentRole('bendahara')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded font-medium transition-colors',
                                currentRole === 'bendahara'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-body hover:bg-neutral-tertiary'
                            )}
                        >
                            Bendahara
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentRole('operator')}
                            className={cn(
                                'px-2.5 py-1 text-xs rounded font-medium transition-colors',
                                currentRole === 'operator'
                                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                    : 'text-body hover:bg-neutral-tertiary'
                            )}
                        >
                            Operator
                        </button>
                    </div>
                </div>

                {/* 2. Top Metric Cards (Replaces the top 3 placeholder boxes in user's snippet with PRD Section 8 Action Cards) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {/* Metric 1: Early Warning */}
                    <div
                        onClick={() => setActiveTab('early-warning')}
                        className="p-3.5 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default hover:border-red-400 dark:hover:border-red-600 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-fg-disabled uppercase tracking-wider">
                                Early Warning
                            </span>
                            <div className="p-1 rounded bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-heading text-red-600 dark:text-red-400 tracking-tight">
                            {stats.studentsNeedingAttention}
                        </div>
                        <p className="text-xs text-body mt-0.5 leading-snug">
                            Siswa butuh follow-up segera
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-default flex items-center justify-between text-[11px] text-fg-brand font-medium">
                            <span>Tindak Lanjuti</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Metric 2: Kasus Aktif BK */}
                    <div
                        onClick={() => setActiveTab('cases')}
                        className="p-3.5 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-fg-disabled uppercase tracking-wider">
                                Kasus BK
                            </span>
                            <div className="p-1 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                <ShieldAlert className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-heading text-amber-600 dark:text-amber-400 tracking-tight">
                            {stats.activeCases}
                        </div>
                        <p className="text-xs text-body mt-0.5 leading-snug">
                            {stats.overdueCases} kasus belum ditangani &gt;48j
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-default flex items-center justify-between text-[11px] text-fg-brand font-medium">
                            <span>Buka Timeline</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Metric 3: Validasi Data Dapodik */}
                    <div
                        onClick={() => setActiveTab('data-check')}
                        className="p-3.5 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-fg-disabled uppercase tracking-wider">
                                Data Check
                            </span>
                            <div className="p-1 rounded bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-heading text-blue-600 dark:text-blue-400 tracking-tight">
                            {stats.dataCheckIssues}
                        </div>
                        <p className="text-xs text-body mt-0.5 leading-snug">
                            Data perlu validasi sebelum cut-off
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-default flex items-center justify-between text-[11px] text-fg-brand font-medium">
                            <span>Periksa Anomali</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Metric 4: Pembayaran Jatuh Tempo */}
                    <div
                        onClick={() => setActiveTab('payments')}
                        className="p-3.5 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-fg-disabled uppercase tracking-wider">
                                SPP & Tagihan
                            </span>
                            <div className="p-1 rounded bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                <CreditCard className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-heading text-purple-600 dark:text-purple-400 tracking-tight">
                            {stats.duePayments}
                        </div>
                        <p className="text-xs text-body mt-0.5 leading-snug">
                            Tagihan jatuh tempo & verifikasi
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-default flex items-center justify-between text-[11px] text-fg-brand font-medium">
                            <span>Rekonsiliasi</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Metric 5: Tanggap Bencana & North Star */}
                    <div
                        onClick={() => setActiveTab('incidents')}
                        className="p-3.5 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default hover:border-red-400 dark:hover:border-red-600 transition-all cursor-pointer group shadow-2xs hover:shadow-xs col-span-2 sm:col-span-1"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-fg-disabled uppercase tracking-wider">
                                Tanggap Darurat
                            </span>
                            <div className="p-1 rounded bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 animate-pulse">
                                <Siren className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-heading text-red-600 dark:text-red-400 tracking-tight flex items-center gap-1.5">
                            <span>1</span>
                            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                Waspada
                            </span>
                        </div>
                        <p className="text-xs text-body mt-0.5 leading-snug">
                            Siaga cuaca ekstrem musim hujan
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-default flex items-center justify-between text-[11px] text-fg-brand font-medium">
                            <span>Checklist Darurat</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* 3. Priority Feed (PRD Section 8, 24: DATA → ACTION) */}
                <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs">
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-default">
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-red-500 animate-ping" />
                            <h2 className="text-sm font-bold text-heading">
                                Priority Action Feed — Hal Mendesak Hari Ini
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-fg-disabled">
                            <span>North Star Metric:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
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
                                        ? 'bg-neutral-secondary-soft/50 border-default opacity-60'
                                        : 'bg-white dark:bg-neutral-950 border-red-200 dark:border-red-900/60 shadow-2xs'
                                )}
                            >
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold text-heading text-sm">
                                            {alert.studentName}
                                        </span>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-secondary-medium text-body border border-default">
                                            {alert.class}
                                        </span>
                                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800">
                                            {alert.triggerType}
                                        </span>
                                        <span className="text-[11px] text-fg-disabled">
                                            • {alert.timestamp}
                                        </span>
                                        {alert.actionTaken && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                                                ✓ Telah Ditindaklanjuti
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-body leading-relaxed">
                                        {alert.summary}
                                    </p>
                                    <div className="text-[11px] text-fg-disabled flex items-center gap-3 pt-0.5">
                                        <span>Wali Kelas: {alert.homeroomTeacher}</span>
                                        <span>Orang Tua: {alert.parentName} ({alert.parentPhone})</span>
                                    </div>
                                </div>

                                {/* Instant Action Buttons (DATA → ACTION) */}
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
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-base shadow-xs transition-colors"
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
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-heading bg-neutral-secondary-medium hover:bg-neutral-tertiary border border-default rounded-base transition-colors"
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
                                        className="p-1.5 text-body hover:text-heading hover:bg-neutral-tertiary rounded-base border border-transparent hover:border-default transition-colors"
                                        title="Eskalasi ke Kasus BK"
                                    >
                                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Sub-Navigation / Operational Modules Tabs */}
                <div className="border-b border-default overflow-x-auto">
                    <ul className="flex flex-wrap -mb-px text-xs font-medium text-center text-body">
                        <li className="me-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('overview')}
                                className={cn(
                                    'inline-flex items-center p-3 border-b-2 rounded-t-lg transition-colors gap-2',
                                    activeTab === 'overview'
                                        ? 'text-fg-brand border-blue-600 font-semibold'
                                        : 'border-transparent hover:text-heading hover:border-default'
                                )}
                            >
                                <Layers className="w-4 h-4" />
                                Ikhtisar Operasional
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('early-warning')}
                                className={cn(
                                    'inline-flex items-center p-3 border-b-2 rounded-t-lg transition-colors gap-2',
                                    activeTab === 'early-warning'
                                        ? 'text-fg-brand border-blue-600 font-semibold'
                                        : 'border-transparent hover:text-heading hover:border-default'
                                )}
                            >
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                Early Warning (12)
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('class-monitoring')}
                                className={cn(
                                    'inline-flex items-center p-3 border-b-2 rounded-t-lg transition-colors gap-2',
                                    activeTab === 'class-monitoring'
                                        ? 'text-fg-brand border-blue-600 font-semibold'
                                        : 'border-transparent hover:text-heading hover:border-default'
                                )}
                            >
                                <GraduationCap className="w-4 h-4" />
                                Kondisi Kelas
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('cases')}
                                className={cn(
                                    'inline-flex items-center p-3 border-b-2 rounded-t-lg transition-colors gap-2',
                                    activeTab === 'cases'
                                        ? 'text-fg-brand border-blue-600 font-semibold'
                                        : 'border-transparent hover:text-heading hover:border-default'
                                )}
                            >
                                <ShieldAlert className="w-4 h-4 text-amber-500" />
                                Kasus BK (4)
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('communication')}
                                className={cn(
                                    'inline-flex items-center p-3 border-b-2 rounded-t-lg transition-colors gap-2',
                                    activeTab === 'communication'
                                        ? 'text-fg-brand border-blue-600 font-semibold'
                                        : 'border-transparent hover:text-heading hover:border-default'
                                )}
                            >
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                                Komunikasi Ortu
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('ats')}
                                className={cn(
                                    'inline-flex items-center p-3 border-b-2 rounded-t-lg transition-colors gap-2',
                                    activeTab === 'ats'
                                        ? 'text-fg-brand border-blue-600 font-semibold'
                                        : 'border-transparent hover:text-heading hover:border-default'
                                )}
                            >
                                <UserCheck className="w-4 h-4 text-green-500" />
                                Lapangan ATS
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('data-check')}
                                className={cn(
                                    'inline-flex items-center p-3 border-b-2 rounded-t-lg transition-colors gap-2',
                                    activeTab === 'data-check'
                                        ? 'text-fg-brand border-blue-600 font-semibold'
                                        : 'border-transparent hover:text-heading hover:border-default'
                                )}
                            >
                                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                                Cek Dapodik (7)
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('incidents')}
                                className={cn(
                                    'inline-flex items-center p-3 border-b-2 rounded-t-lg transition-colors gap-2',
                                    activeTab === 'incidents'
                                        ? 'text-fg-brand border-blue-600 font-semibold'
                                        : 'border-transparent hover:text-heading hover:border-default'
                                )}
                            >
                                <Siren className="w-4 h-4 text-red-500" />
                                Respons Darurat
                            </button>
                        </li>
                    </ul>
                </div>

                {/* 5. TAB CONTENTS BASED ON PRD_tanggapin.md */}

                {/* TAB 1: OVERVIEW (Combines Class Health + Case Pipeline) */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Class Health Monitoring (PRD Section 2) */}
                        <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-default">
                                <div>
                                    <h3 className="font-bold text-heading text-sm">
                                        Class Health — Indikator Kondisi Kelas
                                    </h3>
                                    <p className="text-[11px] text-body">
                                        Bukan melabeli siswa, melainkan mendeteksi kelas yang memerlukan dukungan.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('class-monitoring')}
                                    className="text-xs text-fg-brand hover:underline flex items-center gap-1 font-medium"
                                >
                                    Semua Kelas <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {classes.map((cls) => (
                                    <div
                                        key={cls.id}
                                        className="p-3 rounded-base bg-neutral-secondary-soft border border-default hover:border-blue-300 dark:hover:border-neutral-700 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div>
                                                <span className="font-bold text-heading text-sm me-2">
                                                    {cls.name}
                                                </span>
                                                <span className="text-xs text-fg-disabled">
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

                                        <div className="grid grid-cols-3 gap-2 text-xs py-1 text-body">
                                            <div>
                                                <span className="text-[10px] text-fg-disabled block">Kehadiran</span>
                                                <span className="font-semibold text-heading">{cls.attendanceRate}%</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-fg-disabled block">Siswa Berisiko</span>
                                                <span className="font-semibold text-red-600">{cls.studentsAtRisk} siswa</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-fg-disabled block">Follow-up Pending</span>
                                                <span className="font-semibold text-amber-600">{cls.pendingFollowups} kasus</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between text-[11px] text-fg-disabled pt-1.5 border-t border-default/50">
                                            <span>Wali: {cls.homeroomTeacher}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedStudentName(`Siswa ${cls.name}`);
                                                    setIsFollowupModalOpen(true);
                                                }}
                                                className="text-fg-brand hover:underline font-semibold"
                                            >
                                                + Tangani Kelas
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Case Workflow Pipeline (PRD Section 3) */}
                        <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-default">
                                <div>
                                    <h3 className="font-bold text-heading text-sm">
                                        Workflow Kasus BK & Kesiswaan (Modul 03)
                                    </h3>
                                    <p className="text-[11px] text-body">
                                        Alur kerja: Baru → Ditugaskan → In Progress → Follow-up → Selesai
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleTriggerActionModal('new_case')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-base shadow-xs"
                                >
                                    <Plus className="w-3 h-3" />
                                    Buka Kasus
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {cases.map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-3 rounded-base bg-neutral-secondary-soft border border-default space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                    {c.code}
                                                </span>
                                                <span className="text-xs font-semibold text-heading">
                                                    {c.studentName}
                                                </span>
                                                <span className="text-[10px] text-fg-disabled">({c.class})</span>
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

                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="px-2 py-0.5 rounded bg-neutral-secondary-medium text-heading font-medium text-[11px]">
                                                {c.category}
                                            </span>
                                            <span className="text-fg-disabled text-[11px]">• Status:</span>
                                            <span className="font-semibold text-blue-600 dark:text-blue-400 text-[11px]">
                                                {c.stageLabel}
                                            </span>
                                        </div>

                                        <p className="text-xs text-body leading-relaxed bg-white dark:bg-neutral-950 p-2 rounded border border-default">
                                            {c.lastActivity}
                                        </p>

                                        <div className="flex items-center justify-between text-[11px] text-fg-disabled pt-1">
                                            <span>PIC: {c.assignee}</span>
                                            <span className="font-medium text-fg-brand">
                                                Update: {c.lastUpdate}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: EARLY WARNING (PRD Section 1) */}
                {activeTab === 'early-warning' && (
                    <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default">
                            <div>
                                <h3 className="font-bold text-heading text-base">
                                    Modul 01: Early Warning & Profil Risiko Siswa
                                </h3>
                                <p className="text-xs text-body">
                                    Mendeteksi pola risiko siswa sebelum berkembang menjadi masalah besar. Sistem menandai pemicu (trigger), bukan vonis/label.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300">
                                    12 Siswa Dalam Pantauan
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left text-body">
                                <thead className="text-[11px] text-heading uppercase bg-neutral-secondary-soft border-b border-default">
                                    <tr>
                                        <th className="px-3 py-2.5">Siswa & Kelas</th>
                                        <th className="px-3 py-2.5">Pemicu Risiko (Trigger)</th>
                                        <th className="px-3 py-2.5">Indikator Terdeteksi</th>
                                        <th className="px-3 py-2.5">Wali Kelas</th>
                                        <th className="px-3 py-2.5">Orang Tua</th>
                                        <th className="px-3 py-2.5 text-center">Aksi Operasional</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-default">
                                    {priorityFeed.map((item) => (
                                        <tr key={item.id} className="hover:bg-neutral-secondary-soft transition-colors">
                                            <td className="px-3 py-3 font-semibold text-heading">
                                                <div>{item.studentName}</div>
                                                <div className="text-[11px] font-normal text-fg-disabled">{item.class}</div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                                    {item.triggerType}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 max-w-xs text-[11px]">
                                                {item.summary}
                                            </td>
                                            <td className="px-3 py-3 text-[11px]">
                                                {item.homeroomTeacher}
                                            </td>
                                            <td className="px-3 py-3 text-[11px]">
                                                <div>{item.parentName}</div>
                                                <div className="text-fg-disabled">{item.parentPhone}</div>
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedStudentName(`${item.studentName} (${item.class})`);
                                                            setSelectedStudentPhone(item.parentPhone);
                                                            setIsFollowupModalOpen(true);
                                                        }}
                                                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
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
                                                        className="px-2 py-1 text-[11px] font-medium bg-neutral-secondary-medium hover:bg-neutral-tertiary border border-default rounded text-heading"
                                                        title="Hubungi Orang Tua"
                                                    >
                                                        <PhoneCall className="w-3.5 h-3.5 text-green-600" />
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

                {/* TAB 3: CLASS MONITORING (PRD Section 2) */}
                {activeTab === 'class-monitoring' && (
                    <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-default">
                            <div>
                                <h3 className="font-bold text-heading text-base">
                                    Modul 02: Class Monitoring — Halaman Wali Kelas
                                </h3>
                                <p className="text-xs text-body">
                                    Memberikan wali kelas satu halaman untuk melihat kondisi kelas, tren kehadiran, dan tindak lanjut siswa.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    toast.success('Pencatatan absensi kelas XI RPL 2 hari ini dibuka.');
                                    setSelectedStudentName('Kelas XI RPL 2');
                                    setIsFollowupModalOpen(true);
                                }}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-base shadow-xs"
                            >
                                + Catat Absensi Hari Ini
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {classes.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="p-4 rounded-base bg-neutral-secondary-soft border border-default space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-heading text-base">{cls.name}</h4>
                                        <span className="text-[11px] font-semibold text-fg-disabled">
                                            {cls.totalStudents} Siswa
                                        </span>
                                    </div>
                                    <p className="text-xs text-body">{cls.major}</p>

                                    <div className="space-y-1.5 pt-2 border-t border-default">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-fg-disabled">Kehadiran:</span>
                                            <span className="font-bold text-heading">{cls.attendanceRate}%</span>
                                        </div>
                                        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5">
                                            <div
                                                className={cn(
                                                    'h-1.5 rounded-full',
                                                    cls.attendanceRate >= 95
                                                        ? 'bg-green-500'
                                                        : cls.attendanceRate >= 90
                                                        ? 'bg-amber-500'
                                                        : 'bg-red-500'
                                                )}
                                                style={{ width: `${cls.attendanceRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                                        <div className="p-2 rounded bg-white dark:bg-neutral-950 border border-default">
                                            <span className="text-[10px] text-fg-disabled block">Butuh Perhatian</span>
                                            <span className="font-bold text-red-600">{cls.studentsAtRisk} siswa</span>
                                        </div>
                                        <div className="p-2 rounded bg-white dark:bg-neutral-950 border border-default">
                                            <span className="text-[10px] text-fg-disabled block">Follow-up Belum</span>
                                            <span className="font-bold text-amber-600">{cls.pendingFollowups} pending</span>
                                        </div>
                                    </div>

                                    <div className="text-[11px] text-fg-disabled">
                                        Wali: <span className="font-medium text-heading">{cls.homeroomTeacher}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 4: CASE MANAGEMENT (PRD Section 3) */}
                {activeTab === 'cases' && (
                    <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default">
                            <div>
                                <h3 className="font-bold text-heading text-base">
                                    Modul 03: Case Management (Alur Penanganan Kasus)
                                </h3>
                                <p className="text-xs text-body">
                                    Mengubah penanganan siswa dari chat informal menjadi workflow terstruktur dan terdokumentasi rapi.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleTriggerActionModal('new_case')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-base shadow-xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Buat Kasus Baru (BK)
                            </button>
                        </div>

                        {/* Kanban Workflow Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                            {/* Column 1: Baru */}
                            <div className="p-3 rounded-base bg-neutral-secondary-soft border border-default space-y-2.5">
                                <div className="flex items-center justify-between font-bold text-heading pb-1 border-b border-default">
                                    <span>1. Kasus Baru</span>
                                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px]">
                                        {cases.filter((c) => c.stage === 'new').length}
                                    </span>
                                </div>
                                {cases
                                    .filter((c) => c.stage === 'new')
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="p-2.5 rounded-base bg-white dark:bg-neutral-950 border border-default space-y-1.5 shadow-2xs"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-heading">{c.studentName}</span>
                                                <span className="text-[10px] text-red-600 font-semibold">{c.priority}</span>
                                            </div>
                                            <p className="text-[11px] text-body">{c.lastActivity}</p>
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
                                                    toast.success(`Kasus ${c.code} ditugaskan ke Guru BK!`);
                                                }}
                                                className="w-full text-center py-1 text-[11px] bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold rounded hover:bg-blue-100"
                                            >
                                                Tugaskan ke BK →
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Column 2: Ditugaskan */}
                            <div className="p-3 rounded-base bg-neutral-secondary-soft border border-default space-y-2.5">
                                <div className="flex items-center justify-between font-bold text-heading pb-1 border-b border-default">
                                    <span>2. Ditugaskan</span>
                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px]">
                                        {cases.filter((c) => c.stage === 'assigned').length}
                                    </span>
                                </div>
                                {cases
                                    .filter((c) => c.stage === 'assigned')
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="p-2.5 rounded-base bg-white dark:bg-neutral-950 border border-default space-y-1.5 shadow-2xs"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-heading">{c.studentName}</span>
                                                <span className="text-[10px] text-blue-600 font-semibold">{c.category}</span>
                                            </div>
                                            <p className="text-[11px] text-body">{c.lastActivity}</p>
                                            <div className="text-[10px] text-fg-disabled">PIC: {c.assignee}</div>
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
                                                    toast.success(`Kasus ${c.code} masuk tahap penanganan konseling.`);
                                                }}
                                                className="w-full text-center py-1 text-[11px] bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-semibold rounded hover:bg-amber-100"
                                            >
                                                Mulai Konseling →
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Column 3: Sedang Ditangani */}
                            <div className="p-3 rounded-base bg-neutral-secondary-soft border border-default space-y-2.5">
                                <div className="flex items-center justify-between font-bold text-heading pb-1 border-b border-default">
                                    <span>3. Sedang Ditangani</span>
                                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px]">
                                        {cases.filter((c) => c.stage === 'in_progress').length}
                                    </span>
                                </div>
                                {cases
                                    .filter((c) => c.stage === 'in_progress')
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="p-2.5 rounded-base bg-white dark:bg-neutral-950 border border-default space-y-1.5 shadow-2xs"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-heading">{c.studentName}</span>
                                                <span className="text-[10px] text-fg-disabled">{c.code}</span>
                                            </div>
                                            <p className="text-[11px] text-body">{c.lastActivity}</p>
                                            <div className="text-[10px] text-fg-disabled">PIC: {c.assignee}</div>
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
                                                    toast.success(`Kasus ${c.code} telah diselesaikan dan terdokumentasi!`);
                                                }}
                                                className="w-full text-center py-1 text-[11px] bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 font-semibold rounded hover:bg-green-100"
                                            >
                                                Selesaikan Kasus ✓
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            {/* Column 4: Selesai */}
                            <div className="p-3 rounded-base bg-neutral-secondary-soft border border-default space-y-2.5">
                                <div className="flex items-center justify-between font-bold text-heading pb-1 border-b border-default">
                                    <span>4. Selesai (Arsip)</span>
                                    <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[10px]">
                                        {cases.filter((c) => c.stage === 'resolved').length + 18}
                                    </span>
                                </div>
                                <div className="p-2.5 rounded-base bg-white dark:bg-neutral-950 border border-default text-[11px] text-body">
                                    <div className="font-semibold text-heading">18 Kasus Bulan Ini</div>
                                    <p className="text-[10px] text-fg-disabled mt-0.5">
                                        Seluruh dokumen konseling, komitmen siswa, dan laporan ortu tersimpan di arsip digital.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: KOMUNIKASI ORANG TUA (PRD Section 4) */}
                {activeTab === 'communication' && (
                    <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default">
                            <div>
                                <h3 className="font-bold text-heading text-base">
                                    Modul 04: Komunikasi Orang Tua Terstruktur
                                </h3>
                                <p className="text-xs text-body">
                                    Menyediakan komunikasi sekolah–orang tua berbasis data tanpa saling menyalahkan di grup chat. Memiliki status tanda terima (acknowledgement).
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleTriggerActionModal('parent_contact')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-base shadow-xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Kirim Pesan Terstruktur
                            </button>
                        </div>

                        <div className="space-y-3">
                            {parentUpdates.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="p-3.5 rounded-base bg-neutral-secondary-soft border border-default flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-heading">{msg.studentName}</span>
                                            <span className="text-[11px] text-fg-disabled">• Wali: {msg.parentName}</span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                {msg.category}
                                            </span>
                                            <span className="text-[10px] text-fg-disabled">• {msg.date}</span>
                                        </div>
                                        <p className="text-body text-xs bg-white dark:bg-neutral-950 p-2.5 rounded border border-default">
                                            {msg.message}
                                        </p>
                                        <div className="text-[11px] text-fg-disabled">
                                            Saluran Pengiriman: <span className="font-medium text-heading">{msg.status}</span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex flex-col items-end gap-1">
                                        <span className="text-[11px] text-fg-disabled">Status Tanggapan Ortu:</span>
                                        <span
                                            className={cn(
                                                'px-2.5 py-1 text-xs font-semibold rounded-full border',
                                                msg.acknowledgement === 'Sudah membaca'
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200'
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

                {/* TAB 6: LAPANGAN ATS (PRD Section 6) */}
                {activeTab === 'ats' && (
                    <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default">
                            <div>
                                <h3 className="font-bold text-heading text-base">
                                    Modul 06: ATS Field Workflow (Anak Tidak Sekolah)
                                </h3>
                                <p className="text-xs text-body">
                                    Workflow penanganan verifikasi lapangan & intervensi: Ditugaskan → Kunjungan → Terverifikasi → Intervensi → Kembali Sekolah.
                                </p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-secondary-medium border border-default text-heading">
                                Satgas ATS Terpadu
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {atsList.map((ats) => (
                                <div
                                    key={ats.id}
                                    className="p-3.5 rounded-base bg-neutral-secondary-soft border border-default space-y-2.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-heading text-sm">{ats.studentName}</span>
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                            {ats.lastClass}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-body flex items-start gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{ats.address}</span>
                                    </div>
                                    <div className="p-2 rounded bg-white dark:bg-neutral-950 border border-default space-y-1">
                                        <div className="text-[10px] text-fg-disabled">Identifikasi Masalah:</div>
                                        <div className="font-medium text-heading">{ats.reason}</div>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-default text-[11px]">
                                        <span className="text-fg-disabled">Petugas: {ats.officer}</span>
                                        <span className="font-bold text-amber-600 dark:text-amber-400">
                                            {ats.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => toast.success(`Jadwal kunjungan untuk ${ats.studentName} dikonfirmasi!`)}
                                            className="w-full py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                        >
                                            Update Hasil Kunjungan
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 7: DATA CHECK DAPODIK (PRD Section 9) */}
                {activeTab === 'data-check' && (
                    <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default">
                            <div>
                                <h3 className="font-bold text-heading text-base">
                                    Modul 09: Cek Data Dapodik (Deteksi Anomali Operator)
                                </h3>
                                <p className="text-xs text-body">
                                    Membantu operator menemukan inkonsistensi data sebelum administrasi resmi cut-off (data kosong, tugas tambahan tanpa SK, rombel kosong).
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toast.success('Sinkronisasi validasi data selesai. 7 anomali terdeteksi.')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-base shadow-xs"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Validasi Ulang Sekarang
                            </button>
                        </div>

                        <div className="space-y-3">
                            {dapodikIssues.map((issue) => (
                                <div
                                    key={issue.id}
                                    className="p-3.5 rounded-base bg-neutral-secondary-soft border border-default flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
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
                                            <span className="font-semibold text-heading">{issue.category}</span>
                                            <span className="text-[11px] text-fg-disabled">• {issue.targetName}</span>
                                        </div>
                                        <p className="text-body font-medium">{issue.description}</p>
                                        <div className="text-[11px] text-fg-disabled">
                                            Field Terkait: <span className="font-mono text-heading">{issue.field}</span>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => toast.success(`Membuka tindakan koreksi: ${issue.action}`)}
                                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                        >
                                            {issue.action}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 8: RESPONS INSIDEN DARURAT (PRD Section 10) */}
                {activeTab === 'incidents' && (
                    <div className="p-4 rounded-base bg-neutral-primary-soft dark:bg-neutral-900 border border-default shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default">
                            <div>
                                <h3 className="font-bold text-heading text-base flex items-center gap-2">
                                    <Siren className="w-5 h-5 text-red-600 animate-pulse" />
                                    Modul 10: Respons Insiden & Kesiapsiagaan Sekolah
                                </h3>
                                <p className="text-xs text-body">
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
                                className="p-4 rounded-base bg-neutral-secondary-soft border border-red-200 dark:border-red-900/60 space-y-3 text-xs"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h4 className="font-bold text-heading text-sm">{inc.title}</h4>
                                        <div className="text-[11px] text-fg-disabled">
                                            Komandan Lapangan: <span className="text-heading font-medium">{inc.leadOfficer}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toast.success('Broadcast darurat berhasil dikirim ke seluruh staf & wali murid!')}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-base shadow-xs"
                                    >
                                        <PhoneCall className="w-3.5 h-3.5" />
                                        Broadcast Status Darurat
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <span className="font-semibold text-heading text-xs block mb-2">
                                        Checklist Evakuasi & Pengamanan:
                                    </span>
                                    <div className="space-y-2">
                                        {inc.checklist.map((chk) => (
                                            <label
                                                key={chk.id}
                                                className="flex items-center gap-2.5 p-2 rounded bg-white dark:bg-neutral-950 border border-default cursor-pointer hover:bg-neutral-secondary-medium transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={chk.done}
                                                    onChange={() => handleToggleChecklist(inc.id, chk.id)}
                                                    className="w-4 h-4 text-blue-600 rounded border-default focus:ring-blue-500"
                                                />
                                                <span
                                                    className={cn(
                                                        'text-xs font-medium',
                                                        chk.done
                                                            ? 'line-through text-fg-disabled'
                                                            : 'text-heading'
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
            {/* INTERACTIVE MODALS FOR TANGGAPIN ACTIONS (PRD Principle: DATA -> ACTION) */}
            {/* ========================================================================= */}

            {/* Modal 1: Buat Follow-up Siswa */}
            {isFollowupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-neutral-primary-medium border border-default-medium rounded-base shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-default">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                <h3 className="font-bold text-heading text-sm">
                                    Buat Tindakan / Follow-up Siswa
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFollowupModalOpen(false)}
                                className="text-fg-disabled hover:text-heading"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveFollowup} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-heading mb-1">
                                    Target Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    onChange={(e) => setSelectedStudentName(e.target.value)}
                                    className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-heading mb-1">
                                        Jenis Follow-up
                                    </label>
                                    <select
                                        value={followupType}
                                        onChange={(e) => setFollowupType(e.target.value)}
                                        className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    >
                                        <option value="Panggilan Orang Tua">Panggilan Orang Tua</option>
                                        <option value="Konseling Tatap Muka BK">Konseling Tatap Muka BK</option>
                                        <option value="Home Visit (Kunjungan Rumah)">Home Visit (Kunjungan Rumah)</option>
                                        <option value="Remidial / Pembinaan Belajar">Remidial / Pembinaan Belajar</option>
                                        <option value="Perjanjian Komitmen Siswa">Perjanjian Komitmen Siswa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-heading mb-1">
                                        Penanggung Jawab (PIC)
                                    </label>
                                    <select
                                        value={followupAssignee}
                                        onChange={(e) => setFollowupAssignee(e.target.value)}
                                        className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    >
                                        <option value="Wali Kelas (Hendra Setiawan, S.Pd)">Wali Kelas (Hendra Setiawan, S.Pd)</option>
                                        <option value="Guru BK (Rahmawati, S.Pd)">Guru BK (Rahmawati, S.Pd)</option>
                                        <option value="Kesiswaan (Bpk. Faisal)">Kesiswaan (Bpk. Faisal)</option>
                                        <option value="Tim Satgas ATS">Tim Satgas ATS</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-heading mb-1">
                                    Catatan / Rencana Tindakan
                                </label>
                                <textarea
                                    rows={3}
                                    value={followupNote}
                                    onChange={(e) => setFollowupNote(e.target.value)}
                                    placeholder="Jelaskan langkah konkret yang akan diambil dan batas waktu tindak lanjut..."
                                    className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-default">
                                <button
                                    type="button"
                                    onClick={() => setIsFollowupModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-body hover:bg-neutral-tertiary rounded"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
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
                    <div className="bg-neutral-primary-medium border border-default-medium rounded-base shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-default">
                            <div className="flex items-center gap-2">
                                <PhoneCall className="w-4 h-4 text-green-500" />
                                <h3 className="font-bold text-heading text-sm">
                                    Kirim Pesan Terstruktur ke Orang Tua (Modul 04)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsParentContactModalOpen(false)}
                                className="text-fg-disabled hover:text-heading"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSendParentMessage} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-heading mb-1">
                                        Nama Siswa
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedStudentName}
                                        readOnly
                                        className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-heading mb-1">
                                        Kategori Pesan
                                    </label>
                                    <select
                                        value={parentCategory}
                                        onChange={(e) => setParentCategory(e.target.value)}
                                        className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    >
                                        <option value="Kehadiran">Kehadiran / Keterlambatan</option>
                                        <option value="Akademik">Perkembangan Nilai & Tugas</option>
                                        <option value="Kedisiplinan">Pembinaan Perilaku & Tata Tertib</option>
                                        <option value="Pengumuman">Pengumuman & Agenda Penting</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-heading mb-1">
                                    Isi Pesan Resmi Sekolah
                                </label>
                                <textarea
                                    rows={4}
                                    value={parentCustomMessage}
                                    onChange={(e) => setParentCustomMessage(e.target.value)}
                                    className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    required
                                />
                            </div>

                            <div className="p-2.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] text-body">
                                <strong>Fitur Acknowledgement PRD:</strong> Orang tua dapat memilih opsi{' '}
                                <em>"Sudah Membaca"</em> atau <em>"Perlu Ditindaklanjuti"</em> saat membuka pesan ini.
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-default">
                                <button
                                    type="button"
                                    onClick={() => setIsParentContactModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-body hover:bg-neutral-tertiary rounded"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded shadow-xs"
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
                    <div className="bg-neutral-primary-medium border border-default-medium rounded-base shadow-2xl w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-default">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-blue-500" />
                                <h3 className="font-bold text-heading text-sm">
                                    Buka Kasus BK & Kesiswaan (Modul 03)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNewCaseModalOpen(false)}
                                className="text-fg-disabled hover:text-heading"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCase} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-heading mb-1">
                                    Nama Siswa
                                </label>
                                <input
                                    type="text"
                                    value={selectedStudentName}
                                    onChange={(e) => setSelectedStudentName(e.target.value)}
                                    className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-heading mb-1">
                                        Kategori Kasus
                                    </label>
                                    <select
                                        value={newCaseCategory}
                                        onChange={(e) => setNewCaseCategory(e.target.value)}
                                        className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    >
                                        <option value="Kedisiplinan">Kedisiplinan & Tata Tertib</option>
                                        <option value="Kehadiran">Kehadiran (Bolos / Alpa Menahun)</option>
                                        <option value="Akademik">Akademik & Penurunan Nilai</option>
                                        <option value="Sosial">Sosial / Konflik Antar Teman</option>
                                        <option value="Sosial & Perlindungan">Perlindungan Siswa & Bullying</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-heading mb-1">
                                        Prioritas Kasus
                                    </label>
                                    <select
                                        value={newCasePriority}
                                        onChange={(e) => setNewCasePriority(e.target.value as any)}
                                        className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    >
                                        <option value="Tinggi">Tinggi (Butuh tindakan &lt;24 jam)</option>
                                        <option value="Sedang">Sedang (Konseling terencana)</option>
                                        <option value="Rendah">Rendah (Pemantauan biasa)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-heading mb-1">
                                    Deskripsi Kasus & Kronologi Singkat
                                </label>
                                <textarea
                                    rows={3}
                                    value={newCaseDesc}
                                    onChange={(e) => setNewCaseDesc(e.target.value)}
                                    placeholder="Jelaskan ringkasan peristiwa, indikasi, dan saksi jika ada..."
                                    className="w-full p-2 text-xs border border-default rounded bg-neutral-secondary-soft text-heading"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-default">
                                <button
                                    type="button"
                                    onClick={() => setIsNewCaseModalOpen(false)}
                                    className="px-3 py-1.5 text-xs text-body hover:bg-neutral-tertiary rounded"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                                >
                                    Daftarkan Kasus Baru
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
