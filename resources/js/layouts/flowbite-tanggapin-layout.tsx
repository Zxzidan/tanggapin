import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    Camera,
    Check,
    CheckCircle2,
    ChevronDown,
    FileText,
    GraduationCap,
    HeartPulse,
    Home,
    LogOut,
    Menu,
    Moon,
    PhoneCall,
    Plus,
    RefreshCw,
    Scale,
    Search,
    Settings,
    Shield,
    ShieldAlert,
    Siren,
    Sparkles,
    Sun,
    User,
    UserCheck,
    Users,
    WalletCards,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useActionModals } from '@/components/action-modals';
import TanggapinLogo from '@/components/tanggapin-logo';
import { useAppearance } from '@/hooks/use-appearance';
import {
    ROLE_CONFIGS,
    ROLE_SWITCHER_OPTIONS,
    type RoleSwitcherOption,
} from '@/lib/role-config';
import { cn } from '@/lib/utils';
import type { RoleType } from '@/types/tanggapin';

interface FlowbiteLayoutProps {
    children: React.ReactNode;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    currentRole?: RoleType;
    onRoleChange?: (role: RoleType) => void;
    onTriggerActionModal?: (
        modalType: 'followup' | 'parent_contact' | 'new_case' | 'discipline',
    ) => void;
}

