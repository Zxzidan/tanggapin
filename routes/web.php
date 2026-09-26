<?php

use App\Http\Controllers\DashboardController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/demo-login', function () {
    $user = User::first() ?? User::factory()->create([
        'name' => 'Neil Sims (Kepala Sekolah)',
        'email' => 'neil.sims@flowbite.com',
    ]);
    Auth::login($user);

    return redirect()->route('dashboard');
})->name('demo-login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
