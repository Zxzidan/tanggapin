import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Filter,
    History,
    Inbox,
    Plus,
    Search,
    Send,
    ShieldAlert,
    UserCheck,
    X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { ROLE_CONFIGS } from '@/lib/role-config';
import { cn } from '@/lib/utils';
import type { CaseItem, RoleType, TanggapinStats } from '@/types/tanggapin';

interface StudentOptionItem {
    id: string;
    name: string;
    nisn: string;
    className: string;
}

interface ManajemenKasusProps {
    cases?: CaseItem[];
    stats?: TanggapinStats;
    students?: StudentOptionItem[];
}

const REFERRAL_CATEGORIES = [
    'Masalah Kehadiran & Absensi',
    'Pelanggaran Tata Tertib Kelas',
    'Konflik Antar Siswa',
    'Masalah Akademik & Motivasi Belajar',
    'Masalah Keluarga & Lingkungan',
    'Indikasi Kenakalan Remaja',
    'Kebutuhan Konseling Pribadi',
    'Lainnya',
];

const ACTION_TYPES = [
    'Konseling Individu',
    'Mediasi Antar Siswa',
    'Pemanggilan Orang Tua & Wali Kelas',
    'Home Visit (Kunjungan Rumah)',
    'Pendampingan Belajar & Tutor Sebaya',
    'Pembinaan Khusus & Kontrak Komitmen',
];

