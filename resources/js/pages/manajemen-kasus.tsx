import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    FileText,
    Plus,
    Shield,
    ShieldAlert,
    UserCheck,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useActionModals } from '@/components/action-modals';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { CaseItem, TanggapinStats } from '@/types/tanggapin';

interface ManajemenKasusProps {
    cases?: CaseItem[];
    stats?: TanggapinStats;
}

export default function ManajemenKasus({
    cases: initialCases = [],
    stats: initialStats,
}: ManajemenKasusProps) {
    const [cases, setCases] = useState<CaseItem[]>(initialCases);
    const { openNewCaseModal } = useActionModals();

    const handleAssignToBk = (c: CaseItem) => {
        setCases((prev) =>
            prev.map((item) =>
                item.id === c.id
                    ? { ...item, stage: 'assigned', stageLabel: 'Ditugaskan ke BK' }
                    : item
            )
        );
        toast.success(`Kasus ${c.code} berhasil ditugaskan ke Guru BK!`);
    };

    const handleStartCounseling = (c: CaseItem) => {
        setCases((prev) =>
            prev.map((item) =>
                item.id === c.id
                    ? { ...item, stage: 'in_progress', stageLabel: 'Sedang Ditangani' }
                    : item
            )
        );
        toast.success(`Kasus ${c.code} masuk ke sesi konseling & penanganan.`);
    };

    const handleResolveCase = (c: CaseItem) => {
        setCases((prev) =>
            prev.map((item) =>
                item.id === c.id
                    ? { ...item, stage: 'resolved', stageLabel: 'Selesai & Terdokumentasi' }
                    : item
            )
        );
        toast.success(`Kasus ${c.code} telah diselesaikan dan tersimpan di arsip digital!`);
    };

    return (
        <FlowbiteTanggapinLayout activeTab="cases">
            <Head title="Manajemen Kasus BK — TANGGAPIN" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Module */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                                <ShieldAlert className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Manajemen Kasus BK & Kesiswaan
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Mengubah koordinasi kasus dari percakapan informal menjadi workflow terstruktur: Baru Masuk → Ditugaskan → Konseling → Tuntas & Arsip.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => openNewCaseModal()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95 self-start sm:self-center shrink-0"
                    >
                        <Plus className="size-4" />
                        <span>Daftarkan Kasus Baru</span>
                    </button>
                </div>

                {/* Kanban Board Columns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    {/* Column 1: Baru Masuk */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-600" />
                                1. Baru Masuk
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                                {cases.filter((c) => c.stage === 'new').length}
                            </span>
                        </div>

                        <div className="space-y-2.5 flex-1 overflow-y-auto">
                            {cases
                                .filter((c) => c.stage === 'new')
                                .map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs hover:border-blue-300 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-xs">{c.studentName}</div>
                                                <span className="text-[10px] text-slate-400 font-mono">{c.code} • {c.class}</span>
                                            </div>
                                            <span
                                                className={cn(
                                                    'text-[10px] font-bold px-1.5 py-0.5 rounded',
                                                    c.priority === 'Tinggi'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                                )}
                                            >
                                                {c.priority}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal bg-white dark:bg-[#070b14] p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                            {c.lastActivity}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleAssignToBk(c)}
                                            className="w-full text-center py-1.5 text-[11px] bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-900"
                                        >
                                            Tugaskan ke BK →
                                        </button>
                                    </div>
                                ))}

                            {cases.filter((c) => c.stage === 'new').length === 0 && (
                                <div className="py-8 text-center text-slate-400 text-xs">
                                    Tidak ada kasus baru menunggu.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Ditugaskan */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-amber-500" />
                                2. Ditugaskan
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                                {cases.filter((c) => c.stage === 'assigned').length}
                            </span>
                        </div>

                        <div className="space-y-2.5 flex-1 overflow-y-auto">
                            {cases
                                .filter((c) => c.stage === 'assigned')
                                .map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs hover:border-amber-300 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-xs">{c.studentName}</div>
                                                <span className="text-[10px] text-slate-400 font-mono">{c.code} • {c.class}</span>
                                            </div>
                                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-900">
                                                {c.category}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal bg-white dark:bg-[#070b14] p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                            {c.lastActivity}
                                        </p>
                                        <div className="text-[10px] text-slate-500">
                                            PIC: <strong className="text-slate-700 dark:text-slate-300">{c.assignee}</strong>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleStartCounseling(c)}
                                            className="w-full text-center py-1.5 text-[11px] bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-semibold rounded-lg hover:bg-amber-100 transition-colors border border-amber-200 dark:border-amber-900"
                                        >
                                            Mulai Sesi Konseling →
                                        </button>
                                    </div>
                                ))}

                            {cases.filter((c) => c.stage === 'assigned').length === 0 && (
                                <div className="py-8 text-center text-slate-400 text-xs">
                                    Tidak ada kasus dalam penugasan.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Sedang Ditangani */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-purple-600" />
                                3. Sedang Ditangani
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                                {cases.filter((c) => c.stage === 'in_progress').length}
                            </span>
                        </div>

                        <div className="space-y-2.5 flex-1 overflow-y-auto">
                            {cases
                                .filter((c) => c.stage === 'in_progress')
                                .map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs hover:border-purple-300 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-xs">{c.studentName}</div>
                                                <span className="text-[10px] text-slate-400 font-mono">{c.code} • {c.class}</span>
                                            </div>
                                            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950 rounded border border-purple-200 dark:border-purple-900">
                                                Konseling Aktif
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal bg-white dark:bg-[#070b14] p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                            {c.lastActivity}
                                        </p>
                                        <div className="text-[10px] text-slate-500">
                                            Konselor: <strong className="text-slate-700 dark:text-slate-300">{c.assignee}</strong>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleResolveCase(c)}
                                            className="w-full text-center py-1.5 text-[11px] bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200 dark:border-emerald-900"
                                        >
                                            Selesaikan & Arsipkan ✓
                                        </button>
                                    </div>
                                ))}

                            {cases.filter((c) => c.stage === 'in_progress').length === 0 && (
                                <div className="py-8 text-center text-slate-400 text-xs">
                                    Tidak ada kasus dalam sesi aktif.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 4: Selesai & Arsip */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-emerald-600" />
                                4. Selesai (Arsip Digital)
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                {cases.filter((c) => c.stage === 'resolved').length + 18}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                <CheckCircle2 className="size-4" />
                                <span>18 Kasus Selesai Bulan Ini</span>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Seluruh berkas konseling, komitmen siswa, hasil evaluasi, dan tanda terima orang tua tersimpan aman di arsip digital sekolah.
                            </p>
                            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                                Berkas terenkripsi dan dapat ditinjau oleh Kepala Sekolah & BK.
                            </div>
                        </div>

                        {cases
                            .filter((c) => c.stage === 'resolved')
                            .map((c) => (
                                <div
                                    key={c.id}
                                    className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-xs space-y-1"
                                >
                                    <div className="font-bold text-slate-900 dark:text-white">{c.studentName}</div>
                                    <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">✓ Selesai & Terdokumentasi</div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

ManajemenKasus.layout = (page: React.ReactNode) => page;
