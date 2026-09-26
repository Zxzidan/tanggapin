import { Head } from '@inertiajs/react';
import { MapPin, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useActionModals } from '@/components/action-modals';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import type { AtsItem } from '@/types/tanggapin';

interface AlurAtsProps {
    atsList?: AtsItem[];
}

export default function AlurAts({
    atsList: initialAtsList = [],
}: AlurAtsProps) {
    const [atsList, setAtsList] = useState<AtsItem[]>(initialAtsList);
    const { openFollowupModal } = useActionModals();

    const handleUpdateVisit = (ats: AtsItem) => {
        toast.success(
            `Hasil verifikasi lapangan ananda ${ats.studentName} berhasil diperbarui!`,
            {
                description: `Status: Terverifikasi oleh ${ats.officer}`,
            },
        );
        setAtsList((prev) =>
            prev.map((item) =>
                item.id === ats.id
                    ? { ...item, status: 'Kunjungan Selesai & Terverifikasi' }
                    : item,
            ),
        );
    };

    return (
        <FlowbiteTanggapinLayout activeTab="ats">
            <Head title="Alur Lapangan ATS — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <UserCheck className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Alur Lapangan ATS — Anak Tidak Sekolah
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Workflow penanganan verifikasi lapangan &
                            intervensi: Ditugaskan → Kunjungan Rumah →
                            Terverifikasi → Rencana Solusi → Kembali Sekolah.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                        <span className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            <span className="size-2 rounded-full bg-blue-600" />
                            Tim Satgas ATS Terpadu
                        </span>
                    </div>
                </div>

                {/* Workflow Status Steps Indicator */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="grid grid-cols-2 gap-2 text-center text-xs md:grid-cols-5">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                            1. Sinyal Absensi Kritis
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                            2. Penugasan Kunjungan
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                            3. Home Visit Lapangan
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                            4. Solusi & Intervensi
                        </div>
                        <div className="col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-2.5 font-semibold text-blue-700 md:col-span-1 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                            5. Kembali ke Sekolah ✓
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                    {atsList.map((ats) => (
                        <div
                            key={ats.id}
                            className="space-y-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-[#0f172a]"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        {ats.studentName}
                                    </h3>
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                        Kelas Terakhir: {ats.lastClass}
                                    </span>
                                </div>

                                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                    {ats.status}
                                </span>
                            </div>

                            <div className="flex items-start gap-1.5 rounded-lg border border-slate-100 bg-slate-50 p-2 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-[#111c30] dark:text-slate-300">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-700 dark:text-blue-400" />
                                <span>
                                    Alamat Domisili:{' '}
                                    <strong className="font-medium text-slate-900 dark:text-white">
                                        {ats.address}
                                    </strong>
                                </span>
                            </div>

                            <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-[#111c30]">
                                <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                    Identifikasi Faktor Hambatan Belajar:
                                </span>
                                <div className="leading-relaxed font-medium text-slate-800 dark:text-slate-200">
                                    {ats.reason}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-[11px] dark:border-slate-800">
                                <span className="text-slate-500">
                                    Petugas:{' '}
                                    <strong className="font-medium text-slate-700 dark:text-slate-300">
                                        {ats.officer}
                                    </strong>
                                </span>
                                <span className="text-slate-500">
                                    Jadwal:{' '}
                                    <strong className="font-medium text-slate-700 dark:text-slate-300">
                                        {ats.scheduledVisit}
                                    </strong>
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => handleUpdateVisit(ats)}
                                    className="w-full rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 active:scale-95"
                                >
                                    Verifikasi Kunjungan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        openFollowupModal({
                                            studentName: ats.studentName,
                                            note: `Tindak lanjut kunjungan lapangan ATS: ${ats.reason}`,
                                        });
                                    }}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-center text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    Buat Rencana Intervensi
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

AlurAts.layout = (page: React.ReactNode) => page;
