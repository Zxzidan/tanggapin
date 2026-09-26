import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    Search,
    WalletCards,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { PaymentItem } from '@/types/tanggapin';

interface PembayaranProps {
    paymentList?: PaymentItem[];
}

export default function Pembayaran({ paymentList: initialPayments = [] }: PembayaranProps) {
    const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPayments = payments.filter((p) => {
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchesSearch =
            p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalOverdue = payments.filter((p) => p.status === 'Terlambat').length;
    const totalPending = payments.filter((p) => p.status === 'Menunggu Verifikasi').length;
    const totalPaid = payments.filter((p) => p.status === 'Lunas').length;

    const handleVerify = (invoiceNo: string) => {
        setPayments((prev) =>
            prev.map((item) =>
                item.invoiceNo === invoiceNo
                    ? { ...item, status: 'Lunas' }
                    : item
            )
        );
        toast.success(`Rekonsiliasi tagihan ${invoiceNo} berhasil diverifikasi & status diubah menjadi Lunas!`);
    };

    return (
        <FlowbiteTanggapinLayout activeTab="payments">
            <Head title="Pembayaran & SPP — TANGGAPIN" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Module */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                                <WalletCards className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Pembayaran & SPP (Rekonsiliasi Bendahara)
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            Menghubungkan catatan pembayaran dengan status pendampingan siswa, menghindari penagihan keliru kepada siswa rentan atau penerima afirmasi.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-purple-500 animate-pulse" />
                            {totalOverdue} Tagihan Perlu Perhatian
                        </span>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Tagihan Jatuh Tempo / Terlambat</span>
                            <div className="text-2xl font-bold text-red-600 mt-0.5">
                                {totalOverdue}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-600">
                            <AlertCircle className="size-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Menunggu Verifikasi Bank</span>
                            <div className="text-2xl font-bold text-amber-600 mt-0.5">
                                {totalPending}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
                            <Clock className="size-5" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-medium">Terverifikasi Lunas</span>
                            <div className="text-2xl font-bold text-emerald-600 mt-0.5">
                                {totalPaid}
                            </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                            <CheckCircle2 className="size-5" />
                        </div>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    {/* Controls Bar: Search & Status Pills */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama siswa, invoice, jenis..."
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-center">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-lg font-medium transition-colors',
                                    statusFilter === 'all'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                )}
                            >
                                Semua ({payments.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('Terlambat')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-lg font-medium transition-colors',
                                    statusFilter === 'Terlambat'
                                        ? 'bg-red-600 text-white font-semibold'
                                        : 'text-slate-500 hover:bg-red-50 hover:text-red-700'
                                )}
                            >
                                Terlambat
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('Menunggu Verifikasi')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-lg font-medium transition-colors',
                                    statusFilter === 'Menunggu Verifikasi'
                                        ? 'bg-amber-600 text-white font-semibold'
                                        : 'text-slate-500 hover:bg-amber-50 hover:text-amber-700'
                                )}
                            >
                                Menunggu Verifikasi
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('Lunas')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-lg font-medium transition-colors',
                                    statusFilter === 'Lunas'
                                        ? 'bg-emerald-600 text-white font-semibold'
                                        : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                                )}
                            >
                                Lunas
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                            <thead className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase bg-slate-50 dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">No. Invoice</th>
                                    <th className="px-4 py-3">Siswa & Kelas</th>
                                    <th className="px-4 py-3">Jenis Pembayaran</th>
                                    <th className="px-4 py-3">Nominal</th>
                                    <th className="px-4 py-3">Jatuh Tempo</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">Aksi Rekonsiliasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162238]/60 transition-colors">
                                            <td className="px-4 py-3 font-mono font-semibold text-blue-700 dark:text-blue-400">
                                                {p.invoiceNo}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                                {p.studentName} <span className="text-slate-400 font-normal">({p.class})</span>
                                            </td>
                                            <td className="px-4 py-3">{p.type}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                                Rp {p.amount.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">{p.dueDate}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'px-2 py-0.5 rounded text-[10px] font-bold border',
                                                        p.status === 'Lunas'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                            : p.status === 'Terlambat'
                                                            ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900'
                                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                                                    )}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {p.status !== 'Lunas' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleVerify(p.invoiceNo)}
                                                        className="px-3 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg border border-blue-200 dark:border-blue-900 transition-colors"
                                                    >
                                                        Verifikasi Lunas
                                                    </button>
                                                ) : (
                                                    <span className="text-emerald-600 text-[11px] font-semibold flex items-center justify-center gap-1">
                                                        <CheckCircle2 className="size-3" />
                                                        Telah Direkonsiliasi
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                                            Tidak ada data tagihan yang sesuai kriteria pencarian.
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

Pembayaran.layout = (page: React.ReactNode) => page;
