import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  GraduationCap,
  FileText,
  PhoneCall,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  MessageSquare,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type DemoTab = 'early_warning' | 'class_health' | 'cases' | 'communication';

export interface DashboardVideoPreviewProps {
  onExploreDemo?: () => void;
}

export default function DashboardVideoPreview({ onExploreDemo }: DashboardVideoPreviewProps = {}) {
  const [activeTab, setActiveTab] = useState<DemoTab>('early_warning');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [actionAssigned, setActionAssigned] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 320, y: 190 });
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Automated video simulation loop
  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: NodeJS.Timeout;

    const steps = [
      // 0. Hover on student card & click + Tindak Lanjut
      () => {
        setActiveTab('early_warning');
        setMousePos({ x: 420, y: 195 });
        setStepIndex(0);
        timeoutId = setTimeout(() => {
          setIsClicking(true);
          setTimeout(() => {
            setIsClicking(false);
            setActionAssigned(true);
          }, 300);
        }, 1200);
      },
      // 1. Move to "Pantauan Kelas" tab and click
      () => {
        setStepIndex(1);
        setMousePos({ x: 215, y: 92 });
        timeoutId = setTimeout(() => {
          setIsClicking(true);
          setTimeout(() => {
            setIsClicking(false);
            setActiveTab('class_health');
          }, 300);
        }, 1300);
      },
      // 2. Move to "Alur Kasus BK" tab and click
      () => {
        setStepIndex(2);
        setMousePos({ x: 335, y: 92 });
        timeoutId = setTimeout(() => {
          setIsClicking(true);
          setTimeout(() => {
            setIsClicking(false);
            setActiveTab('cases');
          }, 300);
        }, 1400);
      },
      // 3. Move to "WhatsApp Ortu" tab and click
      () => {
        setStepIndex(3);
        setMousePos({ x: 470, y: 92 });
        timeoutId = setTimeout(() => {
          setIsClicking(true);
          setTimeout(() => {
            setIsClicking(false);
            setActiveTab('communication');
          }, 300);
        }, 1400);
      },
      // 4. Reset loop
      () => {
        setStepIndex(4);
        setMousePos({ x: 100, y: 92 });
        timeoutId = setTimeout(() => {
          setActionAssigned(false);
          setActiveTab('early_warning');
        }, 1000);
      },
    ];

    const currentFn = steps[stepIndex % steps.length];
    currentFn();

    const intervalId = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 4200);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isPlaying, stepIndex]);

  const handleManualTabClick = (tab: DemoTab) => {
    setActiveTab(tab);
    setIsPlaying(false); // Pause auto playback when user interacts
  };

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

            {/* Simulated browser URL badge */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <span className="size-1.5 rounded-full bg-blue-600" />
              <span>tanggapin.sch.id/dashboard/operasional</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 px-2.5 py-0.5 text-[11px] font-semibold">
              <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
              Simulasi Otomatis Berjalan
            </span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 bg-slate-50/50 px-4 py-2 text-xs font-semibold dark:border-slate-800/80 dark:bg-[#0e1626]">
          <button
            type="button"
            onClick={() => handleManualTabClick('early_warning')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all cursor-pointer',
              activeTab === 'early_warning'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            <ShieldAlert className="size-3.5" />
            <span>Peringatan Dini Siswa</span>
            <span className="rounded-full bg-blue-900 text-white dark:bg-blue-600 px-1.5 py-0.2 text-[9px] font-bold">1</span>
          </button>

          <button
            type="button"
            onClick={() => handleManualTabClick('class_health')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all cursor-pointer',
              activeTab === 'class_health'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            <GraduationCap className="size-3.5" />
            <span>Pantauan Kelas</span>
          </button>

          <button
            type="button"
            onClick={() => handleManualTabClick('cases')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all cursor-pointer',
              activeTab === 'cases'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            <FileText className="size-3.5" />
            <span>Alur Kasus BK</span>
          </button>

          <button
            type="button"
            onClick={() => handleManualTabClick('communication')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all cursor-pointer',
              activeTab === 'communication'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            <MessageSquare className="size-3.5" />
            <span>WhatsApp Orang Tua</span>
          </button>
        </div>

        {/* Dashboard Interactive Viewport */}
        <div className="relative min-h-[360px] p-5 sm:p-7 bg-white dark:bg-[#0c1322]">
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
              className="absolute pointer-events-none z-40"
              style={{ top: 0, left: 0 }}
            >
              {/* Cursor SVG */}
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

          {/* Dynamic Content Per Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'early_warning' && (
              <motion.div
                key="early_warning"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Daftar Peringatan Dini Siswa Butuh Tindakan
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Pola risiko diidentifikasi otomatis dari data absensi harian dan rekap akademik.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 border border-blue-200 text-blue-800 px-3 py-1 font-semibold text-xs dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900">
                    Prioritas Tinggi
                  </span>
                </div>

                {/* Student Alert Card */}
                <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-5 dark:border-blue-900/60 dark:bg-blue-950/20 transition-all shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/15 text-blue-700 dark:text-blue-300 font-bold text-sm">
                        AF
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                            Ahmad Fauzan
                          </h5>
                          <span className="rounded-md bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold dark:bg-blue-900/70 dark:text-blue-200">
                            3 Hari Alpa Beruntun
                          </span>
                          <span className="text-xs text-slate-400">• Kelas X-B</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          Kehadiran menurun signifikan dalam 2 pekan terakhir. Terindikasi kendala transportasi dan kerentanan drop-out.
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                          <span>Wali Kelas: Bpk. Budi Santoso</span>
                          <span>•</span>
                          <span>Wali Murid: Ibu Fatimah (0812-9876-xxxx)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => setActionAssigned(!actionAssigned)}
                        className={cn(
                          'rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer',
                          actionAssigned
                            ? 'bg-blue-800 text-white hover:bg-blue-900'
                            : 'bg-blue-700 text-white hover:bg-blue-800'
                        )}
                      >
                        {actionAssigned ? (
                          <>
                            <CheckCircle2 className="size-4" />
                            <span>✓ Ditugaskan ke Wali Kelas & BK</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="size-4" />
                            <span>+ Tindak Lanjut</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Student Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold dark:bg-blue-950 dark:text-blue-300">
                        RP
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          Rian Prasetya • Kelas XI-IPA 2
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Pola keterlambatan berulang (4x pekan ini)
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      Dalam Pantauan Wali Kelas
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'class_health' && (
              <motion.div
                key="class_health"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Matriks Kesehatan Kelas X-B (Pekan Berjalan)
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Rangkuman kesehatan rombel untuk mendeteksi anomali kehadiran kelas.
                    </p>
                  </div>
                  <span className="rounded-md bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 text-xs font-bold dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900">
                    Tingkat Kehadiran: 91% (Waspada)
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between mb-2 text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Persentase Kehadiran Efektif Rombel:</span>
                    <span className="text-blue-700 dark:text-blue-400 font-mono text-sm font-bold">91.4%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '91.4%' }} />
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <div className="text-xs text-slate-500">Siswa Hadir</div>
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-400">32 Siswa</div>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <div className="text-xs text-slate-500">Izin / Sakit</div>
                      <div className="text-lg font-bold text-slate-800 dark:text-slate-200">2 Siswa</div>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <div className="text-xs text-slate-500">Tanpa Keterangan</div>
                      <div className="text-lg font-bold text-slate-500 dark:text-slate-400">1 Siswa</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'cases' && (
              <motion.div
                key="cases"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Linimasa Kasus Bimbingan Konseling (BK)
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Alur transparan dari penerimaan laporan hingga penyelesaian komitmen.
                    </p>
                  </div>
                  <span className="rounded-md bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 text-xs font-bold dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900">
                    Status: Tahap Konseling
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                        Kasus CS-001: Pendampingan Motivasi Belajar
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Siswa: Ahmad Fauzan • PIC: Ibu Nurhaliza, S.Pd (Guru BK)
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 text-xs font-semibold">
                      Sesi 1 Selesai
                    </span>
                  </div>

                  {/* Visual timeline steps */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl">
                      <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold mb-1">
                        <CheckCircle2 className="size-3.5" />
                        1. Laporan Masuk
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Deteksi presensi & notifikasi awal</p>
                    </div>

                    <div className="p-3 bg-blue-100/60 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-800 rounded-xl">
                      <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold mb-1">
                        <Clock className="size-3.5" />
                        2. Sesi Konseling
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Wawancara empati & pemetaan akar masalah</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl opacity-75">
                      <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                        3. Lembar Komitmen
                      </div>
                      <p className="text-[11px] text-slate-500">Penyusunan target kehadiran baru</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl opacity-75">
                      <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                        4. Laporan Ortu
                      </div>
                      <p className="text-[11px] text-slate-500">Evaluasi terkirim ber-tanda terima</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'communication' && (
              <motion.div
                key="communication"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Kanal Komunikasi WhatsApp Resmi Ber-Tanda Terima
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Informasi resmi sekolah terkirim langsung ke orang tua dengan konfirmasi penerimaan digital.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 text-xs font-bold dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                    Tanda Terima Sah
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50 shadow-xs">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                        WA
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          Pemberitahuan Resmi: Ibu Fatimah (Wali Murid)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Nomor Terverifikasi: +62 812-9876-xxxx
                        </div>
                      </div>
                    </div>
                    <span className="rounded-md bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-bold dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
                      ✓✓ Terbaca: 08:15 WIB
                    </span>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-xs dark:border-blue-900/40 dark:bg-blue-950/20 leading-relaxed text-slate-700 dark:text-slate-300">
                    <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      Pemberitahuan Perkembangan Belajar Siswa
                    </p>
                    <p>
                      "Yth. Ibu Fatimah, kami menginformasikan bahwa ananda Ahmad Fauzan telah mengikuti sesi pendampingan bersama Wali Kelas dan Guru BK hari ini. Lembar komitmen belajar telah disepakati bersama demi kelancaran proses pembelajaran."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Three Supporting Feature Benefit Cards (Deskripsi Preview Dashboard) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-4">
            <ShieldAlert className="size-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
            1. Deteksi Dini Otomatis
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Data absensi dan ketertiban dirangkum sistem secara instan, mengenali pola alpa berulang sebelum siswa terancam putus sekolah.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-4">
            <Clock className="size-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
            2. Tindak Lanjut Terpadu
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Satu klik untuk menugaskan penanganan ke Wali Kelas atau Guru BK dengan linimasa konseling dan pencatatan yang tertata rapi.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-4">
            <CheckCircle2 className="size-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
            3. Komunikasi Ber-Tanda Terima
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Laporan terkirim resmi ke kontak WhatsApp orang tua lengkap dengan konfirmasi baca berstatus hukum yang terarsip digital.
          </p>
        </div>
      </div>
    </div>
  );
}
