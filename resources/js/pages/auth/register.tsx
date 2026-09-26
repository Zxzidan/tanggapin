import { Form, Head } from '@inertiajs/react';
import {
    CheckCircle2,
    GraduationCap,
    HeartPulse,
    ShieldCheck,
    WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import { store } from '@/routes/register';
import type { RoleType } from '@/types/tanggapin';

type Props = {
    passwordRules: string;
};

interface RoleOption {
    id: RoleType;
    label: string;
    shortTitle: string;
    scopeBadge: string;
    isFullAccess: boolean;
    description: string;
    icon: typeof ShieldCheck;
}

const ROLE_OPTIONS: RoleOption[] = [
    {
        id: 'kepala_sekolah',
        label: 'Kepala Sekolah',
        shortTitle: 'Kepsek',
        scopeBadge: 'Akses Penuh',
        isFullAccess: true,
        description:
            'Akses ke seluruh 11 modul: analitik menyeluruh, monitoring kinerja, dan keputusan.',
        icon: ShieldCheck,
    },
    {
        id: 'operator',
        label: 'Operator Dapodik & Admin',
        shortTitle: 'Operator',
        scopeBadge: 'Akses Penuh',
        isFullAccess: true,
        description:
            'Akses ke seluruh sistem: integritas data Dapodik, SK guru, dan sinkronisasi server.',
        icon: CheckCircle2,
    },
    {
        id: 'wali_kelas',
        label: 'Wali Kelas (Rombel)',
        shortTitle: 'Wali Kelas',
        scopeBadge: 'Tupoksi Rombel',
        isFullAccess: false,
        description:
            'Disesuaikan untuk presensi harian rombel, early warning kelas, dan komunikasi orang tua.',
        icon: GraduationCap,
    },
    {
        id: 'bendahara',
        label: 'Bendahara Sekolah',
        shortTitle: 'Bendahara',
        scopeBadge: 'Tupoksi Keuangan',
        isFullAccess: false,
        description:
            'Disesuaikan untuk administrasi SPP, verifikasi bukti bayar transfer, dan rekonsiliasi kas.',
        icon: WalletCards,
    },
    {
        id: 'guru_bk',
        label: 'Guru BK & Konseling',
        shortTitle: 'Guru BK',
        scopeBadge: 'Tupoksi Kasus',
        isFullAccess: false,
        description:
            'Disesuaikan untuk alur kanban kasus konseling, mediasi masalah, dan pemantauan ATS.',
        icon: HeartPulse,
    },
];

export default function Register({ passwordRules }: Props) {
    const [selectedRole, setSelectedRole] = useState<RoleType>('wali_kelas');
    const activeOption =
        ROLE_OPTIONS.find((r) => r.id === selectedRole) || ROLE_OPTIONS[0];
    const ActiveIcon = activeOption.icon;

    return (
        <>
            <Head title="Daftar Akun — TANGGAPIN" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="role" value={selectedRole} />

                        <div className="grid gap-5">
                            {/* 1. NAMA LENGKAP */}
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                                >
                                    Nama Lengkap & Gelar
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Contoh: Bpk. Hendra Setiawan, S.Pd"
                                    className="h-9 text-xs"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* 2. ALAMAT EMAIL RESMI */}
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                                >
                                    Alamat Email Sekolah
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="nama@smk1harapan.sch.id"
                                    className="h-9 text-xs"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* 3. PEMILIHAN ROLE & TUPOKSI */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Pilih Peran & Tanggung Jawab (Tupoksi)
                                    </Label>
                                    <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">
                                        5 Pilihan Peran
                                    </span>
                                </div>

                                {/* Role Switcher Pills Bar */}
                                <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/80 p-1.5 dark:border-slate-700 dark:bg-[#162238]">
                                    <span className="px-2 text-[11px] font-semibold text-slate-500">
                                        Peran:
                                    </span>
                                    {ROLE_OPTIONS.map((role) => {
                                        const isSelected =
                                            selectedRole === role.id;
                                        return (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedRole(role.id)
                                                }
                                                className={cn(
                                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                                                    isSelected
                                                        ? 'bg-blue-700 font-semibold text-white shadow-xs'
                                                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white',
                                                )}
                                            >
                                                {role.shortTitle}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Selected Role Detail Card */}
                                <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 py-2.5 text-[11px] dark:border-blue-900/40 dark:bg-blue-950/30">
                                    <div className="mt-0.5 shrink-0 rounded-lg bg-blue-600 p-1.5 text-white">
                                        <ActiveIcon className="size-3.5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-0.5 flex items-center justify-between gap-1">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                {activeOption.label}
                                            </span>
                                            <span className="shrink-0 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                                {activeOption.scopeBadge}
                                            </span>
                                        </div>
                                        <p className="text-[11px] leading-tight text-slate-600 dark:text-slate-400">
                                            {activeOption.description}
                                        </p>
                                    </div>
                                </div>
                                <InputError message={errors.role} />
                            </div>

                            {/* 4. PASSWORD & CONFIRM PASSWORD */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                                    >
                                        Kata Sandi
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Minimal 8 karakter"
                                        passwordrules={passwordRules}
                                        className="h-9 text-xs"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                                    >
                                        Konfirmasi Sandi
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Ulangi kata sandi"
                                        passwordrules={passwordRules}
                                        className="h-9 text-xs"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-10 w-full bg-blue-700 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-800"
                                tabIndex={5}
                                data-test="register-user-button"
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2" />}
                                Buat Akun & Masuk Sistem
                            </Button>
                        </div>

                        <div className="text-center text-xs text-muted-foreground">
                            Sudah memiliki akun terdaftar?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-semibold text-blue-700 dark:text-blue-400"
                            >
                                Masuk ke Tanggapin
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Pendaftaran Akun Terpadu',
    description:
        'Pilih peran dan lengkapi data untuk mulai menggunakan sistem sekolah terintegrasi',
};
