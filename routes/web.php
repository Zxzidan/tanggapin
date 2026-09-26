<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;

Route::inertia('/', 'welcome')->name('home');

// Restrict public self-registration: Accounts are strictly managed and issued by the School Operator
Route::get('/register', function () {
    return redirect()->route('login')->with('status', 'Pendaftaran mandiri dinonaktifkan. Seluruh akun guru dan staf sekolah dibuat & dikontrol secara terpusat oleh Operator Sekolah.');
})->name('register');
Route::post('/register', function () {
    return redirect()->route('login')->with('status', 'Pendaftaran mandiri dinonaktifkan. Seluruh akun guru dan staf sekolah dibuat & dikontrol secara terpusat oleh Operator Sekolah.');
})->name('register.store');

// Accessible Login Routes: Allows login even if another tab in Chrome has an active session
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
$loginLimiter = config('fortify.limiters.login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware(array_filter([
        $loginLimiter ? 'throttle:'.$loginLimiter : null,
    ]))
    ->name('login.store');

Route::get('/demo-login', [DashboardController::class, 'switchRole'])->name('demo-login');

// Direct Application Role URLs (Instant access in 1 Chrome browser without logging out)
Route::get('/operator', [DashboardController::class, 'openOperator'])->name('role.operator');
Route::get('/guru-bk', [DashboardController::class, 'openGuruBk'])->name('role.guru-bk');
Route::get('/gurubk', fn () => redirect()->route('role.guru-bk'));
Route::get('/bk', fn () => redirect()->route('role.guru-bk'));
Route::get('/wali-kelas', [DashboardController::class, 'openWaliKelas'])->name('role.wali-kelas');
Route::get('/walikelas', fn () => redirect()->route('role.wali-kelas'));
Route::get('/wali-kelas/tkj', [DashboardController::class, 'openWaliKelasTkj'])->name('role.wali-kelas-tkj');
Route::get('/kepala-sekolah', [DashboardController::class, 'openKepalaSekolah'])->name('role.kepala-sekolah');
Route::get('/kepsek', fn () => redirect()->route('role.kepala-sekolah'));
Route::get('/bendahara', [DashboardController::class, 'openBendahara'])->name('role.bendahara');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('switch-role', [DashboardController::class, 'switchRole'])->name('role.switch');

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('early-warning', [DashboardController::class, 'earlyWarning'])->name('early-warning');
    Route::get('kondisi-kelas', [DashboardController::class, 'kondisiKelas'])->name('kondisi-kelas');
    Route::get('pemantau-atribut', [DashboardController::class, 'pemantauAtribut'])->name('attribute-scanner');
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
    Route::post('discipline-records/{record}/followup', [DashboardController::class, 'followUpDisciplineRecord'])->name('discipline-records.followup');
    Route::post('students', [DashboardController::class, 'storeStudent'])->name('students.store');
    Route::post('student-referrals', [DashboardController::class, 'storeReferralToBk'])->name('student-referrals.store');
    Route::post('cases/{studentCase}/handle-bk', [DashboardController::class, 'handleReferralByBk'])->name('cases.handle-bk');
    Route::post('student-reports/generate', [DashboardController::class, 'generateAiReport'])->name('student-reports.generate');
    Route::post('student-reports/{report}/send', [DashboardController::class, 'sendReportToParent'])->name('student-reports.send');
});

require __DIR__.'/settings.php';
