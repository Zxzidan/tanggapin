import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Eye,
    Filter,
    PhoneCall,
    Plus,
    Search,
} from 'lucide-react';
import React, { useState } from 'react';
import { useActionModals } from '@/components/action-modals';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { PriorityAlert, TanggapinStats } from '@/types/tanggapin';

interface EarlyWarningProps {
    stats?: TanggapinStats;
    priorityFeed?: PriorityAlert[];
}

export default function EarlyWarning({
    stats,
    priorityFeed: initialPriorityFeed = [],
}: EarlyWarningProps) {
    const { openFollowupModal, openParentContactModal, openStudent360Modal } =
        useActionModals();
    const [feedRiskFilter, setFeedRiskFilter] = useState<
        'all' | 'high' | 'medium'
    >('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAlerts = initialPriorityFeed.filter((item) => {
        const matchesFilter =
            feedRiskFilter === 'all' || item.riskLevel === feedRiskFilter;
        const matchesSearch =
            item.studentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            item.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const highRiskCount = initialPriorityFeed.filter(
        (item) => item.riskLevel === 'high',
    ).length;
    const mediumRiskCount = initialPriorityFeed.filter(
        (item) => item.riskLevel === 'medium',
    ).length;

    return (
        <FlowbiteTanggapinLayout activeTab="early-warning">
            <Head title="Early Warning System — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                                <AlertTriangle className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Early Warning System
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Mengenali sinyal penurunan kondisi siswa sebelum
                            menjadi masalah besar. Menampilkan indikator
                            obyektif, bukan vonis.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                        <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            <span className="size-2 rounded-full bg-blue-700 dark:bg-blue-400" />
                            {stats?.studentsNeedingAttention ??
                                initialPriorityFeed.length}{' '}
                            Siswa Dalam Pantauan
                        </span>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    {/* Controls Bar: Search & Filter Pills */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute top-2.5 left-3 size-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama siswa, kelas, sinyal..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600/30 focus:outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-center">
                            <span className="me-1 hidden text-xs text-slate-400 md:inline">
                                Filter Risiko:
                            </span>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('all')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'all'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Semua: {initialPriorityFeed.length}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('high')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'high'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Kritis: {highRiskCount}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('medium')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    feedRiskFilter === 'medium'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Perlu Diperhatikan: {mediumRiskCount}
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:bg-[#111c30] dark:text-slate-300">
                                <tr>
                                    <th className="px-4 py-3">Siswa & Kelas</th>
                                    <th className="px-4 py-3">Pemicu Sinyal</th>
                                    <th className="px-4 py-3">
                                        Konteks & Ringkasan
                                    </th>
                                    <th className="px-4 py-3">Wali Kelas</th>
                                    <th className="px-4 py-3">Orang Tua</th>
                                    <th className="px-4 py-3 text-center">
                                        Tindakan Cepat
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredAlerts.length > 0 ? (
                                    filteredAlerts.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-[#162238]/60"
                                        >
                                            <td className="px-4 py-3.5 font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                <div>{item.studentName}</div>
                                                <div className="text-[11px] font-normal text-slate-500">
                                                    {item.class}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span
                                                    className={cn(
                                                        'rounded border px-2 py-0.5 text-[10px] font-bold',
                                                        item.riskLevel === 'high'
                                                            ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                            : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300',
                                                    )}
                                                >
                                                    {item.triggerType}
                                                </span>
                                            </td>
                                            <td className="max-w-xs px-4 py-3.5 text-[11px] leading-relaxed">
                                                {item.summary}
                                                <div className="mt-0.5 text-[10px] text-slate-400">
                                                    Terdeteksi {item.timestamp}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] whitespace-nowrap text-slate-600 dark:text-slate-300">
                                                {item.homeroomTeacher}
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] whitespace-nowrap">
                                                <div className="font-medium text-slate-900 dark:text-white">
                                                    {item.parentName}
                                                </div>
                                                <div className="text-slate-400">
                                                    {item.parentPhone}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openStudent360Modal(
                                                                item,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
                                                    >
                                                        <Eye className="size-3" />
                                                        <span>Profil 360°</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            openFollowupModal({
                                                                studentId:
                                                                    item.studentId ||
                                                                    item.id,
                                                                studentName: `${item.studentName} — ${item.class}`,
                                                                studentPhone:
                                                                    item.parentPhone,
                                                                note: `Tindak lanjut pemicu risiko: ${item.summary}`,
                                                            });
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800"
                                                    >
                                                        <Plus className="size-3" />
                                                        <span>Follow-up</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            openParentContactModal(
                                                                {
                                                                    studentId:
                                                                        item.studentId ||
                                                                        item.id,
                                                                    studentName: `${item.studentName} — ${item.class}`,
                                                                    studentPhone:
                                                                        item.parentPhone,
                                                                    message: `Yth. Bapak/Ibu ${item.parentName}, kami dari sekolah menginformasikan perkembangan ananda ${item.studentName}. ${item.summary}. Mohon berkenan berkoordinasi dengan pihak sekolah.`,
                                                                },
                                                            );
                                                        }}
                                                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                                                        title="Kirim pesan resmi ke orang tua"
                                                    >
                                                        <PhoneCall className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-slate-400"
                                        >
                                            Tidak ada data sinyal risiko yang
                                            sesuai filter.
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

EarlyWarning.layout = (page: React.ReactNode) => page;
