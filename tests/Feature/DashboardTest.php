<?php

use App\Models\DisciplineRecord;
use App\Models\SchoolClass;
use App\Models\SchoolPayment;
use App\Models\SchoolSetting;
use App\Models\Student;
use App\Models\StudentCase;
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

test('operator is redirected away from clinical modules to manage users', function () {
    $this->seed(TanggapinSeeder::class);

    $operator = User::where('role', 'operator')->first();

    $this->actingAs($operator)->get(route('early-warning'))
        ->assertRedirect(route('users.index'))
        ->assertSessionHas('status');

    $this->actingAs($operator)->get(route('kondisi-kelas'))
        ->assertRedirect(route('users.index'))
        ->assertSessionHas('status');
});

test('guru bk can view all classes and homeroom teachers and add a new student', function () {
    $this->seed(TanggapinSeeder::class);

    $guruBk = User::where('role', 'guru_bk')->first();
    $class = SchoolClass::first();
    $initialTotal = $class->total_students;

    // BK visits kondisi-kelas
    $response = $this->actingAs($guruBk)->get(route('kondisi-kelas'));
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('kondisi-kelas')
            ->has('allClasses')
            ->has('students')
            ->has('disciplineList')
        );

    // BK adds a student
    $postResponse = $this->actingAs($guruBk)->post(route('students.store'), [
        'name' => 'Ahmad Santoso',
        'nisn' => '0098765432',
        'school_class_id' => $class->id,
        'gender' => 'L',
        'parent_name' => 'Bapak Santoso',
        'parent_phone' => '081234567890',
    ]);

    $postResponse->assertSessionHas('success');
    $this->assertDatabaseHas('students', [
        'name' => 'Ahmad Santoso',
        'nisn' => '0098765432',
        'school_class_id' => $class->id,
    ]);
    expect($class->fresh()->total_students)->toBe($initialTotal + 1);
});

