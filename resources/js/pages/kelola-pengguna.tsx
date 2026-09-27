import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    Award,
    BadgeAlert,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Edit3,
    Eye,
    EyeOff,
    GraduationCap,
    KeyRound,
    Layers,
    Lock,
    Mail,
    Plus,
    RefreshCw,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Trash2,
    UserCheck,
    Users,
    WalletCards,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { RoleType } from '@/types/tanggapin';

interface StaffUserItem {
    id: string;
    name: string;
    email: string;
    role: RoleType;
    schoolClassId: string | null;
    schoolClassName: string | null;
    rawPassword: string;
    emailVerifiedAt: string | null;
    createdAt: string;
}

interface SchoolClassItem {
    id: string;
    name: string;
    major: string;
    homeroomTeacher: string;
    totalStudents: number;
}

interface QuotaInfo {
    plan: 'perintis' | 'unggulan' | 'yayasan';
    planName: string;
    currentClasses: number;
    maxClasses: number | null;
    isUnlimited: boolean;
    isLimitReached: boolean;
    remainingClasses: number;
}

interface KelolaPenggunaProps {
    users: StaffUserItem[];
    classes: SchoolClassItem[];
    quota: QuotaInfo;
    setting: {
        schoolName: string;
        npsn: string;
        academicYear: string;
    };
}

