import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import React from 'react';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

export default function Register() {
    return (
        <AuthLayout
            title="Pendaftaran Akun Terpusat"
            description="Pusat Kontrol Akses & Keamanan Sistem Sekolah Tanggapin"
        >
            <Head title="Pendaftaran Akun — TANGGAPIN" />

            <div className="space-y-4">
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-center dark:border-blue-900/60 dark:bg-blue-950/40">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        <Lock className="size-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                        Pendaftaran Mandiri Dinonaktifkan
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        Untuk menjaga integritas dan kerahasiaan data siswa, akun Wali Kelas, Guru BK, Bendahara, dan Kepala Sekolah tidak dapat dibuat secara mandiri.
                    </p>
                    <div className="mt-3 rounded-lg border border-blue-200/80 bg-white/90 p-3 text-left text-xs text-slate-700 dark:border-blue-800 dark:bg-slate-900/80 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300">
                            <ShieldCheck className="size-4" />
                            <span>Prosedur Mendapatkan Akun:</span>
                        </div>
                        <ol className="mt-1.5 list-decimal pl-4 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                            <li>Hubungi <strong>Operator Sekolah</strong> Anda yang memegang lisensi aktif Tanggapin.</li>
                            <li>Operator akan menerbitkan akun resmi sesuai peran dan rombel binaan Anda.</li>
                            <li>Gunakan email dan kata sandi yang diberikan Operator untuk masuk ke sistem.</li>
                        </ol>
                    </div>
                </div>

                <div className="pt-2">
                    <Link
                        href={login()}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-800"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Kembali ke Halaman Masuk</span>
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
