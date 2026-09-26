import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    Clock,
    FileText,
    Filter,
    GraduationCap,
    HelpCircle,
    Info,
    Layers,
    Phone,
    Plus,
    Scale,
    Search,
    Send,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    UserCheck,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { ROLE_CONFIGS } from '@/lib/role-config';
import { cn } from '@/lib/utils';
import type {
    CaseItem,
    ClassMonitoringItem,
    ClassOptionItem,
    DisciplineRecordItem,
    RoleType,
    StudentWithDisciplineItem,
} from '@/types/tanggapin';

interface KondisiKelasProps {
    classes?: ClassMonitoringItem[];
    allClasses?: ClassOptionItem[];
    disciplineList?: DisciplineRecordItem[];
    students?: StudentWithDisciplineItem[];
    cases?: CaseItem[];
}

export default function KondisiKelas({
    classes: initialClasses = [],
    allClasses = [],
    disciplineList: initialDisciplineList = [],
    students: initialStudents = [],
    cases: initialCases = [],
}: KondisiKelasProps) {
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

    const isGuruBk = currentRole === 'guru_bk';
    const isWaliKelas = currentRole === 'wali_kelas';
    const isKepalaSekolah = currentRole === 'kepala_sekolah';

    // Active Tab in page
    const [activeSubTab, setActiveSubTab] = useState<'classes' | 'students' | 'discipline' | 'referrals'>('students');

    const [cases, setCases] = useState<CaseItem[]>(initialCases);
    useEffect(() => {
        setCases(initialCases);
    }, [initialCases]);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMajor, setSelectedMajor] = useState<string>('all');
    const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

    // Modals
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [isAddDisciplineModalOpen, setIsAddDisciplineModalOpen] = useState(false);
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
    const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentWithDisciplineItem | null>(null);

    // Form states: Add Student
    const [studentClassId, setStudentClassId] = useState(allClasses[0]?.id || initialClasses[0]?.id || '');
    const [studentNisn, setStudentNisn] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentGender, setStudentGender] = useState<'L' | 'P'>('L');
    const [studentParentName, setStudentParentName] = useState('');
    const [studentParentPhone, setStudentParentPhone] = useState('+62 ');
    const [studentAddress, setStudentAddress] = useState('');

    // Form states: Add Discipline Points (Guru BK)
    const [selectedStudentForPoints, setSelectedStudentForPoints] = useState<StudentWithDisciplineItem | null>(null);
    const [pointsStudentId, setPointsStudentId] = useState('');
    const [infractionName, setInfractionName] = useState('Terlambat Masuk Sekolah');
    const [pointsWeight, setPointsWeight] = useState(10);
    const [patternNotes, setPatternNotes] = useState('');

    // Form states: Refer Issue to Guru BK (Wali Kelas)
    const [selectedStudentForReferral, setSelectedStudentForReferral] = useState<StudentWithDisciplineItem | null>(null);
    const [referralStudentId, setReferralStudentId] = useState('');
    const [referralCategory, setReferralCategory] = useState('Kedisiplinan & Perilaku Kelas');
    const [referralPriority, setReferralPriority] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');
    const [referralNotes, setReferralNotes] = useState('');

    // Form states: Follow-up Discipline by Wali Kelas
    const [selectedRecordForFollowup, setSelectedRecordForFollowup] = useState<DisciplineRecordItem | null>(null);
    const [followupRemediationNotes, setFollowupRemediationNotes] = useState('');

    // Toast/Feedback state
    const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const majors = Array.from(new Set(initialClasses.map((c) => c.major)));

    // Filter classes
    const filteredClasses = initialClasses.filter((c) => {
        if (selectedMajor === 'all') return true;
        return c.major === selectedMajor;
    });

    // Filter students
    const filteredStudents = initialStudents.filter((s) => {
        const matchesSearch =
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.className.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass =
            selectedClassFilter === 'all' || s.classId === selectedClassFilter;
        return matchesSearch && matchesClass;
    });

    // Filter discipline list
    const filteredDiscipline = initialDisciplineList.filter((d) => {
        const matchesSearch =
            d.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.infraction.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Submit: Add Student (Guru BK / Staff)
    const handleStoreStudent = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/students',
            {
                school_class_id: studentClassId,
                nisn: studentNisn,
                name: studentName,
                gender: studentGender,
                parent_name: studentParentName,
                parent_phone: studentParentPhone,
                address: studentAddress || '-',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddStudentModalOpen(false);
                    setStudentNisn('');
                    setStudentName('');
                    setStudentParentName('');
                    setStudentParentPhone('+62 ');
                    setStudentAddress('');
                    setNotificationMessage(`Data peserta didik ${studentName} berhasil ditambahkan!`);
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0] as string;
                    setErrorMessage(firstError || 'Gagal menyimpan data siswa.');
                    setTimeout(() => setErrorMessage(null), 5000);
                },
            },
        );
    };

    // Submit: Add Discipline Points (Guru BK -> notifies Wali Kelas)
    const handleStoreDisciplinePoints = (e: React.FormEvent) => {
        e.preventDefault();
        const targetStudentId = pointsStudentId || selectedStudentForPoints?.id;
        if (!targetStudentId) return;

        router.post(
            '/discipline-records',
            {
                student_id: targetStudentId,
                infraction: infractionName,
                points: pointsWeight,
                pattern_notes: patternNotes || `Dicatat oleh Guru BK. Memerlukan tindak lanjut dan pembinaan oleh Wali Kelas.`,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddDisciplineModalOpen(false);
                    setSelectedStudentForPoints(null);
                    setPointsStudentId('');
                    setPatternNotes('');
                    setNotificationMessage(
                        `Poin pelanggaran (+${pointsWeight} Poin) berhasil dicatat dan diteruskan ke Wali Kelas untuk ditindaklanjuti!`,
                    );
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0] as string;
                    setErrorMessage(firstError || 'Gagal mencatat poin pelanggaran.');
                    setTimeout(() => setErrorMessage(null), 5000);
                },
            },
        );
    };

    // Submit: Refer Issue to Guru BK (Wali Kelas -> Guru BK)
    const handleStoreReferral = (e: React.FormEvent) => {
        e.preventDefault();
        const targetStudentId = referralStudentId || selectedStudentForReferral?.id;
        if (!targetStudentId) return;

        router.post(
            '/student-referrals',
            {
                student_id: targetStudentId,
                category: referralCategory,
                priority: referralPriority,
                notes: referralNotes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsReferralModalOpen(false);
                    setSelectedStudentForReferral(null);
                    setReferralStudentId('');
                    setReferralNotes('');
                    setNotificationMessage(
                        `Kendala siswa berhasil dilaporkan dan langsung diteruskan ke Guru BK untuk ditindaklanjuti!`,
                    );
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0] as string;
                    setErrorMessage(firstError || 'Gagal melaporkan kendala ke Guru BK.');
                    setTimeout(() => setErrorMessage(null), 5000);
                },
            },
        );
    };

    // Submit: Follow-up Discipline (Wali Kelas)
    const handleFollowupDiscipline = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRecordForFollowup) return;

        router.post(
            `/discipline-records/${selectedRecordForFollowup.id}/followup`,
            {
                followup_notes: followupRemediationNotes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsFollowupModalOpen(false);
                    setSelectedRecordForFollowup(null);
                    setFollowupRemediationNotes('');
                    setNotificationMessage(
                        `Tindak lanjut pembinaan kedisiplinan berhasil diselesaikan oleh Wali Kelas!`,
                    );
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0] as string;
                    setErrorMessage(firstError || 'Gagal menyelesaikan tindak lanjut pembinaan.');
                    setTimeout(() => setErrorMessage(null), 5000);
                },
            },
        );
    };

    // Open points modal pre-selecting a student
    const handleOpenPointsModal = (student: StudentWithDisciplineItem) => {
        setSelectedStudentForPoints(student);
        setPointsStudentId(student.id);
        setIsAddDisciplineModalOpen(true);
    };

    // Open referral modal pre-selecting a student
    const handleOpenReferralModal = (student: StudentWithDisciplineItem) => {
        setSelectedStudentForReferral(student);
        setReferralStudentId(student.id);
        setIsReferralModalOpen(true);
    };

    // Open followup modal for a discipline record
    const handleOpenFollowupModal = (record: DisciplineRecordItem) => {
        setSelectedRecordForFollowup(record);
        setFollowupRemediationNotes('');
        setIsFollowupModalOpen(true);
    };

    return (
        <FlowbiteTanggapinLayout activeTab="class-monitoring">
            <Head title="Kondisi Kelas & Data Siswa — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Notification Banners */}
                {notificationMessage && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-900 shadow-xs dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-semibold sm:text-sm">{notificationMessage}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotificationMessage(null)}
                            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {errorMessage && (
                    <div className="flex items-center justify-between rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-rose-900 shadow-xs dark:border-rose-800 dark:bg-rose-950/70 dark:text-rose-200">
                        <div className="flex items-center gap-2.5">
                            <AlertCircle className="size-5 text-rose-600 dark:text-rose-400" />
                            <span className="text-xs font-semibold sm:text-sm">{errorMessage}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setErrorMessage(null)}
                            className="text-rose-700 hover:text-rose-900 dark:text-rose-300"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 p-6 shadow-xs dark:border-slate-800 dark:from-[#0f172a] dark:via-blue-950/20 dark:to-slate-900">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/80 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                    <GraduationCap className="size-3.5 text-blue-600 dark:text-blue-400" />
                                    {isGuruBk
                                        ? 'Kolaborasi BK & Wali Kelas'
                                        : isWaliKelas
                                          ? 'Garis Depan Rombongan Belajar'
                                          : 'Monitoring Terpadu Rombel'}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    Operator Mengelola Rombel & Kuota
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                {isGuruBk
                                    ? 'Pemantauan Rombel, Input Siswa & Poin Kedisiplinan'
                                    : isWaliKelas
                                      ? 'Data Peserta Didik, Poin BK & Rujukan Kendala'
                                      : 'Kondisi Kelas & Monitoring Peserta Didik'}
                            </h1>

                            <p className="max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                                {isGuruBk
                                    ? 'Guru BK dapat melihat seluruh kelas yang ditambahkan Operator beserta wali kelasnya, menambahkan data siswa, serta mencatat poin pelanggaran yang otomatis masuk ke akun Wali Kelas untuk ditindaklanjuti.'
                                    : isWaliKelas
                                      ? 'Wali Kelas memantau data siswa di kelas binaan, menindaklanjuti poin pelanggaran yang dicatat Guru BK, dan dapat meneruskan kendala khusus siswa ke Guru BK untuk penanganan mendalam.'
                                      : 'Layar komprehensif mengintegrasikan data rombel resmi, data peserta didik, riwayat poin kedisiplinan restoratif, dan alur rujukan pendampingan.'}
                            </p>
                        </div>

                        {/* Action Buttons based on Role */}
                        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                            {(isGuruBk || isKepalaSekolah) && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddStudentModalOpen(true)}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-800 active:scale-95"
                                    >
                                        <UserPlus className="size-4" />
                                        <span>Tambah Siswa Baru</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedStudentForPoints(null);
                                            setPointsStudentId(filteredStudents[0]?.id || '');
                                            setIsAddDisciplineModalOpen(true);
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    >
                                        <Scale className="size-4 text-blue-600 dark:text-blue-400" />
                                        <span>Catat Poin Pelanggaran</span>
                                    </button>
                                </>
                            )}

                            {isWaliKelas && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedStudentForReferral(null);
                                        setReferralStudentId(filteredStudents[0]?.id || '');
                                        setIsReferralModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-800 active:scale-95"
                                >
                                    <Send className="size-4" />
                                    <span>Laporkan Kendala ke Guru BK</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sub-Tab Navigation Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveSubTab('students')}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
                                activeSubTab === 'students'
                                    ? 'bg-blue-700 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                            )}
                        >
                            <Users className="size-4" />
                            <span>Data Peserta Didik & Poin ({filteredStudents.length})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveSubTab('classes')}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
                                activeSubTab === 'classes'
                                    ? 'bg-blue-700 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                            )}
                        >
                            <GraduationCap className="size-4" />
                            <span>Daftar Kelas & Wali Kelas ({initialClasses.length})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveSubTab('discipline')}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
                                activeSubTab === 'discipline'
                                    ? 'bg-blue-700 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                            )}
                        >
                            <Scale className="size-4" />
                            <span>Riwayat Pelanggaran & Tindak Lanjut ({initialDisciplineList.length})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveSubTab('referrals')}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
                                activeSubTab === 'referrals'
                                    ? 'bg-blue-700 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                            )}
                        >
                            <ShieldAlert className="size-4" />
                            <span>Tracking Rujukan BK ({cases.length})</span>
                        </button>
                    </div>

                    {/* Quick Search */}
                    <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama siswa, NISN, atau kelas..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>
                </div>

                {/* ============================================================== */}
                {/* TAB 1: DATA PESERTA DIDIK & POIN KEDISIPLINAN                   */}
                {/* ============================================================== */}
                {activeSubTab === 'students' && (
                    <div className="space-y-4">
                        {/* Class Filter pills (if Guru BK or Kepsek who sees multiple classes) */}
                        {!isWaliKelas && initialClasses.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                <button
                                    type="button"
                                    onClick={() => setSelectedClassFilter('all')}
                                    className={cn(
                                        'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                                        selectedClassFilter === 'all'
                                            ? 'bg-blue-700 text-white'
                                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
                                    )}
                                >
                                    Semua Kelas ({initialStudents.length})
                                </button>
                                {initialClasses.map((cls) => (
                                    <button
                                        key={cls.id}
                                        type="button"
                                        onClick={() => setSelectedClassFilter(cls.id)}
                                        className={cn(
                                            'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                                            selectedClassFilter === cls.id
                                                ? 'bg-blue-700 text-white'
                                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
                                        )}
                                    >
                                        {cls.name} (Wali: {cls.homeroomTeacher})
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Students Table */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                        <tr>
                                            <th className="px-5 py-3.5">Peserta Didik</th>
                                            <th className="px-5 py-3.5">Rombel & Wali Kelas</th>
                                            <th className="px-5 py-3.5">Total Poin Pelanggaran</th>
                                            <th className="px-5 py-3.5">Kehadiran</th>
                                            <th className="px-5 py-3.5">Kontak Wali Murid</th>
                                            <th className="px-5 py-3.5 text-right">Tindakan Kolaboratif</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                        {filteredStudents.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-5 py-8 text-center text-slate-500 dark:text-slate-400"
                                                >
                                                    Belum ada data siswa yang cocok dengan kriteria pencarian.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStudents.map((s) => {
                                                const hasPoints = s.totalPoints > 0;
                                                return (
                                                    <tr
                                                        key={s.id}
                                                        className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                                                    >
                                                        {/* Name & NISN */}
                                                        <td className="px-5 py-4">
                                                            <div className="font-bold text-slate-900 dark:text-white">
                                                                {s.name}
                                                            </div>
                                                            <div className="font-mono text-[11px] text-slate-400">
                                                                NISN: {s.nisn} • JK: {s.gender}
                                                            </div>
                                                        </td>

                                                        {/* Class & Homeroom Teacher */}
                                                        <td className="px-5 py-4">
                                                            <div className="font-semibold text-blue-700 dark:text-blue-400">
                                                                Kelas {s.className}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500">
                                                                Wali Kelas: {s.homeroomTeacher}
                                                            </div>
                                                        </td>

                                                        {/* Total Points & Status */}
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={cn(
                                                                        'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold',
                                                                        s.totalPoints >= 30
                                                                            ? 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300'
                                                                            : s.totalPoints >= 15
                                                                              ? 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300'
                                                                              : hasPoints
                                                                                ? 'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300'
                                                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
                                                                    )}
                                                                >
                                                                    {s.totalPoints} Poin
                                                                </span>

                                                                {s.disciplineRecords.length > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setSelectedStudentForDetail(s)}
                                                                        className="text-[11px] text-blue-600 hover:underline dark:text-blue-400"
                                                                    >
                                                                        ({s.disciplineRecords.length} catatan)
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {s.pendingFollowups > 0 && (
                                                                <span className="mt-1 block text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                                                    • {s.pendingFollowups} perlu pembinaan wali kelas
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Attendance */}
                                                        <td className="px-5 py-4">
                                                            <div className="font-bold text-slate-800 dark:text-slate-200">
                                                                {s.attendanceRate}%
                                                            </div>
                                                            <div className="text-[10px] text-slate-400">
                                                                {s.attendanceRate < 80 ? 'Presensi Kritis' : 'Normal'}
                                                            </div>
                                                        </td>

                                                        {/* Parent Contact */}
                                                        <td className="px-5 py-4">
                                                            <div className="text-slate-900 dark:text-white">
                                                                {s.parentName}
                                                            </div>
                                                            <div className="font-mono text-[11px] text-slate-500">
                                                                {s.parentPhone}
                                                            </div>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-5 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                {/* Guru BK Action: Add Points */}
                                                                {(isGuruBk || isKepalaSekolah) && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleOpenPointsModal(s)}
                                                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                                                        title="Catat poin pelanggaran dari Guru BK"
                                                                    >
                                                                        <Scale className="size-3.5 text-blue-600" />
                                                                        <span>+ Poin BK</span>
                                                                    </button>
                                                                )}

                                                                {/* Wali Kelas Action: Refer Issue to Guru BK */}
                                                                {isWaliKelas && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleOpenReferralModal(s)}
                                                                        className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-2.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-800 active:scale-95"
                                                                        title="Rujuk kendala siswa ke Guru BK"
                                                                    >
                                                                        <Send className="size-3.5" />
                                                                        <span>Rujuk ke BK</span>
                                                                    </button>
                                                                )}

                                                                {/* Detail Modal button */}
                                                                {s.disciplineRecords.length > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setSelectedStudentForDetail(s)}
                                                                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                                        title="Lihat riwayat poin siswa"
                                                                    >
                                                                        Detail
                                                                    </button>
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
                    </div>
                )}

                {/* ============================================================== */}
                {/* TAB 2: DAFTAR KELAS & WALI KELAS (DARI OPERATOR)                */}
                {/* ============================================================== */}
                {activeSubTab === 'classes' && (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm dark:text-white">
                                    Daftar Rombongan Belajar Ditambahkan oleh Operator
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Operator sekolah menerbitkan rombel sesuai lisensi paket. Guru BK dan Kepala Sekolah dapat memantau seluruh rombel secara lintas jenjang.
                                </p>
                            </div>

                            {/* Major filter */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedMajor('all')}
                                    className={cn(
                                        'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                                        selectedMajor === 'all'
                                            ? 'bg-blue-700 text-white'
                                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
                                    )}
                                >
                                    Semua Jurusan ({initialClasses.length})
                                </button>
                                {majors.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setSelectedMajor(m)}
                                        className={cn(
                                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                                            selectedMajor === m
                                                ? 'bg-blue-700 text-white'
                                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Class Cards Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredClasses.map((cls) => {
                                const isCritical = cls.healthStatus === 'critical';
                                const isWarning = cls.healthStatus === 'warning';

                                return (
                                    <div
                                        key={cls.id}
                                        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-400 dark:border-slate-800 dark:bg-[#0f172a]"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-bold text-slate-900 dark:text-white">
                                                        {cls.name}
                                                    </span>
                                                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
                                                        {cls.major}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                                                    <UserCheck className="size-3.5 text-emerald-600" />
                                                    <span>
                                                        Wali Kelas: <strong>{cls.homeroomTeacher}</strong>
                                                    </span>
                                                </div>
                                            </div>

                                            <span
                                                className={cn(
                                                    'rounded-full border px-2.5 py-0.5 text-[10px] font-bold',
                                                    isCritical || isWarning
                                                        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                                                )}
                                            >
                                                {isCritical ? 'Perlu Intervensi' : isWarning ? 'Perlu Atensi' : 'Baik'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Total Siswa</span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {cls.totalStudents}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Kehadiran</span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {cls.attendanceRate}%
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Berisiko</span>
                                                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                                                    {cls.studentsAtRisk} siswa
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-800">
                                            <span>Follow-up: {cls.pendingFollowups} pending</span>
                                            {(isGuruBk || isKepalaSekolah) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedClassFilter(cls.id);
                                                        setActiveSubTab('students');
                                                    }}
                                                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Lihat Daftar Siswa →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* TAB 3: RIWAYAT PELANGGARAN & TINDAK LANJUT                       */}
                {/* ============================================================== */}
                {activeSubTab === 'discipline' && (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Scale className="size-4 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Log Catatan Pembinaan & Poin Kedisiplinan
                                    </h3>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Poin yang dicatat Guru BK langsung tampil di akun Wali Kelas untuk ditindaklanjuti secara restoratif.
                                </p>
                            </div>

                            {(isGuruBk || isKepalaSekolah) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedStudentForPoints(null);
                                        setPointsStudentId(filteredStudents[0]?.id || '');
                                        setIsAddDisciplineModalOpen(true);
                                    }}
                                    className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-800 active:scale-95 sm:self-center"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Catat Pelanggaran / Poin</span>
                                </button>
                            )}
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                                    <tr>
                                        <th className="px-4 py-3">Siswa & Rombel</th>
                                        <th className="px-4 py-3">Pelanggaran & Poin</th>
                                        <th className="px-4 py-3">Catatan Kronologi / Guru BK</th>
                                        <th className="px-4 py-3">Status Tindak Lanjut</th>
                                        <th className="px-4 py-3">Waktu Pencatatan</th>
                                        <th className="px-4 py-3 text-right">Aksi Wali Kelas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredDiscipline.length > 0 ? (
                                        filteredDiscipline.map((rec) => {
                                            const isPending = rec.actionStatus !== 'Selesai Ditindaklanjuti Wali Kelas';
                                            return (
                                                <tr
                                                    key={rec.id}
                                                    className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                                                >
                                                    <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                                                        <div>{rec.studentName}</div>
                                                        <div className="font-normal text-[11px] text-slate-500">
                                                            Kelas {rec.class}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <div className="font-semibold text-slate-900 dark:text-white">
                                                            {rec.infraction}
                                                        </div>
                                                        <span className="mt-0.5 inline-block rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                                            +{rec.points} Poin
                                                        </span>
                                                    </td>
                                                    <td className="max-w-xs px-4 py-3.5 text-[11px] text-slate-600 dark:text-slate-300">
                                                        {rec.patternNotes}
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <span
                                                            className={cn(
                                                                'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold',
                                                                isPending
                                                                    ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                                                            )}
                                                        >
                                                            {rec.actionStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-[11px] whitespace-nowrap text-slate-400">
                                                        {rec.recordedAt}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                        {isWaliKelas && isPending && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenFollowupModal(rec)}
                                                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95"
                                                            >
                                                                <Check className="size-3.5" />
                                                                <span>Tindak Lanjut</span>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                                                Belum ada catatan pelanggaran yang dilaporkan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* SUB-TAB 4: TRACKING RUJUKAN KENDALA KE GURU BK                 */}
                {/* ============================================================== */}
                {activeSubTab === 'referrals' && (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Tracking Status Rujukan Kendala Siswa ke Guru BK
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Pantau secara langsung apakah kendala siswa yang dilaporkan Wali Kelas sedang diproses atau sudah selesai ditangani oleh Guru BK.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedStudentForReferral(null);
                                    setReferralStudentId(filteredStudents[0]?.id || '');
                                    setIsReferralModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 self-start rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-800 active:scale-95 sm:self-center"
                            >
                                <Plus className="size-4" />
                                <span>Rujuk Siswa Baru ke BK</span>
                            </button>
                        </div>

                        {/* Rujukan Cards / Tracking List */}
                        <div className="space-y-3">
                            {cases.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                    Belum ada rujukan kendala siswa yang dikirimkan ke Guru BK untuk kelas ini.
                                </div>
                            ) : (
                                cases.map((c) => {
                                    const isHandled =
                                        c.isHandledByBk ||
                                        c.stage === 'handled_by_bk' ||
                                        c.stage === 'resolved' ||
                                        !!c.handledAt;

                                    return (
                                        <div
                                            key={c.id}
                                            className={cn(
                                                'space-y-3 rounded-2xl border p-4.5 text-xs transition-colors shadow-xs',
                                                isHandled
                                                    ? 'border-emerald-200/90 bg-emerald-50/30 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                                                    : 'border-amber-200/90 bg-amber-50/30 dark:border-amber-900/60 dark:bg-amber-950/20',
                                            )}
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5 dark:border-slate-800">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                                                        {c.code}
                                                    </span>
                                                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                                                        {c.studentName}
                                                    </span>
                                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                        {c.class}
                                                    </span>
                                                </div>

                                                {/* Status Tracking Badge */}
                                                {isHandled ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                        <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                        Sudah Ditangani oleh Guru BK
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 shadow-2xs dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                        <Clock className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                        Menunggu Penanganan Guru BK
                                                    </span>
                                                )}
                                            </div>

                                            {/* Kendala yang dirujuk */}
                                            <div className="rounded-xl border border-slate-200 bg-white p-3 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                                    Catatan Kendala yang Dilaporkan Wali Kelas:
                                                </div>
                                                <p className="leading-relaxed">
                                                    {c.referralNotes || c.lastActivity}
                                                </p>
                                            </div>

                                            {/* Rincian penanganan Guru BK jika sudah ditangani */}
                                            {isHandled ? (
                                                <div className="rounded-xl border border-emerald-200 bg-white p-3.5 leading-relaxed text-slate-700 shadow-2xs dark:border-emerald-900/60 dark:bg-[#070b14] dark:text-slate-200">
                                                    <div className="flex flex-wrap items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                                        <span>Tindakan Guru BK: {c.bkActionType || 'Konseling Siswa'}</span>
                                                        <span className="text-[11px] font-normal text-slate-500">{c.handledAt || c.lastUpdate}</span>
                                                    </div>
                                                    <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                                                        Konselor Penanggung Jawab:{' '}
                                                        <strong className="text-slate-900 dark:text-white">
                                                            {c.handledByBkName || c.assignee}
                                                        </strong>
                                                    </div>
                                                    <div className="mt-2 border-t border-slate-100 pt-2 text-[11px] dark:border-slate-800">
                                                        <div className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                                                            Catatan Hasil Penanganan & Komitmen Siswa:
                                                        </div>
                                                        <p className="text-slate-700 dark:text-slate-300">
                                                            {c.bkHandlingNotes || 'Siswa telah mendapatkan bimbingan dan konseling.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                    <span>
                                                        PIC Guru BK: <strong className="font-semibold text-slate-700 dark:text-slate-300">{c.assignee}</strong>
                                                    </span>
                                                    <span className="text-amber-700 dark:text-amber-400">
                                                        ⏳ Sedang dalam antrean layanan bimbingan konseling
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* MODAL 1: TAMBAH DATA SISWA BARU (GURU BK / KEPSEK)              */}
            {/* ============================================================== */}
            {isAddStudentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <UserPlus className="size-5 text-blue-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Tambah Data Peserta Didik Baru (Guru BK)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddStudentModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleStoreStudent} className="mt-4 space-y-3.5 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Pilih Rombel / Kelas (Ditambahkan oleh Operator)
                                </label>
                                <select
                                    required
                                    value={studentClassId}
                                    onChange={(e) => setStudentClassId(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    {allClasses.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} ({cls.major}) — Wali: {cls.homeroomTeacher}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        NISN Siswa (10 Digit)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={studentNisn}
                                        onChange={(e) => setStudentNisn(e.target.value)}
                                        placeholder="Contoh: 0067123008"
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        value={studentGender}
                                        onChange={(e) => setStudentGender(e.target.value as 'L' | 'P')}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="L">Laki-laki (L)</option>
                                        <option value="P">Perempuan (P)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Lengkap Peserta Didik
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    placeholder="Contoh: Fajar Ramadhan"
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Nama Orang Tua / Wali
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={studentParentName}
                                        onChange={(e) => setStudentParentName(e.target.value)}
                                        placeholder="Contoh: Bapak Hendra"
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        No. WhatsApp Orang Tua
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={studentParentPhone}
                                        onChange={(e) => setStudentParentPhone(e.target.value)}
                                        placeholder="+62 812-XXXX-XXXX"
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Alamat Tinggal Siswa (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={studentAddress}
                                    onChange={(e) => setStudentAddress(e.target.value)}
                                    placeholder="Jl. Merdeka No. 12, Kota Bandung"
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAddStudentModalOpen(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-800 active:scale-95"
                                >
                                    Simpan Data Siswa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 2: CATAT POIN PELANGGARAN OLEH GURU BK (MASUK KE WALI)    */}
            {/* ============================================================== */}
            {isAddDisciplineModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Scale className="size-5 text-blue-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Catat Poin Pelanggaran Siswa (Guru BK)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddDisciplineModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Integration Notice */}
                        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                            <Info className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                            <p className="leading-relaxed">
                                Poin ini akan <strong>langsung masuk ke akun Wali Kelas</strong> siswa terkait dengan status <em>"Menunggu Tindak Lanjut Wali Kelas"</em> agar pembinaan dapat disegerakan.
                            </p>
                        </div>

                        <form onSubmit={handleStoreDisciplinePoints} className="mt-4 space-y-3.5 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Pilih Peserta Didik
                                </label>
                                {selectedStudentForPoints ? (
                                    <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800">
                                        <div className="font-bold text-slate-900 dark:text-white">
                                            {selectedStudentForPoints.name} ({selectedStudentForPoints.className})
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            Wali Kelas: {selectedStudentForPoints.homeroomTeacher} • Poin Saat Ini: {selectedStudentForPoints.totalPoints} Poin
                                        </div>
                                    </div>
                                ) : (
                                    <select
                                        required
                                        value={pointsStudentId}
                                        onChange={(e) => setPointsStudentId(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        {filteredStudents.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.className}) — Wali: {s.homeroomTeacher} (Saat ini: {s.totalPoints} Poin)
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Jenis Pelanggaran / Aturan
                                    </label>
                                    <select
                                        value={infractionName}
                                        onChange={(e) => setInfractionName(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="Terlambat Masuk Sekolah">Terlambat Masuk Sekolah (10 Poin)</option>
                                        <option value="Membolos Jam Pelajaran">Membolos Jam Pelajaran (15 Poin)</option>
                                        <option value="Merokok / Vape di Area Sekolah">Merokok / Vape di Sekolah (25 Poin)</option>
                                        <option value="Pelanggaran Seragam & Atribut">Pelanggaran Seragam / Atribut (5 Poin)</option>
                                        <option value="Menggunakan HP Saat KBM">Menggunakan HP Saat KBM (5 Poin)</option>
                                        <option value="Konflik / Pertengkaran Antar Siswa">Konflik Antar Teman (20 Poin)</option>
                                        <option value="Tindakan Intimidasi / Bullying">Dugaan Bullying / Intimidasi (35 Poin)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Bobot Poin Pelanggaran
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="100"
                                        value={pointsWeight}
                                        onChange={(e) => setPointsWeight(Number(e.target.value))}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan Kronologi & Arahan untuk Wali Kelas
                                </label>
                                <textarea
                                    rows={3}
                                    value={patternNotes}
                                    onChange={(e) => setPatternNotes(e.target.value)}
                                    placeholder="Tuliskan kronologi singkat dan arahan pembinaan yang diharapkan dilakukan oleh Wali Kelas..."
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAddDisciplineModalOpen(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-800 active:scale-95"
                                >
                                    Simpan & Teruskan ke Wali Kelas
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 3: LAPORKAN KENDALA KE GURU BK (WALI KELAS)               */}
            {/* ============================================================== */}
            {isReferralModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Send className="size-5 text-blue-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Laporkan Kendala Siswa ke Guru BK (Wali Kelas)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsReferralModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                            <Info className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                            <p className="leading-relaxed">
                                Laporan ini akan langsung masuk sebagai <strong>Kasus Rujukan Masuk</strong> di dashboard Guru BK untuk ditindaklanjuti dengan sesi konseling dan panggilan khusus.
                            </p>
                        </div>

                        <form onSubmit={handleStoreReferral} className="mt-4 space-y-3.5 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Pilih Peserta Didik di Rombel Binaan
                                </label>
                                {selectedStudentForReferral ? (
                                    <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800">
                                        <div className="font-bold text-slate-900 dark:text-white">
                                            {selectedStudentForReferral.name} (Kelas {selectedStudentForReferral.className})
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            Kehadiran: {selectedStudentForReferral.attendanceRate}% • Poin BK: {selectedStudentForReferral.totalPoints} Poin
                                        </div>
                                    </div>
                                ) : (
                                    <select
                                        required
                                        value={referralStudentId}
                                        onChange={(e) => setReferralStudentId(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        {filteredStudents.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} (Kehadiran: {s.attendanceRate}%, Poin: {s.totalPoints})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori Kendala
                                    </label>
                                    <select
                                        value={referralCategory}
                                        onChange={(e) => setReferralCategory(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="Kedisiplinan & Perilaku Kelas">Kedisiplinan & Sikap di Kelas</option>
                                        <option value="Kehadiran / Sering Bolos">Kehadiran / Sering Bolos</option>
                                        <option value="Penurunan Belajar & Tugas">Penurunan Nilai / Malas Tugas</option>
                                        <option value="Emosional / Menarik Diri">Masalah Emosional / Pendiam</option>
                                        <option value="Dugaan Bullying / Konflik">Dugaan Bullying / Konflik Sosial</option>
                                        <option value="Ekonomi / Masalah Keluarga">Masalah Finansial / Keluarga</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Tingkat Urgensi Penanganan
                                    </label>
                                    <select
                                        value={referralPriority}
                                        onChange={(e) => setReferralPriority(e.target.value as 'Rendah' | 'Sedang' | 'Tinggi')}
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="Sedang">Sedang (Dalam 2-3 hari)</option>
                                        <option value="Tinggi">Tinggi / Mendesak (Hari ini)</option>
                                        <option value="Rendah">Rendah (Observasi bertahap)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Rincian Kendala & Catatan Observasi Wali Kelas
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={referralNotes}
                                    onChange={(e) => setReferralNotes(e.target.value)}
                                    placeholder="Jelaskan secara spesifik kendala yang ditemukan di kelas, perubahan perilaku siswa, atau hal yang perlu diintervensi oleh Guru BK..."
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsReferralModalOpen(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-800 active:scale-95"
                                >
                                    Teruskan Kendala ke Guru BK
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 4: TINDAK LANJUT PEMBINAAN KEDISIPLINAN (WALI KELAS)     */}
            {/* ============================================================== */}
            {isFollowupModalOpen && selectedRecordForFollowup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Tindak Lanjut Pembinaan Kedisiplinan Wali Kelas
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFollowupModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/50">
                            <div>
                                <span className="text-slate-500">Nama Siswa:</span>
                                <strong className="ml-1 text-slate-900 dark:text-white">
                                    {selectedRecordForFollowup.studentName} ({selectedRecordForFollowup.class})
                                </strong>
                            </div>
                            <div>
                                <span className="text-slate-500">Pelanggaran Tercatat:</span>
                                <strong className="ml-1 text-blue-700 dark:text-blue-400">
                                    {selectedRecordForFollowup.infraction} (+{selectedRecordForFollowup.points} Poin)
                                </strong>
                            </div>
                            <div>
                                <span className="text-slate-500">Catatan Guru BK:</span>
                                <p className="mt-1 text-slate-700 dark:text-slate-300">
                                    {selectedRecordForFollowup.patternNotes}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleFollowupDiscipline} className="mt-4 space-y-3.5 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Tindakan Pembinaan Restoratif yang Telah Dilakukan
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={followupRemediationNotes}
                                    onChange={(e) => setFollowupRemediationNotes(e.target.value)}
                                    placeholder="Contoh: Siswa telah dipanggil untuk dialog restoratif, mengakui kesalahan, dan sepakat menandatangani surat komitmen kedisiplinan serta pemantauan kehadiran..."
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsFollowupModalOpen(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-95"
                                >
                                    Selesaikan Pembinaan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 5: DETAIL RIWAYAT POIN PELANGGARAN SISWA                   */}
            {/* ============================================================== */}
            {selectedStudentForDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Riwayat Poin & Pelanggaran: {selectedStudentForDetail.name}
                                </h3>
                                <div className="text-xs text-slate-500">
                                    Kelas {selectedStudentForDetail.className} • Total: {selectedStudentForDetail.totalPoints} Poin
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedStudentForDetail(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="mt-4 max-h-80 space-y-2.5 overflow-y-auto">
                            {selectedStudentForDetail.disciplineRecords.length === 0 ? (
                                <p className="py-6 text-center text-xs text-slate-400">
                                    Tidak ada catatan pelanggaran untuk siswa ini.
                                </p>
                            ) : (
                                selectedStudentForDetail.disciplineRecords.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {item.infraction}
                                            </span>
                                            <span className="rounded bg-rose-50 px-2 py-0.5 font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                                +{item.points} Poin
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                                            {item.patternNotes || 'Pencatatan pelanggaran siswa'}
                                        </p>
                                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                                            <span>Status: {item.actionStatus}</span>
                                            <span>{item.recordedAt}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-5 flex justify-end border-t border-slate-200 pt-3 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setSelectedStudentForDetail(null)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FlowbiteTanggapinLayout>
    );
}

KondisiKelas.layout = (page: React.ReactNode) => page;
