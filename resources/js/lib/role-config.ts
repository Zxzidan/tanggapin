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
        badge: 'Pengambil Kebijakan',
        scopeBadge: 'Semua Fitur — 11 Modul',
        userName: 'Kepala Sekolah',
        userEmail: 'kepsek@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses eksekutif penuh ke seluruh 11 modul operasional sekolah, metrik komprehensif, dan koordinasi darurat.',
        allowedTabs: [
            'overview',
            'early-warning',
            'class-monitoring',
            'cases',
            'reports',
            'communication',
            'ats',
            'payments',
            'documents',
            'data-check',
            'incidents',
            'manage-users',
        ],
        overviewTitle: 'Apa yang membutuhkan perhatian sekolah hari ini?',
        overviewSubtitle:
            'Pantau kesehatan operasional, penanganan kasus siswa, kepatuhan guru, dan status anggaran secara menyeluruh.',
        overviewPrinciple:
            'Prinsip Eksekutif: Temukan Masalah → Tentukan PIC → Lakukan Tindakan → Catat Hasil.',
    },
    operator: {
        id: 'operator',
        title: 'Operator Sekolah',
        shortTitle: 'Operator',
        badge: 'Verifikasi Data & Admin',
        scopeBadge: 'Semua Fitur — 11 Modul',
        userName: 'Operator Sekolah',
        userEmail: 'operator@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses penuh ke seluruh sistem dengan prioritas verifikasi residu Dapodik, rombel, dokumen guru & sinkronisasi.',
        allowedTabs: [
            'overview',
            'manage-users',
            'data-check',
            'early-warning',
            'class-monitoring',
            'cases',
            'reports',
            'communication',
            'ats',
            'payments',
            'documents',
            'incidents',
        ],
        overviewTitle: 'Pusat Integritas Data, Arsip Dokumen & Pemetaan Rombel',
        overviewSubtitle:
            'Verifikasi residu NISN/NIK, kelengkapan SK guru, rombel pembelajaran, dan sinkronisasi server terpadu.',
        overviewPrinciple:
            'Prinsip Operator: Deteksi Anomali → Tindak Lanjut Residu → Validasi Berkas → Sinkronisasi Server.',
        tabOverrides: {
            'manage-users': {
                title: 'Kelola Akun Guru',
            },
            'data-check': {
                title: 'Data Dapodik',
            },
            documents: { title: 'Dokumen Guru' },
        },
    },
    wali_kelas: {
        id: 'wali_kelas',
        title: 'Wali Kelas',
        shortTitle: 'Wali Kelas',
        badge: 'Garis Depan Kelas',
        scopeBadge: 'Disesuaikan — Rombongan Belajar',
        userName: 'Wali Kelas',
        userEmail: 'walikelas@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Tampilan disesuaikan khusus rombongan belajar: absensi harian, pembinaan kedisiplinan, dan kontak orang tua siswa.',
        allowedTabs: [
            'overview',
            'early-warning',
            'class-monitoring',
            'reports',
            'communication',
            'cases',
            'documents',
        ],
        overviewTitle:
            'Pantau absensi dan dampingi perkembangan siswa di kelas',
        overviewSubtitle:
            'Wali Kelas • Pemantauan Rombongan Belajar • Semester Ganjil 2025/2026.',
        overviewPrinciple:
            'Prinsip Wali Kelas: Deteksi Absensi Menurun → Kontak Wali Murid → Pembinaan Disiplin → Koordinasi BK.',
        tabOverrides: {
            overview: { title: 'Ikhtisar Kelas' },
            'early-warning': { title: 'Early Warning' },
            'class-monitoring': { title: 'Kondisi Kelas' },
            reports: { title: 'Rapor Kelas' },
            communication: { title: 'Kontak Ortu' },
            cases: { title: 'Rujukan Kasus BK' },
            documents: { title: 'Perangkat Ajar' },
        },
    },
    bendahara: {
        id: 'bendahara',
        title: 'Bendahara Sekolah',
        shortTitle: 'Bendahara',
        badge: 'Keuangan & SPP',
        scopeBadge: 'Disesuaikan — Keuangan & SPP',
        userName: 'Bendahara Sekolah',
        userEmail: 'bendahara@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Tampilan disesuaikan khusus pengelolaan kas SPP, verifikasi bukti transfer, dan reminder tagihan ortu.',
        allowedTabs: ['overview', 'payments', 'communication', 'early-warning'],
        overviewTitle:
            'Kelola penerimaan kas SPP, bukti transfer dan administrasi biaya',
        overviewSubtitle:
            'Bendahara Sekolah • Rekapitulasi Pembayaran SPP dan Administrasi Sekolah.',
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
        title: 'Guru BK',
        shortTitle: 'Guru BK',
        badge: 'Layanan Bimbingan Konseling',
        scopeBadge: 'Disesuaikan — Konseling & Kasus',
        userName: 'Guru BK',
        userEmail: 'gurubk@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Tampilan disesuaikan khusus penanganan kasus bimbingan, konseling mediasi, mitigasi ATS, dan pembinaan karakter.',
        allowedTabs: [
            'overview',
            'cases',
            'reports',
            'early-warning',
            'communication',
            'ats',
        ],
        overviewTitle:
            'Layanan konseling, penanganan kasus dan pendampingan siswa',
        overviewSubtitle:
            'Guru BK • Pendampingan Kasus Konseling dan Pemantauan Siswa.',
        overviewPrinciple:
            'Prinsip BK: Asesmen Kebutuhan Siswa → Konseling Empatik → Kolaborasi Wali & Ortu → Pemulihan Solutif.',
        tabOverrides: {
            overview: { title: 'Ikhtisar Konseling' },
            cases: { title: 'Kasus Siswa' },
            reports: { title: 'Rapor Bimbingan' },
            'early-warning': {
                title: 'Early Warning',
            },
            discipline: { title: 'Disiplin Siswa' },
            communication: { title: 'Mediasi Ortu' },
            ats: { title: 'Rawan ATS' },
        },
    },
};
