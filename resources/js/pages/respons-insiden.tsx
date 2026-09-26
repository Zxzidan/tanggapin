import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    Clock,
    PhoneCall,
    Radio,
    Shield,
    ShieldAlert,
    Siren,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { IncidentItem } from '@/types/tanggapin';

interface ResponsInsidenProps {
    incidents?: IncidentItem[];
}

export default function ResponsInsiden({ incidents: initialIncidents = [] }: ResponsInsidenProps) {
    const [incidents, setIncidents] = useState<IncidentItem[]>(initialIncidents);

    const handleToggleChecklist = (incidentId: string, checklistId: string) => {
        setIncidents((prev) =>
            prev.map((inc) => {
                if (inc.id === incidentId) {
                    return {
                        ...inc,
                        checklist: inc.checklist.map((chk) =>
                            chk.id === checklistId ? { ...chk, done: !chk.done } : chk
                        ),
                    };
                }
                return inc;
            })
        );
        toast.info('Status checklist kesiapsiagaan darurat diperbarui.');
    };

    const handleBroadcast = (title: string) => {
        toast.success(`Broadcast darurat berhasil dikirim ke seluruh staf, guru piket & wali murid!`, {
            description: `Insiden: ${title}`,
        });
    };

    return (
        <FlowbiteTanggapinLayout activeTab="incidents">
            <Head title="Respons Insiden — TANGGAPIN" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Module */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                                <Siren className="size-5 animate-pulse" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Respons Insiden & Kesiapsiagaan Sekolah
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Protokol tanggap darurat terpadu: Insiden Terdeteksi → Aktivasi Satgas → Verifikasi Cepat → Komunikasi Darurat → Tindakan Penyelamatan → Pemulihan.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-900 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-red-600 animate-ping" />
                            Status: Siaga Kesiapsiagaan Aktif
                        </span>
                    </div>
                </div>

                {/* Emergency Hotlines & Protocols Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-1">
                        <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-bold">
                            <Radio className="size-4" />
                            <span>Pusat Kendali Darurat</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                            Ruang Piket Keamanan & UKS (Ext: 101 / 102). Terhubung ke BPBD & Puskesmas terdekat.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                            <Shield className="size-4" />
                            <span>Satgas Anti-Kekerasan & TPPK</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                            Tim Pencegahan & Penanganan Kekerasan aktif mendampingi siswa jika terjadi laporan perundungan.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                            <Users className="size-4" />
                            <span>Titik Kumpul Evakuasi</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                            Lapangan Upacara Utama & Lapangan Olahraga SMK Negeri 1 Harapan.
                        </p>
                    </div>
                </div>

                {/* Incident List & Checklist */}
                <div className="space-y-4">
                    {incidents.map((inc) => (
                        <div
                            key={inc.id}
                            className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-red-200 dark:border-red-900/60 shadow-xs space-y-4 text-xs"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                            {inc.title}
                                        </h2>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200">
                                            Level: {inc.level}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        Komandan Lapangan / Penanggung Jawab: <strong className="text-slate-900 dark:text-white">{inc.leadOfficer}</strong> • Status: <span className="font-semibold text-amber-600">{inc.status}</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleBroadcast(inc.title)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors active:scale-95 shrink-0 self-start sm:self-center"
                                >
                                    <PhoneCall className="size-3.5" />
                                    <span>Broadcast Peringatan Darurat</span>
                                </button>
                            </div>

                            <div>
                                <span className="font-bold text-slate-900 dark:text-white text-xs block mb-2.5">
                                    Checklist Kesiapsiagaan & Jalur Evakuasi:
                                </span>
                                <div className="space-y-2">
                                    {inc.checklist.map((chk) => (
                                        <label
                                            key={chk.id}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={chk.done}
                                                onChange={() => handleToggleChecklist(inc.id, chk.id)}
                                                className="size-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                            />
                                            <span
                                                className={cn(
                                                    'text-xs font-medium',
                                                    chk.done
                                                        ? 'line-through text-slate-400'
                                                        : 'text-slate-800 dark:text-slate-200'
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
