import { Head, router } from '@inertiajs/react';
import {
    Award,
    Check,
    CheckCircle2,
    Download,
    Eye,
    FileCheck,
    FileText,
    HelpCircle,
    Info,
    Layers,
    Lightbulb,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Sparkles,
    UploadCloud,
    X,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { TeacherDocument } from '@/types/tanggapin';

interface DokumenGuruProps {
    documents?: TeacherDocument[];
}

export default function DokumenGuru({
    documents: initialDocuments = [],
}: DokumenGuruProps) {
    const [documents] = useState<TeacherDocument[]>(initialDocuments);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal Upload & Pra-Audit State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [titleInput, setTitleInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('Perangkat Pembelajaran');
    const [periodInput, setPeriodInput] = useState('2025/2026 Ganjil');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [isPreAuditing, setIsPreAuditing] = useState(false);
    const [preAuditResult, setPreAuditResult] = useState<{
        score: number;
        predicate: string;
        cpAtp: boolean;
        differentiation: boolean;
        formative: boolean;
        p5: boolean;
        notes: string;
    } | null>(null);

    // Selected Doc for quick AI Audit preview
    const [activeAuditDoc, setActiveAuditDoc] = useState<TeacherDocument | null>(null);

    const categories = Array.from(new Set(documents.map((d) => d.category)));

    const filteredDocs = documents.filter((doc) => {
        const matchesCategory =
            categoryFilter === 'all' || doc.category === categoryFilter;
        const matchesSearch =
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.teacher.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDownload = (doc: TeacherDocument) => {
        toast.success(`Mengunduh dokumen: ${doc.title} (${doc.size})`);
    };

    const handlePreview = (doc: TeacherDocument) => {
        toast.info(`Membuka pratinjau dokumen: ${doc.title}`);
    };

    const handleRunPreAudit = () => {
        if (!titleInput.trim()) {
            toast.error('Masukkan judul modul terlebih dahulu.');
            return;
        }

        setIsPreAuditing(true);
        toast.info('AI sedang memeriksa kelengkapan struktur Kurikulum Merdeka...');

        setTimeout(() => {
            setIsPreAuditing(false);
            setPreAuditResult({
                score: 93,
                predicate: 'Sangat Baik (A)',
                cpAtp: true,
                differentiation: true,
                formative: true,
                p5: true,
                notes: 'Struktur modul ajar telah memenuhi kriteria Kurikulum Merdeka secara lengkap (CP/ATP, diferensiasi, asesmen formatif, dan karakter P5). Siap diajukan ke Kepala Sekolah.',
            });
            toast.success('Pra-audit AI selesai! Skor kesiapan dokumen: 93/100.');
        }, 1100);
    };

    const handleSubmitDocument = (e: React.FormEvent) => {
        e.preventDefault();
        if (!titleInput.trim()) {
            toast.error('Harap isi judul perangkat pembelajaran.');
            return;
        }

        router.post(
            '/dokumen-guru',
            {
                title: titleInput,
                category: categoryInput,
                period: periodInput,
            },
            {
                onSuccess: () => {
                    setIsUploadModalOpen(false);
                    setTitleInput('');
                    setSelectedFileName('');
                    setPreAuditResult(null);
                    toast.success('Modul ajar berhasil diunggah dan diajukan ke Kepala Sekolah untuk disupervisi.');
                },
                onError: () => {
                    toast.error('Gagal mengunggah dokumen. Silakan periksa kembali input Anda.');
                },
            },
        );
    };

    return (
        <FlowbiteTanggapinLayout activeTab="documents">
            <Head title="Modul Ajar Guru & Perangkat Pembelajaran — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                <Sparkles className="size-3" />
                                PERANGKAT AJAR GURU & WALI KELAS
                            </span>
                            <span className="text-xs text-slate-500">
                                Kurikulum Merdeka T.A. 2025/2026
                            </span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Pusat Modul Ajar & Perangkat Guru (Kurikulum Merdeka)
                        </h1>
                        <p className="max-w-3xl text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Ruang kerja guru dan wali kelas untuk mengunggah Modul Ajar, Alur Tujuan Pembelajaran (ATP), dan Modul Projek P5. Dilengkapi fitur <strong>Pra-Audit AI Mandiri</strong> sebelum dokumen diajukan ke Kepala Sekolah untuk disupervisi.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsUploadModalOpen(true);
                                setPreAuditResult(null);
                            }}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95"
                        >
                            <UploadCloud className="size-4" />
                            <span>Unggah Modul Ajar Baru</span>
                        </button>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Total Dokumen Terarsip
                            </span>
                            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                                {documents.length} Dokumen
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Perangkat semester ganjil aktif
                            </p>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                            <FileText className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Terverifikasi Kepala Sekolah
                            </span>
                            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {
                                    documents.filter(
                                        (d) =>
                                            d.status === 'Lengkap' ||
                                            d.status === 'Terverifikasi',
                                    ).length
                                } Dokumen
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Telah disupervisi & disahkan
                            </p>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <CheckCircle2 className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Menunggu Supervisi
                            </span>
                            <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {
                                    documents.filter(
                                        (d) =>
                                            d.status === 'Menunggu Supervisi' ||
                                            d.status === 'Menunggu Verifikasi',
                                    ).length
                                } Dokumen
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Dalam antrean review pimpinan
                            </p>
                        </div>
                        <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                            <Award className="size-5" />
                        </div>
                    </div>
                </div>

                {/* Main Documents Table Card */}
                <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                    {/* Controls Bar */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                        <div className="relative w-full sm:w-72">
                            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul modul, guru pengampu..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pr-3 pl-9 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 self-start overflow-x-auto sm:self-center">
                            <button
                                type="button"
                                onClick={() => setCategoryFilter('all')}
                                className={cn(
                                    'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                                    categoryFilter === 'all'
                                        ? 'bg-blue-600 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Semua ({documents.length})
                            </button>
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCategoryFilter(c)}
                                    className={cn(
                                        'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                                        categoryFilter === c
                                            ? 'bg-blue-600 font-semibold text-white shadow-2xs'
                                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                    )}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:bg-[#111c30] dark:text-slate-300">
                                <tr>
                                    <th className="px-4 py-3">Judul Modul / Perangkat</th>
                                    <th className="px-4 py-3">Guru Pengampu</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Periode</th>
                                    <th className="px-4 py-3">Ukuran</th>
                                    <th className="px-4 py-3">Status Supervisi</th>
                                    <th className="px-4 py-3 text-center">Aksi & AI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredDocs.length > 0 ? (
                                    filteredDocs.map((doc) => (
                                        <tr
                                            key={doc.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-[#162238]/60"
                                        >
                                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                                    <span>{doc.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 font-medium whitespace-nowrap text-slate-800 dark:text-slate-200">
                                                {doc.teacher}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    {doc.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                                                {doc.period}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-[11px] whitespace-nowrap text-slate-500">
                                                {doc.size}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span
                                                    className={cn(
                                                        'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                                                        doc.status === 'Lengkap' || doc.status === 'Terverifikasi'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
                                                    )}
                                                >
                                                    {doc.status === 'Lengkap' ? '✓ Disahkan Kepala Sekolah' : doc.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveAuditDoc(doc)}
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
                                                        title="Pra-Audit AI Mandiri"
                                                    >
                                                        <Sparkles className="size-3 text-blue-600 dark:text-blue-400" />
                                                        <span>Pra-Audit AI</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePreview(doc)}
                                                        className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                        title="Pratinjau Dokumen"
                                                    >
                                                        <Eye className="size-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDownload(doc)}
                                                        className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                        title="Unduh Berkas"
                                                    >
                                                        <Download className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                                            Tidak ada dokumen perangkat pembelajaran yang cocok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL 1: UNGGAH DOKUMEN & PRA-AUDIT MANDIRI */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
                    <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <UploadCloud className="size-5 text-blue-600" />
                                    <span>Unggah Modul Ajar / Perangkat Baru</span>
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Ajukan perangkat pembelajaran Kurikulum Merdeka ke Kepala Sekolah.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsUploadModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitDocument} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Judul Dokumen / Modul Ajar *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={titleInput}
                                    onChange={(e) => setTitleInput(e.target.value)}
                                    placeholder="Contoh: Modul Ajar Pemrograman Berorientasi Objek Fase F"
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori Perangkat
                                    </label>
                                    <select
                                        value={categoryInput}
                                        onChange={(e) => setCategoryInput(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="Perangkat Pembelajaran">Perangkat Pembelajaran (Modul Ajar)</option>
                                        <option value="Alur Tujuan Pembelajaran">Alur Tujuan Pembelajaran (ATP)</option>
                                        <option value="Modul Projek P5">Modul Projek P5</option>
                                        <option value="Asesmen Formatif & Sumatif">Asesmen Formatif & Sumatif</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Tahun Ajaran / Semester
                                    </label>
                                    <input
                                        type="text"
                                        value={periodInput}
                                        onChange={(e) => setPeriodInput(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* File Upload Box */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Unggah File Perangkat (.pdf / .docx)
                                </label>
                                <div
                                    onClick={() => setSelectedFileName('Modul_Ajar_Terbaru_2025.pdf (2.4 MB)')}
                                    className="mt-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center cursor-pointer hover:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-800/40"
                                >
                                    <UploadCloud className="size-6 text-slate-400" />
                                    <span className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                                        {selectedFileName || 'Klik untuk memilih berkas perangkat pembelajaran'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        Maksimum ukuran 10 MB
                                    </span>
                                </div>
                            </div>

                            {/* Pre-Audit AI Tool */}
                            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-2 dark:border-blue-900/50 dark:bg-blue-950/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                                            Fitur Pra-Audit AI Mandiri Guru
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRunPreAudit}
                                        disabled={isPreAuditing}
                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                                    >
                                        {isPreAuditing ? (
                                            <RefreshCw className="size-3 animate-spin" />
                                        ) : (
                                            <Zap className="size-3" />
                                        )}
                                        <span>Cek Kesiapan AI</span>
                                    </button>
                                </div>

                                {preAuditResult ? (
                                    <div className="mt-2 space-y-2 text-xs">
                                        <div className="flex items-center justify-between border-b border-blue-200/80 pb-1.5 dark:border-blue-900/50">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                Skor Kesiapan Kurikulum Merdeka:
                                            </span>
                                            <span className="font-black text-blue-700 dark:text-blue-300">
                                                {preAuditResult.score}/100 • {preAuditResult.predicate}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                            <span className="flex items-center gap-1 text-emerald-600 font-medium">✓ CP & ATP Selaras</span>
                                            <span className="flex items-center gap-1 text-emerald-600 font-medium">✓ Pembelajaran Berdiferensiasi</span>
                                            <span className="flex items-center gap-1 text-emerald-600 font-medium">✓ Asesmen Formatif Otentik</span>
                                            <span className="flex items-center gap-1 text-emerald-600 font-medium">✓ Dimensi Karakter P5</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                                            {preAuditResult.notes}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Gunakan fitur ini untuk memindai kepatuhan modul Anda terhadap standar Kurikulum Merdeka sebelum diserahkan ke Kepala Sekolah.
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
                                >
                                    <Check className="size-3.5" />
                                    <span>Kirim & Ajukan ke Kepala Sekolah</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: PRATINJAU PRA-AUDIT DOKUMEN TERSIMPAN */}
            {activeAuditDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div>
                                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                    {activeAuditDoc.category}
                                </span>
                                <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                    {activeAuditDoc.title}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Pendidik: {activeAuditDoc.teacher} • {activeAuditDoc.period}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveAuditDoc(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2.5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                                    Status Keselarasan Kurikulum Merdeka
                                </span>
                                <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">
                                    Skor: 92/100
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/80">
                                    <span className="text-[10px] text-slate-400">1. Alur CP & ATP:</span>
                                    <div className="font-bold text-slate-900 dark:text-white">Runtut & Terstruktur (95%)</div>
                                </div>
                                <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/80">
                                    <span className="text-[10px] text-slate-400">2. Diferensiasi:</span>
                                    <div className="font-bold text-slate-900 dark:text-white">Tiering Task Siap (88%)</div>
                                </div>
                                <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/80">
                                    <span className="text-[10px] text-slate-400">3. Asesmen:</span>
                                    <div className="font-bold text-slate-900 dark:text-white">Formatif Terintegrasi (92%)</div>
                                </div>
                                <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/80">
                                    <span className="text-[10px] text-slate-400">4. Karakter P5:</span>
                                    <div className="font-bold text-slate-900 dark:text-white">Bernalar Kritis (92%)</div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 pt-1 leading-relaxed">
                                Dokumen ini dapat diakses langsung oleh Kepala Sekolah di menu <strong>AI Supervisi GTK</strong> untuk pemberian pengesahan dan catatan berita acara resmi.
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setActiveAuditDoc(null)}
                                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
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
