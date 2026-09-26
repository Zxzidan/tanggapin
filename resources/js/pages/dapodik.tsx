import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Database, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { DapodikIssue } from '@/types/tanggapin';

interface DapodikProps {
    dapodikIssues?: DapodikIssue[];
}

export default function Dapodik({
    dapodikIssues: initialIssues = [],
}: DapodikProps) {
    const [issues] = useState<DapodikIssue[]>(initialIssues);
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

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Cek Data Dapodik — Deteksi Anomali Data
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Membantu operator menemukan inkonsistensi data
                            sebelum administrasi resmi cut-off — data kosong, SK
                            belum terunggah, rombel tanpa pengampu.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                        <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                            <span className="size-2 rounded-full bg-blue-600" />
                            {issues.length} Anomali Terdeteksi
                        </span>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Total Anomali Data
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {issues.length}
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600 dark:bg-slate-800">
                            <Database className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Anomali Kritis — Error
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {errorCount}
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <AlertCircle className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Perlu Pemeriksaan / Validasi
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {warningCount}
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
                            'shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                            filterCategory === 'all'
                                ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-400',
                        )}
                    >
                        Semua Kategori: {issues.length}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setFilterCategory(cat)}
                            className={cn(
                                'shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                                filterCategory === cat
                                    ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-400',
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Issue Cards */}
                <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Temuan Anomali & Rekomendasi Sinkronisasi
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Klik tindakan langsung untuk membuka form
                                validasi atau input data perbaikan.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                toast.info(
                                    'Sinkronisasi pengecekan ulang data Dapodik sedang berjalan...',
                                )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
                                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs transition-colors hover:border-blue-300 md:flex-row md:items-center dark:border-slate-800 dark:bg-[#111c30]"
                                >
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={cn(
                                                    'rounded border px-2 py-0.5 text-[10px] font-bold',
                                                    isError
                                                        ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300'
                                                        : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300',
                                                )}
                                            >
                                                {issue.severity}
                                            </span>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {issue.category}
                                            </span>
                                            <span className="text-slate-400">
                                                • {issue.targetName}
                                            </span>
                                        </div>

                                        <p className="leading-relaxed font-medium text-slate-700 dark:text-slate-300">
                                            {issue.description}
                                        </p>

                                        <div className="text-[11px] text-slate-500">
                                            Field Terkait:{' '}
                                            <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-slate-800 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-200">
                                                {issue.field}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleResolve(issue)}
                                        className="shrink-0 self-start rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 md:self-center"
                                    >
                                        {issue.action}
                                    </button>
                                </div>
                            );
                        })}

                        {filteredIssues.length === 0 && (
                            <div className="py-8 text-center text-xs text-slate-400">
                                Tidak ada anomali data pada kategori yang
                                dipilih.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

Dapodik.layout = (page: React.ReactNode) => page;
