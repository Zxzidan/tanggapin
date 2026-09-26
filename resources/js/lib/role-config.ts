import type { RoleType } from '@/types/tanggapin';

export interface RoleConfig {
    id: RoleType;
    title: string;
    shortTitle: string;
    badge: string;
    scopeBadge: string;
    userName: string;
    userEmail: string;
    avatar: string;
    roleDesc: string;
    allowedTabs: string[];
    overviewTitle: string;
    overviewSubtitle: string;
    overviewPrinciple: string;
    tabOverrides?: Partial<Record<string, { title?: string; badge?: string }>>;
}

export const ROLE_CONFIGS: Record<RoleType, RoleConfig> = {
    kepala_sekolah: {
        id: 'kepala_sekolah',
        title: 'Kepala Sekolah',
        shortTitle: 'Kepsek',
        badge: 'Decision Maker',
        scopeBadge: 'Semua Fitur — 11 Modul',
        userName: 'Drs. H. Mulyadi, M.Pd',
        userEmail: 'kepsek@smk1harapan.sch.id',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses eksekutif penuh ke seluruh 11 modul operasional sekolah, metrik komprehensif, dan koordinasi darurat.',
        allowedTabs: [
            'overview',
            'early-warning',
            'class-monitoring',
            'cases',
            'discipline',
            'communication',
            'ats',
            'payments',
            'documents',
            'data-check',
            'incidents',
        ],
        overviewTitle: '“Apa yang membutuhkan perhatian sekolah hari ini?”',
        overviewSubtitle:
            'Pantau kesehatan operasional, penanganan kasus siswa, kepatuhan guru, dan status anggaran secara menyeluruh.',
        overviewPrinciple:
            'Prinsip Eksekutif: Temukan Masalah → Tentukan PIC → Lakukan Tindakan → Catat Hasil.',
    },
    operator: {
        id: 'operator',
        title: 'Operator Dapodik & Admin',
        shortTitle: 'Operator',
        badge: 'Data Verifier & Admin',
        scopeBadge: 'Semua Fitur — 11 Modul',
        userName: 'Harun Ar-Rasyid',
        userEmail: 'operator@smk1harapan.sch.id',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses penuh ke seluruh sistem dengan prioritas verifikasi residu Dapodik, rombel, dokumen guru & sinkronisasi.',
        allowedTabs: [
            'overview',
            'data-check',
            'early-warning',
            'class-monitoring',
            'cases',
            'discipline',
            'communication',
            'ats',
            'payments',
            'documents',
            'incidents',
        ],
        overviewTitle:
            '“Pusat Integritas Data Dapodik, Arsip Guru & Pemetaan Rombel”',
        overviewSubtitle:
            'Verifikasi residu NISN/NIK, kelengkapan SK guru, rombel pembelajaran, dan sinkronisasi server terpadu.',
        overviewPrinciple:
            'Prinsip Operator: Deteksi Anomali → Tindak Lanjut Residu → Validasi Berkas → Sinkronisasi Server.',
        tabOverrides: {
            'data-check': {
                title: 'Data Dapodik',
            },
            documents: { title: 'Dokumen Guru' },
        },
    },
    wali_kelas: {
        id: 'wali_kelas',
        title: 'Wali Kelas — XI RPL 2',
        shortTitle: 'Wali Kelas',
        badge: 'Frontline XI RPL 2',
        scopeBadge: 'Disesuaikan — Kelas XI RPL 2',
        userName: 'Hendra Setiawan, S.Pd',
        userEmail: 'hendra.setiawan@smk1harapan.sch.id',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Tampilan disesuaikan khusus rombongan belajar XI RPL 2: absensi harian, pembinaan kedisiplinan, dan kontak wali murid.',
        allowedTabs: [
            'overview',
            'early-warning',
            'class-monitoring',
            'discipline',
            'communication',
            'cases',
            'documents',
        ],
        overviewTitle:
            '“Pantau absensi & dampingi perkembangan 36 siswa XI RPL 2”',
        overviewSubtitle:
            'Wali Kelas: Hendra Setiawan, S.Pd • Rombel Rekayasa Perangkat Lunak 2 • Semester Ganjil 2025/2026.',
        overviewPrinciple:
            'Prinsip Wali Kelas: Deteksi Absensi Menurun → Kontak Wali Murid → Pembinaan Disiplin → Koordinasi BK.',
        tabOverrides: {
            overview: { title: 'Ikhtisar Kelas' },
            'early-warning': { title: 'Early Warning' },
            'class-monitoring': { title: 'Kondisi Kelas' },
            communication: { title: 'Kontak Ortu' },
            cases: { title: 'Rujukan Kasus BK' },
            documents: { title: 'Perangkat Ajar' },
        },
    },
    bendahara: {
        id: 'bendahara',
        title: 'Bendahara Sekolah',
        shortTitle: 'Bendahara',
        badge: 'Finance & SPP',
        scopeBadge: 'Disesuaikan — Keuangan & SPP',
        userName: 'Siti Fatimah, S.E',
        userEmail: 'bendahara@smk1harapan.sch.id',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Tampilan disesuaikan khusus pengelolaan kas SPP, verifikasi bukti transfer, dan reminder tagihan ortu.',
        allowedTabs: ['overview', 'payments', 'communication', 'early-warning'],
        overviewTitle:
            '“Kelola penerimaan kas SPP, bukti transfer & dispensasi biaya”',
        overviewSubtitle:
            'Bendahara: Siti Fatimah, S.E • Rekapitulasi Pembayaran SPP & Uang Praktik Kejuruan.',
        overviewPrinciple:
            'Prinsip Bendahara: Pantau Jatuh Tempo → Verifikasi Bukti Bayar → Kirim Reminder WhatsApp → Catat Kas.',
        tabOverrides: {
            overview: { title: 'Ikhtisar Keuangan' },
            payments: {
                title: 'Keuangan SPP',
            },
            communication: {
                title: 'Reminder Ortu',
            },
            'early-warning': { title: 'Kendala Biaya' },
        },
    },
    guru_bk: {
        id: 'guru_bk',
        title: 'Guru BK & Konseling',
        shortTitle: 'Guru BK',
        badge: 'Case Manager',
        scopeBadge: 'Disesuaikan — Konseling & Kasus',
        userName: 'Rahmawati, S.Pd',
        userEmail: 'rahmawati.bk@smk1harapan.sch.id',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Tampilan disesuaikan khusus penanganan kasus bimbingan, konseling mediasi, mitigasi ATS, dan pembinaan karakter.',
        allowedTabs: [
            'overview',
            'cases',
            'early-warning',
            'discipline',
            'communication',
            'ats',
        ],
        overviewTitle:
            '“Layanan konseling, penanganan kasus & pendampingan siswa”',
        overviewSubtitle:
            'Koordinator BK: Rahmawati, S.Pd • Pendampingan Kasus Konseling & Pemantauan Siswa Rawan ATS.',
        overviewPrinciple:
            'Prinsip BK: Asesmen Kebutuhan Siswa → Konseling Empatik → Kolaborasi Wali & Ortu → Pemulihan Solutif.',
        tabOverrides: {
            overview: { title: 'Ikhtisar Konseling' },
            cases: { title: 'Kasus Siswa' },
            'early-warning': {
                title: 'Early Warning',
            },
            discipline: { title: 'Disiplin Siswa' },
            communication: { title: 'Mediasi Ortu' },
            ats: { title: 'Rawan ATS' },
        },
    },
};
