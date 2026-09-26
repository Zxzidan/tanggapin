import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    MessageSquare,
    PhoneCall,
    Plus,
} from 'lucide-react';
import React, { useState } from 'react';
import { useActionModals } from '@/components/action-modals';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { ParentUpdate } from '@/types/tanggapin';

interface KomunikasiOrtuProps {
    parentUpdates?: ParentUpdate[];
}

export default function KomunikasiOrtu({
    parentUpdates: initialParentUpdates = [],
}: KomunikasiOrtuProps) {
    const [parentUpdates] = useState<ParentUpdate[]>(initialParentUpdates);
    const { openParentContactModal } = useActionModals();

    const readCount = parentUpdates.filter(
        (m) => m.acknowledgement === 'Sudah membaca',
    ).length;
    const pendingCount = parentUpdates.filter(
        (m) => m.acknowledgement !== 'Sudah membaca',
    ).length;

    return (
        <FlowbiteTanggapinLayout activeTab="communication">
            <Head title="Komunikasi Orang Tua — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <PhoneCall className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Komunikasi Orang Tua Terstruktur
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Komunikasi resmi sekolah ke orang tua berbasis data
                            dengan tanda terima digital (acknowledgement),
                            menghindari kesalahpahaman dan perdebatan informal
                            di grup chat.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                        <button
                            type="button"
                            onClick={() => openParentContactModal()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 active:scale-95"
                        >
                            <Plus className="size-4" />
                            <span>Kirim Pesan Terstruktur</span>
                        </button>
                    </div>
                </div>

                {/* Status KPI Summary */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Total Pesan Resmi Terkirim
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {parentUpdates.length}
                            </div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950">
                            <MessageSquare className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Telah Dikonfirmasi Ortu
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {readCount}
                            </div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            <CheckCircle2 className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Menunggu Respon / Koordinasi
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {pendingCount}
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <Clock className="size-5" />
                        </div>
                    </div>
                </div>

                {/* List of Messages */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Riwayat Notifikasi & Percakapan Resmi
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Setiap pesan tercatat waktu kirim, nomor tujuan,
                            kategori masalah, dan tanda bukti konfirmasi orang
                            tua.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {parentUpdates.map((msg) => (
                            <div
                                key={msg.id}
                                className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs transition-colors hover:border-blue-300 md:flex-row md:items-center dark:border-slate-800 dark:bg-[#111c30]"
                            >
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {msg.studentName}
                                        </span>
                                        <span className="text-slate-400">
                                            • Wali: {msg.parentName}
                                        </span>
                                        <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                            {msg.category}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            • {msg.date}
                                        </span>
                                    </div>

                                    <p className="rounded-lg border border-slate-200 bg-white p-3 leading-relaxed font-normal text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:text-slate-300">
                                        {msg.message}
                                    </p>

                                    <div className="text-[11px] text-slate-500">
                                        Saluran:{' '}
                                        <strong className="font-medium text-slate-700 dark:text-slate-300">
                                            {msg.status}
                                        </strong>
                                    </div>
                                </div>

                                <div className="flex shrink-0 flex-col items-start gap-1.5 self-start md:items-end md:self-center">
                                    <span className="text-[10px] font-medium text-slate-400">
                                        Status Tanggapan Ortu:
                                    </span>
                                    <span
                                        className={cn(
                                            'rounded-full border px-3 py-1 text-xs font-semibold',
                                            msg.acknowledgement ===
                                                'Sudah membaca'
                                                ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300',
                                        )}
                                    >
                                        {msg.acknowledgement === 'Sudah membaca'
                                            ? '✓ Sudah Membaca'
                                            : 'Menunggu Konfirmasi'}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {parentUpdates.length === 0 && (
                            <div className="py-8 text-center text-xs text-slate-400">
                                Belum ada pesan komunikasi resmi yang dikirim.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

KomunikasiOrtu.layout = (page: React.ReactNode) => page;
