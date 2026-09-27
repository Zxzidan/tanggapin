import { Head, Link } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    ClipboardCheck,
    Download,
    Eye,
    FileCheck,
    FileText,
    Filter,
    GraduationCap,
    HelpCircle,
    Layers,
    Lightbulb,
    MessageSquare,
    Play,
    Printer,
    RefreshCw,
    Search,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    Users,
    Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { ClassMonitoringItem, TanggapinStats } from '@/types/tanggapin';

interface TeacherItem {
    id: string;
    name: string;
    email: string;
    role: string;
    className: string;
}

interface TeacherDocItem {
    id: string;
    title: string;
    teacher: string;
    category: string;
    period: string;
    status: string;
    size: string;
}

interface SupervisiAkademikProps {
    documents?: TeacherDocItem[];
    classes?: ClassMonitoringItem[];
    teachers?: TeacherItem[];
    stats?: TanggapinStats;
}

interface AuditResult {
    documentId: string;
    overallScore: number;
    predicate: string;
    strengths: string[];
    improvements: string[];
    curriculumCheck: {
        cpAtpAlignment: number; // 0-100
        differentiation: number;
        formativeAssessment: number;
        p5Integration: number;
    };
    aiRecommendation: string;
}

export default function SupervisiAkademik({
    documents = [],
    classes = [],
    teachers = [],
    stats,
}: SupervisiAkademikProps) {
    const [subTab, setSubTab] = useState<'audit' | 'observasi' | 'pkg'>('audit');
    const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '1');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditResults, setAuditResults] = useState<Record<string, AuditResult>>({
        '1': {
            documentId: '1',
            overallScore: 92,
            predicate: 'Sangat Baik (A)',
            strengths: [
                'Alur Tujuan Pembelajaran (ATP) terstruktur runtut dari tingkat kognitif C2 menuju C4.',
                'Asesmen formatif berkala dengan umpan balik cepat terintegrasi di akhir setiap fase kegiatan.',
                'Mencakup rubrik penilaian proyek kolaboratif berbasis studi kasus industri IT.',
            ],
            improvements: [
                'Perluas variasi diferensiasi produk untuk siswa dengan gaya belajar kinestetik/audio.',
                'Tambahkan glosarium istilah teknis pemrograman untuk mendukung literasi digital.',
            ],
            curriculumCheck: {
                cpAtpAlignment: 96,
                differentiation: 88,
                formativeAssessment: 92,
                p5Integration: 92,
            },
            aiRecommendation:
                'Modul ajar telah memenuhi standar Kurikulum Merdeka secara komprehensif. Direkomendasikan dijadikan contoh best practice modul tingkat MGMP/sekolah.',
        },
    });

    // Classroom Observation Rubric State
    const [selectedTeacherForObs, setSelectedTeacherForObs] = useState<string>(
        teachers[0]?.name || 'Ratna Dewi, S.Pd',
    );
    const [obsClass, setObsClass] = useState<string>('XI RPL 2');
    const [rubricScores, setRubricScores] = useState<Record<string, number>>({
        apersepsi: 4,
        manajemen: 4,
        inkuiri: 3,
        media: 4,
        asesmen: 3,
    });
    const [obsNotes, setObsNotes] = useState(
        'Guru membuka sesi dengan studi kasus nyata pembuatan aplikasi fintech. Interaksi siswa sangat antusias.',
    );
    const [isSavedObs, setIsSavedObs] = useState(false);

    // Filter documents
    const filteredDocs = useMemo(() => {
        return documents.filter((doc) => {
            const matchSearch =
                doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.teacher.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory =
                categoryFilter === 'ALL' || doc.category === categoryFilter;
            return matchSearch && matchCategory;
        });
    }, [documents, searchQuery, categoryFilter]);

    const activeDoc = useMemo(() => {
        return documents.find((d) => d.id === selectedDocId) || documents[0];
    }, [documents, selectedDocId]);

    const activeAudit = activeDoc ? auditResults[activeDoc.id] : null;

    // Run AI Audit on document
    const handleRunAiAudit = (docId: string) => {
        setIsAnalyzing(true);
        toast.info('AI sedang menganalisis dokumen ajar terhadap standar Kurikulum Merdeka...');

        setTimeout(() => {
            setIsAnalyzing(false);
            const randomScore = Math.floor(Math.random() * 8) + 88; // 88 - 95
            const newAudit: AuditResult = {
                documentId: docId,
                overallScore: randomScore,
                predicate: randomScore >= 90 ? 'Sangat Baik (A)' : 'Baik (B)',
                strengths: [
                    'Kesesuaian Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP) valid.',
                    'Dilengkapi rubrik performa tugas mandiri dan asesmen diagnostik non-kognitif.',
                    'Karakter Profil Pelajar Pancasila (Bernalar Kritis & Gotong Royong) terpetakan eksplisit.',
                ],
                improvements: [
                    'Pertajam instrumen asesmen formatif selama proses eksplorasi materi berlangsung.',
                    'Diferensiasi proses dapat ditingkatkan melalui penugasan berjenjang (tiering tasks).',
                ],
                curriculumCheck: {
                    cpAtpAlignment: Math.min(100, randomScore + 4),
                    differentiation: Math.max(78, randomScore - 6),
                    formativeAssessment: randomScore,
                    p5Integration: Math.min(100, randomScore + 2),
                },
                aiRecommendation: `Dokumen ajar siap disahkan oleh Kepala Sekolah dengan predikat ${randomScore >= 90 ? 'Sangat Baik (A)' : 'Baik (B)'}. Siap diterapkan pada pembelajaran semester berjalan.`,
            };

            setAuditResults((prev) => ({
                ...prev,
                [docId]: newAudit,
            }));
            toast.success(`Audit AI selesai! Skor mutu perangkat: ${randomScore}/100.`);
        }, 1200);
    };

    // Calculate observation rubric total
    const totalRubricScore = Object.values(rubricScores).reduce((a, b) => a + b, 0);
    const maxRubricScore = 20; // 5 aspects * 4
    const rubricPercent = Math.round((totalRubricScore / maxRubricScore) * 100);
    const rubricPredicate =
        rubricPercent >= 90
            ? 'Amat Baik'
            : rubricPercent >= 75
              ? 'Baik'
              : rubricPercent >= 60
                ? 'Cukup'
                : 'Perlu Pendampingan';

    const handleSaveObservation = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavedObs(true);
        toast.success(`Hasil supervisi klinis untuk ${selectedTeacherForObs} berhasil disimpan dan dicatat ke rekap PKG.`);
    };

    return (
        <FlowbiteTanggapinLayout activeTab="academic-supervision">
            <Head title="AI Supervisi Akademik & GTK — Tanggapin" />

            <div className="space-y-6 pb-12">
                {/* 1. EXECUTIVE CONTEXT HEADER */}
                <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                <Sparkles className="size-3" />
                                SUPERVISI AKADEMIK & KURIKULUM MERDEKA
                            </span>
                            <span className="text-xs text-slate-500">
                                T.A. 2025/2026 Ganjil • Tanggapin Intelligence
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">•</span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                                <span className="inline-block size-1.5 animate-pulse rounded-full bg-blue-600" />
                                Kepatuhan GTK: 94.2% Lengkap
                            </span>
                        </div>

                        <h1 className="pt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            AI Supervisi Akademik & Kinerja GTK
                        </h1>

                        <p className="max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                            Pusat kendali Kepala Sekolah untuk mengaudit keselarasan Modul Ajar Kurikulum Merdeka, melakukan supervisi observasi kelas klinis, serta merumuskan rekomendasi Penilaian Kinerja Guru (PKG) berbasis AI.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2.5 self-start lg:self-center">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95"
                        >
                            <Printer className="size-4" />
                            <span>Cetak Berita Acara</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                handleRunAiAudit(selectedDocId);
                            }}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Zap className="size-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Scan Audit AI</span>
                        </button>
                    </div>
                </div>

                {/* 2. 4 EXECUTIVE KPI SCORECARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Kelengkapan Perangkat
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <FileCheck className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    94.2%
                                </span>
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                    ↑ +4.1%
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {documents.length} dokumen modul ajar & ATP terunggah
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: '94.2%' }} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Skor Rata-rata Mutu Ajar
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <Award className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    89.4
                                </span>
                                <span className="text-xs font-medium text-slate-500">/ 100</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Predikat Sangat Baik (A) Standar Kemendikbud
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: '89.4%' }} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Diferensiasi & P5
                                </span>
                                <div className="rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    <Layers className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    88.0%
                                </span>
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                    Siap DUDI
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Integrasi projek kebekerjaan SMK terverifikasi
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: '88%' }} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                    Supervisi Observasi
                                </span>
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <ClipboardCheck className="size-4" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    100%
                                </span>
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                    Tepat Waktu
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Seluruh rombel semester ganjil terjadwal
                            </p>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: '100%' }} />
                        </div>
                    </div>
                </div>

                {/* 3. NAVIGATION SUB-TABS */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setSubTab('audit')}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all cursor-pointer sm:text-sm',
                            subTab === 'audit'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        )}
                    >
                        <Sparkles className="size-4" />
                        <span>AI Audit Dokumen & Modul Ajar</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                            {documents.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSubTab('observasi')}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all cursor-pointer sm:text-sm',
                            subTab === 'observasi'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        )}
                    >
                        <ClipboardCheck className="size-4" />
                        <span>Rubrik Observasi Kelas (Supervisi Klinis)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSubTab('pkg')}
                        className={cn(
                            'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all cursor-pointer sm:text-sm',
                            subTab === 'pkg'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        )}
                    >
                        <GraduationCap className="size-4" />
                        <span>Rencana Pengembangan Guru (PKG & PMM)</span>
                    </button>
                </div>

                {/* 4. SUBTAB CONTENT */}
                {subTab === 'audit' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left: Document List */}
                        <div className="space-y-4 lg:col-span-5">
                            <div className="rounded-xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1120]">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Daftar Perangkat Pembelajaran
                                    </h2>
                                    <span className="text-[11px] text-slate-500">
                                        Pilih untuk Audit AI
                                    </span>
                                </div>

                                {/* Filters */}
                                <div className="mt-3 flex flex-col gap-2">
                                    <div className="relative">
                                        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari judul modul atau nama guru..."
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['ALL', 'Perangkat Pembelajaran', 'Alur Tujuan Pembelajaran', 'Modul Projek P5'].map(
                                            (cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setCategoryFilter(cat)}
                                                    className={cn(
                                                        'rounded-md px-2 py-1 text-[10px] font-medium transition-colors cursor-pointer',
                                                        categoryFilter === cat
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                                                    )}
                                                >
                                                    {cat === 'ALL' ? 'Semua Kategori' : cat}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* List */}
                                <div className="mt-4 space-y-2 max-h-[520px] overflow-y-auto pr-1">
                                    {filteredDocs.map((doc) => {
                                        const isSelected = selectedDocId === doc.id;
                                        const hasAudit = Boolean(auditResults[doc.id]);

                                        return (
                                            <div
                                                key={doc.id}
                                                onClick={() => setSelectedDocId(doc.id)}
                                                className={cn(
                                                    'rounded-xl border p-3 transition-all cursor-pointer text-left',
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-50/50 shadow-xs dark:border-blue-600 dark:bg-blue-950/20'
                                                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700',
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="space-y-1">
                                                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            {doc.category}
                                                        </span>
                                                        <h3 className="text-xs font-bold text-slate-900 line-clamp-1 dark:text-white">
                                                            {doc.title}
                                                        </h3>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                            Pengampu: <strong className="font-semibold text-slate-700 dark:text-slate-300">{doc.teacher}</strong>
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-1">
                                                        <span
                                                            className={cn(
                                                                'rounded-full px-2 py-0.5 text-[9px] font-bold',
                                                                doc.status === 'Lengkap'
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                                                                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
                                                            )}
                                                        >
                                                            {doc.status}
                                                        </span>
                                                        {hasAudit ? (
                                                            <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                                                <CheckCircle2 className="size-3" />
                                                                Skor: {auditResults[doc.id].overallScore}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">
                                                                Belum diaudit
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right: AI Audit Detail Card */}
                        <div className="space-y-4 lg:col-span-7">
                            {activeDoc ? (
                                <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                                    {/* Document Header */}
                                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                                    {activeDoc.category}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    Ukuran: {activeDoc.size}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                {activeDoc.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Pendidik: <span className="font-semibold text-slate-900 dark:text-white">{activeDoc.teacher}</span> • Periode: {activeDoc.period}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRunAiAudit(activeDoc.id)}
                                            disabled={isAnalyzing}
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                                        >
                                            {isAnalyzing ? (
                                                <RefreshCw className="size-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="size-4" />
                                            )}
                                            <span>
                                                {activeAudit ? 'Jalankan Audit Ulang AI' : 'Mulai Audit AI Modul'}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Audit Results Presentation */}
                                    {activeAudit ? (
                                        <div className="space-y-5 animate-in fade-in duration-300">
                                            {/* Score Highlights Banner */}
                                            <div className="rounded-xl border border-blue-200/80 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300">
                                                            HASIL DIAGNOSIS AI KURIKULUM MERDEKA
                                                        </span>
                                                        <div className="mt-1 flex items-baseline gap-2">
                                                            <span className="text-3xl font-black text-blue-900 dark:text-blue-100">
                                                                {activeAudit.overallScore}
                                                            </span>
                                                            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                                                                / 100 • Predikat: {activeAudit.predicate}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => toast.success(`Dokumen "${activeDoc.title}" resmi disahkan oleh Kepala Sekolah.`)}
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95"
                                                        >
                                                            <ShieldCheck className="size-3.5" />
                                                            <span>Sahkan Dokumen</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 4 Pillars of Kurikulum Merdeka */}
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                                    Evaluasi 4 Dimensi Kurikulum Merdeka
                                                </h4>
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                                                        <div className="flex items-center justify-between text-xs font-semibold">
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                1. Keselarasan CP & ATP
                                                            </span>
                                                            <span className="text-blue-600 dark:text-blue-400">
                                                                {activeAudit.curriculumCheck.cpAtpAlignment}%
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                            <div
                                                                className="h-full rounded-full bg-blue-600"
                                                                style={{ width: `${activeAudit.curriculumCheck.cpAtpAlignment}%` }}
                                                            />
                                                        </div>
                                                        <p className="mt-1.5 text-[10px] text-slate-500">
                                                            Tujuan pembelajaran runtut & relevan dengan capaian fase.
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                                                        <div className="flex items-center justify-between text-xs font-semibold">
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                2. Pembelajaran Berdiferensiasi
                                                            </span>
                                                            <span className="text-blue-600 dark:text-blue-400">
                                                                {activeAudit.curriculumCheck.differentiation}%
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                            <div
                                                                className="h-full rounded-full bg-blue-600"
                                                                style={{ width: `${activeAudit.curriculumCheck.differentiation}%` }}
                                                            />
                                                        </div>
                                                        <p className="mt-1.5 text-[10px] text-slate-500">
                                                            Mengakomodasi kesiapan, minat & profil belajar siswa.
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                                                        <div className="flex items-center justify-between text-xs font-semibold">
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                3. Asesmen Diagnostik & Formatif
                                                            </span>
                                                            <span className="text-blue-600 dark:text-blue-400">
                                                                {activeAudit.curriculumCheck.formativeAssessment}%
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                            <div
                                                                className="h-full rounded-full bg-blue-600"
                                                                style={{ width: `${activeAudit.curriculumCheck.formativeAssessment}%` }}
                                                            />
                                                        </div>
                                                        <p className="mt-1.5 text-[10px] text-slate-500">
                                                            Instrumen evaluasi formatif jelas dan berorientasi proses.
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                                                        <div className="flex items-center justify-between text-xs font-semibold">
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                4. Integrasi Karakter P5
                                                            </span>
                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                {activeAudit.curriculumCheck.p5Integration}%
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                            <div
                                                                className="h-full rounded-full bg-slate-600 dark:bg-slate-500"
                                                                style={{ width: `${activeAudit.curriculumCheck.p5Integration}%` }}
                                                            />
                                                        </div>
                                                        <p className="mt-1.5 text-[10px] text-slate-500">
                                                            Dimensi gotong royong, bernalar kritis & kebekerjaan kuat.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Strengths & Improvements */}
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                                                    <h5 className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300">
                                                        <CheckCircle2 className="size-4" />
                                                        Kelebihan Teridentifikasi
                                                    </h5>
                                                    <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                                        {activeAudit.strengths.map((str, idx) => (
                                                            <li key={idx} className="flex items-start gap-1.5">
                                                                <span className="mt-1 text-blue-600 font-bold">•</span>
                                                                <span>{str}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                                                    <h5 className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                                        <Lightbulb className="size-4" />
                                                        Saran Penyempurnaan AI
                                                    </h5>
                                                    <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                                        {activeAudit.improvements.map((imp, idx) => (
                                                            <li key={idx} className="flex items-start gap-1.5">
                                                                <span className="mt-1 text-slate-500 font-bold">•</span>
                                                                <span>{imp}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* AI Chief Note */}
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-lg bg-blue-600 p-2 text-white">
                                                        <Sparkles className="size-4" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                                            Catatan Rekomendasi Supervisi Kepala Sekolah
                                                        </h5>
                                                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                                            {activeAudit.aiRecommendation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-700">
                                            <div className="rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                                <Sparkles className="size-6" />
                                            </div>
                                            <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                                                Belum Dilakukan Audit AI
                                            </h4>
                                            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                                                Klik tombol "Mulai Audit AI Modul" di atas untuk memindai dokumen ajar ini secara komprehensif.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-xs text-slate-500">
                                    Pilih dokumen perangkat ajar dari daftar sebelah kiri.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* OBSERVASI KELAS (SUPERVISI KLINIS) */}
                {subTab === 'observasi' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Form Observasi */}
                        <div className="space-y-5 lg:col-span-8">
                            <form
                                onSubmit={handleSaveObservation}
                                className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-5 dark:border-slate-800 dark:bg-[#0b1120]"
                            >
                                <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Instrumen Observasi Pembelajaran Tatap Muka (Supervisi Klinis)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Evaluasi langsung praktik pedagogik guru di ruang kelas sesuai pedoman PKG Kemendikbud.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Nama Guru yang Disupervisi
                                        </label>
                                        <select
                                            value={selectedTeacherForObs}
                                            onChange={(e) => setSelectedTeacherForObs(e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        >
                                            {teachers.map((t) => (
                                                <option key={t.id} value={t.name}>
                                                    {t.name} ({t.className})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Rombongan Belajar (Kelas)
                                        </label>
                                        <select
                                            value={obsClass}
                                            onChange={(e) => setObsClass(e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        >
                                            {classes.map((c) => (
                                                <option key={c.id} value={c.name}>
                                                    {c.name} • {c.totalStudents} Siswa
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 5 Rubric Criteria */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                                        Rubrik Indikator Kinerja Pengajaran (Skala 1 - 4)
                                    </h4>

                                    {[
                                        {
                                            id: 'apersepsi',
                                            title: '1. Pembukaan & Motivasi Belajar',
                                            desc: 'Menyampaikan tujuan pembelajaran secara jelas, mengaitkan dengan materi sebelumnya & memotivasi peserta didik.',
                                        },
                                        {
                                            id: 'manajemen',
                                            title: '2. Pengelolaan Kelas & Iklim Positif',
                                            desc: 'Menciptakan suasana kelas yang interaktif, suportif, inklusif, dan bebas dari intimidasi atau kekerasan.',
                                        },
                                        {
                                            id: 'inkuiri',
                                            title: '3. Pendekatan Pembelajaran Mendalam (Deep Learning / PBL)',
                                            desc: 'Mendorong daya nalar kritis siswa, studi kasus kejuruan/projek nyata, serta diskusi kolaboratif antar siswa.',
                                        },
                                        {
                                            id: 'media',
                                            title: '4. Pemanfaatan Media & Teknologi Pembelajaran (TIK)',
                                            desc: 'Mengintegrasikan perangkat digital, simulasi interaktif, atau platform sekolah secara efektif dan kontekstual.',
                                        },
                                        {
                                            id: 'asesmen',
                                            title: '5. Asesmen Berkelanjutan & Umpan Balik Positif',
                                            desc: 'Melakukan observasi pemahaman siswa di tengah pembelajaran serta memberikan penguatan korektif yang membangun.',
                                        },
                                    ].map((rubric) => (
                                        <div
                                            key={rubric.id}
                                            className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                                        >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="space-y-0.5">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {rubric.title}
                                                    </span>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xl">
                                                        {rubric.desc}
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-1.5 self-start">
                                                    {[1, 2, 3, 4].map((score) => (
                                                        <button
                                                            key={score}
                                                            type="button"
                                                            onClick={() =>
                                                                setRubricScores((prev) => ({
                                                                    ...prev,
                                                                    [rubric.id]: score,
                                                                }))
                                                            }
                                                            className={cn(
                                                                'size-8 rounded-lg text-xs font-bold transition-all cursor-pointer',
                                                                rubricScores[rubric.id] === score
                                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700',
                                                            )}
                                                        >
                                                            {score}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Catatan Pembinaan Langsung Kepala Sekolah
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={obsNotes}
                                        onChange={(e) => setObsNotes(e.target.value)}
                                        placeholder="Berikan apresiasi dan arahan pedagogik spesifik untuk guru yang bersangkutan..."
                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xs text-slate-500">
                                        Skor total akan dikalkulasikan secara otomatis ke rekap PKG.
                                    </span>
                                    <button
                                        type="submit"
                                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
                                    >
                                        <ClipboardCheck className="size-4" />
                                        <span>Simpan Hasil Supervisi Klinis</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Summary Scorecard Column */}
                        <div className="space-y-4 lg:col-span-4">
                            <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-[#0b1120]">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                                    Ringkasan Skor Observasi
                                </h4>

                                <div className="flex flex-col items-center justify-center rounded-xl bg-blue-50/60 p-6 text-center dark:bg-blue-950/30">
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                                        Total Skor Perolehan
                                    </span>
                                    <div className="mt-1 flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">
                                            {totalRubricScore}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-500">/ 20</span>
                                    </div>
                                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                                        <Star className="size-3.5 fill-white" />
                                        <span>{rubricPercent}% • {rubricPredicate}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between border-b border-slate-100 py-1.5 dark:border-slate-800">
                                        <span className="text-slate-500">Target Sekolah:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">≥ 80% (Baik)</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 py-1.5 dark:border-slate-800">
                                        <span className="text-slate-500">Guru Terpilih:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{selectedTeacherForObs}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 py-1.5 dark:border-slate-800">
                                        <span className="text-slate-500">Rombel:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{obsClass}</span>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-200">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <Sparkles className="size-3.5" />
                                        <span>Apresiasi Otomatis AI</span>
                                    </div>
                                    <p className="mt-1 leading-relaxed text-[11px]">
                                        "Pendidik menunjukkan penguasaan pedagogik yang sangat meyakinkan dalam membangun iklim kelas yang inklusif dan memicu rasa ingin tahu siswa."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PKG & PMM RECOMMENDATIONS */}
                {subTab === 'pkg' && (
                    <div className="space-y-5">
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Matriks Pengembangan Keprofesian Berkelanjutan (PKB & PMM)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        AI memetakan kebutuhan pelatihan spesifik berdasarkan temuan supervisi modul dan observasi kelas tatap muka.
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    <Award className="size-3.5" />
                                    Sinkronisasi PMM Terkoneksi
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                                {[
                                    {
                                        teacher: 'Ratna Dewi, S.Pd',
                                        role: 'Wali Kelas XI RPL 2',
                                        currentScore: 94,
                                        focusArea: 'Penguatan Asesmen Diagnostik Awal & Portofolio Digital',
                                        recommendedTraining: 'Pelatihan PMM: Asesmen Diagnostik Kurikulum Merdeka Fase F',
                                        badge: 'Sangat Baik',
                                        color: 'emerald',
                                    },
                                    {
                                        teacher: 'Budi Santoso, S.Kom',
                                        role: 'Wali Kelas X TKJ 1',
                                        currentScore: 89,
                                        focusArea: 'Pembelajaran Berdiferensiasi Produk untuk Kejuruan Komputer',
                                        recommendedTraining: 'Workshop MGMP: Diferensiasi Produk Berbasis Problem Based Learning',
                                        badge: 'Baik',
                                        color: 'blue',
                                    },
                                    {
                                        teacher: 'Dra. Hj. Nurjanah, M.Pd',
                                        role: 'Guru Bimbingan Konseling',
                                        currentScore: 96,
                                        focusArea: 'Konseling Kolaboratif & Penelusuran Minat Karir DUDI',
                                        recommendedTraining: 'PMM: Manajemen Konseling Individual Berbasis Trauma & Solusi',
                                        badge: 'Sangat Baik',
                                        color: 'indigo',
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900/60"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {item.teacher}
                                                </h4>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    {item.role}
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                                                Skor: {item.currentScore}
                                            </span>
                                        </div>

                                        <div className="space-y-1 text-xs">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                Fokus Pembinaan:
                                            </span>
                                            <p className="font-medium text-slate-700 dark:text-slate-300">
                                                {item.focusArea}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-blue-50 p-2.5 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                                            <span className="block text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">
                                                Rekomendasi Modul PMM:
                                            </span>
                                            <p className="mt-0.5 leading-snug font-medium">
                                                {item.recommendedTraining}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toast.success(`Surat penugasan pengembangan kompetensi untuk ${item.teacher} telah diterbitkan.`)}
                                            className="w-full rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 active:scale-95 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                        >
                                            Terbitkan Arahan PMM
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FlowbiteTanggapinLayout>
    );
}
