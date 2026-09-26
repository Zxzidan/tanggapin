<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'role' => ['nullable', 'string', 'in:kepala_sekolah,operator,wali_kelas,guru_bk,bendahara'],
            'password' => $this->passwordRules(),
        ], [
            'role.in' => 'Peran yang dipilih tidak valid. Pilihan: Kepala Sekolah, Operator, Wali Kelas, Guru BK, atau Bendahara.',
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'role' => $input['role'] ?? 'wali_kelas',
            'password' => $input['password'],
        ]);
    }
}
