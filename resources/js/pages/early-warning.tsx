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
    const { openFollowupModal, openParentContactModal, openStudent360Modal } = useActionModals();
    const [feedRiskFilter, setFeedRiskFilter] = useState<'all' | 'high' | 'medium'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAlerts = initialPriorityFeed.filter((item) => {
        const matchesFilter = feedRiskFilter === 'all' || item.riskLevel === feedRiskFilter;
        const matchesSearch =
            item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const highRiskCount = initialPriorityFeed.filter((item) => item.riskLevel === 'high').length;
    const mediumRiskCount = initialPriorityFeed.filter((item) => item.riskLevel === 'medium').length;

    return (
        <FlowbiteTanggapinLayout activeTab="early-warning">
            <Head title="Early Warning System — TANGGAPIN" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Module */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                                <AlertTriangle className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Early Warning System
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Mengenali sinyal penurunan kondisi siswa sebelum menjadi masalah besar. Menampilkan indikator obyektif, bukan vonis.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                            {stats?.studentsNeedingAttention ?? initialPriorityFeed.length} Siswa Dalam Pantauan
                        </span>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    {/* Controls Bar: Search & Filter Pills */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama siswa, kelas, sinyal..."
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-center">
                            <span className="text-xs text-slate-400 me-1 hidden md:inline">Filter Risiko:</span>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('all')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-lg font-medium transition-colors',
                                    feedRiskFilter === 'all'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                )}
                            >
                                Semua ({initialPriorityFeed.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('high')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-lg font-medium transition-colors',
                                    feedRiskFilter === 'high'
                                        ? 'bg-red-600 text-white font-semibold'
                                        : 'text-slate-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40'
                                )}
                            >
                                Kritis ({highRiskCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeedRiskFilter('medium')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-lg font-medium transition-colors',
                                    feedRiskFilter === 'medium'
                                        ? 'bg-amber-600 text-white font-semibold'
                                        : 'text-slate-500 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40'
                                )}
                            >
                                Perlu Diperhatikan ({mediumRiskCount})
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                            <thead className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase bg-slate-50 dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">Siswa & Kelas</th>
                                    <th className="px-4 py-3">Pemicu Sinyal</th>
                                    <th className="px-4 py-3">Konteks & Ringkasan</th>
                                    <th className="px-4 py-3">Wali Kelas</th>
                                    <th className="px-4 py-3">Orang Tua</th>
                                    <th className="px-4 py-3 text-center">Tindakan Cepat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredAlerts.length > 0 ? (
                                    filteredAlerts.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162238]/60 transition-colors">
                                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                <div>{item.studentName}</div>
                                                <div className="text-[11px] font-normal text-slate-500">{item.class}</div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span
                                                    className={cn(
                                                        'px-2 py-0.5 rounded text-[10px] font-bold border',
                                                        item.riskLevel === 'high'
                                                            ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900'
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                                                    )}
                                                >
                                                    {item.triggerType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 max-w-xs text-[11px] leading-relaxed">
                                                {item.summary}
                                                <div className="text-[10px] text-slate-400 mt-0.5">
                                                    Terdeteksi {item.timestamp}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] whitespace-nowrap text-slate-600 dark:text-slate-300">
                                                {item.homeroomTeacher}
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] whitespace-nowrap">
                                                <div className="font-medium text-slate-900 dark:text-white">{item.parentName}</div>
                                                <div className="text-slate-400">{item.parentPhone}</div>
                                            </td>
                                            <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openStudent360Modal(item)}
                                                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg border border-blue-200 dark:border-blue-900 transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <Eye className="size-3" />
                                                        <span>Profil 360°</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            openFollowupModal({
                                                                studentId: item.studentId || item.id,
                                                                studentName: `${item.studentName} (${item.class})`,
                                                                studentPhone: item.parentPhone,
                                                                note: `Tindak lanjut pemicu risiko: ${item.summary}`,
                                                            });
                                                        }}
                                                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-2xs inline-flex items-center gap-1"
                                                    >
                                                        <Plus className="size-3" />
                                                        <span>Follow-up</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            openParentContactModal({
                                                                studentId: item.studentId || item.id,
                                                                studentName: `${item.studentName} (${item.class})`,
                                                                studentPhone: item.parentPhone,
                                                                message: `Yth. Bapak/Ibu ${item.parentName}, kami dari sekolah menginformasikan perkembangan ananda ${item.studentName}. ${item.summary}. Mohon berkenan berkoordinasi dengan pihak sekolah.`,
                                                            });
                                                        }}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
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
                                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                            Tidak ada data sinyal risiko yang sesuai filter.
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
