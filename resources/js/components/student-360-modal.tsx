import {
    AlertTriangle,
    ArrowUpRight,
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    GraduationCap,
    HeartPulse,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    PhoneCall,
    Plus,
    Shield,
    ShieldAlert,
    TrendingDown,
    TrendingUp,
    User,
    UserCheck,
    X,
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import type { PriorityAlert } from '@/types/tanggapin';

interface Student360ModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: PriorityAlert | null;
    onFollowUp: (student: PriorityAlert) => void;
    onContactParent: (student: PriorityAlert) => void;
    onEscalateCase: (student: PriorityAlert) => void;
}

export default function Student360Modal({
    isOpen,
    onClose,
    student,
    onFollowUp,
    onContactParent,
    onEscalateCase,
}: Student360ModalProps) {
    if (!isOpen || !student) return null;

    // Derived contextual info for student
    const isHighRisk = student.riskLevel === 'high';
    const isMediumRisk = student.riskLevel === 'medium';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-xs">
                {/* Header: Student 360° Identity Bar */}
                <div className="px-5 py-4 bg-slate-50 dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3.5">
                        <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 text-base shadow-xs shrink-0">
                            {student.studentName
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                    {student.studentName}
                                </h2>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/50 dark:border-slate-700">
                                    {student.class}
                                </span>
                                <span
                                    className={cn(
                                        'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                        isHighRisk
                                            ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900'
                                            : isMediumRisk
                                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
                                    )}
                                >
                                    {isHighRisk ? 'Perlu Perhatian Segera' : 'Pemantauan Terarah'}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                NISN: 008741920 • Wali Kelas: <span className="font-semibold text-slate-700 dark:text-slate-300">{student.homeroomTeacher}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Tutup profil siswa"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Body Content - Human Centered Student 360° (Section 11 Hierarchy) */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-[#0f172a]">
                    {/* 1. Kondisi Terkini & Sinyal yang Membutuhkan Perhatian */}
                    <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/50 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="size-4 text-red-600 dark:text-red-400 shrink-0" />
                                <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                                    Pemicu Perhatian (Signal Trigger)
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">
                                Terdeteksi {student.timestamp}
                            </span>
                        </div>

                        <div className="p-3 rounded-lg bg-white dark:bg-[#111c30] border border-red-100 dark:border-red-900/40 space-y-1">
                            <span className="text-[11px] font-bold text-red-700 dark:text-red-400">
                                {student.triggerType}
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                {student.summary}
                            </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600 dark:text-slate-400">
                            <span>Saran Tindakan Sistem: <strong className="text-slate-900 dark:text-white">{student.suggestedAction}</strong></span>
                            <span className="text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                                Pendekatan Bimbingan & Solutif
                            </span>
                        </div>
                    </div>

                    {/* 2. Indikator Kondisi Siswa 360° (Kehadiran, Akademik, Kedisiplinan) */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5">
                            Kondisi Terkini Siswa
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-1.5">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="font-medium">Kehadiran (14 Hari)</span>
                                    <Clock className="size-3.5" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-red-600">72%</span>
                                    <span className="text-[11px] text-red-500 font-semibold flex items-center">
                                        <TrendingDown className="size-3 me-0.5" /> -28%
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                    Alpa 4 hari, Sakit 2 hari tanpa surat keterangan.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-1.5">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="font-medium">Capaian Pembelajaran</span>
                                    <GraduationCap className="size-3.5" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-amber-600">76 / 100</span>
                                    <span className="text-[10px] text-amber-600 font-semibold">2 Tugas Tertunda</span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                    Penurunan pada mata pelajaran kejuruan produktif.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-1.5">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="font-medium">Catatan Kedisiplinan</span>
                                    <Shield className="size-3.5" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-slate-800 dark:text-slate-200">20 Poin</span>
                                    <span className="text-[10px] text-emerald-600 font-semibold">Kategori Ringan</span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                    Terlambat datang 2x pada pekan kedua September.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Kontak & Komunikasi Orang Tua Terstruktur */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                                Kontak & Komunikasi Wali Murid
                            </span>
                            <span className="text-[11px] text-blue-600 font-medium">
                                Kanal Resmi WhatsApp & Portal
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] text-slate-400 block font-medium">Orang Tua / Wali:</span>
                                <div className="font-bold text-slate-900 dark:text-white">{student.parentName}</div>
                                <div className="text-slate-500 flex items-center gap-1.5 pt-0.5">
                                    <Phone className="size-3" />
                                    <span>{student.parentPhone}</span>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] text-slate-400 block font-medium">Status Komunikasi Terakhir:</span>
                                <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="size-3" />
                                    <span>Sudah Membaca (Acknowledged)</span>
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    Pemberitahuan absensi terkirim 24 Sep, 08:15 WIB
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Linimasa Riwayat Pendampingan & Kasus */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5">
                            Linimasa Riwayat Pendampingan Siswa
                        </h3>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-[#111c30]/50 space-y-3">
                            <div className="flex gap-3 text-xs">
                                <div className="flex flex-col items-center">
                                    <span className="size-2 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950" />
                                    <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 my-1" />
                                </div>
                                <div className="space-y-0.5 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white">Sinyal Early Warning Terpicu</span>
                                        <span className="text-[10px] text-slate-400">{student.timestamp}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                        Sistem mengidentifikasi penurunan absensi melampaui ambang batas normal kelas.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-xs">
                                <div className="flex flex-col items-center">
                                    <span className="size-2 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950" />
                                    <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 my-1" />
                                </div>
                                <div className="space-y-0.5 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white">Konsultasi Belajar Pertama</span>
                                        <span className="text-[10px] text-slate-400">2 pekan lalu</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                        Wali kelas berdiskusi informal terkait tugas produktif perangkat lunak.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-xs">
                                <div className="flex flex-col items-center">
                                    <span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white">Verifikasi Data Awal Semester</span>
                                        <span className="text-[10px] text-slate-400">Juli 2025</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                        Data pokok siswa dan kontak wali murid terverifikasi valid di Dapodik.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action Buttons (Section 10: Action-Oriented Connection) */}
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#111c30] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <span className="text-[11px] text-slate-500 font-medium">
                        Tindakan langsung terhadap ananda {student.studentName}:
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onFollowUp(student);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors active:scale-95"
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
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors"
                        >
                            <PhoneCall className="size-3.5 text-emerald-600" />
                            Hubungi Wali Murid
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onEscalateCase(student);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 rounded-lg transition-colors"
                            title="Eskalasi ke Manajemen Kasus BK"
                        >
                            <ShieldAlert className="size-3.5 text-amber-600" />
                            Rujuk ke BK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
