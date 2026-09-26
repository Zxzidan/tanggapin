import { Link, usePage } from '@inertiajs/react';
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
    Moon,
    PhoneCall,
    Plus,
    RefreshCw,
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
    activeTab = 'overview',
    onTabChange,
    currentRole = 'kepala_sekolah',
    onRoleChange,
    onTriggerActionModal,
}: FlowbiteLayoutProps) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;
    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

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

    const activeRoleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.kepala_sekolah;

    const handleRoleSelect = (r: RoleType) => {
        if (onRoleChange) {
            onRoleChange(r);
        }
        const targetConfig = ROLE_CONFIGS[r];
        if (targetConfig && !targetConfig.allowedTabs.includes(activeTab)) {
            if (onTabChange) {
                onTabChange('overview');
            }
        }
        setIsRoleDropdownOpen(false);
    };

    const handleNavClick = (tab: string) => {
        if (onTabChange) {
            onTabChange(tab);
        }
        setIsSidebarOpen(false);
    };

    const allNavItems = [
        {
            id: 'overview',
            title: 'Ikhtisar & Tindakan',
            icon: Home,
            badge: null,
            badgeColor: '',
        },
        {
            id: 'data-check',
            title: 'Cek Data Dapodik',
            icon: CheckCircle2,
            badge: '7',
            badgeColor: 'text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-800',
        },
        {
            id: 'early-warning',
            title: 'Early Warning',
            icon: AlertTriangle,
            badge: '12',
            badgeColor: 'text-fg-danger-strong bg-danger-soft border border-danger-subtle',
        },
        {
            id: 'class-monitoring',
            title: 'Kondisi Kelas',
            icon: GraduationCap,
            badge: null,
            badgeColor: '',
        },
        {
            id: 'cases',
            title: 'Manajemen Kasus',
            icon: ShieldAlert,
            badge: '4',
            badgeColor: 'text-amber-800 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800',
        },
        {
            id: 'discipline',
            title: 'Kedisiplinan & Poin',
            icon: Shield,
            badge: null,
            badgeColor: '',
        },
        {
            id: 'communication',
            title: 'Komunikasi Orang Tua',
            icon: PhoneCall,
            badge: '2',
            badgeColor: 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950 border border-blue-200 dark:border-blue-800',
        },
        {
            id: 'ats',
            title: 'Alur Lapangan ATS',
            icon: UserCheck,
            badge: 'Baru',
            badgeColor: 'bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm',
        },
        {
            id: 'payments',
            title: 'Pembayaran & SPP',
            icon: WalletCards,
            badge: '18',
            badgeColor: 'text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800',
        },
        {
            id: 'documents',
            title: 'Dokumen Kinerja Guru',
            icon: FileText,
            badge: null,
            badgeColor: '',
        },
        {
            id: 'incidents',
            title: 'Respons Insiden',
            icon: Siren,
            badge: 'Siaga',
            badgeColor: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950 border border-red-300 dark:border-red-800 animate-pulse',
        },
    ];

    // Filter strictly by allowedTabs for the currentRole, applying title and badge overrides
    const navItems = allNavItems
        .filter((item) => activeRoleConfig.allowedTabs.includes(item.id))
        .map((item) => {
            const override = activeRoleConfig.tabOverrides?.[item.id];
            return {
                ...item,
                title: override?.title || item.title,
                badge: override?.badge !== undefined ? override.badge : item.badge,
            };
        });

    const searchResults = [
        { type: 'Siswa Berisiko', title: 'Brian Aditya (XI RPL 2)', desc: 'Kehadiran turun 28% dalam 14 hari', tab: 'early-warning' },
        { type: 'Kasus Aktif', title: 'CS-2025-089 - Rian Pratama', desc: 'Kedisiplinan berulang (Tahap Konseling BK)', tab: 'cases' },
        { type: 'Anomali Data', title: 'SK Tugas Tambahan Drs. Subagyo', desc: 'Belum terpetakan pada semester ganjil', tab: 'data-check' },
        { type: 'Tagihan SPP', title: 'Reza Pahlevi (XI RPL 2)', desc: 'Jatuh tempo 10 Sep 2025 (Rp350.000)', tab: 'payments' },
        { type: 'Kunjungan Lapangan', title: 'Deni Saputra (XI TKR 3)', desc: 'Verifikasi tim ATS terjadwal', tab: 'ats' },
    ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-neutral-secondary-soft dark:bg-neutral-950 font-sans text-body">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-default shadow-xs">
                <div className="px-3 py-2.5 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        {/* Left Side: Drawer Toggle + Brand */}
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                data-drawer-target="top-bar-sidebar"
                                data-drawer-toggle="top-bar-sidebar"
                                aria-controls="top-bar-sidebar"
                                type="button"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeWidth="2"
                                        d="M5 7h14M5 12h14M5 17h10"
                                    />
                                </svg>
                            </button>
                            <Link href="/dashboard" className="flex items-center ms-2 md:me-8">
                                <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm me-2.5">
                                    <HeartPulse className="size-5" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="self-center text-lg font-bold whitespace-nowrap text-heading tracking-tight">
                                            Tanggapin
                                        </span>
                                        <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 hidden md:inline-block">
                                            Operasional
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-fg-disabled leading-none hidden lg:inline-block">
                                        Deteksi lebih cepat. Tindak lebih tepat.
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Middle: Global Search (PRD Section 16) */}
                        <div className="relative hidden md:block w-72 lg:w-96">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-fg-disabled">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                placeholder="Cari siswa, kasus, dokumen, data... (Ctrl+K)"
                                className="block w-full p-2 ps-9 pe-12 text-xs text-heading border border-default rounded-base bg-neutral-secondary-soft focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                    className="absolute left-0 right-0 mt-1.5 bg-neutral-primary-medium border border-default-medium rounded-base shadow-xl z-50 p-2 text-xs"
                                >
                                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-default text-fg-disabled">
                                        <span>Hasil Pencarian Global ({searchResults.length})</span>
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
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        handleNavClick(item.tab);
                                                        setIsSearchFocused(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="w-full text-left p-2 rounded hover:bg-neutral-tertiary flex items-start gap-2 group transition-colors"
                                                >
                                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mt-0.5">
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
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-3 text-center text-fg-disabled">
                                            Tidak ditemukan hasil untuk "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Header: Role Switcher + Actions + Profile Menu */}
                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                            {/* Role Switcher Simulator (PRD Section 5 & 14) */}
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
                                    <span className={cn(
                                        'text-[9px] px-1 py-0.2 rounded font-semibold hidden lg:inline-block',
                                        activeRoleConfig.allowedTabs.length >= 10
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                    )}>
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
                                                        currentRole === r && 'bg-blue-50 dark:bg-blue-950/50 text-fg-brand font-semibold'
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold">{cfg.title}</span>
                                                        <span className={cn(
                                                            'text-[10px] px-1.5 py-0.2 rounded font-medium border',
                                                            isFull
                                                                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                                : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                                        )}>
                                                            {cfg.scopeBadge}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-fg-disabled truncate">
                                                        {cfg.userName} • {cfg.roleDesc}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Quick Action Button "+ Tindakan Cepat" (PRD Section 9, 24) */}
                            <div className="relative" ref={quickActionRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-base shadow-xs transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Tindakan</span>
                                </button>

                                {isQuickActionOpen && (
                                    <div className="absolute right-0 mt-1.5 w-60 bg-neutral-primary-medium border border-default-medium rounded-base shadow-xl z-50 py-1">
                                        <div className="px-3 py-1.5 border-b border-default text-[11px] font-medium text-fg-disabled">
                                            Aksi Cepat ({activeRoleConfig.shortTitle})
                                        </div>

                                        {/* Kepala Sekolah Actions */}
                                        {currentRole === 'kepala_sekolah' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('followup');
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
                                                        onTriggerActionModal?.('parent_contact');
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
                                                        onTriggerActionModal?.('new_case');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Eskalasi Kasus ke BK</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        handleNavClick('incidents');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading border-t border-default"
                                                >
                                                    <Siren className="w-3.5 h-3.5 text-red-500" />
                                                    <span>Deklarasikan Kedaruratan</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Operator Actions */}
                                        {currentRole === 'operator' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        handleNavClick('data-check');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                                                    <span>Audit Validasi Dapodik</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        handleNavClick('documents');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Verifikasi SK & Berkas Guru</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('parent_contact');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-green-500" />
                                                    <span>Reminder Residu NIK ke Ortu</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        handleNavClick('class-monitoring');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading border-t border-default"
                                                >
                                                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                                                    <span>Petakan Pengampu Rombel</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Wali Kelas Actions */}
                                        {currentRole === 'wali_kelas' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('discipline');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                                                    <span>Catat Pelanggaran Kelas</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('parent_contact');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-green-500" />
                                                    <span>Hubungi Wali Murid (WA)</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('followup');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                                    <span>Buat Follow-up Siswa</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('new_case');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading border-t border-default"
                                                >
                                                    <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Rujuk Kasus Siswa ke BK</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Bendahara Actions */}
                                        {currentRole === 'bendahara' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        handleNavClick('payments');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <WalletCards className="w-3.5 h-3.5 text-purple-500" />
                                                    <span>Catat Pembayaran Masuk</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        handleNavClick('payments');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                    <span>Verifikasi Bukti Transfer</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('parent_contact');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Kirim Pengingat Tagihan (WA)</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        handleNavClick('payments');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading border-t border-default"
                                                >
                                                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span>Unduh Rekap Kas Masuk</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Guru BK Actions */}
                                        {currentRole === 'guru_bk' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('new_case');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Buat Kasus Konseling Baru</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('parent_contact');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5 text-green-500" />
                                                    <span>Panggil Orang Tua ke BK</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        onTriggerActionModal?.('discipline');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading"
                                                >
                                                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                                                    <span>Catat Pembinaan Karakter</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsQuickActionOpen(false);
                                                        handleNavClick('ats');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-tertiary flex items-center gap-2 text-heading border-t border-default"
                                                >
                                                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                                                    <span>Jadwalkan Kunjungan ATS</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Notification Bell (PRD Section 15: Notifikasi sedikit tapi penting) */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                    className="relative p-2 text-body hover:bg-neutral-secondary-medium hover:text-heading rounded-base transition-colors"
                                    title="Notifikasi Operasional"
                                >
                                    <Bell className="w-4 h-4" />
                                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                                    </span>
                                </button>

                                {isNotificationOpen && (
                                    <div className="absolute right-0 mt-1.5 w-80 bg-neutral-primary-medium border border-default-medium rounded-base shadow-xl z-50 p-2 text-xs">
                                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-default font-semibold text-heading">
                                            <span>Perhatian Hari Ini (Action Required)</span>
                                            <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded">
                                                3 Kritis
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 max-h-72 overflow-y-auto">
                                            <div
                                                onClick={() => {
                                                    handleNavClick('early-warning');
                                                    setIsNotificationOpen(false);
                                                }}
                                                className="p-2 rounded bg-neutral-secondary-soft hover:bg-neutral-tertiary cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center justify-between font-medium text-heading">
                                                    <span className="text-red-600 font-semibold">● Early Warning</span>
                                                    <span className="text-[10px] text-fg-disabled">10 mnt lalu</span>
                                                </div>
                                                <p className="text-[11px] text-body mt-0.5">
                                                    Brian Aditya (XI RPL 2) kehadiran turun 28% dalam 14 hari.
                                                </p>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    handleNavClick('cases');
                                                    setIsNotificationOpen(false);
                                                }}
                                                className="p-2 rounded bg-neutral-secondary-soft hover:bg-neutral-tertiary cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center justify-between font-medium text-heading">
                                                    <span className="text-amber-600 font-semibold">● Case Overdue</span>
                                                    <span className="text-[10px] text-fg-disabled">2 jam lalu</span>
                                                </div>
                                                <p className="text-[11px] text-body mt-0.5">
                                                    Kasus CS-2025-091 belum ada tindak lanjut selama &gt;48 jam.
                                                </p>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    handleNavClick('data-check');
                                                    setIsNotificationOpen(false);
                                                }}
                                                className="p-2 rounded bg-neutral-secondary-soft hover:bg-neutral-tertiary cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center justify-between font-medium text-heading">
                                                    <span className="text-blue-600 font-semibold">● Validasi Dapodik</span>
                                                    <span className="text-[10px] text-fg-disabled">Hari ini</span>
                                                </div>
                                                <p className="text-[11px] text-body mt-0.5">
                                                    7 data SK penugasan guru membutuhkan perbaikan sebelum cut-off.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle Button */}
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

                            {/* User Menu Dropdown (Matches Flowbite Template Snippet) */}
                            <div className="flex items-center ms-1 relative" ref={userDropdownRef}>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-transform active:scale-95"
                                        aria-expanded={isUserMenuOpen}
                                        data-dropdown-toggle="dropdown-user"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                                            src={activeRoleConfig.avatar}
                                            alt={activeRoleConfig.userName}
                                        />
                                    </button>
                                </div>
                                <div
                                    className={cn(
                                        'z-50 absolute right-0 top-11 bg-neutral-primary-medium border border-default-medium rounded-base shadow-xl w-60 transition-all',
                                        isUserMenuOpen ? 'block' : 'hidden'
                                    )}
                                    id="dropdown-user"
                                >
                                    <div className="px-4 py-3 border-b border-default-medium" role="none">
                                        <p className="text-sm font-semibold text-heading truncate" role="none">
                                            {activeRoleConfig.userName}
                                        </p>
                                        <p className="text-xs text-body truncate" role="none">
                                            {activeRoleConfig.userEmail}
                                        </p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                {activeRoleConfig.title}
                                            </span>
                                            <span className="text-[10px] text-fg-disabled">
                                                {activeRoleConfig.scopeBadge}
                                            </span>
                                        </div>
                                    </div>
                                    <ul className="p-2 text-sm text-body font-medium space-y-0.5" role="none">
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleNavClick('overview');
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded text-xs transition-colors"
                                                role="menuitem"
                                            >
                                                <Home className="w-3.5 h-3.5 me-2 text-fg-disabled" />
                                                Dashboard Operasional
                                            </button>
                                        </li>
                                        <li>
                                            <Link
                                                href="/settings/profile"
                                                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded text-xs transition-colors"
                                                role="menuitem"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Settings className="w-3.5 h-3.5 me-2 text-fg-disabled" />
                                                Pengaturan Profil
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/settings/security"
                                                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded text-xs transition-colors"
                                                role="menuitem"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Shield className="w-3.5 h-3.5 me-2 text-fg-disabled" />
                                                Keamanan & Akun
                                            </Link>
                                        </li>
                                        <li>
                                            <a
                                                href="https://github.com/Zxzidan/tanggapin"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded text-xs transition-colors"
                                                role="menuitem"
                                            >
                                                <LifeBuoy className="w-3.5 h-3.5 me-2 text-fg-disabled" />
                                                Bantuan & Panduan PRD
                                            </a>
                                        </li>
                                        <li className="pt-1 mt-1 border-t border-default">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="inline-flex items-center w-full p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded text-xs transition-colors"
                                                role="menuitem"
                                            >
                                                <LogOut className="w-3.5 h-3.5 me-2" />
                                                Sign out (Keluar)
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay Backdrop */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/50 sm:hidden transition-opacity"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar (Matches Flowbite Template Snippet) */}
            <aside
                id="top-bar-sidebar"
                className={cn(
                    'fixed top-0 left-0 z-40 w-64 h-full pt-14 transition-transform sm:translate-x-0',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default flex flex-col justify-between">
                    <div>
                        {/* School Info Context */}
                        <div className="ps-2.5 pb-3 mb-3 border-b border-default">
                            <div className="flex items-center gap-2">
                                <div className="size-7 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    SMK
                                </div>
                                <div className="leading-tight flex-1 min-w-0">
                                    <div className="font-semibold text-xs text-heading truncate">SMK Negeri 1 Harapan</div>
                                    <div className="text-[10px] text-fg-disabled">T.A. 2025/2026 • Ganjil</div>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-default/60 flex items-center justify-between">
                                <span className="text-[10px] text-fg-disabled">Ruang Akses:</span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    {activeRoleConfig.shortTitle} ({activeRoleConfig.scopeBadge})
                                </span>
                            </div>
                        </div>

                        {/* Navigation Menu Items with Flowbite Styling */}
                        <ul className="space-y-1 font-medium">
                            {navItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = activeTab === item.id;

                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleNavClick(item.id)}
                                            className={cn(
                                                'w-full flex items-center px-2.5 py-2 text-xs rounded-base transition-all text-left border',
                                                isActive
                                                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold shadow-2xs'
                                                    : 'border-transparent text-body hover:bg-neutral-secondary-medium hover:text-heading'
                                            )}
                                        >
                                            <IconComponent
                                                className={cn(
                                                    'w-4 h-4 transition duration-75 shrink-0',
                                                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-fg-disabled'
                                                )}
                                            />
                                            <span className="ms-2.5 flex-1 whitespace-nowrap">{item.title}</span>
                                            {item.badge && (
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full',
                                                        item.badgeColor
                                                    )}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Sidebar Footer Info */}
                    <div className="pt-4 border-t border-default text-[11px] text-fg-disabled">
                        <div className="flex items-center justify-between mb-1.5 px-2">
                            <span>Status Operasional</span>
                            <span className="inline-flex items-center text-green-600 dark:text-green-400 font-medium text-[10px]">
                                <span className="size-1.5 rounded-full bg-green-500 me-1 animate-pulse" />
                                Sinkron
                            </span>
                        </div>
                        <div className="p-2.5 rounded-base bg-neutral-secondary-soft border border-default text-[11px] leading-relaxed">
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

            {/* Main Content Area (Matches Flowbite Template: p-4 sm:ml-64 mt-14) */}
            <div className="p-4 sm:ml-64 mt-14 min-h-[calc(100vh-3.5rem)]">
                {children}
            </div>
        </div>
    );
}
