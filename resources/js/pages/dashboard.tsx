import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Award,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    Database,
    DollarSign,
    Eye,
    FileCheck,
    FileText,
    GraduationCap,
    HeartPulse,
    Layers,
    MapPin,
    MessageSquare,
    PhoneCall,
    Plus,
    RefreshCw,
    Scale,
    Send,
    Shield,
    ShieldAlert,
    Siren,
    Sparkles,
    UserCheck,
    Users,
    WalletCards,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useActionModals } from '@/components/action-modals';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { ROLE_CONFIGS } from '@/lib/role-config';
import { cn } from '@/lib/utils';
import type {
    CaseItem,
    ClassMonitoringItem,
    DashboardPageProps,
    PriorityAlert,
    RoleType,
} from '@/types/tanggapin';

export default function Dashboard({
    stats = {
        studentsNeedingAttention: 12,
        activeCases: 4,
        overdueCases: 2,
        dataCheckIssues: 7,
        duePayments: 18,
        activeIncidents: 1,
        resolvedThisMonth: 24,
    },
    priorityFeed = [],
    classes = [],
    cases = [],
    paymentList = [],
}: DashboardPageProps) {
    const {
        openFollowupModal,
        openParentContactModal,
        openNewCaseModal,
        openStudent360Modal,
    } = useActionModals();

    const page = usePage<{ auth?: { user?: { name?: string; email?: string; role?: RoleType } } }>();
    const authRole = page.props.auth?.user?.role;

    const [currentRole, setCurrentRole] = useState<RoleType>(() => {
        if (authRole && Object.keys(ROLE_CONFIGS).includes(authRole)) {
            return authRole;
        }
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tanggapin_current_role') as RoleType;
            if (saved && Object.keys(ROLE_CONFIGS).includes(saved)) {
                return saved;
            }
        }
        return 'kepala_sekolah';
    });

    useEffect(() => {
        if (authRole && Object.keys(ROLE_CONFIGS).includes(authRole)) {
            setCurrentRole(authRole);
            if (typeof window !== 'undefined') {
                localStorage.setItem('tanggapin_current_role', authRole);
            }
        }
    }, [authRole]);

    const [feedRiskFilter, setFeedRiskFilter] = useState<'all' | 'high' | 'medium'>('all');

    // State for Bendahara interactive payment verification demo
    const [pendingPayments, setPendingPayments] = useState(() => {
        if (paymentList && paymentList.length > 0) {
            return paymentList.slice(0, 6).map((p, idx) => ({
                id: p.id || `pay-${idx + 1}`,
                invoiceNo: p.invoiceNo || `INV-2025-08${idx + 1}`,
                studentName: p.studentName,
                class: p.class,
                type: p.type,
                amount: typeof p.amount === 'number' ? `Rp ${p.amount.toLocaleString('id-ID')}` : String(p.amount),
                method: idx % 2 === 0 ? 'Transfer BCA' : 'Transfer Mandiri',
                status: p.status,
                date: 'Hari ini',
            }));
        }
        return [
            { id: 'pay-1', invoiceNo: 'INV-2025-081', studentName: 'Ahmad Dani', class: 'XI RPL 2', type: 'SPP September 2025', amount: 'Rp 250.000', method: 'Transfer BCA', status: 'Menunggu Verifikasi', date: 'Hari ini, 08:30' },
            { id: 'pay-2', invoiceNo: 'INV-2025-082', studentName: 'Budi Santoso', class: 'XI TKJ 1', type: 'Praktik Kejuruan', amount: 'Rp 350.000', method: 'Transfer Mandiri', status: 'Menunggu Verifikasi', date: 'Hari ini, 09:15' },
            { id: 'pay-3', invoiceNo: 'INV-2025-083', studentName: 'Siti Rahma', class: 'X MM 1', type: 'SPP September 2025', amount: 'Rp 250.000', method: 'QRIS', status: 'Menunggu Verifikasi', date: 'Kemarin, 16:45' },
            { id: 'pay-4', invoiceNo: 'INV-2025-084', studentName: 'Dian Permana', class: 'XII RPL 1', type: 'Tunggakan SPP Agustus', amount: 'Rp 250.000', method: 'Tunai Kasir', status: 'Menunggu Verifikasi', date: 'Kemarin, 14:20' },
            { id: 'pay-5', invoiceNo: 'INV-2025-085', studentName: 'Rian Pratama', class: 'X TKJ 2', type: 'SPP September 2025', amount: 'Rp 250.000', method: 'Transfer BNI', status: 'Menunggu Verifikasi', date: '2 hari lalu' },
            { id: 'pay-6', invoiceNo: 'INV-2025-086', studentName: 'Fani Amelia', class: 'XI RPL 1', type: 'Uang Praktik TKJ/RPL', amount: 'Rp 350.000', method: 'Transfer Mandiri', status: 'Menunggu Verifikasi', date: '2 hari lalu' },
        ];
    });

    const handleRoleChange = (role: RoleType) => {
        setCurrentRole(role);
        if (typeof window !== 'undefined') {
            localStorage.setItem('tanggapin_current_role', role);
        }
        toast.info(`Beralih peran operasional ke: ${ROLE_CONFIGS[role].title}`);
    };

    const handleVerifyPayment = (id: string, invoiceNo: string) => {
        setPendingPayments((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, status: 'Lunas' } : item
            )
        );
        toast.success(`Tagihan ${invoiceNo} berhasil diverifikasi & status diubah menjadi Lunas!`);
    };

    const handleSendReminderWA = (studentName: string) => {
        toast.success(`Pesan pengingat pembayaran santun untuk ${studentName} terkirim via WhatsApp ke orang tua!`);
    };

    const handleTriggerActionModal = (modalId: string) => {
        if (modalId === 'followup') {
            openFollowupModal();
        } else if (modalId === 'parent_contact') {
            openParentContactModal();
        } else if (modalId === 'new_case') {
            openNewCaseModal();
        } else if (modalId === 'student_360') {
            if (priorityFeed.length > 0) {
                openStudent360Modal(priorityFeed[0]);
            } else {
                toast.info('Pilih siswa untuk membuka profil 360°');
            }
        }
    };

    const activeRoleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.kepala_sekolah;

    // Filter priority feed by risk level
    const filteredPriorityFeed = priorityFeed.filter((item) => {
        if (feedRiskFilter === 'all') return true;
        return item.riskLevel === feedRiskFilter;
    });

    // Wali Kelas priority feed: prioritize students from XI RPL 2 or homeroom
    const homeroomPriorityFeed = currentRole === 'wali_kelas'
        ? priorityFeed.filter((item) => item.class === 'XI RPL 2' || item.studentName.toLowerCase().includes('ahmad') || item.studentName.toLowerCase().includes('budi'))
        : filteredPriorityFeed;

    return (
        <FlowbiteTanggapinLayout
            activeTab="overview"
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            onTriggerActionModal={handleTriggerActionModal}
        >
            <Head title={`Ikhtisar & Tindakan (${activeRoleConfig.title}) — TANGGAPIN`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* ========================================================================= */}
                {/* 1. CONTEXTUAL OPERATIONAL HEADER WITH ROLE SIMULATOR                      */}
                {/* ========================================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-700 text-white shadow-2xs">
                                <Sparkles className="size-3" />
                                TANGGAPIN
                            </span>
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border',
                                    currentRole === 'kepala_sekolah' || currentRole === 'operator'
                                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                )}
                            >
                                {activeRoleConfig.scopeBadge}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                SMK Negeri 1 Harapan • T.A. 2025/2026 Ganjil
                            </span>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight pt-0.5">
                            {activeRoleConfig.overviewTitle}
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Masuk sebagai <strong className="font-semibold text-blue-700 dark:text-blue-400">{activeRoleConfig.userName}</strong> ({activeRoleConfig.title}).{' '}
                            {activeRoleConfig.overviewSubtitle}
                        </p>
                    </div>

                    {/* Role Simulator Switcher Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100/80 dark:bg-[#162238] border border-slate-200 dark:border-slate-700 self-start lg:self-center shrink-0">
                        <span className="text-[11px] font-semibold text-slate-500 px-2">Peran:</span>
                        {(['kepala_sekolah', 'operator', 'wali_kelas', 'bendahara', 'guru_bk'] as RoleType[]).map((r) => {
                            const config = ROLE_CONFIGS[r];
                            const isCurrent = currentRole === r;
                            return (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => handleRoleChange(r)}
                                    className={cn(
                                        'px-2.5 py-1 text-xs rounded-lg font-medium transition-all',
                                        isCurrent
                                            ? 'bg-blue-700 text-white font-semibold shadow-xs'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700'
                                    )}
                                >
                                    {config.shortTitle}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. ROLE-TAILORED 4 KEY METRIC CARDS                                      */}
                {/* ========================================================================= */}

                {/* ROLE CASE A: BENDAHARA */}
                {currentRole === 'bendahara' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                        <Link
                            href="/pembayaran"
                            className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 hover:border-purple-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                                    Tagihan Tertunda
                                </span>
                                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 group-hover:scale-105 transition-transform">
                                    <Clock className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 tracking-tight">
                                {stats.duePayments}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Siswa belum menyelesaikan SPP September
                            </p>
                            <div className="mt-3 pt-2 border-t border-purple-200/60 dark:border-purple-900/60 flex items-center justify-between text-[11px] text-purple-700 dark:text-purple-400 font-semibold">
                                <span>Buka Modul Pembayaran</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="/pembayaran"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Menunggu Verifikasi
                                </span>
                                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 group-hover:scale-105 transition-transform">
                                    <CheckCircle2 className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 tracking-tight">
                                {pendingPayments.filter((p) => p.status === 'Menunggu Verifikasi').length} Bukti
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Transfer bank & QRIS butuh validasi
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Rekonsiliasi Kas</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs block">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Realisasi SPP Bulan Ini
                                </span>
                                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                    <DollarSign className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
                                84.5%
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Rp 42.5jt tercatat dari total 144 siswa
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                <span>Target Tercapai Baik</span>
                            </div>
                        </div>

                        <Link
                            href="/early-warning"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Siswa Kendala Biaya
                                </span>
                                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 group-hover:scale-105 transition-transform">
                                    <Users className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">
                                4 Siswa
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Terdeteksi butuh dispensasi / skema afirmasi
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Pantau Early Warning</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </div>
                )}

                {/* ROLE CASE B: WALI KELAS */}
                {currentRole === 'wali_kelas' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                        <Link
                            href="/kondisi-kelas"
                            className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 hover:border-blue-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                                    Kehadiran XI RPL 2
                                </span>
                                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 group-hover:scale-105 transition-transform">
                                    <GraduationCap className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">
                                94.2%
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                34/36 siswa hadir tepat waktu hari ini
                            </p>
                            <div className="mt-3 pt-2 border-t border-blue-200/60 dark:border-blue-900/60 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Buka Presensi Rombel</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="/early-warning"
                            className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 hover:border-red-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                                    Perlu Perhatian Kelas
                                </span>
                                <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 group-hover:scale-105 transition-transform">
                                    <AlertTriangle className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-red-700 dark:text-red-400 tracking-tight">
                                2 Siswa
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Ahmad Dani & Citra L. butuh pendampingan
                            </p>
                            <div className="mt-3 pt-2 border-t border-red-200/60 dark:border-red-900/60 flex items-center justify-between text-[11px] text-red-700 dark:text-red-400 font-semibold">
                                <span>Tindak Lanjut Segera</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="/komunikasi-ortu"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Pesan ke Orang Tua
                                </span>
                                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 group-hover:scale-105 transition-transform">
                                    <PhoneCall className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
                                5 Terkirim
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Laporan perkembangan santun via WhatsApp
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Riwayat Komunikasi</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="/dokumen-guru"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Modul Ajar Saya
                                </span>
                                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform">
                                    <FileText className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">
                                4/4 Berkas
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                RPP, Modul & Presensi terverifikasi lengkap
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Kelola Modul Ajar</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </div>
                )}

                {/* ROLE CASE C: GURU BK */}
                {currentRole === 'guru_bk' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                        <Link
                            href="/manajemen-kasus"
                            className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 hover:border-amber-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                                    Kasus Aktif BK
                                </span>
                                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 group-hover:scale-105 transition-transform">
                                    <ShieldAlert className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 tracking-tight">
                                {stats.activeCases} Kasus
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Bimbingan & mediasi sedang berlangsung
                            </p>
                            <div className="mt-3 pt-2 border-t border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                                <span>Papan Kanban Kasus</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="/manajemen-kasus"
                            className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 hover:border-red-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                                    Evaluasi &gt;48 Jam
                                </span>
                                <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 group-hover:scale-105 transition-transform">
                                    <Clock className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-red-700 dark:text-red-400 tracking-tight">
                                {stats.overdueCases} Kasus
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Membutuhkan evaluasi lanjutan segera
                            </p>
                            <div className="mt-3 pt-2 border-t border-red-200/60 dark:border-red-900/60 flex items-center justify-between text-[11px] text-red-700 dark:text-red-400 font-semibold">
                                <span>Tinjau Kasus Terlambat</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="/early-warning"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-red-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Sinyal Early Warning
                                </span>
                                <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 group-hover:scale-105 transition-transform">
                                    <AlertTriangle className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {stats.studentsNeedingAttention} Siswa
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Deteksi anomali absensi & kedisiplinan
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Buka Early Warning</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="/alur-ats"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Rawan ATS (Putus Sekolah)
                                </span>
                                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 group-hover:scale-105 transition-transform">
                                    <HeartPulse className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 tracking-tight">
                                3 Siswa
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Terjadwal kunjungan rumah (home visit)
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Alur Lapangan ATS</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </div>
                )}

                {/* ROLE CASE D: OPERATOR DAPODIK */}
                {currentRole === 'operator' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                        <Link
                            href="/dapodik"
                            className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/60 hover:border-orange-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                                    Residu & Anomali
                                </span>
                                <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 group-hover:scale-105 transition-transform">
                                    <CheckCircle2 className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-orange-700 dark:text-orange-400 tracking-tight">
                                {stats.dataCheckIssues} Isu
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                NIK ganda, NISN invalid, data residu Dapodik
                            </p>
                            <div className="mt-3 pt-2 border-t border-orange-200/60 dark:border-orange-900/60 flex items-center justify-between text-[11px] text-orange-700 dark:text-orange-400 font-semibold">
                                <span>Periksa Data Dapodik</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="/early-warning"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-red-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Siswa Butuh Perhatian
                                </span>
                                <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 group-hover:scale-105 transition-transform">
                                    <AlertTriangle className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-red-700 dark:text-red-400 tracking-tight">
                                {stats.studentsNeedingAttention}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Terdeteksi anomali kehadiran & akademik
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Early Warning System</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <Link
                            href="/dokumen-guru"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Dokumen Kinerja Guru
                                </span>
                                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 group-hover:scale-105 transition-transform">
                                    <FileText className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                25 Berkas
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                SK pembagian tugas, modul ajar, dan portofolio
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Verifikasi Berkas</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs block">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Sinkronisasi Dapodik
                                </span>
                                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                    <Database className="size-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
                                Terhubung
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Sinkron server pusat: Hari ini, 06:30 WIB
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                <span>Kesiapan Kirim: Siap</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ROLE CASE E: KEPALA SEKOLAH (EXECUTIVE ALL-VIEW) */}
                {currentRole === 'kepala_sekolah' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                        {/* Primary Highlight Metric: Siswa Perlu Perhatian */}
                        <Link
                            href="/early-warning"
                            className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 hover:border-red-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
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
                                {stats.studentsNeedingAttention} Siswa
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                Sinyal risiko absensi, nilai, & kedisiplinan
                            </p>
                            <div className="mt-3 pt-2 border-t border-red-200/60 dark:border-red-900/60 flex items-center justify-between text-[11px] text-red-700 dark:text-red-400 font-semibold">
                                <span>Tinjau Sinyal Early Warning</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        {/* Secondary Metric: Kasus Aktif BK */}
                        <Link
                            href="/manajemen-kasus"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
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
                                {stats.activeCases} Kasus
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                {stats.overdueCases} kasus butuh evaluasi &gt;48 jam
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                                <span>Alur Kasus BK</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        {/* Secondary Metric: Tingkat Kehadiran Sekolah */}
                        <Link
                            href="/kondisi-kelas"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
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
                                <span>Lihat Rombel & Presensi</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>

                        {/* Secondary Metric: Pembayaran & SPP */}
                        <Link
                            href="/pembayaran"
                            className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition-all cursor-pointer group shadow-2xs hover:shadow-xs block"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Tagihan Tertunda
                                </span>
                                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 group-hover:scale-105 transition-transform">
                                    <WalletCards className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 tracking-tight">
                                {stats.duePayments} Tagihan
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                SPP & uang praktik siswa belum lunas
                            </p>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-purple-700 dark:text-purple-400 font-semibold">
                                <span>Pantau Kas Sekolah</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* 3. ROLE-TAILORED OPERATIONAL WORKSPACE & ACTION CENTER                    */}
                {/* ========================================================================= */}

                {/* WORKSPACE A: BENDAHARA (Antrean Verifikasi Pembayaran & Reminder Tagihan) */}
                {currentRole === 'bendahara' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-purple-600 animate-pulse" />
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Antrean Verifikasi Pembayaran Masuk (Rekonsiliasi Real-Time)
                                    </h2>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Validasi bukti transfer dan pembayaran kasir untuk memperbarui status keuangan siswa secara otomatis.
                                </p>
                            </div>

                            <Link
                                href="/pembayaran"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm transition-colors self-start sm:self-center"
                            >
                                <WalletCards className="size-3.5" />
                                <span>Buku Kas & Tagihan Lengkap</span>
                            </Link>
                        </div>

                        {/* Interactive Verification Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-y border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-2.5">No. Invoice</th>
                                        <th className="px-4 py-2.5">Siswa / Rombel</th>
                                        <th className="px-4 py-2.5">Jenis Tagihan</th>
                                        <th className="px-4 py-2.5">Nominal & Metode</th>
                                        <th className="px-4 py-2.5">Status</th>
                                        <th className="px-4 py-2.5 text-center">Tindakan Bendahara</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {pendingPayments.map((pay) => (
                                        <tr key={pay.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                                            <td className="px-4 py-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                                                {pay.invoiceNo}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-slate-900 dark:text-white text-xs">{pay.studentName}</div>
                                                <div className="text-[11px] text-slate-500">{pay.class} • {pay.date}</div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                                                {pay.type}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-slate-900 dark:text-white">{pay.amount}</div>
                                                <div className="text-[10px] text-slate-500">{pay.method}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                                        pay.status === 'Lunas'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                                                    )}
                                                >
                                                    {pay.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {pay.status === 'Menunggu Verifikasi' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleVerifyPayment(pay.id, pay.invoiceNo)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-2xs transition-colors"
                                                        >
                                                            <Check className="size-3" />
                                                            <span>Verifikasi</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                            ✓ Tervalidasi
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSendReminderWA(pay.studentName)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                                                        title="Kirim konfirmasi tanda terima via WhatsApp"
                                                    >
                                                        <PhoneCall className="size-3 text-emerald-600" />
                                                        <span>WA Ortu</span>
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

                {/* WORKSPACE B: WALI KELAS (Pendampingan Khusus Rombel XI RPL 2) */}
                {currentRole === 'wali_kelas' && (
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-blue-600 animate-pulse" />
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Daftar Siswa Butuh Pendampingan di Rombel XI RPL 2
                                    </h2>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Fokus pada absensi, pemulihan nilai tugas kejuruan, dan komunikasi proaktif dengan wali murid.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                                <Link
                                    href="/kondisi-kelas"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                                >
                                    <GraduationCap className="size-3.5" />
                                    <span>Presensi XI RPL 2</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => openFollowupModal({ note: 'Catatan pembinaan wali kelas XI RPL 2' })}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Catat Pembinaan</span>
                                </button>
                            </div>
                        </div>

                        {/* List of Homeroom Students */}
                        <div className="space-y-3">
                            {homeroomPriorityFeed.slice(0, 3).map((alert) => (
                                <div
                                    key={alert.id}
                                    className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                {alert.studentName}
                                            </span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                                                {alert.class}
                                            </span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                                {alert.triggerType}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                • Terdeteksi {alert.timestamp}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                            {alert.summary}
                                        </p>

                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-4 pt-0.5">
                                            <span>Orang Tua: <strong className="font-medium text-slate-700 dark:text-slate-300">{alert.parentName} ({alert.parentPhone})</strong></span>
                                            <span>Rekomendasi: <strong className="font-medium text-blue-700 dark:text-blue-400">{alert.suggestedAction}</strong></span>
                                        </div>
                                    </div>

                                    {/* Action Buttons for Homeroom Teacher */}
                                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                                        <button
                                            type="button"
                                            onClick={() => openStudent360Modal(alert)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                        >
                                            <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                            <span>Profil Siswa</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                openParentContactModal({
                                                    studentId: alert.studentId || alert.id,
                                                    studentName: `${alert.studentName} (${alert.class})`,
                                                    studentPhone: alert.parentPhone,
                                                    message: `Yth. Bapak/Ibu ${alert.parentName}, saya Hendra Setiawan selaku Wali Kelas ${alert.class}. Menginfokan perkembangan ananda ${alert.studentName}: ${alert.summary}. Mohon berkenan berkoordinasi dengan kami.`,
                                                });
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
                                        >
                                            <PhoneCall className="size-3.5 text-emerald-600" />
                                            <span>WhatsApp Wali Murid</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                openNewCaseModal({
                                                    studentId: alert.studentId || alert.id,
                                                    studentName: `${alert.studentName} (${alert.class})`,
                                                    desc: `Rujukan dari Wali Kelas: ${alert.summary}`,
                                                });
                                            }}
                                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded-lg border border-transparent hover:border-amber-200 transition-colors"
                                            title="Rujuk ke Konseling BK"
                                        >
                                            <ShieldAlert className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* WORKSPACE C: KEPALA SEKOLAH, OPERATOR, & GURU BK (Priority Feed General) */}
                {currentRole !== 'bendahara' && currentRole !== 'wali_kelas' && (
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

                                        {/* Action-Oriented Buttons */}
                                        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                                            <button
                                                type="button"
                                                onClick={() => openStudent360Modal(alert)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                                title="Buka Profil Siswa 360°"
                                            >
                                                <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                <span>Profil 360°</span>
                                            </button>

                                            <button
                                                type="button"
                                                disabled={alert.actionTaken}
                                                onClick={() => {
                                                    openFollowupModal({
                                                        studentId: alert.studentId || alert.id,
                                                        studentName: `${alert.studentName} (${alert.class})`,
                                                        studentPhone: alert.parentPhone,
                                                        note: `Tindak lanjut pemicu risiko: ${alert.summary}`,
                                                    });
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors active:scale-95"
                                            >
                                                <Plus className="size-3.5" />
                                                <span>Buat Tindak Lanjut</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    openParentContactModal({
                                                        studentId: alert.studentId || alert.id,
                                                        studentName: `${alert.studentName} (${alert.class})`,
                                                        studentPhone: alert.parentPhone,
                                                        message: `Yth. Bapak/Ibu ${alert.parentName}, kami dari sekolah menginformasikan perkembangan ananda ${alert.studentName}. ${alert.summary}. Mohon berkenan berkoordinasi dengan sekolah demi kelancaran proses belajar.`,
                                                    });
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                                title="Kirim pesan terstruktur resmi ke orang tua"
                                            >
                                                <PhoneCall className="size-3.5 text-emerald-600" />
                                                <span className="hidden sm:inline">Hubungi Ortu</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    openNewCaseModal({
                                                        studentId: alert.studentId || alert.id,
                                                        studentName: `${alert.studentName} (${alert.class})`,
                                                        desc: `Eskalasi dari Early Warning: ${alert.summary}`,
                                                    });
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
                )}

                {/* ========================================================================= */}
                {/* 4. MULTI-ASPECT OPERATIONAL PREVIEWS (FILTERED BY ROLE PERMISSIONS)      */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* PREVIEW WIDGET 1: Class Health Monitoring (For Kepsek, Operator, Wali Kelas) */}
                    {activeRoleConfig.allowedTabs.includes('class-monitoring') && (
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
                                <Link
                                    href="/kondisi-kelas"
                                    className="text-xs text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                                >
                                    Semua Rombel <ChevronRight className="size-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {classes.slice(0, 3).map((cls) => {
                                    const isCritical = cls.healthStatus === 'critical';
                                    const isWarning = cls.healthStatus === 'warning';
                                    const isMyClass = cls.name === 'XI RPL 2' && currentRole === 'wali_kelas';

                                    return (
                                        <div
                                            key={cls.id}
                                            className={cn(
                                                'p-3.5 rounded-xl border space-y-2.5 transition-colors',
                                                isMyClass
                                                    ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 ring-1 ring-blue-400/40'
                                                    : 'bg-slate-50/70 dark:bg-[#111c30] border-slate-200 dark:border-slate-800 hover:border-blue-300'
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm me-2">
                                                        {cls.name} {isMyClass && <span className="text-[10px] text-blue-700 dark:text-blue-400 font-bold bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">Rombel Saya</span>}
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
                                                <Link
                                                    href="/kondisi-kelas"
                                                    className="text-blue-700 dark:text-blue-400 font-semibold hover:underline"
                                                >
                                                    Detail Rombel →
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* PREVIEW WIDGET 2: Case Workflow (For Kepsek, Operator, Guru BK) */}
                    {activeRoleConfig.allowedTabs.includes('cases') && (
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
                                    onClick={() => openNewCaseModal()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Buka Kasus</span>
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

                                <Link
                                    href="/manajemen-kasus"
                                    className="w-full text-center py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors border border-dashed border-blue-200 dark:border-blue-900 block"
                                >
                                    Buka Papan Kanban Kasus Lengkap ({cases.length} Kasus) →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* PREVIEW WIDGET 3: Payments & SPP Overview (For Kepsek, Operator, Bendahara) */}
                    {activeRoleConfig.allowedTabs.includes('payments') && currentRole !== 'bendahara' && (
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                        Ikhtisar Keuangan & SPP Sekolah
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Monitoring tunggakan dan verifikasi kas masuk.
                                    </p>
                                </div>
                                <Link
                                    href="/pembayaran"
                                    className="text-xs text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 font-semibold"
                                >
                                    Detail Kasir <ChevronRight className="size-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/80">
                                    <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold block mb-1">
                                        Total Tagihan Tertunda
                                    </span>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {stats.duePayments} Siswa
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">
                                        Perlu tindak lanjut bendahara
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80">
                                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold block mb-1">
                                        Tingkat Pembayaran
                                    </span>
                                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                        84.5%
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">
                                        Realisasi kas bulan berjalan
                                    </span>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <WalletCards className="size-4 text-purple-600" />
                                    <span className="text-slate-700 dark:text-slate-300">
                                        6 pembayaran baru menunggu validasi bukti transfer
                                    </span>
                                </div>
                                <Link
                                    href="/pembayaran"
                                    className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline"
                                >
                                    Validasi →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* PREVIEW WIDGET 4: Dapodik Health (For Kepsek & Operator) */}
                    {activeRoleConfig.allowedTabs.includes('data-check') && (
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                        Pusat Integritas Data Dapodik
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Validasi NIK, NISN, rombel, dan kelengkapan SK guru.
                                    </p>
                                </div>
                                <Link
                                    href="/dapodik"
                                    className="text-xs text-orange-700 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold"
                                >
                                    Buka Dapodik <ChevronRight className="size-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-2.5">
                                <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/80 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2 className="size-4 text-orange-600 shrink-0" />
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">7 Residu Data Belum Valid</div>
                                            <div className="text-[11px] text-slate-500">Perlu konfirmasi NIK/Kartu Keluarga dari wali murid</div>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dapodik"
                                        className="px-2.5 py-1 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors shrink-0"
                                    >
                                        Koreksi
                                    </Link>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Database className="size-4 text-blue-600" />
                                        <span className="text-slate-700 dark:text-slate-300">
                                            Sinkronisasi terakhir berhasil • 144 siswa terdaftar
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ========================================================================= */}
                {/* 5. QUICK ACCESS SHORTCUTS (STRICTLY FILTERED BY ROLE PERMISSIONS)        */}
                {/* ========================================================================= */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                    <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                Pintasan Modul Operasional ({activeRoleConfig.scopeBadge})
                            </h3>
                            <p className="text-[11px] text-slate-500">
                                Akses cepat langsung ke modul kerja yang diizinkan untuk peran {activeRoleConfig.title}.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
                        {activeRoleConfig.allowedTabs.includes('early-warning') && (
                            <Link
                                href="/early-warning"
                                className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-red-400 transition-all text-center group"
                            >
                                <AlertTriangle className="size-5 mx-auto mb-1.5 text-red-600 group-hover:scale-110 transition-transform" />
                                <div className="font-bold text-xs text-slate-900 dark:text-white">Early Warning</div>
                                <div className="text-[10px] text-slate-500">12 Berisiko</div>
                            </Link>
                        )}

                        {activeRoleConfig.allowedTabs.includes('class-monitoring') && (
                            <Link
                                href="/kondisi-kelas"
                                className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all text-center group"
                            >
                                <GraduationCap className="size-5 mx-auto mb-1.5 text-blue-600 group-hover:scale-110 transition-transform" />
                                <div className="font-bold text-xs text-slate-900 dark:text-white">Kondisi Kelas</div>
                                <div className="text-[10px] text-slate-500">4 Rombel</div>
                            </Link>
                        )}

                        {activeRoleConfig.allowedTabs.includes('cases') && (
                            <Link
                                href="/manajemen-kasus"
                                className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all text-center group"
                            >
                                <ShieldAlert className="size-5 mx-auto mb-1.5 text-amber-600 group-hover:scale-110 transition-transform" />
                                <div className="font-bold text-xs text-slate-900 dark:text-white">Kasus BK</div>
                                <div className="text-[10px] text-slate-500">{stats.activeCases} Kasus</div>
                            </Link>
                        )}

                        {activeRoleConfig.allowedTabs.includes('communication') && (
                            <Link
                                href="/komunikasi-ortu"
                                className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-all text-center group"
                            >
                                <PhoneCall className="size-5 mx-auto mb-1.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                                <div className="font-bold text-xs text-slate-900 dark:text-white">Kontak Ortu</div>
                                <div className="text-[10px] text-slate-500">Pesan Resmi</div>
                            </Link>
                        )}

                        {activeRoleConfig.allowedTabs.includes('payments') && (
                            <Link
                                href="/pembayaran"
                                className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition-all text-center group"
                            >
                                <WalletCards className="size-5 mx-auto mb-1.5 text-purple-600 group-hover:scale-110 transition-transform" />
                                <div className="font-bold text-xs text-slate-900 dark:text-white">Pembayaran & SPP</div>
                                <div className="text-[10px] text-slate-500">{stats.duePayments} Tagihan</div>
                            </Link>
                        )}

                        {activeRoleConfig.allowedTabs.includes('documents') && (
                            <Link
                                href="/dokumen-guru"
                                className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-all text-center group"
                            >
                                <FileText className="size-5 mx-auto mb-1.5 text-slate-600 group-hover:scale-110 transition-transform" />
                                <div className="font-bold text-xs text-slate-900 dark:text-white">
                                    {currentRole === 'wali_kelas' ? 'Modul Ajar' : 'Dokumen Guru'}
                                </div>
                                <div className="text-[10px] text-slate-500">25 Berkas</div>
                            </Link>
                        )}

                        {activeRoleConfig.allowedTabs.includes('data-check') && (
                            <Link
                                href="/dapodik"
                                className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-orange-400 transition-all text-center group"
                            >
                                <CheckCircle2 className="size-5 mx-auto mb-1.5 text-orange-600 group-hover:scale-110 transition-transform" />
                                <div className="font-bold text-xs text-slate-900 dark:text-white">Cek Dapodik</div>
                                <div className="text-[10px] text-slate-500">7 Anomali</div>
                            </Link>
                        )}

                        {activeRoleConfig.allowedTabs.includes('ats') && (
                            <Link
                                href="/alur-ats"
                                className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition-all text-center group"
                            >
                                <HeartPulse className="size-5 mx-auto mb-1.5 text-purple-600 group-hover:scale-110 transition-transform" />
                                <div className="font-bold text-xs text-slate-900 dark:text-white">Alur Lapangan ATS</div>
                                <div className="text-[10px] text-slate-500">3 Siswa</div>
                            </Link>
                        )}

                        {activeRoleConfig.allowedTabs.includes('incidents') && (
                            <Link
                                href="/respons-insiden"
                                className="p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 hover:border-red-500 transition-all text-center group"
                            >
                                <Siren className="size-5 mx-auto mb-1.5 text-red-600 group-hover:scale-110 transition-transform" />
                                <div className="font-bold text-xs text-slate-900 dark:text-white">Tanggap Darurat</div>
                                <div className="text-[10px] text-slate-500">Status Siaga</div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

Dashboard.layout = (page: React.ReactNode) => page;
