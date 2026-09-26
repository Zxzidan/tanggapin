import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    GraduationCap,
    Phone,
    PhoneCall,
    Plus,
    Shield,
    ShieldAlert,
    TrendingDown,
    X,
} from 'lucide-react';
import React from 'react';
import type { PriorityAlert } from '@/types/tanggapin';

interface Student360ModalProps {
    student: PriorityAlert | null;
    isOpen: boolean;
    onClose: () => void;
    onFollowUp: (student: PriorityAlert) => void;
    onContactParent: (student: PriorityAlert) => void;
    onEscalateCase: (student: PriorityAlert) => void;
}

export default function Student360Modal({
    student,
    isOpen,
    onClose,
    onFollowUp,
    onContactParent,
    onEscalateCase,
}: Student360ModalProps) {
    if (!isOpen || !student) return null;

    const isHighRisk = student.riskLevel === 'high';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                {/* Header Profile Identity */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-[#111c30]">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white shadow-2xs">
                            {student.studentName
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                                    {student.studentName}
                                </h2>
                                <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    {student.class}
                                </span>
                                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                    {isHighRisk
                                        ? 'Perlu Perhatian Segera'
                                        : 'Pemantauan Terarah'}
                                </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                NISN: 008741920 • Wali Kelas:{' '}
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {student.homeroomTeacher}
                                </span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        aria-label="Tutup profil siswa"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 space-y-6 overflow-y-auto bg-white p-5 sm:p-6 dark:bg-[#0f172a]">
                    {/* 1. Kondisi Terkini & Sinyal yang Membutuhkan Perhatian */}
                    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-[#111c30]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="size-4 shrink-0 text-blue-700 dark:text-blue-400" />
                                <span className="text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                    Pemicu Perhatian • Sinyal Terdeteksi
                                </span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-500">
                                Terdeteksi {student.timestamp}
                            </span>
                        </div>

                        <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-[#070b14]">
                            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">
                                {student.triggerType}
                            </span>
                            <p className="text-xs leading-relaxed font-normal text-slate-700 dark:text-slate-300">
                                {student.summary}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                            <span>
                                Saran Tindakan Sistem:{' '}
                                <strong className="text-slate-900 dark:text-white">
                                    {student.suggestedAction}
                                </strong>
                            </span>
                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                Pendekatan Bimbingan & Solutif
                            </span>
                        </div>
                    </div>

                    {/* 2. Indikator Kondisi Siswa 360 */}
                    <div>
                        <h3 className="mb-2.5 text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                            Kondisi Terkini Siswa
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-[#111c30]">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="font-medium">
                                        Kehadiran 14 Hari
                                    </span>
                                    <Clock className="size-3.5" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                                        72%
                                    </span>
                                    <span className="flex items-center text-[11px] font-semibold text-slate-500">
                                        <TrendingDown className="me-0.5 size-3" />{' '}
                                        -28%
                                    </span>
                                </div>
                                <p className="text-[10px] leading-tight text-slate-500">
                                    Alpa 4 hari, Sakit 2 hari tanpa surat
                                    keterangan.
                                </p>
                            </div>

                            <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-[#111c30]">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="font-medium">
                                        Capaian Pembelajaran
                                    </span>
                                    <GraduationCap className="size-3.5" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                                        76 / 100
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-500">
                                        2 Tugas Tertunda
                                    </span>
                                </div>
                                <p className="text-[10px] leading-tight text-slate-500">
                                    Penurunan pada mata pelajaran kejuruan
                                    produktif.
                                </p>
                            </div>

                            <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-[#111c30]">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="font-medium">
                                        Catatan Kedisiplinan
                                    </span>
                                    <Shield className="size-3.5" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                        20 Poin
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-500">
                                        Kategori Ringan
                                    </span>
                                </div>
                                <p className="text-[10px] leading-tight text-slate-500">
                                    Terlambat datang 2x pada pekan kedua
                                    September.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Kontak & Komunikasi Orang Tua Terstruktur */}
                    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#111c30]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                Kontak & Komunikasi Wali Murid
                            </span>
                            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">
                                Kanal Resmi WhatsApp & Portal
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                            <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-[#0f172a]">
                                <span className="block text-[10px] font-medium text-slate-400">
                                    Orang Tua / Wali:
                                </span>
                                <div className="font-bold text-slate-900 dark:text-white">
                                    {student.parentName}
                                </div>
                                <div className="flex items-center gap-1.5 pt-0.5 text-slate-500">
                                    <Phone className="size-3" />
                                    <span>{student.parentPhone}</span>
                                </div>
                            </div>

                            <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-[#0f172a]">
                                <span className="block text-[10px] font-medium text-slate-400">
                                    Status Komunikasi Terakhir:
                                </span>
                                <div className="flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-400">
                                    <CheckCircle2 className="size-3" />
                                    <span>Sudah Membaca • Terkonfirmasi</span>
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    Pemberitahuan absensi terkirim 24 Sep, 08:15
                                    WIB
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Linimasa Riwayat Pendampingan & Kasus */}
                    <div>
                        <h3 className="mb-2.5 text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                            Linimasa Riwayat Pendampingan Siswa
                        </h3>
                        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-[#111c30]/50">
                            <div className="flex gap-3 text-xs">
                                <div className="flex flex-col items-center">
                                    <span className="size-2 rounded-full bg-blue-700 ring-4 ring-blue-100 dark:ring-blue-950" />
                                    <div className="my-1 h-full w-0.5 bg-slate-200 dark:bg-slate-800" />
                                </div>
                                <div className="space-y-0.5 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Sinyal Early Warning Terpicu
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            {student.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                        Sistem mengidentifikasi penurunan
                                        absensi melampaui ambang batas normal
                                        kelas.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-xs">
                                <div className="flex flex-col items-center">
                                    <span className="size-2 rounded-full bg-blue-700 ring-4 ring-blue-100 dark:ring-blue-950" />
                                    <div className="my-1 h-full w-0.5 bg-slate-200 dark:bg-slate-800" />
                                </div>
                                <div className="space-y-0.5 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Konsultasi Belajar Pertama
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            2 pekan lalu
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                        Wali kelas berdiskusi informal terkait
                                        tugas produktif perangkat lunak.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-xs">
                                <div className="flex flex-col items-center">
                                    <span className="size-2 rounded-full bg-slate-400 ring-4 ring-slate-100 dark:ring-slate-800" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Verifikasi Data Awal Semester
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            Juli 2025
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                        Data pokok siswa dan kontak wali murid
                                        terverifikasi valid di Dapodik.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3.5 dark:border-slate-800 dark:bg-[#111c30]">
                    <span className="text-[11px] font-medium text-slate-500">
                        Tindakan langsung terhadap ananda {student.studentName}:
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onFollowUp(student);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800 active:scale-95"
                        >
                            <Plus className="size-3.5" />
                            Buat Tindak Lanjut
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onContactParent(student);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <PhoneCall className="size-3.5 text-slate-500" />
                            Hubungi Wali Murid
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onEscalateCase(student);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            title="Eskalasi ke Manajemen Kasus BK"
                        >
                            <ShieldAlert className="size-3.5 text-blue-700 dark:text-blue-400" />
                            Rujuk ke BK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
