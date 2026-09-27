import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    DollarSign,
    ExternalLink,
    Filter,
    HelpCircle,
    MessageCircle,
    MessageSquare,
    PhoneCall,
    Printer,
    RefreshCw,
    Search,
    Send,
    ShieldCheck,
    Sparkles,
    UserCheck,
    Users,
    WalletCards,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import FlowbiteTanggapinLayout from '@/layouts/flowbite-tanggapin-layout';
import { cn } from '@/lib/utils';
import type { PaymentItem } from '@/types/tanggapin';

interface StudentData {
    id: string;
    name: string;
    nisn: string;
    className: string;
    parentName: string;
    parentPhone: string;
    attendanceRate: number;
    riskLevel: string;
}

interface ReminderSppProps {
    paymentList?: PaymentItem[];
    students?: StudentData[];
}

function formatRupiah(amount: number): string {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

export default function ReminderSpp({
    paymentList = [],
    students = [],
}: ReminderSppProps) {
    // Build overdue / pending billing items
    const [billingList, setBillingList] = useState(() => {
        return paymentList.map((p, idx) => {
            const matchedStudent = students.find((s) => s.name === p.studentName) || students[idx % students.length];
            return {
                id: p.id,
                studentId: matchedStudent?.id || String(idx),
                studentName: p.studentName,
                className: p.class || matchedStudent?.className || 'XI RPL 2',
                parentName: matchedStudent?.parentName || 'Bapak/Ibu Wali Murid',
                parentPhone: matchedStudent?.parentPhone || '081234567890',
                amount: p.amount || 350000,
                dueDate: p.dueDate || '10 Bulan Berjalan',
                status: p.status,
                reminderStatus: p.status === 'Lunas' ? 'Lunas' : idx % 2 === 0 ? 'Sudah Diingatkan' : 'Belum Diingatkan',
                lastSentAt: idx % 2 === 0 ? 'Kemarin 14:20' : null,
                promiseDate: null as string | null,
            };
        });
    });

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [classFilter, setClassFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state for sending reminder
    const [activeModalItem, setActiveModalItem] = useState<any | null>(null);
    const [customMessage, setCustomMessage] = useState('');
    const [isPromiseModalOpen, setIsPromiseModalOpen] = useState(false);
    const [promiseItem, setPromiseItem] = useState<any | null>(null);
    const [promiseDateInput, setPromiseDateInput] = useState('');

    // Unique classes
    const uniqueClasses = Array.from(new Set(billingList.map((b) => b.className)));

    // Filtered list
    const filteredBilling = billingList.filter((b) => {
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'belum' && b.reminderStatus === 'Belum Diingatkan') ||
            (statusFilter === 'sudah' && b.reminderStatus === 'Sudah Diingatkan') ||
            (statusFilter === 'terlambat' && b.status === 'Terlambat') ||
            (statusFilter === 'janji' && Boolean(b.promiseDate));
        const matchesClass = classFilter === 'all' || b.className === classFilter;
        const q = searchQuery.toLowerCase();
        const matchesQuery =
            b.studentName.toLowerCase().includes(q) ||
            b.parentName.toLowerCase().includes(q) ||
            b.className.toLowerCase().includes(q);
        return matchesStatus && matchesClass && matchesQuery;
    });

    const openSendModal = (item: any) => {
        const va = `8808${item.studentId.padStart(6, '0')}`;
        const msg = `Assalamu’alaikum Wr. Wb. Yth. Bapak/Ibu ${item.parentName}, kami dari Bagian Keuangan SMK Negeri 1 Harapan menginformasikan tagihan SPP Ananda ${item.studentName} (${item.className}) sebesar ${formatRupiah(item.amount)} jatuh tempo pada ${item.dueDate}. Pembayaran dapat dilakukan via transfer VA: ${va}. Jika ada kendala, mohon hubungi kami. Terima kasih.`;
        setCustomMessage(msg);
        setActiveModalItem(item);
    };

    const handleSendWhatsApp = () => {
        if (!activeModalItem) return;
        let cleanPhone = activeModalItem.parentPhone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        }
        const text = encodeURIComponent(customMessage);
        window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');

        // Update status in state
        setBillingList((prev) =>
            prev.map((item) =>
                item.id === activeModalItem.id
                    ? { ...item, reminderStatus: 'Sudah Diingatkan', lastSentAt: 'Baru saja' }
                    : item
            )
        );
        setActiveModalItem(null);
        toast.success(`Reminder berhasil dikirim ke WhatsApp ${activeModalItem.parentName}!`);
    };

    const handleSavePromiseDate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!promiseItem || !promiseDateInput) return;

        setBillingList((prev) =>
            prev.map((item) =>
                item.id === promiseItem.id
                    ? { ...item, promiseDate: promiseDateInput, reminderStatus: 'Dispensasi Janji Bayar' }
                    : item
            )
        );
        toast.success(`Kesepakatan janji bayar untuk ${promiseItem.studentName} berhasil dicatat!`);
        setIsPromiseModalOpen(false);
        setPromiseItem(null);
        setPromiseDateInput('');
    };

    const handleBroadcastPending = () => {
        toast.info('Menyiapkan antrean broadcast reminder santun untuk siswa belum bayar...');
        setTimeout(() => {
            setBillingList((prev) =>
                prev.map((item) =>
                    item.status !== 'Lunas'
                        ? { ...item, reminderStatus: 'Sudah Diingatkan', lastSentAt: 'Baru saja' }
                        : item
                )
            );
            toast.success('Broadcast reminder santun berhasil dikirimkan ke 8 wali murid!');
        }, 1200);
    };

    return (
        <FlowbiteTanggapinLayout activeTab="finance-reminder">
            <Head title="Reminder Tagihan SPP & Komunikasi Ortu — TANGGAPIN" />

            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* 1. HEADER BANNER */}
                <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                <PhoneCall className="size-3" />
                                PUSAT REMINDER TAGIHAN
                            </span>
                            <span className="text-xs text-slate-500">
                                Komunikasi & Pendampingan Finansial Orang Tua Siswa
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">•</span>
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                WhatsApp Gateway: Terkoneksi
                            </span>
                        </div>

                        <h1 className="pt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Pusat Reminder Tagihan SPP & Koordinasi Orang Tua
                        </h1>

                        <p className="max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                            Kelola jadwal pengingat pembayaran SPP jatuh tempo, koordinasikan dispensasi cicilan dengan wali murid, dan kirimkan notifikasi santun berbasis WhatsApp dengan satu klik.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start lg:self-center">
                        <button
                            type="button"
                            onClick={handleBroadcastPending}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95 cursor-pointer"
                        >
                            <Send className="size-3.5" />
                            <span>Broadcast Reminder Serentak</span>
                        </button>
                        <Link
                            href="/analisis-keuangan"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                            <span>AI Analisis Finansial</span>
                        </Link>
                    </div>
                </div>

                {/* 2. 4 STATUS CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Tagihan Jatuh Tempo
                            </span>
                            <div className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <Clock className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {billingList.filter((b) => b.status !== 'Lunas').length} Siswa
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Menunggu konfirmasi pembayaran bulan berjalan
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Reminder Terkirim
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <Send className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {billingList.filter((b) => b.reminderStatus === 'Sudah Diingatkan').length} Wali Murid
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Terkirim via WhatsApp resmi sekolah
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Kesepakatan Janji Bayar
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                <Calendar className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {billingList.filter((b) => Boolean(b.promiseDate)).length || 3} Siswa
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Dispensasi penyesuaian tanggal gajian orang tua
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Respons Positif Ortu
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <MessageCircle className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            88.2%
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Tingkat respons komunikasi santun & kekeluargaan
                        </p>
                    </div>
                </div>

                {/* 3. TABEL DAFTAR TAGIHAN & REMINDER */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-[#0b1120]">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-center dark:border-slate-800">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                Daftar Siswa & Status Notifikasi Tagihan
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Pantau dan kirimkan pesan reminder secara personal atau jadwalkan janji bayar.
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
                                    placeholder="Cari siswa / wali murid..."
                                    className="rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <select
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                <option value="all">Semua Rombel</option>
                                {uniqueClasses.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                <option value="all">Semua Status</option>
                                <option value="belum">Belum Diingatkan</option>
                                <option value="sudah">Sudah Diingatkan</option>
                                <option value="terlambat">Status Terlambat</option>
                                <option value="janji">Dispensasi Janji Bayar</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="py-3 px-3.5">Nama Siswa & Rombel</th>
                                    <th className="py-3 px-3.5">Orang Tua / Wali</th>
                                    <th className="py-3 px-3.5">Nominal SPP</th>
                                    <th className="py-3 px-3.5">Jatuh Tempo</th>
                                    <th className="py-3 px-3.5">Status Tagihan</th>
                                    <th className="py-3 px-3.5">Status Notifikasi</th>
                                    <th className="py-3 px-3.5 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredBilling.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-400">
                                            Tidak ada data tagihan yang sesuai.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBilling.map((b) => (
                                        <tr key={b.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white">
                                                {b.studentName}
                                                <div className="text-[10px] text-slate-400 font-normal">{b.className}</div>
                                            </td>
                                            <td className="py-3 px-3.5">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">{b.parentName}</div>
                                                <div className="text-[10px] text-slate-400">{b.parentPhone}</div>
                                            </td>
                                            <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-white">
                                                {formatRupiah(b.amount)}
                                            </td>
                                            <td className="py-3 px-3.5 text-slate-500">{b.dueDate}</td>
                                            <td className="py-3 px-3.5">
                                                <span className={cn(
                                                    'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border',
                                                    b.status === 'Lunas'
                                                        ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300'
                                                        : b.status === 'Terlambat'
                                                          ? 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                                                          : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                )}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3.5">
                                                {b.promiseDate ? (
                                                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block">
                                                        Janji Bayar: {b.promiseDate}
                                                    </span>
                                                ) : b.reminderStatus === 'Sudah Diingatkan' ? (
                                                    <div>
                                                        <span className="text-blue-700 dark:text-blue-400 font-semibold text-[10px]">
                                                            ✓ Sudah Diingatkan
                                                        </span>
                                                        <span className="text-[9px] text-slate-400 block">{b.lastSentAt}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-[10px]">
                                                        Belum Diingatkan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openSendModal(b)}
                                                        className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-700 active:scale-95 cursor-pointer"
                                                        title="Kirim pesan reminder WhatsApp"
                                                    >
                                                        <Send className="size-3" />
                                                        <span>Kirim WA</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPromiseItem(b);
                                                            setIsPromiseModalOpen(true);
                                                        }}
                                                        className="rounded-md border border-slate-200 bg-white p-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                                                        title="Catat Janji Bayar / Dispensasi"
                                                    >
                                                        <Calendar className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL: KIRIM PESAN WHATSAPP */}
                {activeModalItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="size-5 text-blue-700 dark:text-blue-400" />
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                        Kirim Pengingat Tagihan SPP
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveModalItem(null)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50 space-y-1">
                                    <div><strong>Siswa:</strong> {activeModalItem.studentName} ({activeModalItem.className})</div>
                                    <div><strong>Wali Murid:</strong> {activeModalItem.parentName} ({activeModalItem.parentPhone})</div>
                                    <div><strong>Nominal:</strong> {formatRupiah(activeModalItem.amount)}</div>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Teks Pesan WhatsApp (Bisa diedit):
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={customMessage}
                                        onChange={(e) => setCustomMessage(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900 leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setActiveModalItem(null)}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSendWhatsApp}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 active:scale-95 cursor-pointer"
                                >
                                    <Send className="size-3.5" />
                                    <span>Buka & Kirim via WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: CATAT KESEPAKATAN JANJI BAYAR */}
                {isPromiseModalOpen && promiseItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0b1120]">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                        Catat Janji Bayar / Dispensasi
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsPromiseModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSavePromiseDate} className="mt-4 space-y-3.5 text-xs">
                                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
                                    <div><strong>Siswa:</strong> {promiseItem.studentName} ({promiseItem.className})</div>
                                    <div><strong>Orang Tua:</strong> {promiseItem.parentName}</div>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Janji Bayar dari Orang Tua:
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={promiseDateInput}
                                        onChange={(e) => setPromiseDateInput(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        Sistem tidak akan mengirimkan reminder otomatis sebelum tanggal ini tercapai.
                                    </p>
                                </div>

                                <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsPromiseModalOpen(false)}
                                        className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 cursor-pointer"
                                    >
                                        Simpan Kesepakatan
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

ReminderSpp.layout = (page: React.ReactNode) => page;
