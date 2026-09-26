import { Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    ChevronDown,
    FileText,
    GraduationCap,
    Home,
    LogOut,
    Menu,
    Moon,
    PhoneCall,
    Plus,
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
    activeTab = 'overview',
    onTabChange,
    currentRole = 'kepala_sekolah',
    onRoleChange,
    onTriggerActionModal,
}: FlowbiteLayoutProps) {
    const { auth } = usePage<{
        auth: { user: { name: string; email: string } };
    }>().props;
    const { resolvedAppearance, updateAppearance } = useAppearance();

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
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false);
            }
            if (
                quickActionRef.current &&
                !quickActionRef.current.contains(event.target as Node)
            ) {
                setIsQuickActionOpen(false);
            }
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setIsNotificationOpen(false);
            }
            if (
                roleDropdownRef.current &&
                !roleDropdownRef.current.contains(event.target as Node)
            ) {
                setIsRoleDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const roleLabels: Record<
        RoleType,
        { title: string; badge: string; desc: string }
    > = {
        kepala_sekolah: {
            title: 'Kepala Sekolah',
            badge: 'Decision Maker',
            desc: 'Pemantauan komprehensif sekolah',
        },
        wali_kelas: {
            title: 'Wali Kelas XI RPL 2',
            badge: 'Garda Depan',
            desc: 'Deteksi & intervensi kelas',
        },
        guru_bk: {
            title: 'Guru BK & Konseling',
            badge: 'Case Manager',
            desc: 'Penanganan kasus & pendampingan',
        },
        bendahara: {
            title: 'Bendahara Sekolah',
            badge: 'Keuangan',
            desc: 'Monitoring SPP & tagihan',
        },
        operator: {
            title: 'Operator Dapodik',
            badge: 'Data Verifier',
            desc: 'Validasi & sinkronisasi data',
        },
    };

    const handleNavClick = (tab: string) => {
        if (onTabChange) {
            onTabChange(tab);
        }
        setIsSidebarOpen(false);
    };

    const navSections = [
        {
            section: 'UTAMA',
            items: [
                {
                    id: 'overview',
                    title: 'Ikhtisar & Tindakan',
                    icon: Home,
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
                    badge: '12',
                    badgeColor:
                        'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/70 border border-red-200 dark:border-red-900',
                },
                {
                    id: 'class-monitoring',
                    title: 'Kondisi Kelas',
                    icon: GraduationCap,
                    badge: null,
                    badgeColor: '',
                },
                {
                    id: 'ats',
                    title: 'Alur Lapangan ATS',
                    icon: UserCheck,
                    badge: 'Baru',
                    badgeColor:
                        'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800',
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
                    badge: '4',
                    badgeColor:
                        'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800',
                },
                {
                    id: 'communication',
                    title: 'Komunikasi Ortu',
                    icon: PhoneCall,
                    badge: '2',
                    badgeColor:
                        'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800',
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
                    badge: '7',
                    badgeColor:
                        'text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-800',
                },
                {
                    id: 'payments',
                    title: 'Pembayaran & SPP',
                    icon: WalletCards,
                    badge: '18',
                    badgeColor:
                        'text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800',
                },
                {
                    id: 'documents',
                    title: 'Dokumen Guru',
                    icon: FileText,
                    badge: null,
                    badgeColor: '',
                },
                {
                    id: 'incidents',
                    title: 'Respons Insiden',
                    icon: Siren,
                    badge: 'Siaga',
                    badgeColor:
                        'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950 border border-red-300 dark:border-red-800',
                },
            ],
        },
    ];

    const searchResults = [
        {
            type: 'Siswa Berisiko',
            title: 'Brian Aditya - XI RPL 2',
            desc: 'Kehadiran turun 28% dalam 14 hari',
            tab: 'early-warning',
        },
        {
            type: 'Kasus Aktif',
            title: 'CS-2025-089 - Rian Pratama',
            desc: 'Kedisiplinan berulang - Tahap Konseling BK',
            tab: 'cases',
        },
        {
            type: 'Anomali Data',
            title: 'SK Tugas Tambahan Drs. Subagyo',
            desc: 'Belum terpetakan pada semester ganjil',
            tab: 'data-check',
        },
        {
            type: 'Tagihan SPP',
            title: 'Reza Pahlevi - XI RPL 2',
            desc: 'Jatuh tempo 10 Sep 2025 - Rp 350.000',
            tab: 'payments',
        },
        {
            type: 'Kunjungan Lapangan',
            title: 'Deni Saputra - XI TKR 3',
            desc: 'Verifikasi tim ATS terjadwal',
            tab: 'ats',
        },
    ].filter(
        (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="bg-neutral-secondary-soft text-body min-h-screen font-sans antialiased dark:bg-[#070b14]">
            {/* Top Navigation Bar */}
            <nav className="border-default fixed top-0 z-50 w-full border-b bg-white/95 shadow-xs backdrop-blur-md transition-colors dark:bg-[#0b1120]/95">
                <div className="px-3 py-2.5 lg:px-6">
                    <div className="flex items-center justify-between">
                        {/* Left Side: Mobile Toggle + Brand */}
                        <div className="flex items-center justify-start gap-2">
                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-heading hover:bg-neutral-secondary-medium rounded-lg p-2 transition-colors sm:hidden"
                                aria-label="Toggle sidebar"
                            >
                                <Menu className="size-5" />
                            </button>

                            <Link
                                href="/dashboard"
                                className="group me-2 flex items-center md:me-8"
                            >
                                <TanggapinLogo
                                    size="md"
                                    showDescriptor={true}
                                />
                            </Link>
                        </div>

                        {/* Middle: Clean Global Search Bar with Keyboard Shortcut */}
                        <div className="relative hidden w-72 md:block lg:w-96">
                            <div className="text-fg-disabled pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                placeholder="Cari siswa, kasus, dokumen, data... (/)"
                                className="text-heading border-default bg-neutral-secondary-soft/70 block w-full rounded-lg border py-1.5 ps-9 pe-10 text-xs transition-all outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/30 dark:focus:bg-[#0f172a]"
                            />
                            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5">
                                <kbd className="text-fg-disabled bg-neutral-secondary-medium border-default-medium rounded border px-1.5 py-0.5 text-[10px] font-semibold">
                                    /
                                </kbd>
                            </div>

                            {/* Live Search Popup */}
                            {isSearchFocused && searchQuery.length > 0 && (
                                <div
                                    onMouseDown={(e) => e.preventDefault()}
                                    className="bg-neutral-primary-medium border-default absolute right-0 left-0 z-50 mt-2 rounded-xl border p-2 text-xs shadow-lg"
                                >
                                    <div className="border-default text-fg-disabled mb-1.5 flex items-center justify-between border-b px-1 pb-1.5 text-[11px]">
                                        <span>
                                            Hasil Pencarian (
                                            {searchResults.length})
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsSearchFocused(false)
                                            }
                                            className="hover:text-heading"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    {searchResults.length > 0 ? (
                                        <div className="space-y-1">
                                            {searchResults.map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        handleNavClick(
                                                            item.tab,
                                                        );
                                                        setIsSearchFocused(
                                                            false,
                                                        );
                                                        setSearchQuery('');
                                                    }}
                                                    className="hover:bg-neutral-tertiary group flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors"
                                                >
                                                    <span className="mt-0.5 shrink-0 rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
                                                        {item.type}
                                                    </span>
                                                    <div>
                                                        <div className="text-heading group-hover:text-fg-brand font-semibold">
                                                            {item.title}
                                                        </div>
                                                        <div className="text-body text-[11px]">
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-fg-disabled py-4 text-center text-xs">
                                            Tidak ditemukan hasil untuk "
                                            {searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Header: Role Simulator + Quick Actions + Notifications + Appearance + User */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {/* Role Switcher Simulator (PRD Context) */}
                            <div className="relative" ref={roleDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsRoleDropdownOpen(
                                            !isRoleDropdownOpen,
                                        )
                                    }
                                    className="text-heading bg-neutral-secondary-medium hover:bg-neutral-tertiary border-default inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors"
                                    title="Ganti Tampilan Peran (Simulator Tanggapin)"
                                >
                                    <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    <span className="hidden font-semibold lg:inline-block">
                                        {roleLabels[currentRole]?.title}
                                    </span>
                                    <span className="font-semibold lg:hidden">
                                        {currentRole === 'kepala_sekolah'
                                            ? 'Kepsek'
                                            : currentRole.replace('_', ' ')}
                                    </span>
                                    <ChevronDown className="text-fg-disabled h-3 w-3" />
                                </button>

                                {isRoleDropdownOpen && (
                                    <div className="border-default absolute right-0 z-50 mt-2 w-64 animate-in rounded-xl border bg-white py-1.5 shadow-xl zoom-in-95 fade-in dark:bg-[#111c30]">
                                        <div className="border-default text-fg-disabled border-b px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase">
                                            Simulasi Hak Akses & Peran
                                        </div>
                                        {(
                                            Object.keys(
                                                roleLabels,
                                            ) as RoleType[]
                                        ).map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => {
                                                    if (onRoleChange) {
                                                        onRoleChange(r);
                                                    }
                                                    setIsRoleDropdownOpen(
                                                        false,
                                                    );
                                                }}
                                                className={cn(
                                                    'hover:bg-neutral-tertiary flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors',
                                                    currentRole === r &&
                                                        'bg-blue-50/80 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
                                                )}
                                            >
                                                <div>
                                                    <div className="font-semibold">
                                                        {roleLabels[r].title}
                                                    </div>
                                                    <div className="text-fg-disabled text-[10px] font-normal">
                                                        {roleLabels[r].desc}
                                                    </div>
                                                </div>
                                                <span className="text-fg-disabled bg-neutral-secondary-soft border-default ms-2 shrink-0 rounded border px-1.5 py-0.5 text-[10px]">
                                                    {roleLabels[r].badge}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Action Button "+ Tindakan Cepat" */}
                            <div className="relative" ref={quickActionRef}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsQuickActionOpen(!isQuickActionOpen)
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 active:scale-95"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">
                                        Tindakan
                                    </span>
                                </button>

                                {isQuickActionOpen && (
                                    <div className="border-default absolute right-0 z-50 mt-2 w-56 animate-in rounded-xl border bg-white py-1.5 text-xs shadow-xl zoom-in-95 fade-in dark:bg-[#111c30]">
                                        <div className="border-default text-fg-disabled border-b px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase">
                                            Aksi Operasional Cepat
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                if (onTriggerActionModal) {
                                                    onTriggerActionModal(
                                                        'followup',
                                                    );
                                                }
                                            }}
                                            className="hover:bg-neutral-tertiary text-heading flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
                                        >
                                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
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
                                                }
                                            }}
                                            className="hover:bg-neutral-tertiary text-heading flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
                                        >
                                            <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Hubungi Orang Tua</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                if (onTriggerActionModal) {
                                                    onTriggerActionModal(
                                                        'new_case',
                                                    );
                                                }
                                            }}
                                            className="hover:bg-neutral-tertiary text-heading flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
                                        >
                                            <ShieldAlert className="h-3.5 w-3.5 text-blue-600" />
                                            <span>Eskalasi ke Kasus BK</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsQuickActionOpen(false);
                                                handleNavClick('incidents');
                                            }}
                                            className="hover:bg-neutral-tertiary text-heading border-default flex w-full items-center gap-2 border-t px-3 py-2 text-left text-red-600 transition-colors dark:text-red-400"
                                        >
                                            <Siren className="h-3.5 w-3.5 text-red-500" />
                                            <span>
                                                Laporkan Situasi Darurat
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Notifications Bell */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsNotificationOpen(
                                            !isNotificationOpen,
                                        )
                                    }
                                    className="text-body hover:bg-neutral-secondary-medium hover:text-heading relative rounded-lg p-2 transition-colors"
                                    title="Notifikasi Operasional"
                                >
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                    </span>
                                </button>

                                {isNotificationOpen && (
                                    <div className="border-default absolute right-0 z-50 mt-2 w-80 animate-in rounded-xl border bg-white p-2.5 text-xs shadow-xl zoom-in-95 fade-in dark:bg-[#111c30]">
                                        <div className="border-default text-heading mb-2 flex items-center justify-between border-b pb-2 font-semibold">
                                            <span>Notifikasi Operasional</span>
                                            <span className="text-fg-disabled text-[10px] font-normal">
                                                3 baru
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div
                                                onClick={() => {
                                                    handleNavClick(
                                                        'early-warning',
                                                    );
                                                    setIsNotificationOpen(
                                                        false,
                                                    );
                                                }}
                                                className="hover:bg-neutral-secondary-soft hover:border-default cursor-pointer rounded-lg border border-transparent p-2 transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600">
                                                    <AlertTriangle className="size-3" />
                                                    <span>
                                                        Early Warning: Brian
                                                        Aditya (XI RPL 2)
                                                    </span>
                                                </div>
                                                <p className="text-body mt-0.5 text-[11px] leading-snug">
                                                    Kehadiran turun 28% dalam 14
                                                    hari terakhir. Perlu
                                                    follow-up wali kelas.
                                                </p>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    handleNavClick('cases');
                                                    setIsNotificationOpen(
                                                        false,
                                                    );
                                                }}
                                                className="hover:bg-neutral-secondary-soft hover:border-default cursor-pointer rounded-lg border border-transparent p-2 transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600">
                                                    <ShieldAlert className="size-3" />
                                                    <span>
                                                        Kasus CS-2025-089
                                                        Menunggu Verifikasi
                                                    </span>
                                                </div>
                                                <p className="text-body mt-0.5 text-[11px] leading-snug">
                                                    Rian Pratama telah
                                                    menyelesaikan konseling sesi
                                                    2 bersama Guru BK.
                                                </p>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    handleNavClick(
                                                        'data-check',
                                                    );
                                                    setIsNotificationOpen(
                                                        false,
                                                    );
                                                }}
                                                className="hover:bg-neutral-secondary-soft hover:border-default cursor-pointer rounded-lg border border-transparent p-2 transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                                                    <CheckCircle2 className="size-3" />
                                                    <span>
                                                        Cek Data Dapodik: 7
                                                        Anomali
                                                    </span>
                                                </div>
                                                <p className="text-body mt-0.5 text-[11px] leading-snug">
                                                    SK penugasan guru
                                                    membutuhkan perbaikan
                                                    sebelum jadwal cut-off.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Appearance Toggle */}
                            <button
                                type="button"
                                onClick={() =>
                                    updateAppearance(
                                        resolvedAppearance === 'dark'
                                            ? 'light'
                                            : 'dark',
                                    )
                                }
                                className="rounded-base bg-neutral-secondary-soft hover:bg-neutral-secondary-medium text-heading border-default inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors"
                                title={
                                    resolvedAppearance === 'dark'
                                        ? 'Beralih ke Mode Terang'
                                        : 'Beralih ke Mode Gelap'
                                }
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <>
                                        <Sun className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                                        <span className="hidden sm:inline">
                                            Terang
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Moon className="h-3.5 w-3.5 shrink-0 text-slate-700 dark:text-slate-300" />
                                        <span className="hidden sm:inline">
                                            Gelap
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* User Profile Menu */}
                            <div
                                className="relative ms-1 flex items-center"
                                ref={userDropdownRef}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsUserMenuOpen(!isUserMenuOpen)
                                    }
                                    className="hover:bg-neutral-secondary-medium flex items-center gap-2 rounded-lg p-1 transition-colors"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <div className="flex size-8 items-center justify-center rounded-full border border-blue-300 bg-blue-100 text-xs font-bold text-blue-700 shadow-xs dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                        {(auth?.user?.name || 'NS')
                                            .split(' ')
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join('')}
                                    </div>
                                    <ChevronDown className="text-fg-disabled hidden h-3 w-3 sm:block" />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="border-default absolute top-11 right-0 z-50 w-60 animate-in rounded-xl border bg-white py-1.5 shadow-xl zoom-in-95 fade-in dark:bg-[#111c30]">
                                        <div className="border-default border-b px-4 py-2.5">
                                            <p className="text-heading truncate text-xs font-bold">
                                                {auth?.user?.name ||
                                                    'Neil Sims'}
                                            </p>
                                            <p className="text-body truncate text-[11px]">
                                                {auth?.user?.email ||
                                                    'neil.sims@tanggapin.sch.id'}
                                            </p>
                                            <div className="mt-1.5 inline-block rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                Peran:{' '}
                                                {roleLabels[currentRole]?.title}
                                            </div>
                                        </div>
                                        <ul className="text-body space-y-0.5 p-1.5 text-xs font-medium">
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleNavClick(
                                                            'overview',
                                                        );
                                                        setIsUserMenuOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className="hover:bg-neutral-tertiary hover:text-heading inline-flex w-full items-center rounded-lg p-2 transition-colors"
                                                >
                                                    <Home className="text-fg-disabled me-2 h-3.5 w-3.5" />
                                                    Dashboard Tanggapin
                                                </button>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/settings/profile"
                                                    className="hover:bg-neutral-tertiary hover:text-heading inline-flex w-full items-center rounded-lg p-2 transition-colors"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                >
                                                    <Settings className="text-fg-disabled me-2 h-3.5 w-3.5" />
                                                    Pengaturan Profil
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/settings/security"
                                                    className="hover:bg-neutral-tertiary hover:text-heading inline-flex w-full items-center rounded-lg p-2 transition-colors"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                >
                                                    <Shield className="text-fg-disabled me-2 h-3.5 w-3.5" />
                                                    Keamanan Akun
                                                </Link>
                                            </li>
                                            <li className="border-default mt-1 border-t pt-1">
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="inline-flex w-full items-center rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                                                >
                                                    <LogOut className="me-2 h-3.5 w-3.5" />
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
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity sm:hidden"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar with Professional Educational Grouping (PRD Section 17) */}
            <aside
                className={cn(
                    'border-default fixed top-0 left-0 z-40 h-full w-64 border-e bg-white pt-16 transition-transform sm:translate-x-0 dark:bg-[#0b1120]',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
                aria-label="Sidebar"
            >
                <div className="flex h-full flex-col justify-between overflow-y-auto px-3 py-3">
                    <div>
                        {/* School Context Card */}
                        <div className="bg-neutral-secondary-soft border-default mb-3 rounded-lg border p-2.5">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-700 text-xs font-bold text-white shadow-xs">
                                    SMK
                                </div>
                                <div className="leading-tight">
                                    <div className="text-heading text-xs font-bold">
                                        SMK Negeri 1 Harapan
                                    </div>
                                    <div className="text-fg-disabled text-[10px]">
                                        T.A. 2025/2026 • Ganjil
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        <div className="space-y-4">
                            {navSections.map((sec) => (
                                <div key={sec.section}>
                                    <div className="text-fg-disabled px-2.5 pb-1 text-[10px] font-bold tracking-wider uppercase">
                                        {sec.section}
                                    </div>
                                    <ul className="space-y-0.5">
                                        {sec.items.map((item) => {
                                            const IconComponent = item.icon;
                                            const isActive =
                                                activeTab === item.id;

                                            return (
                                                <li key={item.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleNavClick(
                                                                item.id,
                                                            )
                                                        }
                                                        className={cn(
                                                            'flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-all',
                                                            isActive
                                                                ? 'bg-blue-50 font-semibold text-blue-700 shadow-xs dark:bg-blue-950/60 dark:text-blue-300'
                                                                : 'text-body hover:bg-neutral-secondary-medium hover:text-heading',
                                                        )}
                                                    >
                                                        <IconComponent
                                                            className={cn(
                                                                'me-2.5 h-4 w-4 shrink-0 transition-colors',
                                                                isActive
                                                                    ? 'text-blue-700 dark:text-blue-400'
                                                                    : 'text-fg-disabled',
                                                            )}
                                                        />
                                                        <span className="flex-1 truncate">
                                                            {item.title}
                                                        </span>
                                                        {item.badge && (
                                                            <span
                                                                className={cn(
                                                                    'py-0.2 inline-flex shrink-0 items-center justify-center rounded-md px-1.5 text-[10px] font-bold',
                                                                    item.badgeColor,
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
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Footer Info */}
                    <div className="border-default text-fg-disabled mt-4 border-t pt-3 text-[11px]">
                        <div className="mb-1.5 flex items-center justify-between px-2">
                            <span>Status Operasional</span>
                            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <span className="me-1.5 size-1.5 animate-pulse rounded-full bg-emerald-500" />
                                Aktif & Sinkron
                            </span>
                        </div>
                        <div className="bg-neutral-secondary-soft border-default text-body rounded-lg border p-2 text-[10px] leading-relaxed">
                            <span className="text-heading block font-semibold">
                                Alur Tanggapin:
                            </span>
                            <span className="text-slate-500">
                                Sinyal → Tinjau → Tindak → Koordinasi → Hasil
                            </span>
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
