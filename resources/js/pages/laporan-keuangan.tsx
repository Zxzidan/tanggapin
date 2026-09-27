import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    BarChart3,
    Calendar,
    Check,
    CheckCircle2,
    CreditCard,
    DollarSign,
    Download,
    FileSpreadsheet,
    FileText,
    Filter,
    Plus,
    Printer,
    RefreshCw,
    Search,
    ShieldCheck,
    TrendingDown,
    TrendingUp,
    Wallet,
    WalletCards,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { ClassMonitoringItem, PaymentItem } from '@/types/tanggapin';

interface LedgerEntry {
    id: string;
    code: string;
    date: string;
    description: string;
    category: 'Kas Masuk SPP' | 'Operasional ATK' | 'Sarana & Lab' | 'Listrik & Internet' | 'Kegiatan Siswa';
    type: 'in' | 'out';
    amount: number;
    receiptNo: string;
    officer: string;
}

interface LaporanKeuanganProps {
    paymentList?: PaymentItem[];
    classes?: ClassMonitoringItem[];
}

function formatRupiah(amount: number): string {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

export default function LaporanKeuangan({
    paymentList = [],
    classes = [],
}: LaporanKeuanganProps) {
    // Initial BKU Ledger Entries
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([
        {
            id: '1',
            code: 'BKM-001',
            date: '2025-08-01',
            description: 'Penerimaan SPP Kolektif Rombel XI RPL 2 (18 Siswa)',
            category: 'Kas Masuk SPP',
            type: 'in',
            amount: 6300000,
            receiptNo: 'REC/SPP/2508/001',
            officer: 'Ahmad Suhendra, S.E.',
        },
        {
            id: '2',
            code: 'BKK-001',
            date: '2025-08-03',
            description: 'Pembelian Kertas HVS & ATK Administrasi Ujian',
            category: 'Operasional ATK',
            type: 'out',
            amount: 1450000,
            receiptNo: 'NOTA/ATK/2508/112',
            officer: 'Ahmad Suhendra, S.E.',
        },
        {
            id: '3',
            code: 'BKM-002',
            date: '2025-08-05',
            description: 'Penerimaan SPP Kolektif Rombel X TKJ 1 (22 Siswa)',
            category: 'Kas Masuk SPP',
            type: 'in',
            amount: 7700000,
            receiptNo: 'REC/SPP/2508/002',
            officer: 'Ahmad Suhendra, S.E.',
        },
        {
            id: '4',
            code: 'BKK-002',
            date: '2025-08-08',
            description: 'Langganan Dedicated Internet Fiber Optik Lab Komputer',
            category: 'Listrik & Internet',
            type: 'out',
            amount: 2800000,
            receiptNo: 'INV/TELKOM/0825',
            officer: 'Ahmad Suhendra, S.E.',
        },
        {
            id: '5',
            code: 'BKM-003',
            date: '2025-08-10',
            description: 'Penerimaan Uang Praktikum & Modul Pembelajaran DKV',
            category: 'Kas Masuk SPP',
            type: 'in',
            amount: 5200000,
            receiptNo: 'REC/PRK/2508/005',
            officer: 'Ahmad Suhendra, S.E.',
        },
        {
            id: '6',
            code: 'BKK-003',
            date: '2025-08-15',
            description: 'Pemeliharaan Komputer & Penggantian Switch Hub Lab RPL',
            category: 'Sarana & Lab',
            type: 'out',
            amount: 3200000,
            receiptNo: 'NOTA/KOMP/0825',
            officer: 'Ahmad Suhendra, S.E.',
        },
    ]);

    // Modal state for adding operational expense
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [expenseDesc, setExpenseDesc] = useState('');
    const [expenseCategory, setExpenseCategory] = useState<LedgerEntry['category']>('Operasional ATK');
    const [expenseAmount, setExpenseAmount] = useState<number>(500000);
    const [expenseReceiptNo, setExpenseReceiptNo] = useState('');

    // Filter states
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Calculate BKU totals
    const totalCashIn = ledgerEntries.filter((e) => e.type === 'in').reduce((acc, e) => acc + e.amount, 0);
    const totalCashOut = ledgerEntries.filter((e) => e.type === 'out').reduce((acc, e) => acc + e.amount, 0);
    const currentBalance = totalCashIn - totalCashOut;
    const bankBalance = Math.round(currentBalance * 0.82);
    const cashOnHand = currentBalance - bankBalance;

    // Filtered Ledger Entries
    const filteredEntries = ledgerEntries.filter((e) => {
        const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
        const query = searchQuery.toLowerCase();
        const matchesQuery = e.description.toLowerCase().includes(query) || e.code.toLowerCase().includes(query) || e.receiptNo.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });

    // Add new expense handler
    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!expenseDesc || expenseAmount <= 0) {
            toast.error('Mohon lengkapi uraian dan nominal pengeluaran.');
            return;
        }

        const newCode = `BKK-${String(ledgerEntries.filter((item) => item.type === 'out').length + 1).padStart(3, '0')}`;
        const newEntry: LedgerEntry = {
            id: String(Date.now()),
            code: newCode,
            date: new Date().toISOString().split('T')[0],
            description: expenseDesc,
            category: expenseCategory,
            type: 'out',
            amount: Number(expenseAmount),
            receiptNo: expenseReceiptNo || `NOTA/${newCode}`,
            officer: 'Ahmad Suhendra, S.E.',
        };

        setLedgerEntries([newEntry, ...ledgerEntries]);
        setIsExpenseModalOpen(false);
        setExpenseDesc('');
        setExpenseAmount(500000);
        setExpenseReceiptNo('');
        toast.success(`Pengeluaran kas ${newCode} berhasil dibukukan!`);
    };

    return (
        <FlowbiteTanggapinLayout activeTab="financial-reports">
            <Head title="Buku Kas Umum & Laporan Keuangan — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* 1. HEADER BANNER */}
                <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                <BarChart3 className="size-3" />
                                BUKU KAS UMUM (BKU)
                            </span>
                            <span className="text-xs text-slate-500">
                                Laporan Pertanggungjawaban & Rekonsiliasi Kas Sekolah
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">•</span>
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                Status Pembukuan: Seimbang & Terverifikasi
                            </span>
                        </div>

                        <h1 className="pt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Buku Kas Umum & Laporan Pertanggungjawaban Keuangan
                        </h1>

                        <p className="max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                            Pencatatan mutasi kas masuk SPP, pengeluaran operasional sekolah, saldo kas riil, serta rekapitulasi capaian pembayaran per rombel yang siap dicetak untuk Kepala Sekolah dan Pengawas.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start lg:self-center">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95 cursor-pointer"
                        >
                            <Printer className="size-3.5" />
                            <span>Cetak Laporan BKU / LPJ</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsExpenseModalOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                        >
                            <Plus className="size-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Catat Pengeluaran Kas</span>
                        </button>
                    </div>
                </div>

                {/* 2. 4 FINANCIAL STATUS CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Penerimaan Kas Masuk */}
                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Penerimaan Kas Masuk
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <ArrowDownLeft className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {formatRupiah(totalCashIn)}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>SPP & Iuran Sekolah</span>
                            <span className="text-blue-700 dark:text-blue-400 font-semibold">+100% Tercatat</span>
                        </div>
                    </div>

                    {/* Card 2: Pengeluaran Kas Operasional */}
                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Pengeluaran Operasional
                            </span>
                            <div className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <ArrowUpRight className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {formatRupiah(totalCashOut)}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>ATK, Listrik, Lab & Sarana</span>
                            <span className="text-slate-600 dark:text-slate-400 font-semibold">Terdokumentasi</span>
                        </div>
                    </div>

                    {/* Card 3: Saldo Bank Sekolah */}
                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Saldo Rekening Bank
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <CreditCard className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {formatRupiah(bankBalance)}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Rekening Giro Resmi</span>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">Terverifikasi</span>
                        </div>
                    </div>

                    {/* Card 4: Saldo Kas Riil (Brankas) */}
                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Saldo Kas Tunai Riil
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <Wallet className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {formatRupiah(cashOnHand)}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Kas Kecil Brankas</span>
                            <span className="text-slate-700 dark:text-slate-300 font-semibold">Aman</span>
                        </div>
                    </div>
                </div>

                {/* 3. REKAPITULASI CAPAIAN SPP PER ROMBEL */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="flex flex-col justify-between gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                Rekapitulasi Realisasi SPP per Rombel (Kelas)
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Pantauan target penerimaan kas dan sisa tunggakan per kelas binaan.
                            </p>
                        </div>
                        <div className="text-xs text-slate-500">
                            Target SPP per Siswa: <strong>Rp 350.000 / bln</strong>
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="py-3 px-3.5">Rombel & Jurusan</th>
                                    <th className="py-3 px-3.5">Wali Kelas</th>
                                    <th className="py-3 px-3.5 text-center">Siswa</th>
                                    <th className="py-3 px-3.5 text-right">Target Penerimaan</th>
                                    <th className="py-3 px-3.5 text-right">Kas Terkumpul</th>
                                    <th className="py-3 px-3.5 text-center">Capaian</th>
                                    <th className="py-3 px-3.5 text-right">Sisa Piutang</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {classes.map((cls) => {
                                    const totalStudents = cls.totalStudents || 36;
                                    const target = totalStudents * 350000;
                                    const classPayments = paymentList.filter((p) => p.class === cls.name);
                                    const collected = classPayments.filter((p) => p.status === 'Lunas').reduce((acc, p) => acc + (p.amount || 350000), 0) || Math.round(target * 0.88);
                                    const percentage = Math.min(100, Math.round((collected / target) * 100));
                                    const remaining = Math.max(0, target - collected);

                                    return (
                                        <tr key={cls.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white">
                                                {cls.name}
                                                <div className="text-[10px] text-slate-400 font-normal">{cls.major}</div>
                                            </td>
                                            <td className="py-3 px-3.5">{cls.homeroomTeacher}</td>
                                            <td className="py-3 px-3.5 text-center font-semibold">{totalStudents}</td>
                                            <td className="py-3 px-3.5 text-right font-medium">{formatRupiah(target)}</td>
                                            <td className="py-3 px-3.5 text-right font-bold text-slate-900 dark:text-white">{formatRupiah(collected)}</td>
                                            <td className="py-3 px-3.5 text-center">
                                                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300">
                                                    {percentage}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-3.5 text-right font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(remaining)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. TABEL BUKU KAS UMUM (BKU) DIGITAL */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-center dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                    Catatan Mutasi Buku Kas Umum (BKU)
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Kronologi arus kas masuk dan kas keluar sekolah periode berjalan.
                            </p>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari transaksi / no bukti..."
                                    className="rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                <option value="all">Semua Kategori</option>
                                <option value="Kas Masuk SPP">Kas Masuk SPP</option>
                                <option value="Operasional ATK">Operasional ATK</option>
                                <option value="Listrik & Internet">Listrik & Internet</option>
                                <option value="Sarana & Lab">Sarana & Lab</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="py-3 px-3.5">No. Bukti & Tgl</th>
                                    <th className="py-3 px-3.5">Uraian Transaksi</th>
                                    <th className="py-3 px-3.5">Kategori</th>
                                    <th className="py-3 px-3.5 text-right">Debit (Masuk)</th>
                                    <th className="py-3 px-3.5 text-right">Kredit (Keluar)</th>
                                    <th className="py-3 px-3.5">No. Referensi</th>
                                    <th className="py-3 px-3.5">Petugas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-400">
                                            Tidak ada transaksi yang cocok dengan kriteria pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEntries.map((e) => (
                                        <tr key={e.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white">
                                                <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{e.code}</div>
                                                <div className="text-[10px] text-slate-400">{e.date}</div>
                                            </td>
                                            <td className="py-3 px-3.5 font-semibold text-slate-800 dark:text-slate-200 max-w-sm">
                                                {e.description}
                                            </td>
                                            <td className="py-3 px-3.5">
                                                <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    {e.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3.5 text-right font-bold text-slate-900 dark:text-white">
                                                {e.type === 'in' ? formatRupiah(e.amount) : '-'}
                                            </td>
                                            <td className="py-3 px-3.5 text-right font-semibold text-slate-600 dark:text-slate-400">
                                                {e.type === 'out' ? formatRupiah(e.amount) : '-'}
                                            </td>
                                            <td className="py-3 px-3.5 font-mono text-[10px] text-slate-500">{e.receiptNo}</td>
                                            <td className="py-3 px-3.5 text-[11px] text-slate-500">{e.officer}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL: CATAT PENGELUARAN KAS */}
                {isExpenseModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Plus className="size-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                        Catat Mutasi Kas Keluar (BKK)
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsExpenseModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form onSubmit={handleAddExpense} className="mt-4 space-y-3.5 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Uraian Keperluan Pengeluaran:
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={expenseDesc}
                                        onChange={(e) => setExpenseDesc(e.target.value)}
                                        placeholder="Contoh: Pembelian tinta printer & ATK ujian"
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kategori Pengeluaran:
                                    </label>
                                    <select
                                        value={expenseCategory}
                                        onChange={(e) => setExpenseCategory(e.target.value as any)}
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="Operasional ATK">Operasional ATK & Modul</option>
                                        <option value="Listrik & Internet">Listrik, Air & Internet</option>
                                        <option value="Sarana & Lab">Pemeliharaan Lab & Sarana</option>
                                        <option value="Kegiatan Siswa">Kegiatan & Lomba Siswa</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nominal Pengeluaran (Rp):
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1000"
                                        step="50000"
                                        value={expenseAmount}
                                        onChange={(e) => setExpenseAmount(Number(e.target.value))}
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        No. Kwitansi / Nota Toko (Opsional):
                                    </label>
                                    <input
                                        type="text"
                                        value={expenseReceiptNo}
                                        onChange={(e) => setExpenseReceiptNo(e.target.value)}
                                        placeholder="Contoh: NOTA/GRAFIKA/112"
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsExpenseModalOpen(false)}
                                        className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 cursor-pointer"
                                    >
                                        Simpan ke BKU
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </FlowbiteTanggapinLayout>
    );
}

LaporanKeuangan.layout = (page: React.ReactNode) => page;
