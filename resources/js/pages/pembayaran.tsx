import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
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

export default function Pembayaran({
    paymentList: initialPayments = [],
}: PembayaranProps) {
    const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPayments = payments.filter((p) => {
        const matchesStatus =
            statusFilter === 'all' || p.status === statusFilter;
        const matchesSearch =
            p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalOverdue = payments.filter(
        (p) => p.status === 'Terlambat',
    ).length;
    const totalPending = payments.filter(
        (p) => p.status === 'Menunggu Verifikasi',
    ).length;
    const totalPaid = payments.filter((p) => p.status === 'Lunas').length;

    const handleVerify = (invoiceNo: string) => {
        setPayments((prev) =>
            prev.map((item) =>
                item.invoiceNo === invoiceNo
                    ? { ...item, status: 'Lunas' }
                    : item,
            ),
        );
        toast.success(
            `Rekonsiliasi tagihan ${invoiceNo} berhasil diverifikasi & status diubah menjadi Lunas!`,
        );
    };

    return (
        <FlowbiteTanggapinLayout activeTab="payments">
            <Head title="Pembayaran & SPP — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0f172a]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <WalletCards className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Pembayaran & SPP — Rekonsiliasi Bendahara
                            </h1>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Menghubungkan catatan pembayaran dengan status
                            pendampingan siswa, menghindari penagihan keliru
                            kepada siswa rentan atau penerima afirmasi.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                        <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            <span className="size-2 rounded-full bg-blue-600" />
                            {totalOverdue} Tagihan Perlu Perhatian
                        </span>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Tagihan Jatuh Tempo / Terlambat
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {totalOverdue}
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <AlertCircle className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Menunggu Verifikasi Bank
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                                {totalPending}
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <Clock className="size-5" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                        <div>
                            <span className="text-xs font-medium text-slate-500">
                                Terverifikasi Lunas
                            </span>
                            <div className="mt-0.5 text-2xl font-bold text-blue-700 dark:text-blue-400">
                                {totalPaid}
                            </div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            <CheckCircle2 className="size-5" />
                        </div>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
                    {/* Controls Bar: Search & Status Pills */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute top-2.5 left-3 size-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama siswa, invoice, jenis..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600/30 focus:outline-none dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-center">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    statusFilter === 'all'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Semua: {payments.length}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('Terlambat')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    statusFilter === 'Terlambat'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Terlambat
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setStatusFilter('Menunggu Verifikasi')
                                }
                                className={cn(
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    statusFilter === 'Menunggu Verifikasi'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Menunggu Verifikasi
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('Lunas')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                                    statusFilter === 'Lunas'
                                        ? 'bg-blue-700 font-semibold text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Lunas
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:bg-[#111c30] dark:text-slate-300">
                                <tr>
                                    <th className="px-4 py-3">No. Invoice</th>
                                    <th className="px-4 py-3">Siswa & Kelas</th>
                                    <th className="px-4 py-3">
                                        Jenis Pembayaran
                                    </th>
                                    <th className="px-4 py-3">Nominal</th>
                                    <th className="px-4 py-3">Jatuh Tempo</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">
                                        Aksi Rekonsiliasi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-[#162238]/60"
                                        >
                                            <td className="px-4 py-3 font-mono font-semibold text-blue-700 dark:text-blue-400">
                                                {p.invoiceNo}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                                {p.studentName}{' '}
                                                <span className="font-normal text-slate-400">
                                                    — {p.class}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {p.type}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                                Rp{' '}
                                                {p.amount.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {p.dueDate}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'rounded border px-2 py-0.5 text-[10px] font-bold',
                                                        p.status === 'Lunas'
                                                            ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                            : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300',
                                                    )}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {p.status !== 'Lunas' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleVerify(
                                                                p.invoiceNo,
                                                            )
                                                        }
                                                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
                                                    >
                                                        Verifikasi Lunas
                                                    </button>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                                                        <CheckCircle2 className="size-3" />
                                                        Telah Direkonsiliasi
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-slate-400"
                                        >
                                            Tidak ada data tagihan yang sesuai
                                            kriteria pencarian.
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
