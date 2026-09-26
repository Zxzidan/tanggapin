import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Database,
    FileSpreadsheet,
    RefreshCw,
    Search,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { DapodikIssue } from '@/types/tanggapin';

interface DapodikProps {
    dapodikIssues?: DapodikIssue[];
}

export default function Dapodik({ dapodikIssues: initialIssues = [] }: DapodikProps) {
    const [issues, setIssues] = useState<DapodikIssue[]>(initialIssues);
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const categories = Array.from(new Set(issues.map((i) => i.category)));

    const filteredIssues = issues.filter((i) => {
        if (filterCategory === 'all') return true;
        return i.category === filterCategory;
    });

    const errorCount = issues.filter((i) => i.severity === 'Error').length;
    const warningCount = issues.filter((i) => i.severity !== 'Error').length;

    const handleResolve = (issue: DapodikIssue) => {
        toast.success(`Membuka menu perbaikan: ${issue.action}`, {
            description: `Target: ${issue.targetName} | Kolom: ${issue.field}`,
        });
    };

    return (
        <FlowbiteTanggapinLayout activeTab="data-check">
            <Head title="Cek Data Dapodik — TANGGAPIN" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Module */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Cek Data Dapodik (Deteksi Anomali Data)
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Membantu operator menemukan inkonsistensi data sebelum administrasi resmi cut-off (data kosong, SK belum terunggah, rombel tanpa pengampu).
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-900 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-orange-500 animate-pulse" />
                            {issues.length} Anomali Terdeteksi
                        </span>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Total Anomali Data</span>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {issues.length}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600">
                            <Database className="size-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Anomali Kritis (Error)</span>
                            <div className="text-2xl font-bold text-red-600 mt-0.5">
                                {errorCount}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-600">
                            <AlertCircle className="size-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Perlu Pemeriksaan / Validasi</span>
                            <div className="text-2xl font-bold text-amber-600 mt-0.5">
                                {warningCount}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
                            <CheckCircle2 className="size-5" />
                        </div>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                        type="button"
                        onClick={() => setFilterCategory('all')}
                        className={cn(
                            'px-3 py-1.5 text-xs rounded-xl font-medium transition-colors shrink-0',
                            filterCategory === 'all'
                                ? 'bg-orange-600 text-white font-semibold shadow-xs'
                                : 'bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        )}
                    >
                        Semua Kategori ({issues.length})
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setFilterCategory(cat)}
                            className={cn(
                                'px-3 py-1.5 text-xs rounded-xl font-medium transition-colors shrink-0',
                                filterCategory === cat
                                    ? 'bg-orange-600 text-white font-semibold shadow-xs'
                                    : 'bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Issue Cards */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                    <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Temuan Anomali & Rekomendasi Sinkronisasi
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Klik tindakan langsung untuk membuka form validasi atau input data perbaikan.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => toast.info('Sinkronisasi pengecekan ulang data Dapodik sedang berjalan...')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                            <RefreshCw className="size-3.5" />
                            <span>Pindai Ulang</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {filteredIssues.map((issue) => {
                            const isError = issue.severity === 'Error';

                            return (
                                <div
                                    key={issue.id}
                                    className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors hover:border-orange-300"
                                >
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={cn(
                                                    'px-2 py-0.5 rounded text-[10px] font-bold border',
                                                    isError
                                                        ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900'
                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                                                )}
                                            >
                                                {issue.severity}
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                {issue.category}
                                            </span>
                                            <span className="text-slate-400">• {issue.targetName}</span>
                                        </div>

                                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                            {issue.description}
                                        </p>

                                        <div className="text-[11px] text-slate-500">
                                            Field Terkait: <span className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-[#070b14] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">{issue.field}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleResolve(issue)}
                                        className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition-colors shrink-0 self-start md:self-center"
                                    >
                                        {issue.action}
                                    </button>
                                </div>
                            );
                        })}

                        {filteredIssues.length === 0 && (
                            <div className="py-8 text-center text-slate-400 text-xs">
                                Tidak ada anomali data pada kategori yang dipilih.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

Dapodik.layout = (page: React.ReactNode) => page;
