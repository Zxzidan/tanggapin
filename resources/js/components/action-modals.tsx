import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    PhoneCall,
    Scale,
    Send,
    ShieldAlert,
    X,
} from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import Student360Modal from '@/components/student-360-modal';
import type { PriorityAlert } from '@/types/tanggapin';

interface ActionModalsContextType {
    openFollowupModal: (params?: {
        studentId?: string;
        studentName?: string;
        studentPhone?: string;
        note?: string;
    }) => void;
    openParentContactModal: (params?: {
        studentId?: string;
        studentName?: string;
        studentPhone?: string;
        message?: string;
    }) => void;
    openNewCaseModal: (params?: {
        studentId?: string;
        studentName?: string;
        desc?: string;
    }) => void;
    openDisciplineModal: (params?: {
        studentId?: string;
        studentName?: string;
    }) => void;
    openStudent360Modal: (student: PriorityAlert) => void;
}

const ActionModalsContext = createContext<ActionModalsContextType | null>(null);

export function useActionModals() {
    const context = useContext(ActionModalsContext);
    if (!context) {
        throw new Error(
            'useActionModals must be used within an ActionModalsProvider',
        );
    }
    return context;
}

export function ActionModalsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Modals visibility
    const [isFollowupOpen, setIsFollowupOpen] = useState(false);
    const [isParentContactOpen, setIsParentContactOpen] = useState(false);
    const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
    const [isDisciplineOpen, setIsDisciplineOpen] = useState(false);
    const [isStudent360Open, setIsStudent360Open] = useState(false);

    // Selected student & inputs
    const [studentId, setStudentId] = useState('1');
    const [studentName, setStudentName] = useState('Brian Aditya — XI RPL 2');
    const [_studentPhone, setStudentPhone] = useState('+62 812-3456-7890');
    const [selectedStudent360, setSelectedStudent360] =
        useState<PriorityAlert | null>(null);

    // Follow-up form
    const [followupType, setFollowupType] = useState('Panggilan Orang Tua');
    const [followupAssignee, setFollowupAssignee] = useState(
        'Wali Kelas — Hendra Setiawan, S.Pd',
    );
    const [followupNote, setFollowupNote] = useState('');

    // Parent contact form
    const [parentCategory, setParentCategory] = useState('Kehadiran');
    const [parentMessage, setParentMessage] = useState(
        'Yth. Bapak/Ibu Wali Murid, kami menginformasikan catatan kehadiran ananda yang memerlukan koordinasi bersama sekolah demi kelancaran proses belajar.',
    );

    // New case form
    const [caseCategory, setCaseCategory] = useState('Kedisiplinan');
    const [casePriority, setCasePriority] = useState<
        'Tinggi' | 'Sedang' | 'Rendah'
    >('Tinggi');
    const [caseDesc, setCaseDesc] = useState('');

    // Discipline form
    const [infraction, setInfraction] = useState('Terlambat Masuk Sekolah');
    const [points, setPoints] = useState(10);
    const [disciplineNotes, setDisciplineNotes] = useState('');

    const openFollowupModal = (params?: {
        studentId?: string;
        studentName?: string;
        studentPhone?: string;
        note?: string;
    }) => {
        if (params?.studentId) setStudentId(params.studentId);
        if (params?.studentName) setStudentName(params.studentName);
        if (params?.studentPhone) setStudentPhone(params.studentPhone);
        if (params?.note) setFollowupNote(params.note);
        setIsFollowupOpen(true);
    };

    const openParentContactModal = (params?: {
        studentId?: string;
        studentName?: string;
        studentPhone?: string;
        message?: string;
    }) => {
        if (params?.studentId) setStudentId(params.studentId);
        if (params?.studentName) setStudentName(params.studentName);
        if (params?.studentPhone) setStudentPhone(params.studentPhone);
        if (params?.message) setParentMessage(params.message);
        setIsParentContactOpen(true);
    };

    const openNewCaseModal = (params?: {
        studentId?: string;
        studentName?: string;
        desc?: string;
    }) => {
        if (params?.studentId) setStudentId(params.studentId);
        if (params?.studentName) setStudentName(params.studentName);
        if (params?.desc) setCaseDesc(params.desc);
        setIsNewCaseOpen(true);
    };

    const openDisciplineModal = (params?: {
        studentId?: string;
        studentName?: string;
    }) => {
        if (params?.studentId) setStudentId(params.studentId);
        if (params?.studentName) setStudentName(params.studentName);
        setIsDisciplineOpen(true);
    };

    const openStudent360Modal = (student: PriorityAlert) => {
        setSelectedStudent360(student);
        setIsStudent360Open(true);
    };

    // Submissions
    const handleSaveFollowup = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/followups',
            {
                student_id: studentId || '1',
                type: followupType,
                assignee_name: followupAssignee,
                note: followupNote || 'Follow-up tindakan operasional sekolah',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Follow-up untuk ${studentName} berhasil disimpan di database!`,
                        {
                            description: `Tindakan: ${followupType} | PIC: ${followupAssignee}`,
                        },
                    );
                    setIsFollowupOpen(false);
                    setFollowupNote('');
                },
                onError: () => {
                    toast.error('Gagal menyimpan follow-up ke database.');
                },
            },
        );
    };

    const handleSendParentMessage = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/parent-communications',
            {
                student_id: studentId || '1',
                category: parentCategory,
                message: parentMessage,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        'Pesan resmi berhasil dikirim dan tersimpan di database!',
                    );
                    setIsParentContactOpen(false);
                },
                onError: () => {
                    toast.error('Gagal mengirim pesan ke orang tua.');
                },
            },
        );
    };

    const handleCreateCase = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/cases',
            {
                student_id: studentId || '1',
                category: caseCategory,
                priority: casePriority,
                last_activity:
                    caseDesc ||
                    'Kasus baru didaftarkan dan menunggu verifikasi BK.',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Kasus baru untuk ${studentName} berhasil didaftarkan di database!`,
                    );
                    setIsNewCaseOpen(false);
                    setCaseDesc('');
                },
                onError: () => {
                    toast.error('Gagal mendaftarkan kasus ke database.');
                },
            },
        );
    };

    const handleCreateDiscipline = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/discipline-records',
            {
                student_id: studentId || '1',
                infraction,
                points,
                pattern_notes:
                    disciplineNotes || 'Pencatatan pembinaan kedisiplinan',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Catatan kedisiplinan untuk ${studentName} berhasil disimpan!`,
                    );
                    setIsDisciplineOpen(false);
                    setDisciplineNotes('');
                },
                onError: () => {
                    toast.error('Gagal menyimpan catatan kedisiplinan.');
                },
            },
        );
    };

    return (
        <ActionModalsContext.Provider
            value={{
                openFollowupModal,
                openParentContactModal,
                openNewCaseModal,
                openDisciplineModal,
                openStudent360Modal,
            }}
        >
            {children}

            {/* Student 360 Modal */}
            <Student360Modal
                isOpen={isStudent360Open}
                onClose={() => setIsStudent360Open(false)}
                student={selectedStudent360}
                onFollowUp={(st) => {
                    openFollowupModal({
                        studentId: st.studentId || st.id,
                        studentName: `${st.studentName} (${st.class})`,
                        studentPhone: st.parentPhone,
                        note: `Tindak lanjut pemicu risiko: ${st.summary}`,
                    });
                }}
                onContactParent={(st) => {
                    openParentContactModal({
                        studentId: st.studentId || st.id,
                        studentName: `${st.studentName} (${st.class})`,
                        studentPhone: st.parentPhone,
                        message: `Yth. Bapak/Ibu ${st.parentName}, kami dari sekolah mengonfirmasi perkembangan ananda ${st.studentName}. ${st.summary}. Mohon berkenan berkoordinasi dengan sekolah.`,
                    });
                }}
                onEscalateCase={(st) => {
                    openNewCaseModal({
                        studentId: st.studentId || st.id,
                        studentName: `${st.studentName} (${st.class})`,
                        desc: `Eskalasi dari Early Warning: ${st.summary}`,
                    });
                }}
            />

            {/* Follow-up Modal */}
            {isFollowupOpen && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="size-4 text-amber-500" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Buat Tindak Lanjut / Follow-up Siswa
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFollowupOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSaveFollowup}
                            className="space-y-3"
                        >
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Target Siswa
                                </label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) =>
                                        setStudentName(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Jenis Follow-up
                                    </label>
                                    <select
                                        value={followupType}
                                        onChange={(e) =>
                                            setFollowupType(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Panggilan Orang Tua">
                                            Panggilan Orang Tua
                                        </option>
                                        <option value="Konseling Tatap Muka BK">
                                            Konseling Tatap Muka BK
                                        </option>
                                        <option value="Home Visit (Kunjungan Rumah)">
                                            Home Visit (Kunjungan Rumah)
                                        </option>
                                        <option value="Remidial / Pembinaan Belajar">
                                            Remidial / Pembinaan Belajar
                                        </option>
                                        <option value="Perjanjian Komitmen Siswa">
                                            Perjanjian Komitmen Siswa
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Penanggung Jawab (PIC)
                                    </label>
                                    <select
                                        value={followupAssignee}
                                        onChange={(e) =>
                                            setFollowupAssignee(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Wali Kelas (Hendra Setiawan, S.Pd)">
                                            Wali Kelas (Hendra Setiawan, S.Pd)
                                        </option>
                                        <option value="Guru BK (Rahmawati, S.Pd)">
                                            Guru BK (Rahmawati, S.Pd)
                                        </option>
                                        <option value="Kesiswaan (Bpk. Faisal)">
                                            Kesiswaan (Bpk. Faisal)
                                        </option>
                                        <option value="Tim Satgas ATS">
                                            Tim Satgas ATS
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan / Rencana Tindakan
                                </label>
                                <textarea
                                    rows={3}
                                    value={followupNote}
                                    onChange={(e) =>
                                        setFollowupNote(e.target.value)
                                    }
                                    placeholder="Jelaskan langkah konkret yang akan diambil dan batas waktu tindak lanjut..."
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsFollowupOpen(false)}
                                    className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800"
                                >
                                    Simpan Follow-up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Parent Contact Modal */}
            {isParentContactOpen && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <PhoneCall className="size-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Kirim Pesan Resmi Sekolah ke Orang Tua
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsParentContactOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSendParentMessage}
                            className="space-y-3"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Nama Siswa
                                    </label>
                                    <input
                                        type="text"
                                        value={studentName}
                                        readOnly
                                        className="w-full rounded-lg border border-slate-300 bg-slate-100 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori Pesan
                                    </label>
                                    <select
                                        value={parentCategory}
                                        onChange={(e) =>
                                            setParentCategory(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Kehadiran">
                                            Kehadiran / Keterlambatan
                                        </option>
                                        <option value="Akademik">
                                            Perkembangan Nilai & Tugas
                                        </option>
                                        <option value="Kedisiplinan">
                                            Pembinaan Perilaku & Tata Tertib
                                        </option>
                                        <option value="Pengumuman">
                                            Pengumuman & Agenda Penting
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Isi Pesan Resmi Sekolah
                                </label>
                                <textarea
                                    rows={4}
                                    value={parentMessage}
                                    onChange={(e) =>
                                        setParentMessage(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-[11px] leading-relaxed text-slate-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-slate-300">
                                <strong>
                                    Fitur Acknowledgement TANGGAPIN:
                                </strong>{' '}
                                Orang tua akan menerima opsi konfirmasi status
                                pembacaan (Sudah Membaca / Butuh Koordinasi
                                Lanjutan) demi kepastian informasi.
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsParentContactOpen(false)
                                    }
                                    className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"
                                >
                                    <Send className="size-3.5" />
                                    Kirim Pesan Resmi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* New Case Modal */}
            {isNewCaseOpen && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="size-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Buka Kasus BK & Kesiswaan (Modul 03)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNewCaseOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCase} className="space-y-3">
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Siswa
                                </label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) =>
                                        setStudentName(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori Kasus
                                    </label>
                                    <select
                                        value={caseCategory}
                                        onChange={(e) =>
                                            setCaseCategory(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Kedisiplinan">
                                            Kedisiplinan & Tata Tertib
                                        </option>
                                        <option value="Kehadiran">
                                            Kehadiran (Alpa / Bolos Berulang)
                                        </option>
                                        <option value="Akademik">
                                            Akademik & Penurunan Nilai
                                        </option>
                                        <option value="Sosial">
                                            Sosial / Konflik Pertemanan
                                        </option>
                                        <option value="Sosial & Perlindungan">
                                            Perlindungan Siswa &
                                            Anti-Perundungan
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Tingkat Prioritas
                                    </label>
                                    <select
                                        value={casePriority}
                                        onChange={(e) =>
                                            setCasePriority(
                                                e.target.value as any,
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Tinggi">
                                            Tinggi (Butuh tindakan &lt;24 jam)
                                        </option>
                                        <option value="Sedang">
                                            Sedang (Konseling terjadwal)
                                        </option>
                                        <option value="Rendah">
                                            Rendah (Pemantauan biasa)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Deskripsi Kasus & Kronologi
                                </label>
                                <textarea
                                    rows={3}
                                    value={caseDesc}
                                    onChange={(e) =>
                                        setCaseDesc(e.target.value)
                                    }
                                    placeholder="Jelaskan ringkasan peristiwa, indikasi, atau laporan saksi..."
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsNewCaseOpen(false)}
                                    className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800"
                                >
                                    Daftarkan Kasus Baru
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Discipline Modal */}
            {isDisciplineOpen && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs fade-in">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Scale className="size-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Catat Pelanggaran & Pembinaan (Modul 05)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDisciplineOpen(false)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleCreateDiscipline}
                            className="space-y-3"
                        >
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Target Siswa
                                </label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) =>
                                        setStudentName(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Jenis Pelanggaran
                                    </label>
                                    <select
                                        value={infraction}
                                        onChange={(e) =>
                                            setInfraction(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value="Terlambat Masuk Sekolah">
                                            Terlambat Masuk Sekolah (&gt;15
                                            menit)
                                        </option>
                                        <option value="Atribut Seragam Tidak Lengkap">
                                            Atribut Seragam Tidak Lengkap
                                        </option>
                                        <option value="Keluar Sekolah Tanpa Surat Izin">
                                            Keluar Sekolah Tanpa Surat Izin
                                        </option>
                                        <option value="Menggunakan HP di Jam Belajar">
                                            Menggunakan HP di Jam Belajar
                                        </option>
                                        <option value="Konflik Antar Siswa / Perilaku Tidak Sopan">
                                            Konflik Antar Siswa / Perilaku
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                        Poin Pelanggaran
                                    </label>
                                    <select
                                        value={points}
                                        onChange={(e) =>
                                            setPoints(Number(e.target.value))
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    >
                                        <option value={5}>
                                            5 Poin (Ringan)
                                        </option>
                                        <option value={10}>
                                            10 Poin (Sedang)
                                        </option>
                                        <option value={15}>
                                            15 Poin (Perhatian Khusus)
                                        </option>
                                        <option value={25}>
                                            25 Poin (Berat / Konseling BK)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan Pola & Rencana Tindakan Restoratif
                                </label>
                                <textarea
                                    rows={3}
                                    value={disciplineNotes}
                                    onChange={(e) =>
                                        setDisciplineNotes(e.target.value)
                                    }
                                    placeholder="Jelaskan tindakan pembinaan karakter yang disepakati bersama siswa..."
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsDisciplineOpen(false)}
                                    className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800"
                                >
                                    Simpan Catatan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ActionModalsContext.Provider>
    );
}
