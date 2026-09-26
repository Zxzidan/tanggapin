import {
    Bot,
    Check,
    Copy,
    CornerDownLeft,
    FileSpreadsheet,
    MessageSquare,
    PhoneCall,
    RotateCcw,
    Send,
    Shield,
    ShieldAlert,
    Sparkles,
    UserCheck,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useActionModals } from '@/components/action-modals';
import { cn } from '@/lib/utils';
import type { RoleType } from '@/types/tanggapin';

interface Message {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
    actionType?: 'parent_contact' | 'new_case' | 'proposal_info' | 'copy_text';
    actionPayload?: Record<string, string>;
}

interface AiAssistantWidgetProps {
    currentRole?: RoleType;
    userName?: string;
}

const PRESET_PROMPTS = [
    {
        title: 'Analisis Siswa Berisiko',
        prompt: 'Tolong ringkas siswa yang paling membutuhkan perhatian dan tindak lanjut hari ini.',
    },
    {
        title: 'Draf Pesan WhatsApp Ortu',
        prompt: 'Buatkan draf pesan WhatsApp resmi yang santun ke orang tua ananda Rian Prasetya terkait ketidakhadiran.',
    },
    {
        title: 'Alur Rujukan Guru BK',
        prompt: 'Bagaimana prosedur etis perujukan siswa dari Wali Kelas ke Guru BK di Tanggapin?',
    },
    {
        title: 'Juknis BOS & Legalitas',
        prompt: 'Apakah pengadaan software Tanggapin sesuai dengan Juknis Dana BOSP Permendikbud 63/2023?',
    },
];

