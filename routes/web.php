<?php

use App\Http\Controllers\DashboardController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

use Illuminate\Http\Request;

Route::get('/demo-login', function (Request $request) {
    $role = $request->query('role', 'kepala_sekolah');
    $validRoles = ['kepala_sekolah', 'operator', 'wali_kelas', 'guru_bk', 'bendahara'];
    if (! in_array($role, $validRoles, true)) {
        $role = 'kepala_sekolah';
    }

    $roleEmails = [
        'kepala_sekolah' => 'kepsek@sekolah.sch.id',
        'operator' => 'operator@sekolah.sch.id',
        'wali_kelas' => 'walikelas@sekolah.sch.id',
        'guru_bk' => 'gurubk@sekolah.sch.id',
        'bendahara' => 'bendahara@sekolah.sch.id',
    ];

    $roleNames = [
        'kepala_sekolah' => 'Kepala Sekolah',
        'operator' => 'Operator Sekolah',
        'wali_kelas' => 'Wali Kelas',
        'guru_bk' => 'Guru BK',
        'bendahara' => 'Bendahara Sekolah',
    ];

    $email = $roleEmails[$role] ?? 'kepsek@sekolah.sch.id';
    $name = $roleNames[$role] ?? 'Kepala Sekolah';

    $user = User::where('role', $role)->first()
        ?? User::where('email', $email)->first()
        ?? User::create([
            'name' => $name,
            'email' => $email,
            'role' => $role,
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

    if ($user->name !== $name || $user->email !== $email) {
        $user->name = $name;
        $user->email = $email;
        $user->save();
    }

    if (! $user->email_verified_at) {
        $user->email_verified_at = now();
        $user->save();
    }

    Auth::login($user);

    return redirect()->route('dashboard');
})->name('demo-login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('early-warning', [DashboardController::class, 'earlyWarning'])->name('early-warning');
    Route::get('kondisi-kelas', [DashboardController::class, 'kondisiKelas'])->name('kondisi-kelas');
    Route::get('alur-ats', [DashboardController::class, 'alurAts'])->name('ats');
    Route::get('ats', fn () => redirect()->route('ats'));
    Route::get('manajemen-kasus', [DashboardController::class, 'manajemenKasus'])->name('cases');
    Route::get('komunikasi-ortu', [DashboardController::class, 'komunikasiOrtu'])->name('communication');
    Route::get('dapodik', [DashboardController::class, 'dapodik'])->name('dapodik');
    Route::get('pembayaran', [DashboardController::class, 'pembayaran'])->name('payments');
    Route::get('dokumen-guru', [DashboardController::class, 'dokumenGuru'])->name('documents');
    Route::get('respons-insiden', [DashboardController::class, 'responsInsiden'])->name('incidents');

    Route::post('followups', [DashboardController::class, 'storeFollowup'])->name('followups.store');
    Route::post('cases', [DashboardController::class, 'storeCase'])->name('cases.store');
    Route::post('parent-communications', [DashboardController::class, 'storeParentCommunication'])->name('parent-communications.store');
    Route::post('discipline-records', [DashboardController::class, 'storeDisciplineRecord'])->name('discipline-records.store');
});

require __DIR__.'/settings.php';
