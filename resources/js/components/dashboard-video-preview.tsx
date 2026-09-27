import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Database,
  BookOpen,
  GraduationCap,
  Wallet,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  FileCheck,
  TrendingUp,
  Award,
  Layers,
  Search,
  UserCheck,
  FileSignature,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type RolePreviewTab =
  | 'kepala_sekolah'
  | 'operator'
  | 'guru'
  | 'wali_kelas'
  | 'bendahara'
  | 'guru_bk';

export interface DashboardVideoPreviewProps {
  onExploreDemo?: () => void;
}

interface RoleConfig {
  id: RolePreviewTab;
  label: string;
  badge: string;
  icon: React.ElementType;
  urlPath: string;
}

const ROLES: RoleConfig[] = [
  {
    id: 'kepala_sekolah',
    label: 'Kepala Sekolah',
    badge: 'Supervisi & Mutu',
    icon: ShieldCheck,
    urlPath: 'tanggapin.sch.id/dashboard/kepala-sekolah',
  },
  {
    id: 'operator',
    label: 'Operator Sekolah',
    badge: 'Dapodik & Lisensi',
    icon: Database,
    urlPath: 'tanggapin.sch.id/dashboard/operator',
  },
  {
    id: 'guru',
    label: 'Guru Mapel',
    badge: 'Kurikulum Merdeka',
    icon: BookOpen,
    urlPath: 'tanggapin.sch.id/dashboard/guru-mapel',
  },
  {
    id: 'wali_kelas',
    label: 'Wali Kelas',
    badge: 'Rombel & Rapor AI',
    icon: GraduationCap,
    urlPath: 'tanggapin.sch.id/dashboard/wali-kelas',
  },
  {
    id: 'bendahara',
    label: 'Bendahara',
    badge: 'BKU & Dana BOS',
    icon: Wallet,
    urlPath: 'tanggapin.sch.id/dashboard/bendahara',
  },
  {
    id: 'guru_bk',
    label: 'Guru BK',
    badge: 'Radar & Mediasi',
    icon: HeartHandshake,
    urlPath: 'tanggapin.sch.id/dashboard/guru-bk',
  },
];