export default function AiAssistantWidget({
    currentRole = 'wali_kelas',
    userName = 'Pendidik',
}: AiAssistantWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputQuery, setInputQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

    const { openParentContactModal, openNewCaseModal } = useActionModals();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const initialGreeting: Message = {
        id: 'msg-0',
        sender: 'assistant',
        text: `Halo, **${userName}**! Saya **Asisten AI Tanggapin**. 
Saya siap membantu Anda menganalisis sinyal dini kehadiran siswa, merumuskan draf pesan resmi orang tua, memandu alur rujukan BK, hingga referensi regulasi Juknis BOS & TPPK.

Ada yang bisa saya bantu sekarang?`,
        timestamp: 'Baru saja',
    };

    const [messages, setMessages] = useState<Message[]>([initialGreeting]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isTyping]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedMessageId(id);
        toast.success('Draf pesan berhasil disalin!');
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    const handleResetChat = () => {
        setMessages([initialGreeting]);
        toast.info('Percakapan telah diatur ulang.');
    };

    const generateAssistantResponse = (query: string): Omit<Message, 'id' | 'timestamp'> => {
        const q = query.toLowerCase();

        // 1. Siswa Berisiko / Analisis Kehadiran
        if (
            q.includes('siswa') ||
            q.includes('berisiko') ||
            q.includes('ringkas') ||
            q.includes('perhatian') ||
            q.includes('alfa') ||
            q.includes('kehadiran')
        ) {
            return {
                sender: 'assistant',
                text: `Berdasarkan rekap data harian sekolah, terdeteksi **3 siswa berisiko** dengan sinyal prioritas:

1. **Rian Prasetya** *(Kelas XI-RPL 2)*
   • **Sinyal:** 3 hari berturut-turut alpa tanpa keterangan.
   • **Rekomendasi:** Konfirmasi ke orang tua dan rencanakan home visit jika tidak ada kabar hingga besok.
2. **Budi Santoso** *(Kelas X-TKJ 1)*
   • **Sinyal:** Terlambat > 4x dalam 2 pekan terakhir.
   • **Rekomendasi:** Bimbingan komitmen kehadiran bersama Wali Kelas.
3. **Siti Aisyah** *(Kelas XII-AKL 1)*
   • **Sinyal:** Penurunan capaian belajar produktif & indikasi kendala keluarga.
   • **Rekomendasi:** Sesi konseling individual bersama Guru BK.

*Apakah Anda ingin langsung membuat catatan tindak lanjut atau mengirim pesan resmi ke wali murid?*`,
                actionType: 'parent_contact',
                actionPayload: {
                    studentId: 'std-01',
                    studentName: 'Rian Prasetya — XI-RPL 2',
                    studentPhone: '081234567890',
                    message:
                        'Yth. Bapak/Ibu Wali Murid Rian Prasetya, kami dari pihak sekolah menginformasikan bahwa ananda belum tercatat hadir selama 3 hari berturut-turut. Mohon konfirmasi kesehatan dan keadaan ananda agar kami dapat mendampingi proses belajarnya dengan baik.',
                },
            };
        }

        // 2. Draf WhatsApp / Komunikasi Orang Tua
        if (
            q.includes('pesan') ||
            q.includes('wa') ||
            q.includes('whatsapp') ||
            q.includes('ortu') ||
            q.includes('orang tua') ||
            q.includes('wali murid') ||
            q.includes('rian')
        ) {
            const draft = `Yth. Bapak/Ibu Wali Murid dari Rian Prasetya (Kelas XI-RPL 2),

Semoga Bapak/Ibu sekeluarga senantiasa dalam keadaan sehat walafiat.

Kami dari pihak sekolah ingin menyampaikan koordinasi terkait presensi ananda Rian yang tercatat belum hadir di kelas dalam beberapa hari terakhir. Mengingat kegiatan praktik kejuruan sedang berlangsung intensif, kehadiran ananda sangat krusial bagi ketuntasan belajarnya.

Sekiranya ananda berhalangan hadir dikarenakan sakit atau keperluan mendesak, mohon berkenan mengonfirmasi kepada pihak sekolah melalui tautan tanda terima digital resmi berikut atau menghubungi kami langsung.

Terima kasih atas kerja sama dan perhatian Bapak/Ibu demi keberhasilan pendidikan ananda.

Hormat kami,
Tim Kesiswaan & Bimbingan Konseling Sekolah`;

            return {
                sender: 'assistant',
                text: `Berikut rekomendasi draf pesan WhatsApp resmi bernada **humanis, diplomatis, dan solutif** (tanpa melabeli siswa):\n\n\`\`\`text\n${draft}\n\`\`\`\n\nAnda dapat langsung menyalin draf ini atau menggunakan sistem WhatsApp ber-tanda terima resmi Tanggapin.`,
                actionType: 'copy_text',
                actionPayload: {
                    draftText: draft,
                    studentName: 'Rian Prasetya — XI-RPL 2',
                    studentPhone: '081234567890',
                },
            };
        }

        // 3. Alur Kasus / Rujukan BK
        if (
            q.includes('bk') ||
            q.includes('rujukan') ||
            q.includes('konseling') ||
            q.includes('kasus') ||
            q.includes('prosedur')
        ) {
            return {
                sender: 'assistant',
                text: `Berikut alur kerja standar rujukan kendala siswa ke Guru BK di Tanggapin:

1. **Tahap 1 (Wali Kelas):** 
   Wali Kelas mendokumentasikan observasi objektif (misal: perubahan perilaku, penurunan nilai drastis, atau presensi) tanpa asumsi subjektif.
2. **Tahap 2 (Pengiriman Rujukan):**
   Gunakan tombol **Rujuk ke Guru BK** pada menu Kondisi Kelas. Sistem akan mengirimkan notifikasi internal berenkripsi privasi.
3. **Tahap 3 (Penjadwalan BK):**
   Guru BK menerima rujukan, meninjau riwayat profil siswa 360°, dan menetapkan jadwal sesi bimbingan individual.
4. **Tahap 4 (Dokumentasi & Umpan Balik):**
   Guru BK mencatat hasil sesi dan rekomendasi tindak lanjut yang dapat dipantau kembali oleh Wali Kelas secara transparan.

*Ingin membuka formulir rujukan kasus sekarang?*`,
                actionType: 'new_case',
                actionPayload: {
                    desc: 'Rujukan kendala belajar dan ketidakhadiran siswa binaan',
                },
            };
        }

        // 4. Juknis BOS / Regulasi Permendikbud / Legalitas
        if (
            q.includes('bos') ||
            q.includes('juknis') ||
            q.includes('anggaran') ||
            q.includes('rkas') ||
            q.includes('biaya') ||
            q.includes('tppk') ||
            q.includes('permendikbud') ||
            q.includes('legal')
        ) {
            return {
                sender: 'assistant',
                text: `Penggunaan anggaran untuk sistem **TANGGAPIN** 100% selaras dengan regulasi resmi Kemendikbudristek:

• **Juknis BOSP (Permendikbudristek No. 63/2023):**
  Dapat dianggarkan melalui komponen *Pemeliharaan Sarana dan Prasarana Sekolah* atau *Pengembangan Manajemen & Sistem Informasi Sekolah Digital*.
• **Regulasi TPPK (Permendikbudristek No. 46/2023):**
  Tanggapin memfasilitasi pencatatan kasus kekerasan, pencegahan Anak Tidak Sekolah (ATS), dan perlindungan hak anak sesuai mandat Tim Pencegahan dan Penanganan Kekerasan.
• **Pengadaan Resmi:**
  Dapat diproses melalui SIPLah dengan Surat Penawaran Resmi dan Berita Acara Serah Terima (BAST).

*Jika Bendahara BOS membutuhkan draf RAB, Anda dapat mengunduhnya melalui tombol generator proposal di halaman depan.*`,
                actionType: 'proposal_info',
            };
        }

        // 5. Default Fallback
        return {
            sender: 'assistant',
            text: `Terima kasih atas pertanyaannya. 

Dalam konteks operasional **TANGGAPIN**, Anda dapat menanyakan:
• Ringkasan siswa berisiko tinggi hari ini.
• Draf komunikasi diplomatis untuk orang tua/wali murid.
• Rekomendasi penanganan konseling dan alur pelimpahan kasus BK.
• Penyelarasan kode rekening RKAS Dana BOS & regulasi TPPK.

Silakan pilih salah satu topik di atas atau ketik instruksi spesifik yang Anda butuhkan.`,
        };
    };

    const handleSendMessage = (textToSend?: string) => {
        const text = textToSend || inputQuery;
        if (!text.trim()) return;

        const userMsg: Message = {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text: text.trim(),
            timestamp: new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputQuery('');
        setIsTyping(true);

        // Simulate intelligent response delay
        setTimeout(() => {
            const reply = generateAssistantResponse(text);
            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                ...reply,
                timestamp: new Date().toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* 1. Floating Launcher Button (Bottom Right) */}
            <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
                {!isOpen && (
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="group flex items-center gap-2.5 rounded-full border border-blue-600/30 bg-blue-600 px-4 py-3 text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/35 active:scale-95 dark:border-blue-500/40 dark:shadow-blue-900/40"
                        aria-label="Buka Asisten AI Tanggapin"
                    >
                        <div className="relative flex size-6 shrink-0 items-center justify-center">
                            <Sparkles className="size-5 transition-transform group-hover:rotate-12" />
                            <span className="absolute -top-1 -right-1 flex size-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-200 opacity-75" />
                                <span className="relative inline-flex size-2.5 rounded-full bg-white" />
                            </span>
                        </div>
                        <span className="text-xs font-bold tracking-tight sm:inline">
                            Asisten AI
                        </span>
                    </button>
                )}
            </div>

            {/* 2. Interactive Assistant Chat Dialog */}
            {isOpen && (
                <div
                    className={cn(
                        'fixed right-4 bottom-4 z-50 flex flex-col overflow-hidden',
                        'h-[540px] max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] sm:right-6 sm:bottom-6 sm:w-[420px]',
                        'animate-in zoom-in-95 fade-in slide-in-from-bottom-5 duration-200',
                        'rounded-xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0b1120]',
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                                <Bot className="size-4.5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Asisten AI Tanggapin
                                    </h3>
                                    <span className="flex size-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    Pendamping Operasional & Regulasi
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={handleResetChat}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                title="Atur Ulang Percakapan"
                                aria-label="Atur Ulang Percakapan"
                            >
                                <RotateCcw className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                title="Tutup Asisten"
                                aria-label="Tutup"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Context Ribbon */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-blue-50/40 px-4 py-1.5 text-[10px] font-medium text-blue-900 dark:border-slate-800/80 dark:bg-blue-950/20 dark:text-blue-300">
                        <span className="flex items-center gap-1.5">
                            <Shield className="size-3 text-blue-600" />
                            Konteks: Peran {currentRole.replace('_', ' ').toUpperCase()}
                        </span>
                        <span>Aktif • Data 2025/2026</span>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-xs">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    'flex flex-col',
                                    msg.sender === 'user'
                                        ? 'items-end'
                                        : 'items-start',
                                )}
                            >
                                <div
                                    className={cn(
                                        'rounded-xl px-3.5 py-2.5 leading-relaxed text-xs shadow-2xs',
                                        msg.sender === 'user'
                                            ? 'max-w-[85%] rounded-tr-none bg-blue-600 text-white'
                                            : 'max-w-[92%] rounded-tl-none border border-slate-200/80 bg-slate-50/70 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200',
                                    )}
                                >
                                    <div className="whitespace-pre-line text-[11px] sm:text-xs">
                                        {msg.text}
                                    </div>

                                    {/* Action Chips for Assistant Message */}
                                    {msg.actionType === 'parent_contact' &&
                                        msg.actionPayload && (
                                            <div className="mt-2.5 flex flex-wrap gap-2 border-t border-slate-200/60 pt-2 dark:border-slate-800">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        openParentContactModal({
                                                            studentId:
                                                                msg.actionPayload
                                                                    ?.studentId,
                                                            studentName:
                                                                msg.actionPayload
                                                                    ?.studentName,
                                                            studentPhone:
                                                                msg.actionPayload
                                                                    ?.studentPhone,
                                                            message:
                                                                msg.actionPayload
                                                                    ?.message,
                                                        });
                                                    }}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-2xs transition-colors hover:bg-blue-700 active:scale-95"
                                                >
                                                    <PhoneCall className="size-3" />
                                                    Hubungi Wali Murid
                                                </button>
                                            </div>
                                        )}

                                    {msg.actionType === 'new_case' && (
                                        <div className="mt-2.5 flex flex-wrap gap-2 border-t border-slate-200/60 pt-2 dark:border-slate-800">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    openNewCaseModal({
                                                        desc:
                                                            msg.actionPayload
                                                                ?.desc ||
                                                            'Rujukan dari asisten AI',
                                                    });
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-2xs transition-colors hover:bg-blue-700 active:scale-95"
                                            >
                                                <ShieldAlert className="size-3" />
                                                Buka Form Rujukan BK
                                            </button>
                                        </div>
                                    )}

                                    {msg.actionType === 'copy_text' &&
                                        msg.actionPayload?.draftText && (
                                            <div className="mt-2.5 flex flex-wrap gap-2 border-t border-slate-200/60 pt-2 dark:border-slate-800">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopy(
                                                            msg.id,
                                                            msg.actionPayload!
                                                                .draftText,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                                >
                                                    {copiedMessageId ===
                                                    msg.id ? (
                                                        <>
                                                            <Check className="size-3 text-blue-600 dark:text-blue-400" />
                                                            Tersalin!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="size-3" />
                                                            Salin Pesan
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        openParentContactModal({
                                                            studentName:
                                                                msg.actionPayload
                                                                    ?.studentName,
                                                            studentPhone:
                                                                msg.actionPayload
                                                                    ?.studentPhone,
                                                            message:
                                                                msg.actionPayload
                                                                    ?.draftText,
                                                        });
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-2xs transition-colors hover:bg-blue-700"
                                                >
                                                    <MessageSquare className="size-3" />
                                                    Buka di Panel Pesan
                                                </button>
                                            </div>
                                        )}
                                </div>
                                <span className="mt-1 px-1 text-[9px] text-slate-400">
                                    {msg.timestamp}
                                </span>
                            </div>
                        ))}

                        {/* Typing Animation */}
                        {isTyping && (
                            <div className="flex items-center gap-2 rounded-xl rounded-tl-none border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs text-slate-500 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60">
                                <Bot className="size-3.5 animate-pulse text-blue-600" />
                                <span className="text-[11px]">
                                    Menyiapkan jawaban...
                                </span>
                                <div className="flex items-center gap-1">
                                    <span className="size-1 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]" />
                                    <span className="size-1 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]" />
                                    <span className="size-1 animate-bounce rounded-full bg-blue-600" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Preset Prompt Chips */}
                    {messages.length <= 2 && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-2.5 dark:border-slate-800/80 dark:bg-slate-900/40">
                            <div className="mb-1 text-[10px] font-semibold text-slate-400">
                                Rekomendasi Cepat:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {PRESET_PROMPTS.map((p, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() =>
                                            handleSendMessage(p.prompt)
                                        }
                                        className="rounded-md border border-slate-200/80 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 transition-colors hover:border-blue-500 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400"
                                    >
                                        {p.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Bar */}
                    <div className="border-t border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-[#0b1120]">
                        <div className="relative flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputQuery}
                                onChange={(e) => setInputQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Tanyakan analisis siswa, juknis, atau draf pesan..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-xs text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => handleSendMessage()}
                                disabled={!inputQuery.trim() || isTyping}
                                className="absolute right-1.5 flex size-7 items-center justify-center rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
                                title="Kirim Pesan"
                                aria-label="Kirim"
                            >
                                <Send className="size-3.5" />
                            </button>
                        </div>
                        <div className="mt-1.5 text-center text-[9px] text-slate-400">
                            Didukung basis data operasional & juknis resmi Kemendikbudristek.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
