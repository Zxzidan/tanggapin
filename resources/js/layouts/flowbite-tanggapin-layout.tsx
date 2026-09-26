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
    RefreshCw,
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
import { toast } from 'sonner';
import { useActionModals } from '@/components/action-modals';
import TanggapinLogo from '@/components/tanggapin-logo';
import { useAppearance } from '@/hooks/use-appearance';
import { ROLE_CONFIGS } from '@/lib/role-config';
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
    const page = usePage<{ auth?: { user?: { name?: string; email?: string; role?: RoleType } } }>();
    const currentPath = page.url.split('?')[0];
    const authUser = page.props.auth?.user;
    const authRole = authUser?.role;

    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();
    const actionModals = useActionModals();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const [localRole, setLocalRole] = useState<RoleType>(() => {
        if (controlledRole) return controlledRole;
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
        if (authRole && Object.keys(ROLE_CONFIGS).includes(authRole) && !controlledRole) {
            setLocalRole(authRole);
            if (typeof window !== 'undefined') {
                localStorage.setItem('tanggapin_current_role', authRole);
            }
        }
    }, [authRole, controlledRole]);

    const activeRole = controlledRole || localRole;
    const activeRoleConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.kepala_sekolah;

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const roleDropdownRef = useRef<HTMLDivElement>(null);
    const quickActionRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

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

    const handleRoleSelect = (r: RoleType) => {
        setLocalRole(r);
        if (typeof window !== 'undefined') {
            localStorage.setItem('tanggapin_current_role', r);
        }
        if (onRoleChange) {
            onRoleChange(r);
        }

        const targetConfig = ROLE_CONFIGS[r];
        if (targetConfig) {
            const currentTabOrRoute = activeTab || 'overview';
            if (!targetConfig.allowedTabs.includes(currentTabOrRoute)) {
                if (onTabChange) {
                    onTabChange('overview');
                } else if (currentPath !== '/dashboard') {
                    router.visit('/dashboard');
                }
            }
        }
        setIsRoleDropdownOpen(false);
        toast.info(`Beralih ke peran: ${targetConfig?.title || r}`, {
            description: targetConfig?.scopeBadge,
        });
    };

    // Navigation sections definition
    const allNavSections = [
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
            section: 'EARLY WARNING & KELAS',
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
                    badge: '4 Rombel',
                    badgeColor: 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900',
                },
            ],
        },
        {
            section: 'KONSULTASI & KASUS',
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
                {
                    id: 'ats',
                    title: 'Alur Lapangan ATS',
                    icon: HeartPulse,
                    href: '/alur-ats',
                    badge: '3',
                    badgeColor: 'text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800',
                },
            ],
        },
        {
            section: 'ADMINISTRASI & OPERASIONAL',
            items: [
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
                    title: 'Dokumen Kinerja Guru',
                    icon: FileText,
                    href: '/dokumen-guru',
                    badge: '25 Berkas',
                    badgeColor: 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
                },
                {
                    id: 'data-check',
                    title: 'Cek Data Dapodik',
                    icon: CheckCircle2,
                    href: '/dapodik',
                    badge: '7',
                    badgeColor: 'text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-800',
                },
                {
                    id: 'incidents',
                    title: 'Respons Insiden',
                    icon: Siren,
                    href: '/respons-insiden',
                    badge: 'Siaga',
                    badgeColor: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950 border border-red-300 animate-pulse',
                },
            ],
        },
    ];

    // Filter navigation sections based on active role permissions
    const visibleNavSections = allNavSections
        .map((sec) => ({
            ...sec,
            items: sec.items
                .filter((item) => activeRoleConfig.allowedTabs.includes(item.id))
                .map((item) => {
                    const override = activeRoleConfig.tabOverrides?.[item.id];
                    return {
                        ...item,
                        title: override?.title || item.title,
                        badge: override?.badge !== undefined ? override.badge : item.badge,
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
        return currentPath === item.href;
    };

    return (
        <div className="min-h-screen bg-neutral-primary-soft text-body antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 z-50 w-full bg-white dark:bg-[#0b1120] border-b border-default shadow-2xs">
                <div className="px-3 py-2.5 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between gap-2">
                        {/* Left: Mobile Toggle & Brand Logo */}
                        <div className="flex items-center justify-start shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="inline-flex items-center p-2 text-sm text-body rounded-lg sm:hidden hover:bg-neutral-secondary-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Toggle Sidebar"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <Link href="/dashboard" className="flex items-center ms-2 md:me-6">
                                <TanggapinLogo className="h-8" />
                            </Link>
                        </div>

                        {/* Center: Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-6 relative">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-fg-disabled">
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    className="bg-neutral-secondary-soft border border-default text-heading text-xs rounded-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full ps-9 p-2 placeholder:text-fg-disabled transition-all"
                                    placeholder="Cari siswa, kasus, kelas, tagihan SPP, NISN..."
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 end-0 flex items-center pe-2.5 text-fg-disabled hover:text-heading"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right: Role Switcher, Quick Actions, Appearance & User */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            {/* Role Switcher Simulator Dropdown */}
                            <div className="relative" ref={roleDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-heading bg-neutral-secondary-medium hover:bg-neutral-tertiary border border-default rounded-base transition-colors"
                                    title="Ganti Tampilan Peran"
                                >
                                    <Users className="w-3.5 h-3.5 text-fg-brand" />
                                    <span className="hidden md:inline-block font-semibold">
                                        {activeRoleConfig.title}
                                    </span>
                                    <span className="md:hidden font-semibold">
                                        {activeRoleConfig.shortTitle}
                                    </span>
                                    <span
                                        className={cn(
                                            'text-[9px] px-1 py-0.2 rounded font-semibold hidden lg:inline-block',
                                            activeRoleConfig.allowedTabs.length >= 10
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                        )}
                                    >
                                        {activeRoleConfig.scopeBadge}
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-fg-disabled" />
                                </button>

                                {isRoleDropdownOpen && (
                                    <div className="absolute right-0 mt-1.5 w-72 bg-neutral-primary-medium border border-default-medium rounded-base shadow-xl z-50 py-1.5">
                                        <div className="px-3 py-1.5 border-b border-default">
                                            <span className="text-[11px] font-bold text-fg-disabled uppercase tracking-wider block">
                                                Simulasi Peran Pengguna
                                            </span>
                                            <p className="text-[10px] text-fg-disabled leading-tight">
                                                Kepala Sekolah & Operator dapat melihat semua fitur. Peran lain menyesuaikan.
                                            </p>
                                        </div>
                                        {(Object.keys(ROLE_CONFIGS) as RoleType[]).map((r) => {
                                            const cfg = ROLE_CONFIGS[r];
                                            const isFull = cfg.allowedTabs.length >= 10;
                                            return (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => handleRoleSelect(r)}
                                                    className={cn(
                                                        'w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-neutral-tertiary transition-colors border-b border-default/50 last:border-b-0',
                                                        activeRole === r && 'bg-blue-50 dark:bg-blue-950/50 text-fg-brand font-semibold'
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-heading">{cfg.title}</span>
                                                        <span
                                                            className={cn(
                                                                'text-[9px] px-1 py-0.2 rounded font-bold uppercase tracking-wider',
                                                                isFull
                                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                                                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                            )}
                                                        >
                                                            {isFull ? 'Semua (11)' : 'Disesuaikan'}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-body line-clamp-1">{cfg.roleDesc}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Role-tailored Quick Actions Button */}
                            <div className="relative" ref={quickActionRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
                                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
                                >
                                    <Plus className="size-3.5" />
                                    <span>+ Tindakan</span>
                                    <ChevronDown className="size-3 opacity-80" />
                                </button>

                                {isQuickActionOpen && (
                                    <div className="absolute right-0 mt-1.5 w-64 bg-neutral-primary-medium border border-default-medium rounded-base shadow-xl z-50 py-1">
                                        <div className="px-3 py-1.5 border-b border-default text-[11px] font-medium text-fg-disabled">
                                            Aksi Cepat ({activeRoleConfig.shortTitle})
                                        </div>

                                        {/* Kepala Sekolah Actions */}
                                        {activeRole === 'kepala_sekolah' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTriggerActionModal) onTriggerActionModal('followup');
                                                        else actionModals.openFollowupModal();
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                                    <span>Instruksi Follow-up Siswa</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTriggerActionModal) onTriggerActionModal('parent_contact');
                                                        else actionModals.openParentContactModal();
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-green-500" />
                                                    <span>Hubungi Orang Tua Siswa</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTriggerActionModal) onTriggerActionModal('new_case');
                                                        else actionModals.openNewCaseModal();
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Daftarkan Kasus Baru</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Operator Actions */}
                                        {activeRole === 'operator' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        toast.success('Memulai sinkronisasi data Dapodik dengan Pusdatin...');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Sinkronkan Dapodik</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTabChange) onTabChange('data-check');
                                                        else router.visit('/dapodik');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                    <span>Audit Anomali Data</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Wali Kelas Actions */}
                                        {activeRole === 'wali_kelas' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTriggerActionModal) onTriggerActionModal('parent_contact');
                                                        else actionModals.openParentContactModal();
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-green-500" />
                                                    <span>Pesan ke Wali Murid XI RPL 2</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTriggerActionModal) onTriggerActionModal('followup');
                                                        else actionModals.openFollowupModal();
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <Plus className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Catat Bimbingan Wali</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTriggerActionModal) onTriggerActionModal('discipline');
                                                        else actionModals.openDisciplineModal();
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <Scale className="w-3.5 h-3.5 text-amber-500" />
                                                    <span>Input Pelanggaran Kelas</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Bendahara Actions */}
                                        {activeRole === 'bendahara' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTabChange) onTabChange('payments');
                                                        else router.visit('/pembayaran');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <WalletCards className="w-3.5 h-3.5 text-purple-500" />
                                                    <span>Verifikasi Bukti Transfer</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTriggerActionModal) onTriggerActionModal('parent_contact');
                                                        else actionModals.openParentContactModal();
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-green-500" />
                                                    <span>Kirim Pengingat SPP Santun</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Guru BK Actions */}
                                        {activeRole === 'guru_bk' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTriggerActionModal) onTriggerActionModal('new_case');
                                                        else actionModals.openNewCaseModal();
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Kasus Konseling Baru</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        if (onTriggerActionModal) onTriggerActionModal('parent_contact');
                                                        else actionModals.openParentContactModal();
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-green-500" />
                                                    <span>Panggilan Orang Tua Siswa</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle (Light / Dark) */}
                            <button
                                type="button"
                                onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                                title="Beralih Mode Gelap/Terang"
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
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-transform active:scale-95"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                                        src={activeRoleConfig.avatar}
                                        alt={activeRoleConfig.userName}
                                    />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="z-50 absolute right-0 top-11 bg-neutral-primary-medium border border-default-medium rounded-base shadow-xl w-60 transition-all">
                                        <div className="px-4 py-3 border-b border-default-medium">
                                            <p className="text-sm font-semibold text-heading truncate">
                                                {authUser?.name || activeRoleConfig.userName}
                                            </p>
                                            <p className="text-xs text-body truncate">
                                                {authUser?.email || activeRoleConfig.userEmail}
                                            </p>
                                            <span className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                {activeRoleConfig.title}
                                            </span>
                                        </div>
                                        <ul className="py-1 text-xs text-body">
                                            <li>
                                                <Link
                                                    href="/settings/profile"
                                                    className="flex items-center px-4 py-2 hover:bg-neutral-tertiary hover:text-heading"
                                                >
                                                    <Settings className="w-3.5 h-3.5 me-2" />
                                                    Pengaturan Profil
                                                </Link>
                                            </li>
                                            <li className="pt-1 mt-1 border-t border-default">
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="inline-flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
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

            {/* Sidebar Navigation */}
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
                                <div className="leading-tight flex-1 min-w-0">
                                    <div className="font-bold text-xs text-heading truncate">SMK Negeri 1 Harapan</div>
                                    <div className="text-[10px] text-fg-disabled">T.A. 2025/2026 • Ganjil</div>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-default/60 flex items-center justify-between">
                                <span className="text-[10px] text-fg-disabled">Peran Aktif:</span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    {activeRoleConfig.shortTitle} ({activeRoleConfig.scopeBadge})
                                </span>
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        <div className="space-y-4">
                            {visibleNavSections.map((sec) => (
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
                                                        onClick={(e) => {
                                                            if (onTabChange && currentPath === '/dashboard') {
                                                                e.preventDefault();
                                                                onTabChange(item.id);
                                                            }
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
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="font-semibold text-heading">{activeRoleConfig.title}</span>
                                <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold">{activeRoleConfig.scopeBadge}</span>
                            </div>
                            <p className="text-[10px] text-body leading-tight">
                                {activeRoleConfig.roleDesc}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="mt-14 min-h-[calc(100vh-3.5rem)] p-4 sm:ml-64 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
