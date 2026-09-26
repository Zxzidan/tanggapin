<?php

namespace App\Http\Middleware;

use App\Models\SchoolClass;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AutoAuthenticateRole
{
    /**
     * Handle an incoming request.
     * Allows opening links with ?as=<role> or ?role=<role>
     * without having to log out first in a single Chrome browser.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $requested = $request->query('as') ?: $request->query('role') ?: $request->query('switch_role');

        if (! empty($requested) && is_string($requested)) {
            $this->authenticateAsRole($request, $requested);
        }

        return $next($request);
    }

    /**
     * Authenticate or switch to target role persona seamlessly.
     */
    public function authenticateAsRole(Request $request, string $requested): ?User
    {
        $normalized = strtolower(trim($requested));

        $roleMap = [
            'operator' => 'operator',
            'admin' => 'operator',
            'guru_bk' => 'guru_bk',
            'gurubk' => 'guru_bk',
            'bk' => 'guru_bk',
            'wali_kelas' => 'wali_kelas',
            'walikelas' => 'wali_kelas',
            'wali' => 'wali_kelas',
            'kepala_sekolah' => 'kepala_sekolah',
            'kepsek' => 'kepala_sekolah',
            'bendahara' => 'bendahara',
        ];

        $targetUser = null;

        if (filter_var($normalized, FILTER_VALIDATE_EMAIL)) {
            $targetUser = User::where('email', $normalized)->first();
        } else {
            $targetRole = $roleMap[$normalized] ?? null;
            if ($targetRole) {
                if ($targetRole === 'wali_kelas' && $request->query('kelas') === 'tkj') {
                    $targetUser = User::where('email', 'budi@sekolah.sch.id')->first();
                }

                if (! $targetUser) {
                    $targetUser = User::where('role', $targetRole)->first();
                }

                if (! $targetUser) {
                    $roleFallbacks = [
                        'operator' => ['name' => 'Operator Sekolah', 'email' => 'operator@sekolah.sch.id'],
                        'guru_bk' => ['name' => 'Dra. Hj. Nurjanah, M.Pd', 'email' => 'gurubk@sekolah.sch.id'],
                        'wali_kelas' => ['name' => 'Ratna Dewi, S.Pd', 'email' => 'walikelas@sekolah.sch.id'],
                        'kepala_sekolah' => ['name' => 'Drs. H. Mulyadi, M.Pd', 'email' => 'kepsek@sekolah.sch.id'],
                        'bendahara' => ['name' => 'Ahmad Suhendra, S.E.', 'email' => 'bendahara@sekolah.sch.id'],
                    ];

                    if (isset($roleFallbacks[$targetRole])) {
                        $fallback = $roleFallbacks[$targetRole];
                        $targetUser = User::create([
                            'name' => $fallback['name'],
                            'email' => $fallback['email'],
                            'role' => $targetRole,
                            'password' => bcrypt('password'),
                            'raw_password' => 'password',
                            'email_verified_at' => now(),
                        ]);

                        if ($targetRole === 'wali_kelas') {
                            $firstClass = SchoolClass::first();
                            if ($firstClass) {
                                $targetUser->school_class_id = $firstClass->id;
                                $targetUser->save();
                            }
                        }
                    }
                }
            }
        }

        if ($targetUser) {
            if (! Auth::check() || Auth::id() !== $targetUser->id) {
                Auth::login($targetUser);
                $request->session()->regenerate();
            }
        }

        return $targetUser;
    }
}
