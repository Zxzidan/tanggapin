import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Download,
    Eye,
    FileCheck,
    FileText,
    Search,
    UploadCloud,
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

    return (
        <FlowbiteTanggapinLayout activeTab="documents">
            <Head title="Dokumen Guru — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <FileText className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Dokumen Guru & Portofolio Mengajar
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Sentralisasi perangkat pembelajaran guru, SK
                            penugasan, modul ajar, dan sertifikat pengembangan
                            keprofesian berkelanjutan.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            toast.success(
                                'Formulir unggah dokumen administrasi guru siap.',
                            )
                        }
                        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 active:scale-95 sm:self-center"
                    >
                        <UploadCloud className="size-4" />
                        <span>Unggah Dokumen Baru</span>
                    </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Total Dokumen Terarsip
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {documents.length}
                            </div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950">
                            <FileText className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Terverifikasi Kurikulum
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {
                                    documents.filter(
                                        (d) =>
                                            d.status === 'Lengkap' ||
                                            d.status === 'Terverifikasi',
                                    ).length
                                }
                            </div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            <CheckCircle2 className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Kategori Tersedia
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {categories.length}
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <FileCheck className="size-5" />
                        </div>
                    </div>
                </div>

                {/* Main Documents Table Card */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    {/* Controls Bar */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute top-2.5 left-3 size-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul dokumen, nama guru..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600/30 focus:outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 self-start overflow-x-auto sm:self-center">
                            <button
                                type="button"
                                onClick={() => setCategoryFilter('all')}
                                className={cn(
                                    'shrink-0 rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    categoryFilter === 'all'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Semua: {documents.length}
                            </button>
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCategoryFilter(c)}
                                    className={cn(
                                        'shrink-0 rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                        categoryFilter === c
                                            ? 'bg-blue-700 font-semibold text-white shadow-2xs'
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
                                    <th className="px-4 py-3">Judul Dokumen</th>
                                    <th className="px-4 py-3">
                                        Guru / Pengampu
                                    </th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Periode</th>
                                    <th className="px-4 py-3">Ukuran</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredDocs.length > 0 ? (
                                    filteredDocs.map((doc) => (
                                        <tr
                                            key={doc.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-[#162238]/60"
                                        >
                                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="size-4 shrink-0 text-blue-700 dark:text-blue-400" />
                                                    <span>{doc.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 font-medium whitespace-nowrap text-slate-800 dark:text-slate-200">
                                                {doc.teacher}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
                                                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                    ✓ {doc.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handlePreview(doc)
                                                        }
                                                        className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                                        title="Pratinjau Dokumen"
                                                    >
                                                        <Eye className="size-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDownload(doc)
                                                        }
                                                        className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-slate-800"
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
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-slate-400"
                                        >
                                            Tidak ada dokumen yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

DokumenGuru.layout = (page: React.ReactNode) => page;