export default function ManajemenKasus({
    cases: initialCases = [],
    students = [],
}: ManajemenKasusProps) {
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

    const [cases, setCases] = useState<CaseItem[]>(initialCases);
    useEffect(() => {
        setCases(initialCases);
    }, [initialCases]);

    // ── Wali Kelas: Referral Modal ───────────────────────────────────────────
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const [refStudentId, setRefStudentId] = useState(students[0]?.id || '');
    const [refCategory, setRefCategory] = useState(REFERRAL_CATEGORIES[0]);
    const [refPriority, setRefPriority] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');
    const [refNotes, setRefNotes] = useState('');
    const [isRefSubmitting, setIsRefSubmitting] = useState(false);

    const handleOpenReferralModal = () => {
        setRefStudentId(students[0]?.id || '');
        setRefCategory(REFERRAL_CATEGORIES[0]);
        setRefPriority('Sedang');
        setRefNotes('');
        setIsReferralModalOpen(true);
    };

    const handleSubmitReferral = (e: React.FormEvent) => {
        e.preventDefault();
        if (!refStudentId) {
            toast.error('Pilih siswa yang akan dilaporkan terlebih dahulu.');
            return;
        }
        if (!refNotes.trim()) {
            toast.error('Rincian kendala siswa wajib diisi.');
            return;
        }
        setIsRefSubmitting(true);
        router.post(
            '/student-referrals',
            { student_id: refStudentId, category: refCategory, priority: refPriority, notes: refNotes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Kendala siswa berhasil dilaporkan ke Guru BK! Pantau statusnya di halaman ini.');
                    setIsReferralModalOpen(false);
                    setIsRefSubmitting(false);
                },
                onError: (errors) => {
                    const first = Object.values(errors)[0] as string;
                    toast.error(first || 'Gagal melaporkan kendala siswa.');
                    setIsRefSubmitting(false);
                },
            },
        );
    };

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'handled'>('all');

    // Handling Modal
    const [selectedCaseForHandling, setSelectedCaseForHandling] = useState<CaseItem | null>(null);
    const [actionType, setActionType] = useState(ACTION_TYPES[0]);
    const [handlingNotes, setHandlingNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenHandlingModal = (c: CaseItem) => {
        setSelectedCaseForHandling(c);
        setActionType(c.bkActionType || ACTION_TYPES[0]);
        setHandlingNotes(c.bkHandlingNotes || '');
    };

    const handleCloseHandlingModal = () => {
        setSelectedCaseForHandling(null);
        setHandlingNotes('');
        setIsSubmitting(false);
    };

    const handleSubmitHandling = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCaseForHandling) return;

        if (!handlingNotes.trim()) {
            toast.error('Catatan hasil penanganan Guru BK wajib diisi.');
            return;
        }

        setIsSubmitting(true);
        router.post(
            `/cases/${selectedCaseForHandling.id}/handle-bk`,
            {
                action_type: actionType,
                handling_notes: handlingNotes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Rujukan kasus ${selectedCaseForHandling.code} (${selectedCaseForHandling.studentName}) berhasil ditangani! Status di Dashboard Wali Kelas otomatis terbarui menjadi 'Sudah Ditangani oleh Guru BK'.`,
                    );
                    handleCloseHandlingModal();
                },
                onError: (errors) => {
                    const first = Object.values(errors)[0] as string;
                    toast.error(first || 'Gagal menyimpan hasil penanganan Guru BK.');
                    setIsSubmitting(false);
                },
            },
        );
    };

    // Filtered Cases
    const filteredCases = useMemo(() => {
        return cases.filter((c) => {
            const matchesSearch =
                c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.referralNotes && c.referralNotes.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.referredByName && c.referredByName.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            const isHandled = c.isHandledByBk || c.stage === 'handled_by_bk' || c.stage === 'resolved';

            if (statusFilter === 'pending') return !isHandled;
            if (statusFilter === 'handled') return isHandled;
            return true;
        });
    }, [cases, searchQuery, statusFilter]);

    const newCases = filteredCases.filter((c) => c.stage === 'new');
    const assignedCases = filteredCases.filter((c) => c.stage === 'assigned');
    const inProgressCases = filteredCases.filter((c) => c.stage === 'in_progress');
    const handledCases = filteredCases.filter(
        (c) => c.stage === 'handled_by_bk' || c.stage === 'resolved' || c.isHandledByBk,
    );

    const totalHandled = cases.filter(
        (c) => c.isHandledByBk || c.stage === 'handled_by_bk' || c.stage === 'resolved',
    ).length;
    const totalPending = cases.length - totalHandled;

    return (
        <FlowbiteTanggapinLayout activeTab="cases" currentRole={currentRole}>
            <Head title="Rujukan Kendala ke BK — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <ShieldAlert className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                {isWaliKelas
                                    ? 'Tracking Rujukan Kendala Siswa ke Guru BK'
                                    : 'Manajemen Rujukan Kasus Siswa (Guru BK)'}
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            {isWaliKelas
                                ? 'Lapor kendala siswa binaan Anda ke Guru BK, lalu pantau status dan histori penanganannya. Validasi dan penyelesaian kasus sepenuhnya dilakukan oleh Guru BK.'
                                : 'Guru BK menerima rujukan kendala siswa dari Wali Kelas, melakukan tindakan bimbingan & konseling, lalu mencatat hasil penanganan yang otomatis terlacak di dashboard Wali Kelas.'}
                        </p>
                    </div>

                    {isWaliKelas ? (
                        <button
                            type="button"
                            id="btn-laporkan-kendala-siswa"
                            onClick={handleOpenReferralModal}
                            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 active:scale-95 sm:self-center"
                        >
                            <Plus className="size-4" />
                            <span>Laporkan Kendala Siswa ke BK</span>
                        </button>
                    ) : (
                        <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/90 px-4 py-2 text-xs font-semibold text-blue-800 shadow-2xs dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                            <Inbox className="size-4 text-blue-600 dark:text-blue-400" />
                            <span>Menerima Rujukan Masuk dari Wali Kelas</span>
                        </div>
                    )}
                </div>

                {/* Tracking Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Total Rujukan ke Guru BK</span>
                            <Inbox className="size-4 text-blue-600" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                            {cases.length}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">
                            {isWaliKelas
                                ? 'Semua kendala siswa yang Anda laporkan ke Guru BK'
                                : 'Semua kendala siswa yang dilaporkan oleh Wali Kelas'}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs dark:border-amber-950/60 dark:bg-amber-950/20">
                        <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
                            <span className="font-semibold">Menunggu Penanganan BK</span>
                            <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-amber-900 dark:text-amber-200">
                            {totalPending}
                        </div>
                        <p className="mt-1 text-[11px] text-amber-700/90 dark:text-amber-300/80">
                            Perlu segera ditindaklanjuti dengan konseling siswa
                        </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs dark:border-emerald-950/60 dark:bg-emerald-950/20">
                        <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                            <span className="font-semibold">Sudah Ditangani Guru BK</span>
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-200">
                            {totalHandled}
                        </div>
                        <p className="mt-1 text-[11px] text-emerald-700/90 dark:text-emerald-300/80">
                            Terselesaikan & terdokumentasi di sistem
                        </p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari rujukan berdasarkan nama siswa, kode, kelas, atau wali kelas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-xs text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-[#111c30] dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-center">
                        <Filter className="mr-1 size-3.5 text-slate-400" />
                        <button
                            type="button"
                            onClick={() => setStatusFilter('all')}
                            className={cn(
                                'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
                                statusFilter === 'all'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
                            )}
                        >
                            Semua ({cases.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('pending')}
                            className={cn(
                                'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
                                statusFilter === 'pending'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
                            )}
                        >
                            Menunggu ({totalPending})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('handled')}
                            className={cn(
                                'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
                                statusFilter === 'handled'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
                            )}
                        >
                            Sudah Ditangani ({totalHandled})
                        </button>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    WALI KELAS VIEW: Read-Only Track & History
                    ═══════════════════════════════════════════════════════════ */}
                {isWaliKelas && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs dark:border-blue-900/60 dark:bg-blue-950/20">
                            <AlertCircle className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                            <p className="leading-relaxed text-blue-800 dark:text-blue-300">
                                <strong>Peran Wali Kelas:</strong> Anda hanya dapat melaporkan kendala siswa ke Guru BK.
                                Validasi, penugasan, sesi konseling, dan penyelesaian kasus sepenuhnya menjadi wewenang{' '}
                                <strong>Guru BK</strong>. Pantau status dan histori penanganan di bawah ini.
                            </p>
                        </div>

                        {filteredCases.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-[#0f172a]">
                                <FileText className="size-10 text-slate-300 dark:text-slate-600" />
                                <div>
                                    <p className="font-semibold text-slate-600 dark:text-slate-400">
                                        Belum ada rujukan yang dilaporkan
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Klik "Laporkan Kendala Siswa ke BK" untuk membuat rujukan baru.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {filteredCases.map((c) => {
                                    const isHandled =
                                        c.isHandledByBk || c.stage === 'handled_by_bk' || c.stage === 'resolved';
                                    return (
                                        <div
                                            key={c.id}
                                            className={cn(
                                                'space-y-3 rounded-2xl border p-4 text-xs shadow-xs',
                                                isHandled
                                                    ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/60 dark:bg-emerald-950/10'
                                                    : 'border-amber-200 bg-amber-50/30 dark:border-amber-900/60 dark:bg-amber-950/10',
                                            )}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        {c.studentName}
                                                    </div>
                                                    <span className="font-mono text-[10px] text-slate-400">
                                                        {c.code} • {c.class}
                                                    </span>
                                                </div>
                                                {isHandled ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                                                        <CheckCircle2 className="size-3" />
                                                        Sudah Ditangani BK
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                                                        <Clock className="size-3" />
                                                        Menunggu BK
                                                    </span>
                                                )}
                                            </div>

                                            <div className="rounded-lg border border-sky-200/80 bg-sky-50/70 p-2.5 dark:border-sky-950 dark:bg-sky-950/30">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="font-semibold text-sky-800 dark:text-sky-300">
                                                        Kendala yang Anda Laporkan:
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'rounded px-1.5 py-0.5 text-[10px] font-bold',
                                                            c.priority === 'Tinggi'
                                                                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                                : c.priority === 'Sedang'
                                                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                                                        )}
                                                    >
                                                        {c.priority}
                                                    </span>
                                                </div>
                                                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                                                    {c.referralNotes || c.lastActivity}
                                                </p>
                                                <div className="mt-1.5 text-[10px] text-slate-500">
                                                    Kategori:{' '}
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                                        {c.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {isHandled && (
                                                <div className="rounded-lg border border-emerald-200 bg-white p-2.5 shadow-2xs dark:border-emerald-900/60 dark:bg-[#070b14]">
                                                    <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                                                        <span>✓ Hasil Penanganan Guru BK</span>
                                                        <span>{c.handledAt || c.lastUpdate}</span>
                                                    </div>
                                                    {c.handledByBkName && (
                                                        <div className="text-[10px] text-slate-500">
                                                            Ditangani oleh:{' '}
                                                            <strong className="text-slate-700 dark:text-slate-300">
                                                                {c.handledByBkName}
                                                            </strong>
                                                        </div>
                                                    )}
                                                    {c.bkActionType && (
                                                        <div className="text-[10px] text-slate-500">
                                                            Tindakan:{' '}
                                                            <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                                                {c.bkActionType}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {c.bkHandlingNotes && (
                                                        <p className="mt-1.5 border-t border-slate-100 pt-1.5 leading-relaxed text-slate-700 dark:border-slate-800 dark:text-slate-300">
                                                            {c.bkHandlingNotes}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {c.timeline && c.timeline.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                                                        <History className="size-3" />
                                                        Riwayat
                                                    </div>
                                                    {c.timeline.slice(-3).map((t, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-start gap-1.5 text-[10px] text-slate-600 dark:text-slate-400"
                                                        >
                                                            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
                                                            <span>
                                                                <span className="text-slate-400">{t.time}</span>{' '}
                                                                — {t.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {!isHandled && (
                                                <div className="border-t border-amber-200/60 pt-2 text-[10px] italic text-amber-700/80 dark:border-amber-900/40 dark:text-amber-400/70">
                                                    ⏳ Menunggu tindak lanjut dari Guru BK…
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    GURU BK VIEW: Kanban Board with Action Buttons
                    ═══════════════════════════════════════════════════════════ */}
                {isGuruBk && <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-4">
                    {/* Column 1: Baru Masuk dari Wali Kelas */}
                    <div className="flex flex-col space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-600" />
                                1. Rujukan Baru Masuk
                            </span>
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {newCases.length}
                            </span>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {newCases.map((c) => (
                                <div
                                    key={c.id}
                                    className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-[#111c30]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                {c.studentName}
                                            </div>
                                            <span className="font-mono text-[10px] text-slate-400">
                                                {c.code} • {c.class}
                                            </span>
                                        </div>
                                        <span
                                            className={cn(
                                                'rounded px-1.5 py-0.5 text-[10px] font-bold',
                                                c.priority === 'Tinggi'
                                                    ? 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
                                                    : 'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
                                            )}
                                        >
                                            {c.priority}
                                        </span>
                                    </div>

                                    {/* Wali Kelas referral details */}
                                    <div className="rounded-lg border border-sky-200/80 bg-sky-50/70 p-2.5 text-[11px] dark:border-sky-950 dark:bg-sky-950/30">
                                        <div className="flex items-center justify-between font-semibold text-sky-800 dark:text-sky-300">
                                            <span>Rujukan dari Wali Kelas:</span>
                                            <span className="text-[10px] font-medium text-sky-700 dark:text-sky-400">
                                                {c.referredByName || 'Wali Kelas'}
                                            </span>
                                        </div>
                                        <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                                            {c.referralNotes || c.lastActivity}
                                        </p>
                                    </div>

                                    <div className="pt-1">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenHandlingModal(c)}
                                            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-700 py-1.5 text-center text-[11px] font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 active:scale-95"
                                        >
                                            <CheckCircle2 className="size-3.5" />
                                            <span>Tangani Rujukan BK →</span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {newCases.length === 0 && (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    Tidak ada rujukan baru yang menunggu.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Dalam Penugasan */}
                    <div className="flex flex-col space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-600" />
                                2. Terjadwal Penugasan
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {assignedCases.length}
                            </span>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {assignedCases.map((c) => (
                                <div
                                    key={c.id}
                                    className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-[#111c30]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                {c.studentName}
                                            </div>
                                            <span className="font-mono text-[10px] text-slate-400">
                                                {c.code} • {c.class}
                                            </span>
                                        </div>
                                        <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
                                            {c.category}
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-sky-200/80 bg-sky-50/70 p-2.5 text-[11px] dark:border-sky-950 dark:bg-sky-950/30">
                                        <div className="flex items-center justify-between font-semibold text-sky-800 dark:text-sky-300">
                                            <span>Rujukan Wali Kelas:</span>
                                            <span className="text-[10px] font-medium text-sky-700 dark:text-sky-400">
                                                {c.referredByName || 'Wali Kelas'}
                                            </span>
                                        </div>
                                        <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                                            {c.referralNotes || c.lastActivity}
                                        </p>
                                    </div>

                                    <div className="text-[10px] text-slate-500">
                                        Konselor BK:{' '}
                                        <strong className="text-slate-700 dark:text-slate-300">
                                            {c.assignee}
                                        </strong>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleOpenHandlingModal(c)}
                                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-700 py-1.5 text-center text-[11px] font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 active:scale-95"
                                    >
                                        <CheckCircle2 className="size-3.5" />
                                        <span>Catat Hasil Penanganan →</span>
                                    </button>
                                </div>
                            ))}

                            {assignedCases.length === 0 && (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    Tidak ada rujukan dalam jadwal penugasan.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Sedang Ditangani / Sesi Aktif */}
                    <div className="flex flex-col space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-600" />
                                3. Sesi Konseling Berjalan
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {inProgressCases.length}
                            </span>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {inProgressCases.map((c) => (
                                <div
                                    key={c.id}
                                    className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-[#111c30]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                {c.studentName}
                                            </div>
                                            <span className="font-mono text-[10px] text-slate-400">
                                                {c.code} • {c.class}
                                            </span>
                                        </div>
                                        <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                            Konseling Aktif
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-sky-200/80 bg-sky-50/70 p-2.5 text-[11px] dark:border-sky-950 dark:bg-sky-950/30">
                                        <div className="flex items-center justify-between font-semibold text-sky-800 dark:text-sky-300">
                                            <span>Rujukan Wali Kelas:</span>
                                            <span className="text-[10px] font-medium text-sky-700 dark:text-sky-400">
                                                {c.referredByName || 'Wali Kelas'}
                                            </span>
                                        </div>
                                        <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                                            {c.referralNotes || c.lastActivity}
                                        </p>
                                    </div>

                                    <div className="text-[10px] text-slate-500">
                                        Konselor:{' '}
                                        <strong className="text-slate-700 dark:text-slate-300">
                                            {c.assignee}
                                        </strong>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleOpenHandlingModal(c)}
                                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-1.5 text-center text-[11px] font-semibold text-white shadow-2xs transition-colors hover:bg-emerald-800 active:scale-95"
                                    >
                                        <CheckCircle2 className="size-3.5" />
                                        <span>Selesaikan & Konfirmasi Ditangani ✓</span>
                                    </button>
                                </div>
                            ))}

                            {inProgressCases.length === 0 && (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    Tidak ada kasus dalam sesi aktif berjalan.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 4: Sudah Ditangani oleh Guru BK & Terdokumentasi */}
                    <div className="flex flex-col space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-emerald-600" />
                                4. Sudah Ditangani Guru BK
                            </span>
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {handledCases.length}
                            </span>
                        </div>

                        <div className="space-y-2.5 overflow-y-auto">
                            {handledCases.map((c) => (
                                <div
                                    key={c.id}
                                    className="space-y-2 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3 text-xs dark:border-emerald-900/60 dark:bg-emerald-950/20"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {c.studentName}
                                            </div>
                                            <span className="font-mono text-[10px] text-slate-400">
                                                {c.code} • {c.class}
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                                            <CheckCircle2 className="size-3" />
                                            Ditangani
                                        </span>
                                    </div>

                                    {/* Perujuk Wali Kelas */}
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                        Perujuk: <span className="font-medium text-slate-700 dark:text-slate-300">{c.referredByName || 'Wali Kelas'}</span>
                                    </div>

                                    {/* Handling Record Box */}
                                    <div className="rounded-lg border border-emerald-200 bg-white p-2.5 text-[11px] leading-relaxed shadow-2xs dark:border-emerald-900/60 dark:bg-[#070b14]">
                                        <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                                            <span>Tindakan: {c.bkActionType || 'Konseling Siswa'}</span>
                                            <span>{c.handledAt || c.lastUpdate}</span>
                                        </div>
                                        <div className="mt-1 text-[10px] text-slate-500">
                                            Ditangani oleh:{' '}
                                            <strong className="text-slate-700 dark:text-slate-300">
                                                {c.handledByBkName || c.assignee}
                                            </strong>
                                        </div>
                                        <p className="mt-1.5 border-t border-slate-100 pt-1.5 text-slate-700 dark:border-slate-800 dark:text-slate-300">
                                            {c.bkHandlingNotes || c.lastActivity}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-0.5 text-[10px] text-emerald-700 dark:text-emerald-400">
                                        <span>✓ Status di Dashboard Wali Kelas: Sinkron</span>
                                    </div>
                                </div>
                            ))}

                            {handledCases.length === 0 && (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    Belum ada kasus rujukan yang selesai ditangani.
                                </div>
                            )}
                        </div>
                    </div>
                </div>}
            </div>

            {/* Modal: Wali Kelas — Laporkan Kendala Siswa ke Guru BK */}
            {isWaliKelas && isReferralModalOpen && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    <Send className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Laporkan Kendala Siswa ke Guru BK
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Guru BK akan menerima laporan ini untuk ditindaklanjuti.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsReferralModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReferral} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block font-semibold text-slate-700 dark:text-slate-300">
                                    Siswa yang Bermasalah <span className="text-red-500">*</span>
                                </label>
                                {students.length === 0 ? (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-[11px] text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                                        Belum ada data siswa di kelas Anda. Tambahkan siswa terlebih dahulu.
                                    </div>
                                ) : (
                                    <select
                                        value={refStudentId}
                                        onChange={(e) => setRefStudentId(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-[#111c30] dark:text-white"
                                        required
                                    >
                                        <option value="">— Pilih Siswa —</option>
                                        {students.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.className}) — NISN: {s.nisn}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori Kendala
                                    </label>
                                    <select
                                        value={refCategory}
                                        onChange={(e) => setRefCategory(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-[#111c30] dark:text-white"
                                    >
                                        {REFERRAL_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block font-semibold text-slate-700 dark:text-slate-300">
                                        Prioritas
                                    </label>
                                    <select
                                        value={refPriority}
                                        onChange={(e) =>
                                            setRefPriority(e.target.value as 'Rendah' | 'Sedang' | 'Tinggi')
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-[#111c30] dark:text-white"
                                    >
                                        <option value="Rendah">Rendah</option>
                                        <option value="Sedang">Sedang</option>
                                        <option value="Tinggi">Tinggi</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block font-semibold text-slate-700 dark:text-slate-300">
                                    Rincian Kendala Siswa <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={refNotes}
                                    onChange={(e) => setRefNotes(e.target.value)}
                                    placeholder="Jelaskan secara rinci kendala yang dialami siswa, latar belakang situasi, dampak di kelas, dan harapan tindak lanjut dari Guru BK..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs leading-relaxed text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-[#111c30] dark:text-white"
                                    required
                                />
                                <p className="mt-1 text-[10px] text-slate-500">
                                    Laporan ini diteruskan langsung ke Guru BK. Pantau statusnya di halaman ini.
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsReferralModalOpen(false)}
                                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isRefSubmitting || students.length === 0}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white shadow-2xs hover:bg-blue-800 active:scale-95 disabled:opacity-50"
                                >
                                    <Send className="size-4" />
                                    <span>{isRefSubmitting ? 'Mengirim...' : 'Kirim ke Guru BK'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Guru BK — Form Penanganan Rujukan */}
            {isGuruBk && selectedCaseForHandling && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    <UserCheck className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Tangani Rujukan Kendala Siswa
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Nomor Rujukan: {selectedCaseForHandling.code}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseHandlingModal}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Student and Wali Kelas Info */}
                        <div className="space-y-2 rounded-xl border border-sky-100 bg-sky-50/70 p-3 text-[11px] dark:border-sky-950 dark:bg-sky-950/30">
                            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                                <span>{selectedCaseForHandling.studentName}</span>
                                <span className="font-normal text-slate-500">
                                    Kelas {selectedCaseForHandling.class}
                                </span>
                            </div>
                            <div className="text-[10px] text-sky-800 dark:text-sky-300">
                                <strong>Laporan dari Wali Kelas ({selectedCaseForHandling.referredByName || 'Wali Kelas'}):</strong>
                            </div>
                            <p className="italic text-slate-700 leading-relaxed dark:text-slate-300">
                                "{selectedCaseForHandling.referralNotes || selectedCaseForHandling.lastActivity}"
                            </p>
                        </div>

                        <form onSubmit={handleSubmitHandling} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block font-semibold text-slate-700 dark:text-slate-300">
                                    Jenis Tindakan Bimbingan & Konseling
                                </label>
                                <select
                                    value={actionType}
                                    onChange={(e) => setActionType(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-[#111c30] dark:text-white"
                                >
                                    {ACTION_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan Hasil Penanganan & Komitmen Siswa <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={handlingNotes}
                                    onChange={(e) => setHandlingNotes(e.target.value)}
                                    placeholder="Jelaskan proses konseling yang dilakukan, akar kendala yang diungkap siswa, solusi yang disepakati, serta komitmen tindak lanjut..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs leading-relaxed text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-[#111c30] dark:text-white"
                                    required
                                />
                                <p className="mt-1 text-[10px] text-slate-500">
                                    Catatan ini akan otomatis tampil di Dashboard Wali Kelas sebagai bukti rujukan telah ditangani oleh Guru BK.
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={handleCloseHandlingModal}
                                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white shadow-2xs hover:bg-emerald-800 active:scale-95 disabled:opacity-50"
                                >
                                    <CheckCircle2 className="size-4" />
                                    <span>
                                        {isSubmitting
                                            ? 'Menyimpan...'
                                            : 'Simpan & Konfirmasi Sudah Ditangani'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </FlowbiteTanggapinLayout>
    );
}

ManajemenKasus.layout = (page: React.ReactNode) => page;
