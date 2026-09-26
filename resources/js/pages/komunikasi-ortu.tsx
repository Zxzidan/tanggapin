import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    MessageSquare,
    PhoneCall,
    Plus,
    Send,
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

    const readCount = parentUpdates.filter((m) => m.acknowledgement === 'Sudah membaca').length;
    const pendingCount = parentUpdates.filter((m) => m.acknowledgement !== 'Sudah membaca').length;

    return (
        <FlowbiteTanggapinLayout activeTab="communication">
            <Head title="Komunikasi Orang Tua — TANGGAPIN" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Module */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                                <PhoneCall className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Komunikasi Orang Tua Terstruktur
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Komunikasi resmi sekolah ke orang tua berbasis data dengan tanda terima digital (acknowledgement), menghindari kesalahpahaman dan perdebatan informal di grup chat.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <button
                            type="button"
                            onClick={() => openParentContactModal()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95"
                        >
                            <Plus className="size-4" />
                            <span>Kirim Pesan Terstruktur</span>
                        </button>
                    </div>
                </div>

                {/* Status KPI Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Total Pesan Resmi Terkirim</span>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {parentUpdates.length}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
                            <MessageSquare className="size-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Telah Dikonfirmasi Ortu</span>
                            <div className="text-2xl font-bold text-emerald-600 mt-0.5">
                                {readCount}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                            <CheckCircle2 className="size-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Menunggu Respon / Koordinasi</span>
                            <div className="text-2xl font-bold text-amber-600 mt-0.5">
                                {pendingCount}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
                            <Clock className="size-5" />
                        </div>
                    </div>
                </div>

                {/* List of Messages */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Riwayat Notifikasi & Percakapan Resmi
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Setiap pesan tercatat waktu kirim, nomor tujuan, kategori masalah, dan tanda bukti konfirmasi orang tua.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {parentUpdates.map((msg) => (
                            <div
                                key={msg.id}
                                className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors hover:border-blue-300"
                            >
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                                            {msg.studentName}
                                        </span>
                                        <span className="text-slate-400">• Wali: {msg.parentName}</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                                            {msg.category}
                                        </span>
                                        <span className="text-slate-400 text-[11px]">• {msg.date}</span>
                                    </div>

                                    <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070b14] p-3 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed font-normal">
                                        {msg.message}
                                    </p>

                                    <div className="text-[11px] text-slate-500">
                                        Saluran: <strong className="text-slate-700 dark:text-slate-300 font-medium">{msg.status}</strong>
                                    </div>
                                </div>

                                <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5 self-start md:self-center">
                                    <span className="text-[10px] text-slate-400 font-medium">Status Tanggapan Ortu:</span>
                                    <span
                                        className={cn(
                                            'px-3 py-1 text-xs font-semibold rounded-full border',
                                            msg.acknowledgement === 'Sudah membaca'
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                                        )}
                                    >
                                        {msg.acknowledgement === 'Sudah membaca' ? '✓ Sudah Membaca' : 'Menunggu Konfirmasi'}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {parentUpdates.length === 0 && (
                            <div className="py-8 text-center text-slate-400 text-xs">
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
