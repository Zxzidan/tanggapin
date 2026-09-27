<?php

namespace Database\Seeders;

use App\Models\AtsRecord;
use App\Models\CaseTimeline;
use App\Models\DapodikIssue;
use App\Models\DisciplineRecord;
use App\Models\Followup;
use App\Models\HomeroomJournal;
use App\Models\Incident;
use App\Models\IncidentChecklist;
use App\Models\ParentCommunication;
use App\Models\RiskAlert;
use App\Models\SchoolClass;
use App\Models\SchoolPayment;
use App\Models\SchoolSetting;
use App\Models\Student;
use App\Models\StudentCase;
use App\Models\StudentReport;
use App\Models\SubjectGrade;
use App\Models\TeacherDocument;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TanggapinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seed realistic school classes, students, and staff accounts for the system.
     */
    public function run(): void
    {
        // 0. School Setting (Paket Unggulan - Kuota 35 Kelas)
        SchoolSetting::current();

        // 1. Classes
        $classRpl2 = SchoolClass::updateOrCreate(['name' => 'XI RPL 2'], [
            'major' => 'Rekayasa Perangkat Lunak',
            'academic_year' => '2025/2026 Ganjil',
            'homeroom_teacher_name' => 'Ratna Dewi, S.Pd',
            'total_students' => 36,
            'attendance_rate' => 91,
            'health_status' => 'warning',
        ]);

        $classTkj1 = SchoolClass::updateOrCreate(['name' => 'X TKJ 1'], [
            'major' => 'Teknik Komputer dan Jaringan',
            'academic_year' => '2025/2026 Ganjil',
            'homeroom_teacher_name' => 'Budi Santoso, S.Kom',
            'total_students' => 34,
            'attendance_rate' => 95,
            'health_status' => 'good',
        ]);

        // Seed Official Staff Users managed by Operator
        User::updateOrCreate(['email' => 'operator@sekolah.sch.id'], [
            'name' => 'Operator Sekolah',
            'role' => 'operator',
            'password' => Hash::make('password'),
            'raw_password' => 'password',
            'email_verified_at' => now(),
        ]);

        User::updateOrCreate(['email' => 'kepsek@sekolah.sch.id'], [
            'name' => 'Drs. H. Mulyadi, M.Pd',
            'role' => 'kepala_sekolah',
            'password' => Hash::make('password'),
            'raw_password' => 'password',
            'email_verified_at' => now(),
        ]);

        User::updateOrCreate(['email' => 'walikelas@sekolah.sch.id'], [
            'name' => 'Ratna Dewi, S.Pd',
            'role' => 'wali_kelas',
            'school_class_id' => $classRpl2->id,
            'password' => Hash::make('password'),
            'raw_password' => 'password',
            'email_verified_at' => now(),
        ]);

        User::updateOrCreate(['email' => 'budi@sekolah.sch.id'], [
            'name' => 'Budi Santoso, S.Kom',
            'role' => 'wali_kelas',
            'school_class_id' => $classTkj1->id,
            'password' => Hash::make('password'),
            'raw_password' => 'password',
            'email_verified_at' => now(),
        ]);

        User::updateOrCreate(['email' => 'gurubk@sekolah.sch.id'], [
            'name' => 'Dra. Hj. Nurjanah, M.Pd',
            'role' => 'guru_bk',
            'password' => Hash::make('password'),
            'raw_password' => 'password',
            'email_verified_at' => now(),
        ]);

        User::updateOrCreate(['email' => 'guru@sekolah.sch.id'], [
            'name' => 'Siti Aminah, M.Pd',
            'role' => 'guru',
            'password' => Hash::make('password'),
            'raw_password' => 'password',
            'email_verified_at' => now(),
        ]);

        User::updateOrCreate(['email' => 'bendahara@sekolah.sch.id'], [
            'name' => 'Ahmad Suhendra, S.E.',
            'role' => 'bendahara',
            'password' => Hash::make('password'),
            'raw_password' => 'password',
            'email_verified_at' => now(),
        ]);

        // 2. Students
        $siswa = Student::updateOrCreate(['nisn' => '0067123001'], [
            'school_class_id' => $classRpl2->id,
            'name' => 'Siswa Contoh',
            'gender' => 'L',
            'parent_name' => 'Orang Tua Contoh',
            'parent_phone' => '+62 812-3456-7890',
            'address' => 'Jl. Contoh No. 1, Kota Bandung',
            'attendance_rate' => 72,
            'risk_level' => 'high',
            'status' => 'active',
        ]);

        $ahmad = Student::updateOrCreate(['nisn' => '0067123002'], [
            'school_class_id' => $classRpl2->id,
            'name' => 'Ahmad Fauzi',
            'gender' => 'L',
            'parent_name' => 'Bapak Fauzi',
            'parent_phone' => '+62 813-9876-5432',
            'address' => 'Jl. Cempaka No. 14, Kota Bandung',
            'attendance_rate' => 88,
            'risk_level' => 'medium',
            'status' => 'active',
        ]);

        $nadia = Student::updateOrCreate(['nisn' => '0067123003'], [
            'school_class_id' => $classRpl2->id,
            'name' => 'Nadia Putri',
            'gender' => 'P',
            'parent_name' => 'Ibu Marlina',
            'parent_phone' => '+62 819-1122-3344',
            'address' => 'Jl. Pelajar Pejuang No. 88, Kota Bandung',
            'attendance_rate' => 98,
            'risk_level' => 'low',
            'status' => 'active',
        ]);

        $doni = Student::updateOrCreate(['nisn' => '0067123004'], [
            'school_class_id' => $classTkj1->id,
            'name' => 'Doni Pratama',
            'gender' => 'L',
            'parent_name' => 'Bapak Pratama',
            'parent_phone' => '+62 812-7788-9900',
            'address' => 'Jl. Cibaduyut No. 23, Kota Bandung',
            'attendance_rate' => 84,
            'risk_level' => 'medium',
            'status' => 'active',
        ]);

        $citra = Student::updateOrCreate(['nisn' => '0067123005'], [
            'school_class_id' => $classTkj1->id,
            'name' => 'Citra Lestari',
            'gender' => 'P',
            'parent_name' => 'Ibu Citra',
            'parent_phone' => '+62 813-5566-7788',
            'address' => 'Jl. Kopo No. 102, Kota Bandung',
            'attendance_rate' => 96,
            'risk_level' => 'low',
            'status' => 'active',
        ]);

        // 3. Single Risk Alert (Modul 01 - Early Warning)
        RiskAlert::updateOrCreate(['student_id' => $siswa->id], [
            'trigger_type' => 'Kehadiran & Nilai',
            'summary' => 'Kehadiran menurun drastis dan 2 tugas produktif belum terkumpul.',
            'risk_level' => 'high',
            'is_action_taken' => false,
            'suggested_action' => 'Buat Follow-up & Hubungi Orang Tua',
        ]);

        // 4. Single Case & Timeline (Modul 03 - Kasus BK & Rujukan Wali Kelas)
        $case = StudentCase::updateOrCreate(['code' => 'CS-2025-001'], [
            'student_id' => $siswa->id,
            'category' => 'Kedisiplinan',
            'priority' => 'Tinggi',
            'stage' => 'new',
            'stage_label' => 'Rujukan Masuk dari Wali Kelas',
            'assignee_name' => 'Ibu Rahmawati, S.Psi (Guru BK)',
            'referred_by_name' => 'Budi Santoso, S.Pd (Wali Kelas)',
            'referral_notes' => 'Kehadiran menurun drastis 3 minggu terakhir dan siswa sering murung saat jam pelajaran.',
            'last_activity' => 'Rujukan kendala siswa dilaporkan oleh Wali Kelas, menunggu penanganan Guru BK.',
        ]);

        CaseTimeline::updateOrCreate(['student_case_id' => $case->id, 'title' => 'Rujukan kendala siswa dilaporkan ke Guru BK'], [
            'actor_name' => 'Budi Santoso, S.Pd (Wali Kelas)',
            'recorded_at' => '22 Sep 08:30',
        ]);

        $secondStudent = Student::where('school_class_id', $classRpl2->id)->skip(1)->first();
        if ($secondStudent) {
            $handledCase = StudentCase::updateOrCreate(['code' => 'CS-2025-002'], [
                'student_id' => $secondStudent->id,
                'category' => 'Motivasi Belajar',
                'priority' => 'Sedang',
                'stage' => 'handled_by_bk',
                'stage_label' => 'Sudah Ditangani oleh Guru BK',
                'assignee_name' => 'Ibu Rahmawati, S.Psi (Guru BK)',
                'referred_by_name' => 'Budi Santoso, S.Pd (Wali Kelas)',
                'referral_notes' => 'Siswa mengalami penurunan nilai drastis dan kesulitan fokus saat praktikum kejuruan.',
                'handled_by_bk_name' => 'Ibu Rahmawati, S.Psi (Guru BK)',
                'bk_action_type' => 'Konseling Individu & Pendampingan Belajar',
                'bk_handling_notes' => 'Telah dilaksanakan sesi konseling individu. Siswa mengalami kesulitan adaptasi materi kejuruan dan hambatan kerja kelompok. Telah disusun kesepakatan target belajar bertahap dan pendampingan tutor sebaya.',
                'handled_at' => now()->subDay(),
                'last_activity' => 'Telah ditangani oleh Guru BK (Ibu Rahmawati, S.Psi): Konseling individu & rencana tutor sebaya disepakati.',
            ]);

            CaseTimeline::updateOrCreate(['student_case_id' => $handledCase->id, 'title' => 'Dirujuk oleh Wali Kelas'], [
                'actor_name' => 'Budi Santoso, S.Pd (Wali Kelas)',
                'recorded_at' => '23 Sep 09:00',
            ]);

            CaseTimeline::updateOrCreate(['student_case_id' => $handledCase->id, 'title' => 'Ditangani oleh Guru BK: Konseling Individu'], [
                'actor_name' => 'Ibu Rahmawati, S.Psi (Guru BK)',
                'recorded_at' => '24 Sep 11:30',
            ]);
        }

        // 5. Single Followup
        Followup::updateOrCreate(['student_id' => $siswa->id, 'type' => 'Panggilan Orang Tua'], [
            'student_case_id' => $case->id,
            'assignee_name' => 'Wali Kelas',
            'note' => 'Koordinasi evaluasi kehadiran dan bimbingan belajar di rumah.',
            'status' => 'pending',
            'due_date' => '28 Sep 2025',
        ]);

        // 6. Single Parent Communication (Modul 04)
        ParentCommunication::updateOrCreate(['student_id' => $siswa->id, 'category' => 'Notifikasi Kehadiran'], [
            'sender_name' => 'Wali Kelas',
            'parent_name' => $siswa->parent_name,
            'message' => 'Pemberitahuan ketidakhadiran ananda pada hari Kamis tanpa surat keterangan izin.',
            'status' => 'Terkirim via WhatsApp & Tanggapin App',
            'acknowledgement' => 'Sudah membaca',
            'sent_at' => '24 Sep 08:15',
        ]);

        // 7. Single Discipline Record (Modul 05)
        DisciplineRecord::updateOrCreate(['student_id' => $siswa->id, 'infraction' => 'Terlambat Masuk Sekolah'], [
            'points' => 15,
            'action_status' => 'Sudah Dibina',
            'pattern_notes' => 'Terjadi 3x berurutan pada jam pertama.',
            'recorded_at' => '23 Sep 2025',
        ]);

        // 8. Single ATS Record (Modul 06)
        AtsRecord::updateOrCreate(['student_id' => $siswa->id], [
            'status' => 'Kunjungan Terjadwal',
            'reason' => 'Kendala ekonomi dan membantu usaha orang tua.',
            'officer_name' => 'Tim Satgas ATS',
            'address' => $siswa->address,
            'scheduled_visit' => '27 Sep 2025, 14:00 WIB',
        ]);

        // 9. Single Payment (Modul 07)
        SchoolPayment::updateOrCreate(['invoice_no' => 'INV-2025-09-001'], [
            'student_id' => $siswa->id,
            'type' => 'SPP September 2025',
            'amount' => 350000,
            'due_date' => '10 Sep 2025',
            'status' => 'Menunggu Verifikasi',
        ]);

        // 10. Teacher Documents (Modul 08 & Modul Supervisi GTK)
        TeacherDocument::updateOrCreate(['title' => 'Modul Ajar Pemrograman Web & Bergerak'], [
            'teacher_name' => 'Guru Kejuruan',
            'category' => 'Perangkat Pembelajaran',
            'period' => '2025/2026 Ganjil',
            'status' => 'Lengkap',
            'file_size' => '2.4 MB',
        ]);
        TeacherDocument::updateOrCreate(['title' => 'Alur Tujuan Pembelajaran (ATP) Matematika Terapan SMK'], [
            'teacher_name' => 'Ratna Dewi, S.Pd',
            'category' => 'Alur Tujuan Pembelajaran',
            'period' => '2025/2026 Ganjil',
            'status' => 'Lengkap',
            'file_size' => '1.8 MB',
        ]);
        TeacherDocument::updateOrCreate(['title' => 'Modul Ajar Jaringan Komputer Dasar & Cloud Computing'], [
            'teacher_name' => 'Budi Santoso, S.Kom',
            'category' => 'Perangkat Pembelajaran',
            'period' => '2025/2026 Ganjil',
            'status' => 'Lengkap',
            'file_size' => '3.1 MB',
        ]);
        TeacherDocument::updateOrCreate(['title' => 'Modul Projek Penguatan Profil Pelajar Pancasila (P5) - Kebekerjaan'], [
            'teacher_name' => 'Dra. Hj. Nurjanah, M.Pd',
            'category' => 'Modul Projek P5',
            'period' => '2025/2026 Ganjil',
            'status' => 'Lengkap',
            'file_size' => '4.2 MB',
        ]);
        TeacherDocument::updateOrCreate(['title' => 'Rencana Pembelajaran Terbimbing & Diferensiasi Bahasa Inggris'], [
            'teacher_name' => 'Siti Aminah, M.Pd',
            'category' => 'Perangkat Pembelajaran',
            'period' => '2025/2026 Ganjil',
            'status' => 'Menunggu Supervisi',
            'file_size' => '1.5 MB',
        ]);

        // 11. Single Dapodik Issue (Modul 09)
        DapodikIssue::updateOrCreate(['target_name' => 'Kelas XI RPL 2', 'field' => 'Mata Pelajaran Tanpa Pengampu'], [
            'category' => 'Rombongan Belajar',
            'description' => 'Jadwal rombel belum dipetakan ke guru mata pelajaran terdaftar.',
            'severity' => 'Error',
            'action' => 'Petakan guru pengampu di menu pembelajaran',
            'status' => 'open',
        ]);

        // 12. Single Incident & Checklists (Modul 10)
        $incident = Incident::updateOrCreate(['title' => 'Prosedur Siaga Bencana Musim Hujan'], [
            'type' => 'Cuaca Ekstrem',
            'status' => 'Siaga Aktif',
            'level' => 'Waspada',
            'lead_officer' => 'Ketua Tim Tanggap Darurat',
        ]);

        IncidentChecklist::updateOrCreate(['incident_id' => $incident->id, 'label' => 'Aktivasi Tim Tanggap Darurat Sekolah'], [
            'is_done' => true,
        ]);
        IncidentChecklist::updateOrCreate(['incident_id' => $incident->id, 'label' => 'Penyusunan Rute Alternatif Pulang Siswa'], [
            'is_done' => false,
        ]);

        // 13. Student Reports (AI Automated Report Cards)
        StudentReport::updateOrCreate(['report_code' => 'RPR-2025-001'], [
            'student_id' => $siswa->id,
            'academic_period' => '2025/2026 Ganjil',
            'attendance_rate' => 72,
            'sick_count' => 3,
            'permission_count' => 2,
            'unexcused_count' => 6,
            'discipline_points' => 15,
            'discipline_status' => 'Dalam Pendampingan Khusus',
            'ai_character_summary' => 'Ananda memiliki potensi logika kejuruan dan kreativitas yang baik saat hadir di kelas. Namun, pola kehadiran yang menurun pada jam pertama dan ketidakhadiran tanpa surat keterangan memerlukan perhatian bersama antara sekolah dan keluarga agar tidak tertinggal materi uji kompetensi.',
            'ai_academic_notes' => 'Tugas produktif pemrograman web modul 1-3 diselesaikan dengan baik saat di sekolah. Perlu pendampingan untuk penyelesaian tugas mandiri di rumah.',
            'parent_recommendations' => 'Mohon Bapak/Ibu mendampingi jadwal istirahat malam ananda dan mengingatkan persiapan sekolah sebelum pukul 06.30 WIB. Wali kelas siap memberikan bimbingan belajar tambahan di jam istirahat.',
            'status' => 'sent',
            'sent_to_parent_at' => now()->subDay()->format('d M H:i'),
            'parent_phone' => $siswa->parent_phone,
            'parent_name' => $siswa->parent_name,
            'delivery_channel' => 'WhatsApp Official & Tanggapin App',
            'acknowledgement_status' => 'Sudah Dibaca & Dikonfirmasi Orang Tua',
            'homeroom_teacher_name' => 'Wali Kelas XI RPL 2',
        ]);

        StudentReport::updateOrCreate(['report_code' => 'RPR-2025-002'], [
            'student_id' => $nadia->id,
            'academic_period' => '2025/2026 Ganjil',
            'attendance_rate' => 98,
            'sick_count' => 1,
            'permission_count' => 0,
            'unexcused_count' => 0,
            'discipline_points' => 0,
            'discipline_status' => 'Sangat Tertib & Teladan',
            'ai_character_summary' => 'Nadia menunjukkan kepemimpinan yang santun, disiplin belajar tinggi, dan aktif membantu teman sekelas dalam proyek kelompok. Menjadi teladan positif bagi rombongan belajar XI RPL 2.',
            'ai_academic_notes' => 'Seluruh capaian pembelajaran dan tugas produktif tuntas melampaui kriteria ketuntasan minimal (KKM) dengan predikat Sangat Baik (A).',
            'parent_recommendations' => 'Apresiasi yang tinggi kepada orang tua atas dukungan optimal di rumah. Pertahankan motivasi belajar dan dorong ananda untuk mengikuti ajang Lomba Kompetensi Siswa (LKS).',
            'status' => 'sent',
            'sent_to_parent_at' => now()->subDays(2)->format('d M H:i'),
            'parent_phone' => $nadia->parent_phone,
            'parent_name' => $nadia->parent_name,
            'delivery_channel' => 'WhatsApp Official & Tanggapin App',
            'acknowledgement_status' => 'Sudah Dibaca & Dikonfirmasi Orang Tua',
            'homeroom_teacher_name' => 'Wali Kelas XI RPL 2',
        ]);

        // 13. Subject Grades (Penilaian Capaian Mapel Guru Pengampu)
        $teacherMapel = User::where('role', 'guru')->first();
        $teacherId = $teacherMapel?->id;

        $subjectCatalog = [
            [
                'code' => 'PPLG-401',
                'name' => 'Pemrograman Web & Perangkat Bergerak',
                'teacher' => 'Siti Aminah, M.Pd',
                'teacher_id' => $teacherId,
                'kkm' => 75,
            ],
            [
                'code' => 'PPLG-402',
                'name' => 'Basis Data & SQL Terapan',
                'teacher' => 'Hendra Wijaya, S.Kom',
                'teacher_id' => null,
                'kkm' => 75,
            ],
            [
                'code' => 'PPLG-403',
                'name' => 'Pemodelan Perangkat Lunak & OOP',
                'teacher' => 'Budi Santoso, S.Kom',
                'teacher_id' => null,
                'kkm' => 75,
            ],
            [
                'code' => 'UMUM-101',
                'name' => 'Bahasa Inggris Komunikasi Kejuruan',
                'teacher' => 'Dian Permatasari, M.Pd',
                'teacher_id' => null,
                'kkm' => 75,
            ],
            [
                'code' => 'UMUM-102',
                'name' => 'Matematika Terapan & Logika Komputasi',
                'teacher' => 'Ir. Bambang S., M.T.',
                'teacher_id' => null,
                'kkm' => 75,
            ],
        ];

        $studentList = [$siswa, $ahmad, $nadia, $doni, $citra];
        foreach ($studentList as $st) {
            $isHigh = $st->attendance_rate >= 90 && $st->risk_level === 'low';
            $isLow = $st->attendance_rate < 80 || $st->risk_level === 'high';
            $sId = $st->id;

            foreach ($subjectCatalog as $idx => $subj) {
                $base = $isHigh ? (88 + ($sId % 5)) : ($isLow ? (66 + ($sId % 7)) : (78 + ($sId % 6)));
                // Slight variation across subjects
                $formative = min(100, max(55, $base + (($idx % 3) * 2) - 1));
                $summative = min(100, max(55, $base + (($idx % 2) * 3) - 2));
                $tp1 = min(100, max(50, $formative + 2));
                $tp2 = min(100, max(50, $formative - 1));
                $tp3 = min(100, max(50, $summative + 1));
                $finalScore = (int) round(($formative * 0.4) + ($summative * 0.6));
                $predicate = $finalScore >= 88 ? 'A (Sangat Baik)' : ($finalScore >= 75 ? 'B (Baik)' : 'C (Perlu Bimbingan)');

                SubjectGrade::updateOrCreate(
                    [
                        'student_id' => $st->id,
                        'subject_code' => $subj['code'],
                    ],
                    [
                        'teacher_id' => $subj['teacher_id'],
                        'academic_period' => '2025/2026 Ganjil',
                        'subject_name' => $subj['name'],
                        'teacher_name' => $subj['teacher'],
                        'kkm' => $subj['kkm'],
                        'formative_score' => $formative,
                        'summative_score' => $summative,
                        'final_score' => $finalScore,
                        'predicate' => $predicate,
                        'tp1_score' => $tp1,
                        'tp2_score' => $tp2,
                        'tp3_score' => $tp3,
                        'tp1_status' => $tp1 >= 88 ? 'Tercapai Optimal' : ($tp1 >= 75 ? 'Tercapai' : 'Perlu Bimbingan'),
                        'tp2_status' => $tp2 >= 88 ? 'Tercapai Optimal' : ($tp2 >= 75 ? 'Tercapai' : 'Perlu Bimbingan'),
                        'tp3_status' => $tp3 >= 88 ? 'Tercapai Optimal' : ($tp3 >= 75 ? 'Tercapai' : 'Perlu Bimbingan'),
                        'attitude_critical' => $isHigh ? 'Sangat Baik — Mampu menganalisis akar masalah bug sistem.' : ($isLow ? 'Cukup — Perlu bimbingan bertahap.' : 'Baik — Menunjukkan pemahaman solid.'),
                        'attitude_independence' => $isHigh ? 'Sangat Baik — Tugas praktikum mandiri diselesaikan sebelum deadline.' : ($isLow ? 'Perlu Pendampingan — Membutuhkan arahan berkala.' : 'Baik — Disiplin tuntas jobsheet lab.'),
                        'attitude_cooperation' => $isHigh ? 'Sangat Baik — Kolaboratif dan menjadi motor tim.' : ($isLow ? 'Cukup — Cenderung pasif dalam diskusi kelompok.' : 'Baik — Kerja sama tim harmonis.'),
                        'teacher_notes' => $isHigh ? "Performa luar biasa pada mata pelajaran {$subj['name']}." : ($isLow ? "Perlu meningkatkan kehadiran dan mengulang jobsheet praktikum {$subj['name']}." : 'Proses belajar menunjukkan tren positif.'),
                        'ai_analysis' => [
                            'competencyDiagnosis' => $isHigh ? "Siswa memiliki keunggulan kompetensi di {$subj['name']} melampaui rata-rata kelas." : ($isLow ? "Indikasi kesenjangan pemahaman praktikum {$subj['name']} akibat jam belajar yang terlewat." : 'Penguasaan materi dasar tuntas.'),
                            'differentiationPlan' => $isHigh ? 'Enrichment Track: Berikan proyek aplikasi riil berbasis portofolio industri.' : ($isLow ? 'Scaffolding Track: Pendampingan klinis 1-on-1 dan lembar kerja bertahap.' : 'Praktik mandiri terbimbing modul lanjutan.'),
                            'remedialFocus' => $isLow ? "Remedial fokus materi modul praktikum kejuruan {$subj['code']}." : null,
                            'readinessScore' => $isHigh ? 94 : ($isLow ? 68 : 82),
                            'readinessStatus' => $isHigh ? 'Sangat Siap' : ($isLow ? 'Butuh Remedial' : 'Siap Kompeten'),
                            'recommendedActivities' => $isHigh ? ['Proyek Web Skala Penuh', 'Peer Tutor'] : ($isLow ? ['Klinik Remedial 1-on-1', 'Latihan Mandiri'] : ['Mini Project']),
                        ],
                    ]
                );
            }
        }

        // 14. Homeroom Journals (Buku Jurnal Pembinaan Khusus Wali Kelas)
        $waliKelasUser = User::where('role', 'wali_kelas')->first();
        HomeroomJournal::updateOrCreate(
            [
                'student_id' => $siswa->id,
                'title' => 'Konseling Akademik & Pemulihan Presensi KBM Mapel Kejuruan',
            ],
            [
                'school_class_id' => $classRpl2->id,
                'user_id' => $waliKelasUser?->id,
                'homeroom_teacher_name' => 'Ratna Dewi, S.Pd (Wali Kelas XI RPL 2)',
                'journal_date' => now()->subDays(3)->toDateString(),
                'category' => 'Akademik & Nilai Mapel',
                'issue_description' => 'Siswa mengalami penurunan nilai pada mapel Pemrograman Web (66) dan ketidakhadiran tanpa izin 6 hari. Ditemukan pola tidur larut malam akibat bermain game.',
                'counseling_approach' => 'Pendekatan persuasif dan pembentukan komitmen belajar. Wali kelas menyusun jadwal remedial bersama guru mapel Siti Aminah, M.Pd.',
                'student_commitment' => 'Ananda berjanji tidur maksimal pukul 22.00 WIB, hadir tepat waktu sebelum 06.45 WIB, dan menuntaskan tugas praktikum susulan dalam 1 pekan.',
                'status' => 'Sedang Dipantau',
                'parent_notified_at' => now()->subDays(2)->format('d M H:i'),
            ]
        );

        HomeroomJournal::updateOrCreate(
            [
                'student_id' => $ahmad->id,
                'title' => 'Bimbingan Peningkatan Portofolio Proyek REST API Mandiri',
            ],
            [
                'school_class_id' => $classRpl2->id,
                'user_id' => $waliKelasUser?->id,
                'homeroom_teacher_name' => 'Ratna Dewi, S.Pd (Wali Kelas XI RPL 2)',
                'journal_date' => now()->subDays(5)->toDateString(),
                'category' => 'Akademik & Nilai Mapel',
                'issue_description' => 'Nilai Ahmad konsisten baik (84-88). Membutuhkan arahan agar tidak cepat puas dan mulai menyusun portofolio GitHub untuk persiapan magang industri (PKL).',
                'counseling_approach' => 'Apresiasi pencapaian dan mentoring karir kejuruan tingkat lanjut.',
                'student_commitment' => 'Ahmad bersedia menyusun 1 repository portofolio full-stack dan menjadi tutor sebaya bagi kelompok belajarnya.',
                'status' => 'Tuntas Berkembang',
                'parent_notified_at' => null,
            ]
        );

        HomeroomJournal::updateOrCreate(
            [
                'student_id' => $nadia->id,
                'title' => 'Pendampingan Calon Delegasi LKS Bidang Web Technologies',
            ],
            [
                'school_class_id' => $classRpl2->id,
                'user_id' => $waliKelasUser?->id,
                'homeroom_teacher_name' => 'Ratna Dewi, S.Pd (Wali Kelas XI RPL 2)',
                'journal_date' => now()->subDays(8)->toDateString(),
                'category' => 'Karir & Masa Depan',
                'issue_description' => 'Prestasi akademik Nadia sangat unggul (seluruh mapel A, nilai 92-96). Diajukan sebagai kandidat seleksi LKS tingkat kota.',
                'counseling_approach' => 'Konsultasi kesiapan mental, manajemen waktu antara KBM reguler dan jadwal pemusatan latihan.',
                'student_commitment' => 'Nadia antusias dan siap mengikuti program bimbingan intensif sepulang sekolah.',
                'status' => 'Tuntas Berkembang',
                'parent_notified_at' => now()->subDays(7)->format('d M H:i'),
            ]
        );
    }
}
