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
use App\Models\Student;
use App\Models\StudentCase;
use App\Models\TeacherDocument;
use Illuminate\Database\Seeder;

class TanggapinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Simplified: 1 class, 1 student, 1 example per module for dashboard demo.
     */
    public function run(): void
    {
        // 1. Single Class
        $classRpl2 = SchoolClass::updateOrCreate(['name' => 'XI RPL 2'], [
            'major' => 'Rekayasa Perangkat Lunak',
            'academic_year' => '2025/2026 Ganjil',
            'homeroom_teacher_name' => 'Wali Kelas XI RPL 2',
            'total_students' => 36,
            'attendance_rate' => 91,
            'health_status' => 'warning',
        ]);

        // 2. Single Student
        $siswa = Student::updateOrCreate(['nisn' => '0067123001'], [
            'school_class_id' => $classRpl2->id,
            'name' => 'Siswa Contoh',
            'gender' => 'L',
            'parent_name' => 'Orang Tua Contoh',
            'parent_phone' => '+62 812-3456-7890',
            'address' => 'Jl. Contoh No. 1',
            'attendance_rate' => 72,
            'risk_level' => 'high',
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

        // 4. Single Case & Timeline (Modul 03 - Kasus BK)
        $case = StudentCase::updateOrCreate(['code' => 'CS-2025-001'], [
            'student_id' => $siswa->id,
            'category' => 'Kedisiplinan',
            'priority' => 'Tinggi',
            'stage' => 'new',
            'stage_label' => 'Baru Masuk',
            'assignee_name' => 'Guru BK',
            'last_activity' => 'Kasus baru didaftarkan ke sistem, menunggu penugasan.',
        ]);

        CaseTimeline::updateOrCreate(['student_case_id' => $case->id, 'title' => 'Kasus didaftarkan ke sistem'], [
            'actor_name' => 'Wali Kelas',
            'recorded_at' => '22 Sep 08:30',
        ]);

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

        // 10. Single Teacher Document (Modul 08)
        TeacherDocument::updateOrCreate(['title' => 'Modul Ajar Pemrograman Web & Bergerak'], [
            'teacher_name' => 'Guru Kejuruan',
            'category' => 'Perangkat Pembelajaran',
            'period' => '2025/2026 Ganjil',
            'status' => 'Lengkap',
            'file_size' => '2.4 MB',
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
    }
}
