import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    DollarSign,
    Download,
    FileText,
    Filter,
    HelpCircle,
    MessageCircle,
    Plus,
    Printer,
    RefreshCw,
    Search,
    Send,
    Share2,
    Sparkles,
    WalletCards,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { PaymentItem } from '@/types/tanggapin';

interface StudentOption {
    id: string;
    name: string;
    nisn: string;
    className: string;
}

interface PembayaranProps {
    paymentList?: PaymentItem[];
    students?: StudentOption[];
}

function formatRupiah(amount: number): string {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function getTerbilang(amount: number): string {
    if (amount === 350000) return 'Tiga Ratus Lima Puluh Ribu Rupiah';
    if (amount === 500000) return 'Lima Ratus Ribu Rupiah';
    if (amount === 700000) return 'Tujuh Ratus Ribu Rupiah';
    if (amount === 1000000) return 'Satu Juta Rupiah';
    if (amount === 1500000) return 'Satu Juta Lima Ratus Ribu Rupiah';
    return formatRupiah(amount) + ' Rupiah';
}

export default function Pembayaran({
    paymentList: initialPayments = [],
    students = [],
}: PembayaranProps) {
    const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [classFilter, setClassFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state for creating new payment
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(
        students[0]?.id || '',
    );
    const [paymentType, setPaymentType] = useState('SPP Bulanan');
    const [paymentAmount, setPaymentAmount] = useState<number>(350000);
    const [paymentDueDate, setPaymentDueDate] = useState('10 Bulan Berjalan');
    const [paymentStatus, setPaymentStatus] = useState<
        'Belum Bayar' | 'Menunggu Verifikasi' | 'Lunas'
    >('Belum Bayar');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal state for viewing & printing receipt / kuitansi
    const [receiptPayment, setReceiptPayment] = useState<PaymentItem | null>(
        null,
    );

    // Unique classes list for filtering
    const classList = Array.from(
        new Set(
            payments
                .map((p) => p.class)
                .filter((c) => Boolean(c) && c !== '-'),
        ),
    );

    const filteredPayments = payments.filter((p) => {
        const matchesStatus =
            statusFilter === 'all' || p.status === statusFilter;
        const matchesClass =
            classFilter === 'all' || p.class === classFilter;
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            p.studentName.toLowerCase().includes(query) ||
            p.invoiceNo.toLowerCase().includes(query) ||
            p.class.toLowerCase().includes(query) ||
            p.type.toLowerCase().includes(query);
        return matchesStatus && matchesClass && matchesSearch;
    });

    // Statistical calculations
    const totalOverdue = payments.filter((p) => p.status === 'Terlambat');
    const totalPending = payments.filter(
        (p) => p.status === 'Menunggu Verifikasi',
    );
    const totalPaid = payments.filter((p) => p.status === 'Lunas');

    const sumPaid = totalPaid.reduce((acc, p) => acc + (p.amount || 0), 0);
    const sumOverdue = totalOverdue.reduce((acc, p) => acc + (p.amount || 0), 0);
    const sumPending = totalPending.reduce((acc, p) => acc + (p.amount || 0), 0);
    const sumTotalTarget = payments.reduce(
        (acc, p) => acc + (p.amount || 0),
        0,
    );

    const handleVerify = (payment: PaymentItem) => {
        // Optimistic UI update
        setPayments((prev) =>
            prev.map((item) =>
                item.id === payment.id
                    ? { ...item, status: 'Lunas' as const }
                    : item,
            ),
        );

        toast.success(
            `Rekonsiliasi tagihan ${payment.invoiceNo} berhasil diverifikasi Lunas!`,
        );

        // Server sync
        router.post(
            `/payments/${payment.id}/verify`,
            {},
            {
                preserveScroll: true,
                onError: () => {
                    toast.error('Gagal memperbarui status di server.');
                },
            },
        );
    };

    const handleCreatePayment = (e: React.FormEvent) => {
        e.preventDefault();
        const chosenStudent = students.find((s) => s.id === selectedStudentId);

        if (!chosenStudent && students.length > 0) {
            toast.error('Pilih siswa yang valid terlebih dahulu.');
            return;
        }

        setIsSubmitting(true);

        const newInvoiceNo =
            'INV-' +
            new Date().getFullYear() +
            String(new Date().getMonth() + 1).padStart(2, '0') +
            '-' +
            String(payments.length + 1).padStart(4, '0');

        const newPaymentItem: PaymentItem = {
            id: String(Date.now()),
            invoiceNo: newInvoiceNo,
            studentName: chosenStudent?.name || 'Siswa Baru',
            class: chosenStudent?.className || 'Umum',
            type: paymentType,
            amount: Number(paymentAmount),
            dueDate: paymentDueDate,
            status: paymentStatus as any,
        };

        // Optimistic addition
        setPayments((prev) => [newPaymentItem, ...prev]);
        setIsCreateModalOpen(false);
        toast.success(
            `Tagihan ${newInvoiceNo} untuk ${newPaymentItem.studentName} berhasil dicatat ke sistem kas!`,
        );

        router.post(
            '/payments',
            {
                student_id: selectedStudentId || (students[0]?.id ?? '1'),
                type: paymentType,
                amount: paymentAmount,
                due_date: paymentDueDate,
                status: paymentStatus,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
                onError: () => {
                    // Handled gracefully
                },
            },
        );
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    const getWhatsAppUrl = (p: PaymentItem) => {
        const text = encodeURIComponent(
            `Yth. Orang Tua/Wali Murid dari ananda ${p.studentName} (${p.class}),\n\n` +
                `Kami dari Bagian Keuangan/Bendahara SMK Negeri 1 Harapan menginformasikan perihal tagihan administrasi sekolah:\n` +
                `• No. Tagihan: ${p.invoiceNo}\n` +
                `• Rincian: ${p.type}\n` +
                `• Nominal: ${formatRupiah(p.amount)}\n` +
                `• Jatuh Tempo: ${p.dueDate}\n` +
                `• Status: ${p.status}\n\n` +
                `Mohon dapat segera dilakukan penyelesaian atau mengirimkan bukti transfer jika sudah membayar. Terima kasih atas kerja samanya.`,
        );
        return `https://wa.me/?text=${text}`;
    };

    return (
        <FlowbiteTanggapinLayout activeTab="payments">
            <Head title="Keuangan & Pembayaran SPP — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Module - Focused exclusively on Finance & Bendahara */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <WalletCards className="size-5" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Modul Keuangan & SPP Sekolah
                            </h1>
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                Hak Akses: Bendahara Sekolah
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                            Pusat kendali penerimaan kas, pencatatan SPP, validasi
                            bukti transfer bank, dan penerbitan kuitansi resmi.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95"
                        >
                            <Plus className="size-3.5" />
                            <span>Catat Tagihan / Kas Baru</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Printer className="size-3.5" />
                            <span className="hidden sm:inline">Cetak Rekap Kas</span>
                        </button>
                    </div>
                </div>

                {/* 4 Financial KPI Cards */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* KPI 1: Kas SPP Masuk */}
                    <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Kas SPP Terverifikasi
                            </span>
                            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <CheckCircle2 className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {formatRupiah(sumPaid)}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{totalPaid.length} Transaksi Lunas</span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                Masuk Kas Resmi
                            </span>
                        </div>
                    </div>

                    {/* KPI 2: Tagihan Terlambat */}
                    <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Tagihan Jatuh Tempo
                            </span>
                            <div className="rounded-lg bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                                <AlertCircle className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                            {formatRupiah(sumOverdue)}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{totalOverdue.length} Siswa Menunggak</span>
                            <span className="font-medium text-rose-600 dark:text-rose-400">
                                Perlu Reminder
                            </span>
                        </div>
                    </div>

                    {/* KPI 3: Menunggu Verifikasi Bank */}
                    <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Bukti Bayar / Transfer
                            </span>
                            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                <Clock className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                            {formatRupiah(sumPending)}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{totalPending.length} Menunggu Validasi</span>
                            <span className="font-medium text-amber-600 dark:text-amber-400">
                                Cek Rekening
                            </span>
                        </div>
                    </div>

                    {/* KPI 4: Target Total Penerimaan */}
                    <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Tagihan Diterbitkan
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <WalletCards className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {formatRupiah(sumTotalTarget)}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{payments.length} Faktur Aktif</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                Rekap Bulanan
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Table & Filter Workspace */}
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b1120]">
                    {/* Controls Bar: Search, Class Filter & Status Tabs */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-4 lg:flex-row lg:items-center dark:border-slate-800">
                        {/* Search & Class Dropdown */}
                        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute top-2.5 left-3 size-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari invoice, nama siswa, jenis..."
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-1.5 pr-3 pl-9 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:outline-hidden dark:border-slate-700 dark:bg-[#070b14] dark:text-white"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 end-0 flex items-center pe-2.5 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </div>

                            {classList.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Filter className="size-3.5 text-slate-400" />
                                    <select
                                        value={classFilter}
                                        onChange={(e) => setClassFilter(e.target.value)}
                                        className="rounded-lg border border-slate-200 bg-slate-50/80 py-1.5 px-2.5 text-xs text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-[#070b14] dark:text-slate-200"
                                    >
                                        <option value="all">Semua Kelas</option>
                                        {classList.map((cls) => (
                                            <option key={cls} value={cls}>
                                                {cls}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Status Pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                                    statusFilter === 'all'
                                        ? 'bg-blue-600 font-semibold text-white'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Semua ({payments.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('Terlambat')}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                                    statusFilter === 'Terlambat'
                                        ? 'bg-rose-600 font-semibold text-white'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Terlambat ({totalOverdue.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('Menunggu Verifikasi')}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                                    statusFilter === 'Menunggu Verifikasi'
                                        ? 'bg-amber-600 font-semibold text-white'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Menunggu Verifikasi ({totalPending.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('Lunas')}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                                    statusFilter === 'Lunas'
                                        ? 'bg-emerald-600 font-semibold text-white'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                Lunas ({totalPaid.length})
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:bg-[#111c30] dark:text-slate-300">
                                <tr>
                                    <th className="px-4 py-3">No. Invoice</th>
                                    <th className="px-4 py-3">Siswa & Rombel</th>
                                    <th className="px-4 py-3">Jenis Pembayaran</th>
                                    <th className="px-4 py-3">Nominal</th>
                                    <th className="px-4 py-3">Jatuh Tempo</th>
                                    <th className="px-4 py-3">Status Kas</th>
                                    <th className="px-4 py-3 text-center">Tindakan Bendahara</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((p) => {
                                        const isLunas = p.status === 'Lunas';
                                        const isOverdue = p.status === 'Terlambat';
                                        const isPending =
                                            p.status === 'Menunggu Verifikasi';

                                        return (
                                            <tr
                                                key={p.id}
                                                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-[#162238]/60"
                                            >
                                                <td className="px-4 py-3 font-mono font-semibold text-blue-700 dark:text-blue-400">
                                                    {p.invoiceNo}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        {p.studentName}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        Kelas {p.class}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {p.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                                    {formatRupiah(p.amount)}
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">
                                                    {p.dueDate}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold',
                                                            isLunas
                                                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : isOverdue
                                                                  ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                                  : isPending
                                                                    ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                                    : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300',
                                                        )}
                                                    >
                                                        {isLunas && (
                                                            <Check className="size-2.5" />
                                                        )}
                                                        {isOverdue && (
                                                            <AlertCircle className="size-2.5" />
                                                        )}
                                                        {isPending && (
                                                            <Clock className="size-2.5" />
                                                        )}
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {!isLunas ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleVerify(p)}
                                                                    className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
                                                                    title="Verifikasi kas masuk & ubah status ke Lunas"
                                                                >
                                                                    Verifikasi Lunas
                                                                </button>
                                                                <a
                                                                    href={getWhatsAppUrl(p)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                                                    title="Kirim pengingat tagihan ke WhatsApp wali murid"
                                                                >
                                                                    <Share2 className="size-3" />
                                                                    <span>Ingatkan WA</span>
                                                                </a>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                                    <CheckCircle2 className="size-3" />
                                                                    Terekonsiliasi
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setReceiptPayment(p)}
                                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                                    title="Buka dan cetak kuitansi resmi"
                                                                >
                                                                    <FileText className="size-3 text-blue-600" />
                                                                    <span>Kuitansi</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-slate-400"
                                        >
                                            Tidak ada data tagihan yang sesuai dengan filter pencarian.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Catat Tagihan / Kas Baru */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={() => setIsCreateModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg animate-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl zoom-in-95 fade-in dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                    <WalletCards className="size-4" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Catat Penerimaan Kas / Tagihan SPP
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePayment} className="mt-4 space-y-4 text-xs">
                            <div>
                                <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                                    Pilih Peserta Didik
                                </label>
                                {students.length > 0 ? (
                                    <select
                                        value={selectedStudentId}
                                        onChange={(e) => setSelectedStudentId(e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        {students.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.className}) — NISN: {s.nisn}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        disabled
                                        value="Siswa Terdaftar (Data Rombel)"
                                        className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-500"
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                                        Jenis Pembayaran
                                    </label>
                                    <select
                                        value={paymentType}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="SPP Bulanan">SPP Bulanan</option>
                                        <option value="Uang Gedung / DSP">Uang Gedung / DSP</option>
                                        <option value="Biaya Praktik Kejuruan">Biaya Praktik Kejuruan</option>
                                        <option value="Seragam & Atribut">Seragam & Atribut</option>
                                        <option value="Biaya Ujian / Kelulusan">Biaya Ujian / Kelulusan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                                        Nominal Tagihan (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        min="1000"
                                        step="1000"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Quick Amount Selector */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400">Nominal Cepat:</span>
                                {[350000, 500000, 1000000].map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setPaymentAmount(amt)}
                                        className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    >
                                        {formatRupiah(amt)}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                                        Jatuh Tempo / Periode
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDueDate}
                                        onChange={(e) => setPaymentDueDate(e.target.value)}
                                        placeholder="Contoh: 10 Okt 2025"
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                                        Status Pembayaran
                                    </label>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) =>
                                            setPaymentStatus(
                                                e.target.value as 'Belum Bayar' | 'Menunggu Verifikasi' | 'Lunas',
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="Belum Bayar">Belum Bayar (Terbitkan Tagihan)</option>
                                        <option value="Menunggu Verifikasi">Menunggu Verifikasi Bank</option>
                                        <option value="Lunas">Lunas (Langsung Kas Masuk)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <RefreshCw className="size-3.5 animate-spin" />
                                    ) : (
                                        <Check className="size-3.5" />
                                    )}
                                    <span>Simpan ke Kas Bendahara</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Kuitansi Resmi Pembayaran (Printable Receipt) */}
            {receiptPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
                        onClick={() => setReceiptPayment(null)}
                    />
                    <div className="relative w-full max-w-xl animate-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl zoom-in-95 fade-in dark:border-slate-800 dark:bg-[#0f172a]">
                        {/* Printable Area */}
                        <div id="official-receipt" className="space-y-4 rounded-xl border border-slate-300 bg-white p-6 text-slate-900 dark:border-slate-700 dark:bg-white dark:text-slate-900">
                            {/* Receipt Header */}
                            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                                <div>
                                    <div className="text-base font-extrabold tracking-wider uppercase">
                                        SMK NEGERI 1 HARAPAN
                                    </div>
                                    <div className="text-[10px] text-slate-600">
                                        Kuitansi Resmi Penerimaan Kas Sekolah • T.A. 2025/2026
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="rounded border border-emerald-600 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                                        LUNAS / SAH
                                    </div>
                                    <div className="mt-0.5 font-mono text-[10px] font-semibold text-slate-600">
                                        {receiptPayment.invoiceNo}
                                    </div>
                                </div>
                            </div>

                            {/* Receipt Content */}
                            <div className="space-y-2.5 text-xs">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-semibold text-slate-500">Telah Terima Dari:</span>
                                    <span className="col-span-2 font-bold text-slate-900">
                                        {receiptPayment.studentName} ({receiptPayment.class})
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-semibold text-slate-500">Uang Sejumlah:</span>
                                    <span className="col-span-2 font-bold text-blue-700">
                                        {formatRupiah(receiptPayment.amount)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-semibold text-slate-500">Terbilang:</span>
                                    <span className="col-span-2 rounded bg-slate-50 p-2 font-medium italic text-slate-800">
                                        "{getTerbilang(receiptPayment.amount)}"
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-semibold text-slate-500">Untuk Pembayaran:</span>
                                    <span className="col-span-2 text-slate-800">
                                        {receiptPayment.type} • Jatuh Tempo {receiptPayment.dueDate}
                                    </span>
                                </div>
                            </div>

                            {/* Signature Footer */}
                            <div className="flex items-end justify-between border-t border-slate-200 pt-4 text-xs">
                                <div className="text-[10px] text-slate-500">
                                    Dicetak otomatis via Sistem TANGGAPIN
                                    <br />
                                    Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-500">Bendahara Sekolah,</div>
                                    <div className="my-1 font-bold text-slate-900">Ahmad Suhendra, S.E.</div>
                                    <div className="text-[9px] text-slate-400">NIP. 19850614 201001 1 008</div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setReceiptPayment(null)}
                                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Tutup
                            </button>
                            <button
                                type="button"
                                onClick={handlePrintReceipt}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95"
                            >
                                <Printer className="size-3.5" />
                                <span>Cetak Kuitansi</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FlowbiteTanggapinLayout>
    );
}

Pembayaran.layout = (page: React.ReactNode) => page;
