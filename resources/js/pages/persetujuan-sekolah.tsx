import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Award,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock,
    DollarSign,
    ExternalLink,
    Eye,
    FileCheck,
    FileSignature,
    FileSpreadsheet,
    FileText,
    GraduationCap,
    HelpCircle,
    Inbox,
    MessageSquare,
    Printer,
    QrCode,
    RefreshCw,
    Search,
    Send,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    UserCheck,
    Users,
    WalletCards,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
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

interface PersetujuanSekolahProps {
    paymentList?: PaymentItem[];
    cases?: any[];
    students?: StudentInfo[];
    classes?: ClassMonitoringItem[];
    stats?: TanggapinStats;
}

interface DispensationItem {
    id: string;
    studentName: string;
    className: string;
    parentName: string;
    parentPhone: string;
    requestType: 'Potongan 50%' | 'Pembebasan Penuh (100%)' | 'Penundaan Tempo';
    originalAmount: number;
    proposedAmount: number;
    reason: string;
    supportingDoc: string;
    status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';
    date: string;
}

interface CriticalCaseItem {
    id: string;
    code: string;
    studentName: string;
    className: string;
    points: number;
    summary: string;
    referredBy: string;
    recommendedAction: string;
    status: 'Menunggu Disposisi' | 'Disposisi Diterbitkan' | 'Selesai';
    date: string;
}

