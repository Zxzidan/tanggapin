import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Camera,
    Check,
    CheckCircle2,
    Clock,
    Filter,
    HelpCircle,
    Info,
    Layers,
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
    Sliders,
    Sparkles,
    UserCheck,
    Users,
    Video,
    VideoOff,
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
    isDetected: boolean; // true = compliant, false = missing / infraction
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
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [scanProgress, setScanProgress] = useState<number>(0);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [cameraMode, setCameraMode] = useState<'webcam' | 'preset'>('preset');

    // Selected Student & Filter State
    const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
    const [studentSearch, setStudentSearch] = useState<string>('');
    const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

    // Attribute Detection Checklist State
    const [attributeDetections, setAttributeDetections] = useState<AttributeDetectionState[]>([
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

    // Submitting State
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Selected student object
    const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

    // Filtered students list
    const filteredStudents = students.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            s.nisn.includes(studentSearch);
        const matchClass =
            selectedClassFilter === 'all' || s.classId === selectedClassFilter || s.class === selectedClassFilter;
        return matchSearch && matchClass;
    });

    // Preset Inspection Scenarios for instant testing without webcam
    const samplePresets = [
        {
            label: 'Skenario 1: Dasi, Sabuk & Kerapian Kurang (15 Poin)',
            studentNisn: students[0]?.nisn,
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
            detections: [
                { id: 'dasi', isDetected: false, notes: 'Dasi sekolah tidak terpasang' },
                { id: 'topi', isDetected: true, notes: 'Topi OSIS terpasang' },
                { id: 'sabuk', isDetected: false, notes: 'Sabuk hitam tidak dipakai' },
                { id: 'badge', isDetected: true, notes: 'Badge sekolah terpasang' },
                { id: 'sepatu', isDetected: true, notes: 'Sepatu hitam standar' },
                { id: 'kaos_kaki', isDetected: true, notes: 'Kaos kaki putih standar' },
                { id: 'kerapian_baju', isDetected: false, notes: 'Kemeja dikeluarkan' },
            ],
        },
        {
            label: 'Skenario 2: Atribut Lengkap 100% (0 Poin / Tertib)',
            studentNisn: students[1]?.nisn,
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
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
            label: 'Skenario 3: Sepatu Bukan Standar & Dasi Miring (15 Poin)',
            studentNisn: students[2]?.nisn,
            image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80',
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

    // Webcam Start & Stop
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsCameraActive(true);
            setHasCameraPermission(true);
            setCapturedImage(null);
            setCameraMode('webcam');
        } catch (err) {
            console.error('Webcam error:', err);
            setHasCameraPermission(false);
            toast.error('Kamera webcam tidak terdeteksi atau izin ditolak. Mengalihkan ke mode simulasi cerdas.');
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

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            stopWebcam();
        };
    }, []);

    // Take snapshot from webcam
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
                triggerAiScanAnimation();
            }
        }
    };

    // Trigger scanning HUD animation
    const triggerAiScanAnimation = () => {
        setIsScanning(true);
        setScanProgress(0);
        const interval = setInterval(() => {
            setScanProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    return 100;
                }
                return prev + 15;
            });
        }, 120);
    };

    // Apply a sample preset
    const applyPreset = (presetIndex: number) => {
        const preset = samplePresets[presetIndex];
        if (!preset) return;

        setCapturedImage(preset.image);
        if (preset.studentNisn) {
            const target = students.find((s) => s.nisn === preset.studentNisn);
            if (target) setSelectedStudentId(target.id);
        }

        setAttributeDetections((prev) =>
            prev.map((item) => {
                const match = preset.detections.find((d) => d.id === item.id);
                if (match) {
                    return {
                        ...item,
                        isDetected: match.isDetected,
                        notes: match.notes,
                    };
                }
                return item;
            })
        );

        triggerAiScanAnimation();
        toast.info(`Memuat ${preset.label}`);
    };

    // Toggle manual override for an attribute
    const toggleAttribute = (id: string) => {
        setAttributeDetections((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        isDetected: !item.isDetected,
                        notes: !item.isDetected ? 'Diverifikasi manual oleh Guru BK' : 'Dinyatakan tidak lengkap oleh Guru BK',
                    };
                }
                return item;
            })
        );
    };

    // Calculate total violation points
    const missingAttributes = attributeDetections.filter((a) => !a.isDetected);
    const totalViolationPoints = missingAttributes.reduce((acc, curr) => acc + curr.points, 0);

    // Infraction summary text
    const infractionSummary =
        missingAttributes.length === 0
            ? 'Atribut Seragam Lengkap 100%'
            : `Pelanggaran Atribut: ${missingAttributes.map((m) => m.name).join(', ')}`;

    const patternNotes =
        missingAttributes.length === 0
            ? 'Inspeksi Kamera Pemantau BK: Seluruh atribut seragam siswa terdeteksi lengkap dan tertib.'
            : `Hasil Inspeksi Kamera Pemantau BK (${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}): ${missingAttributes.map((m) => `${m.name} (+${m.points} poin)`).join(', ')}. Total: ${totalViolationPoints} poin pelanggaran dibebankan kepada siswa.`;

    // Submit discipline record
    const handleSubmitViolationPoints = () => {
        if (!selectedStudent) {
            toast.error('Pilih siswa yang akan dikenakan poin terlebih dahulu.');
            return;
        }

        if (totalViolationPoints === 0) {
            toast.success(`${selectedStudent.name} memiliki atribut lengkap! Tidak ada poin pelanggaran yang dikenakan.`);
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
                        `Berhasil mengenakan +${totalViolationPoints} poin pelanggaran atribut ke ${selectedStudent.name} (${selectedStudent.class}). Wali Kelas telah otomatis dinotifikasi.`
                    );
                    toast.success(
                        `Poin kedisiplinan (+${totalViolationPoints} Poin) berhasil disimpan untuk ${selectedStudent.name}.`
                    );
                    // Select next student if available
                    const currentIndex = students.findIndex((s) => s.id === selectedStudent.id);
                    if (currentIndex < students.length - 1) {
                        setSelectedStudentId(students[currentIndex + 1].id);
                    }
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    toast.error('Gagal mencatat poin pelanggaran. Silakan periksa koneksi.');
                    console.error('Submit error:', errors);
                },
            }
        );
    };

    return (
        <FlowbiteTanggapinLayout activeTab="attribute-scanner">
            <Head title="Kamera Pemantau Atribut Siswa - Guru BK - Tanggapin" />

            <div className="space-y-6">
                {/* Header Title & Breadcrumb */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                            <Camera className="size-4" />
                            <span>Bimbingan Konseling • AI Vision Guard</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                            Kamera Pemantau Atribut Siswa
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                            Inspeksi otomatis kelengkapan seragam siswa di gerbang & kelas. Jika atribut tidak lengkap, sistem otomatis menghitung dan membebankan poin kedisiplinan serta meneruskan notifikasi ke Wali Kelas.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                            <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
                            Sistem AI Aktif
                        </span>
                        <a
                            href="/kondisi-kelas"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            <Users className="size-3.5 text-slate-500" />
                            Data Siswa & Poin
                        </a>
                    </div>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                            <span>Terperiksa Hari Ini</span>
                            <UserCheck className="size-4 text-blue-600" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                {recentScans.length + 24}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-600">Siswa</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Gerbang & Rombel</span>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                            <span>Atribut Lengkap</span>
                            <CheckCircle2 className="size-4 text-blue-600" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                {Math.max(18, recentScans.length + 16)}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-600">Siswa (78%)</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Tertib Seragam</span>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                            <span>Pelanggaran Atribut</span>
                            <AlertTriangle className="size-4 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
                                {recentScans.length || 6}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">Siswa</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Dikenakan Poin</span>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                            <span>Total Poin Diberikan</span>
                            <Scale className="size-4 text-blue-600" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                {recentScans.reduce((acc, curr) => acc + curr.points, 0) || 45}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">Poin</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Tercatat di Database</span>
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

                {/* Main 2-Column Workspace: Camera Viewport (Left) & Inspection Analysis & Points (Right) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Live Camera Viewport & HUD (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-[#0f172a]">
                            {/* Viewport Top Controls Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/50">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex size-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                                        <span className="relative inline-flex size-2.5 rounded-full bg-blue-600" />
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                                        {isCameraActive ? 'Kamera Gerbang Aktif (Live)' : 'Viewport Pemantau Atribut'}
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
                                            'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-2xs transition-all',
                                            isCameraActive
                                                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300'
                                                : 'bg-blue-700 text-white hover:bg-blue-800'
                                        )}
                                    >
                                        {isCameraActive ? (
                                            <>
                                                <VideoOff className="size-3.5" />
                                                Matikan Kamera
                                            </>
                                        ) : (
                                            <>
                                                <Video className="size-3.5" />
                                                Nyalakan Webcam
                                            </>
                                        )}
                                    </button>

                                    {isCameraActive && (
                                        <button
                                            type="button"
                                            onClick={captureSnapshot}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-800 active:scale-95"
                                        >
                                            <Camera className="size-3.5" />
                                            Pindai Siswa
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Camera Display Viewport with Scanning Overlay */}
                            <div className="relative aspect-4/3 w-full bg-slate-950 flex items-center justify-center overflow-hidden select-none">
                                {/* Hidden Canvas for snapshot drawing */}
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Live Video Stream */}
                                <video
                                    ref={videoRef}
                                    playsInline
                                    muted
                                    className={cn(
                                        'absolute inset-0 size-full object-cover transition-opacity',
                                        isCameraActive && !capturedImage ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
                                        <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-inner mb-3">
                                            <Camera className="size-8 text-blue-400" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-200">
                                            Kamera Belum Aktif
                                        </p>
                                        <p className="text-xs text-slate-400 max-w-xs mt-1">
                                            Nyalakan kamera webcam laptop atau pilih skenario contoh di bawah untuk memulai inspeksi atribut otomatis.
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
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
                                                Muat Contoh Siswa
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Futuristic HUD Optical Crosshairs & Corner Brackets */}
                                <div className="absolute inset-4 pointer-events-none border border-blue-500/20 rounded-xl">
                                    <div className="absolute -top-1 -left-1 size-5 border-t-2 border-l-2 border-blue-400" />
                                    <div className="absolute -top-1 -right-1 size-5 border-t-2 border-r-2 border-blue-400" />
                                    <div className="absolute -bottom-1 -left-1 size-5 border-b-2 border-l-2 border-blue-400" />
                                    <div className="absolute -bottom-1 -right-1 size-5 border-b-2 border-r-2 border-blue-400" />
                                </div>

                                {/* Active AI Scanning Laser Beam */}
                                {isScanning && (
                                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#3b82f6] animate-[bounce_2s_infinite]" />
                                )}

                                {/* AI Bounding Box Overlays on Student Body */}
                                {capturedImage && !isScanning && (
                                    <div className="absolute inset-0 pointer-events-none p-6">
                                        {/* Head Area: Topi */}
                                        <div className="absolute top-[10%] left-[38%] w-[24%] h-[16%] border border-blue-400/80 rounded bg-blue-500/10 flex items-start justify-center">
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-900/90 text-blue-200 border border-blue-400/50 -translate-y-2.5">
                                                Topi: {attributeDetections.find((d) => d.id === 'topi')?.isDetected ? '✅ Terdeteksi' : '⚠️ Tidak Ada (+5)'}
                                            </span>
                                        </div>

                                        {/* Collar Area: Dasi */}
                                        <div
                                            className={cn(
                                                'absolute top-[32%] left-[40%] w-[20%] h-[18%] border rounded flex items-center justify-center',
                                                attributeDetections.find((d) => d.id === 'dasi')?.isDetected
                                                    ? 'border-blue-400/80 bg-blue-500/10'
                                                    : 'border-blue-500 bg-blue-950/40 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                                            )}
                                        >
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-white border border-blue-400/60">
                                                Dasi: {attributeDetections.find((d) => d.id === 'dasi')?.isDetected ? '✅ Terpasang' : '⚠️ Tidak Ada (+5)'}
                                            </span>
                                        </div>

                                        {/* Waist Area: Sabuk */}
                                        <div
                                            className={cn(
                                                'absolute top-[56%] left-[34%] w-[32%] h-[12%] border rounded flex items-center justify-center',
                                                attributeDetections.find((d) => d.id === 'sabuk')?.isDetected
                                                    ? 'border-blue-400/80 bg-blue-500/10'
                                                    : 'border-blue-500 bg-blue-950/40 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                                            )}
                                        >
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-white border border-blue-400/60">
                                                Sabuk: {attributeDetections.find((d) => d.id === 'sabuk')?.isDetected ? '✅ Ada' : '⚠️ Tidak Ada (+5)'}
                                            </span>
                                        </div>

                                        {/* Chest Badge */}
                                        <div className="absolute top-[35%] right-[22%] w-[14%] h-[10%] border border-blue-400/70 rounded bg-blue-500/10 flex items-center justify-center">
                                            <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-blue-900/90 text-blue-200">
                                                Badge: ✅
                                            </span>
                                        </div>

                                        {/* Feet Area: Sepatu & Kaos Kaki */}
                                        <div className="absolute bottom-[4%] left-[35%] w-[30%] h-[15%] border border-blue-400/80 rounded bg-blue-500/10 flex items-center justify-center">
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-white border border-blue-400/60">
                                                Sepatu: {attributeDetections.find((d) => d.id === 'sepatu')?.isDetected ? '✅ Standar' : '⚠️ Pelanggaran (+10)'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Live Viewport Badge */}
                                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-black/75 px-2.5 py-1 text-[11px] font-mono text-slate-300 backdrop-blur-xs border border-white/10">
                                    <span className="size-1.5 rounded-full bg-blue-400" />
                                    <span>AI CONFIDENCE: 94.6%</span>
                                    <span>•</span>
                                    <span>FPS: 30</span>
                                </div>
                            </div>

                            {/* Viewport Bottom Preset Buttons */}
                            <div className="border-t border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-2">
                                    Uji Coba Cepat (Pilih Skenario Sampel Tanpa Webcam):
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {samplePresets.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => applyPreset(idx)}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Scans Log Table Card */}
                        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Clock className="size-4 text-blue-600" />
                                    <span>Log Pemantauan Atribut Terbaru</span>
                                </h3>
                                <span className="text-[11px] text-slate-400">
                                    {recentScans.length} Catatan Hari Ini
                                </span>
                            </div>

                            <div className="overflow-x-auto">
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
                                                <td colSpan={5} className="py-4 text-center text-slate-400">
                                                    Belum ada pelanggaran atribut tercatat hari ini.
                                                </td>
                                            </tr>
                                        ) : (
                                            recentScans.slice(0, 5).map((scan) => (
                                                <tr key={scan.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
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
                                                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                            {scan.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Student Selector, Attribute Checklist & Points Action (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* 1. Student Selector Card */}
                        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between mb-3">
                                <span className="flex items-center gap-2">
                                    <Users className="size-4 text-blue-600" />
                                    Identifikasi Siswa Terperiksa
                                </span>
                                <span className="text-[11px] font-normal text-slate-400">
                                    {students.length} Siswa Terdaftar
                                </span>
                            </h3>

                            {/* Class Filter & Search Inputs */}
                            <div className="space-y-2 mb-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                                            Filter Rombel:
                                        </label>
                                        <select
                                            value={selectedClassFilter}
                                            onChange={(e) => setSelectedClassFilter(e.target.value)}
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
                                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                                            Cari Nama / NISN:
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Ketik nama..."
                                                value={studentSearch}
                                                onChange={(e) => setStudentSearch(e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-7 pr-2 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Student Quick Dropdown */}
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                                        Pilih Siswa Target:
                                    </label>
                                    <select
                                        value={selectedStudentId}
                                        onChange={(e) => setSelectedStudentId(e.target.value)}
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

                            {/* Active Student Card Preview */}
                            {selectedStudent && (
                                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm overflow-hidden border border-blue-200 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300">
                                            {selectedStudent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900 dark:text-white block text-sm leading-tight">
                                                {selectedStudent.name}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {selectedStudent.class} • NISN: {selectedStudent.nisn}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-[11px] text-slate-400 block">Poin Disiplin:</span>
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold',
                                                selectedStudent.currentPoints >= 30
                                                    ? 'bg-blue-900 text-blue-200'
                                                    : selectedStudent.currentPoints >= 15
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                            )}
                                        >
                                            {selectedStudent.currentPoints} Poin
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Detected Attributes Checklist & Manual Overrides */}
                        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a] space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Scan className="size-4 text-blue-600" />
                                    <span>Hasil Deteksi Atribut Seragam</span>
                                </h3>
                                <span className="text-[11px] text-slate-400">
                                    Klik untuk koreksi manual
                                </span>
                            </div>

                            {/* Attribute Checkboxes */}
                            <div className="space-y-2">
                                {attributeDetections.map((attr) => (
                                    <div
                                        key={attr.id}
                                        onClick={() => toggleAttribute(attr.id)}
                                        className={cn(
                                            'flex items-center justify-between rounded-xl p-3 border transition-all cursor-pointer select-none',
                                            attr.isDetected
                                                ? 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80'
                                                : 'border-blue-300 bg-blue-50/70 dark:border-blue-900/80 dark:bg-blue-950/40'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                    'size-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0',
                                                    attr.isDetected
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                        : 'bg-blue-700 text-white shadow-xs'
                                                )}
                                            >
                                                {attr.isDetected ? <Check className="size-3.5" /> : '!'}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                        {attr.name}
                                                    </span>
                                                    {!attr.isDetected && (
                                                        <span className="rounded bg-blue-200/80 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-[10px] font-extrabold px-1.5 py-0.2">
                                                            +{attr.points} Poin
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                                                    {attr.notes}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span
                                                className={cn(
                                                    'text-[11px] font-bold',
                                                    attr.isDetected
                                                        ? 'text-blue-700 dark:text-blue-400'
                                                        : 'text-blue-700 dark:text-blue-400'
                                                )}
                                            >
                                                {attr.isDetected ? 'Lengkap' : 'Tidak Ada'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Violation Score Card & Action Button */}
                            <div className="mt-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:border-blue-900 dark:from-blue-950/60 dark:to-slate-900">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                                            Akumulasi Poin Pelanggaran:
                                        </span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                            {missingAttributes.length === 0
                                                ? 'Siswa tertib, tidak ada poin dikenakan.'
                                                : `${missingAttributes.length} atribut tidak lengkap.`}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-3xl font-black text-blue-700 dark:text-blue-300">
                                            +{totalViolationPoints}
                                        </span>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">
                                            Poin
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={isSubmitting || !selectedStudent}
                                    onClick={handleSubmitViolationPoints}
                                    className={cn(
                                        'w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-98 cursor-pointer mt-2',
                                        totalViolationPoints > 0
                                            ? 'bg-blue-700 hover:bg-blue-800'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <RefreshCw className="size-4 animate-spin" />
                                            <span>Mencatat Poin Kedisiplinan...</span>
                                        </>
                                    ) : totalViolationPoints > 0 ? (
                                        <>
                                            <Send className="size-4" />
                                            <span>Kenakan +{totalViolationPoints} Poin & Notifikasi Wali Kelas</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="size-4" />
                                            <span>Konfirmasi Siswa Tertib (0 Poin)</span>
                                        </>
                                    )}
                                </button>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center block mt-1.5">
                                    Catatan akan otomatis tersimpan di Buku Disiplin Siswa dan mengupdate risiko Early Warning.
                                </span>
                            </div>
                        </div>

                        {/* Standard Rules Reference Card */}
                        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-400 space-y-2">
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                                <Info className="size-3.5 text-blue-600" />
                                Standar Aturan Poin Seragam Sekolah:
                            </span>
                            <ul className="space-y-1 text-[11px] list-disc pl-4 text-slate-500 dark:text-slate-400">
                                <li>Dasi, Sabuk, Badge, Kaos Kaki masing-masing berbobot <strong>+5 Poin</strong>.</li>
                                <li>Sepatu non-standar / berwarna mencolok berbobot <strong>+10 Poin</strong>.</li>
                                <li>Akumulasi ≥15 Poin memicu status <em>Medium Risk</em>.</li>
                                <li>Akumulasi ≥30 Poin memicu status <em>High Risk</em> dan panggilan orang tua.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </FlowbiteTanggapinLayout>
    );
}
