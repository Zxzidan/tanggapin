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
                'name' => 'Kepala Sekolah',
                'email' => 'kepsek@sekolah.sch.id',
                'role' => 'kepala_sekolah',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Operator Sekolah',
                'email' => 'operator@sekolah.sch.id',
                'role' => 'operator',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Wali Kelas',
                'email' => 'walikelas@sekolah.sch.id',
                'role' => 'wali_kelas',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Guru BK',
                'email' => 'gurubk@sekolah.sch.id',
                'role' => 'guru_bk',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Bendahara Sekolah',
                'email' => 'bendahara@sekolah.sch.id',
                'role' => 'bendahara',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Administrator',
                'email' => 'admin@sekolah.sch.id',
                'role' => 'kepala_sekolah',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($defaultUsers as $userData) {
            User::updateOrCreate(
                ['role' => $userData['role']],
                $userData
            );
        }

        $this->call(TanggapinSeeder::class);
    }
}
