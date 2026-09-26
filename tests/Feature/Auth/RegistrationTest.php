<?php

use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'role' => 'wali_kelas',
    ]);
});

test('users can register with specific roles', function (string $role) {
    $email = "{$role}@example.com";
    $response = $this->post(route('register.store'), [
        'name' => "User {$role}",
        'email' => $email,
        'role' => $role,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
    $this->assertDatabaseHas('users', [
        'email' => $email,
        'role' => $role,
    ]);
})->with([
    'kepala_sekolah',
    'operator',
    'wali_kelas',
    'guru_bk',
    'bendahara',
]);

test('users cannot register with invalid role', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Hacker User',
        'email' => 'hacker@example.com',
        'role' => 'super_admin',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['role']);
    $this->assertGuest();
});
