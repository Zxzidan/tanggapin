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
        scopeBadge: 'Supervisi & Perkembangan Sekolah',
        userName: 'Drs. H. Mulyadi, M.Pd',
        userEmail: 'kepsek@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Supervisi eksekutif: pantau mutu rombel, kedisiplinan siswa, kepatuhan GTK, dan akuntabilitas keuangan.',
        allowedTabs: [
            'overview',
            'academic-supervision',
            'school-evaluation',
            'executive-approvals',
        ],
        overviewTitle: 'Dashboard Supervisi & Monitoring Sekolah',
        overviewSubtitle:
            'Pantau indikator mutu, perkembangan kelas, kinerja GTK, dan akuntabilitas sekolah.',
        overviewPrinciple:
            'Indikator Mutu → Kinerja GTK → Arahan Manajerial',
        tabOverrides: {
            overview: { title: 'Dashboard Supervisi' },
            'academic-supervision': {
                title: 'AI Supervisi GTK',
                badge: 'AI Kurikulum',
            },
            'school-evaluation': {
                title: 'AI Rapor Mutu',
                badge: 'Kemendikbud',
            },
            'executive-approvals': {
                title: 'Pusat Persetujuan',
                badge: 'Otorisasi',
            },
        },
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
            'Kelola akun guru & staf, kuota rombel, validasi residu Dapodik, SPP, dan dokumen kepegawaian.',
        allowedTabs: [
            'overview',
            'manage-users',
            'data-check',
            'payments',
            'documents',
            'incidents',
        ],
        overviewTitle: 'Pusat Operasional & Administrasi Sekolah',
        overviewSubtitle:
            'Kelola akun GTK, verifikasi residu Dapodik, rekonsiliasi SPP, dan berkas kepegawaian.',
        overviewPrinciple:
            'Tata Kelola Akun → Validasi Dapodik → Rekonsiliasi SPP',
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
        scopeBadge: 'Pemantauan Anak Wali',
        userName: 'Ratna Dewi, S.Pd',
        userEmail: 'walikelas@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Pemantauan anak wali: presensi rombel, pendampingan karakter, kontak orang tua, dan rujukan ke BK.',
        allowedTabs: [
            'overview',
            'class-monitoring',
            'early-warning',
            'reports',
            'communication',
            'cases',
        ],
        overviewTitle:
            'Monitoring & Pembinaan Siswa Anak Wali',
        overviewSubtitle:
            'Pantau presensi, perkembangan karakter, dan kesejahteraan rombel binaan.',
        overviewPrinciple:
            'Presensi Anak Wali → Dampingi Disiplin → Koordinasi BK & Ortu',
        tabOverrides: {
            overview: { title: 'Ikhtisar Anak Wali' },
            'class-monitoring': { title: 'Siswa Anak Wali' },
            'early-warning': { title: 'Early Warning Anak Wali' },
            reports: { title: 'Rapor Anak Wali' },
            communication: { title: 'Kontak Orang Tua' },
            cases: { title: 'Rujukan ke BK' },
        },
    },
    guru: {
        id: 'guru',
        title: 'Guru Mata Pelajaran',
        shortTitle: 'Guru Mapel',
        badge: 'Pendidik & Pengampu',
        scopeBadge: 'Modul Ajar & Capaian Murid',
        userName: 'Siti Aminah, M.Pd',
        userEmail: 'guru@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Modul Ajar Kurikulum Merdeka, pra-audit AI mandiri, dan monitoring capaian belajar murid.',
        allowedTabs: [
            'overview',
            'documents',
            'class-monitoring',
            'reports',
        ],
        overviewTitle:
            'Pusat Modul Ajar & Capaian Belajar Murid',
        overviewSubtitle:
            'Kelola Modul Ajar Kurikulum Merdeka, pra-audit AI, dan evaluasi ketuntasan murid.',
        overviewPrinciple:
            'Modul Ajar Berdiferensiasi → Pra-Audit AI → Evaluasi Capaian Belajar',
        tabOverrides: {
            overview: { title: 'Ikhtisar Pengajaran' },
            documents: { title: 'Modul Ajar Guru', badge: 'AI Audit' },
            'class-monitoring': { title: 'Murid yang Diajar', badge: 'Lintas Rombel' },
            reports: { title: 'Asesmen Capaian Murid' },
        },
    },
    bendahara: {
        id: 'bendahara',
        title: 'Bendahara Sekolah',
        shortTitle: 'Bendahara',
        badge: 'Keuangan & SPP',
        scopeBadge: 'Keuangan & SPP Sekolah',
        userName: 'Ahmad Suhendra, S.E.',
        userEmail: 'bendahara@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Pengelolaan keuangan sekolah: penerimaan SPP, AI analisis arus kas, dan buku kas umum.',
        allowedTabs: [
            'payments',
            'ai-finance',
            'financial-reports',
            'finance-reminder',
        ],
        overviewTitle:
            'Pusat Keuangan Sekolah & Rekonsiliasi SPP',
        overviewSubtitle:
            'Monitoring kas SPP, rekonsiliasi penerimaan, dan pengingat tagihan santun.',
        overviewPrinciple:
            'Jatuh Tempo SPP → Rekonsiliasi Kas Masuk → Pembukuan Kas Umum',
        tabOverrides: {
            payments: {
                title: 'Pembayaran & SPP',
            },
            'ai-finance': {
                title: 'AI Analisis Finansial',
            },
            'financial-reports': {
                title: 'Buku Kas & Laporan',
            },
            'finance-reminder': {
                title: 'Reminder Tagihan Ortu',
            },
        },
    },
    guru_bk: {
        id: 'guru_bk',
        title: 'Guru BK',
        shortTitle: 'Guru BK',
        badge: 'Layanan Bimbingan Konseling',
        scopeBadge: 'Konseling & Mitigasi Siswa',
        userName: 'Guru BK',
        userEmail: 'gurubk@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Layanan bimbingan konseling: tindak lanjut rujukan wali kelas, konseling siswa, dan mitigasi risiko.',
        allowedTabs: [
            'overview',
            'class-monitoring',
            'attribute-scanner',
            'cases',
            'reports',
            'early-warning',
            'communication',
            'ats',
            'documents',
        ],
        overviewTitle:
            'Layanan Konseling & Penanganan Siswa',
        overviewSubtitle:
            'Tindak lanjuti rujukan wali kelas, sesi konseling terarah, dan mediasi orang tua.',
        overviewPrinciple:
            'Rujukan Masuk → Sesi Konseling Terarah → Intervensi Solutif',
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
            documents: { title: 'Modul & Program BK', badge: 'BK' },
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
        description: 'Kelola akun GTK, kuota rombel, Dapodik, dan SPP.',
        badge: 'Admin & Ops',
        directUrl: '/operator',
    },
    {
        role: 'guru',
        email: 'guru@sekolah.sch.id',
        title: 'Guru Mata Pelajaran',
        personName: 'Siti Aminah, M.Pd',
        scope: 'Guru Pengampu & Kejuruan',
        description: 'Modul ajar Kurikulum Merdeka, pra-audit AI, dan capaian murid.',
        badge: 'Guru Mapel',
        directUrl: '/guru',
    },
    {
        role: 'wali_kelas',
        email: 'walikelas@sekolah.sch.id',
        title: 'Wali Kelas XI RPL 2',
        personName: 'Ratna Dewi, S.Pd',
        scope: 'Khusus Pemantauan Anak Wali XI RPL 2',
        description: 'Pantau anak wali, absensi, pembinaan karakter, dan kontak ortu.',
        badge: 'Anak Wali',
        directUrl: '/wali-kelas',
    },
    {
        role: 'wali_kelas',
        email: 'budi@sekolah.sch.id',
        title: 'Wali Kelas X TKJ 1',
        personName: 'Budi Santoso, S.Kom',
        scope: 'Khusus Pemantauan Anak Wali X TKJ 1',
        description: 'Pantau presensi rombel X TKJ 1 dan koordinasi pembinaan.',
        badge: 'Anak Wali',
        directUrl: '/wali-kelas/tkj',
    },
    {
        role: 'guru_bk',
        email: 'gurubk@sekolah.sch.id',
        title: 'Guru BK',
        personName: 'Dra. Hj. Nurjanah, M.Pd',
        scope: 'Konseling & Kedisiplinan',
        description: 'Konseling siswa, tindak lanjut rujukan, dan mitigasi ATS.',
        badge: 'BK & Kasus',
        directUrl: '/guru-bk',
    },
    {
        role: 'kepala_sekolah',
        email: 'kepsek@sekolah.sch.id',
        title: 'Kepala Sekolah',
        personName: 'Drs. H. Mulyadi, M.Pd',
        scope: 'Supervisi & Mutu Sekolah',
        description: 'Supervisi mutu rombel, kedisiplinan, GTK, dan keuangan.',
        badge: 'Eksekutif',
        directUrl: '/kepala-sekolah',
    },
    {
        role: 'bendahara',
        email: 'bendahara@sekolah.sch.id',
        title: 'Bendahara Sekolah',
        personName: 'Ahmad Suhendra, S.E.',
        scope: 'Keuangan & SPP',
        description: 'Penerimaan SPP, buku kas umum, dan reminder tagihan ortu.',
        badge: 'Keuangan',
        directUrl: '/bendahara',
    },
];