export default function DashboardVideoPreview({ onExploreDemo }: DashboardVideoPreviewProps = {}) {
  const [activeTab, setActiveTab] = useState<RolePreviewTab>('kepala_sekolah');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 90, y: 76 });
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [roleIndex, setRoleIndex] = useState<number>(0);
  const [actionDone, setActionDone] = useState<boolean>(false);

  // Approximate horizontal center positions for each role tab header
  const tabPositions: Record<RolePreviewTab, { x: number; y: number }> = {
    kepala_sekolah: { x: 75, y: 76 },
    operator: { x: 200, y: 76 },
    guru: { x: 320, y: 76 },
    wali_kelas: { x: 430, y: 76 },
    bendahara: { x: 535, y: 76 },
    guru_bk: { x: 635, y: 76 },
  };

  // Automated video simulation loop cycling through all 6 roles
  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: NodeJS.Timeout;
    let clickTimeout: NodeJS.Timeout;

    const currentRole = ROLES[roleIndex % ROLES.length];
    const targetPos = tabPositions[currentRole.id];

    // 1. Move cursor to tab and click
    setMousePos(targetPos);
    timeoutId = setTimeout(() => {
      setIsClicking(true);
      setActiveTab(currentRole.id);
      setActionDone(false);

      clickTimeout = setTimeout(() => {
        setIsClicking(false);
        // 2. Move cursor down to highlight action card
        setMousePos({ x: 380, y: 240 });
        setTimeout(() => {
          setActionDone(true);
        }, 1200);
      }, 350);
    }, 900);

    const intervalId = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 4800);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(clickTimeout);
      clearInterval(intervalId);
    };
  }, [isPlaying, roleIndex]);

  const handleManualTabClick = (roleId: RolePreviewTab, index: number) => {
    setActiveTab(roleId);
    setRoleIndex(index);
    setActionDone(false);
    setIsPlaying(false); // Pause auto playback when user interacts
  };

  const currentRoleConfig = ROLES.find((r) => r.id === activeTab) || ROLES[0];

  return (
    <div className="mx-auto max-w-6xl">
      {/* 1. Faux OS & Browser Frame */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0c1322]">
        {/* Top Window Chrome Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-slate-800/80 dark:bg-[#0f172a]">
          <div className="flex items-center gap-3">
            {/* Window control dots - Minimalist Neutral */}
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            {/* Dynamic URL bar reflecting active role */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 shadow-2xs">
              <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>{currentRoleConfig.urlPath}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-3 fill-current" />
                  <span>Jeda Simulasi</span>
                </>
              ) : (
                <>
                  <Play className="size-3 fill-current" />
                  <span>Putar Otomatis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dashboard 6 Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200/80 bg-slate-50/60 px-3 py-2 text-xs font-semibold no-scrollbar dark:border-slate-800/80 dark:bg-[#0e1626]">
          {ROLES.map((role, idx) => {
            const Icon = role.icon;
            const isActive = activeTab === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleManualTabClick(role.id, idx)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 transition-all cursor-pointer text-xs font-semibold',
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/70'
                )}
              >
                <Icon className="size-3.5" />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Interactive Viewport */}
        <div className="relative min-h-[380px] p-5 sm:p-7 bg-white dark:bg-[#0c1322] select-none">
          {/* Animated Video Simulated Mouse Cursor */}
          {isPlaying && (
            <motion.div
              animate={{
                x: mousePos.x,
                y: mousePos.y,
              }}
              transition={{
                type: 'spring',
                damping: 24,
                stiffness: 140,
                mass: 0.6,
              }}
              className="absolute pointer-events-none z-40 hidden sm:block"
              style={{ top: 0, left: 0 }}
            >
              <div className="relative">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-md text-slate-900"
                >
                  <path
                    d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Click Ripple Effect */}
                {isClicking && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute -top-1 -left-1 size-6 rounded-full border-2 border-blue-500 bg-blue-400/30 pointer-events-none"
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* Dynamic Content Per Active Role */}
          <AnimatePresence mode="wait">
            {/* 1. KEPALA SEKOLAH */}
            {activeTab === 'kepala_sekolah' && (
              <motion.div
                key="kepala_sekolah"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>Executive Dashboard Kepala Sekolah</span>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        Otoritas Pimpinan
                      </span>
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Audit kepatuhan GTK, pengesahan modul ajar, dan disposisi tindak lanjut sekolah.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 font-semibold text-xs dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900 self-start sm:self-auto">
                    Kepatuhan GTK: 94.2% Lengkap
                  </span>
                </div>

                {/* 3 Executive Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Modul Ajar GTK
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">94.2%</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">↑ +4.1%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">28 Guru telah diverifikasi AI</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Penyerapan Dana BOS
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">76.8%</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Tahap II Selesai</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Sesuai RKT & Standar BOSP</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Iklim Belajar Rombel
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">12 / 12</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Kondusif</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">0 Insiden perundungan dilaporkan</p>
                  </div>
                </div>

                {/* Interactive Action Card */}
                <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                        <FileCheck className="size-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                            Modul Ajar: Informatika Fase E (Kurikulum Merdeka)
                          </h5>
                          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                            Skor Mutu AI: 91 / 100
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          Pendidik: Siti Rahmawati, M.Pd • Asesmen diagnostik & diferensiasi belajar terintegrasi.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={cn(
                        'shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5',
                        actionDone
                          ? 'bg-blue-800 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      )}
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>{actionDone ? 'Telah Disahkan Kepsek' : 'Sahkan Dokumen GTK'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. OPERATOR SEKOLAH */}
            {activeTab === 'operator' && (
              <motion.div
                key="operator"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>Pusat Sinkronisasi Dapodik & Lisensi</span>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        Admin Sekolah
                      </span>
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Validasi residu NISN, kelengkapan berkas PTK, dan integrasi server Pusdatin.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 font-semibold text-xs dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900 self-start sm:self-auto">
                    Koneksi Pusdatin: Aktif & Valid
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Residu Data NISN
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">0 Residu</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">100% Bersih</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">432 Siswa terverifikasi aktif</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Sinkron Terakhir
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">10 Mnt Lalu</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Sinkronisasi otomatis periodik</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Status Lisensi Sekolah
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">Paket Pro</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">12 Bulan</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">SLA Dukungan Teknis 24/7</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                        <Database className="size-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                          Penarikan Data Dapodik Semester Ganjil 2025/2026
                        </h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          Sinkronisasi 28 Guru PTK, 12 Rombel, dan 432 data siswa tanpa duplikasi.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="size-3.5" />
                      <span>{actionDone ? 'Sinkronisasi Selesai' : 'Mulai Sinkron Dapodik'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. GURU MATA PELAJARAN */}
            {activeTab === 'guru' && (
              <motion.div
                key="guru"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>Dashboard Guru Mata Pelajaran</span>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        Informatika
                      </span>
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Kelola modul ajar Kurikulum Merdeka, input nilai formatif, dan rekap capaian TP.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 font-semibold text-xs dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900 self-start sm:self-auto">
                    4 Jam Mengajar Hari Ini
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Modul Ajar Terunggah
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">8 Modul</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Fase E & F</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Lengkap dengan rubrik asesmen</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Rata-Rata Nilai TP
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">86.4</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">/ 100</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">94% Siswa tuntas kriteria TP</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Asesmen Formatif
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">100%</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Terjadwal</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Sinkron langsung ke buku nilai</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                        <BookOpen className="size-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                          Penilaian Formatif TP-03: Pemrograman Berbasis Blok
                        </h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          Kelas X-B • 36 Siswa telah dinilai rubrik observasi praktikum lab komputer.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>{actionDone ? 'Nilai Tersimpan' : 'Input Nilai Formatif'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. WALI KELAS */}
            {activeTab === 'wali_kelas' && (
              <motion.div
                key="wali_kelas"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>Monitoring Rombel & Generator Rapor AI</span>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        Kelas X-B
                      </span>
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Catatan karakter P5, absensi rombel, dan penyusunan narasi rapor otomatis.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 font-semibold text-xs dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900 self-start sm:self-auto">
                    Presensi Rombel: 98.2% Tertib
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Presensi Siswa Hari Ini
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">35 / 36</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1 Izin</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Konfirmasi izin orang tua sah</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Jurnal Karakter P5
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">36 Catatan</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Lengkap</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Dimensi gotong royong & nalar</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Draf Rapor Naratif AI
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">100%</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Siap Cetak</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Telah divalidasi Wali Kelas</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                        <GraduationCap className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                            Generator Rapor Naratif AI: Ahmad Fauzan
                          </h5>
                          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                            Rata-Rata: 87.5
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          "Menunjukkan kemampuan analisis tinggi dalam mapel eksakta serta keaktifan positif dalam kerja kelompok."
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="size-3.5" />
                      <span>{actionDone ? 'Rapor Terlegalisir' : 'Kompilasi Narasi AI'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. BENDAHARA SEKOLAH */}
            {activeTab === 'bendahara' && (
              <motion.div
                key="bendahara"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>Buku Kas Umum (BKU) & Rekonsiliasi SPP</span>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        Keuangan Tertib
                      </span>
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Pencatatan kas masuk/keluar, pelaporan BOSP, dan tagihan SPP digital terotomatisasi.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 font-semibold text-xs dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900 self-start sm:self-auto">
                    Kepatuhan BKU: 100% Klop
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Saldo Kas Efektif
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">Rp 184,5 Jt</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Rekening bank & kas operasional</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Realisasi BOS Tahap II
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">76.8%</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Tertib RKAS</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Sesuai komponen BOSP 2025</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Rekonsiliasi SPP
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">94.2%</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Lunas</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Otomatis via Virtual Account</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                        <Wallet className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                            Penerimaan Kas SPP Siswa: Kelas X-B (VA Bank BNI)
                          </h5>
                          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                            Rp 2.400.000 Lunas
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          Kuitansi digital ber-QR Code terbit otomatis ke orang tua & tercatat di BKU.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>{actionDone ? 'Kuitansi Terarsip' : 'Cetak Kuitansi Sah'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. GURU BIMBINGAN KONSELING (BK) */}
            {activeTab === 'guru_bk' && (
              <motion.div
                key="guru_bk"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>Radar Deteksi Kerentanan & Mediasi BK</span>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        Etis & Terbimbing
                      </span>
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Pencegahan Anak Tidak Sekolah (ATS), konseling individu, dan koordinasi orang tua.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 font-semibold text-xs dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900 self-start sm:self-auto">
                    Indeks Risiko ATS: 0.8% (Sangat Rendah)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Kasus Tuntas Bulan Ini
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">5 / 6</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">83.3% Selesai</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Pendampingan etis & terarsip rapi</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Panggilan Orang Tua
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">100%</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Ber-Tanda Terima</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Surat digital WhatsApp terverifikasi</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Kepatuhan SOP TPPK
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">Sesuai SOP</span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Permendikbud</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Kerahasiaan data murid terjamin</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                        <HeartHandshake className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                            Linimasa Kasus BK: Ahmad Fauzan (Kelas X-B)
                          </h5>
                          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                            Sesi 2 Selesai
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          Lembar komitmen kehadiran baru telah disepakati bersama orang tua & terkirim tanda terima.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>{actionDone ? 'Komitmen Terarsip' : 'Simpan Lembar Komitmen'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Three Supporting Feature Benefit Cards (Deskripsi Preview Dashboard Multi-Role) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-4">
            <ShieldCheck className="size-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
            1. Terpadu untuk 6 Peran Sekolah
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Kepala Sekolah, Operator, Guru Mapel, Wali Kelas, Bendahara, hingga Guru BK bekerja dalam satu platform terhubung tanpa data terisolasi.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-4">
            <Sparkles className="size-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
            2. Otomasi AI & Sinkron Dapodik
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Audit modul Kurikulum Merdeka berbasis AI, generator rapor naratif otomatis, serta rekonsiliasi data Dapodik tanpa friksi ganda.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-4">
            <CheckCircle2 className="size-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
            3. 100% Selaras Regulasi BOSP
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Kepatuhan penuh pada Permendikbudristek No 63 Tahun 2023, pembukuan kas BKU tertib audit, dan komunikasi resmi ber-tanda terima sah.
          </p>
        </div>
      </div>
    </div>
  );
}
