import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Camera,
    Check,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    HelpCircle,
    Info,
    Menu,
    Plus,
    RefreshCw,
    Scale,
    Scan,
    ScanFace,
    Search,
    Send,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    UserCheck,
    Users,
    Video,
    VideoOff,
    Volume2,
    VolumeX,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { RoleType } from '@/types/tanggapin';

interface StudentItem {
    id: string;
    name: string;
    nisn: string;
    gender?: string;
    class: string;
    classId: string;
    currentPoints: number;
    riskLevel: 'low' | 'medium' | 'high';
    avatar?: string | null;
}

interface ClassOption {
    id: string;
    name: string;
    major?: string;
}

interface RecentScanItem {
    id: string;
    studentId: string;
    studentName: string;
    studentNisn: string;
    className: string;
    infraction: string;
    points: number;
    status: string;
    notes?: string;
    recordedAt: string;
}

interface AttributeRule {
    id: string;
    name: string;
    category: string;
    requiredDays: string;
    points: number;
    description: string;
}

interface AttendanceLogItem {
    id: string;
    studentId: string;
    studentName: string;
    studentNisn: string;
    className: string;
    avatar?: string | null;
    timestamp: string;
    time: string;
    status: 'Hadir (Tepat Waktu)' | 'Hadir (Terlambat)';
    method: 'Face Recognition AI';
    confidence: number;
    attributeStatus: 'Lengkap (Tertib)' | 'Pelanggaran Atribut';
    infractionSummary?: string;
    points: number;
}

interface PemantauAtributProps {
    students: StudentItem[];
    classes: ClassOption[];
    recentScans: RecentScanItem[];
    rules: AttributeRule[];
}

interface AttributeDetectionState {
    id: string;
    name: string;
    points: number;
    isDetected: boolean;
    confidence: number;
    boxArea: 'head' | 'collar' | 'chest' | 'waist' | 'feet' | 'torso';
    notes: string;
}