export default function PersetujuanSekolah({
    paymentList = [],
    cases = [],
    students = [],
    classes = [],
    stats,
}: PersetujuanSekolahProps) {
    const [subTab, setSubTab] = useState<'dispensasi' | 'kasus' | 'rapor'>('dispensasi');

    // Dispensasi Keringanan Biaya State
    const [dispensations, setDispensations] = useState<DispensationItem[]>([
        {
            id: 'DSP-001',
            studentName: 'Brian Aditya',
            className: 'XI RPL 2',
            parentName: 'Suryono',
            parentPhone: '081234567801',
            requestType: 'Potongan 50%',
            originalAmount: 350000,
            proposedAmount: 175000,
            reason: 'Ayah dirawat di RSUD karena kecelakaan kerja, terdaftar dalam DTKS Kemensos.',
            supportingDoc: 'Surat Keterangan Tidak Mampu (SKTM) & Kartu KIP',
            status: 'Menunggu Persetujuan',
            date: '25 Sep 2025',
        },
        {
            id: 'DSP-002',
            studentName: 'Doni Pratama',
            className: 'X TKJ 1',
            parentName: 'Hadi Prayitno',
            parentPhone: '081234567802',
            requestType: 'Penundaan Tempo',
            originalAmount: 500000,
            proposedAmount: 500000,
            reason: 'Penundaan pembayaran uang praktikum lab kejuruan hingga awal bulan depan.',
            supportingDoc: 'Surat Komitmen Wali Murid Bermeterai',
            status: 'Menunggu Persetujuan',
            date: '26 Sep 2025',
        },
        {
            id: 'DSP-003',
            studentName: 'Citra Lestari',
            className: 'XI RPL 2',
            parentName: 'Hartati',
            parentPhone: '081234567803',
            requestType: 'Pembebasan Penuh (100%)',
            originalAmount: 350000,
            proposedAmount: 0,
            reason: 'Siswa yatim piatu berprestasi juara 1 LKS Web Technologies tingkat kota.',
            supportingDoc: 'Sertifikat Juara LKS & Rekomendasi Wali Kelas',
            status: 'Disetujui',
            date: '20 Sep 2025',
        },
    ]);

    // Critical Case Dispositions State
    const [criticalCases, setCriticalCases] = useState<CriticalCaseItem[]>([
        {
            id: 'DISP-KASUS-01',
            code: 'KS-2025-001',
            studentName: 'Ahmad Fauzi',
            className: 'XI RPL 2',
            points: 15,
            summary: 'Ketidakhadiran tanpa keterangan 6 hari & terlambat berulang. Konseling tahap 1 dan 2 telah dilakukan Guru BK.',
            referredBy: 'Dra. Hj. Nurjanah, M.Pd (Guru BK)',
            recommendedAction: 'Penerbitan Surat Panggilan Resmi Kepala Sekolah & Mediasi Khusus Orang Tua',
            status: 'Menunggu Disposisi',
            date: '26 Sep 2025',
        },
        {
            id: 'DISP-KASUS-02',
            code: 'KS-2025-002',
            studentName: 'Eko Wahyudi',
            className: 'X TKJ 1',
            points: 20,
            summary: 'Terindikasi rawan putus sekolah (ATS) karena kendala ekonomi keluarga.',
            referredBy: 'Budi Santoso, S.Kom (Wali Kelas)',
            recommendedAction: 'Disposisi Tim Home Visit & Rekomendasi Bantuan Afirmasi BOS',
            status: 'Disposisi Diterbitkan',
            date: '22 Sep 2025',
        },
    ]);

    // Rapor Certification State
    const [classRaporStatuses, setClassRaporStatuses] = useState<Record<string, { certified: boolean; certifiedAt: string }>>({
        'XI RPL 2': { certified: false, certifiedAt: '' },
        'X TKJ 1': { certified: false, certifiedAt: '' },
    });

    // Approval action for Dispensation
    const handleApproveDispensation = (id: string, approve: boolean) => {
        setDispensations((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        status: approve ? 'Disetujui' : 'Ditolak',
                    };
                }
                return item;
            }),
        );

        if (approve) {
            toast.success(`Permohonan keringanan untuk ${id} berhasil disetujui Kepala Sekolah.`);
        } else {
            toast.info(`Permohonan ${id} ditolak dan diteruskan kembali ke Bendahara.`);
        }
    };

    // Disposition action for Critical Case
    const handleApproveCaseDisposition = (id: string) => {
        setCriticalCases((prev) =>
            prev.map((c) => {
                if (c.id === id) {
                    return {
                        ...c,
                        status: 'Disposisi Diterbitkan',
                    };
                }
                return c;
            }),
        );
        toast.success(`Disposisi resmi Kepala Sekolah diterbitkan! Surat panggilan orang tua siap dicetak.`);
    };

    // Mass Certification for Rapor
    const handleCertifyRapor = (className: string) => {
        setClassRaporStatuses((prev) => ({
            ...prev,
            [className]: {
                certified: true,
                certifiedAt: new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }),
            },
        }));
        toast.success(`Rapor digital ${className} resmi dilegalisasi dan ditandatangani secara digital oleh Kepala Sekolah.`);
    };

    const pendingDispensationsCount = dispensations.filter(
        (d) => d.status === 'Menunggu Persetujuan',
    ).length;

    const pendingCasesCount = criticalCases.filter(
        (c) => c.status === 'Menunggu Disposisi',
    ).length;

    return (
        <FlowbiteTanggapinLayout activeTab="executive-approvals">
            <Head title="Pusat Persetujuan & Disposisi Sekolah — Tanggapin" />

            <div className="space-y-6 pb-12">
                {/* 1. EXECUTIVE CONTEXT HEADER */}
                <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                <ShieldCheck className="size-3" />
                                OTORISASI & DISPOSISI EKSEKUTIF
                            </span>
                            <span className="text-xs text-slate-500">
                                Meja Kerja Kepala Sekolah • Tanggapin Intelligence
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">•</span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                                <span className="inline-block size-1.5 animate-pulse rounded-full bg-blue-600" />
                                {pendingDispensationsCount + pendingCasesCount} Permohonan Butuh Keputusan
                            </span>
                        </div>

                        <h1 className="pt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Pusat Persetujuan & Disposisi Kebijakan
                        </h1>

                        <p className="max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                            Cockpit otorisasi legalitas Kepala Sekolah. Ambil keputusan resmi terkait keringanan biaya SPP, terbitkan disposisi panggilan mediasi kasus kesiswaan, serta tandatangani rapor digital berkekuatan hukum.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2.5 self-start lg:self-center">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95"
                        >
                            <Printer className="size-4" />
                            <span>Cetak Log Disposisi</span>
                        </button>
                    </div>
                </div>

                {/* 2. 4 EXECUTIVE KPI SCORECARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Antrean Menunggu Putusan
                                </span>
                                <div className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <Clock className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {pendingDispensationsCount + pendingCasesCount}
                                </span>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Perlu Tindakan
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {pendingDispensationsCount} keringanan biaya • {pendingCasesCount} kasus
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-700" style={{ width: '60%' }} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Keringanan Disetujui
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    <WalletCards className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Rp 4,2 Jt
                                </span>
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                    Tersalurkan
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Subsidi afirmasi siswa prasejahtera & yatim
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-700" style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Disposisi Kasus Kesiswaan
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <ShieldAlert className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    100%
                                </span>
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                    Tertangani
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Mediasi orang tua & pendampingan tuntas
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Tanda Tangan Digital Rapor
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <FileSignature className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    2 Rombel
                                </span>
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                    Siap Legalisasi
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Rapor naratif AI tersinkronisasi
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: '80%' }} />
                        </div>
                    </div>
                </div>

                {/* 3. NAVIGATION SUB-TABS */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setSubTab('dispensasi')}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all cursor-pointer sm:text-sm',
                            subTab === 'dispensasi'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        )}
                    >
                        <WalletCards className="size-4" />
                        <span>Persetujuan Keringanan Biaya (PIP/SPP)</span>
                        {pendingDispensationsCount > 0 && (
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                {pendingDispensationsCount} Baru
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setSubTab('kasus')}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all cursor-pointer sm:text-sm',
                            subTab === 'kasus'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        )}
                    >
                        <ShieldAlert className="size-4" />
                        <span>Disposisi Kasus & Mediasi Orang Tua</span>
                        {pendingCasesCount > 0 && (
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                {pendingCasesCount} Prioritas
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setSubTab('rapor')}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all cursor-pointer sm:text-sm',
                            subTab === 'rapor'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        )}
                    >
                        <FileSignature className="size-4" />
                        <span>Legalisasi & Tanda Tangan Digital Rapor</span>
                    </button>
                </div>

                {/* 4. SUBTAB CONTENT: DISPENSASI */}
                {subTab === 'dispensasi' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Permohonan Keringanan Biaya & Dispensasi SPP
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Usulan bantuan keuangan yang diajukan oleh Bendahara & Wali Murid yang membutuhkan persetujuan resmi Kepala Sekolah.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {dispensations.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all dark:border-slate-800 dark:bg-slate-900/60"
                                    >
                                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                                        {item.id}
                                                    </span>
                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {item.studentName} ({item.className})
                                                    </h4>
                                                    <span className="text-xs text-slate-400">•</span>
                                                    <span className="text-xs text-slate-500">
                                                        Wali: <strong className="text-slate-700 dark:text-slate-300">{item.parentName}</strong> ({item.parentPhone})
                                                    </span>
                                                </div>

                                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                                    Alasan: {item.reason}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                                                    <span>Dokumen Lampiran: <strong className="text-slate-700 dark:text-slate-300">{item.supportingDoc}</strong></span>
                                                    <span>•</span>
                                                    <span>Tipe Keringanan: <strong className="text-blue-600 dark:text-blue-400">{item.requestType}</strong></span>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-end gap-2">
                                                <div className="text-right">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                        Besaran Usulan
                                                    </span>
                                                    <div className="text-sm font-black text-slate-900 dark:text-white">
                                                        Rp {item.proposedAmount.toLocaleString('id-ID')}{' '}
                                                        <span className="text-[10px] font-normal line-through text-slate-400">
                                                            Rp {item.originalAmount.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {item.status === 'Menunggu Persetujuan' ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApproveDispensation(item.id, true)}
                                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800 active:scale-95"
                                                        >
                                                            <Check className="size-3.5" />
                                                            <span>Setujui</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApproveDispensation(item.id, false)}
                                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                        >
                                                            <X className="size-3.5" />
                                                            <span>Tolak</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        className={cn(
                                                            'rounded-full px-2.5 py-1 text-xs font-bold border',
                                                            item.status === 'Disetujui'
                                                                ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300'
                                                                : 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
                                                        )}
                                                    >
                                                        {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* SUBTAB CONTENT: KASUS & MEDIASI */}
                {subTab === 'kasus' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Eskalasi Kasus Kesiswaan & Disposisi Panggilan Mediasi
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Kasus prioritas tinggi yang memerlukan tindakan otoritas Kepala Sekolah (Surat Peringatan Resmi, Panggilan Orang Tua Pimpinan).
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {criticalCases.map((cas) => (
                                    <div
                                        key={cas.id}
                                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all dark:border-slate-800 dark:bg-slate-900/60"
                                    >
                                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {cas.code}
                                                    </span>
                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {cas.studentName} ({cas.className})
                                                    </h4>
                                                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                                        Poin BK: {cas.points}
                                                    </span>
                                                </div>

                                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                                    {cas.summary}
                                                </p>

                                                <div className="space-y-1 pt-1">
                                                    <div className="text-[11px] text-slate-500">
                                                        Diteruskan oleh: <strong className="text-slate-700 dark:text-slate-300">{cas.referredBy}</strong>
                                                    </div>
                                                    <div className="rounded-lg bg-blue-50 p-2 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 font-medium">
                                                        Rekomendasi Tindakan: {cas.recommendedAction}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-end gap-2">
                                                {cas.status === 'Menunggu Disposisi' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApproveCaseDisposition(cas.id)}
                                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
                                                    >
                                                        <ShieldCheck className="size-3.5" />
                                                        <span>Terbitkan Disposisi</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                            {cas.status}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => window.print()}
                                                            className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                        >
                                                            Cetak Surat Panggilan
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* SUBTAB CONTENT: LEGALISASI RAPOR */}
                {subTab === 'rapor' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Legalisasi & Tanda Tangan Digital Rapor Semester
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Bubuhkan tanda tangan digital bersertifikat QR-Code resmi Kepala Sekolah pada lembar rapor siswa untuk dikirimkan ke orang tua.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {classes.map((cls) => {
                                    const status = classRaporStatuses[cls.name] || {
                                        certified: false,
                                        certifiedAt: '',
                                    };

                                    return (
                                        <div
                                            key={cls.id}
                                            className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/60"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                                        Rombel Belajar
                                                    </span>
                                                    <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                                        {cls.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-500">
                                                        Wali Kelas: {cls.homeroomTeacher} • {cls.totalStudents} Siswa
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-white p-2.5 shadow-xs border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                    <QrCode className="size-6 text-slate-800 dark:text-slate-200" />
                                                </div>
                                            </div>

                                            <div className="rounded-lg bg-white p-3 text-xs space-y-1.5 border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Presensi Rombel:</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">{cls.attendanceRate}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Rapor AI Ter-generate:</span>
                                                    <span className="font-semibold text-blue-700 dark:text-blue-400">100% Siap</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Status Legalisasi:</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {status.certified ? (
                                                            <span className="text-blue-700 dark:text-blue-400">
                                                                Telah Dilegalisasi ({status.certifiedAt})
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-600 dark:text-slate-400">
                                                                Menunggu Otorisasi
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {status.certified ? (
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                                                        <CheckCircle2 className="size-4" />
                                                        Sertifikat Digital Valid
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => toast.success(`Berita acara kelulusan/rapor ${cls.name} diunduh.`)}
                                                        className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                                                    >
                                                        Unduh Rekap Sah
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCertifyRapor(cls.name)}
                                                    className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
                                                >
                                                    <FileSignature className="size-4" />
                                                    <span>Sahkan Rapor Digital {cls.name}</span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FlowbiteTanggapinLayout>
    );
}
