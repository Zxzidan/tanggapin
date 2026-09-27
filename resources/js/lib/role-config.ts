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
        scopeBadge: 'Monitoring Perkembangan Sekolah',
        userName: 'Drs. H. Mulyadi, M.Pd',
        userEmail: 'kepsek@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses dashboard monitoring eksekutif untuk memantau perkembangan sekolah secara menyeluruh: kesehatan rombel, kedisiplinan siswa, kinerja GTK, dan akuntabilitas keuangan.',
        allowedTabs: [
            'overview',
            'academic-supervision',
            'school-evaluation',
            'executive-approvals',
        ],
        overviewTitle: 'Dashboard Monitoring Perkembangan Sekolah',
        overviewSubtitle:
            'Supervisi Eksekutif Kepala Sekolah • Pantau indikator mutu, perkembangan kelas, kedisiplinan, dan akuntabilitas sekolah.',
        overviewPrinciple:
            'Prinsip Kepala Sekolah: Pantau Indikator Mutu → Evaluasi Kinerja GTK → Berikan Arahan Manajerial → Dorong Peningkatan Mutu.',
        tabOverrides: {
            overview: { title: 'Dashboard Monitoring' },
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
        scopeBadge: 'Pemantauan Anak Wali',
        userName: 'Ratna Dewi, S.Pd',
        userEmail: 'walikelas@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Tampilan khusus pemantauan anak wali: pantau presensi rombel binaan, tindak lanjuti poin pelanggaran dari Guru BK, pembinaan anak wali, kontak orang tua, dan rujukan kendala ke Guru BK.',
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
            'Wali Kelas • Pemantauan Perkembangan, Kedisiplinan & Kesejahteraan Rombel Binaan.',
        overviewPrinciple:
            'Prinsip Wali Kelas: Pantau Presensi Anak Wali → Dampingi Disiplin & Karakter → Komunikasi Ortu → Koordinasi Guru BK.',
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
        scopeBadge: 'Modul Ajar & Siswa yang Diajar',
        userName: 'Siti Aminah, M.Pd',
        userEmail: 'guru@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses pendidik mata pelajaran: kelola dan unggah Modul Ajar Kurikulum Merdeka, pra-audit AI mandiri, monitoring murid yang diajar lintas rombel, serta evaluasi capaian asesmen pembelajaran.',
        allowedTabs: [
            'overview',
            'documents',
            'class-monitoring',
            'reports',
        ],
        overviewTitle:
            'Pusat Modul Ajar & Monitoring Murid yang Diajar',
        overviewSubtitle:
            'Guru Mata Pelajaran • Modul Ajar Kurikulum Merdeka, Pra-Audit AI & Pemantauan Murid.',
        overviewPrinciple:
            'Prinsip Guru: Susun Modul Ajar Berdiferensiasi → Pra-Audit AI Mandiri → Pantau Siswa yang Diajar → Evaluasi Asesmen Formatif.',
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
        scopeBadge: 'Khusus Keuangan & SPP',
        userName: 'Ahmad Suhendra, S.E.',
        userEmail: 'bendahara@sekolah.sch.id',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        roleDesc:
            'Akses sistem mencakup pengelolaan keuangan sekolah: pembayaran SPP, analisis AI arus kas, Buku Kas Umum (BKU), dan pengingat tagihan santun ke orang tua.',
        allowedTabs: [
            'payments',
            'ai-finance',
            'financial-reports',
            'finance-reminder',
        ],
        overviewTitle:
            'Pusat Kendali Keuangan Sekolah & Rekonsiliasi SPP',
        overviewSubtitle:
            'Bendahara Sekolah • Pengelolaan Kas, Analisis AI Finansial & Rekapitulasi SPP.',
        overviewPrinciple:
            'Prinsip Keuangan: Pantau Jatuh Tempo → Analisis AI Arus Kas → Rekonsiliasi Kas Masuk → Pembukuan BKU.',
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
            'documents',
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
        description: 'Kelola akun GTK, kuota rombel, Dapodik, SPP & kesiapsiagaan sekolah.',
        badge: 'Admin & Ops',
        directUrl: '/operator',
    },
    {
        role: 'guru',
        email: 'guru@sekolah.sch.id',
        title: 'Guru Mata Pelajaran',
        personName: 'Siti Aminah, M.Pd',
        scope: 'Guru Pengampu & Kejuruan',
        description: 'Modul ajar Kurikulum Merdeka, pra-audit AI mandiri & monitoring murid yang diajar.',
        badge: 'Guru Mapel',
        directUrl: '/guru',
    },
    {
        role: 'wali_kelas',
        email: 'walikelas@sekolah.sch.id',
        title: 'Wali Kelas XI RPL 2',
        personName: 'Ratna Dewi, S.Pd',
        scope: 'Khusus Pemantauan Anak Wali XI RPL 2',
        description: 'Pantau anak wali, absensi rombel, poin BK, dampingi pembinaan & kontak ortu.',
        badge: 'Anak Wali',
        directUrl: '/wali-kelas',
    },
    {
        role: 'wali_kelas',
        email: 'budi@sekolah.sch.id',
        title: 'Wali Kelas X TKJ 1',
        personName: 'Budi Santoso, S.Kom',
        scope: 'Khusus Pemantauan Anak Wali X TKJ 1',
        description: 'Pantau anak wali rombel X TKJ 1, poin pelanggaran BK & pembinaan kelas.',
        badge: 'Anak Wali',
        directUrl: '/wali-kelas/tkj',
    },
    {
        role: 'guru_bk',
        email: 'gurubk@sekolah.sch.id',
        title: 'Guru BK',
        personName: 'Dra. Hj. Nurjanah, M.Pd',
        scope: 'Konseling & Kedisiplinan',
        description: 'Lihat semua rombel, input siswa, catat poin disiplin, konseling & mitigasi ATS.',
        badge: 'BK & Kasus',
        directUrl: '/guru-bk',
    },
    {
        role: 'kepala_sekolah',
        email: 'kepsek@sekolah.sch.id',
        title: 'Kepala Sekolah',
        personName: 'Drs. H. Mulyadi, M.Pd',
        scope: 'Monitoring Perkembangan Sekolah',
        description: 'Dashboard monitoring eksekutif: supervisi mutu rombel, kedisiplinan, GTK & keuangan.',
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
