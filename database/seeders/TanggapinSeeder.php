<?php

namespace Database\Seeders;

use App\Models\AtsRecord;
use App\Models\CaseTimeline;
use App\Models\DapodikIssue;
use App\Models\DisciplineRecord;
use App\Models\Followup;
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
    }
}
