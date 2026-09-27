import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import CinematicHeadline from '@/components/cinematic-headline';

export type PlanType = 'perintis' | 'unggulan' | 'yayasan';

interface PricingCardProps {
  title: string;
  subtitle: string;
  price?: string;
  priceDetail?: string;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'outline';
  highlight?: boolean;
  linkText?: string;
  onButtonClick?: () => void;
  onLinkClick?: () => void;
  features?: string[];
}

const PricingCard = ({
  title,
  subtitle,
  price,
  priceDetail,
  buttonText,
  buttonVariant,
  highlight,
  linkText,
  onButtonClick,
  onLinkClick,
  features,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'relative flex flex-col p-7 rounded-[28px] h-full transition-all duration-300',
        highlight
          ? 'bg-white dark:bg-[#111c30] text-slate-900 dark:text-white shadow-xl scale-[1.02] z-10 border-2 border-blue-600 ring-4 ring-blue-500/10'
          : 'bg-white dark:bg-[#0f172a] shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
      )}
    >
      {highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-700 text-white text-[11px] font-bold py-1 px-3.5 rounded-full shadow-sm tracking-wide">
          Rekomendasi Utama Sekolah
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-xl font-bold tracking-tight mb-1 text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[34px] leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        {price ? (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {price}
              </span>
            </div>
            {priceDetail && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {priceDetail}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-2 pt-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hubungi Tim
            </span>
            <p className="text-xs mt-1.5 leading-relaxed text-slate-500 dark:text-slate-400">
              {priceDetail}
            </p>
          </div>
        )}
      </div>

      {features && features.length > 0 && (
        <div className="mb-6 space-y-2.5 border-t pt-4 border-slate-100 dark:border-slate-800/80 text-xs">
          {features.slice(0, 4).map((f, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className={cn('size-4 shrink-0', highlight ? 'text-blue-600' : 'text-blue-600 dark:text-blue-400')} />
              <span className="text-slate-700 dark:text-slate-300">{f}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto space-y-3.5">
        <button
          type="button"
          onClick={onButtonClick}
          className={cn(
            'w-full rounded-full py-3 px-6 text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs',
            buttonVariant === 'primary' && 'bg-blue-700 text-white hover:bg-blue-800 hover:shadow-md hover:shadow-blue-600/20',
            buttonVariant === 'secondary' && (highlight
              ? 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700')
          )}
        >
          {buttonText}
          <ChevronRight className="w-4 h-4" />
        </button>

        {linkText && (
          <div className="text-center">
            <button
              type="button"
              onClick={onLinkClick}
              className="text-xs underline decoration-blue-400 underline-offset-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors cursor-pointer"
            >
              {linkText}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface CalculatorProps {
  onSelectPlanProposal?: (plan: PlanType) => void;
}

const Calculator = ({ onSelectPlanProposal }: CalculatorProps) => {
  const [students, setStudents] = useState<number>(450);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const calculatePrice = (count: number) => {
    let base = 712000;
    if (count > 500) {
      base += Math.round((count - 500) * 850);
    } else if (count < 350) {
      base = 450000;
    }
    return period === 'yearly' ? Math.round(base * 0.8) : base;
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-4xl mx-auto mt-10 p-7 sm:p-9 rounded-[32px] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden text-slate-900 dark:text-white"
    >
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl inline-flex border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPeriod('monthly')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  period === 'monthly' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setPeriod('yearly')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                  period === 'yearly' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <span>Tahunan BOS</span>
                <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-[9px] px-1.5 py-0.5 font-extrabold">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatRupiah(calculatePrice(students))}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">/ bulan</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
              Estimasi: ~Rp {(calculatePrice(students) / students).toFixed(0)} per siswa / bulan • Legal SPJ Dana BOS
            </p>
          </div>
        </div>

        <div className="flex-1 w-full pt-3 pb-2">
          {/* Custom Range Slider */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kapasitas Siswa:</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{students} Siswa</span>
          </div>

          <div className="relative h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-8">
            <div
              className="absolute left-0 top-0 bottom-0 bg-blue-600 rounded-full pointer-events-none"
              style={{ width: `${((students - 100) / 1400) * 100}%` }}
            />
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={students}
              onChange={(e) => setStudents(parseInt(e.target.value))}
              aria-label="Kapasitas Siswa"
              className="absolute -top-1.5 inset-x-0 w-full h-5.5 bg-transparent appearance-none cursor-pointer focus:outline-none z-20 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 
                [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            />

            {/* Ticks */}
            <div className="absolute top-5 left-0 right-0 flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              <span>100</span>
              <span>450</span>
              <span>800</span>
              <span>1,200</span>
              <span>1,500+</span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectPlanProposal && onSelectPlanProposal('unggulan')}
              className="bg-blue-700 text-white font-bold py-2.5 px-5 rounded-full text-xs sm:text-sm hover:bg-blue-800 transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              Ajukan Draf Proposal RKAS <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Termasuk BAST & E-Faktur Pajak</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export interface MixpanelPricingProps {
  onSelectPlan?: (planId: PlanType) => void;
}

export function MixpanelPricing({ onSelectPlan }: MixpanelPricingProps) {
  const scrollToCalculator = () => {
    const el = document.getElementById('pricing-calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="harga" className="relative w-full border-t border-slate-200/80 bg-slate-50/60 dark:border-slate-800/80 dark:bg-[#080d1a] py-14 sm:py-16 text-slate-900 dark:text-white font-sans transition-colors scroll-mt-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 max-w-3xl mx-auto">
          <div className="mb-3">
            <CinematicHeadline
              text="Investasi Transparan Tumbuh Bersama Sekolah Anda"
              as="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
              highlightText="Tumbuh Bersama Sekolah Anda"
              highlightClassName="text-blue-700 dark:text-blue-400"
            />
          </div>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
            Skema pembiayaan flat tanpa biaya tersembunyi. 100% legal dan memenuhi juknis pelaporan SPJ Dana BOSP / BOS Reguler maupun Kinerja Permendikbudristek No. 63/2023.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-14">
          <PricingCard
            title="Paket Perintis"
            subtitle="Ideal untuk sekolah skala dasar dengan kebutuhan dashboard guru & pemantauan kelas terpadu."
            price="Rp 360.000"
            priceDetail="per bulan ditagih tahunan. Kapasitas s.d. 300 siswa & 10 rombel. Efisien untuk dana BOS."
            buttonText="Pilih Paket Perintis"
            buttonVariant="secondary"
            onButtonClick={() => onSelectPlan && onSelectPlan('perintis')}
            features={[
              'Akses Guru Mapel, Wali Kelas, BK & Kepsek',
              'Modul Ajar Guru & Pemantauan Murid',
              'Presensi Rombel & Sinyal Siswa Terpadu',
              'Format BAST & Kwitansi Standar BOS',
            ]}
          />

          <PricingCard
            highlight
            title="Paket Unggulan"
            subtitle="Solusi terlengkap 6 dashboard peran: Guru Mapel, Wali Kelas, BK, Kepsek, Operator & Bendahara."
            price="Rp 712.000"
            priceDetail="per bulan ditagih tahunan. Mengelola s.d. 800 siswa terpadu. Sesuai juknis BOS."
            buttonText="Pilih Paket Unggulan"
            buttonVariant="primary"
            linkText="Hitung simulasi anggaran siswa"
            onButtonClick={() => onSelectPlan && onSelectPlan('unggulan')}
            onLinkClick={scrollToCalculator}
            features={[
              'Akses Lengkap 6 Peran Guru & Staf Sekolah',
              'Fitur AI: Pra-Audit Modul Ajar & Generator Rapor',
              'Validasi Residu Dapodik & Rekonsiliasi SPP',
              'WhatsApp Gateway Tanda Terima Resmi',
              'Paket Lengkap SPJ BOS: BAST & E-Faktur',
            ]}
          />

          <PricingCard
            title="Yayasan & Dinas"
            subtitle="Pengawasan multi-unit terpusat untuk Yayasan Pendidikan atau Cabang Dinas."
            price="Rp 1.480.000"
            priceDetail="per bulan ditagih tahunan. Kapasitas siswa & rombel tanpa batas di atas 800 Siswa. Dashboard yayasan terpusat."
            buttonText="Pilih Paket Yayasan"
            buttonVariant="secondary"
            onButtonClick={() => onSelectPlan && onSelectPlan('yayasan')}
            features={[
              'Kapasitas Akun GTK & Siswa Tanpa Batas',
              'Master Dashboard Multi-Sekolah Terpusat',
              'Batch AI Generator Rapor & Supervisi GTK',
              'Konsolidasi Dapodik & Keuangan Multi Unit',
              'Dedicated SLA 99.9% & Kunjungan On-Site',
            ]}
          />
        </div>

        {/* Calculator Section */}
        <div id="pricing-calculator" className="pt-8 pb-4">
          <div className="max-w-xl mx-auto text-center mb-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">
              Hitung Estimasi Anggaran <br />
              <span className="text-blue-700 dark:text-blue-400">Paket Unggulan Sekolah Anda *</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Geser penunjuk untuk menyesuaikan jumlah siswa aktif di sekolah Anda.
            </p>
          </div>

          <Calculator onSelectPlanProposal={onSelectPlan} />

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-5">
            * Seluruh paket langganan Tanggapin dapat dibiayai menggunakan alokasi Dana BOS Reguler atau Kinerja BOSP.
          </p>
        </div>
      </div>
    </section>
  );
}

export default MixpanelPricing;
