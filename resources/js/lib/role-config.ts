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
            'attribute-scanner',
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
        badge: 'Administrasi & Operasional',
        scopeBadge: 'Administrasi & Operasional Sekolah',
        userName: 'Operator Sekolah',
        userEmail: 'operator@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses khusus bagian administrasi dan operasional: kelola akun guru & staf, kuota rombel, data Dapodik, keuangan SPP, dokumen guru, dan kesiapsiagaan sekolah.',
        allowedTabs: [
            'overview',
            'manage-users',
            'data-check',
            'payments',
            'documents',
            'incidents',
        ],
        overviewTitle: 'Pusat Administrasi & Operasional Sekolah Terpadu',
        overviewSubtitle:
            'Kelola akun staf, pantau kuota rombel, verifikasi residu Dapodik, rekonsiliasi SPP, dan dokumen kepegawaian guru.',
        overviewPrinciple:
            'Prinsip Operator: Tata Kelola Akun → Validasi Residu Dapodik → Rekonsiliasi SPP → Kepatuhan Dokumen GTK.',
        tabOverrides: {
            overview: { title: 'Ikhtisar Operasional' },
            'manage-users': {
                title: 'Kelola Akun Guru & Staf',
            },
            'data-check': {
                title: 'Data Dapodik',
            },
            payments: { title: 'Keuangan SPP' },
            documents: { title: 'Dokumen Guru' },
            incidents: { title: 'Tanggap Darurat' },
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
            'Tampilan khusus rombongan belajar: pantau data siswa, pantau poin pelanggaran dari Guru BK, pembinaan kelas, dan laporkan rujukan kendala ke Guru BK.',
        allowedTabs: [
            'overview',
            'class-monitoring',
            'early-warning',
            'reports',
            'communication',
            'cases',
            'documents',
        ],
        overviewTitle:
            'Pantau absensi, tindak lanjuti poin dari Guru BK, dan dampingi siswa',
        overviewSubtitle:
            'Wali Kelas • Pemantauan Rombongan Belajar • Semester Ganjil 2025/2026.',
        overviewPrinciple:
            'Prinsip Wali Kelas: Pantau Siswa & Poin BK → Pembinaan Disiplin Kelas → Teruskan Kendala ke Guru BK → Dampingi Sampai Tuntas.',
        tabOverrides: {
            overview: { title: 'Ikhtisar Kelas' },
            'class-monitoring': { title: 'Data Siswa & Poin BK' },
            'early-warning': { title: 'Early Warning' },
            reports: { title: 'Rapor Kelas' },
            communication: { title: 'Kontak Ortu' },
            cases: { title: 'Rujukan Kendala ke BK' },
            documents: { title: 'Perangkat Ajar' },
        },
    },
    bendahara: {
        id: 'bendahara',
        title: 'Bendahara Sekolah',
        shortTitle: 'Bendahara',
        badge: 'Keuangan & SPP',
        scopeBadge: 'Khusus Keuangan & SPP',
        userName: 'Ahmad Suhendra, S.E.',
        userEmail: 'bendahara@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses sistem difokuskan khusus pada modul Keuangan & SPP: pencatatan kas masuk, verifikasi bukti transfer bank, dan rekonsiliasi tagihan siswa.',
        allowedTabs: ['payments'],
        overviewTitle:
            'Pusat Kendali Keuangan Sekolah & Rekonsiliasi SPP',
        overviewSubtitle:
            'Bendahara Sekolah • Pengelolaan Kas, Verifikasi Pembayaran & Rekapitulasi SPP.',
        overviewPrinciple:
            'Prinsip Keuangan: Pantau Jatuh Tempo → Verifikasi Bukti Bayar → Rekonsiliasi Kas Masuk → Catat Pembukuan.',
        tabOverrides: {
            payments: {
                title: 'Pembayaran & SPP',
            },
        },
    },
    guru_bk: {
        id: 'guru_bk',
        title: 'Guru BK',
        shortTitle: 'Guru BK',
        badge: 'Layanan Bimbingan Konseling',
        scopeBadge: 'Pemantauan Rombel & Konseling Kasus',
        userName: 'Guru BK',
        userEmail: 'gurubk@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses memantau seluruh rombel yang ditambahkan Operator, menambahkan data siswa, memberikan poin pelanggaran ke wali kelas, serta menindaklanjuti rujukan kendala.',
        allowedTabs: [
            'overview',
            'class-monitoring',
            'attribute-scanner',
            'cases',
            'reports',
            'early-warning',
            'communication',
            'ats',
        ],
        overviewTitle:
            'Layanan konseling, pemantauan rombel lintas kelas & rujukan kendala siswa',
        overviewSubtitle:
            'Guru BK • Pemantauan Rombel Lintas Kelas, Pencatatan Poin Kedisiplinan & Tindak Lanjut Rujukan.',
        overviewPrinciple:
            'Prinsip BK: Pantau Rombel → Input Data Siswa & Poin Kedisiplinan → Koordinasi Wali Kelas → Intervensi Solutif.',
        tabOverrides: {
            overview: { title: 'Ikhtisar Konseling' },
            'class-monitoring': { title: 'Kondisi Kelas & Siswa' },
            'attribute-scanner': { title: 'Kamera Atribut Siswa', badge: 'AI Vision' },
            cases: { title: 'Kasus & Rujukan BK' },
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

export interface RoleSwitcherOption {
    role: RoleType;
    email: string;
    title: string;
    personName: string;
    scope: string;
    description: string;
    badge: string;
    directUrl: string;
}

export const ROLE_SWITCHER_OPTIONS: RoleSwitcherOption[] = [
    {
        role: 'operator',
        email: 'operator@sekolah.sch.id',
        title: 'Operator Sekolah',
        personName: 'Operator Sekolah',
        scope: 'Administrasi & Operasional',
        description: 'Kelola akun GTK, kuota rombel, Dapodik, SPP & dokumen guru.',
        badge: 'Admin & Ops',
        directUrl: '/operator',
    },
    {
        role: 'guru_bk',
        email: 'gurubk@sekolah.sch.id',
        title: 'Guru BK',
        personName: 'Dra. Hj. Nurjanah, M.Pd',
        scope: 'Konseling & Kedisiplinan',
        description: 'Lihat semua kelas & walikelas, input siswa, catat poin & kasus BK.',
        badge: 'BK & Kasus',
        directUrl: '/guru-bk',
    },
    {
        role: 'wali_kelas',
        email: 'walikelas@sekolah.sch.id',
        title: 'Wali Kelas XI RPL 2',
        personName: 'Ratna Dewi, S.Pd',
        scope: 'Rombel XI RPL 2',
        description: 'Data siswa kelas XI RPL 2, poin pelanggaran dari BK & rujuk kendala.',
        badge: 'XI RPL 2',
        directUrl: '/wali-kelas',
    },
    {
        role: 'wali_kelas',
        email: 'budi@sekolah.sch.id',
        title: 'Wali Kelas X TKJ 1',
        personName: 'Budi Santoso, S.Kom',
        scope: 'Rombel X TKJ 1',
        description: 'Data siswa kelas X TKJ 1, poin pelanggaran & pembinaan kelas.',
        badge: 'X TKJ 1',
        directUrl: '/wali-kelas/tkj',
    },
    {
        role: 'kepala_sekolah',
        email: 'kepsek@sekolah.sch.id',
        title: 'Kepala Sekolah',
        personName: 'Drs. H. Mulyadi, M.Pd',
        scope: 'Akses Penuh 11 Modul',
        description: 'Supervisi kepemimpinan, monitoring kesehatan operasional sekolah.',
        badge: 'Eksekutif',
        directUrl: '/kepala-sekolah',
    },
    {
        role: 'bendahara',
        email: 'bendahara@sekolah.sch.id',
        title: 'Bendahara Sekolah',
        personName: 'Ahmad Suhendra, S.E.',
        scope: 'Khusus Keuangan & SPP',
        description: 'Monitoring kas SPP, penerbitan tagihan, verifikasi bukti bayar transfer, dan rekonsiliasi kas.',
        badge: 'Keuangan',
        directUrl: '/bendahara',
    },
];
