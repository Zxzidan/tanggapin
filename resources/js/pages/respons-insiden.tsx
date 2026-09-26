import { Head } from '@inertiajs/react';
import { PhoneCall, Radio, Shield, Siren, Users } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { IncidentItem } from '@/types/tanggapin';

interface ResponsInsidenProps {
    incidents?: IncidentItem[];
}

export default function ResponsInsiden({
    incidents: initialIncidents = [],
}: ResponsInsidenProps) {
    const [incidents, setIncidents] =
        useState<IncidentItem[]>(initialIncidents);

    const handleToggleChecklist = (incidentId: string, checklistId: string) => {
        setIncidents((prev) =>
            prev.map((inc) => {
                if (inc.id === incidentId) {
                    return {
                        ...inc,
                        checklist: inc.checklist.map((chk) =>
                            chk.id === checklistId
                                ? { ...chk, done: !chk.done }
                                : chk,
                        ),
                    };
                }
                return inc;
            }),
        );
        toast.info('Status checklist kesiapsiagaan darurat diperbarui.');
    };

    const handleBroadcast = (title: string) => {
        toast.success(
            `Broadcast darurat berhasil dikirim ke seluruh staf, guru piket & wali murid!`,
            {
                description: `Insiden: ${title}`,
            },
        );
    };

    return (
        <FlowbiteTanggapinLayout activeTab="incidents">
            <Head title="Respons Insiden — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <Siren className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Respons Insiden & Kesiapsiagaan Sekolah
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Protokol tanggap darurat terpadu: Insiden Terdeteksi
                            → Aktivasi Satgas → Verifikasi Cepat → Komunikasi
                            Darurat → Tindakan Penyelamatan → Pemulihan.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                        <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            <span className="size-2 animate-ping rounded-full bg-blue-600" />
                            Status: Siaga Kesiapsiagaan Aktif
                        </span>
                    </div>
                </div>

                {/* Emergency Hotlines & Protocols Banner */}
                <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
                    <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                        <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400">
                            <Radio className="size-4" />
                            <span>Pusat Kendali Darurat</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                            Ruang Piket Keamanan & UKS — Ext: 101 / 102.
                            Terhubung ke BPBD & Puskesmas terdekat.
                        </p>
                    </div>

                    <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                        <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400">
                            <Shield className="size-4" />
                            <span>Satgas Anti-Kekerasan & TPPK</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                            Tim Pencegahan & Penanganan Kekerasan aktif
                            mendampingi siswa jika terjadi laporan perundungan.
                        </p>
                    </div>

                    <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                        <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400">
                            <Users className="size-4" />
                            <span>Titik Kumpul Evakuasi</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                            Lapangan Upacara Utama & Lapangan Olahraga SMK
                            Negeri 1 Harapan.
                        </p>
                    </div>
                </div>

                {/* Incident List & Checklist */}
                <div className="space-y-4">
                    {incidents.map((inc) => (
                        <div
                            key={inc.id}
                            className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 text-xs shadow-xs dark:border-slate-800 dark:bg-[#0f172a]"
                        >
                            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                            {inc.title}
                                        </h2>
                                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                            Level: {inc.level}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        Komandan Lapangan / Penanggung Jawab:{' '}
                                        <strong className="text-slate-900 dark:text-white">
                                            {inc.leadOfficer}
                                        </strong>{' '}
                                        • Status:{' '}
                                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                                            {inc.status}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleBroadcast(inc.title)}
                                    className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 active:scale-95 sm:self-center"
                                >
                                    <PhoneCall className="size-3.5" />
                                    <span>Broadcast Peringatan Darurat</span>
                                </button>
                            </div>

                            <div>
                                <span className="mb-2.5 block text-xs font-bold text-slate-900 dark:text-white">
                                    Checklist Kesiapsiagaan & Jalur Evakuasi:
                                </span>
                                <div className="space-y-2">
                                    {inc.checklist.map((chk) => (
                                        <label
                                            key={chk.id}
                                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100/60 dark:border-slate-800 dark:bg-[#111c30] dark:hover:bg-slate-800/60"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={chk.done}
                                                onChange={() =>
                                                    handleToggleChecklist(
                                                        inc.id,
                                                        chk.id,
                                                    )
                                                }
                                                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span
                                                className={cn(
                                                    'text-xs font-medium',
                                                    chk.done
                                                        ? 'text-slate-400 line-through'
                                                        : 'text-slate-800 dark:text-slate-200',
                                                )}
                                            >
                                                {chk.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}

ResponsInsiden.layout = (page: React.ReactNode) => page;
