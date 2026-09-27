import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    Award,
    BarChart3,
    BookOpen,
    CheckCircle2,
    Clock,
    DollarSign,
    Download,
    ExternalLink,
    FileSpreadsheet,
    FileText,
    HelpCircle,
    Info,
    Layers,
    Lightbulb,
    Percent,
    PieChart,
    Printer,
    RefreshCw,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { ClassMonitoringItem, IncidentItem, TanggapinStats } from '@/types/tanggapin';

interface EvaluasiSekolahProps {
    stats?: TanggapinStats;
    classes?: ClassMonitoringItem[];
    cases?: any[];
    incidents?: IncidentItem[];
}

interface DimensionIndicator {
    id: string;
    dimensionCode: string;
    title: string;
    score: number;
    delta: number; // positive or negative
    benchmark: string;
    level: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
    description: string;
    subIndicators: {
        name: string;
        value: number;
        status: string;
    }[];
    aiAnalysis: string;
}

export default function EvaluasiSekolah({
    stats,
    classes = [],
    cases = [],
    incidents = [],
}: EvaluasiSekolahProps) {
    const [activeTab, setActiveTab] = useState<'dimensi' | 'rkt' | 'komparasi'>('dimensi');
    const [selectedDimension, setSelectedDimension] = useState<string>('DIM_A');
    const [isDiagnosing, setIsDiagnosing] = useState(false);

    // 5 Dimensi Standar Rapor Pendidikan Kemendikbudristek
    const dimensions: DimensionIndicator[] = [
        {
            id: 'DIM_A',
            dimensionCode: 'Dimensi A',
            title: 'Mutu & Hasil Belajar Peserta Didik',
            score: 83.4,
            delta: 5.2,
            benchmark: 'Standar Nasional: 75.0',
            level: 'Baik',
            description:
                'Mengukur penguasaan literasi, numerasi kejuruan terapan, serta karakter Profil Pelajar Pancasila (P5) peserta didik.',
            subIndicators: [
                { name: 'Kemampuan Literasi Membaca & Digital', value: 86, status: 'Mahir' },
                { name: 'Kemampuan Numerasi Terapan Kejuruan', value: 78, status: 'Cakap' },
                { name: 'Karakter P5 (Bernalar Kritis & Integritas)', value: 86, status: 'Membudaya' },
                { name: 'Kemandirian & Disiplin Belajar', value: 84, status: 'Berkembang' },
            ],
            aiAnalysis:
                'Indikator literasi dan karakter menunjukkan pencapaian tinggi. Area yang memerlukan peningkatan adalah penguatan numerasi kontekstual pada mata pelajaran kejuruan RPL & TKJ.',
        },
        {
            id: 'DIM_D',
            dimensionCode: 'Dimensi D',
            title: 'Kualitas Pembelajaran & Pedagogik',
            score: 87.2,
            delta: 3.8,
            benchmark: 'Standar Nasional: 78.0',
            level: 'Sangat Baik',
            description:
                'Kualitas interaksi di kelas, manajemen suasana belajar yang kondusif, dan penerapan pembelajaran berdiferensiasi.',
            subIndicators: [
                { name: 'Manajemen Kelas & Ketertiban Belajar', value: 92, status: 'Kondusif' },
                { name: 'Dukungan Afektif & Umpan Balik Guru', value: 88, status: 'Aktif' },
                { name: 'Metode Pembelajaran Terbimbing (PBL)', value: 84, status: 'Terarah' },
                { name: 'Pemanfaatan Media Pembelajaran Digital', value: 85, status: 'Optimal' },
            ],
            aiAnalysis:
                'Manajemen kelas sangat solid dengan presensi rata-rata di atas 91%. Disarankan memperluas model project-based learning berbasis order kerja industri riil.',
        },
        {
            id: 'DIM_E',
            dimensionCode: 'Dimensi E',
            title: 'Iklim Keamanan & Inklusivitas Sekolah',
            score: 94.6,
            delta: 4.1,
            benchmark: 'Standar Nasional: 82.0',
            level: 'Sangat Baik',
            description:
                'Kesiapan pencegahan perundungan (bullying), toleransi kebinekaan, kesetaraan gender, dan mitigasi risiko kerawanan.',
            subIndicators: [
                { name: 'Bebas dari Perundungan / Bullying', value: 96, status: 'Sangat Aman' },
                { name: 'Iklim Kebinekaan & Toleransi Beragama', value: 95, status: 'Sangat Rukun' },
                { name: 'Kesiapsiagaan Tanggap Darurat & Insiden', value: 92, status: 'Siaga' },
                { name: 'Layanan Konseling & Mediasi Siswa BK', value: 95, status: 'Responsif' },
            ],
            aiAnalysis:
                'Indikator terbaik sekolah. Sistem Tanggapin berkontribusi nyata dalam mendeteksi dan menyelesaikan 100% rujukan kendala siswa sebelum memuncak menjadi insiden.',
        },
        {
            id: 'DIM_C',
            dimensionCode: 'Dimensi C',
            title: 'Pemanfaatan Sarana & Akuntabilitas Anggaran',
            score: 88.5,
            delta: 2.5,
            benchmark: 'Standar Nasional: 80.0',
            level: 'Sangat Baik',
            description:
                'Efisiensi alokasi dana operasional (BOS & SPP) serta ketersediaan sarana prasarana praktikum bengkel/lab komputer.',
            subIndicators: [
                { name: 'Akuntabilitas Pembukuan Kas (BKU)', value: 94, status: 'Tertib Kas' },
                { name: 'Kelayakan Peralatan Lab Komputer/Bengkel', value: 86, status: 'Memadai' },
                { name: 'Konektivitas Internet & Fasilitas Digital', value: 88, status: 'Stabil' },
                { name: 'Efektivitas Program Bantuan Siswa (PIP/SPP)', value: 86, status: 'Tepat Sasaran' },
            ],
            aiAnalysis:
                'Pengelolaan anggaran teratur dengan sistem rekonsiliasi SPP online. Alokasi RKAS berikutnya dianjurkan memperbarui unit switch jaringan lab TKJ.',
        },
        {
            id: 'DIM_B',
            dimensionCode: 'Dimensi B',
            title: 'Kemitraan DUDI & Keterlibatan Komite Ortu',
            score: 86.8,
            delta: 6.0,
            benchmark: 'Standar Nasional: 76.0',
            level: 'Baik',
            description:
                'Kerjasama dengan Dunia Usaha / Dunia Industri (DUDI), penyerapan lulusan SMK, dan kepuasan orang tua murid.',
            subIndicators: [
                { name: 'Kepuasan Orang Tua terhadap Sekolah', value: 90, status: 'Puas' },
                { name: 'Kemitraan Tempat PKL / Magang Industri', value: 88, status: 'Aktif' },
                { name: 'Penyerapan Kerja Lulusan (Tracer Study)', value: 84, status: 'Tinggi' },
                { name: 'Keterlibatan Praktisi Mengajar Industri', value: 85, status: 'Berkala' },
            ],
            aiAnalysis:
                'Kemitraan DUDI bertumbuh pesat pasca integrasi kurikulum kebekerjaan. Rekomendasi: formalisasikan MOU kelas industri dengan 2 software house baru.',
        },
    ];

    const currentDimension =
        dimensions.find((d) => d.id === selectedDimension) || dimensions[0];

    // Priority Action Programs (RKT - Rencana Kerja Tahunan)
    const priorityPrograms = [
        {
            id: 'PRG-01',
            title: 'Bootcamp Literasi & Numerasi Terapan Kejuruan',
            targetDimension: 'Dimensi A (Mutu Belajar)',
            objective: 'Meningkatkan skor numerasi terapan dari 78 menjadi ≥ 85 pada akhir semester.',
            pic: 'Waka Kurikulum & MGMP Matematika',
            timeline: 'Oktober - November 2025',
            estimatedBudget: 'Rp 14.500.000',
            sourceBudget: 'Dana BOS Kinerja',
            priorityBadge: 'Prioritas Tinggi',
            status: 'Disetujui Kepala Sekolah',
        },
        {
            id: 'PRG-02',
            title: 'Program Duta Siswa Berkarakter & Satgas Ramah Anak',
            targetDimension: 'Dimensi E (Iklim Keamanan)',
            objective: 'Mempertahankan iklim 0% bullying dan membentuk jejaring peer counselor antar siswa.',
            pic: 'Guru BK & Pembina OSIS',
            timeline: 'September - Desember 2025',
            estimatedBudget: 'Rp 6.000.000',
            sourceBudget: 'BOS Reguler',
            priorityBadge: 'Menengah',
            status: 'Sedang Berjalan',
        },
        {
            id: 'PRG-03',
            title: 'Upgrade Infrastruktur Cloud & Perangkat Jaringan Lab',
            targetDimension: 'Dimensi C (Sarpras & TIK)',
            objective: 'Mendukung sertifikasi kompetensi keahlian dan simulasi industri real-time.',
            pic: 'Kepala Program Keahlian TKJ',
            timeline: 'November 2025',
            estimatedBudget: 'Rp 28.000.000',
            sourceBudget: 'RKAS Komite & Sponsor DUDI',
            priorityBadge: 'Prioritas Tinggi',
            status: 'Menunggu Pengesahan',
        },
        {
            id: 'PRG-04',
            title: 'Workshop Guru Magang Industri & Kelas Praktisi DUDI',
            targetDimension: 'Dimensi B (Kemitraan Industri)',
            objective: 'Sinkronisasi kompetensi pengajar RPL dengan stack teknologi industri terkini.',
            pic: 'Waka Hubungan Industri (Hubin)',
            timeline: 'Desember 2025',
            estimatedBudget: 'Rp 12.000.000',
            sourceBudget: 'BOS Kemitraan',
            priorityBadge: 'Prioritas Tinggi',
            status: 'Rencana Kerja',
        },
    ];

    const handleRunDiagnosis = () => {
        setIsDiagnosing(true);
        toast.info('AI sedang mengolah metrik Rapor Pendidikan dan mensintesis rekomendasi program RKT...');

        setTimeout(() => {
            setIsDiagnosing(false);
            toast.success('Diagnosis AI Rapor Mutu selesai! Skor Indeks Sekolah: 89.1 (Kategori: Tuntas & Unggul).');
        }, 1200);
    };

    return (
        <FlowbiteTanggapinLayout activeTab="school-evaluation">
            <Head title="AI Evaluasi & Rapor Mutu Sekolah — Tanggapin" />

            <div className="space-y-6 pb-12">
                {/* 1. EXECUTIVE CONTEXT HEADER */}
                <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                <BarChart3 className="size-3" />
                                RAPOR PENDIDIKAN & EVALUASI MUTU SEKOLAH
                            </span>
                            <span className="text-xs text-slate-500">
                                Standar Kemendikbudristek 2025/2026 • Tanggapin Intelligence
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">•</span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                                <span className="inline-block size-1.5 animate-pulse rounded-full bg-blue-600" />
                                Kategori: Tuntas & Unggul (89.1)
                            </span>
                        </div>

                        <h1 className="pt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            AI Analitik Rapor Mutu & Evaluasi Diri Sekolah
                        </h1>

                        <p className="max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                            Supervisi komprehensif 5 Dimensi Standar Nasional Pendidikan (SNP) Kemendikbudristek. Analisis diagnosis kekuatan sekolah, identifikasi gap indikator, dan rumuskan Rencana Kerja Tahunan (RKT) berbasis rekomendasi cerdas AI.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2.5 self-start lg:self-center">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95"
                        >
                            <Printer className="size-4" />
                            <span>Cetak Rapor Mutu</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleRunDiagnosis}
                            disabled={isDiagnosing}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            {isDiagnosing ? (
                                <RefreshCw className="size-3.5 animate-spin text-blue-600" />
                            ) : (
                                <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                            )}
                            <span>Diagnosis AI</span>
                        </button>
                    </div>
                </div>

                {/* 2. 4 STRATEGIC SUMMARY SCORECARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Indeks Mutu Keseluruhan
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <Award className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    89.1
                                </span>
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                    ↑ +4.3 Delta
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Kategori Tuntas & Unggul (Kemendikbud)
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: '89.1%' }} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Iklim Keamanan & Disiplin
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    <ShieldCheck className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    94.6%
                                </span>
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                    Bebas Bullying
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Skor tertinggi indikator sekolah ramah anak
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-700" style={{ width: '94.6%' }} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Kualitas Pembelajaran
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    <BookOpen className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    87.2%
                                </span>
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                    PBL Aktif
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Diferensiasi ajar & modul ajar tervalidasi
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-700" style={{ width: '87.2%' }} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Program Prioritas RKT
                                </span>
                                <div className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <Target className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    4
                                </span>
                                <span className="text-xs font-semibold text-slate-500">Program Utama</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Terpetakan ke RKAS & BOS Semester Berjalan
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-700" style={{ width: '75%' }} />
                        </div>
                    </div>
                </div>

                {/* 3. NAVIGATION SUB-TABS */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('dimensi')}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all cursor-pointer sm:text-sm',
                            activeTab === 'dimensi'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        )}
                    >
                        <BarChart3 className="size-4" />
                        <span>5 Dimensi Rapor Pendidikan</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('rkt')}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all cursor-pointer sm:text-sm',
                            activeTab === 'rkt'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        )}
                    >
                        <Sparkles className="size-4" />
                        <span>AI Generator Rencana Kerja Tahunan (RKT)</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                            {priorityPrograms.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('komparasi')}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all cursor-pointer sm:text-sm',
                            activeTab === 'komparasi'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        )}
                    >
                        <TrendingUp className="size-4" />
                        <span>Komparasi Multi-Tahun & Benchmark</span>
                    </button>
                </div>

                {/* 4. CONTENT VIEW: 5 DIMENSI RAPOR PENDIDIKAN */}
                {activeTab === 'dimensi' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left List of 5 Dimensions */}
                        <div className="space-y-3 lg:col-span-5">
                            <div className="rounded-xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        5 Dimensi Utama Rapor Mutu
                                    </h3>
                                    <span className="text-[11px] text-slate-500">Pilih Dimensi</span>
                                </div>

                                <div className="mt-3 space-y-2">
                                    {dimensions.map((dim) => {
                                        const isSelected = selectedDimension === dim.id;

                                        return (
                                            <div
                                                key={dim.id}
                                                onClick={() => setSelectedDimension(dim.id)}
                                                className={cn(
                                                    'rounded-xl border p-3.5 transition-all cursor-pointer text-left',
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-50/50 shadow-xs dark:border-blue-600 dark:bg-blue-950/20'
                                                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700',
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            {dim.dimensionCode}
                                                        </span>
                                                        <h4 className="mt-1 text-xs font-bold text-slate-900 line-clamp-1 dark:text-white">
                                                            {dim.title}
                                                        </h4>
                                                    </div>

                                                    <div className="flex flex-col items-end">
                                                        <span className="text-base font-black text-slate-900 dark:text-white">
                                                            {dim.score}
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                                            +{dim.delta}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                                                    <span>Level: <strong className="font-semibold text-slate-700 dark:text-slate-300">{dim.level}</strong></span>
                                                    <span className="text-[10px] text-slate-400">{dim.benchmark}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Detail Card for Selected Dimension */}
                        <div className="space-y-4 lg:col-span-7">
                            <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-5 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                                {currentDimension.dimensionCode}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                Standar Nasional: Terlampaui
                                            </span>
                                        </div>
                                        <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                                            {currentDimension.title}
                                        </h3>
                                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                                            {currentDimension.description}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                Skor Capaian
                                            </span>
                                            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                                {currentDimension.score}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Breakdown of Sub-Indicators */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Rincian Indikator Komponen
                                    </h4>

                                    <div className="space-y-2.5">
                                        {currentDimension.subIndicators.map((sub, idx) => (
                                            <div
                                                key={idx}
                                                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"
                                            >
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {sub.name}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                                            {sub.status}
                                                        </span>
                                                        <span className="font-bold text-slate-900 dark:text-white">
                                                            {sub.value}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600"
                                                        style={{ width: `${sub.value}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Strategic Diagnosis */}
                                <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-2 dark:border-blue-900/50 dark:bg-blue-950/20">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
                                        <h5 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                                            Analisis Cerdas AI & Rekomendasi Manajerial
                                        </h5>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                        {currentDimension.aiAnalysis}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT VIEW: RKT GENERATOR */}
                {activeTab === 'rkt' && (
                    <div className="space-y-5">
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Daftar Program Prioritas Rencana Kerja Tahunan (RKT 2025/2026)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Program intervensi yang disintesis AI berdasarkan area terendah pada Rapor Pendidikan sekolah.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => toast.success('Format RKAS dan RKT berhasil diselaraskan ke sistem penganggaran sekolah.')}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95"
                                >
                                    <FileSpreadsheet className="size-4" />
                                    <span>Sinkronisasi ke RKAS BOS</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {priorityPrograms.map((prg) => (
                                    <div
                                        key={prg.id}
                                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900/60"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-1">
                                                <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                                    {prg.targetDimension}
                                                </span>
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {prg.title}
                                                </h4>
                                            </div>

                                            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                {prg.priorityBadge}
                                            </span>
                                        </div>

                                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                            {prg.objective}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/80 dark:border-slate-800">
                                            <div>
                                                <span className="text-slate-400">Penanggung Jawab:</span>
                                                <div className="font-semibold text-slate-700 dark:text-slate-200">
                                                    {prg.pic}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Alokasi Anggaran:</span>
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    {prg.estimatedBudget}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Jadwal:</span>
                                                <div className="font-medium text-slate-700 dark:text-slate-300">
                                                    {prg.timeline}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Sumber Dana:</span>
                                                <div className="font-medium text-slate-700 dark:text-slate-300">
                                                    {prg.sourceBudget}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-[10px] font-semibold text-slate-500">
                                                Status: {prg.status}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => toast.success(`Program ${prg.title} telah disahkan oleh Kepala Sekolah.`)}
                                                className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-blue-600 border border-slate-200 hover:bg-slate-50 active:scale-95 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-700"
                                            >
                                                Otorisasi Program
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT VIEW: KOMPARASI MULTI-TAHUN */}
                {activeTab === 'komparasi' && (
                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Tren Kenaikan Rapor Mutu Pendidikan (2023 - 2025)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Perbandingan pencapaian mutu tahunan SMK Negeri 1 Harapan terhadap standar target provinsi.
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                    <tr>
                                        <th className="py-3 px-4">Dimensi Penilaian</th>
                                        <th className="py-3 px-4">T.A. 2023/2024</th>
                                        <th className="py-3 px-4">T.A. 2024/2025</th>
                                        <th className="py-3 px-4">T.A. 2025/2026 (Sekarang)</th>
                                        <th className="py-3 px-4">Delta Pertumbuhan</th>
                                        <th className="py-3 px-4">Status Akreditasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {dimensions.map((dim, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                                                {dim.title}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                                {(dim.score - dim.delta - 3.2).toFixed(1)}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                                {(dim.score - dim.delta).toFixed(1)}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                                                {dim.score.toFixed(1)}
                                            </td>
                                            <td className="py-3.5 px-4 font-semibold text-blue-700 dark:text-blue-400">
                                                ↑ +{dim.delta}%
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                    Memenuhi (A)
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </FlowbiteTanggapinLayout>
    );
}
