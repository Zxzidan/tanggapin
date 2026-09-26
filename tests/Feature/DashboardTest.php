<?php

use App\Models\Student;
use App\Models\User;
use Database\Seeders\TanggapinSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard with tanggapin operational data', function () {
    $this->seed(TanggapinSeeder::class);

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats')
            ->has('priorityFeed')
            ->has('classes')
            ->has('cases')
            ->has('atsList')
            ->has('paymentList')
            ->has('dapodikIssues')
            ->has('incidents')
            ->has('parentUpdates')
        );
});

test('authenticated users can store followups', function () {
    $this->seed(TanggapinSeeder::class);

    $user = User::factory()->create();
    $student = Student::first();

    $response = $this->actingAs($user)->post(route('followups.store'), [
        'student_id' => $student->id,
        'type' => 'Panggilan Orang Tua',
        'assignee_name' => 'Wali Kelas',
        'note' => 'Koordinasi perkembangan belajar.',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('followups', [
        'student_id' => $student->id,
        'type' => 'Panggilan Orang Tua',
    ]);
});

test('authenticated users can create a new student case', function () {
    $this->seed(TanggapinSeeder::class);

    $user = User::factory()->create();
    $student = Student::first();

    $response = $this->actingAs($user)->post(route('cases.store'), [
        'student_id' => $student->id,
        'category' => 'Kedisiplinan',
        'priority' => 'Tinggi',
        'last_activity' => 'Laporan masuk dari wali kelas.',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('student_cases', [
        'student_id' => $student->id,
        'category' => 'Kedisiplinan',
    ]);
});