test('guru bk can add discipline points which alert the wali kelas', function () {
    $this->seed(TanggapinSeeder::class);

    $guruBk = User::where('role', 'guru_bk')->first();
    $student = Student::first();

    $response = $this->actingAs($guruBk)->post(route('discipline-records.store'), [
        'student_id' => $student->id,
        'infraction' => 'Meninggalkan Kelas Tanpa Izin',
        'points' => 15,
        'pattern_notes' => 'Terjadi pada jam pelajaran ke-5',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('discipline_records', [
        'student_id' => $student->id,
        'infraction' => 'Meninggalkan Kelas Tanpa Izin',
        'points' => 15,
        'action_status' => 'Menunggu Tindak Lanjut Wali Kelas',
    ]);
    $this->assertDatabaseHas('risk_alerts', [
        'student_id' => $student->id,
        'trigger_type' => 'Poin Pelanggaran Guru BK',
    ]);
});

test('wali kelas can view student points and report obstacles to guru bk', function () {
    $this->seed(TanggapinSeeder::class);

    $waliRpl = User::where('email', 'walikelas@sekolah.sch.id')->first();
    $student = Student::where('school_class_id', $waliRpl->school_class_id)->first();

    // Wali Kelas reports obstacle to Guru BK
    $referralResponse = $this->actingAs($waliRpl)->post(route('student-referrals.store'), [
        'student_id' => $student->id,
        'category' => 'Motivasi Belajar',
        'priority' => 'Tinggi',
        'notes' => 'Siswa sering terlihat lesu dan tugas produktif belum terselesaikan 2 minggu berturut-turut.',
    ]);

    $referralResponse->assertSessionHas('success');
    $this->assertDatabaseHas('student_cases', [
        'student_id' => $student->id,
        'category' => 'Motivasi Belajar',
        'priority' => 'Tinggi',
        'assignee_name' => 'Koordinator Guru BK',
    ]);
});

test('wali kelas can follow up discipline record logged by guru bk', function () {
    $this->seed(TanggapinSeeder::class);

    $waliRpl = User::where('email', 'walikelas@sekolah.sch.id')->first();
    $student = Student::where('school_class_id', $waliRpl->school_class_id)->first();

    $record = DisciplineRecord::create([
        'student_id' => $student->id,
        'infraction' => 'Keterlambatan Berulang',
        'points' => 10,
        'action_status' => 'Menunggu Tindak Lanjut Wali Kelas',
        'pattern_notes' => 'Dicatat oleh Guru BK',
    ]);

    $followupResponse = $this->actingAs($waliRpl)->post(route('discipline-records.followup', $record), [
        'followup_notes' => 'Konseling kelas dan perjanjian tertulis didampingi wali kelas.',
    ]);

    $followupResponse->assertSessionHas('success');
    expect($record->fresh()->action_status)->toBe('Selesai Ditindaklanjuti Wali Kelas');
    expect($record->fresh()->pattern_notes)->toContain('Konseling kelas dan perjanjian');
});

test('authenticated user can switch role to operator and gets redirected to kelola pengguna', function () {
    $this->seed(TanggapinSeeder::class);

    $guruBk = User::where('role', 'guru_bk')->first();

    $response = $this->actingAs($guruBk)->post(route('role.switch'), [
        'role' => 'operator',
    ]);

    $response->assertRedirect(route('users.index'));
    $response->assertSessionHas('success');
    expect(auth()->user()->role)->toBe('operator');
});

test('authenticated user can switch role to guru bk and gets redirected to kondisi kelas', function () {
    $this->seed(TanggapinSeeder::class);

    $operator = User::where('role', 'operator')->first();

    $response = $this->actingAs($operator)->post(route('role.switch'), [
        'role' => 'guru_bk',
    ]);

    $response->assertRedirect(route('kondisi-kelas'));
    $response->assertSessionHas('success');
    expect(auth()->user()->role)->toBe('guru_bk');
});

test('authenticated user can switch to specific wali kelas persona with email', function () {
    $this->seed(TanggapinSeeder::class);

    $operator = User::where('role', 'operator')->first();

    $response = $this->actingAs($operator)->post(route('role.switch'), [
        'email' => 'budi@sekolah.sch.id',
    ]);

    $response->assertRedirect(route('kondisi-kelas'));
    $response->assertSessionHas('success');
    expect(auth()->user()->email)->toBe('budi@sekolah.sch.id');
    expect(auth()->user()->role)->toBe('wali_kelas');
});

test('demo-login route switches role and directs to tailored landing page', function () {
    $this->seed(TanggapinSeeder::class);

    $response = $this->get(route('demo-login', ['role' => 'operator']));
    $response->assertRedirect(route('users.index'));
    expect(auth()->user()->role)->toBe('operator');

    $responseBk = $this->get(route('demo-login', ['role' => 'guru_bk']));
    $responseBk->assertRedirect(route('kondisi-kelas'));
    expect(auth()->user()->role)->toBe('guru_bk');
});

test('direct role urls allow opening any role in 1 chrome browser without logging out first', function () {
    $this->seed(TanggapinSeeder::class);

    $guruBk = User::where('role', 'guru_bk')->first();
    $this->actingAs($guruBk);
    expect(auth()->user()->role)->toBe('guru_bk');

    // Open operator link while currently logged in as guru bk
    $resOperator = $this->get(route('role.operator'));
    $resOperator->assertRedirect(route('users.index'));
    expect(auth()->user()->role)->toBe('operator');

    // Open guru-bk link without logging out of operator
    $resBk = $this->get(route('role.guru-bk'));
    $resBk->assertRedirect(route('kondisi-kelas'));
    expect(auth()->user()->role)->toBe('guru_bk');

    // Open wali-kelas link
    $resWali = $this->get(route('role.wali-kelas'));
    $resWali->assertRedirect(route('kondisi-kelas'));
    expect(auth()->user()->role)->toBe('wali_kelas');
    expect(auth()->user()->email)->toBe('walikelas@sekolah.sch.id');

    // Open specific wali-kelas tkj link
    $resTkj = $this->get(route('role.wali-kelas-tkj'));
    $resTkj->assertRedirect(route('kondisi-kelas'));
    expect(auth()->user()->role)->toBe('wali_kelas');
    expect(auth()->user()->email)->toBe('budi@sekolah.sch.id');

    // Open kepala-sekolah link
    $resKepsek = $this->get(route('role.kepala-sekolah'));
    $resKepsek->assertRedirect(route('dashboard'));
    expect(auth()->user()->role)->toBe('kepala_sekolah');

    // Open bendahara link
    $resBendahara = $this->get(route('role.bendahara'));
    $resBendahara->assertRedirect(route('payments'));
    expect(auth()->user()->role)->toBe('bendahara');
});

test('query parameter ?as= or ?role= seamlessly auto-authenticates target role without logout', function () {
    $this->seed(TanggapinSeeder::class);

    $operator = User::where('role', 'operator')->first();
    $this->actingAs($operator);
    expect(auth()->user()->role)->toBe('operator');

    // Visit kondisi-kelas with ?as=guru_bk
    $response = $this->get(route('kondisi-kelas', ['as' => 'guru_bk']));
    $response->assertOk();
    expect(auth()->user()->role)->toBe('guru_bk');

    // Visit kondisi-kelas with ?as=wali_kelas
    $responseWali = $this->get(route('kondisi-kelas', ['as' => 'wali_kelas']));
    $responseWali->assertOk();
    expect(auth()->user()->role)->toBe('wali_kelas');
});

test('guru bk cannot create manual cases from scratch', function () {
    $this->seed(TanggapinSeeder::class);

    $guruBk = User::where('role', 'guru_bk')->first();
    $student = Student::first();

    $response = $this->actingAs($guruBk)->post(route('cases.store'), [
        'student_id' => $student->id,
        'category' => 'Kedisiplinan',
        'priority' => 'Tinggi',
        'last_activity' => 'Mencoba membuat kasus baru manual',
    ]);

    $response->assertSessionHasErrors('forbidden');
});

test('guru bk can handle referral reported by wali kelas and wali kelas dashboard tracks handled status', function () {
    $this->seed(TanggapinSeeder::class);

    $waliRpl = User::where('email', 'walikelas@sekolah.sch.id')->first();
    $guruBk = User::where('role', 'guru_bk')->first();
    $student = Student::where('school_class_id', $waliRpl->school_class_id)->first();

    // 1. Wali Kelas reports referral to Guru BK
    $referralResponse = $this->actingAs($waliRpl)->post(route('student-referrals.store'), [
        'student_id' => $student->id,
        'category' => 'Kedisiplinan & Perilaku',
        'priority' => 'Tinggi',
        'notes' => 'Siswa sering membolos pada jam produktif dan menolak kerja kelompok.',
    ]);
    $referralResponse->assertSessionHas('success');

    $case = StudentCase::where('student_id', $student->id)
        ->where('category', 'Kedisiplinan & Perilaku')
        ->first();
    expect($case)->not->toBeNull();
    expect($case->stage)->toBe('new');
    expect($case->stage_label)->toBe('Rujukan Masuk dari Wali Kelas');

    // 2. Guru BK handles the referral
    $handlingResponse = $this->actingAs($guruBk)->post(route('cases.handle-bk', $case), [
        'action_type' => 'Konseling Individu & Pemanggilan Orang Tua',
        'handling_notes' => 'Telah dilakukan konseling individu dan komitmen perbaikan kehadiran disepakati siswa bersama orang tua.',
    ]);
    $handlingResponse->assertSessionHas('success');

    $case->refresh();
    expect($case->stage)->toBe('handled_by_bk');
    expect($case->stage_label)->toBe('Sudah Ditangani oleh Guru BK');
    expect($case->handled_by_bk_name)->toBe($guruBk->name);
    expect($case->bk_action_type)->toBe('Konseling Individu & Pemanggilan Orang Tua');
    expect($case->bk_handling_notes)->toContain('Telah dilakukan konseling individu');
    expect($case->handled_at)->not->toBeNull();

    // 3. Wali Kelas dashboard tracks that it has been handled by Guru BK
    $dashboardResponse = $this->actingAs($waliRpl)->get(route('dashboard'));
    $dashboardResponse->assertOk();
    $dashboardResponse->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('cases')
        ->where('cases', fn ($cases) => collect($cases)->contains(function ($item) use ($case, $guruBk) {
            return $item['code'] === $case->code
                && $item['isHandledByBk'] === true
                && $item['stageLabel'] === 'Sudah Ditangani oleh Guru BK'
                && $item['handledByBkName'] === $guruBk->name
                && str_contains($item['bkHandlingNotes'], 'Telah dilakukan konseling individu');
        }))
    );
});

test('bendahara is strictly scoped to finance and can manage school payments', function () {
    $this->seed(TanggapinSeeder::class);

    $bendahara = User::where('role', 'bendahara')->first();
    $student = Student::first();

    // 1. Bendahara attempting to visit non-financial routes is redirected to payments
    $this->actingAs($bendahara)->get(route('dashboard'))->assertRedirect(route('payments'));
    $this->actingAs($bendahara)->get(route('early-warning'))->assertRedirect(route('payments'));
    $this->actingAs($bendahara)->get(route('kondisi-kelas'))->assertRedirect(route('payments'));
    $this->actingAs($bendahara)->get(route('cases'))->assertRedirect(route('payments'));

    // 2. Bendahara can access payments module with paymentList & students props
    $paymentResponse = $this->actingAs($bendahara)->get(route('payments'));
    $paymentResponse->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pembayaran')
            ->has('paymentList')
            ->has('students')
        );

    // 3. Bendahara can store a new payment
    $storeResponse = $this->actingAs($bendahara)->post(route('payments.store'), [
        'student_id' => $student->id,
        'type' => 'SPP Bulanan',
        'amount' => 350000,
        'due_date' => '10 Okt 2025',
        'status' => 'Belum Bayar',
    ]);
    $storeResponse->assertSessionHas('success');
    $this->assertDatabaseHas('school_payments', [
        'student_id' => $student->id,
        'amount' => 350000,
        'status' => 'Belum Bayar',
    ]);

    // 4. Bendahara can verify payment as Lunas
    $payment = SchoolPayment::where('student_id', $student->id)->where('status', 'Belum Bayar')->first();
    $verifyResponse = $this->actingAs($bendahara)->post(route('payments.verify', $payment));
    $verifyResponse->assertSessionHas('success');
    $payment->refresh();
    expect($payment->status)->toBe('Lunas');
    expect($payment->paid_at)->not->toBeNull();
});

