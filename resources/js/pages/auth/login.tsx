import { Form, Head } from '@inertiajs/react';
import {
    CheckCircle2,
    GraduationCap,
    HeartPulse,
    ShieldCheck,
    Sparkles,
    WalletCards,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import type { RoleType } from '@/types/tanggapin';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

interface DemoPersona {
    role: RoleType;
    label: string;
    email: string;
    scope: string;
    isFullAccess: boolean;
    icon: typeof ShieldCheck;
}

const DEMO_PERSONAS: DemoPersona[] = [
    {
        role: 'kepala_sekolah',
        label: 'Kepala Sekolah',
        email: 'kepsek@smk1harapan.sch.id',
        scope: 'Semua Fitur (11 Modul)',
        isFullAccess: true,
        icon: ShieldCheck,
    },
    {
        role: 'operator',
        label: 'Operator Dapodik',
        email: 'operator@smk1harapan.sch.id',
        scope: 'Semua Fitur (Dapodik & Admin)',
        isFullAccess: true,
        icon: CheckCircle2,
    },
    {
        role: 'wali_kelas',
        label: 'Wali Kelas XI RPL 2',
        email: 'walikelas@smk1harapan.sch.id',
        scope: 'Tupoksi Rombel XI RPL 2',
        isFullAccess: false,
        icon: GraduationCap,
    },
    {
        role: 'guru_bk',
        label: 'Guru BK & Konseling',
        email: 'gurubk@smk1harapan.sch.id',
        scope: 'Tupoksi Kasus & Mediasi',
        isFullAccess: false,
        icon: HeartPulse,
    },
    {
        role: 'bendahara',
        label: 'Bendahara Sekolah',
        email: 'bendahara@smk1harapan.sch.id',
        scope: 'Tupoksi Keuangan & SPP',
        isFullAccess: false,
        icon: WalletCards,
    },
];

export default function Login({ status, canResetPassword }: Props) {
    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedPassword, setSelectedPassword] = useState('');
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const handleSelectPersona = (persona: DemoPersona) => {
        setSelectedEmail(persona.email);
        setSelectedPassword('password');

        if (typeof window !== 'undefined') {
            localStorage.setItem('tanggapin_current_role', persona.role);
        }

        toast.success(`Kredensial demo ${persona.label} berhasil diisi!`, {
            description: `Akses: ${persona.scope}`,
        });

        // Set native input values so form submission catches them immediately
        if (emailInputRef.current) {
            emailInputRef.current.value = persona.email;
        }
        if (passwordInputRef.current) {
            passwordInputRef.current.value = 'password';
        }
    };

    return (
        <>
            <Head title="Masuk ke Akun — TANGGAPIN" />

            <PasskeyVerify />

            {/* Quick Demo Role Selector */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                        <Sparkles className="size-3.5 text-blue-600" />
                        Pintasan Masuk Demo (Pilih Peran)
                    </span>
                    <span className="text-[10px] text-blue-700 dark:text-blue-400 font-medium">
                        1-Klik Isi
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {DEMO_PERSONAS.map((persona) => {
                        const Icon = persona.icon;
                        const isCurrent = selectedEmail === persona.email;

                        return (
                            <button
                                key={persona.role}
                                type="button"
                                onClick={() => handleSelectPersona(persona)}
                                className={cn(
                                    'p-2 rounded-xl text-left border transition-all flex items-center gap-2 group',
                                    isCurrent
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                        : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                                )}
                            >
                                <div
                                    className={cn(
                                        'p-1.5 rounded-lg shrink-0 transition-colors',
                                        isCurrent
                                            ? 'bg-blue-700 text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600'
                                    )}
                                >
                                    <Icon className="size-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[11px] truncate">
                                            {persona.label}
                                        </span>
                                    </div>
                                    <span
                                        className={cn(
                                            'text-[9px] block truncate',
                                            isCurrent ? 'text-blue-100' : 'text-slate-500'
                                        )}
                                    >
                                        {persona.scope}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    ref={emailInputRef}
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    defaultValue={selectedEmail}
                                    placeholder="nama@smk1harapan.sch.id"
                                    className="h-9 text-xs"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs text-blue-700 dark:text-blue-400 hover:underline"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    ref={passwordInputRef}
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    defaultValue={selectedPassword}
                                    placeholder="Kata sandi akun"
                                    className="h-9 text-xs"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400">
                                    Ingat saya di perangkat ini
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-10 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Masuk ke Sistem
                            </Button>
                        </div>

                        <div className="text-center text-xs text-muted-foreground">
                            Belum memiliki akun?{' '}
                            <TextLink href={register()} tabIndex={5} className="font-semibold text-blue-700 dark:text-blue-400">
                                Daftarkan Akun Sekolah
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="p-3 text-center text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke Tanggapin',
    description: 'Sistem Terpadu Penanganan Kondisi Siswa & Operasional Sekolah',
};
