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
     */
    public function run(): void
    {
        // 1. Classes
        $classRpl2 = SchoolClass::updateOrCreate(['name' => 'XI RPL 2'], [
            'major' => 'Rekayasa Perangkat Lunak',
            'academic_year' => '2025/2026 Ganjil',
            'homeroom_teacher_name' => 'Hendra Setiawan, S.Pd',
            'total_students' => 36,
            'attendance_rate' => 91,
            'health_status' => 'warning',
        ]);

        $classTkj1 = SchoolClass::updateOrCreate(['name' => 'X TKJ 1'], [
            'major' => 'Teknik Komputer & Jaringan',
            'academic_year' => '2025/2026 Ganjil',
            'homeroom_teacher_name' => 'Dewi Sartika, M.Kom',
            'total_students' => 34,
            'attendance_rate' => 88,
            'health_status' => 'critical',
        ]);

        $classAkl2 = SchoolClass::updateOrCreate(['name' => 'XII AKL 2'], [
            'major' => 'Akuntansi & Keuangan Lembaga',
            'academic_year' => '2025/2026 Ganjil',
            'homeroom_teacher_name' => 'Sri Wahyuni, S.E',
            'total_students' => 35,
            'attendance_rate' => 97,
            'health_status' => 'good',
        ]);

        $classTkr3 = SchoolClass::updateOrCreate(['name' => 'XI TKR 3'], [
            'major' => 'Teknik Kendaraan Ringan',
            'academic_year' => '2025/2026 Ganjil',
            'homeroom_teacher_name' => 'Gunawan, S.T',
            'total_students' => 32,
            'attendance_rate' => 86,
            'health_status' => 'critical',
        ]);

        // 2. Students
        $brian = Student::updateOrCreate(['nisn' => '0067123001'], [
            'school_class_id' => $classRpl2->id,
            'name' => 'Brian Aditya',
            'gender' => 'L',
            'parent_name' => 'Hadi Wicaksono',
            'parent_phone' => '+62 812-3456-7890',
            'address' => 'Jl. Anggrek No. 12, Harapan Jaya',
            'attendance_rate' => 72,
            'risk_level' => 'high',
            'status' => 'active',
        ]);

        $fauzan = Student::updateOrCreate(['nisn' => '0078124002'], [
            'school_class_id' => $classTkj1->id,
            'name' => 'Ahmad Fauzan',
            'gender' => 'L',
            'parent_name' => 'Rukmini Fauzan',
            'parent_phone' => '+62 813-8899-1122',
            'address' => 'Kp. Cempaka Baru RT 01/02',
            'attendance_rate' => 81,
            'risk_level' => 'high',
            'status' => 'active',
        ]);

        $siti = Student::updateOrCreate(['nisn' => '0059125003'], [
            'school_class_id' => $classAkl2->id,
            'name' => 'Siti Nurhaliza',
            'gender' => 'P',
            'parent_name' => 'Bambang Sudirman',
            'parent_phone' => '+62 821-4433-2211',
            'address' => 'Perum Griya Asri Blok D3',
            'attendance_rate' => 92,
            'risk_level' => 'medium',
            'status' => 'active',
        ]);

        $deni = Student::updateOrCreate(['nisn' => '0061126004'], [
            'school_class_id' => $classTkr3->id,
            'name' => 'Deni Saputra',
            'gender' => 'L',
            'parent_name' => 'Suparman',
            'parent_phone' => '+62 856-7788-9900',
            'address' => 'Kp. Sukamaju RT 03/05, Desa Sukaresmi',
            'attendance_rate' => 45,
            'risk_level' => 'high',
            'status' => 'ats_candidate',
        ]);

        $reza = Student::updateOrCreate(['nisn' => '0067123005'], [
            'school_class_id' => $classRpl2->id,
            'name' => 'Reza Pahlevi',
            'gender' => 'L',
            'parent_name' => 'Subandi Pahlevi',
            'parent_phone' => '+62 818-0909-3344',
            'address' => 'Jl. Kemuning Raya No. 4',
            'attendance_rate' => 94,
            'risk_level' => 'low',
            'status' => 'active',
        ]);

        $anisa = Student::updateOrCreate(['nisn' => '0078124006'], [
            'school_class_id' => $classTkj1->id,
            'name' => 'Anisa Salma',
            'gender' => 'P',
            'parent_name' => 'Kusuma Wardani',
            'parent_phone' => '+62 878-1234-5678',
            'address' => 'Jl. Flamboyan Indah 2B',
            'attendance_rate' => 96,
            'risk_level' => 'low',
            'status' => 'active',
        ]);

        // 3. Early Warning / Risk Alerts (Modul 01)
        RiskAlert::updateOrCreate(['student_id' => $brian->id], [
            'trigger_type' => 'Kehadiran & Nilai',
            'summary' => 'Kehadiran menurun drastis (28% ketidakhadiran dalam 14 hari) dan 2 tugas produktif belum terkumpul.',
            'risk_level' => 'high',
            'is_action_taken' => false,
            'suggested_action' => 'Buat Follow-up & Hubungi Orang Tua',
        ]);

        RiskAlert::updateOrCreate(['student_id' => $fauzan->id], [
            'trigger_type' => 'Pola Kedisiplinan',
            'summary' => 'Terdeteksi pola pelanggaran berulang: 3x terlambat berurutan dan atribut seragam tidak lengkap. Total 35 poin.',
            'risk_level' => 'high',
            'is_action_taken' => false,
            'suggested_action' => 'Catat Pembinaan & Rujuk Konseling BK',
        ]);

        RiskAlert::updateOrCreate(['student_id' => $siti->id], [
            'trigger_type' => 'Penurunan Akademik',
            'summary' => 'Nilai simulasi kejuruan dan matematika mengalami penurunan >20 poin dari rata-rata sebelumnya.',
            'risk_level' => 'medium',
            'is_action_taken' => false,
            'suggested_action' => 'Jadwalkan Konsultasi Belajar & Matrikulasi',
        ]);

        RiskAlert::updateOrCreate(['student_id' => $deni->id], [
            'trigger_type' => 'Risiko ATS (Drop-out)',
            'summary' => '3 pekan tidak hadir tanpa keterangan. Kunjungan lapangan pertama dijadwalkan oleh tim ATS.',
            'risk_level' => 'high',
            'is_action_taken' => false,
            'suggested_action' => 'Verifikasi Lapangan & Kunjungan Rumah',
        ]);

        // 4. Cases & Timelines (Modul 03)
        $case1 = StudentCase::updateOrCreate(['code' => 'CS-2025-089'], [
            'student_id' => $brian->id,
            'category' => 'Kedisiplinan',
            'priority' => 'Tinggi',
            'stage' => 'in_progress',
            'stage_label' => 'Sedang Ditangani',
            'assignee_name' => 'Ibu Rahmawati (Guru BK)',
            'last_activity' => 'Konseling sesi ke-2 selesai, dibuat surat komitmen bersama.',
        ]);

        CaseTimeline::updateOrCreate(['student_case_id' => $case1->id, 'title' => 'Case dibuat oleh Wali Kelas'], [
            'actor_name' => 'Wali Kelas XI RPL 2',
            'recorded_at' => '22 Sep 08:30',
        ]);
        CaseTimeline::updateOrCreate(['student_case_id' => $case1->id, 'title' => 'Ditugaskan ke Guru BK'], [
            'actor_name' => 'Koordinator BK',
            'recorded_at' => '22 Sep 10:00',
        ]);
        CaseTimeline::updateOrCreate(['student_case_id' => $case1->id, 'title' => 'Konseling tatap muka sesi 1'], [
            'actor_name' => 'Ibu Rahmawati (BK)',
            'recorded_at' => '23 Sep 13:00',
        ]);

        $case2 = StudentCase::updateOrCreate(['code' => 'CS-2025-090'], [
            'student_id' => $fauzan->id,
            'category' => 'Kedisiplinan',
            'priority' => 'Tinggi',
            'stage' => 'assigned',
            'stage_label' => 'Ditugaskan',
            'assignee_name' => 'Bpk. Faisal (BK)',
            'last_activity' => 'Menunggu penjadwalan mediasi dengan orang tua.',
        ]);

        CaseTimeline::updateOrCreate(['student_case_id' => $case2->id, 'title' => 'Laporan akumulasi pelanggaran masuk'], [
            'actor_name' => 'Kesiswaan',
            'recorded_at' => '23 Sep 11:20',
        ]);

        $case3 = StudentCase::updateOrCreate(['code' => 'CS-2025-091'], [
            'student_id' => $siti->id,
            'category' => 'Akademik',
            'priority' => 'Sedang',
            'stage' => 'follow_up',
            'stage_label' => 'Perlu Follow-up',
            'assignee_name' => 'Ibu Sri Wahyuni, S.E',
            'last_activity' => 'Jadwal matrikulasi perbaikan nilai praktik akuntansi.',
        ]);

        $case4 = StudentCase::updateOrCreate(['code' => 'CS-2025-092'], [
            'student_id' => $deni->id,
            'category' => 'Kehadiran',
            'priority' => 'Tinggi',
            'stage' => 'new',
            'stage_label' => 'Baru Masuk',
            'assignee_name' => 'Tim Satgas ATS',
            'last_activity' => 'Peringatan otomatis sistem: tidak hadir 3 pekan berturut-turut.',
        ]);

        // 5. Followups (DATA -> ACTION)
        Followup::updateOrCreate(['student_id' => $brian->id, 'type' => 'Panggilan Orang Tua'], [
            'student_case_id' => $case1->id,
            'assignee_name' => 'Hendra Setiawan, S.Pd',
            'note' => 'Koordinasi evaluasi kehadiran dan bimbingan belajar di rumah.',
            'status' => 'pending',
            'due_date' => '28 Sep 2025',
        ]);

        // 6. Parent Communications (Modul 04)
        ParentCommunication::updateOrCreate(['student_id' => $brian->id, 'category' => 'Notifikasi Kehadiran'], [
            'sender_name' => 'Hendra Setiawan, S.Pd (Wali Kelas)',
            'parent_name' => $brian->parent_name,
            'message' => 'Pemberitahuan ketidakhadiran ananda Brian Aditya pada hari Kamis tanpa surat keterangan izin.',
            'status' => 'Terkirim via WhatsApp & Tanggapin App',
            'acknowledgement' => 'Sudah membaca',
            'sent_at' => '24 Sep 08:15',
        ]);

        ParentCommunication::updateOrCreate(['student_id' => $fauzan->id, 'category' => 'Undangan Konsultasi BK'], [
            'sender_name' => 'Rahmawati, S.Pd (Guru BK)',
            'parent_name' => $fauzan->parent_name,
            'message' => 'Undangan diskusi pendampingan kedisiplinan siswa di ruang BK sekolah pada hari Jumat pukul 09.00 WIB.',
            'status' => 'Menunggu Respon',
            'acknowledgement' => 'Perlu ditindaklanjuti',
            'sent_at' => '24 Sep 10:30',
        ]);

        // 7. Discipline Records (Modul 05)
        DisciplineRecord::updateOrCreate(['student_id' => $fauzan->id, 'infraction' => 'Terlambat Masuk Sekolah (>15 menit)'], [
            'points' => 15,
            'action_status' => 'Sudah Dibina',
            'pattern_notes' => 'Terjadi 3x berurutan pada jam pertama hari Senin & Selasa.',
            'recorded_at' => '23 Sep 2025',
        ]);

        // 8. ATS Records (Modul 06)
        AtsRecord::updateOrCreate(['student_id' => $deni->id], [
            'status' => 'Kunjungan Terjadwal',
            'reason' => 'Kendala ekonomi dan membantu usaha orang tua di pasar.',
            'officer_name' => 'Bpk. Ahmad (Tim Satgas ATS)',
            'address' => $deni->address,
            'scheduled_visit' => '27 Sep 2025, 14:00 WIB',
        ]);

        // 9. Payments (Modul 07)
        SchoolPayment::updateOrCreate(['invoice_no' => 'INV-2025-09-001'], [
            'student_id' => $reza->id,
            'type' => 'SPP September 2025',
            'amount' => 350000,
            'due_date' => '10 Sep 2025',
            'status' => 'Terlambat',
        ]);

        SchoolPayment::updateOrCreate(['invoice_no' => 'INV-2025-09-002'], [
            'student_id' => $anisa->id,
            'type' => 'SPP September 2025',
            'amount' => 350000,
            'due_date' => '10 Sep 2025',
            'status' => 'Menunggu Verifikasi',
        ]);

        SchoolPayment::updateOrCreate(['invoice_no' => 'INV-2025-09-003'], [
            'student_id' => $siti->id,
            'type' => 'Uang Praktik Kejuruan',
            'amount' => 200000,
            'due_date' => '15 Sep 2025',
            'status' => 'Lunas',
            'paid_at' => '14 Sep 2025',
        ]);

        // 10. Teacher Documents (Modul 08)
        TeacherDocument::updateOrCreate(['title' => 'Modul Ajar Pemrograman Web & Bergerak'], [
            'teacher_name' => 'Hendra Setiawan, S.Pd',
            'category' => 'Perangkat Pembelajaran',
            'period' => '2025/2026 Ganjil',
            'status' => 'Lengkap',
            'file_size' => '2.4 MB',
        ]);

        TeacherDocument::updateOrCreate(['title' => 'SK Pembagian Tugas Guru & BK Semester Ganjil'], [
            'teacher_name' => 'Rahmawati, S.Pd',
            'category' => 'SK & Penugasan',
            'period' => '2025/2026 Ganjil',
            'status' => 'Lengkap',
            'file_size' => '1.1 MB',
        ]);

        TeacherDocument::updateOrCreate(['title' => 'Sertifikat Pelatihan Kurikulum Merdeka Terintegrasi'], [
            'teacher_name' => 'Dewi Sartika, M.Kom',
            'category' => 'Sertifikat Diklat',
            'period' => 'Agustus 2025',
            'status' => 'Terverifikasi',
            'file_size' => '850 KB',
        ]);

        // 11. Dapodik Issues (Modul 09)
        DapodikIssue::updateOrCreate(['target_name' => 'Drs. Subagyo (NIP. 19740512...)', 'field' => 'SK Pembina Ekstrakurikuler'], [
            'category' => 'Tugas Tambahan Guru',
            'description' => 'SK belum terunggah di riwayat penugasan semester ganjil.',
            'severity' => 'Error',
            'action' => 'Unggah dokumen SK & nomor referensi',
            'status' => 'open',
        ]);

        DapodikIssue::updateOrCreate(['target_name' => 'Farhan Alamsyah (NISN: 0078129381)', 'field' => 'NIK Orang Tua Kosong'], [
            'category' => 'Data Siswa',
            'description' => 'Data NIK Ayah dan Ibu belum terisi pada form registrasi awal.',
            'severity' => 'Perlu Diperiksa',
            'action' => 'Kirim reminder update data ke orang tua',
            'status' => 'open',
        ]);

        DapodikIssue::updateOrCreate(['target_name' => 'Kelas XI TKR 3', 'field' => 'Mata Pelajaran PKn Tanpa Pengampu'], [
            'category' => 'Rombongan Belajar',
            'description' => 'Jadwal rombel belum dipetakan ke guru mata pelajaran terdaftar.',
            'severity' => 'Error',
            'action' => 'Petakan guru pengampu di menu pembelajaran',
            'status' => 'open',
        ]);

        // 12. Incidents & Checklists (Modul 10)
        $incident = Incident::updateOrCreate(['title' => 'Prosedur Siaga Bencana Musim Hujan & Banjir Genangan'], [
            'type' => 'Cuaca Ekstrem',
            'status' => 'Siaga Aktif',
            'level' => 'Waspada',
            'lead_officer' => 'Bpk. Harun (Ketua Tim K3 & Tanggap Darurat)',
        ]);

        IncidentChecklist::updateOrCreate(['incident_id' => $incident->id, 'label' => 'Aktivasi Tim Tanggap Darurat Sekolah'], [
            'is_done' => true,
        ]);
        IncidentChecklist::updateOrCreate(['incident_id' => $incident->id, 'label' => 'Pemeriksaan Drainase Lapangan & Gedung B'], [
            'is_done' => true,
        ]);
        IncidentChecklist::updateOrCreate(['incident_id' => $incident->id, 'label' => 'Pengamanan Dokumen Arsip & Server di Lantai 2'], [
            'is_done' => true,
        ]);
        IncidentChecklist::updateOrCreate(['incident_id' => $incident->id, 'label' => 'Penyusunan Rute Alternatif Pulang Siswa'], [
            'is_done' => false,
        ]);
        IncidentChecklist::updateOrCreate(['incident_id' => $incident->id, 'label' => 'Broadcast Status Siaga ke Orang Tua & Guru'], [
            'is_done' => false,
        ]);
    }
}
