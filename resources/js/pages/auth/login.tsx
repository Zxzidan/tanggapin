import { Form, Head } from '@inertiajs/react';
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
    shortTitle: string;
    label: string;
    email: string;
    scope: string;
    isFullAccess: boolean;
}

const DEMO_PERSONAS: DemoPersona[] = [
    {
        role: 'kepala_sekolah',
        shortTitle: 'Kepsek',
        label: 'Drs. H. Mulyadi, M.Pd (Kepala Sekolah)',
        email: 'kepsek@smk1harapan.sch.id',
        scope: 'Akses Penuh (11 Modul)',
        isFullAccess: true,
    },
    {
        role: 'operator',
        shortTitle: 'Operator',
        label: 'Harun Ar-Rasyid (Operator Dapodik & Admin)',
        email: 'operator@smk1harapan.sch.id',
        scope: 'Akses Penuh (Dapodik & Admin)',
        isFullAccess: true,
    },
    {
        role: 'wali_kelas',
        shortTitle: 'Wali Kelas',
        label: 'Hendra Setiawan, S.Pd (Wali Kelas XI RPL 2)',
        email: 'walikelas@smk1harapan.sch.id',
        scope: 'Tupoksi Rombel XI RPL 2',
        isFullAccess: false,
    },
    {
        role: 'bendahara',
        shortTitle: 'Bendahara',
        label: 'Siti Fatimah, S.E (Bendahara Sekolah)',
        email: 'bendahara@smk1harapan.sch.id',
        scope: 'Tupoksi Keuangan & SPP',
        isFullAccess: false,
    },
    {
        role: 'guru_bk',
        shortTitle: 'Guru BK',
        label: 'Rahmawati, S.Pd (Guru BK & Konseling)',
        email: 'gurubk@smk1harapan.sch.id',
        scope: 'Tupoksi Kasus & Mediasi',
        isFullAccess: false,
    },
];

export default function Login({ status, canResetPassword }: Props) {
    const [selectedRole, setSelectedRole] = useState<RoleType>('guru_bk');
    const [selectedEmail, setSelectedEmail] = useState(
        'gurubk@smk1harapan.sch.id',
    );
    const [selectedPassword, setSelectedPassword] = useState('password');
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const handleSelectRole = (role: RoleType) => {
        setSelectedRole(role);
        const persona = DEMO_PERSONAS.find((p) => p.role === role);
        if (persona) {
            setSelectedEmail(persona.email);
            setSelectedPassword('password');

            if (typeof window !== 'undefined') {
                localStorage.setItem('tanggapin_current_role', persona.role);
            }

            if (emailInputRef.current) {
                emailInputRef.current.value = persona.email;
            }
            if (passwordInputRef.current) {
                passwordInputRef.current.value = 'password';
            }

            toast.success(`Kredensial ${persona.shortTitle} terisi otomatis!`, {
                description: `Email: ${persona.email}`,
            });
        }
    };

    const activePersona =
        DEMO_PERSONAS.find((p) => p.role === selectedRole) || DEMO_PERSONAS[0];

    return (
        <>
            <Head title="Masuk ke Akun — TANGGAPIN" />

            <PasskeyVerify />

            {/* Role Switcher Pills Bar */}
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/80 p-1.5 dark:border-slate-700 dark:bg-[#162238]">
                    <span className="px-2 text-[11px] font-semibold text-slate-500">
                        Peran:
                    </span>
                    {(
                        [
                            'kepala_sekolah',
                            'operator',
                            'wali_kelas',
                            'bendahara',
                            'guru_bk',
                        ] as RoleType[]
                    ).map((r) => {
                        const persona = DEMO_PERSONAS.find(
                            (p) => p.role === r,
                        )!;
                        const isCurrent = selectedRole === r;
                        return (
                            <button
                                key={r}
                                type="button"
                                onClick={() => handleSelectRole(r)}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                                    isCurrent
                                        ? 'bg-blue-700 font-semibold text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white',
                                )}
                            >
                                {persona.shortTitle}
                            </button>
                        );
                    })}
                </div>

                {/* Brief Persona Scope Notification */}
                <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-[11px] dark:border-blue-900/40 dark:bg-blue-950/30">
                    <span className="me-2 truncate text-slate-600 dark:text-slate-300">
                        Akun:{' '}
                        <strong className="font-semibold text-blue-700 dark:text-blue-400">
                            {activePersona.label}
                        </strong>
                    </span>
                    <span className="shrink-0 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                        {activePersona.scope}
                    </span>
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-4 pt-1"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                                >
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
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                                    >
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs text-blue-700 hover:underline dark:text-blue-400"
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
                                <Label
                                    htmlFor="remember"
                                    className="text-xs text-slate-600 dark:text-slate-400"
                                >
                                    Ingat saya di perangkat ini
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="h-10 w-full bg-blue-700 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-800"
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
                            <TextLink
                                href={register()}
                                tabIndex={5}
                                className="font-semibold text-blue-700 dark:text-blue-400"
                            >
                                Daftarkan Akun Sekolah
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke Tanggapin',
    description:
        'Sistem Terpadu Penanganan Kondisi Siswa & Operasional Sekolah',
};
