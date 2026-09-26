<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $defaultUsers = [
            [
                'name' => 'Drs. H. Mulyadi, M.Pd (Kepsek)',
                'email' => 'kepsek@smk1harapan.sch.id',
                'role' => 'kepala_sekolah',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Harun Ar-Rasyid (Operator)',
                'email' => 'operator@smk1harapan.sch.id',
                'role' => 'operator',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Hendra Setiawan, S.Pd (Wali Kelas)',
                'email' => 'walikelas@smk1harapan.sch.id',
                'role' => 'wali_kelas',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Rahmawati, S.Pd (Guru BK)',
                'email' => 'gurubk@smk1harapan.sch.id',
                'role' => 'guru_bk',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Siti Fatimah, S.E (Bendahara)',
                'email' => 'bendahara@smk1harapan.sch.id',
                'role' => 'bendahara',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Neil Sims - Kepala Sekolah',
                'email' => 'test@example.com',
                'role' => 'kepala_sekolah',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($defaultUsers as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->call(TanggapinSeeder::class);
    }
}
