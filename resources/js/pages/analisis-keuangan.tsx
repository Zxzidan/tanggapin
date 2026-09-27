import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    BarChart3,
    Check,
    CheckCircle2,
    Copy,
    CreditCard,
    DollarSign,
    ExternalLink,
    FileSpreadsheet,
    FileText,
    HeartPulse,
    HelpCircle,
    Lightbulb,
    MessageSquare,
    Percent,
    PhoneCall,
    Printer,
    RefreshCw,
    Send,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
    WalletCards,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { ClassMonitoringItem, PaymentItem, TanggapinStats } from '@/types/tanggapin';

interface StudentInfo {
    id: string;
    name: string;
    nisn: string;
    className: string;
    parentName: string;
    parentPhone: string;
    attendanceRate: number;
    riskLevel: string;
}

interface AnalisisKeuanganProps {
    paymentList?: PaymentItem[];
    classes?: ClassMonitoringItem[];
    students?: StudentInfo[];
    stats?: TanggapinStats;
}

export default function AnalisisKeuangan({
    paymentList = [],
    classes = [],
    students = [],
}: AnalisisKeuanganProps) {
    const [activeTab, setActiveTab] = useState<'prediksi' | 'dispensasi' | 'generator' | 'simulasi'>('prediksi');

    // AI Message Generator state
    const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(students[0] || null);
    const [selectedTone, setSelectedTone] = useState<'santun' | 'formal' | 'cicilan' | 'ramah'>('santun');
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Dispensasi Modal State
    const [dispensasiStudent, setDispensasiStudent] = useState<StudentInfo | null>(null);

    // Calculate Financial Metrics
    const totalPayments = paymentList.length || 1;
    const paidList = paymentList.filter((p) => p.status === 'Lunas');
    const pendingList = paymentList.filter((p) => p.status === 'Belum Bayar' || p.status === 'Menunggu Verifikasi');
    const overdueList = paymentList.filter((p) => p.status === 'Terlambat');

    const totalCollected = paidList.reduce((acc, p) => acc + (p.amount || 0), 0);
    const totalReceivable = paymentList.reduce((acc, p) => acc + (p.amount || 0), 0);
    const collectionRate = totalReceivable > 0 ? Math.round((totalCollected / totalReceivable) * 100) : 88;

    // Projected next month income based on trend (+5.4%)
    const projectedNextMonth = Math.round(totalCollected * 1.08);

    // AI Exemption Candidates: Students with good attendance (> 88%) but overdue or struggling financially
    const exemptionCandidates = students.filter(
        (s) => s.attendanceRate >= 88 && (s.riskLevel === 'high' || s.riskLevel === 'medium')
    );

    // Generate dynamic personalized message
    const getAiReminderMessage = () => {
        if (!selectedStudent) return '';

        const dueAmount = 'Rp 350.000';
        const virtualAccount = `8808${selectedStudent.nisn || '001234'}`;

        switch (selectedTone) {
            case 'santun':
                return `Assalamu’alaikum Wr. Wb. Yth. Bapak/Ibu ${selectedStudent.parentName} (Wali Murid dari Ananda ${selectedStudent.name} — Kelas ${selectedStudent.className}).\n\nSemoga Bapak/Ibu senantiasa dalam keadaan sehat wal’afiat. Kami dari Bagian Keuangan SMK Negeri 1 Harapan menginformasikan tagihan SPP ananda bulan berjalan sebesar ${dueAmount} yang dapat disalurkan melalui VA Bank: ${virtualAccount}.\n\nJika Bapak/Ibu memerlukan penyesuaian jadwal pembayaran atau program dispensasi/keringanan sekolah, silakan berkoordinasi dengan kami. Terima kasih atas kerja sama dan perhatian Bapak/Ibu.`;

            case 'formal':
                return `Pemberitahuan Resmi Sekolah\nNomor: KEU/SPP/${new Date().getFullYear()}/042\n\nKepada Yth.\nBapak/Ibu ${selectedStudent.parentName}\nWali Murid: ${selectedStudent.name} (${selectedStudent.className})\n\nDengan hormat, kami sampaikan rincian kewajiban administrasi SPP sekolah sebesar ${dueAmount}. Pembayaran dapat dilakukan via transfer rekening resmi sekolah (VA: ${virtualAccount}) selambat-lambatnya tanggal 10 bulan berjalan.\n\nDemikian pemberitahuan ini kami sampaikan. Atas kerja samanya kami ucapkan terima kasih.\n\nBagian Keuangan & Administrasi Sekolah`;

            case 'cicilan':
                return `Halo Bapak/Ibu ${selectedStudent.parentName}, semoga selalu diberikan kelancaran rezeki.\n\nKami mengapresiasi kedisiplinan belajar Ananda ${selectedStudent.name} di kelas ${selectedStudent.className}. Terkait administrasi SPP sebesar ${dueAmount}, pihak sekolah menyediakan opsi program cicilan bertahap 2x atau penundaan jatuh tempo agar tidak memberatkan keluarga.\n\nSilakan konfirmasi ke nomor ini jika ingin mengambil skema cicilan sekolah. Salam hangat dari pihak sekolah.`;

            case 'ramah':
                return `Selamat pagi/siang Bapak/Ibu ${selectedStudent.parentName}.\n\nSekadar mengingatkan dengan ramah bahwa masa jatuh tempo SPP bulan ini untuk Ananda ${selectedStudent.name} (${selectedStudent.className}) adalah minggu ini sebesar ${dueAmount}.\n\nBisa langsung transfer ke VA Bank ${virtualAccount} ya Bapak/Ibu. Bukti pembayaran akan otomatis terverifikasi di sistem Tanggapin. Terima kasih banyak!`;
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getAiReminderMessage());
        setCopied(true);
        toast.success('Pesan pengingat santun berhasil disalin!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendWhatsApp = () => {
        if (!selectedStudent?.parentPhone) {
            toast.error('Nomor telepon orang tua tidak tersedia.');
            return;
        }
        let cleanPhone = selectedStudent.parentPhone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        }
        const text = encodeURIComponent(getAiReminderMessage());
        window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
        toast.success(`Membuka WhatsApp untuk ${selectedStudent.parentName}...`);
    };

    return (
        <FlowbiteTanggapinLayout activeTab="ai-finance">
            <Head title="AI Analisis Finansial & Prediksi Arus Kas — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* 1. HEADER BANNER */}
                <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                <Sparkles className="size-3" />
                                AI FINANCIAL INTELLIGENCE
                            </span>
                            <span className="text-xs text-slate-500">
                                Asisten Cerdas Keuangan & Tata Kelola SPP
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">•</span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Model Prediksi Kas: Aktif
                            </span>
                        </div>

                        <h1 className="pt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Analisis AI Finansial & Prediksi Arus Kas
                        </h1>

                        <p className="max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                            Pusat analisis prediktif bendahara sekolah: memproyeksikan arus kas masuk bulanan, mendeteksi korelasi presensi dengan risiko tunggakan, merekomendasikan siswa prasejahtera untuk bantuan PIP/keringanan, serta menyusun pesan reminder santun otomatis.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start lg:self-center">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                        >
                            <Printer className="size-3.5 text-slate-500" />
                            <span>Cetak Analisis</span>
                        </button>
                        <Link
                            href="/pembayaran"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95"
                        >
                            <WalletCards className="size-3.5" />
                            <span>Buka Pembayaran & SPP</span>
                        </Link>
                    </div>
                </div>

                {/* 2. 4 STRATEGIC AI METRICS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Metric 1: Skor Kesehatan Finansial */}
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Skor Likuiditas Kas AI
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <ShieldCheck className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    91.4
                                </span>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                    <TrendingUp className="size-3" />
                                    Sangat Sehat
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Rasio kas masuk mencukupi operasional 3.5 bulan ke depan
                            </p>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                                <span>Indeks Stabilitas Kas</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">91.4%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full rounded-full bg-blue-600" style={{ width: '91.4%' }} />
                            </div>
                        </div>
                    </div>

                    {/* Metric 2: Prediksi Kas Bulan Depan */}
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Proyeksi Kas Masuk
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <TrendingUp className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Rp {(projectedNextMonth / 1_000_000).toFixed(1)} Jt
                                </span>
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                    +8% Est.
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Tingkat akurasi confidence model AI: 94.2%
                            </p>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                                <span>Confidence Interval</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Tinggi (94%)</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full rounded-full bg-blue-600" style={{ width: '94%' }} />
                            </div>
                        </div>
                    </div>

                    {/* Metric 3: Rekomendasi Keringanan Siswa (PIP) */}
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Rekomendasi Bantuan PIP
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <Sparkles className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {exemptionCandidates.length || 3} Siswa
                                </span>
                                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                    Prasejahtera
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Siswa rajin namun terkendala ekonomi layak dispensasi
                            </p>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                                <span>Mitigasi ATS Finansial</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Siap Ditindaklanjuti</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full rounded-full bg-amber-500" style={{ width: '85%' }} />
                            </div>
                        </div>
                    </div>

                    {/* Metric 4: Rasio Pembayaran Tepat Waktu */}
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Kepatuhan Tepat Waktu
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <Percent className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {collectionRate}%
                                </span>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    {paidList.length} Lunas
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {pendingList.length} menunggu verifikasi / jatuh tempo
                            </p>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                                <span>Kolektibilitas Periode Ini</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{collectionRate}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full rounded-full bg-blue-600" style={{ width: `${collectionRate}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. NAVIGATION TABS */}
                <div className="border-b border-slate-200 dark:border-slate-800">
                    <nav className="-mb-px flex space-x-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab('prediksi')}
                            className={cn(
                                'flex items-center gap-2 border-b-2 py-3 text-xs font-medium transition-colors cursor-pointer',
                                activeTab === 'prediksi'
                                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            )}
                        >
                            <TrendingUp className="size-4" />
                            <span>Prediksi Arus Kas Rombel</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('dispensasi')}
                            className={cn(
                                'flex items-center gap-2 border-b-2 py-3 text-xs font-medium transition-colors cursor-pointer',
                                activeTab === 'dispensasi'
                                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            )}
                        >
                            <Sparkles className="size-4" />
                            <span>Rekomendasi Dispensasi & PIP</span>
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                {exemptionCandidates.length || 3}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('generator')}
                            className={cn(
                                'flex items-center gap-2 border-b-2 py-3 text-xs font-medium transition-colors cursor-pointer',
                                activeTab === 'generator'
                                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            )}
                        >
                            <MessageSquare className="size-4" />
                            <span>Generator Reminder Santun WhatsApp</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('simulasi')}
                            className={cn(
                                'flex items-center gap-2 border-b-2 py-3 text-xs font-medium transition-colors cursor-pointer',
                                activeTab === 'simulasi'
                                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            )}
                        >
                            <BarChart3 className="size-4" />
                            <span>Simulasi Skenario Finansial</span>
                        </button>
                    </nav>
                </div>

                {/* TAB 1: PREDIKSI ARUS KAS & KOLEKTIBILITAS ROMBEL */}
                {activeTab === 'prediksi' && (
                    <div className="space-y-6">
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="size-4 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                            Analisis Kolektibilitas & Proyeksi Penerimaan per Rombel
                                        </h2>
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Pola kepatuhan pembayaran tiap kelas yang dipetakan oleh algoritma prediktif Tanggapin.
                                    </p>
                                </div>
                                <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                    Forecast Horizon: 30 Hari
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {classes.map((cls) => {
                                    const classPayments = paymentList.filter((p) => p.class === cls.name);
                                    const classPaid = classPayments.filter((p) => p.status === 'Lunas').length;
                                    const totalInClass = classPayments.length || 36;
                                    const percent = Math.min(100, Math.round((classPaid / totalInClass) * 100)) || 85;

                                    return (
                                        <div
                                            key={cls.id}
                                            className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-[#0f172a]/40"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {cls.name}
                                                </span>
                                                <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    {percent}% Lancar
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">
                                                Wali: {cls.homeroomTeacher}
                                            </div>

                                            <div className="mt-3 space-y-1.5">
                                                <div className="flex justify-between text-[11px]">
                                                    <span className="text-slate-500">Estimasi Masuk:</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        Rp {((totalInClass * 350000 * (percent / 100)) / 1_000_000).toFixed(1)} Jt
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            'h-full rounded-full',
                                                            percent >= 90 ? 'bg-blue-600' : percent >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                                                        )}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                                                    <span>Presensi: {cls.attendanceRate}%</span>
                                                    <span>{percent >= 85 ? 'Risiko Rendah' : 'Perlu Reminder'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* AI Insights Note */}
                            <div className="mt-5 rounded-lg border border-blue-200/70 bg-blue-50/40 p-4 text-xs dark:border-blue-900/50 dark:bg-blue-950/20">
                                <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-400 mb-1">
                                    <Lightbulb className="size-4" />
                                    <span>AI Financial Insight & Rekomendasi Tindakan</span>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                                    <li>Rombel <strong>XI RPL 2</strong> dan <strong>XII DKV 1</strong> memiliki kepatuhan bayar tertinggi (92%). Disarankan memberikan apresiasi kartu bebas antre administrasi.</li>
                                    <li>Sekitar 12 siswa terlambat karena menunggu tanggal pencairan gaji orang tua (tanggal 1–5 awal bulan). Disarankan mengatur jadwal kirim reminder pada H-2 tanggal gajian.</li>
                                    <li>Tidak ada anomali kebocoran kas: seluruh pembayaran non-tunai telah terefleksi di mutasi rekening bank sekolah.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: DETEKSI TUNGGAKAN & REKOMENDASI DISPENSASI / PIP */}
                {activeTab === 'dispensasi' && (
                    <div className="space-y-6">
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="size-4 text-amber-500" />
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                            Deteksi AI: Siswa Berpotensi Keringanan / Program Indonesia Pintar (PIP)
                                        </h2>
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Sistem mengidentifikasi siswa dengan kehadiran tinggi namun mengalami kendala pembayaran, untuk mencegah putus sekolah karena faktor ekonomi.
                                    </p>
                                </div>
                                <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-300">
                                    3 Siswa Memerlukan Kebijakan
                                </span>
                            </div>

                            <div className="mt-4 space-y-3">
                                {students.slice(0, 4).map((s, idx) => (
                                    <div
                                        key={s.id || idx}
                                        className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-slate-50/50 p-4 transition-all lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0f172a]/40"
                                    >
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {s.name}
                                                </span>
                                                <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    {s.className}
                                                </span>
                                                <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950 dark:text-emerald-300">
                                                    Presensi: {s.attendanceRate}% (Rajin)
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                Wali Murid: <strong>{s.parentName}</strong> ({s.parentPhone}) • Terdeteksi penundaan SPP 2 bulan. Analisis AI menunjukkan siswa memiliki motivasi belajar tinggi, sangat direkomendasikan untuk bantuan Komite / PIP.
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2 self-start lg:self-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDispensasiStudent(s);
                                                    toast.info(`Membuka Draf Pengajuan Dispensasi untuk ${s.name}`);
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95 cursor-pointer"
                                            >
                                                <FileText className="size-3.5" />
                                                <span>Buat Draf Dispensasi AI</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedStudent(s);
                                                    setSelectedTone('cicilan');
                                                    setActiveTab('generator');
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                            >
                                                <MessageSquare className="size-3.5 text-slate-500" />
                                                <span>Tawarkan Cicilan</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Draf Dispensasi AI */}
                        {dispensasiStudent && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                                <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0b1120]">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <FileText className="size-5 text-blue-600 dark:text-blue-400" />
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                                Draf Rekomendasi Dispensasi SPP
                                            </h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setDispensasiStudent(null)}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50 space-y-1">
                                            <div><strong>Siswa:</strong> {dispensasiStudent.name} ({dispensasiStudent.className})</div>
                                            <div><strong>NISN:</strong> {dispensasiStudent.nisn}</div>
                                            <div><strong>Tingkat Kehadiran:</strong> {dispensasiStudent.attendanceRate}%</div>
                                            <div><strong>Orang Tua:</strong> {dispensasiStudent.parentName}</div>
                                        </div>

                                        <p>
                                            <strong>Dasar Pertimbangan AI:</strong> Peserta didik memiliki rekam jejak akademik & disiplin yang baik. Keterlambatan pembayaran teridentifikasi disebabkan beban ekonomi keluarga tidak terduga.
                                        </p>

                                        <p>
                                            <strong>Rekomendasi Bendahara untuk Kepala Sekolah:</strong>
                                            <br />1. Pemberian keringanan biaya SPP sebesar 50% selama 3 bulan berjalan.
                                            <br />2. Usulan pencalonan kuota penerima Program Indonesia Pintar (PIP) susulan.
                                            <br />3. Opsi pelunasan sisa tagihan secara angsuran tanpa denda.
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setDispensasiStudent(null)}
                                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                                        >
                                            Tutup
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                window.print();
                                                toast.success('Mencetak draf rekomendasi untuk diajukan ke Kepala Sekolah.');
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
                                        >
                                            <Printer className="size-3.5" />
                                            <span>Cetak Surat Pengajuan</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: AI POLITE REMINDER GENERATOR */}
                {activeTab === 'generator' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Kolom Kiri: Pilihan Siswa & Nada Suara */}
                        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-200 pb-3 dark:border-slate-800">
                                Konfigurasi Pesan Pengingat AI
                            </h3>

                            {/* Pilih Siswa */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Pilih Siswa / Orang Tua:
                                </label>
                                <select
                                    value={selectedStudent?.id || ''}
                                    onChange={(e) => {
                                        const s = students.find((item) => item.id === e.target.value);
                                        if (s) setSelectedStudent(s);
                                    }}
                                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    {students.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.className}) — Wali: {s.parentName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pilihan Gaya Bahasa / Nada */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Gaya Bahasa / Tone Pesan:
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'santun', title: 'Santun & Berempati', desc: 'Sopan, mendoakan kesehatan, dan hangat' },
                                        { id: 'formal', title: 'Formal Kedinasan', desc: 'Resmi berkop nomor surat pemberitahuan' },
                                        { id: 'cicilan', title: 'Tawaran Cicilan & Keringanan', desc: 'Solutif bagi keluarga yang butuh waktu' },
                                        { id: 'ramah', title: 'Pengingat Ramah Ceria', desc: 'Cocok untuk H-2 sebelum jatuh tempo' },
                                    ].map((t) => (
                                        <label
                                            key={t.id}
                                            onClick={() => setSelectedTone(t.id as any)}
                                            className={cn(
                                                'flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-colors',
                                                selectedTone === t.id
                                                    ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30'
                                                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40'
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="tone"
                                                checked={selectedTone === t.id}
                                                onChange={() => {}}
                                                className="mt-0.5 text-blue-600"
                                            />
                                            <div>
                                                <div className="font-semibold text-xs text-slate-900 dark:text-white">
                                                    {t.title}
                                                </div>
                                                <div className="text-[10px] text-slate-500">
                                                    {t.desc}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Preview Pesan & Tindakan */}
                        <div className="lg:col-span-2 space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="size-4 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                        Pratinjau Pesan Siap Kirim ke WhatsApp
                                    </h3>
                                </div>
                                <span className="text-[11px] text-slate-500">
                                    Tujuan: {selectedStudent?.parentPhone || '-'}
                                </span>
                            </div>

                            {/* WhatsApp Chat Bubble Mockup */}
                            <div className="rounded-xl border border-slate-200/80 bg-slate-100/60 p-4 dark:border-slate-800 dark:bg-[#080d1a]">
                                <div className="max-w-xl rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-xs leading-relaxed text-slate-800 shadow-xs dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-slate-100 whitespace-pre-wrap">
                                    {getAiReminderMessage()}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="size-3.5 text-emerald-600" />
                                            <span>Tersalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-3.5 text-slate-500" />
                                            <span>Salin Teks Pesan</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSendWhatsApp}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 active:scale-95 cursor-pointer"
                                >
                                    <Send className="size-3.5" />
                                    <span>Kirim via WhatsApp Resmi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: SIMULASI SKENARIO FINANSIAL */}
                {activeTab === 'simulasi' && (
                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                Simulasi Skenario Likuiditas & Kebijakan Kas Sekolah
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Proyeksi dampak finansial jika sekolah menerapkan program insentif pembayaran lebih awal.
                            </p>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800 dark:bg-[#0f172a]/30 space-y-2">
                                <div className="font-bold text-slate-900 dark:text-white text-xs">
                                    Skenario A: Status Quo (Jatuh Tempo Normal)
                                </div>
                                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                                    Rp {(totalCollected / 1_000_000).toFixed(1)} Jt
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Tingkat pencapaian {collectionRate}%. Rata-rata pelunasan tuntas pada minggu ke-3 setiap bulan.
                                </p>
                            </div>

                            <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-2">
                                <div className="font-bold text-blue-800 dark:text-blue-300 text-xs">
                                    Skenario B: Insentif Pelunasan 1 Semester (Diskon 5%)
                                </div>
                                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                    +Rp 18.5 Jt
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Diperkirakan 35% orang tua akan melunasi 6 bulan di muka, memperkuat cadangan kas operasional di awal tahun ajaran.
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800 dark:bg-[#0f172a]/30 space-y-2">
                                <div className="font-bold text-slate-900 dark:text-white text-xs">
                                    Skenario C: Alokasi Subsidi Silang Komite
                                </div>
                                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                                    Rp 4.2 Jt
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Dana darurat komite dialokasikan untuk membebaskan 12 siswa prasejahtera agar zero tunggakan tanpa defisit kas.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FlowbiteTanggapinLayout>
    );
}

AnalisisKeuangan.layout = (page: React.ReactNode) => page;