export default function FlowbiteTanggapinLayout({
    children,
    activeTab,
    onTabChange,
    currentRole: controlledRole,
    onRoleChange: _onRoleChange,
    onTriggerActionModal,
}: FlowbiteLayoutProps) {
    const page = usePage<{
        auth?: { user?: { name?: string; email?: string; role?: RoleType } };
    }>();
    const currentPath = page.url.split('?')[0];
    const authUser = page.props.auth?.user;
    const authRole = authUser?.role;

    const { resolvedAppearance, updateAppearance } = useAppearance();
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const [localRole, setLocalRole] = useState<RoleType>(() => {
        if (controlledRole) return controlledRole;
        if (authRole && Object.keys(ROLE_CONFIGS).includes(authRole)) {
            return authRole;
        }
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(
                'tanggapin_current_role',
            ) as RoleType;
            if (saved && Object.keys(ROLE_CONFIGS).includes(saved)) {
                return saved;
            }
        }
        return 'kepala_sekolah';
    });

    useEffect(() => {
        if (
            authRole &&
            Object.keys(ROLE_CONFIGS).includes(authRole) &&
            !controlledRole
        ) {
            setLocalRole(authRole);
            if (typeof window !== 'undefined') {
                localStorage.setItem('tanggapin_current_role', authRole);
            }
        }
    }, [authRole, controlledRole]);

    const activeRole = controlledRole || localRole;
    const activeRoleConfig =
        ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.kepala_sekolah;

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const quickActionRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(target)
            ) {
                setIsUserMenuOpen(false);
            }
            if (
                quickActionRef.current &&
                !quickActionRef.current.contains(target)
            ) {
                setIsQuickActionOpen(false);
            }
            if (
                notificationRef.current &&
                !notificationRef.current.contains(target)
            ) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Navigation sections definition
    const allNavSections = [
        {
            section: 'UTAMA',
            items: [
                {
                    id: 'overview',
                    title: 'Ikhtisar',
                    icon: Home,
                    href: '/dashboard',
                },
            ],
        },
        {
            section: 'EARLY WARNING & KELAS',
            items: [
                {
                    id: 'early-warning',
                    title: 'Early Warning',
                    icon: AlertTriangle,
                    href: '/early-warning',
                },
                {
                    id: 'class-monitoring',
                    title: 'Kondisi Kelas',
                    icon: GraduationCap,
                    href: '/kondisi-kelas',
                },
                {
                    id: 'attribute-scanner',
                    title: 'Kamera Atribut',
                    icon: Camera,
                    href: '/pemantau-atribut',
                },
                {
                    id: 'discipline',
                    title: 'Disiplin Siswa',
                    icon: Scale,
                    href: '/early-warning',
                },
            ],
        },
        {
            section: 'KONSULTASI & KASUS',
            items: [
                {
                    id: 'cases',
                    title: 'Kasus BK',
                    icon: ShieldAlert,
                    href: '/manajemen-kasus',
                },
                {
                    id: 'reports',
                    title: 'Rapor Siswa (AI)',
                    icon: Sparkles,
                    href: '/rapor-siswa',
                },
                {
                    id: 'communication',
                    title: 'Kontak Ortu',
                    icon: PhoneCall,
                    href: '/komunikasi-ortu',
                },
                {
                    id: 'ats',
                    title: 'Mitigasi ATS',
                    icon: HeartPulse,
                    href: '/alur-ats',
                },
            ],
        },
        {
            section: 'ADMINISTRASI & OPERASIONAL',
            items: [
                {
                    id: 'manage-users',
                    title: 'Kelola Akun Guru & Staf',
                    icon: Users,
                    href: '/kelola-pengguna',
                },
                {
                    id: 'data-check',
                    title: 'Data Dapodik',
                    icon: CheckCircle2,
                    href: '/dapodik',
                },
                {
                    id: 'payments',
                    title: 'Keuangan SPP',
                    icon: WalletCards,
                    href: '/pembayaran',
                },
                {
                    id: 'documents',
                    title: 'Dokumen Guru',
                    icon: FileText,
                    href: '/dokumen-guru',
                },
                {
                    id: 'incidents',
                    title: 'Tanggap Darurat',
                    icon: Siren,
                    href: '/respons-insiden',
                },
            ],
        },
    ];

    // Filter navigation sections based on active role permissions
    const visibleNavSections = allNavSections
        .map((sec) => ({
            ...sec,
            items: sec.items
                .filter((item) =>
                    activeRoleConfig.allowedTabs.includes(item.id),
                )
                .map((item) => {
                    const override = activeRoleConfig.tabOverrides?.[item.id];
                    return {
                        ...item,
                        title: override?.title || item.title,
                    };
                }),
        }))
        .filter((sec) => sec.items.length > 0);

    const isRouteActive = (item: { id: string; href: string }) => {
        if (activeTab) {
            return activeTab === item.id;
        }
        if (currentPath === '/dashboard' && item.href === '/dashboard') {
            return true;
        }
        return (
            currentPath === item.href || currentPath.startsWith(item.href + '/')
        );
    };

    const searchResults = [
        {
            type: 'Siswa Berisiko',
            name: 'Brian Aditya — XI RPL 2',
            desc: 'Kehadiran turun 28% dalam 14 hari',
            href: '/early-warning',
        },
        {
            type: 'Kasus Aktif',
            name: 'KS-2025-001 — Ahmad Fauzi',
            desc: 'Kedisiplinan berulang • Tahap Konseling BK',
            href: '/manajemen-kasus',
        },
        {
            type: 'Anomali Data',
            name: 'NISN Ganda • Citra Lestari',
            desc: 'Belum terpetakan pada semester ganjil',
            href: '/dapodik',
        },
        {
            type: 'Tagihan SPP',
            name: 'Doni Pratama — X TKJ 1',
            desc: 'Jatuh tempo 10 Sep 2025 • Rp 350.000',
            href: '/pembayaran',
        },
        {
            type: 'Kunjungan Lapangan',
            name: 'Eko Wahyudi — Home Visit ATS',
            desc: 'Verifikasi tim ATS terjadwal',
            href: '/alur-ats',
        },
        {
            type: 'Rapor AI Siswa',
            name: 'Rapor Perkembangan Otomatis',
            desc: 'Generate evaluasi naratif AI & kirim WhatsApp orang tua',
            href: '/rapor-siswa',
        },
    ].filter(
        (item) =>
            searchQuery.trim() !== '' &&
            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.type.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    // Listen to global toggle-tanggapin-sidebar event for mobile triggers from dashboard or subpages
    useEffect(() => {
        const handleToggle = () => setIsSidebarOpen((prev) => !prev);
        window.addEventListener('toggle-tanggapin-sidebar', handleToggle);
        return () =>
            window.removeEventListener(
                'toggle-tanggapin-sidebar',
                handleToggle,
            );
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 transition-colors duration-200 dark:bg-[#070b14] dark:text-slate-100">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-2xs backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0f172a]/95">
                <div className="px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Mobile Toggle & Brand Logo */}
                        <div className="flex items-center justify-start gap-2">
                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/90 text-slate-700 shadow-2xs transition-all hover:bg-slate-100 active:scale-95 sm:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                aria-label="Toggle sidebar menu"
                            >
                                {isSidebarOpen ? (
                                    <X className="size-5" />
                                ) : (
                                    <Menu className="size-5" />
                                )}
                            </button>

                            <Link
                                href="/dashboard"
                                className="ms-1 flex items-center md:me-12"
                            >
                                <TanggapinLogo />
                            </Link>
                        </div>

                        {/* Middle: Universal Search Bar */}
                        <div className="relative mx-4 hidden max-w-md flex-1 md:block">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400">
                                    <Search className="size-4" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() =>
                                        setTimeout(
                                            () => setIsSearchFocused(false),
                                            200,
                                        )
                                    }
                                    className="block w-full rounded-xl border border-slate-200 bg-slate-100/70 p-2 ps-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    placeholder="Cari siswa, kasus, kelas, tagihan SPP, NISN..."
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 end-0 flex items-center pe-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Search Results Dropdown */}
                            {isSearchFocused && searchQuery && (
                                <div className="absolute top-full left-0 z-50 mt-1.5 w-full animate-in rounded-xl border border-slate-200 bg-white p-2 shadow-xl zoom-in-95 fade-in dark:border-slate-700 dark:bg-[#111c30]">
                                    <div className="mb-1 border-b border-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-400 dark:border-slate-800">
                                        Hasil Pencarian Cepat
                                    </div>
                                    {searchResults.length > 0 ? (
                                        <div className="space-y-1">
                                            {searchResults.map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={item.href}
                                                    onClick={() => {
                                                        setIsSearchFocused(
                                                            false,
                                                        );
                                                        setSearchQuery('');
                                                    }}
                                                    className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                                >
                                                    <span className="mt-0.5 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                        {item.type}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                                            {item.name}
                                                        </div>
                                                        <div className="truncate text-[11px] text-slate-500">
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 text-center text-xs text-slate-500">
                                            Tidak ada data cocok dengan "
                                            {searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right: Quick Actions, Appearance & User Profile */}
                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            {/* Role-tailored Quick Actions Button */}
                            <div className="relative" ref={quickActionRef}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsQuickActionOpen(!isQuickActionOpen)
                                    }
                                    className="hidden items-center gap-2 rounded-xl bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-blue-800 active:scale-95 sm:inline-flex"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tindakan</span>
                                    <ChevronDown className="size-3 opacity-80" />
                                </button>

                                {isQuickActionOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-56 animate-in rounded-xl border border-slate-200 bg-white py-1 text-xs shadow-xl zoom-in-95 fade-in dark:border-slate-700 dark:bg-[#111c30]">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                if (onTriggerActionModal) {
                                                    onTriggerActionModal(
                                                        'followup',
                                                    );
                                                } else {
                                                    openFollowupModal();
                                                }
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            <UserCheck className="size-3.5 text-blue-700 dark:text-blue-400" />
                                            <span>Buat Follow-up Siswa</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                if (onTriggerActionModal) {
                                                    onTriggerActionModal(
                                                        'parent_contact',
                                                    );
                                                } else {
                                                    openParentContactModal();
                                                }
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            <PhoneCall className="size-3.5 text-slate-500" />
                                            <span>Hubungi Orang Tua</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                if (onTriggerActionModal) {
                                                    onTriggerActionModal(
                                                        'discipline',
                                                    );
                                                } else {
                                                    openDisciplineModal();
                                                }
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            <Scale className="size-3.5 text-slate-500" />
                                            <span>
                                                Catat Pelanggaran & Poin
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                if (onTriggerActionModal) {
                                                    onTriggerActionModal(
                                                        'new_case',
                                                    );
                                                } else {
                                                    openNewCaseModal();
                                                }
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            <ShieldAlert className="size-3.5 text-blue-700 dark:text-blue-400" />
                                            <span>Eskalasi ke Kasus BK</span>
                                        </button>
                                        <Link
                                            href="/respons-insiden"
                                            onClick={() =>
                                                setIsQuickActionOpen(false)
                                            }
                                            className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            <Siren className="size-3.5 text-blue-700 dark:text-blue-400" />
                                            <span>
                                                Laporkan Situasi Darurat
                                            </span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Notifications Dropdown */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsNotificationOpen(
                                            !isNotificationOpen,
                                        )
                                    }
                                    className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                    aria-label="Pemberitahuan"
                                >
                                    <Bell className="size-4" />
                                    <span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-blue-700 ring-2 ring-white dark:bg-blue-400 dark:ring-slate-900" />
                                </button>

                                {isNotificationOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-80 animate-in rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-xl zoom-in-95 fade-in dark:border-slate-700 dark:bg-[#111c30]">
                                        <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                Pemberitahuan Sistem
                                            </span>
                                            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                3 Baru
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Link
                                                href="/early-warning"
                                                onClick={() =>
                                                    setIsNotificationOpen(false)
                                                }
                                                className="block cursor-pointer rounded-lg border border-transparent p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                            >
                                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-900 dark:text-white">
                                                    <AlertTriangle className="size-3 text-blue-700 dark:text-blue-400" />
                                                    <span>
                                                        Sinyal Absensi Kritis
                                                    </span>
                                                    <span className="ms-auto text-[10px] text-slate-400">
                                                        10m lalu
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                                                    Siswa tidak hadir 4 hari
                                                    terakhir. Perlu follow-up
                                                    wali kelas.
                                                </p>
                                            </Link>
                                            <Link
                                                href="/manajemen-kasus"
                                                onClick={() =>
                                                    setIsNotificationOpen(false)
                                                }
                                                className="block cursor-pointer rounded-lg border border-transparent p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                            >
                                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-900 dark:text-white">
                                                    <ShieldAlert className="size-3 text-blue-700 dark:text-blue-400" />
                                                    <span>Kasus Selesai</span>
                                                    <span className="ms-auto text-[10px] text-slate-400">
                                                        1j lalu
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                                                    Kasus KS-2025-003 telah
                                                    menyelesaikan konseling sesi
                                                    2 bersama Guru BK.
                                                </p>
                                            </Link>
                                            <Link
                                                href="/dapodik"
                                                onClick={() =>
                                                    setIsNotificationOpen(false)
                                                }
                                                className="block cursor-pointer rounded-lg border border-transparent p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                            >
                                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-900 dark:text-white">
                                                    <CheckCircle2 className="size-3 text-blue-700 dark:text-blue-400" />
                                                    <span>Residu Dapodik</span>
                                                    <span className="ms-auto text-[10px] text-slate-400">
                                                        3j lalu
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                                                    7 anomali data siswa
                                                    membutuhkan perbaikan
                                                    sebelum jadwal cut-off.
                                                </p>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dark/Light Mode Toggle */}
                            <button
                                type="button"
                                onClick={() =>
                                    updateAppearance(
                                        resolvedAppearance === 'dark'
                                            ? 'light'
                                            : 'dark',
                                    )
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                aria-label="Ganti Tema Tampilan"
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <Sun className="size-4 text-slate-300" />
                                ) : (
                                    <Moon className="size-4 text-slate-600" />
                                )}
                            </button>

                            {/* User Profile Menu */}
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsUserMenuOpen(!isUserMenuOpen)
                                    }
                                    className="flex items-center gap-2 rounded-full ring-2 ring-slate-200 transition-all hover:ring-blue-600 dark:ring-slate-700"
                                    aria-label="Menu Pengguna"
                                >
                                    <img
                                        className="size-7.5 rounded-full object-cover"
                                        src={activeRoleConfig.avatar}
                                        alt={activeRoleConfig.userName}
                                    />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-60 animate-in rounded-xl border border-slate-200 bg-white py-1.5 text-xs shadow-xl zoom-in-95 fade-in dark:border-slate-800 dark:bg-[#111c30]">
                                        <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                {authUser?.name ||
                                                    activeRoleConfig.userName}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">
                                                {authUser?.email ||
                                                    activeRoleConfig.userEmail}
                                            </p>
                                            <div className="mt-1.5 inline-block rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                Peran: {activeRoleConfig.title}
                                            </div>
                                        </div>


                                        <ul className="space-y-0.5 p-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                                            <li>
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                    className="inline-flex w-full items-center rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                                >
                                                    <Home className="me-2 size-3.5 text-slate-400" />
                                                    <span>Dashboard Utama</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/settings/profile"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                    className="inline-flex w-full items-center rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                                >
                                                    <User className="me-2 size-3.5 text-slate-400" />
                                                    <span>Profil Akun</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/settings/appearance"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                    className="inline-flex w-full items-center rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                                >
                                                    <Settings className="me-2 size-3.5 text-slate-400" />
                                                    <span>
                                                        Pengaturan Tampilan
                                                    </span>
                                                </Link>
                                            </li>
                                            <li className="border-t border-slate-100 pt-1 dark:border-slate-800">
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="inline-flex w-full items-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                                >
                                                    <LogOut className="me-2 size-3.5 text-slate-400" />
                                                    <span>Keluar Sistem</span>
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

            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs sm:hidden"
                />
            )}

            {/* Sidebar Navigation */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 h-full w-64 border-e border-slate-200 bg-white pt-16 transition-transform sm:translate-x-0 dark:border-slate-800 dark:bg-[#0b1120]',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
                aria-label="Sidemenu"
            >
                <div className="flex h-full flex-col justify-between overflow-y-auto px-3 py-4">
                    <div className="space-y-4">
                        {/* Mobile Header Bar inside Drawer */}
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 sm:hidden dark:border-slate-800">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Menu Navigasi
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                aria-label="Tutup menu sidebar"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* School Identity Card */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-[#111c30]">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-xs font-bold text-white shadow-2xs">
                                    SMK
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                        SMK Negeri 1 Harapan
                                    </div>
                                    <div className="truncate text-[10px] text-slate-500">
                                        T.A. 2025/2026 • Ganjil
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-800">
                                <span className="text-[10px] text-slate-500">
                                    Peran:
                                </span>
                                <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                    {activeRoleConfig.title}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        <ul className="space-y-4 font-medium">
                            {visibleNavSections.map((sec) => (
                                <div key={sec.section}>
                                    <div className="px-2.5 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        {sec.section}
                                    </div>
                                    <div className="space-y-0.5">
                                        {sec.items.map((item) => {
                                            const IconComponent = item.icon;
                                            const isActive =
                                                isRouteActive(item);

                                            return (
                                                <li key={item.id}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => {
                                                            if (onTabChange)
                                                                onTabChange(
                                                                    item.id,
                                                                );
                                                            setIsSidebarOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className={cn(
                                                            'flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-all',
                                                            isActive
                                                                ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                                                        )}
                                                    >
                                                        <IconComponent
                                                            className={cn(
                                                                'size-4 shrink-0 transition-colors',
                                                                isActive
                                                                    ? 'text-white'
                                                                    : 'text-slate-500 dark:text-slate-400',
                                                            )}
                                                        />
                                                        <span className="ms-2.5 flex-1 font-medium whitespace-nowrap">
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </div>

                    {/* Sidebar Footer Support Card */}
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-[#111c30]">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                            <Shield className="size-3.5 text-blue-700 dark:text-blue-400" />
                            <span>TANGGAPIN Core</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">
                            Sistem Informasi Terpadu Respons Cepat & Bimbingan
                            Sekolah.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="mt-16 min-h-[calc(100vh-4rem)] p-5 sm:ml-64 sm:p-8 lg:p-10">
                {children}
            </main>
        </div>
    );
}
