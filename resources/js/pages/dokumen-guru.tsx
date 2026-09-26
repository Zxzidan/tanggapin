import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Download,
    Eye,
    FileCheck,
    FileText,
    Plus,
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

export default function DokumenGuru({ documents: initialDocuments = [] }: DokumenGuruProps) {
    const [documents] = useState<TeacherDocument[]>(initialDocuments);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = Array.from(new Set(documents.map((d) => d.category)));

    const filteredDocs = documents.filter((doc) => {
        const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
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

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Module */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                                <FileText className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Dokumen Guru & Portofolio Mengajar
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Sentralisasi perangkat pembelajaran guru, SK penugasan, modul ajar, dan sertifikat pengembangan keprofesian berkelanjutan.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => toast.success('Formulir unggah dokumen administrasi guru siap.')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95 self-start sm:self-center shrink-0"
                    >
                        <UploadCloud className="size-4" />
                        <span>Unggah Dokumen Baru</span>
                    </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Total Dokumen Terarsip</span>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {documents.length}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
                            <FileText className="size-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Terverifikasi Kurikulum</span>
                            <div className="text-2xl font-bold text-emerald-600 mt-0.5">
                                {documents.filter((d) => d.status === 'Lengkap' || d.status === 'Terverifikasi').length}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                            <CheckCircle2 className="size-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Kategori Tersedia</span>
                            <div className="text-2xl font-bold text-purple-600 mt-0.5">
                                {categories.length}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600">
                            <FileCheck className="size-5" />
                        </div>
                    </div>
                </div>

                {/* Main Documents Table Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    {/* Controls Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul dokumen, nama guru..."
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-center overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => setCategoryFilter('all')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                    categoryFilter === 'all'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                                        'px-3 py-1 text-xs rounded-lg font-medium transition-colors shrink-0',
                                        categoryFilter === c
                                            ? 'bg-blue-700 text-white font-semibold'
                                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    )}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                            <thead className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase bg-slate-50 dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">Judul Dokumen</th>
                                    <th className="px-4 py-3">Guru / Pengampu</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Periode</th>
                                    <th className="px-4 py-3">Ukuran</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredDocs.length > 0 ? (
                                    filteredDocs.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162238]/60 transition-colors">
                                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="size-4 text-blue-600 shrink-0" />
                                                    <span>{doc.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-800 dark:text-slate-200 font-medium">
                                                {doc.teacher}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                    {doc.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                                                {doc.period}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                                {doc.size}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                    ✓ {doc.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePreview(doc)}
                                                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                        title="Pratinjau Dokumen"
                                                    >
                                                        <Eye className="size-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDownload(doc)}
                                                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
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
