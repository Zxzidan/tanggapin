import { Head } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Home,
    MapPin,
    Phone,
    Plus,
    UserCheck,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useActionModals } from '@/components/action-modals';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { AtsItem } from '@/types/tanggapin';

interface AlurAtsProps {
    atsList?: AtsItem[];
}

export default function AlurAts({ atsList: initialAtsList = [] }: AlurAtsProps) {
    const [atsList, setAtsList] = useState<AtsItem[]>(initialAtsList);
    const { openFollowupModal } = useActionModals();

    const handleUpdateVisit = (ats: AtsItem) => {
        toast.success(`Hasil verifikasi lapangan ananda ${ats.studentName} berhasil diperbarui!`, {
            description: `Status: Terverifikasi oleh ${ats.officer}`,
        });
        setAtsList((prev) =>
            prev.map((item) =>
                item.id === ats.id
                    ? { ...item, status: 'Kunjungan Selesai & Terverifikasi' }
                    : item
            )
        );
    };

    return (
        <FlowbiteTanggapinLayout activeTab="ats">
            <Head title="Alur Lapangan ATS — TANGGAPIN" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Module */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                <UserCheck className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Alur Lapangan ATS (Anak Tidak Sekolah)
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Workflow penanganan verifikasi lapangan & intervensi: Ditugaskan → Kunjungan Rumah → Terverifikasi → Rencana Solusi → Kembali Sekolah.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            Tim Satgas ATS Terpadu
                        </span>
                    </div>
                </div>

                {/* Workflow Status Steps Indicator */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                            1. Sinyal Absensi Kritis
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 font-semibold">
                            2. Penugasan Kunjungan
                        </div>
                        <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 font-semibold">
                            3. Home Visit Lapangan
                        </div>
                        <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold">
                            4. Solusi & Intervensi
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold col-span-2 md:col-span-1">
                            5. Kembali ke Sekolah ✓
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {atsList.map((ats) => (
                        <div
                            key={ats.id}
                            className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 transition-all space-y-3.5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                        {ats.studentName}
                                    </h3>
                                    <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold">
                                        Kelas Terakhir: {ats.lastClass}
                                    </span>
                                </div>

                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                                    {ats.status}
                                </span>
                            </div>

                            <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-[#111c30] border border-slate-100 dark:border-slate-800">
                                <MapPin className="size-4 text-red-500 shrink-0 mt-0.5" />
                                <span>Alamat Domisili: <strong className="font-medium text-slate-900 dark:text-white">{ats.address}</strong></span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                                    Identifikasi Faktor Hambatan Belajar:
                                </span>
                                <div className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                                    {ats.reason}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                <span className="text-slate-500">
                                    Petugas: <strong className="text-slate-700 dark:text-slate-300 font-medium">{ats.officer}</strong>
                                </span>
                                <span className="text-slate-500">
                                    Jadwal: <strong className="text-slate-700 dark:text-slate-300 font-medium">{ats.scheduledVisit}</strong>
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => handleUpdateVisit(ats)}
                                    className="w-full py-2 px-3 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-2xs transition-colors text-center"
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
                                    className="w-full py-2 px-3 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors text-center"
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
