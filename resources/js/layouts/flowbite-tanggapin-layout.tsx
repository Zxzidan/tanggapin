import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    ChevronDown,
    FileText,
    GraduationCap,
    HeartPulse,
    Home,
    Layers,
    LifeBuoy,
    LogOut,
    Menu,
    Moon,
    PhoneCall,
    Plus,
    Scale,
    Search,
    Settings,
    Shield,
    ShieldAlert,
    Siren,
    Sun,
    UserCheck,
    Users,
    WalletCards,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { ActionModalsProvider, useActionModals } from '@/components/action-modals';
import TanggapinLogo from '@/components/tanggapin-logo';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import type { RoleType } from '@/types/tanggapin';

interface FlowbiteLayoutProps {
    children: React.ReactNode;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    currentRole?: RoleType;
    onRoleChange?: (role: RoleType) => void;
    onTriggerActionModal?: (actionType: string, studentName?: string) => void;
}

export default function FlowbiteTanggapinLayout({
    children,
    activeTab,
    onTabChange,
    currentRole: controlledRole,
    onRoleChange,
    onTriggerActionModal,
}: FlowbiteLayoutProps) {
    const page = usePage<{ auth: { user: { name: string; email: string } } }>();
    const auth = page.props?.auth;
    const currentPath = page.url.split('?')[0];

    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();
    const {
        openFollowupModal,
        openParentContactModal,
        openNewCaseModal,
        openDisciplineModal,
    } = useActionModals();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const [selectedRole, setSelectedRole] = useState<RoleType>(() => {
        if (controlledRole) return controlledRole;
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tanggapin_current_role') as RoleType;
            if (saved && ['kepala_sekolah', 'wali_kelas', 'guru_bk', 'bendahara', 'operator'].includes(saved)) {
                return saved;
            }
        }
        return 'kepala_sekolah';
    });

    const activeRole = controlledRole || selectedRole;

    const handleRoleSelect = (role: RoleType) => {
        setSelectedRole(role);
        if (typeof window !== 'undefined') {
            localStorage.setItem('tanggapin_current_role', role);
        }
        setIsRoleDropdownOpen(false);
        if (onRoleChange) {
            onRoleChange(role);
        }
    };

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const quickActionRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const roleDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (quickActionRef.current && !quickActionRef.current.contains(event.target as Node)) {
                setIsQuickActionOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
                setIsRoleDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const roleLabels: Record<RoleType, { title: string; badge: string; desc: string }> = {
        kepala_sekolah: { title: 'Kepala Sekolah', badge: 'Decision Maker', desc: 'Pemantauan komprehensif sekolah' },
        wali_kelas: { title: 'Wali Kelas XI RPL 2', badge: 'Garda Depan', desc: 'Deteksi & intervensi kelas' },
        guru_bk: { title: 'Guru BK & Konseling', badge: 'Case Manager', desc: 'Penanganan kasus & pendampingan' },
        bendahara: { title: 'Bendahara Sekolah', badge: 'Keuangan', desc: 'Monitoring SPP & tagihan' },
        operator: { title: 'Operator Dapodik', badge: 'Data Verifier', desc: 'Validasi & sinkronisasi data' },
    };

    const navSections = [
        {
            section: 'UTAMA',
            items: [
                {
                    id: 'overview',
                    title: 'Ikhtisar & Tindakan',
                    icon: Home,
                    href: '/dashboard',
                    badge: null,
                    badgeColor: '',
                },
            ],
        },
        {
            section: 'SISWA',
            items: [
                {
                    id: 'early-warning',
                    title: 'Early Warning',
                    icon: AlertTriangle,
                    href: '/early-warning',
                    badge: '12',
                    badgeColor: 'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/70 border border-red-200 dark:border-red-900',
                },
                {
                    id: 'class-monitoring',
                    title: 'Kondisi Kelas',
                    icon: GraduationCap,
                    href: '/kondisi-kelas',
                    badge: null,
                    badgeColor: '',
                },
                {
                    id: 'ats',
                    title: 'Alur Lapangan ATS',
                    icon: UserCheck,
                    href: '/alur-ats',
                    badge: 'Baru',
                    badgeColor: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800',
                },
            ],
        },
        {
            section: 'PENDAMPINGAN',
            items: [
                {
                    id: 'cases',
                    title: 'Manajemen Kasus',
                    icon: ShieldAlert,
                    href: '/manajemen-kasus',
                    badge: '4',
                    badgeColor: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800',
                },
                {
                    id: 'communication',
                    title: 'Komunikasi Ortu',
                    icon: PhoneCall,
                    href: '/komunikasi-ortu',
                    badge: '2',
                    badgeColor: 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800',
                },
            ],
        },
        {
            section: 'OPERASIONAL',
            items: [
                {
                    id: 'data-check',
                    title: 'Cek Data Dapodik',
                    icon: CheckCircle2,
                    href: '/dapodik',
                    badge: '7',
                    badgeColor: 'text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-800',
                },
                {
                    id: 'payments',
                    title: 'Pembayaran & SPP',
                    icon: WalletCards,
                    href: '/pembayaran',
                    badge: '18',
                    badgeColor: 'text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800',
                },
                {
                    id: 'documents',
                    title: 'Dokumen Guru',
                    icon: FileText,
                    href: '/dokumen-guru',
                    badge: null,
                    badgeColor: '',
                },
                {
                    id: 'incidents',
                    title: 'Respons Insiden',
                    icon: Siren,
                    href: '/respons-insiden',
                    badge: 'Siaga',
                    badgeColor: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950 border border-red-300 dark:border-red-800',
                },
            ],
        },
    ];

    const isRouteActive = (item: { id: string; href: string }) => {
        if (activeTab) {
            return activeTab === item.id;
        }
        if (item.href === '/dashboard') {
            return currentPath === '/dashboard' || currentPath === '/';
        }
        return currentPath === item.href || currentPath.startsWith(item.href + '/');
    };

    const searchResults = [
        { type: 'Siswa Berisiko', title: 'Brian Aditya - XI RPL 2', desc: 'Kehadiran turun 28% dalam 14 hari', href: '/early-warning' },
        { type: 'Kasus Aktif', title: 'CS-2025-089 - Rian Pratama', desc: 'Kedisiplinan berulang - Tahap Konseling BK', href: '/manajemen-kasus' },
        { type: 'Anomali Data', title: 'SK Tugas Tambahan Drs. Subagyo', desc: 'Belum terpetakan pada semester ganjil', href: '/dapodik' },
        { type: 'Tagihan SPP', title: 'Reza Pahlevi - XI RPL 2', desc: 'Jatuh tempo 10 Sep 2025 - Rp 350.000', href: '/pembayaran' },
        { type: 'Kunjungan Lapangan', title: 'Deni Saputra - XI TKR 3', desc: 'Verifikasi tim ATS terjadwal', href: '/alur-ats' },
    ].filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-neutral-secondary-soft dark:bg-[#070b14] font-sans text-body antialiased">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 z-50 w-full bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-md border-b border-default shadow-xs transition-colors">
                <div className="px-3 py-2.5 lg:px-6">
                    <div className="flex items-center justify-between">
                        {/* Left Side: Mobile Toggle + Brand */}
                        <div className="flex items-center justify-start gap-2">
                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="sm:hidden text-heading p-2 rounded-lg hover:bg-neutral-secondary-medium transition-colors"
                                aria-label="Toggle sidebar"
                            >
                                <Menu className="size-5" />
                            </button>

                            <Link href="/dashboard" className="flex items-center me-2 md:me-8 group">
                                <TanggapinLogo size="md" showDescriptor={true} />
                            </Link>
                        </div>

                        {/* Middle: Clean Global Search Bar with Keyboard Shortcut */}
                        <div className="relative hidden md:block w-72 lg:w-96">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-fg-disabled">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                placeholder="Cari siswa, kasus, dokumen, data... (/)"
                                className="block w-full py-1.5 ps-9 pe-10 text-xs text-heading border border-default rounded-lg bg-neutral-secondary-soft/70 focus:bg-white dark:focus:bg-[#0f172a] focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all outline-none"
                            />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-2.5 pointer-events-none">
                                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-fg-disabled bg-neutral-secondary-medium border border-default-medium rounded">
                                    /
                                </kbd>
                            </div>

                            {/* Live Search Popup */}
                            {isSearchFocused && searchQuery.length > 0 && (
                                <div
                                    onMouseDown={(e) => e.preventDefault()}
                                    className="absolute left-0 right-0 mt-2 bg-neutral-primary-medium border border-default rounded-xl shadow-lg z-50 p-2 text-xs"
                                >
                                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-default text-fg-disabled text-[11px] px-1">
                                        <span>Hasil Pencarian ({searchResults.length})</span>
                                        <button
                                            type="button"
                                            onClick={() => setIsSearchFocused(false)}
                                            className="hover:text-heading"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    {searchResults.length > 0 ? (
                                        <div className="space-y-1">
                                            {searchResults.map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={item.href}
                                                    onClick={() => {
                                                        setIsSearchFocused(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="w-full text-left p-2 rounded-lg hover:bg-neutral-tertiary flex items-start gap-2.5 group transition-colors"
                                                >
                                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 border border-blue-200 dark:border-blue-900">
                                                        {item.type}
                                                    </span>
                                                    <div>
                                                        <div className="font-semibold text-heading group-hover:text-fg-brand">
                                                            {item.title}
                                                        </div>
                                                        <div className="text-[11px] text-body">
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center text-fg-disabled text-xs">
                                            Tidak ditemukan hasil untuk "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Header: Role Simulator + Quick Actions + Notifications + Appearance + User */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {/* Role Switcher Simulator */}
                            <div className="relative" ref={roleDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-heading bg-neutral-secondary-medium hover:bg-neutral-tertiary border border-default rounded-lg transition-colors"
                                    title="Ganti Tampilan Peran (Simulator Tanggapin)"
                                >
                                    <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    <span className="hidden lg:inline-block font-semibold">
                                        {roleLabels[activeRole]?.title}
                                    </span>
                                    <span className="lg:hidden font-semibold">
                                        {activeRole === 'kepala_sekolah' ? 'Kepsek' : activeRole.replace('_', ' ')}
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-fg-disabled" />
                                </button>

                                {isRoleDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111c30] border border-default rounded-xl shadow-xl z-50 p-2 text-xs animate-in fade-in zoom-in-95">
                                        <div className="px-2 py-1 text-[11px] font-bold text-fg-disabled border-b border-default mb-1">
                                            Simulasi Hak Akses Pengguna
                                        </div>
                                        {(Object.keys(roleLabels) as RoleType[]).map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => handleRoleSelect(r)}
                                                className={cn(
                                                    'w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-colors',
                                                    activeRole === r
                                                        ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold'
                                                        : 'hover:bg-neutral-tertiary text-body'
                                                )}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-heading">
                                                            {roleLabels[r].title}
                                                        </span>
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-secondary-medium text-fg-disabled border border-default">
                                                            {roleLabels[r].badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-body mt-0.5 leading-snug">
                                                        {roleLabels[r].desc}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Action Dropdown */}
                            <div className="relative" ref={quickActionRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
                                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Aksi Cepat</span>
                                    <ChevronDown className="size-3 opacity-80" />
                                </button>

                                {isQuickActionOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111c30] border border-default rounded-xl shadow-xl z-50 py-1 text-xs animate-in fade-in zoom-in-95">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                openFollowupModal();
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-neutral-tertiary flex items-center gap-2 text-heading transition-colors"
                                        >
                                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                            <span>Buat Follow-up Siswa</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                openParentContactModal();
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-neutral-tertiary flex items-center gap-2 text-heading transition-colors"
                                        >
                                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>Hubungi Orang Tua</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                openDisciplineModal();
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-neutral-tertiary flex items-center gap-2 text-heading transition-colors"
                                        >
                                            <Scale className="w-3.5 h-3.5 text-amber-600" />
                                            <span>Catat Pelanggaran / Poin</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                openNewCaseModal();
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-neutral-tertiary flex items-center gap-2 text-heading transition-colors"
                                        >
                                            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                                            <span>Eskalasi ke Kasus BK</span>
                                        </button>
                                        <Link
                                            href="/respons-insiden"
                                            onClick={() => setIsQuickActionOpen(false)}
                                            className="w-full text-left px-3 py-2 hover:bg-neutral-tertiary flex items-center gap-2 text-heading border-t border-default transition-colors text-red-600 dark:text-red-400"
                                        >
                                            <Siren className="w-3.5 h-3.5 text-red-500" />
                                            <span>Laporkan Situasi Darurat</span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Notifications Bell */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                    className="relative p-2 text-body hover:bg-neutral-secondary-medium hover:text-heading rounded-lg transition-colors"
                                    title="Notifikasi Operasional"
                                >
                                    <Bell className="w-4 h-4" />
                                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                                    </span>
                                </button>

                                {isNotificationOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111c30] border border-default rounded-xl shadow-xl z-50 p-2.5 text-xs animate-in fade-in zoom-in-95">
                                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-default font-semibold text-heading">
                                            <span>Notifikasi Operasional</span>
                                            <span className="text-[10px] font-normal text-fg-disabled">3 baru</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Link
                                                href="/early-warning"
                                                onClick={() => setIsNotificationOpen(false)}
                                                className="block p-2 rounded-lg hover:bg-neutral-secondary-soft cursor-pointer border border-transparent hover:border-default transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5 text-red-600 font-semibold text-[11px]">
                                                    <AlertTriangle className="size-3" />
                                                    <span>Early Warning: Brian Aditya (XI RPL 2)</span>
                                                </div>
                                                <p className="text-[11px] text-body mt-0.5 leading-snug">
                                                    Kehadiran turun 28% dalam 14 hari terakhir. Perlu follow-up wali kelas.
                                                </p>
                                            </Link>
                                            <Link
                                                href="/manajemen-kasus"
                                                onClick={() => setIsNotificationOpen(false)}
                                                className="block p-2 rounded-lg hover:bg-neutral-secondary-soft cursor-pointer border border-transparent hover:border-default transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-[11px]">
                                                    <ShieldAlert className="size-3" />
                                                    <span>Kasus CS-2025-089 Menunggu Verifikasi</span>
                                                </div>
                                                <p className="text-[11px] text-body mt-0.5 leading-snug">
                                                    Rian Pratama telah menyelesaikan konseling sesi 2 bersama Guru BK.
                                                </p>
                                            </Link>
                                            <Link
                                                href="/dapodik"
                                                onClick={() => setIsNotificationOpen(false)}
                                                className="block p-2 rounded-lg hover:bg-neutral-secondary-soft cursor-pointer border border-transparent hover:border-default transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-[11px]">
                                                    <CheckCircle2 className="size-3" />
                                                    <span>Cek Data Dapodik: 7 Anomali</span>
                                                </div>
                                                <p className="text-[11px] text-body mt-0.5 leading-snug">
                                                    SK penugasan guru membutuhkan perbaikan sebelum jadwal cut-off.
                                                </p>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Appearance Toggle */}
                            <button
                                type="button"
                                onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-base transition-colors border bg-neutral-secondary-soft hover:bg-neutral-secondary-medium text-heading border-default shadow-2xs"
                                title={resolvedAppearance === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <>
                                        <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <span className="hidden sm:inline">Terang</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
                                        <span className="hidden sm:inline">Gelap</span>
                                    </>
                                )}
                            </button>

                            {/* User Profile Menu */}
                            <div className="flex items-center ms-1 relative" ref={userDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-secondary-medium transition-colors"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-800 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 text-xs shadow-xs">
                                        {(auth?.user?.name || 'NS')
                                            .split(' ')
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join('')}
                                    </div>
                                    <ChevronDown className="w-3 h-3 text-fg-disabled hidden sm:block" />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="z-50 absolute right-0 top-11 bg-white dark:bg-[#111c30] border border-default rounded-xl shadow-xl w-60 py-1.5 animate-in fade-in zoom-in-95">
                                        <div className="px-4 py-2.5 border-b border-default">
                                            <p className="text-xs font-bold text-heading truncate">
                                                {auth?.user?.name || 'Neil Sims'}
                                            </p>
                                            <p className="text-[11px] text-body truncate">
                                                {auth?.user?.email || 'neil.sims@tanggapin.sch.id'}
                                            </p>
                                            <div className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                Peran: {roleLabels[activeRole]?.title}
                                            </div>
                                        </div>
                                        <ul className="p-1.5 text-xs text-body font-medium space-y-0.5">
                                            <li>
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary hover:text-heading rounded-lg transition-colors"
                                                >
                                                    <Home className="w-3.5 h-3.5 me-2 text-fg-disabled" />
                                                    Dashboard Tanggapin
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/settings/profile"
                                                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary hover:text-heading rounded-lg transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Settings className="w-3.5 h-3.5 me-2 text-fg-disabled" />
                                                    Pengaturan Profil
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/settings/security"
                                                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary hover:text-heading rounded-lg transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Shield className="w-3.5 h-3.5 me-2 text-fg-disabled" />
                                                    Keamanan Akun
                                                </Link>
                                            </li>
                                            <li className="pt-1 mt-1 border-t border-default">
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="inline-flex items-center w-full p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                                                >
                                                    <LogOut className="w-3.5 h-3.5 me-2" />
                                                    Keluar Akun
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay Backdrop */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden transition-opacity"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar with Professional Educational Grouping (PRD Section 17) */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 w-64 h-full pt-16 transition-transform sm:translate-x-0 bg-white dark:bg-[#0b1120] border-e border-default',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-3 overflow-y-auto flex flex-col justify-between">
                    <div>
                        {/* School Context Card */}
                        <div className="p-2.5 mb-3 rounded-lg bg-neutral-secondary-soft border border-default">
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                    SMK
                                </div>
                                <div className="leading-tight">
                                    <div className="font-bold text-xs text-heading">SMK Negeri 1 Harapan</div>
                                    <div className="text-[10px] text-fg-disabled">T.A. 2025/2026 • Ganjil</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        <div className="space-y-4">
                            {navSections.map((sec) => (
                                <div key={sec.section}>
                                    <div className="px-2.5 pb-1 text-[10px] font-bold text-fg-disabled uppercase tracking-wider">
                                        {sec.section}
                                    </div>
                                    <ul className="space-y-0.5">
                                        {sec.items.map((item) => {
                                            const IconComponent = item.icon;
                                            const isActive = isRouteActive(item);

                                            return (
                                                <li key={item.id}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => {
                                                            if (onTabChange) onTabChange(item.id);
                                                            setIsSidebarOpen(false);
                                                        }}
                                                        className={cn(
                                                            'w-full flex items-center px-2.5 py-1.5 text-xs rounded-lg transition-all text-left font-medium',
                                                            isActive
                                                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                                                                : 'text-body hover:bg-neutral-secondary-medium hover:text-heading'
                                                        )}
                                                    >
                                                        <IconComponent
                                                            className={cn(
                                                                'w-4 h-4 me-2.5 shrink-0 transition-colors',
                                                                isActive
                                                                    ? 'text-blue-700 dark:text-blue-400'
                                                                    : 'text-fg-disabled'
                                                            )}
                                                        />
                                                        <span className="flex-1 truncate">{item.title}</span>
                                                        {item.badge && (
                                                            <span
                                                                className={cn(
                                                                    'inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-md shrink-0',
                                                                    item.badgeColor
                                                                )}
                                                            >
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Footer Info */}
                    <div className="pt-3 border-t border-default text-[11px] text-fg-disabled mt-4">
                        <div className="flex items-center justify-between mb-1.5 px-2">
                            <span>Status Operasional</span>
                            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                                <span className="size-1.5 rounded-full bg-emerald-500 me-1.5 animate-pulse" />
                                Aktif & Sinkron
                            </span>
                        </div>
                        <div className="p-2 rounded-lg bg-neutral-secondary-soft border border-default text-[10px] text-body leading-relaxed">
                            <span className="font-semibold text-heading block">Alur Tanggapin:</span>
                            <span className="text-slate-500">Sinyal → Tinjau → Tindak → Koordinasi → Hasil</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area - Generous Breathing Spacing */}
            <main className="mt-14 min-h-[calc(100vh-3.5rem)] p-4 sm:ml-64 sm:p-8">
                {children}
            </main>
        </div>
    );
}
