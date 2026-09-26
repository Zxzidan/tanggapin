import { Head } from '@inertiajs/react';
import { CheckCircle2, Plus, ShieldAlert } from 'lucide-react';
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
}: ManajemenKasusProps) {
    const [cases, setCases] = useState<CaseItem[]>(initialCases);
    const { openNewCaseModal } = useActionModals();

    const handleAssignToBk = (c: CaseItem) => {
        setCases((prev) =>
            prev.map((item) =>
                item.id === c.id
                    ? {
                          ...item,
                          stage: 'assigned',
                          stageLabel: 'Ditugaskan ke BK',
                      }
                    : item,
            ),
        );
        toast.success(`Kasus ${c.code} berhasil ditugaskan ke Guru BK!`);
    };

    const handleStartCounseling = (c: CaseItem) => {
        setCases((prev) =>
            prev.map((item) =>
                item.id === c.id
                    ? {
                          ...item,
                          stage: 'in_progress',
                          stageLabel: 'Sedang Ditangani',
                      }
                    : item,
            ),
        );
        toast.success(`Kasus ${c.code} masuk ke sesi konseling & penanganan.`);
    };

    const handleResolveCase = (c: CaseItem) => {
        setCases((prev) =>
            prev.map((item) =>
                item.id === c.id
                    ? {
                          ...item,
                          stage: 'resolved',
                          stageLabel: 'Selesai & Terdokumentasi',
                      }
                    : item,
            ),
        );
        toast.success(
            `Kasus ${c.code} telah diselesaikan dan tersimpan di arsip digital!`,
        );
    };

    return (
        <FlowbiteTanggapinLayout activeTab="cases">
            <Head title="Manajemen Kasus BK — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <ShieldAlert className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Manajemen Kasus BK & Kesiswaan
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Mengubah koordinasi kasus dari percakapan informal
                            menjadi workflow terstruktur: Baru Masuk →
                            Ditugaskan → Konseling → Tuntas & Arsip.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => openNewCaseModal()}
                        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 active:scale-95 sm:self-center"
                    >
                        <Plus className="size-4" />
                        <span>Daftarkan Kasus Baru</span>
                    </button>
                </div>

                {/* Kanban Board Columns */}
                <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-4">
                    {/* Column 1: Baru Masuk */}
                    <div className="flex flex-col space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-600" />
                                1. Baru Masuk
                            </span>
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {cases.filter((c) => c.stage === 'new').length}
                            </span>
                        </div>

                        <div className="flex-1 space-y-2.5 overflow-y-auto">
                            {cases
                                .filter((c) => c.stage === 'new')
                                .map((c) => (
                                    <div
                                        key={c.id}
                                        className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 shadow-2xs transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-[#111c30]"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {c.studentName}
                                                </div>
                                                <span className="font-mono text-[10px] text-slate-400">
                                                    {c.code} • {c.class}
                                                </span>
                                            </div>
                                            <span
                                                className={cn(
                                                    'rounded px-1.5 py-0.5 text-[10px] font-bold',
                                                    c.priority === 'Tinggi'
                                                        ? 'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300'
                                                        : 'border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300',
                                                )}
                                            >
                                                {c.priority}
                                            </span>
                                        </div>
                                        <p className="rounded-lg border border-slate-100 bg-white p-2 text-[11px] leading-relaxed font-normal text-slate-600 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-400">
                                            {c.lastActivity}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleAssignToBk(c)}
                                            className="w-full rounded-lg border border-blue-200 bg-blue-50 py-1.5 text-center text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/70 dark:text-blue-300"
                                        >
                                            Tugaskan ke BK →
                                        </button>
                                    </div>
                                ))}

                            {cases.filter((c) => c.stage === 'new').length ===
                                0 && (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    Tidak ada kasus baru menunggu.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Ditugaskan */}
                    <div className="flex flex-col space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-600" />
                                2. Ditugaskan
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {
                                    cases.filter((c) => c.stage === 'assigned')
                                        .length
                                }
                            </span>
                        </div>

                        <div className="flex-1 space-y-2.5 overflow-y-auto">
                            {cases
                                .filter((c) => c.stage === 'assigned')
                                .map((c) => (
                                    <div
                                        key={c.id}
                                        className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 shadow-2xs transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-[#111c30]"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {c.studentName}
                                                </div>
                                                <span className="font-mono text-[10px] text-slate-400">
                                                    {c.code} • {c.class}
                                                </span>
                                            </div>
                                            <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
                                                {c.category}
                                            </span>
                                        </div>
                                        <p className="rounded-lg border border-slate-100 bg-white p-2 text-[11px] leading-relaxed font-normal text-slate-600 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-400">
                                            {c.lastActivity}
                                        </p>
                                        <div className="text-[10px] text-slate-500">
                                            PIC:{' '}
                                            <strong className="text-slate-700 dark:text-slate-300">
                                                {c.assignee}
                                            </strong>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStartCounseling(c)
                                            }
                                            className="w-full rounded-lg border border-blue-200 bg-blue-50 py-1.5 text-center text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/70 dark:text-blue-300"
                                        >
                                            Mulai Sesi Konseling →
                                        </button>
                                    </div>
                                ))}

                            {cases.filter((c) => c.stage === 'assigned')
                                .length === 0 && (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    Tidak ada kasus dalam penugasan.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Sedang Ditangani */}
                    <div className="flex flex-col space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-600" />
                                3. Sedang Ditangani
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {
                                    cases.filter(
                                        (c) => c.stage === 'in_progress',
                                    ).length
                                }
                            </span>
                        </div>

                        <div className="flex-1 space-y-2.5 overflow-y-auto">
                            {cases
                                .filter((c) => c.stage === 'in_progress')
                                .map((c) => (
                                    <div
                                        key={c.id}
                                        className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 shadow-2xs transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-[#111c30]"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {c.studentName}
                                                </div>
                                                <span className="font-mono text-[10px] text-slate-400">
                                                    {c.code} • {c.class}
                                                </span>
                                            </div>
                                            <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                                Konseling Aktif
                                            </span>
                                        </div>
                                        <p className="rounded-lg border border-slate-100 bg-white p-2 text-[11px] leading-relaxed font-normal text-slate-600 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-400">
                                            {c.lastActivity}
                                        </p>
                                        <div className="text-[10px] text-slate-500">
                                            Konselor:{' '}
                                            <strong className="text-slate-700 dark:text-slate-300">
                                                {c.assignee}
                                            </strong>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleResolveCase(c)}
                                            className="w-full rounded-lg border border-blue-200 bg-blue-50 py-1.5 text-center text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/70 dark:text-blue-300"
                                        >
                                            Selesaikan & Arsipkan ✓
                                        </button>
                                    </div>
                                ))}

                            {cases.filter((c) => c.stage === 'in_progress')
                                .length === 0 && (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    Tidak ada kasus dalam sesi aktif.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 4: Selesai & Arsip */}
                    <div className="flex flex-col space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-600" />
                                4. Selesai — Arsip Digital
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {cases.filter((c) => c.stage === 'resolved')
                                    .length}
                            </span>
                        </div>

                        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-[#111c30] dark:text-slate-400">
                            <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-400">
                                <CheckCircle2 className="size-4" />
                                <span>{cases.filter((c) => c.stage === 'resolved').length} Kasus Selesai</span>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Seluruh berkas konseling, komitmen siswa, hasil
                                evaluasi, dan tanda terima orang tua tersimpan
                                aman di arsip digital sekolah.
                            </p>
                            <div className="border-t border-slate-200 pt-1 text-[10px] text-slate-400 dark:border-slate-800">
                                Berkas terenkripsi dan dapat ditinjau oleh
                                Kepala Sekolah & BK.
                            </div>
                        </div>

                        {cases
                            .filter((c) => c.stage === 'resolved')
                            .map((c) => (
                                <div
                                    key={c.id}
                                    className="space-y-1 rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-xs dark:border-blue-900/60 dark:bg-blue-950/20"
                                >
                                    <div className="font-bold text-slate-900 dark:text-white">
                                        {c.studentName}
                                    </div>
                                    <div className="text-[10px] font-medium text-blue-700 dark:text-blue-300">
                                        ✓ Selesai & Terdokumentasi
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

ManajemenKasus.layout = (page: React.ReactNode) => page;
