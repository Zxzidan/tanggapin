<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserManagementController;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Restrict public self-registration: Accounts are strictly managed and issued by the School Operator
Route::get('/register', function () {
    return redirect()->route('login')->with('status', 'Pendaftaran mandiri dinonaktifkan. Seluruh akun guru dan staf sekolah dibuat & dikontrol secara terpusat oleh Operator Sekolah.');
})->name('register');
Route::post('/register', function () {
    return redirect()->route('login')->with('status', 'Pendaftaran mandiri dinonaktifkan. Seluruh akun guru dan staf sekolah dibuat & dikontrol secara terpusat oleh Operator Sekolah.');
})->name('register.store');

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
        'kepala_sekolah' => 'Drs. H. Mulyadi, M.Pd',
        'operator' => 'Operator Sekolah',
        'wali_kelas' => 'Ratna Dewi, S.Pd',
        'guru_bk' => 'Dra. Hj. Nurjanah, M.Pd',
        'bendahara' => 'Ahmad Suhendra, S.E.',
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
            'raw_password' => 'password',
            'email_verified_at' => now(),
        ]);

    if (! $user->raw_password) {
        $user->raw_password = 'password';
        $user->save();
    }

    if ($role === 'wali_kelas' && ! $user->school_class_id) {
        $firstClass = SchoolClass::first();
        if ($firstClass) {
            $user->school_class_id = $firstClass->id;
            $user->save();
        }
    }

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
    Route::get('rapor-siswa', [DashboardController::class, 'raporSiswa'])->name('reports');

    // Operator Staff & Class Quota Management
    Route::get('kelola-pengguna', [UserManagementController::class, 'index'])->name('users.index');
    Route::post('kelola-pengguna', [UserManagementController::class, 'store'])->name('users.store');
    Route::put('kelola-pengguna/{user}', [UserManagementController::class, 'update'])->name('users.update');
    Route::delete('kelola-pengguna/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
    Route::post('kelola-pengguna/kelas', [UserManagementController::class, 'storeClass'])->name('users.storeClass');
    Route::post('kelola-pengguna/paket', [UserManagementController::class, 'updatePlan'])->name('users.updatePlan');

    Route::post('followups', [DashboardController::class, 'storeFollowup'])->name('followups.store');
    Route::post('cases', [DashboardController::class, 'storeCase'])->name('cases.store');
    Route::post('parent-communications', [DashboardController::class, 'storeParentCommunication'])->name('parent-communications.store');
    Route::post('discipline-records', [DashboardController::class, 'storeDisciplineRecord'])->name('discipline-records.store');
    Route::post('student-reports/generate', [DashboardController::class, 'generateAiReport'])->name('student-reports.generate');
    Route::post('student-reports/{report}/send', [DashboardController::class, 'sendReportToParent'])->name('student-reports.send');
});

require __DIR__.'/settings.php';
