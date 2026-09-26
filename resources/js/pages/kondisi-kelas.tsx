import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    GraduationCap,
    Plus,
    Scale,
    TrendingDown,
    TrendingUp,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useActionModals } from '@/components/action-modals';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { ClassMonitoringItem, DisciplineRecordItem } from '@/types/tanggapin';

interface KondisiKelasProps {
    classes?: ClassMonitoringItem[];
    disciplineList?: DisciplineRecordItem[];
}

export default function KondisiKelas({
    classes: initialClasses = [],
    disciplineList: initialDisciplineList = [],
}: KondisiKelasProps) {
    const { openFollowupModal, openDisciplineModal } = useActionModals();
    const [selectedMajor, setSelectedMajor] = useState<string>('all');

    const majors = Array.from(new Set(initialClasses.map((c) => c.major)));

    const filteredClasses = initialClasses.filter((c) => {
        if (selectedMajor === 'all') return true;
        return c.major === selectedMajor;
    });

    const totalStudentsAll = initialClasses.reduce((acc, c) => acc + c.totalStudents, 0);
    const totalAtRiskAll = initialClasses.reduce((acc, c) => acc + c.studentsAtRisk, 0);

    return (
        <FlowbiteTanggapinLayout activeTab="class-monitoring">
            <Head title="Kondisi Kelas — TANGGAPIN" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Module Header */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                                <GraduationCap className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Kondisi Kelas & Monitoring Rombel
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Satu layar terpadu melihat tren kehadiran, peserta didik berisiko, dan status tindak lanjut per rombongan belajar.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
                        <div className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                            Total: <strong className="text-slate-900 dark:text-white font-bold">{totalStudentsAll}</strong> siswa ({initialClasses.length} rombel)
                        </div>
                        <div className="text-xs px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-semibold">
                            {totalAtRiskAll} siswa butuh atensi
                        </div>
                    </div>
                </div>

                {/* Major Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                        type="button"
                        onClick={() => setSelectedMajor('all')}
                        className={cn(
                            'px-3 py-1.5 text-xs rounded-xl font-medium transition-colors shrink-0',
                            selectedMajor === 'all'
                                ? 'bg-blue-700 text-white font-semibold shadow-xs'
                                : 'bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        )}
                    >
                        Semua Jurusan ({initialClasses.length})
                    </button>
                    {majors.map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setSelectedMajor(m)}
                            className={cn(
                                'px-3 py-1.5 text-xs rounded-xl font-medium transition-colors shrink-0',
                                selectedMajor === m
                                    ? 'bg-blue-700 text-white font-semibold shadow-xs'
                                    : 'bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                            )}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Class Health Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {filteredClasses.map((cls) => {
                        const isCritical = cls.healthStatus === 'critical';
                        const isWarning = cls.healthStatus === 'warning';

                        return (
                            <div
                                key={cls.id}
                                className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 shadow-xs transition-all space-y-3"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white text-base">
                                                {cls.name}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                                {cls.major}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Wali Kelas: <strong className="text-slate-700 dark:text-slate-200 font-medium">{cls.homeroomTeacher}</strong> • {cls.totalStudents} Siswa
                                        </p>
                                    </div>

                                    <span
                                        className={cn(
                                            'text-[10px] font-bold px-2.5 py-1 rounded-full border',
                                            isCritical
                                                ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900'
                                                : isWarning
                                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                        )}
                                    >
                                        {isCritical ? 'Perlu Intervensi' : isWarning ? 'Perlu Perhatian' : 'Kondisi Baik'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-100 dark:border-slate-800 text-xs">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-medium">Kehadiran</span>
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                                            {cls.attendanceRate}%
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-medium">Siswa Berisiko</span>
                                        <span className="font-bold text-red-600 text-sm">
                                            {cls.studentsAtRisk} siswa
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-medium">Follow-up Pending</span>
                                        <span className="font-bold text-amber-600 text-sm">
                                            {cls.pendingFollowups} pending
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-slate-500">
                                        Status: {isCritical ? 'Membutuhkan koordinasi wali kelas' : isWarning ? 'Tingkatkan absensi' : 'Semua indikator normal'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            openFollowupModal({
                                                studentName: `Perwakilan Kelas ${cls.name}`,
                                                note: `Intervensi kondisi rombel ${cls.name} (Tingkat kehadiran: ${cls.attendanceRate}%, ${cls.studentsAtRisk} siswa butuh pendampingan)`,
                                            });
                                        }}
                                        className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                                    >
                                        <Plus className="size-3.5" />
                                        <span>+ Tangani Kelas</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Section 2: Catatan Kedisiplinan & Pelanggaran */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <Scale className="size-4 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Modul 05: Catatan Pembinaan & Kedisiplinan Siswa
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Pendekatan restoratif & pembinaan karakter: setiap pelanggaran dicatat bersama poin dan rencana tindakan pendampingan.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => openDisciplineModal()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95 self-start sm:self-center shrink-0"
                        >
                            <Plus className="size-3.5" />
                            <span>Catat Pelanggaran / Poin</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                            <thead className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase bg-slate-50 dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">Siswa & Rombel</th>
                                    <th className="px-4 py-3">Pelanggaran & Bobot</th>
                                    <th className="px-4 py-3">Catatan Pola & Tindakan Restoratif</th>
                                    <th className="px-4 py-3">Status Tindakan</th>
                                    <th className="px-4 py-3">Waktu Pencatatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {initialDisciplineList.length > 0 ? (
                                    initialDisciplineList.map((rec) => (
                                        <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162238]/60 transition-colors">
                                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                <div>{rec.studentName}</div>
                                                <div className="text-[11px] font-normal text-slate-500">{rec.class}</div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <div className="font-semibold text-slate-900 dark:text-white">{rec.infraction}</div>
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 inline-block mt-0.5">
                                                    +{rec.points} Poin
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 max-w-sm text-[11px] text-slate-600 dark:text-slate-300">
                                                {rec.patternNotes}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                    {rec.actionStatus}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] text-slate-400 whitespace-nowrap">
                                                {rec.recordedAt}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                                            Belum ada catatan pelanggaran yang dilaporkan.
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

KondisiKelas.layout = (page: React.ReactNode) => page;
