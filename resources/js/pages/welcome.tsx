import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    GraduationCap,
    HeartPulse,
    Lock,
    PhoneCall,
    ShieldAlert,
    Siren,
    Sparkles,
    UserCheck,
    WalletCards,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>().props;

    return (
        <>
            <Head title="Tanggapin - Deteksi Lebih Cepat. Tindak Lebih Tepat." />
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
                {/* Navbar */}
                <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                <HeartPulse className="size-5" />
                            </div>
                            <div>
                                <span className="font-bold text-lg tracking-tight">Tanggapin</span>
                                <span className="ms-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    School Ops
                                </span>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                                >
                                    Masuk ke Dashboard
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <a
                                        href="/demo-login"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all hover:scale-[1.02]"
                                    >
                                        <Sparkles className="size-3.5" />
                                        Masuk Cepat (Demo Dashboard)
                                    </a>
                                    <Link
                                        href={login()}
                                        className="px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="hidden sm:inline-block px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex-1 flex flex-col justify-center">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <Sparkles className="size-3.5" />
                            Platform Operasional Sekolah Terintegrasi
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                            “Deteksi lebih cepat.{' '}
                            <span className="text-blue-600 dark:text-blue-400">Tindak lebih tepat.”</span>
                        </h1>

                        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Tanggapin menghubungkan absensi, early warning, manajemen kasus siswa, komunikasi orang tua,
                            validasi data, dan respon insiden dalam satu alur kerja sederhana.
                        </p>

                        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="/demo-login"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all hover:scale-105"
                            >
                                Buka Dashboard Flowbite Tanggapin
                                <ArrowRight className="size-4" />
                            </a>
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                            >
                                <Lock className="size-4 text-neutral-500" />
                                Login Akun Sekolah
                            </Link>
                        </div>
                    </div>

                    {/* 10 Module Cards Grid (PRD) */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 w-fit mb-2.5">
                                <AlertTriangle className="size-4" />
                            </div>
                            <h3 className="font-bold text-xs text-neutral-900 dark:text-white">01. Early Warning</h3>
                            <p className="text-[11px] text-neutral-500 mt-1">Deteksi pola penurunan kehadiran & nilai.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 w-fit mb-2.5">
                                <GraduationCap className="size-4" />
                            </div>
                            <h3 className="font-bold text-xs text-neutral-900 dark:text-white">02. Class Monitoring</h3>
                            <p className="text-[11px] text-neutral-500 mt-1">Satu halaman untuk indikator kondisi kelas.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 w-fit mb-2.5">
                                <ShieldAlert className="size-4" />
                            </div>
                            <h3 className="font-bold text-xs text-neutral-900 dark:text-white">03. Case Management</h3>
                            <p className="text-[11px] text-neutral-500 mt-1">Alur penanganan kasus BK & Kesiswaan.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 w-fit mb-2.5">
                                <PhoneCall className="size-4" />
                            </div>
                            <h3 className="font-bold text-xs text-neutral-900 dark:text-white">04. Komunikasi Ortu</h3>
                            <p className="text-[11px] text-neutral-500 mt-1">Pesan terstruktur dengan acknowledgement.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 w-fit mb-2.5">
                                <UserCheck className="size-4" />
                            </div>
                            <h3 className="font-bold text-xs text-neutral-900 dark:text-white">06. Lapangan ATS</h3>
                            <p className="text-[11px] text-neutral-500 mt-1">Verifikasi & intervensi anak tidak sekolah.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 w-fit mb-2.5">
                                <WalletCards className="size-4" />
                            </div>
                            <h3 className="font-bold text-xs text-neutral-900 dark:text-white">07. Pembayaran SPP</h3>
                            <p className="text-[11px] text-neutral-500 mt-1">Rekonsiliasi tagihan & bukti transfer.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 w-fit mb-2.5">
                                <CheckCircle2 className="size-4" />
                            </div>
                            <h3 className="font-bold text-xs text-neutral-900 dark:text-white">09. Cek Dapodik</h3>
                            <p className="text-[11px] text-neutral-500 mt-1">Validasi data anomali sebelum cut-off.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 w-fit mb-2.5">
                                <Siren className="size-4" />
                            </div>
                            <h3 className="font-bold text-xs text-neutral-900 dark:text-white">10. Respons Insiden</h3>
                            <p className="text-[11px] text-neutral-500 mt-1">Workflow darurat & evakuasi sekolah.</p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-500">
                    <p>Tanggapin • Operational Action Layer untuk Sekolah Berkemajuan</p>
                    <p className="text-[11px] mt-1 text-neutral-400">
                        Prinsip: Data → Deteksi → Tindakan → Komunikasi → Dokumentasi → Evaluasi
                    </p>
                </footer>
            </div>
        </>
    );
}