export default function KelolaPengguna({
    users,
    classes,
    quota,
    setting,
}: KelolaPenggunaProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

    // Password visibility state & copy status for Operator
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
    const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

    // Create User Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState<RoleType>('wali_kelas');
    const [newUserClassId, setNewUserClassId] = useState<string>(
        classes[0]?.id || '',
    );
    const [newUserPassword, setNewUserPassword] = useState('password123');
    const [showNewUserPassword, setShowNewUserPassword] = useState(true);

    // Edit User Modal
    const [editingUser, setEditingUser] = useState<StaffUserItem | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState<RoleType>('wali_kelas');
    const [editClassId, setEditClassId] = useState<string>('');
    const [editPassword, setEditPassword] = useState('');
    const [showEditCurrentPassword, setShowEditCurrentPassword] = useState(false);
    const [showEditNewPassword, setShowEditNewPassword] = useState(false);

    // Helper: generate readable random password
    const generateRandomPassword = () => {
        const words = ['Guru', 'Wali', 'Staf', 'Pendidik', 'Cerdas', 'Hebat'];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${randomWord}#${randomNum}`;
    };

    // Helper: toggle visibility per user
    const togglePasswordVisibility = (userId: string) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    // Helper: copy password to clipboard
    const handleCopyPassword = (userId: string, password: string, userName: string) => {
        navigator.clipboard.writeText(password);
        setCopiedUserId(userId);
        setNotificationMessage(`Kata sandi akun ${userName} ("${password}") berhasil disalin ke clipboard!`);
        setTimeout(() => setCopiedUserId(null), 2500);
        setTimeout(() => setNotificationMessage(null), 5000);
    };

    // Add Class Modal
    const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newClassMajor, setNewClassMajor] = useState('');
    const [newClassTeacher, setNewClassTeacher] = useState('');

    // Plan Switcher Modal
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

    // Toast/Feedback state
    const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Filtered users
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.schoolClassName &&
                u.schoolClassName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesRole =
            selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
        return matchesSearch && matchesRole;
    });

    // Handle Create User
    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/kelola-pengguna',
            {
                name: newUserName,
                email: newUserEmail,
                role: newUserRole,
                school_class_id:
                    newUserRole === 'wali_kelas' ? newUserClassId : null,
                password: newUserPassword,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setNewUserName('');
                    setNewUserEmail('');
                    setNewUserPassword('password123');
                    setNotificationMessage(
                        `Akun untuk ${newUserName} berhasil dibuat!`,
                    );
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0] as string;
                    setErrorMessage(firstError || 'Gagal membuat akun staf.');
                    setTimeout(() => setErrorMessage(null), 5000);
                },
            },
        );
    };

    // Handle Edit User
    const handleOpenEditModal = (user: StaffUserItem) => {
        setEditingUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditRole(user.role);
        setEditClassId(user.schoolClassId || classes[0]?.id || '');
        setEditPassword('');
        setShowEditCurrentPassword(false);
        setShowEditNewPassword(false);
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        router.put(
            `/kelola-pengguna/${editingUser.id}`,
            {
                name: editName,
                email: editEmail,
                role: editRole,
                school_class_id:
                    editRole === 'wali_kelas' ? editClassId : null,
                password: editPassword || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingUser(null);
                    setNotificationMessage(`Data akun ${editName} berhasil diperbarui.`);
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0] as string;
                    setErrorMessage(firstError || 'Gagal memperbarui akun.');
                    setTimeout(() => setErrorMessage(null), 5000);
                },
            },
        );
    };

    // Handle Delete User
    const handleDeleteUser = (user: StaffUserItem) => {
        if (
            !confirm(
                `Apakah Anda yakin ingin menghapus akun ${user.name} dengan email ${user.email}? Akses ke sistem akan dicabut.`,
            )
        ) {
            return;
        }

        router.delete(`/kelola-pengguna/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setNotificationMessage(`Akun ${user.name} berhasil dihapus.`);
                setTimeout(() => setNotificationMessage(null), 5000);
            },
            onError: (err) => {
                const firstError = Object.values(err)[0] as string;
                setErrorMessage(firstError || 'Gagal menghapus akun.');
                setTimeout(() => setErrorMessage(null), 5000);
            },
        });
    };

    // Handle Add Class
    const handleAddClass = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/kelola-pengguna/kelas',
            {
                name: newClassName,
                major: newClassMajor,
                homeroom_teacher_name: newClassTeacher || 'Belum Ditugaskan',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddClassModalOpen(false);
                    setNewClassName('');
                    setNewClassMajor('');
                    setNewClassTeacher('');
                    setNotificationMessage(
                        `Rombongan belajar ${newClassName} berhasil ditambahkan!`,
                    );
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0] as string;
                    setErrorMessage(firstError || 'Gagal menambah rombel.');
                    setTimeout(() => setErrorMessage(null), 5000);
                },
            },
        );
    };

    // Handle Plan Switch
    const handleSwitchPlan = (plan: 'perintis' | 'unggulan' | 'yayasan') => {
        router.post(
            '/kelola-pengguna/paket',
            { subscription_plan: plan },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsPlanModalOpen(false);
                    setNotificationMessage(
                        `Paket lisensi sekolah berhasil dialihkan!`,
                    );
                    setTimeout(() => setNotificationMessage(null), 5000);
                },
            },
        );
    };

    const getRoleBadge = (role: RoleType) => {
        switch (role) {
            case 'kepala_sekolah':
                return {
                    label: 'Kepala Sekolah',
                    className:
                        'border border-blue-300 bg-blue-100 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
                };
            case 'operator':
                return {
                    label: 'Operator Sekolah',
                    className:
                        'border border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/70 dark:text-blue-300',
                };
            case 'guru':
                return {
                    label: 'Guru Mapel',
                    className:
                        'border border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300',
                };
            case 'wali_kelas':
                return {
                    label: 'Wali Kelas',
                    className:
                        'border border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
                };
            case 'guru_bk':
                return {
                    label: 'Guru BK',
                    className:
                        'border border-blue-200 bg-blue-50/70 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300',
                };
            case 'bendahara':
                return {
                    label: 'Bendahara Sekolah',
                    className:
                        'border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
                };
            default:
                return {
                    label: role,
                    className: 'bg-slate-100 text-slate-800',
                };
        }
    };

    return (
        <FlowbiteTanggapinLayout activeTab="manage-users">
            <Head title="Kelola Akun Guru & Staf — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Notification Banner */}
                {notificationMessage && (
                    <div className="flex items-center justify-between rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-blue-900 shadow-xs dark:border-blue-800 dark:bg-blue-950/70 dark:text-blue-200">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium">
                                {notificationMessage}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotificationMessage(null)}
                            className="text-blue-700 hover:text-blue-900 dark:text-blue-300"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {errorMessage && (
                    <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2.5">
                            <AlertCircle className="size-5 text-slate-700 dark:text-slate-300" />
                            <span className="text-sm font-medium">{errorMessage}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setErrorMessage(null)}
                            className="text-slate-600 hover:text-slate-900 dark:text-slate-300"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/10 p-6 shadow-xs dark:border-slate-800 dark:from-[#0f172a] dark:via-blue-950/20 dark:to-slate-900">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/80 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                    <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                                    Pusat Kontrol Akses Terpusat Operator
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                    <Lock className="size-3 text-slate-600 dark:text-slate-400" />
                                    Pendaftaran Publik Dinonaktifkan
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                Manajemen Akun Guru & Staf Sekolah
                            </h1>
                            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                Seluruh hak akses guru, wali kelas, guru BK, bendahara, dan kepala sekolah diterbitkan secara aman oleh Operator. Wali kelas hanya dapat melihat dan menilai data siswa di rombel binaannya.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => setIsAddClassModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                <GraduationCap className="size-4 text-blue-600 dark:text-blue-400" />
                                <span>Tambah Rombel</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-800 active:scale-95"
                            >
                                <Plus className="size-4" />
                                <span>Terbitkan Akun Staf Baru</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subscription Tier & Class Quota Widget */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Quota Progress Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2 dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Status Lisensi Paket Sekolah
                                    </span>
                                    <span
                                        className={cn(
                                            'rounded-full border px-2 py-0.5 text-[11px] font-bold',
                                            quota.plan === 'yayasan'
                                                ? 'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                : quota.plan === 'unggulan'
                                                  ? 'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                  : 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
                                        )}
                                    >
                                        {quota.planName}
                                    </span>
                                </div>
                                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                                    {quota.isUnlimited ? (
                                        <span>Pengelolaan Rombongan Belajar: Kuota Tanpa Batas</span>
                                    ) : (
                                        <span>
                                            Penggunaan Kuota: {quota.currentClasses} dari {quota.maxClasses} Kelas Aktif
                                        </span>
                                    )}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsPlanModalOpen(true)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                                <Layers className="size-3.5 text-blue-600" />
                                <span>Ganti / Simulasi Paket</span>
                            </button>
                        </div>

                        {/* Progress Bar */}
                        {!quota.isUnlimited && quota.maxClasses && (
                            <div className="mt-4 space-y-1.5">
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all duration-500',
                                            quota.isLimitReached
                                                ? 'bg-blue-900 dark:bg-blue-400'
                                                : quota.currentClasses / quota.maxClasses > 0.8
                                                  ? 'bg-blue-500'
                                                  : 'bg-blue-600',
                                        )}
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                (quota.currentClasses / quota.maxClasses) * 100,
                                            )}%`,
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                    <span>
                                        Sisa slot rombel:{' '}
                                        <strong className="text-slate-800 dark:text-slate-200">
                                            {quota.remainingClasses} Kelas
                                        </strong>
                                    </span>
                                    <span>
                                        {quota.plan === 'unggulan'
                                            ? 'Paket Unggulan mendukung hingga 35 kelas'
                                            : 'Paket Perintis mendukung hingga 10 kelas'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {quota.isUnlimited && (
                            <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
                                ✨ <strong>Paket Yayasan / Cabang Dinas Aktif:</strong> Anda dapat mendaftarkan rombongan belajar tanpa batasan kuota untuk seluruh kampus dan jenjang.
                            </p>
                        )}
                    </div>

                    {/* School Identity Card */}
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Satuan Pendidikan Terdaftar
                            </span>
                            <div className="text-base font-bold text-slate-900 dark:text-white">
                                {setting.schoolName}
                            </div>
                            <div className="text-xs text-slate-500">
                                NPSN: {setting.npsn} • Tahun Ajaran {setting.academicYear}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                            <span>Total Staf Terdaftar:</span>
                            <span className="font-bold text-blue-700 dark:text-blue-400">
                                {users.length} Akun Aktif
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama staf, email resmi, atau rombel binaan..."
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-2.5">
                        <select
                            value={selectedRoleFilter}
                            onChange={(e) => setSelectedRoleFilter(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="all">Semua Peran Akun</option>
                            <option value="guru">Guru Mata Pelajaran</option>
                            <option value="wali_kelas">Wali Kelas</option>
                            <option value="guru_bk">Guru BK</option>
                            <option value="kepala_sekolah">Kepala Sekolah</option>
                            <option value="bendahara">Bendahara Sekolah</option>
                            <option value="operator">Operator Sekolah</option>
                        </select>
                    </div>
                </div>

                {/* Staff User Accounts Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-5 py-3.5">Nama Pendidik & Staf</th>
                                    <th className="px-5 py-3.5">Peran Akun Resmi</th>
                                    <th className="px-5 py-3.5">Rombel Binaan Khusus Wali Kelas</th>
                                    <th className="px-5 py-3.5">Email Akses</th>
                                    <th className="px-4 py-3.5">Kata Sandi Akun Akses Operator</th>
                                    <th className="px-5 py-3.5">Terdaftar</th>
                                    <th className="px-5 py-3.5 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-8 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            Tidak ada akun staf yang cocok dengan kriteria pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const badge = getRoleBadge(user.role);
                                        const isPasswordVisible = visiblePasswords[user.id];
                                        return (
                                            <tr
                                                key={user.id}
                                                className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                                            >
                                                {/* Name & Avatar */}
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">
                                                        ID: #{user.id}
                                                    </div>
                                                </td>

                                                {/* Role Badge */}
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold',
                                                            badge.className,
                                                        )}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </td>

                                                {/* Assigned Class Scope */}
                                                <td className="px-5 py-4">
                                                    {user.role === 'wali_kelas' ? (
                                                        user.schoolClassName ? (
                                                            <div className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-400">
                                                                <GraduationCap className="size-4" />
                                                                <span>Kelas {user.schoolClassName}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                                <AlertCircle className="size-3.5" />
                                                                <span>Belum Dihubungkan ke Rombel</span>
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="text-slate-400">
                                                            — (Akses Tingkat Sekolah)
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Email */}
                                                <td className="px-5 py-4">
                                                    <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                                                        {user.email}
                                                    </div>
                                                </td>

                                                {/* Password Peek & Copy Column for Operator */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/90 px-2.5 py-1 font-mono text-xs dark:border-slate-700 dark:bg-slate-800/80">
                                                            <KeyRound className="mr-1.5 size-3.5 text-blue-500 dark:text-blue-400" />
                                                            <span className={cn(
                                                                "select-all font-mono",
                                                                isPasswordVisible
                                                                    ? "font-bold text-slate-900 dark:text-white"
                                                                    : "tracking-wider text-slate-400 dark:text-slate-500"
                                                            )}>
                                                                {isPasswordVisible ? (user.rawPassword || 'password') : '••••••••'}
                                                            </span>
                                                        </div>

                                                        {/* Eye Peek Toggle */}
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePasswordVisibility(user.id)}
                                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                                            title={isPasswordVisible ? "Sembunyikan kata sandi" : "Lihat kata sandi staf"}
                                                        >
                                                            {isPasswordVisible ? (
                                                                <EyeOff className="size-4 text-slate-600 dark:text-slate-300" />
                                                            ) : (
                                                                <Eye className="size-4 text-blue-600 dark:text-blue-400" />
                                                            )}
                                                        </button>

                                                        {/* Copy Password Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyPassword(user.id, user.rawPassword || 'password', user.name)}
                                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                                            title="Salin kata sandi ke clipboard"
                                                        >
                                                            {copiedUserId === user.id ? (
                                                                <Check className="size-4 text-blue-600 dark:text-blue-400" />
                                                            ) : (
                                                                <Copy className="size-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Registered Date */}
                                                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                                    {user.createdAt}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEditModal(user)}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                                            title="Edit data / reset kata sandi"
                                                        >
                                                            <Edit3 className="size-3.5" />
                                                            <span>Ubah</span>
                                                        </button>

                                                        {user.role !== 'operator' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteUser(user)}
                                                                className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
                                                                title="Hapus akun staf"
                                                            >
                                                                <Trash2 className="size-3.5" />
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

                {/* Policy & Security Note Card */}
                <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-5 text-xs text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
                    <div className="flex items-center gap-2 font-bold text-sm">
                        <Lock className="size-4 text-blue-700 dark:text-blue-400" />
                        <span>Kebijakan Keamanan & Batasan Peran RBAC</span>
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed text-blue-900/90 dark:text-blue-300">
                        <li>
                            <strong>Pendaftaran Mandiri Ditutup:</strong> Pengguna tidak dapat membuat akun sendiri secara bebas dari halaman login untuk mencegah kebocoran data siswa.
                        </li>
                        <li>
                            <strong>Pemisahan Peran Guru & Wali Kelas:</strong> Guru difokuskan pada pengelolaan perangkat ajar / Modul Ajar (terintegrasi Audit AI mandiri) dan pemantauan capaian murid yang diajarnya di berbagai kelas. Sedangkan Wali Kelas dikhususkan untuk memantau kedisiplinan, absensi, kontak orang tua, dan pembinaan anak walinya.
                        </li>
                        <li>
                            <strong>Isolasi Data Wali Kelas:</strong> Pendidik yang memegang peran Wali Kelas hanya diperkenankan melihat, mencatat kedisiplinan, serta membuat dan mengirim rapor untuk peserta didik yang terdaftar di rombongan belajar binaannya.
                        </li>
                        <li>
                            <strong>Visibilitas Kata Sandi oleh Operator:</strong> Operator sekolah dapat melihat, membuka (peek), dan menyalin kembali kata sandi akun pendidik yang tersimpan (terenkripsi) agar dapat membantu guru/staf yang lupa sandi tanpa proses reset email yang rumit.
                        </li>
                        <li>
                            <strong>Batas Kuota Kelas:</strong> Paket Unggulan memberikan kuota hingga 35 kelas. Jika sekolah berkembang melampaui 35 kelas, tingkatkan lisensi ke Paket Yayasan (Unlimited) tanpa perlu migrasi database.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Create Staff Account Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <UserCheck className="size-5 text-blue-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Terbitkan Akun Staf Baru
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="mt-4 space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Lengkap Staf / Pendidik
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="Contoh: Dra. Hj. Siti Fatimah, M.Pd"
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Alamat Email Resmi Sekolah
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    placeholder="nama@sekolah.sch.id"
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Peran / Jabatan Sekolah
                                    </label>
                                    <select
                                        value={newUserRole}
                                        onChange={(e) =>
                                            setNewUserRole(e.target.value as RoleType)
                                        }
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="guru">Guru Mata Pelajaran</option>
                                        <option value="wali_kelas">Wali Kelas</option>
                                        <option value="guru_bk">Guru BK</option>
                                        <option value="bendahara">Bendahara Sekolah</option>
                                        <option value="kepala_sekolah">Kepala Sekolah</option>
                                    </select>
                                </div>

                                {newUserRole === 'wali_kelas' && (
                                    <div>
                                        <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                            Rombel / Kelas Binaan
                                        </label>
                                        <select
                                            value={newUserClassId}
                                            onChange={(e) => setNewUserClassId(e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        >
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} ({cls.major})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Kata Sandi Akun (Tersimpan & Dapat Dilihat Operator)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const pass = generateRandomPassword();
                                            setNewUserPassword(pass);
                                            setShowNewUserPassword(true);
                                        }}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        <Sparkles className="size-3" />
                                        <span>Generate Sandi Otomatis</span>
                                    </button>
                                </div>
                                <div className="relative mt-1">
                                    <input
                                        type={showNewUserPassword ? 'text' : 'password'}
                                        required
                                        value={newUserPassword}
                                        onChange={(e) => setNewUserPassword(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        title={showNewUserPassword ? "Sembunyikan" : "Tampilkan sandi"}
                                    >
                                        {showNewUserPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <span className="mt-1 block text-[11px] text-slate-400">
                                    Operator dapat menyalin dan melihat kembali kata sandi ini kapan saja di tabel manajemen staf.
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-800"
                                >
                                    Terbitkan Akun
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Staff Account Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Edit3 className="size-5 text-blue-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Ubah Data Akun Staf: {editingUser.name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="mt-4 space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Lengkap Staf
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                    Email Akses
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Peran Akun
                                    </label>
                                    <select
                                        value={editRole}
                                        onChange={(e) =>
                                            setEditRole(e.target.value as RoleType)
                                        }
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="guru">Guru Mata Pelajaran</option>
                                        <option value="wali_kelas">Wali Kelas</option>
                                        <option value="guru_bk">Guru BK</option>
                                        <option value="bendahara">Bendahara Sekolah</option>
                                        <option value="kepala_sekolah">Kepala Sekolah</option>
                                        <option value="operator">Operator Sekolah</option>
                                    </select>
                                </div>

                                {editRole === 'wali_kelas' && (
                                    <div>
                                        <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                            Rombel Binaan
                                        </label>
                                        <select
                                            value={editClassId}
                                            onChange={(e) => setEditClassId(e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        >
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} ({cls.major})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Saved Password Display Card for Operator */}
                            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 font-semibold text-blue-950 dark:text-blue-200">
                                        <KeyRound className="size-4 text-blue-600 dark:text-blue-400" />
                                        <span>Kata Sandi Tersimpan Saat Ini Akses Operator</span>
                                    </div>
                                    <span className="rounded-full bg-blue-200/70 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                                        Tersimpan
                                    </span>
                                </div>
                                <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-blue-200/80 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                                    <div className="font-mono text-xs select-all">
                                        {showEditCurrentPassword ? (
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {editingUser.rawPassword || 'password'}
                                            </span>
                                        ) : (
                                            <span className="tracking-widest text-slate-400">••••••••••••</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditCurrentPassword(!showEditCurrentPassword)}
                                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                                        >
                                            {showEditCurrentPassword ? (
                                                <>
                                                    <EyeOff className="size-3.5" />
                                                    <span>Sembunyikan</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                    <span>Lihat Sandi</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleCopyPassword(editingUser.id, editingUser.rawPassword || 'password', editingUser.name)}
                                            className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                                        >
                                            {copiedUserId === editingUser.id ? (
                                                <>
                                                    <Check className="size-3.5 text-blue-600" />
                                                    <span>Tersalin!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-3.5" />
                                                    <span>Salin</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-1.5 text-[11px] text-blue-800/80 dark:text-blue-300/80">
                                    Operator dapat memberikan kata sandi ini langsung kepada guru/staf jika lupa kata sandi.
                                </p>
                            </div>

                            {/* Reset Password Field */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Ganti Kata Sandi Baru (Opsional)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const pass = generateRandomPassword();
                                            setEditPassword(pass);
                                            setShowEditNewPassword(true);
                                        }}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        <Sparkles className="size-3" />
                                        <span>Generate Sandi Baru</span>
                                    </button>
                                </div>
                                <div className="relative mt-1">
                                    <input
                                        type={showEditNewPassword ? 'text' : 'password'}
                                        value={editPassword}
                                        onChange={(e) => setEditPassword(e.target.value)}
                                        placeholder="Kosongkan jika tidak ingin mengubah kata sandi"
                                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEditNewPassword(!showEditNewPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        title={showEditNewPassword ? "Sembunyikan" : "Tampilkan sandi"}
                                    >
                                        {showEditNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                <span className="mt-1 block text-[11px] text-slate-400">
                                    Jika diubah, kata sandi baru akan otomatis tersimpan dan tetap dapat dilihat oleh Operator.
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-800"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add School Class Modal */}
            {isAddClassModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="size-5 text-blue-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Tambah Rombongan Belajar
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddClassModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {quota.isLimitReached ? (
                            <div className="mt-4 rounded-xl border border-slate-300 bg-slate-100 p-4 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                <strong>Batas Kuota Kelas Penuh!</strong>
                                <p className="mt-1">
                                    Sekolah Anda saat ini menggunakan {quota.planName} dengan batas {quota.maxClasses} kelas.
                                    Untuk menambah rombel baru, silakan beralih ke <strong>Paket Yayasan Kuota Tanpa Batas</strong>.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleAddClass} className="mt-4 space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Nama Rombel / Kelas
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newClassName}
                                        onChange={(e) => setNewClassName(e.target.value)}
                                        placeholder="Contoh: X TKJ 2, XI MM 1, XII RPL 1"
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Konsentrasi Keahlian / Jurusan
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newClassMajor}
                                        onChange={(e) => setNewClassMajor(e.target.value)}
                                        placeholder="Contoh: Teknik Komputer dan Jaringan"
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                                        Nama Wali Kelas Awal
                                    </label>
                                    <input
                                        type="text"
                                        value={newClassTeacher}
                                        onChange={(e) => setNewClassTeacher(e.target.value)}
                                        placeholder="Contoh: Budi Santoso, S.Kom atau kosongkan"
                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddClassModalOpen(false)}
                                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-800"
                                    >
                                        Simpan Rombel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Plan Switcher Modal */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Layers className="size-5 text-blue-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Pengaturan Lisensi Paket Sekolah
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPlanModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                            Pilih paket sesuai dengan kontrak pembelian sekolah untuk menentukan kuota rombongan belajar:
                        </p>

                        <div className="mt-4 space-y-3">
                            <div
                                onClick={() => handleSwitchPlan('perintis')}
                                className={cn(
                                    'cursor-pointer rounded-xl border p-4 transition-all',
                                    quota.plan === 'perintis'
                                        ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40'
                                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-800',
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                                        Paket Perintis
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        Maks. 10 Kelas
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    Cocok untuk sekolah skala kecil (SD/SMP &lt; 300 siswa).
                                </p>
                            </div>

                            <div
                                onClick={() => handleSwitchPlan('unggulan')}
                                className={cn(
                                    'cursor-pointer rounded-xl border p-4 transition-all',
                                    quota.plan === 'unggulan'
                                        ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40'
                                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-800',
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                                            Paket Unggulan
                                        </span>
                                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                            Populer
                                        </span>
                                    </div>
                                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                        Maks. 35 Kelas
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    Akses penuh 11 modul + AI Generator Rapor & kuota hingga 35 rombongan belajar.
                                </p>
                            </div>

                            <div
                                onClick={() => handleSwitchPlan('yayasan')}
                                className={cn(
                                    'cursor-pointer rounded-xl border p-4 transition-all',
                                    quota.plan === 'yayasan'
                                        ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40'
                                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-800',
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                                        Paket Yayasan & Dinas
                                    </span>
                                    <span className="rounded-full border border-blue-300 bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                        Unlimited Kelas
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    Dukungan multi-sekolah dengan kapasitas rombel dan siswa tanpa batasan kuota.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-slate-200 pt-3 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsPlanModalOpen(false)}
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
