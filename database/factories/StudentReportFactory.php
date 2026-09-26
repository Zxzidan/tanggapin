<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\StudentReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StudentReport>
 */
class StudentReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'report_code' => 'RPR-'.fake()->unique()->numerify('2025-###'),
            'academic_period' => '2025/2026 Ganjil',
            'attendance_rate' => fake()->numberBetween(70, 98),
            'sick_count' => fake()->numberBetween(0, 3),
            'permission_count' => fake()->numberBetween(0, 2),
            'unexcused_count' => fake()->numberBetween(0, 4),
            'discipline_points' => fake()->numberBetween(0, 25),
            'discipline_status' => 'Tertib & Terbina',
            'ai_character_summary' => 'Siswa menunjukkan antusiasme yang baik dalam diskusi kelompok, namun membutuhkan dorongan konsistensi kehadiran dan disiplin jam masuk.',
            'ai_academic_notes' => 'Kompetensi kejuruan dan pemahaman logika teknis sangat baik. Perlu ditingkatkan ketepatan waktu pengumpulan portofolio.',
            'parent_recommendations' => 'Disarankan untuk mendampingi jadwal istirahat malam siswa dan memastikan komitmen belajar mandiri minimal 1 jam per hari di rumah.',
            'status' => 'generated',
            'sent_to_parent_at' => now()->format('d M H:i'),
            'parent_phone' => '+62 812-3456-7890',
            'parent_name' => fake()->name(),
            'delivery_channel' => 'WhatsApp Official & Tanggapin App',
            'acknowledgement_status' => 'Sudah Dibaca & Dikonfirmasi',
            'homeroom_teacher_name' => 'Wali Kelas XI RPL 2',
        ];
    }
}