test('kepala sekolah can access supervisi akademik, evaluasi sekolah, and persetujuan sekolah modules', function () {
    $this->seed(TanggapinSeeder::class);

    $kepsek = User::where('role', 'kepala_sekolah')->first();

    // 1. Supervisi Akademik
    $supervisionResponse = $this->actingAs($kepsek)->get(route('principal.supervision'));
    $supervisionResponse->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('supervisi-akademik')
            ->has('documents')
            ->has('teachers')
            ->has('classes')
        );

    // 2. Evaluasi Sekolah (Rapor Mutu)
    $evalResponse = $this->actingAs($kepsek)->get(route('principal.evaluation'));
    $evalResponse->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('evaluasi-sekolah')
            ->has('stats')
            ->has('classes')
        );

    // 3. Pusat Persetujuan & Disposisi
    $approvalResponse = $this->actingAs($kepsek)->get(route('principal.approvals'));
    $approvalResponse->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('persetujuan-sekolah')
            ->has('paymentList')
            ->has('cases')
            ->has('students')
        );

    // 4. Disposisi Persetujuan Action
    $dispositionResponse = $this->actingAs($kepsek)->post(route('principal.approvals.disposition'), [
        'type' => 'dispensasi',
        'reference_id' => 'DSP-001',
        'action' => 'approve',
        'notes' => 'Disetujui potongan 50% afirmasi SKTM.',
    ]);
    $dispositionResponse->assertSessionHas('status');
});
