<?php

use App\Models\SchoolClass;
use App\Models\SchoolSetting;
use App\Models\Student;
use App\Models\StudentReport;
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

test('authenticated users can store a new discipline record', function () {
    $this->seed(TanggapinSeeder::class);

    $user = User::factory()->create();
    $student = Student::first();

    $response = $this->actingAs($user)->post(route('discipline-records.store'), [
        'student_id' => $student->id,
        'infraction' => 'Terlambat Masuk Sekolah',
        'points' => 10,
        'pattern_notes' => 'Terjadi saat apel pagi',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('discipline_records', [
        'student_id' => $student->id,
        'infraction' => 'Terlambat Masuk Sekolah',
        'points' => 10,
    ]);
});

test('authenticated users can view the student reports page with stats and student list', function () {
    $this->seed(TanggapinSeeder::class);

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('reports'));
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('rapor-siswa')
            ->has('students')
            ->has('stats')
        );
});

test('authenticated users can generate an AI student report card', function () {
    $this->seed(TanggapinSeeder::class);

    $user = User::factory()->create();
    $student = Student::first();

    $response = $this->actingAs($user)->post(route('student-reports.generate'), [
        'student_id' => $student->id,
        'period' => '2025/2026 Ganjil',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('student_reports', [
        'student_id' => $student->id,
        'academic_period' => '2025/2026 Ganjil',
        'status' => 'generated',
    ]);
});

test('authenticated users can send a student report to parent via whatsapp', function () {
    $this->seed(TanggapinSeeder::class);

    $user = User::factory()->create();
    $student = Student::first();

    // First generate report
    $this->actingAs($user)->post(route('student-reports.generate'), [
        'student_id' => $student->id,
        'period' => '2025/2026 Ganjil',
    ]);

    $report = StudentReport::where('student_id', $student->id)->first();

    $response = $this->actingAs($user)->post(route('student-reports.send', $report));

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('student_reports', [
        'id' => $report->id,
        'status' => 'sent',
    ]);
    $this->assertDatabaseHas('parent_communications', [
        'student_id' => $student->id,
        'category' => 'Rapor Perkembangan Siswa',
    ]);
});

test('public self-registration is redirected to login with central operator notice', function () {
    $response = $this->get('/register');
    $response->assertRedirect(route('login'));
    $response->assertSessionHas('status');
});

test('operator can view user management page with staff list and quota info', function () {
    $this->seed(TanggapinSeeder::class);

    $operator = User::where('role', 'operator')->first();

    $response = $this->actingAs($operator)->get(route('users.index'));
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('kelola-pengguna')
            ->has('users')
            ->has('classes')
            ->has('quota')
            ->where('quota.maxClasses', 35)
        );
});

test('non-operator cannot access staff user management', function () {
    $this->seed(TanggapinSeeder::class);

    $waliKelas = User::where('role', 'wali_kelas')->first();

    $response = $this->actingAs($waliKelas)->get(route('users.index'));
    $response->assertForbidden();
});

test('operator can create a new staff account with assigned class for wali kelas', function () {
    $this->seed(TanggapinSeeder::class);

    $operator = User::where('role', 'operator')->first();
    $class = SchoolClass::first();

    $response = $this->actingAs($operator)->post(route('users.store'), [
        'name' => 'Guru Baru, S.Pd',
        'email' => 'gurubaru@sekolah.sch.id',
        'role' => 'wali_kelas',
        'school_class_id' => $class->id,
        'password' => 'secret12345',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('users', [
        'name' => 'Guru Baru, S.Pd',
        'email' => 'gurubaru@sekolah.sch.id',
        'role' => 'wali_kelas',
        'school_class_id' => $class->id,
    ]);

    $createdUser = User::where('email', 'gurubaru@sekolah.sch.id')->first();
    expect($createdUser->raw_password)->toBe('secret12345');
});

test('operator can view saved staff password and update it', function () {
    $this->seed(TanggapinSeeder::class);

    $operator = User::where('role', 'operator')->first();
    $waliKelas = User::where('email', 'walikelas@sekolah.sch.id')->first();
    expect($waliKelas->raw_password)->toBe('password');

    // Operator accesses user management page and receives rawPassword
    $response = $this->actingAs($operator)->get(route('users.index'));
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('kelola-pengguna')
            ->where('users.0.rawPassword', fn ($pass) => ! empty($pass))
        );

    // Operator updates staff password
    $updateResponse = $this->actingAs($operator)->put(route('users.update', $waliKelas), [
        'name' => $waliKelas->name,
        'email' => $waliKelas->email,
        'role' => $waliKelas->role,
        'school_class_id' => $waliKelas->school_class_id,
        'password' => 'newSecretPassword2026',
    ]);

    $updateResponse->assertSessionHas('success');
    expect($waliKelas->fresh()->raw_password)->toBe('newSecretPassword2026');
});

test('wali kelas can only view students in their assigned class', function () {
    $this->seed(TanggapinSeeder::class);

    $classRpl = SchoolClass::where('name', 'XI RPL 2')->first();
    $classTkj = SchoolClass::where('name', 'X TKJ 1')->first();

    $waliRpl = User::where('email', 'walikelas@sekolah.sch.id')->first();

    $response = $this->actingAs($waliRpl)->get(route('reports'));
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('rapor-siswa')
            ->has('students', 3) // Only 3 students in XI RPL 2, not the students in X TKJ 1
        );
});

test('wali kelas cannot generate ai report for student in another class', function () {
    $this->seed(TanggapinSeeder::class);

    $classTkj = SchoolClass::where('name', 'X TKJ 1')->first();
    $tkjStudent = Student::where('school_class_id', $classTkj->id)->first();

    $waliRpl = User::where('email', 'walikelas@sekolah.sch.id')->first();

    $response = $this->actingAs($waliRpl)->post(route('student-reports.generate'), [
        'student_id' => $tkjStudent->id,
        'period' => '2025/2026 Ganjil',
    ]);

    $response->assertSessionHasErrors('unauthorized');
});

test('class limit is enforced on paket unggulan and unlimited on yayasan', function () {
    $this->seed(TanggapinSeeder::class);

    $setting = SchoolSetting::current();
    expect($setting->max_classes)->toBe(35);
    expect($setting->isClassLimitReached())->toBeFalse();

    // Switch to yayasan
    $setting->update(['subscription_plan' => 'yayasan', 'max_classes' => null]);
    expect($setting->getClassLimit())->toBeNull();
    expect($setting->isClassLimitReached())->toBeFalse();
});