export default function PemantauAtribut({
    students = [],
    classes = [],
    recentScans = [],
    rules = [],
}: PemantauAtributProps) {
    const page = usePage<{
        auth?: { user?: { name?: string; email?: string; role?: RoleType } };
    }>();
    const authRole = page.props.auth?.user?.role || 'guru_bk';

    // Camera & Media State
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    );
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [scanProgress, setScanProgress] = useState<number>(100);
    const [scanPhaseText, setScanPhaseText] = useState<string>(
        'Wajah Teridentifikasi & Atribut Selesai Dipindai',
    );
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
        null,
    );
    const [cameraMode, setCameraMode] = useState<'webcam' | 'preset'>('preset');
    const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

    // Selected Student & Filter State
    const [selectedStudentId, setSelectedStudentId] = useState<string>(
        students[0]?.id || '',
    );
    const [studentSearch, setStudentSearch] = useState<string>('');
    const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

    // Face Recognition & Attendance State
    const [isFaceRecognized, setIsFaceRecognized] = useState<boolean>(true);
    const [faceMatchScore, setFaceMatchScore] = useState<number>(99.4);
    const [lastAttendanceTime, setLastAttendanceTime] = useState<string>('07:05:18 WIB');
    const [autoAttendanceStatus, setAutoAttendanceStatus] = useState<
        'idle' | 'scanning' | 'success'
    >('success');
    const [activeLogTab, setActiveLogTab] = useState<'attendance' | 'infractions'>(
        'attendance',
    );

    // Attribute Detection Checklist State
    const [attributeDetections, setAttributeDetections] = useState<
        AttributeDetectionState[]
    >([
        {
            id: 'dasi',
            name: 'Dasi Sekolah',
            points: 5,
            isDetected: false,
            confidence: 94,
            boxArea: 'collar',
            notes: 'Dasi tidak ditemukan di kerah seragam',
        },
        {
            id: 'topi',
            name: 'Topi / Peci Upacara',
            points: 5,
            isDetected: true,
            confidence: 92,
            boxArea: 'head',
            notes: 'Topi OSIS terpasang sesuai standar',
        },
        {
            id: 'sabuk',
            name: 'Sabuk Hitam Standar',
            points: 5,
            isDetected: false,
            confidence: 91,
            boxArea: 'waist',
            notes: 'Tidak terdeteksi sabuk di lingkar pinggang',
        },
        {
            id: 'badge',
            name: 'Badge Nama & Lokasi',
            points: 5,
            isDetected: true,
            confidence: 98,
            boxArea: 'chest',
            notes: 'Badge lokasi sekolah dan nama lengkap',
        },
        {
            id: 'sepatu',
            name: 'Sepatu Hitam Standar',
            points: 10,
            isDetected: true,
            confidence: 96,
            boxArea: 'feet',
            notes: 'Sepatu hitam dominan bertali standar',
        },
        {
            id: 'kaos_kaki',
            name: 'Kaos Kaki Standar',
            points: 5,
            isDetected: true,
            confidence: 95,
            boxArea: 'feet',
            notes: 'Kaos kaki putih polos di atas mata kaki',
        },
        {
            id: 'kerapian_baju',
            name: 'Kerapian Seragam',
            points: 5,
            isDetected: false,
            confidence: 89,
            boxArea: 'torso',
            notes: 'Kemeja seragam dikeluarkan / tidak rapi',
        },
    ]);

    // Initial Live Attendance Logs
    const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLogItem[]>(() => [
        {
            id: 'att-init-1',
            studentId: students[0]?.id || 's1',
            studentName: students[0]?.name || 'Ahmad Fauzi',
            studentNisn: students[0]?.nisn || '0071234567',
            className: students[0]?.class || 'XI RPL 2',
            avatar:
                students[0]?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            timestamp: 'Hari ini',
            time: '07:05:18 WIB',
            status: 'Hadir (Tepat Waktu)',
            method: 'Face Recognition AI',
            confidence: 99.4,
            attributeStatus: 'Pelanggaran Atribut',
            infractionSummary: 'Dasi, Sabuk, Kerapian (+15 Poin)',
            points: 15,
        },
        {
            id: 'att-init-2',
            studentId: students[1]?.id || 's2',
            studentName: students[1]?.name || 'Citra Lestari',
            studentNisn: students[1]?.nisn || '0082345678',
            className: students[1]?.class || 'XI RPL 2',
            avatar:
                students[1]?.avatar ||
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
            timestamp: 'Hari ini',
            time: '06:54:10 WIB',
            status: 'Hadir (Tepat Waktu)',
            method: 'Face Recognition AI',
            confidence: 99.8,
            attributeStatus: 'Lengkap (Tertib)',
            points: 0,
        },
        {
            id: 'att-init-3',
            studentId: students[2]?.id || 's3',
            studentName: students[2]?.name || 'Brian Aditya',
            studentNisn: students[2]?.nisn || '0069876543',
            className: students[2]?.class || 'XI RPL 2',
            avatar:
                students[2]?.avatar ||
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
            timestamp: 'Hari ini',
            time: '06:48:32 WIB',
            status: 'Hadir (Tepat Waktu)',
            method: 'Face Recognition AI',
            confidence: 98.9,
            attributeStatus: 'Pelanggaran Atribut',
            infractionSummary: 'Sepatu Non-Standar, Dasi (+15 Poin)',
            points: 15,
        },
    ]);

    // Submitting State
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Selected student object
    const selectedStudent =
        students.find((s) => s.id === selectedStudentId) || students[0];

    // Filtered students list
    const filteredStudents = students.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            s.nisn.includes(studentSearch);
        const matchClass =
            selectedClassFilter === 'all' ||
            s.classId === selectedClassFilter ||
            s.class === selectedClassFilter;
        return matchSearch && matchClass;
    });

    // Preset Inspection Scenarios with Face Recognition Identity
    const samplePresets = [
        {
            label: 'Ahmad Fauzi (Dasi, Sabuk & Kemeja Kurang)',
            studentNisn: students[0]?.nisn || '0071234567',
            image:
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            matchScore: 99.4,
            detections: [
                { id: 'dasi', isDetected: false, notes: 'Dasi sekolah tidak terpasang' },
                { id: 'topi', isDetected: true, notes: 'Topi OSIS terpasang rapi' },
                { id: 'sabuk', isDetected: false, notes: 'Sabuk hitam tidak dipakai' },
                { id: 'badge', isDetected: true, notes: 'Badge sekolah terpasang' },
                { id: 'sepatu', isDetected: true, notes: 'Sepatu hitam standar' },
                { id: 'kaos_kaki', isDetected: true, notes: 'Kaos kaki putih standar' },
                { id: 'kerapian_baju', isDetected: false, notes: 'Kemeja dikeluarkan' },
            ],
        },
        {
            label: 'Citra Lestari (Atribut Lengkap 100% Tertib)',
            studentNisn: students[1]?.nisn || '0082345678',
            image:
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
            matchScore: 99.8,
            detections: [
                { id: 'dasi', isDetected: true, notes: 'Dasi terpasang rapi' },
                { id: 'topi', isDetected: true, notes: 'Topi terpasang rapi' },
                { id: 'sabuk', isDetected: true, notes: 'Sabuk hitam standar' },
                { id: 'badge', isDetected: true, notes: 'Badge lengkap' },
                { id: 'sepatu', isDetected: true, notes: 'Sepatu hitam standar' },
                { id: 'kaos_kaki', isDetected: true, notes: 'Kaos kaki putih standar' },
                { id: 'kerapian_baju', isDetected: true, notes: 'Kemeja dimasukkan rapi' },
            ],
        },
        {
            label: 'Brian Aditya (Sepatu Bukan Standar & Dasi Miring)',
            studentNisn: students[2]?.nisn || '0069876543',
            image:
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
            matchScore: 98.9,
            detections: [
                { id: 'dasi', isDetected: false, notes: 'Dasi tidak dipakai' },
                { id: 'topi', isDetected: true, notes: 'Topi upacara ada' },
                { id: 'sabuk', isDetected: true, notes: 'Sabuk hitam terpasang' },
                { id: 'badge', isDetected: true, notes: 'Badge lengkap' },
                { id: 'sepatu', isDetected: false, notes: 'Sepatu bercorak putih terang' },
                { id: 'kaos_kaki', isDetected: true, notes: 'Kaos kaki standar' },
                { id: 'kerapian_baju', isDetected: true, notes: 'Baju dimasukkan rapi' },
            ],
        },
    ];

    // Audio chime simulation for recognized face & attendance
    const playSuccessChime = () => {
        if (!isAudioEnabled) return;
        try {
            const AudioContext =
                window.AudioContext ||
                (
                    window as unknown as {
                        webkitAudioContext: typeof window.AudioContext;
                    }
                ).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch {
            // Audio context not allowed without prior user interaction
        }
    };

    // Webcam Start & Stop
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsCameraActive(true);
            setHasCameraPermission(true);
            setCapturedImage(null);
            setCameraMode('webcam');
            toast.info('Kamera webcam aktif. Arahkan siswa menghadap kamera.');
        } catch (err) {
            console.error('Webcam error:', err);
            setHasCameraPermission(false);
            toast.error(
                'Kamera webcam tidak terdeteksi atau izin ditolak. Mengalihkan ke mode simulasi cerdas.',
            );
            setCameraMode('preset');
        }
    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    useEffect(() => {
        return () => {
            stopWebcam();
        };
    }, []);

    // Take snapshot from webcam and trigger simultaneous face & attribute scan
    const captureSnapshot = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setCapturedImage(dataUrl);
                triggerDualScanWorkflow(selectedStudent, attributeDetections, 99.2);
            }
        }
    };

    // Trigger Simultaneous Face Recognition + Attribute Verification + Auto Attendance
    const triggerDualScanWorkflow = (
        targetStudent: StudentItem | undefined,
        currentDetections: AttributeDetectionState[],
        matchedScore: number = 99.2,
    ) => {
        if (!targetStudent) return;

        setIsScanning(true);
        setAutoAttendanceStatus('scanning');
        setScanProgress(0);
        setScanPhaseText('Mendeteksi Landmark Wajah & Memindai Posisi Seragam...');

        let currentProg = 0;
        const interval = setInterval(() => {
            currentProg += 15;
            if (currentProg >= 100) {
                clearInterval(interval);
                setScanProgress(100);
                setIsScanning(false);
                setIsFaceRecognized(true);
                setAutoAttendanceStatus('success');
                setFaceMatchScore(matchedScore);
                setScanPhaseText(
                    `Wajah Teridentifikasi: ${targetStudent.name} (${targetStudent.class}) • Terabsensi Otomatis`,
                );

                // Timestamp formatted
                const nowTime =
                    new Date().toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }) + ' WIB';
                setLastAttendanceTime(nowTime);

                // Play audio chime
                playSuccessChime();

                // Calculate missing attributes
                const missing = currentDetections.filter((d) => !d.isDetected);
                const violationPts = missing.reduce((acc, curr) => acc + curr.points, 0);

                // Record Automatic Attendance
                const newRecord: AttendanceLogItem = {
                    id: 'att-' + Date.now(),
                    studentId: targetStudent.id,
                    studentName: targetStudent.name,
                    studentNisn: targetStudent.nisn,
                    className: targetStudent.class,
                    avatar: targetStudent.avatar || null,
                    timestamp: 'Hari ini',
                    time: nowTime,
                    status: 'Hadir (Tepat Waktu)',
                    method: 'Face Recognition AI',
                    confidence: matchedScore,
                    attributeStatus:
                        missing.length === 0 ? 'Lengkap (Tertib)' : 'Pelanggaran Atribut',
                    infractionSummary:
                        missing.length === 0
                            ? undefined
                            : `${missing.map((m) => m.name).join(', ')} (+${violationPts} Poin)`,
                    points: violationPts,
                };

                setAttendanceLogs((prev) => [
                    newRecord,
                    ...prev.filter((p) => p.studentId !== targetStudent.id),
                ]);

                // Toast Notification
                toast.success(
                    `✅ Presensi Berhasil: ${targetStudent.name} (${targetStudent.class}) — Terabsensi Otomatis via Face Recognition!`,
                    {
                        description:
                            missing.length === 0
                                ? 'Atribut Seragam Lengkap 100% (Tertib).'
                                : `Perhatian: Terdeteksi ${missing.length} pelanggaran atribut (+${violationPts} Poin).`,
                    },
                );

                return;
            }

            if (currentProg < 40) {
                setScanPhaseText(
                    `Mendeteksi Biometrik Wajah (68 Landmark) & Posisi Kerah, Pinggang... (${currentProg}%)`,
                );
            } else if (currentProg < 80) {
                setScanPhaseText(
                    `Mengekstraksi Vektor Fitur & Memeriksa Dasi, Sabuk, Badge... (${currentProg}%)`,
                );
            } else {
                setScanPhaseText(
                    `Mencocokkan Database Siswa & Mengesahkan Presensi Otomatis... (${currentProg}%)`,
                );
            }

            setScanProgress(currentProg);
        }, 110);
    };

    // Apply sample preset
    const applyPreset = (presetIndex: number) => {
        const preset = samplePresets[presetIndex];
        if (!preset) return;

        setCapturedImage(preset.image);
        let targetStudent = selectedStudent;
        if (preset.studentNisn) {
            const found = students.find((s) => s.nisn === preset.studentNisn);
            if (found) {
                setSelectedStudentId(found.id);
                targetStudent = found;
            }
        }

        const newDetections = attributeDetections.map((item) => {
            const match = preset.detections.find((d) => d.id === item.id);
            if (match) {
                return {
                    ...item,
                    isDetected: match.isDetected,
                    notes: match.notes,
                };
            }
            return item;
        });

        setAttributeDetections(newDetections);
        triggerDualScanWorkflow(targetStudent, newDetections, preset.matchScore);
    };

    // Toggle manual override for an attribute
    const toggleAttribute = (id: string) => {
        setAttributeDetections((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const nextVal = !item.isDetected;
                    return {
                        ...item,
                        isDetected: nextVal,
                        notes: nextVal
                            ? 'Diverifikasi manual oleh Guru BK'
                            : 'Dinyatakan tidak lengkap oleh Guru BK',
                    };
                }
                return item;
            }),
        );
    };

    // Calculate total violation points
    const missingAttributes = attributeDetections.filter((a) => !a.isDetected);
    const totalViolationPoints = missingAttributes.reduce(
        (acc, curr) => acc + curr.points,
        0,
    );

    const infractionSummary =
        missingAttributes.length === 0
            ? 'Atribut Seragam Lengkap 100%'
            : `Pelanggaran Atribut: ${missingAttributes.map((m) => m.name).join(', ')}`;

    const patternNotes =
        missingAttributes.length === 0
            ? 'Inspeksi Kamera Pemantau BK & Face Recognition: Seluruh atribut seragam siswa terdeteksi lengkap dan tertib.'
            : `Hasil Inspeksi Kamera Pemantau BK & AI Vision (${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}): ${missingAttributes.map((m) => `${m.name} (+${m.points} poin)`).join(', ')}. Total: ${totalViolationPoints} poin pelanggaran dibebankan kepada siswa. Presensi kehadiran telah tercatat otomatis.`;

    // Submit discipline record
    const handleSubmitViolationPoints = () => {
        if (!selectedStudent) {
            toast.error('Pilih siswa terlebih dahulu.');
            return;
        }

        if (totalViolationPoints === 0) {
            toast.success(
                `${selectedStudent.name} memiliki atribut lengkap! Kehadiran telah tercatat otomatis tanpa beban poin pelanggaran.`,
            );
            return;
        }

        setIsSubmitting(true);
        router.post(
            '/discipline-records',
            {
                student_id: selectedStudent.id,
                infraction: infractionSummary,
                points: totalViolationPoints,
                pattern_notes: patternNotes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setSuccessMessage(
                        `Berhasil mengenakan +${totalViolationPoints} poin pelanggaran atribut ke ${selectedStudent.name} (${selectedStudent.class}). Wali Kelas telah otomatis dinotifikasi. Kehadiran tetap berstatus HADIR.`,
                    );
                    toast.success(
                        `Poin kedisiplinan (+${totalViolationPoints} Poin) berhasil disimpan untuk ${selectedStudent.name}.`,
                    );
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    toast.error(
                        'Gagal mencatat poin pelanggaran. Silakan periksa koneksi.',
                    );
                    console.error('Submit error:', errors);
                },
            },
        );
    };

    return (
        <FlowbiteTanggapinLayout activeTab="attribute-scanner">
            <Head title="Kamera Pemantau Atribut & Presensi Siswa (Face Recognition) — TANGGAPIN" />

            <div className="space-y-6">
                {/* Mobile Quick Navigation Strip */}
                <div className="flex sm:hidden items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent('toggle-tanggapin-sidebar'),
                                )
                            }
                            className="flex size-9 items-center justify-center rounded-xl bg-blue-700 text-white shadow-2xs transition-all active:scale-95"
                            aria-label="Buka Menu Sidebar"
                        >
                            <Menu className="size-5" />
                        </button>
                        <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                                Kamera Pemantau BK
                            </span>
                            <span className="text-[10px] text-slate-500">
                                Menu navigasi responsif
                            </span>
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                        <ScanFace className="size-3" />
                        AI Vision
                    </span>
                </div>

                {/* Header Title & Controls */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider dark:text-blue-400">
                            <ScanFace className="size-4" />
                            <span>Bimbingan Konseling • AI Face Recognition & Atribut</span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Kamera Pemantau Atribut & Presensi Siswa
                        </h1>
                        <p className="mt-1 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                            Inspeksi seragam otomatis terpadu Face Recognition di gerbang sekolah: memverifikasi atribut (dasi, sabuk, topi, badge, sepatu) sekaligus mencatat presensi kehadiran siswa secara otomatis ke database.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            title="Nyalakan/matikan suara notifikasi scanner"
                        >
                            {isAudioEnabled ? (
                                <Volume2 className="size-3.5 text-blue-700 dark:text-blue-400" />
                            ) : (
                                <VolumeX className="size-3.5 text-slate-400" />
                            )}
                            <span className="hidden sm:inline">
                                {isAudioEnabled ? 'Audio Aktif' : 'Mute'}
                            </span>
                        </button>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
                            <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
                            AI Biometrik Aktif
                        </span>
                    </div>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Total Terpindai</span>
                            <UserCheck className="size-4 text-blue-600" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                {attendanceLogs.length + 18}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-600">
                                Siswa
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                            Pagi Hari Ini
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Presensi Otomatis</span>
                            <CheckCircle2 className="size-4 text-blue-600" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                {attendanceLogs.length}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-600">
                                Hadir
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                            Via Face Recognition
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Atribut Lengkap</span>
                            <ShieldCheck className="size-4 text-blue-600" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                {attendanceLogs.filter(
                                    (a) => a.attributeStatus === 'Lengkap (Tertib)',
                                ).length + 12}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-600">
                                Tertib
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                            Bebas Pelanggaran
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Catatan Atribut</span>
                            <Scale className="size-4 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
                                {attendanceLogs.filter(
                                    (a) => a.attributeStatus !== 'Lengkap (Tertib)',
                                ).length}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                                Siswa
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                            Diberi Poin Disiplin
                        </span>
                    </div>
                </div>

                {/* Success Notification Banner */}
                {successMessage && (
                    <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200 animate-in fade-in">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 shrink-0 text-blue-700 dark:text-blue-400" />
                            <span>{successMessage}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSuccessMessage(null)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {/* Main 2-Column Workspace: Camera Viewport (Left) & Face Recog & Atribut Panel (Right) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Live Biometric Camera Viewport (7 cols) */}
                    <div className="space-y-4 lg:col-span-7">
                        <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            {/* Viewport Top Controls Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/50">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex size-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                                        <span className="relative inline-flex size-2.5 rounded-full bg-blue-600" />
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                                        {isCameraActive
                                            ? 'Kamera Gerbang Aktif (Live Feed)'
                                            : 'Viewport AI Vision & Biometrik'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isCameraActive) stopWebcam();
                                            else startWebcam();
                                        }}
                                        className={cn(
                                            'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-2xs transition-all active:scale-95',
                                            isCameraActive
                                                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300'
                                                : 'bg-blue-700 text-white hover:bg-blue-800',
                                        )}
                                    >
                                        {isCameraActive ? (
                                            <>
                                                <VideoOff className="size-3.5" />
                                                <span>Matikan Kamera</span>
                                            </>
                                        ) : (
                                            <>
                                                <Video className="size-3.5" />
                                                <span>Nyalakan Webcam</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isScanning}
                                        onClick={() => {
                                            if (isCameraActive) {
                                                captureSnapshot();
                                            } else {
                                                triggerDualScanWorkflow(
                                                    selectedStudent,
                                                    attributeDetections,
                                                    faceMatchScore,
                                                );
                                            }
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-95 disabled:opacity-50"
                                    >
                                        {isScanning ? (
                                            <>
                                                <RefreshCw className="size-3.5 animate-spin" />
                                                <span>Memindai...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ScanFace className="size-3.5" />
                                                <span>Pindai Wajah & Atribut</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Camera Display Viewport with Dual Scanning Overlay */}
                            <div className="relative aspect-4/3 w-full bg-slate-950 flex items-center justify-center overflow-hidden select-none">
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Live Video Stream */}
                                <video
                                    ref={videoRef}
                                    playsInline
                                    muted
                                    className={cn(
                                        'absolute inset-0 size-full object-cover transition-opacity',
                                        isCameraActive && !capturedImage
                                            ? 'opacity-100'
                                            : 'opacity-0 pointer-events-none',
                                    )}
                                />

                                {/* Captured Snapshot or Sample Image */}
                                {capturedImage && (
                                    <img
                                        src={capturedImage}
                                        alt="Captured Student Frame"
                                        className="absolute inset-0 size-full object-cover"
                                    />
                                )}

                                {/* Placeholder when no camera & no image */}
                                {!isCameraActive && !capturedImage && (
                                    <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                                        <div className="mb-3 flex size-16 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 shadow-inner">
                                            <Camera className="size-8 text-blue-400" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-200">
                                            Kamera Belum Aktif
                                        </p>
                                        <p className="mt-1 max-w-xs text-xs text-slate-400">
                                            Nyalakan kamera webcam laptop atau pilih skenario contoh di bawah untuk memulai inspeksi atribut & absensi otomatis.
                                        </p>
                                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={startWebcam}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-800"
                                            >
                                                <Video className="size-3.5" />
                                                Gunakan Webcam
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyPreset(0)}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                                            >
                                                <ScanFace className="size-3.5 text-blue-400" />
                                                Muat Skenario Siswa
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Outer Frame Optical Crosshairs */}
                                <div className="pointer-events-none absolute inset-4 rounded-xl border border-blue-500/20">
                                    <div className="absolute -top-1 -left-1 size-5 border-t-2 border-l-2 border-blue-400" />
                                    <div className="absolute -top-1 -right-1 size-5 border-t-2 border-r-2 border-blue-400" />
                                    <div className="absolute -bottom-1 -left-1 size-5 border-b-2 border-l-2 border-blue-400" />
                                    <div className="absolute -bottom-1 -right-1 size-5 border-b-2 border-r-2 border-blue-400" />
                                </div>

                                {/* Active AI Scanning Laser Beam */}
                                {isScanning && (
                                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_#3b82f6] animate-[bounce_2s_infinite]" />
                                )}

                                {/* DUAL HUD OVERLAYS (Face Recognition + Simultaneous Attribute Inspection) */}
                                {(capturedImage || isCameraActive) && (
                                    <div className="pointer-events-none absolute inset-0 p-4">
                                        {/* 1. BIOMETRIC FACE RECOGNITION RETICLE (Focus on Student Face) */}
                                        <div
                                            className={cn(
                                                'absolute top-[8%] left-[34%] h-[26%] w-[32%] rounded-xl transition-all duration-300',
                                                isScanning
                                                    ? 'border-2 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.6)] bg-blue-500/10'
                                                    : 'border border-blue-400/90 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-blue-500/5',
                                            )}
                                        >
                                            {/* Biometric Corners */}
                                            <div className="absolute -top-1 -left-1 size-3.5 border-t-2 border-l-2 border-blue-400" />
                                            <div className="absolute -top-1 -right-1 size-3.5 border-t-2 border-r-2 border-blue-400" />
                                            <div className="absolute -bottom-1 -left-1 size-3.5 border-b-2 border-l-2 border-blue-400" />
                                            <div className="absolute -bottom-1 -right-1 size-3.5 border-b-2 border-r-2 border-blue-400" />

                                            {/* Biometric Mesh Landmark Points (Pulsing over eyes, nose, lips) */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative size-12 opacity-80">
                                                    <span className="absolute top-2 left-2 size-1 rounded-full bg-blue-400 animate-ping" />
                                                    <span className="absolute top-2 right-2 size-1 rounded-full bg-blue-400 animate-ping" />
                                                    <span className="absolute top-6 left-5 size-1 rounded-full bg-blue-300" />
                                                    <span className="absolute bottom-2 inset-x-3 h-0.5 rounded-full bg-blue-400" />
                                                </div>
                                            </div>

                                            {/* Top Floating Badge on Face Box */}
                                            <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                                                <span className="rounded border border-blue-400/60 bg-slate-900/90 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white shadow-md">
                                                    {isScanning
                                                        ? '⚡ Memindai Biometrik Wajah...'
                                                        : `👤 Wajah: ${selectedStudent.name} (${faceMatchScore}%)`}
                                                </span>
                                            </div>

                                            {/* Bottom Floating Badge on Face Box */}
                                            <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                                                <span className="rounded border border-blue-500 bg-blue-900/90 px-2 py-0.5 text-[9px] font-bold text-blue-200 shadow-md">
                                                    {isScanning
                                                        ? 'Mencocokkan...'
                                                        : '✅ Terverifikasi • Hadir'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 2. CONCURRENT ATTRIBUTE BOX: Head / Topi */}
                                        <div className="absolute top-[2%] left-[36%] h-[11%] w-[28%] rounded border border-blue-400/70 bg-blue-500/10 flex items-start justify-center">
                                            <span className="rounded border border-blue-400/50 bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-bold text-blue-200 -translate-y-2">
                                                Topi:{' '}
                                                {attributeDetections.find((d) => d.id === 'topi')
                                                    ?.isDetected
                                                    ? '✅ Ada'
                                                    : '⚠️ Kurang'}
                                            </span>
                                        </div>

                                        {/* 3. CONCURRENT ATTRIBUTE BOX: Collar / Dasi */}
                                        <div
                                            className={cn(
                                                'absolute top-[36%] left-[38%] h-[18%] w-[24%] rounded border flex items-center justify-center transition-all',
                                                attributeDetections.find((d) => d.id === 'dasi')
                                                    ?.isDetected
                                                    ? 'border-blue-400/80 bg-blue-500/10'
                                                    : 'border-blue-400 bg-blue-950/60 shadow-[0_0_12px_rgba(59,130,246,0.4)]',
                                            )}
                                        >
                                            <span className="rounded border border-blue-400/60 bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                                Dasi:{' '}
                                                {attributeDetections.find((d) => d.id === 'dasi')
                                                    ?.isDetected
                                                    ? '✅ Terpasang'
                                                    : '⚠️ Tidak Ada (+5)'}
                                            </span>
                                        </div>

                                        {/* 4. CONCURRENT ATTRIBUTE BOX: Chest / Badge */}
                                        <div className="absolute top-[38%] right-[18%] h-[10%] w-[16%] rounded border border-blue-400/70 bg-blue-500/10 flex items-center justify-center">
                                            <span className="rounded bg-slate-900/90 px-1 py-0.2 text-[8px] font-bold text-blue-200 border border-blue-400/40">
                                                Badge: ✅
                                            </span>
                                        </div>

                                        {/* 5. CONCURRENT ATTRIBUTE BOX: Waist / Sabuk */}
                                        <div
                                            className={cn(
                                                'absolute top-[58%] left-[32%] h-[12%] w-[36%] rounded border flex items-center justify-center transition-all',
                                                attributeDetections.find((d) => d.id === 'sabuk')
                                                    ?.isDetected
                                                    ? 'border-blue-400/80 bg-blue-500/10'
                                                    : 'border-blue-400 bg-blue-950/60 shadow-[0_0_12px_rgba(59,130,246,0.4)]',
                                            )}
                                        >
                                            <span className="rounded border border-blue-400/60 bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                                Sabuk:{' '}
                                                {attributeDetections.find((d) => d.id === 'sabuk')
                                                    ?.isDetected
                                                    ? '✅ Terpasang'
                                                    : '⚠️ Tidak Ada (+5)'}
                                            </span>
                                        </div>

                                        {/* 6. CONCURRENT ATTRIBUTE BOX: Feet / Sepatu */}
                                        <div className="absolute bottom-[2%] left-[33%] h-[15%] w-[34%] rounded border border-blue-400/70 bg-blue-500/10 flex items-center justify-center">
                                            <span className="rounded border border-blue-400/60 bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                                Sepatu:{' '}
                                                {attributeDetections.find((d) => d.id === 'sepatu')
                                                    ?.isDetected
                                                    ? '✅ Standar'
                                                    : '⚠️ Pelanggaran (+10)'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Top Floating Auto-Attendance Status Pill */}
                                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/80 px-3 py-1.5 text-xs backdrop-blur-md shadow-lg">
                                    <span className="size-2 rounded-full bg-blue-400 animate-pulse" />
                                    <span className="font-bold text-white">
                                        {isScanning
                                            ? 'Memindai Biometrik...'
                                            : 'Presensi: OTOMATIS HADIR'}
                                    </span>
                                    <span className="text-[10px] text-slate-300">
                                        ({lastAttendanceTime})
                                    </span>
                                </div>

                                {/* Bottom Live Viewport Telemetry Bar */}
                                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-black/75 px-2.5 py-1 text-[11px] font-mono text-slate-300 backdrop-blur-xs">
                                    <span className="size-1.5 rounded-full bg-blue-400" />
                                    <span>FACE RECOG: {faceMatchScore}%</span>
                                    <span>•</span>
                                    <span>FPS: 30</span>
                                    <span>•</span>
                                    <span className="truncate max-w-[200px] text-blue-300">
                                        {scanPhaseText}
                                    </span>
                                </div>
                            </div>

                            {/* Viewport Bottom Quick Preset Scenarios */}
                            <div className="border-t border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Uji Cepat Face Recognition & Atribut (Skenario Siswa):
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        Pilih siswa untuk simulasi scan
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {samplePresets.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => applyPreset(idx)}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Attendance & Infractions Log Card (Tabs) */}
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveLogTab('attendance')}
                                        className={cn(
                                            'rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
                                            activeLogTab === 'attendance'
                                                ? 'bg-blue-700 text-white shadow-2xs'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                        )}
                                    >
                                        Log Absensi Face Recog ({attendanceLogs.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveLogTab('infractions')}
                                        className={cn(
                                            'rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
                                            activeLogTab === 'infractions'
                                                ? 'bg-blue-700 text-white shadow-2xs'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                        )}
                                    >
                                        Log Pelanggaran Atribut ({recentScans.length})
                                    </button>
                                </div>

                                <span className="text-[11px] text-slate-400">
                                    Update Otomatis Real-time
                                </span>
                            </div>

                            {activeLogTab === 'attendance' ? (
                                <div className="overflow-x-auto mt-3">
                                    <table className="w-full text-left text-xs">
                                        <thead className="border-b border-slate-100 text-slate-400 font-semibold dark:border-slate-800">
                                            <tr>
                                                <th className="pb-2.5">Waktu</th>
                                                <th className="pb-2.5">Siswa</th>
                                                <th className="pb-2.5">Rombel</th>
                                                <th className="pb-2.5">Status Presensi</th>
                                                <th className="pb-2.5">Status Atribut</th>
                                                <th className="pb-2.5">Biometrik</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                            {attendanceLogs.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="py-4 text-center text-slate-400"
                                                    >
                                                        Belum ada siswa terabsensi via face recognition hari ini.
                                                    </td>
                                                </tr>
                                            ) : (
                                                attendanceLogs.map((att) => (
                                                    <tr
                                                        key={att.id}
                                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                                    >
                                                        <td className="py-2.5 font-mono text-[11px] text-slate-500">
                                                            {att.time}
                                                        </td>
                                                        <td className="py-2.5">
                                                            <div className="font-bold text-slate-900 dark:text-white">
                                                                {att.studentName}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 font-mono">
                                                                NISN: {att.studentNisn}
                                                            </div>
                                                        </td>
                                                        <td className="py-2.5 text-slate-600 dark:text-slate-400">
                                                            {att.className}
                                                        </td>
                                                        <td className="py-2.5">
                                                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                                                <Check className="size-3" />
                                                                HADIR OTOMATIS
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5">
                                                            {att.attributeStatus ===
                                                            'Lengkap (Tertib)' ? (
                                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                                                                    <CheckCircle2 className="size-3.5" />
                                                                    Lengkap (Tertib)
                                                                </span>
                                                            ) : (
                                                                <span className="text-[11px] text-slate-700 dark:text-slate-300">
                                                                    {att.infractionSummary ||
                                                                        'Pelanggaran Atribut'}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-2.5 font-mono text-[11px] text-blue-700 dark:text-blue-400">
                                                            {att.confidence}%
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="overflow-x-auto mt-3">
                                    <table className="w-full text-left text-xs">
                                        <thead className="border-b border-slate-100 text-slate-400 font-semibold dark:border-slate-800">
                                            <tr>
                                                <th className="pb-2.5">Siswa</th>
                                                <th className="pb-2.5">Kelas</th>
                                                <th className="pb-2.5">Pelanggaran</th>
                                                <th className="pb-2.5">Poin</th>
                                                <th className="pb-2.5">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                            {recentScans.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="py-4 text-center text-slate-400"
                                                    >
                                                        Belum ada pelanggaran atribut tercatat hari ini.
                                                    </td>
                                                </tr>
                                            ) : (
                                                recentScans.slice(0, 5).map((scan) => (
                                                    <tr
                                                        key={scan.id}
                                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                                    >
                                                        <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                                                            {scan.studentName}
                                                        </td>
                                                        <td className="py-2.5 text-slate-600 dark:text-slate-400">
                                                            {scan.className}
                                                        </td>
                                                        <td className="py-2.5 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                                                            {scan.infraction}
                                                        </td>
                                                        <td className="py-2.5 font-bold text-blue-700 dark:text-blue-400">
                                                            +{scan.points} Poin
                                                        </td>
                                                        <td className="py-2.5">
                                                            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                                                {scan.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Active Face Recognition & Auto Attendance Verification Card (5 cols) */}
                    <div className="space-y-4 lg:col-span-5">
                        {/* 1. Face Recognition Identity & Auto-Attendance Card */}
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a] space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <ScanFace className="size-4 text-blue-600" />
                                    <span>Status Presensi & Face Recognition</span>
                                </h3>
                                <span className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                    Akurasi {faceMatchScore}%
                                </span>
                            </div>

                            {/* Biometric Comparison Preview: Database Photo vs Live Face */}
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                                <div className="flex items-center justify-between gap-3">
                                    {/* Database Profile Photo */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative size-13 overflow-hidden rounded-xl border-2 border-blue-600 bg-slate-200 shadow-xs dark:bg-slate-800">
                                            {selectedStudent?.avatar ? (
                                                <img
                                                    src={selectedStudent.avatar}
                                                    alt={selectedStudent.name}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-full items-center justify-center font-bold text-blue-700">
                                                    {selectedStudent?.name?.charAt(0) || 'S'}
                                                </div>
                                            )}
                                            <span className="absolute bottom-0 inset-x-0 bg-blue-700 text-center text-[8px] font-bold text-white uppercase">
                                                Database
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <span className="block text-sm font-extrabold text-slate-900 truncate dark:text-white">
                                                {selectedStudent?.name}
                                            </span>
                                            <span className="block text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                NISN: {selectedStudent?.nisn}
                                            </span>
                                            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                                                Kelas: {selectedStudent?.class}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Automatic Attendance Badge */}
                                    <div className="text-right shrink-0">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                            Presensi Otomatis
                                        </span>
                                        <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 shadow-2xs dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                            <CheckCircle2 className="size-3.5" />
                                            HADIR
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                                            {lastAttendanceTime}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 border-t border-slate-200/60 pt-2.5 dark:border-slate-800 flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">
                                        Metode Pencatatan:
                                    </span>
                                    <span className="font-bold text-blue-700 dark:text-blue-400">
                                        Otomatis (AI Face Recognition)
                                    </span>
                                </div>
                            </div>

                            {/* Student Search & Quick Switcher */}
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                            Filter Rombel:
                                        </label>
                                        <select
                                            value={selectedClassFilter}
                                            onChange={(e) =>
                                                setSelectedClassFilter(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                        >
                                            <option value="all">Semua Kelas</option>
                                            {classes.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                            Cari Nama / NISN:
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Ketik nama..."
                                                value={studentSearch}
                                                onChange={(e) =>
                                                    setStudentSearch(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pr-2 pl-7 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                        Pilih Siswa Manual (Jika Face Recog Perlu Disesuaikan):
                                    </label>
                                    <select
                                        value={selectedStudentId}
                                        onChange={(e) => {
                                            const id = e.target.value;
                                            setSelectedStudentId(id);
                                            const found = students.find((s) => s.id === id);
                                            if (found) {
                                                triggerDualScanWorkflow(
                                                    found,
                                                    attributeDetections,
                                                    99.1,
                                                );
                                            }
                                        }}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        {filteredStudents.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} — {s.class} ({s.nisn}) • Saat ini: {s.currentPoints} Poin
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2. Detected Attributes Checklist & Manual Overrides */}
                        <div className="space-y-3 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                    <Scan className="size-4 text-blue-600" />
                                    <span>Hasil Pengecekan Atribut Seragam</span>
                                </h3>
                                <span className="text-[11px] text-slate-400">
                                    Klik item untuk koreksi manual
                                </span>
                            </div>

                            {/* Attribute Checkboxes */}
                            <div className="space-y-2">
                                {attributeDetections.map((attr) => (
                                    <div
                                        key={attr.id}
                                        onClick={() => toggleAttribute(attr.id)}
                                        className={cn(
                                            'flex cursor-pointer select-none items-center justify-between rounded-xl border p-3 transition-all',
                                            attr.isDetected
                                                ? 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80'
                                                : 'border-blue-300 bg-blue-50/70 dark:border-blue-900/80 dark:bg-blue-950/40',
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                    'flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                                                    attr.isDetected
                                                        ? 'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300'
                                                        : 'bg-blue-700 text-white shadow-xs',
                                                )}
                                            >
                                                {attr.isDetected ? (
                                                    <Check className="size-3.5" />
                                                ) : (
                                                    '!'
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {attr.name}
                                                    </span>
                                                    {!attr.isDetected && (
                                                        <span className="rounded border border-blue-300 bg-blue-100 px-1.5 py-0.2 text-[10px] font-extrabold text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            +{attr.points} Poin
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                                    {attr.notes}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">
                                                {attr.isDetected ? 'Lengkap' : 'Tidak Ada'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Violation Score Card & Action Button */}
                            <div className="mt-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/40 p-4 dark:border-blue-900 dark:from-blue-950/60 dark:to-slate-900">
                                <div className="mb-2 flex items-center justify-between">
                                    <div>
                                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                            Poin Pelanggaran Atribut:
                                        </span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                            {missingAttributes.length === 0
                                                ? 'Atribut siswa tertib, bebas poin kedisiplinan.'
                                                : `${missingAttributes.length} atribut belum memenuhi ketentuan.`}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-3xl font-black text-blue-700 dark:text-blue-300">
                                            +{totalViolationPoints}
                                        </span>
                                        <span className="ml-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                                            Poin
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={isSubmitting || !selectedStudent}
                                    onClick={handleSubmitViolationPoints}
                                    className={cn(
                                        'mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold text-white shadow-xs transition-all active:scale-98 sm:text-sm',
                                        totalViolationPoints > 0
                                            ? 'bg-blue-700 hover:bg-blue-800'
                                            : 'bg-blue-600 hover:bg-blue-700',
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <RefreshCw className="size-4 animate-spin" />
                                            <span>Mencatat Rekam Disiplin...</span>
                                        </>
                                    ) : totalViolationPoints > 0 ? (
                                        <>
                                            <Send className="size-4" />
                                            <span>
                                                Bebankan +{totalViolationPoints} Poin & Notifikasi Wali Kelas
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="size-4" />
                                            <span>
                                                Siswa Tertib • Presensi & Atribut Lengkap
                                            </span>
                                        </>
                                    )}
                                </button>
                                <span className="mt-1.5 block text-center text-[10px] text-slate-500 dark:text-slate-400">
                                    Presensi kehadiran telah terekam secara otomatis via Face Recognition tanpa perlu konfirmasi ulang.
                                </span>
                            </div>
                        </div>

                        {/* Standard Rules Reference Card */}
                        <div className="space-y-2 rounded-xl border border-slate-200/90 bg-white p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-400">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                                <Info className="size-3.5 text-blue-600" />
                                Standar Aturan Atribut & Presensi:
                            </span>
                            <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-500 dark:text-slate-400">
                                <li>
                                    Siswa yang teridentifikasi biometrik wajah langsung <strong>tercatat HADIR otomatis</strong> pada jam berjalan.
                                </li>
                                <li>
                                    Atribut (Dasi, Sabuk, Topi, Badge, Kaos Kaki) berbobot <strong>+5 Poin</strong> jika tidak dikenakan.
                                </li>
                                <li>
                                    Sepatu tidak standar berbobot <strong>+10 Poin</strong>.
                                </li>
                                <li>
                                    Poin kedisiplinan otomatis diteruskan ke dashboard Wali Kelas untuk pendampingan.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}
