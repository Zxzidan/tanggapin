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
import type {
    ClassMonitoringItem,
    DisciplineRecordItem,
} from '@/types/tanggapin';

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

    const totalStudentsAll = initialClasses.reduce(
        (acc, c) => acc + c.totalStudents,
        0,
    );
    const totalAtRiskAll = initialClasses.reduce(
        (acc, c) => acc + c.studentsAtRisk,
        0,
    );

    return (
        <FlowbiteTanggapinLayout activeTab="class-monitoring">
            <Head title="Kondisi Kelas — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Module Header */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <GraduationCap className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Kondisi Kelas & Monitoring Rombel
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Satu layar terpadu melihat tren kehadiran, peserta
                            didik berisiko, dan status tindak lanjut per
                            rombongan belajar.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-center">
                        <div className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            Total:{' '}
                            <strong className="font-bold text-slate-900 dark:text-white">
                                {totalStudentsAll}
                            </strong>{' '}
                            siswa ({initialClasses.length} rombel)
                        </div>
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300">
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
                            'shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                            selectedMajor === 'all'
                                ? 'bg-blue-700 font-semibold text-white shadow-xs'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-400',
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
                                'shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                                selectedMajor === m
                                    ? 'bg-blue-700 font-semibold text-white shadow-xs'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-400',
                            )}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Class Health Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {filteredClasses.map((cls) => {
                        const isCritical = cls.healthStatus === 'critical';
                        const isWarning = cls.healthStatus === 'warning';

                        return (
                            <div
                                key={cls.id}
                                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-blue-400 dark:border-slate-800 dark:bg-[#0f172a] dark:hover:border-blue-700"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-bold text-slate-900 dark:text-white">
                                                {cls.name}
                                            </span>
                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                {cls.major}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Wali Kelas:{' '}
                                            <strong className="font-medium text-slate-700 dark:text-slate-200">
                                                {cls.homeroomTeacher}
                                            </strong>{' '}
                                            • {cls.totalStudents} Siswa
                                        </p>
                                    </div>

                                    <span
                                        className={cn(
                                            'rounded-full border px-2.5 py-1 text-[10px] font-bold',
                                            isCritical
                                                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
                                                : isWarning
                                                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300'
                                                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                                        )}
                                    >
                                        {isCritical
                                            ? 'Perlu Intervensi'
                                            : isWarning
                                              ? 'Perlu Perhatian'
                                              : 'Kondisi Baik'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-[#111c30]">
                                    <div>
                                        <span className="block text-[10px] font-medium text-slate-400">
                                            Kehadiran
                                        </span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {cls.attendanceRate}%
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-medium text-slate-400">
                                            Siswa Berisiko
                                        </span>
                                        <span className="text-sm font-bold text-red-600">
                                            {cls.studentsAtRisk} siswa
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-medium text-slate-400">
                                            Follow-up Pending
                                        </span>
                                        <span className="text-sm font-bold text-amber-600">
                                            {cls.pendingFollowups} pending
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-slate-500">
                                        Status:{' '}
                                        {isCritical
                                            ? 'Membutuhkan koordinasi wali kelas'
                                            : isWarning
                                              ? 'Tingkatkan absensi'
                                              : 'Semua indikator normal'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            openFollowupModal({
                                                studentName: `Perwakilan Kelas ${cls.name}`,
                                                note: `Intervensi kondisi rombel ${cls.name} (Tingkat kehadiran: ${cls.attendanceRate}%, ${cls.studentsAtRisk} siswa butuh pendampingan)`,
                                            });
                                        }}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline dark:text-blue-400"
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
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <Scale className="size-4 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Modul 05: Catatan Pembinaan & Kedisiplinan
                                    Siswa
                                </h3>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Pendekatan restoratif & pembinaan karakter:
                                setiap pelanggaran dicatat bersama poin dan
                                rencana tindakan pendampingan.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => openDisciplineModal()}
                            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 active:scale-95 sm:self-center"
                        >
                            <Plus className="size-3.5" />
                            <span>Catat Pelanggaran / Poin</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:bg-[#111c30] dark:text-slate-300">
                                <tr>
                                    <th className="px-4 py-3">
                                        Siswa & Rombel
                                    </th>
                                    <th className="px-4 py-3">
                                        Pelanggaran & Bobot
                                    </th>
                                    <th className="px-4 py-3">
                                        Catatan Pola & Tindakan Restoratif
                                    </th>
                                    <th className="px-4 py-3">
                                        Status Tindakan
                                    </th>
                                    <th className="px-4 py-3">
                                        Waktu Pencatatan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {initialDisciplineList.length > 0 ? (
                                    initialDisciplineList.map((rec) => (
                                        <tr
                                            key={rec.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-[#162238]/60"
                                        >
                                            <td className="px-4 py-3.5 font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                <div>{rec.studentName}</div>
                                                <div className="text-[11px] font-normal text-slate-500">
                                                    {rec.class}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {rec.infraction}
                                                </div>
                                                <span className="mt-0.5 inline-block rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
                                                    +{rec.points} Poin
                                                </span>
                                            </td>
                                            <td className="max-w-sm px-4 py-3.5 text-[11px] text-slate-600 dark:text-slate-300">
                                                {rec.patternNotes}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                    {rec.actionStatus}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px] whitespace-nowrap text-slate-400">
                                                {rec.recordedAt}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-6 text-center text-slate-400"
                                        >
                                            Belum ada catatan pelanggaran yang
                                            dilaporkan.
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
