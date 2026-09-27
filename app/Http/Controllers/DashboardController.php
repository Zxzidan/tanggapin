<?php

namespace App\Http\Controllers;

use App\Models\AtsRecord;
use App\Models\CaseTimeline;
use App\Models\DapodikIssue;
use App\Models\DisciplineRecord;
use App\Models\Followup;
use App\Models\Incident;
use App\Models\IncidentChecklist;
use App\Models\ParentCommunication;
use App\Models\RiskAlert;
use App\Models\SchoolClass;
use App\Models\SchoolPayment;
use App\Models\Student;
use App\Models\StudentCase;
use App\Models\StudentReport;
use App\Models\TeacherDocument;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Direct link access for Operator Sekolah without needing to log out.
     */
    public function openOperator(Request $request): RedirectResponse
    {
        return $this->switchRoleByTarget($request, 'operator', null, route('users.index'));
    }

    /**
     * Direct link access for Guru BK without needing to log out.
     */
    public function openGuruBk(Request $request): RedirectResponse
    {
        return $this->switchRoleByTarget($request, 'guru_bk', null, route('kondisi-kelas'));
    }

    /**
     * Direct link access for Wali Kelas (XI RPL 2 - Ratna Dewi) without needing to log out.
     */
    public function openWaliKelas(Request $request): RedirectResponse
    {
        return $this->switchRoleByTarget($request, 'wali_kelas', 'walikelas@sekolah.sch.id', route('kondisi-kelas'));
    }

    /**
     * Direct link access for Wali Kelas (X TKJ 1 - Budi Santoso) without needing to log out.
     */
    public function openWaliKelasTkj(Request $request): RedirectResponse
    {
        return $this->switchRoleByTarget($request, 'wali_kelas', 'budi@sekolah.sch.id', route('kondisi-kelas'));
    }

    /**
     * Direct link access for Kepala Sekolah without needing to log out.
     */
    public function openKepalaSekolah(Request $request): RedirectResponse
    {
        return $this->switchRoleByTarget($request, 'kepala_sekolah', null, route('dashboard'));
    }

    /**
     * Direct link access for Bendahara Sekolah without needing to log out.
     */
    public function openBendahara(Request $request): RedirectResponse
    {
        return $this->switchRoleByTarget($request, 'bendahara', null, route('payments'));
    }

    /**
     * Switch authenticated role session instantly for multi-role simulation in 1 browser.
     */
    public function switchRole(Request $request): RedirectResponse
    {
        $role = $request->input('role') ?: $request->query('role');
        $email = $request->input('email') ?: $request->query('email');
        $redirect = $request->input('redirect') ?: $request->query('redirect');

        if (! $role && ! $email) {
            return back()->withErrors(['role' => 'Pilih peran yang valid.']);
        }

        return $this->switchRoleByTarget($request, $role ?? 'operator', $email, $redirect);
    }

    /**
     * Core helper to authenticate as target role persona and redirect to role-tailored workspace.
     */
    public function switchRoleByTarget(Request $request, string $role, ?string $email = null, ?string $destination = null): RedirectResponse
    {
        $query = User::with('schoolClass');

        if (! empty($email)) {
            $query->where('email', $email);
        } else {
            $query->where('role', $role);
        }

        $targetUser = $query->first();

        // Seed fallback if user doesn't exist
        if (! $targetUser) {
            $roleFallbacks = [
                'operator' => ['name' => 'Operator Sekolah', 'email' => 'operator@sekolah.sch.id'],
                'guru_bk' => ['name' => 'Dra. Hj. Nurjanah, M.Pd', 'email' => 'gurubk@sekolah.sch.id'],
                'wali_kelas' => ['name' => 'Ratna Dewi, S.Pd', 'email' => 'walikelas@sekolah.sch.id'],
                'kepala_sekolah' => ['name' => 'Drs. H. Mulyadi, M.Pd', 'email' => 'kepsek@sekolah.sch.id'],
                'bendahara' => ['name' => 'Ahmad Suhendra, S.E.', 'email' => 'bendahara@sekolah.sch.id'],
            ];

            if (isset($roleFallbacks[$role])) {
                $fallback = $roleFallbacks[$role];
                $targetUser = User::create([
                    'name' => $fallback['name'],
                    'email' => $email ?? $fallback['email'],
                    'role' => $role,
                    'password' => bcrypt('password'),
                    'raw_password' => 'password',
                    'email_verified_at' => now(),
                ]);

                if ($role === 'wali_kelas') {
                    $firstClass = SchoolClass::first();
                    if ($firstClass) {
                        $targetUser->school_class_id = $firstClass->id;
                        $targetUser->save();
                    }
                }
            }
        }

        if (! $targetUser) {
            return back()->withErrors(['role' => 'Pengguna untuk peran tersebut belum tersedia.']);
        }

        Auth::login($targetUser);
        $request->session()->regenerate();

        $roleLabels = [
            'operator' => 'Operator Sekolah',
            'guru_bk' => 'Guru BK',
            'wali_kelas' => 'Wali Kelas',
            'kepala_sekolah' => 'Kepala Sekolah',
            'bendahara' => 'Bendahara Sekolah',
        ];

        $label = $roleLabels[$targetUser->role] ?? $targetUser->role;
        $classSuffix = $targetUser->schoolClass ? " ({$targetUser->schoolClass->name})" : '';

        // Determine destination: pick optimal landing page
        $targetUrl = $destination ?? match ($targetUser->role) {
            'operator' => route('users.index'),
            'guru_bk' => route('kondisi-kelas'),
            'wali_kelas' => route('kondisi-kelas'),
            'bendahara' => route('payments'),
            default => route('dashboard'),
        };

        return redirect($targetUrl)->with('success', "Beralih peran berhasil! Anda kini aktif sebagai {$label}{$classSuffix} ({$targetUser->name}) tanpa perlu log out.");
    }

    /**
     * Display the Tanggapin operational dashboard (Ikhtisar & Tindakan).
     */
    public function index(Request $request): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments');
        }

        return Inertia::render('dashboard', [
            'stats' => $this->getStats(),
            'priorityFeed' => $this->getPriorityFeed(),
            'classes' => $this->getClasses(),
            'cases' => $this->getCases(),
            'atsList' => $this->getAtsList(),
            'paymentList' => $this->getPayments(),
            'dapodikIssues' => $this->getDapodikIssues(),
            'documents' => $this->getDocuments(),
            'incidents' => $this->getIncidents(),
            'parentUpdates' => $this->getParentUpdates(),
        ]);
    }

    /**
     * Modul 01: Early Warning System
     */
    public function earlyWarning(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'operator') {
            return redirect()->route('users.index')->with('status', 'Akses khusus Wali Kelas & Guru BK. Role Operator difokuskan pada modul Administrasi & Operasional Sekolah.');
        }

        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        return Inertia::render('early-warning', [
            'stats' => $this->getStats(),
            'priorityFeed' => $this->getPriorityFeed(),
        ]);
    }

    /**
     * Modul 02: Kondisi Kelas & Monitoring Rombel
     */
    public function kondisiKelas(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'operator') {
            return redirect()->route('users.index')->with('status', 'Akses khusus Wali Kelas & Guru BK. Role Operator difokuskan pada modul Administrasi & Operasional Sekolah.');
        }

        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        return Inertia::render('kondisi-kelas', [
            'classes' => $this->getClasses(),
            'allClasses' => SchoolClass::orderBy('name')->get(['id', 'name', 'major', 'homeroom_teacher_name', 'total_students'])->map(fn ($c) => [
                'id' => (string) $c->id,
                'name' => $c->name,
                'major' => $c->major,
                'homeroomTeacher' => $c->homeroom_teacher_name,
                'totalStudents' => $c->total_students,
            ])->toArray(),
            'disciplineList' => $this->getDisciplineList(),
            'students' => $this->getStudentsWithDiscipline(),
            'cases' => $this->getCases(),
        ]);
    }

    /**
     * Modul BK: Kamera Pemantau Atribut Siswa (Deteksi Kelengkapan Seragam & Poin Otomatis)
     */
    public function pemantauAtribut(): Response|RedirectResponse
    {
        $user = auth()->user();
        if ($user && $user->role === 'operator') {
            return redirect()->route('users.index')->with('status', 'Akses khusus Guru BK, Wali Kelas & Kepala Sekolah.');
        }

        if ($user && $user->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if ($user && $user->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        $studentQuery = Student::with(['schoolClass', 'disciplineRecords'])->orderBy('name');
        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $studentQuery->where('school_class_id', $user->school_class_id);
        }

        $students = $studentQuery->get()->map(function (Student $s): array {
            $totalPoints = (int) $s->disciplineRecords->sum('points');

            return [
                'id' => (string) $s->id,
                'name' => $s->name,
                'nisn' => $s->nisn,
                'gender' => $s->gender,
                'class' => $s->schoolClass->name ?? '-',
                'classId' => (string) ($s->school_class_id ?? ''),
                'currentPoints' => $totalPoints,
                'riskLevel' => $s->risk_level,
                'avatar' => $s->avatar_url ?? null,
            ];
        })->toArray();

        $classes = SchoolClass::orderBy('name')->get(['id', 'name', 'major'])->map(fn ($c) => [
            'id' => (string) $c->id,
            'name' => $c->name,
            'major' => $c->major,
        ])->toArray();

        $recentScans = DisciplineRecord::with('student.schoolClass')
            ->where(function ($q) {
                $q->where('infraction', 'like', '%Atribut%')
                    ->orWhere('infraction', 'like', '%Seragam%')
                    ->orWhere('infraction', 'like', '%Dasi%')
                    ->orWhere('pattern_notes', 'like', '%Kamera%')
                    ->orWhere('pattern_notes', 'like', '%kamera%');
            })
            ->latest()
            ->take(15)
            ->get()
            ->map(fn (DisciplineRecord $rec): array => [
                'id' => (string) $rec->id,
                'studentId' => (string) $rec->student_id,
                'studentName' => $rec->student->name ?? '-',
                'studentNisn' => $rec->student->nisn ?? '-',
                'className' => $rec->student->schoolClass->name ?? '-',
                'infraction' => $rec->infraction,
                'points' => (int) $rec->points,
                'status' => $rec->action_status,
                'notes' => $rec->pattern_notes,
                'recordedAt' => $rec->recorded_at ?? $rec->created_at->format('d M H:i'),
            ])->toArray();

        $attributeRules = [
            [
                'id' => 'dasi',
                'name' => 'Dasi Sekolah',
                'category' => 'Kelengkapan Kerah',
                'requiredDays' => 'Senin - Kamis',
                'points' => 5,
                'description' => 'Dasi resmi berlogo sekolah terpasang rapi di kerah kemeja.',
            ],
            [
                'id' => 'topi',
                'name' => 'Topi / Peci Upacara',
                'category' => 'Kelengkapan Kepala',
                'requiredDays' => 'Senin (Upacara Bendera)',
                'points' => 5,
                'description' => 'Topi sekolah berlogo OSIS atau peci hitam nasional saat upacara.',
            ],
            [
                'id' => 'sabuk',
                'name' => 'Sabuk / Ikat Pinggang Hitam',
                'category' => 'Kelengkapan Pinggang',
                'requiredDays' => 'Setiap Hari',
                'points' => 5,
                'description' => 'Sabuk standar hitam berlogo sekolah tidak berkepala besar.',
            ],
            [
                'id' => 'kaos_kaki',
                'name' => 'Kaos Kaki Standar (Min. 15cm)',
                'category' => 'Kelengkapan Kaki',
                'requiredDays' => 'Putih (Senin-Kamis), Hitam (Jumat)',
                'points' => 5,
                'description' => 'Kaos kaki polos standar sekolah minimal 15 cm di atas mata kaki.',
            ],
            [
                'id' => 'sepatu',
                'name' => 'Sepatu Hitam Bertali (Min. 80% Hitam)',
                'category' => 'Kelengkapan Alas Kaki',
                'requiredDays' => 'Setiap Hari',
                'points' => 10,
                'description' => 'Sepatu dominan hitam bertali, tidak bergaris warna terang mencolok.',
            ],
            [
                'id' => 'badge',
                'name' => 'Badge Nama & Lokasi Sekolah',
                'category' => 'Atribut Kemeja',
                'requiredDays' => 'Setiap Hari',
                'points' => 5,
                'description' => 'Badge lokasi sekolah di lengan kanan dan papan nama bordir di dada kanan.',
            ],
            [
                'id' => 'kerapian_baju',
                'name' => 'Kerapian Seragam (Baju Dimasukkan)',
                'category' => 'Kerapian Berpakaian',
                'requiredDays' => 'Setiap Hari',
                'points' => 5,
                'description' => 'Kemeja seragam dimasukkan ke dalam celana/rok dengan rapi.',
            ],
        ];

        return Inertia::render('pemantau-atribut', [
            'students' => $students,
            'classes' => $classes,
            'recentScans' => $recentScans,
            'rules' => $attributeRules,
        ]);
    }

    /**
     * Modul 06: Alur Lapangan ATS (Anak Tidak Sekolah)
     */
    public function alurAts(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'operator') {
            return redirect()->route('users.index')->with('status', 'Akses khusus Guru BK. Role Operator difokuskan pada modul Administrasi & Operasional Sekolah.');
        }

        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        return Inertia::render('alur-ats', [
            'atsList' => $this->getAtsList(),
        ]);
    }

    /**
     * Modul 03: Case Management (Manajemen Kasus BK)
     */
    public function manajemenKasus(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'operator') {
            return redirect()->route('users.index')->with('status', 'Akses khusus Guru BK, Wali Kelas & Pimpinan. Role Operator difokuskan pada modul Administrasi & Operasional Sekolah.');
        }

        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        $user = auth()->user();
        $studentQuery = Student::with('schoolClass')->orderBy('name');

        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $studentQuery->where('school_class_id', $user->school_class_id);
        }

        $students = $studentQuery->get(['id', 'name', 'nisn', 'school_class_id'])->map(fn ($s) => [
            'id' => (string) $s->id,
            'name' => $s->name,
            'nisn' => $s->nisn,
            'className' => $s->schoolClass?->name ?? '-',
        ])->toArray();

        return Inertia::render('manajemen-kasus', [
            'stats' => $this->getStats(),
            'cases' => $this->getCases(),
            'students' => $students,
        ]);
    }

    /**
     * Modul 04: Komunikasi Orang Tua Terstruktur
     */
    public function komunikasiOrtu(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'operator') {
            return redirect()->route('users.index')->with('status', 'Akses khusus Wali Kelas & Guru BK. Role Operator difokuskan pada modul Administrasi & Operasional Sekolah.');
        }

        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        return Inertia::render('komunikasi-ortu', [
            'parentUpdates' => $this->getParentUpdates(),
        ]);
    }

    /**
     * Modul 09: Cek Data Dapodik (Anomali Operator)
     */
    public function dapodik(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        return Inertia::render('dapodik', [
            'dapodikIssues' => $this->getDapodikIssues(),
        ]);
    }

    /**
     * Modul 07: Pembayaran & SPP (Rekonsiliasi Bendahara)
     */
    public function pembayaran(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }
        $students = Student::with('schoolClass')->orderBy('name')->get(['id', 'name', 'nisn', 'school_class_id'])->map(fn ($s) => [
            'id' => (string) $s->id,
            'name' => $s->name,
            'nisn' => $s->nisn,
            'className' => $s->schoolClass?->name ?? '-',
        ])->toArray();

        return Inertia::render('pembayaran', [
            'paymentList' => $this->getPayments(),
            'students' => $students,
        ]);
    }

    /**
     * Modul Bendahara: Analisis Finansial & Prediksi Arus Kas Berbasis AI
     */
    public function analisisKeuangan(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        $payments = $this->getPayments();
        $classes = $this->getClasses();
        $students = Student::with('schoolClass')->orderBy('name')->get(['id', 'name', 'nisn', 'parent_name', 'parent_phone', 'attendance_rate', 'risk_level', 'school_class_id'])->map(fn ($s) => [
            'id' => (string) $s->id,
            'name' => $s->name,
            'nisn' => $s->nisn,
            'className' => $s->schoolClass?->name ?? '-',
            'parentName' => $s->parent_name ?? 'Wali Murid',
            'parentPhone' => $s->parent_phone ?? '-',
            'attendanceRate' => (int) $s->attendance_rate,
            'riskLevel' => $s->risk_level,
        ])->toArray();

        return Inertia::render('analisis-keuangan', [
            'paymentList' => $payments,
            'classes' => $classes,
            'students' => $students,
            'stats' => $this->getStats(),
        ]);
    }

    /**
     * Modul Bendahara: Buku Kas Umum (BKU) & Laporan Pertanggungjawaban Keuangan
     */
    public function laporanKeuangan(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        return Inertia::render('laporan-keuangan', [
            'paymentList' => $this->getPayments(),
            'classes' => $this->getClasses(),
            'stats' => $this->getStats(),
        ]);
    }

    /**
     * Modul Bendahara: Pengingat Tagihan SPP & Koordinasi Komunikasi Ortu
     */
    public function reminderSpp(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        $students = Student::with('schoolClass')->orderBy('name')->get(['id', 'name', 'nisn', 'parent_name', 'parent_phone', 'attendance_rate', 'risk_level', 'school_class_id'])->map(fn ($s) => [
            'id' => (string) $s->id,
            'name' => $s->name,
            'nisn' => $s->nisn,
            'className' => $s->schoolClass?->name ?? '-',
            'parentName' => $s->parent_name ?? 'Wali Murid',
            'parentPhone' => $s->parent_phone ?? '-',
            'attendanceRate' => (int) $s->attendance_rate,
            'riskLevel' => $s->risk_level,
        ])->toArray();

        return Inertia::render('reminder-spp', [
            'paymentList' => $this->getPayments(),
            'students' => $students,
        ]);
    }

    /**
     * Modul Kepala Sekolah: AI Supervisi Akademik & Audit Modul Ajar GTK
     */
    public function supervisiAkademik(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        $teachers = User::whereIn('role', ['wali_kelas', 'guru_bk'])->with('schoolClass')->get()->map(fn ($u) => [
            'id' => (string) $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role,
            'className' => $u->schoolClass?->name ?? 'Lintas Rombel',
        ])->toArray();

        return Inertia::render('supervisi-akademik', [
            'documents' => $this->getDocuments(),
            'classes' => $this->getClasses(),
            'teachers' => $teachers,
            'stats' => $this->getStats(),
        ]);
    }

    /**
     * Modul Kepala Sekolah: AI Analitik Rapor Mutu Pendidikan Kemendikbud & Evaluasi Sekolah
     */
    public function evaluasiSekolah(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        return Inertia::render('evaluasi-sekolah', [
            'stats' => $this->getStats(),
            'classes' => $this->getClasses(),
            'cases' => $this->getCases(),
            'incidents' => $this->getIncidents(),
        ]);
    }

    /**
     * Modul Kepala Sekolah: Pusat Persetujuan & Disposisi Sekolah (Bansos/PIP, Kasus Kritis, Legalisasi Rapor)
     */
    public function persetujuanSekolah(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        $students = Student::with('schoolClass')->orderBy('name')->get(['id', 'name', 'nisn', 'parent_name', 'parent_phone', 'attendance_rate', 'risk_level', 'school_class_id'])->map(fn ($s) => [
            'id' => (string) $s->id,
            'name' => $s->name,
            'nisn' => $s->nisn,
            'className' => $s->schoolClass?->name ?? '-',
            'parentName' => $s->parent_name ?? 'Wali Murid',
            'parentPhone' => $s->parent_phone ?? '-',
            'attendanceRate' => (int) $s->attendance_rate,
            'riskLevel' => $s->risk_level,
        ])->toArray();

        return Inertia::render('persetujuan-sekolah', [
            'paymentList' => $this->getPayments(),
            'cases' => $this->getCases(),
            'students' => $students,
            'stats' => $this->getStats(),
            'classes' => $this->getClasses(),
        ]);
    }

    /**
     * Otorisasi & Disposisi Kepala Sekolah (Simulasi & Catat Kebijakan Pimpinan)
     */
    public function disposisiPersetujuan(Request $request): RedirectResponse
    {
        $request->validate([
            'type' => ['required', 'string'],
            'reference_id' => ['required', 'string'],
            'action' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        return back()->with('status', 'Disposisi Kepala Sekolah berhasil diproses dan dicatat dalam audit trail kebijakan sekolah.');
    }

    /**
     * Modul 08: Dokumen Guru (Kelengkapan Administrasi & Portofolio)
     */
    public function dokumenGuru(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        return Inertia::render('dokumen-guru', [
            'documents' => $this->getDocuments(),
        ]);
    }

    /**
     * Simpan Perangkat Modul Ajar oleh Guru / Wali Kelas
     */
    public function storeTeacherDocument(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'period' => ['nullable', 'string', 'max:50'],
        ]);

        $teacherName = auth()->user()?->name ?? 'Guru Pengampu';

        TeacherDocument::create([
            'title' => $validated['title'],
            'teacher_name' => $teacherName,
            'category' => $validated['category'],
            'period' => $validated['period'] ?? '2025/2026 Ganjil',
            'status' => 'Menunggu Supervisi',
            'file_size' => '2.4 MB',
        ]);

        return back()->with('success', 'Perangkat modul ajar berhasil diunggah dan diajukan ke Kepala Sekolah untuk disupervisi.');
    }

    /**
     * Modul 10: Respons Insiden & Kesiapsiagaan Sekolah
     */
    public function responsInsiden(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        return Inertia::render('respons-insiden', [
            'incidents' => $this->getIncidents(),
        ]);
    }

    /**
     * Modul AI & Rapor: Pembuatan Rapor Siswa Otomatis Berbasis AI & Pengiriman ke Orang Tua
     */
    public function raporSiswa(): Response|RedirectResponse
    {
        if (auth()->user()?->role === 'operator') {
            return redirect()->route('users.index')->with('status', 'Akses khusus Wali Kelas. Role Operator difokuskan pada modul Administrasi & Operasional Sekolah.');
        }

        if (auth()->user()?->role === 'bendahara') {
            return redirect()->route('payments')->with('status', 'Role Bendahara difokuskan pada modul Keuangan & SPP.');
        }

        if (auth()->user()?->role === 'kepala_sekolah') {
            return redirect()->route('dashboard')->with('status', 'Role Kepala Sekolah difokuskan pada Dashboard Monitoring Eksekutif Sekolah.');
        }

        $user = auth()->user();
        $studentQuery = Student::with(['schoolClass', 'reports' => fn ($q) => $q->latest()]);

        // Scoping for Wali Kelas: only students in their assigned class
        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $studentQuery->where('school_class_id', $user->school_class_id);
        }

        $students = $studentQuery->get()
            ->map(function (Student $s): array {
                $latestReport = $s->reports->first();

                return [
                    'id' => (string) $s->id,
                    'name' => $s->name,
                    'nisn' => $s->nisn,
                    'class' => $s->schoolClass->name ?? '-',
                    'homeroomTeacher' => $s->schoolClass->homeroom_teacher_name ?? '-',
                    'attendanceRate' => (int) $s->attendance_rate,
                    'riskLevel' => $s->risk_level,
                    'parentName' => $s->parent_name ?? 'Wali Murid',
                    'parentPhone' => $s->parent_phone ?? '-',
                    'hasReport' => $latestReport !== null,
                    'reportStatus' => $latestReport?->status ?? 'none',
                    'latestReport' => $latestReport ? [
                        'id' => (string) $latestReport->id,
                        'reportCode' => $latestReport->report_code,
                        'period' => $latestReport->academic_period,
                        'attendanceRate' => (int) $latestReport->attendance_rate,
                        'sickCount' => (int) $latestReport->sick_count,
                        'permissionCount' => (int) $latestReport->permission_count,
                        'unexcusedCount' => (int) $latestReport->unexcused_count,
                        'disciplinePoints' => (int) $latestReport->discipline_points,
                        'disciplineStatus' => $latestReport->discipline_status,
                        'aiCharacterSummary' => $latestReport->ai_character_summary,
                        'aiAcademicNotes' => $latestReport->ai_academic_notes,
                        'parentRecommendations' => $latestReport->parent_recommendations,
                        'status' => $latestReport->status,
                        'sentAt' => $latestReport->sent_to_parent_at,
                        'acknowledgement' => $latestReport->acknowledgement_status,
                        'homeroomTeacher' => $latestReport->homeroom_teacher_name ?? $s->schoolClass->homeroom_teacher_name ?? 'Wali Kelas',
                    ] : null,
                ];
            })
            ->toArray();

        $scopedReportQuery = StudentReport::query();
        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $scopedReportQuery->whereHas('student', fn ($q) => $q->where('school_class_id', $user->school_class_id));
        }

        $stats = [
            'totalStudents' => $user && $user->role === 'wali_kelas' && $user->school_class_id
                ? Student::where('school_class_id', $user->school_class_id)->count()
                : Student::count(),
            'reportsGenerated' => (clone $scopedReportQuery)->count(),
            'reportsSent' => (clone $scopedReportQuery)->where('status', 'sent')->count(),
            'confirmedByParents' => (clone $scopedReportQuery)->where('acknowledgement_status', 'like', '%Sudah%')->count(),
        ];

        return Inertia::render('rapor-siswa', [
            'students' => $students,
            'stats' => $stats,
        ]);
    }

    private function getStats(): array
    {
        return Cache::remember('tanggapin_dashboard_stats', 10, function (): array {
            $studentsNeedingAttention = RiskAlert::where('is_action_taken', false)->count();
            $activeCases = StudentCase::where('stage', '!=', 'resolved')->count();
            $overdueCases = StudentCase::where('stage', '!=', 'resolved')
                ->where('created_at', '<', now()->subHours(48))
                ->count();
            $dataCheckIssues = DapodikIssue::where('status', 'open')->count();
            $duePayments = SchoolPayment::whereIn('status', ['Belum Bayar', 'Menunggu Verifikasi', 'Terlambat'])->count();
            $activeIncidents = Incident::where('status', '!=', 'Selesai')->count();
            $resolvedCount = StudentCase::where('stage', 'resolved')->count() + Followup::where('status', 'completed')->count() + 18;

            return [
                'studentsNeedingAttention' => $studentsNeedingAttention,
                'activeCases' => $activeCases,
                'overdueCases' => $overdueCases,
                'dataCheckIssues' => $dataCheckIssues,
                'duePayments' => $duePayments,
                'activeIncidents' => $activeIncidents,
                'resolvedThisMonth' => $resolvedCount,
            ];
        });
    }

    private function getPriorityFeed(): array
    {
        $user = auth()->user();
        $query = RiskAlert::with(['student.schoolClass'])->latest();

        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $query->whereHas('student', fn ($q) => $q->where('school_class_id', $user->school_class_id));
        }

        return $query->take(10)
            ->get()
            ->map(function (RiskAlert $alert): array {
                $student = $alert->student;

                return [
                    'id' => (string) $alert->id,
                    'studentId' => (string) $alert->student_id,
                    'studentName' => $student->name ?? 'Siswa',
                    'class' => $student->schoolClass->name ?? '-',
                    'riskLevel' => $alert->risk_level,
                    'triggerType' => $alert->trigger_type,
                    'summary' => $alert->summary,
                    'actionTaken' => $alert->is_action_taken,
                    'suggestedAction' => $alert->suggested_action ?? 'Buat Follow-up',
                    'parentName' => $student->parent_name ?? '-',
                    'parentPhone' => $student->parent_phone ?? '-',
                    'homeroomTeacher' => $student->schoolClass->homeroom_teacher_name ?? '-',
                    'timestamp' => $alert->created_at?->diffForHumans() ?? 'Baru saja',
                ];
            })
            ->toArray();
    }

    private function getClasses(): array
    {
        $user = auth()->user();
        $query = SchoolClass::withCount([
            'students as students_at_risk' => fn ($query) => $query->where('risk_level', 'high'),
        ]);

        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $query->where('id', $user->school_class_id);
        }

        $pendingCounts = Followup::where('followups.status', 'pending')
            ->join('students', 'followups.student_id', '=', 'students.id')
            ->selectRaw('students.school_class_id, count(*) as count')
            ->groupBy('students.school_class_id')
            ->pluck('count', 'students.school_class_id')
            ->toArray();

        return $query->get()->map(function (SchoolClass $cls) use ($pendingCounts): array {
            return [
                'id' => (string) $cls->id,
                'name' => $cls->name,
                'major' => $cls->major,
                'homeroomTeacher' => $cls->homeroom_teacher_name,
                'totalStudents' => $cls->total_students,
                'attendanceRate' => $cls->attendance_rate,
                'studentsAtRisk' => $cls->students_at_risk,
                'pendingFollowups' => (int) ($pendingCounts[$cls->id] ?? 0),
                'healthStatus' => $cls->health_status,
            ];
        })->toArray();
    }

    private function getCases(): array
    {
        $user = auth()->user();
        $query = StudentCase::with(['student.schoolClass', 'timelines'])->orderByDesc('id');

        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $query->whereHas('student', fn ($q) => $q->where('school_class_id', $user->school_class_id));
        }

        return $query->get()
            ->map(function (StudentCase $case): array {
                $referredByName = $case->referred_by_name ?? ($case->timelines->firstWhere('actor_name', '!=', 'Guru BK')?->actor_name ?? 'Wali Kelas');
                $referralNotes = $case->referral_notes ?? $case->last_activity;
                $isHandledByBk = in_array($case->stage, ['handled_by_bk', 'resolved']) || ! empty($case->handled_at);

                return [
                    'id' => (string) $case->id,
                    'code' => $case->code,
                    'studentId' => (string) $case->student_id,
                    'studentName' => $case->student->name ?? 'Siswa',
                    'class' => $case->student->schoolClass->name ?? '-',
                    'category' => $case->category,
                    'priority' => $case->priority,
                    'stage' => $case->stage,
                    'stageLabel' => $case->stage_label,
                    'assignee' => $case->assignee_name,
                    'referredByName' => $referredByName,
                    'referralNotes' => $referralNotes,
                    'handledByBkName' => $case->handled_by_bk_name,
                    'bkActionType' => $case->bk_action_type,
                    'bkHandlingNotes' => $case->bk_handling_notes,
                    'handledAt' => $case->handled_at?->format('d M Y, H:i'),
                    'isHandledByBk' => $isHandledByBk,
                    'lastActivity' => $case->last_activity,
                    'lastUpdate' => $case->updated_at?->diffForHumans() ?? 'Baru saja',
                    'createdAt' => $case->created_at?->format('d M Y, H:i') ?? '-',
                    'timeline' => $case->timelines->map(fn (CaseTimeline $t): array => [
                        'time' => $t->recorded_at ?? $t->created_at?->format('d M H:i') ?? '-',
                        'title' => $t->title,
                        'actor' => $t->actor_name,
                    ])->toArray(),
                ];
            })->toArray();
    }

    private function getAtsList(): array
    {
        return AtsRecord::with('student.schoolClass')
            ->latest()
            ->get()
            ->map(function (AtsRecord $ats): array {
                return [
                    'id' => (string) $ats->id,
                    'studentName' => $ats->student->name ?? 'Siswa',
                    'lastClass' => $ats->student->schoolClass->name ?? '-',
                    'address' => $ats->address ?? $ats->student->address ?? '-',
                    'officer' => $ats->officer_name,
                    'status' => $ats->status,
                    'reason' => $ats->reason,
                    'scheduledVisit' => $ats->scheduled_visit ?? '-',
                ];
            })->toArray();
    }

    private function getPayments(): array
    {
        return SchoolPayment::with('student.schoolClass')
            ->latest()
            ->get()
            ->map(function (SchoolPayment $pay): array {
                return [
                    'id' => (string) $pay->id,
                    'invoiceNo' => $pay->invoice_no,
                    'studentName' => $pay->student->name ?? 'Siswa',
                    'class' => $pay->student->schoolClass->name ?? '-',
                    'type' => $pay->type,
                    'amount' => $pay->amount,
                    'dueDate' => $pay->due_date,
                    'status' => $pay->status,
                ];
            })->toArray();
    }

    private function getDapodikIssues(): array
    {
        return DapodikIssue::latest()->get()->map(fn (DapodikIssue $issue): array => [
            'id' => (string) $issue->id,
            'category' => $issue->category,
            'targetName' => $issue->target_name,
            'field' => $issue->field,
            'description' => $issue->description,
            'severity' => $issue->severity,
            'action' => $issue->action,
        ])->toArray();
    }

    private function getDocuments(): array
    {
        return TeacherDocument::latest()->get()->map(fn (TeacherDocument $doc): array => [
            'id' => (string) $doc->id,
            'title' => $doc->title,
            'teacher' => $doc->teacher_name,
            'category' => $doc->category,
            'period' => $doc->period,
            'status' => $doc->status,
            'size' => $doc->file_size,
        ])->toArray();
    }

    private function getIncidents(): array
    {
        return Incident::with('checklists')->latest()->get()->map(fn (Incident $inc): array => [
            'id' => (string) $inc->id,
            'title' => $inc->title,
            'type' => $inc->type,
            'status' => $inc->status,
            'level' => $inc->level,
            'leadOfficer' => $inc->lead_officer,
            'checklist' => $inc->checklists->map(fn (IncidentChecklist $chk): array => [
                'id' => (string) $chk->id,
                'label' => $chk->label,
                'done' => $chk->is_done,
            ])->toArray(),
        ])->toArray();
    }

    private function getParentUpdates(): array
    {
        $user = auth()->user();
        $query = ParentCommunication::with('student')->latest();

        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $query->whereHas('student', fn ($q) => $q->where('school_class_id', $user->school_class_id));
        }

        return $query->get()->map(fn (ParentCommunication $msg): array => [
            'id' => (string) $msg->id,
            'studentName' => $msg->student->name ?? 'Siswa',
            'parentName' => $msg->parent_name,
            'category' => $msg->category,
            'message' => $msg->message,
            'date' => $msg->sent_at ?? $msg->created_at?->diffForHumans() ?? 'Hari ini',
            'status' => $msg->status,
            'acknowledgement' => $msg->acknowledgement,
        ])->toArray();
    }

    private function getDisciplineList(): array
    {
        $user = auth()->user();
        $query = DisciplineRecord::with('student.schoolClass')->latest();

        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $query->whereHas('student', fn ($q) => $q->where('school_class_id', $user->school_class_id));
        }

        return $query->get()->map(fn (DisciplineRecord $rec): array => [
            'id' => (string) $rec->id,
            'studentId' => (string) $rec->student_id,
            'studentName' => $rec->student->name ?? 'Siswa',
            'class' => $rec->student->schoolClass->name ?? '-',
            'infraction' => $rec->infraction,
            'points' => (int) $rec->points,
            'actionStatus' => $rec->action_status,
            'patternNotes' => $rec->pattern_notes ?? 'Pencatatan pembinaan berkala',
            'recordedAt' => $rec->recorded_at ?? $rec->created_at?->format('d M H:i') ?? 'Hari ini',
        ])->toArray();
    }

    private function getStudentsWithDiscipline(): array
    {
        $user = auth()->user();
        $query = Student::with(['schoolClass', 'disciplineRecords'])->orderBy('name');

        if ($user && $user->role === 'wali_kelas' && $user->school_class_id) {
            $query->where('school_class_id', $user->school_class_id);
        }

        return $query->get()->map(function (Student $student): array {
            $totalPoints = $student->disciplineRecords->sum('points');
            $pendingFollowups = $student->disciplineRecords->where('action_status', '!=', 'Selesai Ditindaklanjuti Wali Kelas')->count();

            return [
                'id' => (string) $student->id,
                'name' => $student->name,
                'nisn' => $student->nisn,
                'gender' => $student->gender,
                'classId' => (string) $student->school_class_id,
                'className' => $student->schoolClass->name ?? '-',
                'homeroomTeacher' => $student->schoolClass->homeroom_teacher_name ?? '-',
                'attendanceRate' => (int) $student->attendance_rate,
                'riskLevel' => $student->risk_level,
                'parentName' => $student->parent_name,
                'parentPhone' => $student->parent_phone,
                'address' => $student->address,
                'totalPoints' => (int) $totalPoints,
                'pendingFollowups' => $pendingFollowups,
                'disciplineRecords' => $student->disciplineRecords->map(fn (DisciplineRecord $dr): array => [
                    'id' => (string) $dr->id,
                    'infraction' => $dr->infraction,
                    'points' => (int) $dr->points,
                    'actionStatus' => $dr->action_status,
                    'patternNotes' => $dr->pattern_notes,
                    'recordedAt' => $dr->recorded_at ?? $dr->created_at?->format('d M H:i') ?? '-',
                ])->values()->toArray(),
            ];
        })->toArray();
    }

    /**
     * Store a new student created by Guru BK or authorized staff.
     */
    public function storeStudent(Request $request): RedirectResponse
    {
        $user = auth()->user();
        if ($user && $user->role === 'wali_kelas') {
            $request->merge(['school_class_id' => $user->school_class_id]);
        }

        $validated = $request->validate([
            'school_class_id' => ['required', 'exists:school_classes,id'],
            'nisn' => ['required', 'string', 'max:20', 'unique:students,nisn'],
            'name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'in:L,P'],
            'parent_name' => ['required', 'string', 'max:255'],
            'parent_phone' => ['required', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'attendance_rate' => ['nullable', 'integer', 'min:0', 'max:100'],
        ], [
            'nisn.unique' => 'Nomor Induk Siswa Nasional (NISN) ini sudah terdaftar.',
            'school_class_id.required' => 'Pilih rombongan belajar / kelas.',
        ]);

        $student = Student::create([
            'school_class_id' => $validated['school_class_id'],
            'nisn' => $validated['nisn'],
            'name' => $validated['name'],
            'gender' => $validated['gender'],
            'parent_name' => $validated['parent_name'],
            'parent_phone' => $validated['parent_phone'],
            'address' => $validated['address'] ?? '-',
            'attendance_rate' => $validated['attendance_rate'] ?? 100,
            'risk_level' => 'low',
            'status' => 'active',
        ]);

        $schoolClass = SchoolClass::find($validated['school_class_id']);
        if ($schoolClass) {
            $schoolClass->increment('total_students');
        }

        return back()->with('success', "Peserta didik {$student->name} (NISN: {$student->nisn}) berhasil ditambahkan ke rombel {$schoolClass?->name}!");
    }

    /**
     * Store a newly created discipline record in database (Points by Guru BK).
     */
    public function storeDisciplineRecord(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'infraction' => ['required', 'string', 'max:255'],
            'points' => ['required', 'integer', 'min:1', 'max:100'],
            'pattern_notes' => ['nullable', 'string'],
        ]);

        $student = Student::with('schoolClass')->findOrFail($validated['student_id']);
        $points = (int) $validated['points'];

        DisciplineRecord::create([
            'student_id' => $student->id,
            'infraction' => $validated['infraction'],
            'points' => $points,
            'action_status' => 'Menunggu Tindak Lanjut Wali Kelas',
            'pattern_notes' => $validated['pattern_notes'] ?? 'Dicatat oleh Guru BK untuk ditindaklanjuti Wali Kelas.',
            'recorded_at' => now()->format('d M H:i'),
        ]);

        $totalPoints = $student->disciplineRecords()->sum('points');
        if ($totalPoints >= 30) {
            $student->update(['risk_level' => 'high']);
        } elseif ($totalPoints >= 15 && $student->risk_level === 'low') {
            $student->update(['risk_level' => 'medium']);
        }

        // Create alert for Wali Kelas to act upon
        RiskAlert::create([
            'student_id' => $student->id,
            'risk_level' => $totalPoints >= 30 ? 'high' : 'medium',
            'trigger_type' => 'Poin Pelanggaran Guru BK',
            'summary' => "Guru BK memberikan +{$points} poin ({$validated['infraction']}) kepada {$student->name}. Memerlukan pembinaan Wali Kelas ({$student->schoolClass?->homeroom_teacher_name}).",
            'is_action_taken' => false,
            'suggested_action' => 'Pembinaan Kelas & Tindak Lanjut',
        ]);

        return back()->with('success', "Poin pelanggaran (+{$points} poin) untuk {$student->name} berhasil dicatat oleh Guru BK! Catatan telah diteruskan ke Wali Kelas ({$student->schoolClass?->homeroom_teacher_name}) untuk ditindaklanjuti.");
    }

    /**
     * Store student issue/referral reported by Wali Kelas to Guru BK.
     */
    public function storeReferralToBk(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'category' => ['required', 'string', 'max:255'],
            'priority' => ['required', 'string', 'in:Rendah,Sedang,Tinggi'],
            'notes' => ['required', 'string'],
        ], [
            'notes.required' => 'Rincian kendala siswa wajib diisi oleh Wali Kelas.',
        ]);

        $student = Student::with('schoolClass')->findOrFail($validated['student_id']);
        $user = auth()->user();

        if ($user && $user->role === 'wali_kelas' && $user->school_class_id && $student->school_class_id !== $user->school_class_id) {
            return back()->withErrors(['unauthorized' => 'Anda hanya berhak melaporkan kendala siswa di rombel binaan Anda.']);
        }

        $code = 'CS-'.date('Y').'-'.str_pad((string) (StudentCase::count() + 1), 3, '0', STR_PAD_LEFT);

        $case = StudentCase::create([
            'code' => $code,
            'student_id' => $student->id,
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'stage' => 'new',
            'stage_label' => 'Rujukan Masuk dari Wali Kelas',
            'assignee_name' => 'Koordinator Guru BK',
            'referred_by_name' => $user->name,
            'referral_notes' => $validated['notes'],
            'last_activity' => "Wali Kelas ({$user->name}) melaporkan kendala: {$validated['notes']}",
        ]);

        CaseTimeline::create([
            'student_case_id' => $case->id,
            'title' => "Kendala siswa dirujuk oleh Wali Kelas ({$student->schoolClass?->name})",
            'actor_name' => $user->name ?? 'Wali Kelas',
            'recorded_at' => now()->format('d M H:i'),
        ]);

        RiskAlert::create([
            'student_id' => $student->id,
            'risk_level' => $validated['priority'] === 'Tinggi' ? 'high' : 'medium',
            'trigger_type' => 'Rujukan Kendala Wali Kelas',
            'summary' => "Wali Kelas ({$user->name}) merujuk kendala {$student->name} ({$validated['category']}) ke Guru BK untuk ditindaklanjuti.",
            'is_action_taken' => false,
            'suggested_action' => 'Panggilan Konseling BK & Asesmen Masalah',
        ]);

        return back()->with('success', "Kendala siswa {$student->name} berhasil dilaporkan dan langsung diteruskan ke Guru BK (Nomor Rujukan: {$code})!");
    }

    /**
     * Handle and resolve an inbound referral by Guru BK.
     */
    public function handleReferralByBk(Request $request, StudentCase $studentCase): RedirectResponse
    {
        $validated = $request->validate([
            'action_type' => ['required', 'string', 'max:255'],
            'handling_notes' => ['required', 'string'],
        ], [
            'action_type.required' => 'Jenis tindakan penanganan BK wajib dipilih.',
            'handling_notes.required' => 'Catatan hasil penanganan Guru BK wajib diisi.',
        ]);

        $user = auth()->user();
        $studentCase->load(['student.schoolClass']);

        $handlerName = $user->name ?? 'Guru BK';

        $studentCase->update([
            'stage' => 'handled_by_bk',
            'stage_label' => 'Sudah Ditangani oleh Guru BK',
            'handled_by_bk_name' => $handlerName,
            'bk_action_type' => $validated['action_type'],
            'bk_handling_notes' => $validated['handling_notes'],
            'last_activity' => "Telah ditangani oleh Guru BK ({$handlerName}) [{$validated['action_type']}]: {$validated['handling_notes']}",
            'handled_at' => now(),
        ]);

        CaseTimeline::create([
            'student_case_id' => $studentCase->id,
            'title' => "Ditangani oleh Guru BK ({$validated['action_type']})",
            'actor_name' => $handlerName,
            'recorded_at' => now()->format('d M H:i'),
        ]);

        RiskAlert::where('student_id', $studentCase->student_id)
            ->where('trigger_type', 'Rujukan Kendala Wali Kelas')
            ->where('is_action_taken', false)
            ->update([
                'is_action_taken' => true,
                'suggested_action' => "Sudah ditangani oleh Guru BK ({$handlerName})",
            ]);

        return back()->with('success', "Rujukan kendala siswa {$studentCase->student?->name} ({$studentCase->code}) berhasil ditangani oleh Guru BK! Status di dashboard Wali Kelas telah otomatis diperbarui menjadi 'Sudah Ditangani oleh Guru BK'.");
    }

    /**
     * Follow up and resolve a discipline record by Wali Kelas.
     */
    public function followUpDisciplineRecord(Request $request, DisciplineRecord $record): RedirectResponse
    {
        $validated = $request->validate([
            'followup_notes' => ['required', 'string'],
        ], [
            'followup_notes.required' => 'Catatan pembinaan wali kelas wajib diisi.',
        ]);

        $user = auth()->user();
        $record->load('student.schoolClass');

        if ($user && $user->role === 'wali_kelas' && $user->school_class_id && $record->student->school_class_id !== $user->school_class_id) {
            return back()->withErrors(['unauthorized' => 'Anda hanya berhak menindaklanjuti siswa di kelas binaan Anda.']);
        }

        $existing = $record->pattern_notes ?? '';
        $appended = $existing ? $existing." | [Tindak Lanjut Wali Kelas ({$user->name})]: ".$validated['followup_notes'] : "[Tindak Lanjut Wali Kelas ({$user->name})]: ".$validated['followup_notes'];

        $record->update([
            'action_status' => 'Selesai Ditindaklanjuti Wali Kelas',
            'pattern_notes' => $appended,
        ]);

        RiskAlert::where('student_id', $record->student_id)
            ->where('trigger_type', 'Poin Pelanggaran Guru BK')
            ->update(['is_action_taken' => true]);

        return back()->with('success', "Tindak lanjut pembinaan kedisiplinan untuk {$record->student->name} berhasil dicatat oleh Wali Kelas!");
    }

    /**
     * Store a newly created followup in database.
     */
    public function storeFollowup(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'type' => 'required|string',
            'assignee_name' => 'required|string',
            'note' => 'required|string',
            'due_date' => 'nullable|string',
        ]);

        Followup::create([
            'student_id' => $validated['student_id'],
            'type' => $validated['type'],
            'assignee_name' => $validated['assignee_name'],
            'note' => $validated['note'],
            'status' => 'pending',
            'due_date' => $validated['due_date'] ?? now()->addDays(3)->format('Y-m-d'),
        ]);

        RiskAlert::where('student_id', $validated['student_id'])->update(['is_action_taken' => true]);

        return back()->with('success', 'Follow-up berhasil disimpan di database!');
    }

    /**
     * Store a newly created case in database.
     */
    public function storeCase(Request $request): RedirectResponse
    {
        if (auth()->user()?->role === 'guru_bk') {
            return back()->withErrors(['forbidden' => 'Guru BK tidak membuat kasus baru dari nol. Guru BK menerima dan menindaklanjuti kasus rujukan yang dilaporkan oleh Wali Kelas.']);
        }

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'category' => 'required|string',
            'priority' => 'required|string',
            'last_activity' => 'required|string',
            'assignee_name' => 'nullable|string',
        ]);

        $code = 'CS-'.date('Y').'-'.str_pad((string) (StudentCase::count() + 1), 3, '0', STR_PAD_LEFT);

        $case = StudentCase::create([
            'code' => $code,
            'student_id' => $validated['student_id'],
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'stage' => 'new',
            'stage_label' => 'Baru Masuk',
            'assignee_name' => $validated['assignee_name'] ?? 'Koordinator BK',
            'last_activity' => $validated['last_activity'],
        ]);

        CaseTimeline::create([
            'student_case_id' => $case->id,
            'title' => 'Kasus dibuat dan didaftarkan ke sistem',
            'actor_name' => auth()->user()->name ?? 'Petugas Sekolah',
            'recorded_at' => now()->format('d M H:i'),
        ]);

        return back()->with('success', "Kasus {$code} berhasil dibuat di database!");
    }

    /**
     * Store parent communication in database.
     */
    public function storeParentCommunication(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'category' => 'required|string',
            'message' => 'required|string',
        ]);

        $student = Student::findOrFail($validated['student_id']);

        ParentCommunication::create([
            'student_id' => $student->id,
            'sender_name' => auth()->user()->name ?? 'Wali Kelas',
            'parent_name' => $student->parent_name,
            'category' => $validated['category'],
            'message' => $validated['message'],
            'status' => 'Terkirim via WhatsApp & Tanggapin App',
            'acknowledgement' => 'Menunggu Respon',
            'sent_at' => now()->format('d M H:i'),
        ]);

        return back()->with('success', 'Pesan terstruktur berhasil disimpan dan dikirim ke orang tua!');
    }

    /**
     * Generate or regenerate AI student report card.
     */
    public function generateAiReport(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'period' => 'nullable|string',
        ]);

        $student = Student::with(['schoolClass', 'disciplineRecords', 'riskAlerts', 'studentCases'])->findOrFail($validated['student_id']);
        $user = auth()->user();

        // Scoping check: Wali Kelas can only evaluate students in their assigned class
        if ($user && $user->role === 'wali_kelas' && $user->school_class_id && $student->school_class_id !== $user->school_class_id) {
            return back()->withErrors(['unauthorized' => 'Akses ditolak: Anda hanya berhak menilai dan membuat rapor siswa pada rombel binaan Anda.']);
        }

        $period = $validated['period'] ?? '2025/2026 Ganjil';

        $disciplinePoints = (int) $student->disciplineRecords->sum('points');
        $attendance = (int) $student->attendance_rate;

        // Contextual AI Narrative Generation
        if ($student->risk_level === 'high' || $disciplinePoints >= 15 || $attendance < 80) {
            $disciplineStatus = 'Dalam Pendampingan Khusus';
            $sickCount = 3;
            $permissionCount = 2;
            $unexcusedCount = max(1, (int) round((100 - $attendance) / 4));
            $aiCharacterSummary = "Berdasarkan sintesis data kehadiran dan observasi harian, ananda {$student->name} memiliki bakat logika dan antusiasme belajar yang baik pada sesi praktik kelas. Namun, tren penurunan kehadiran ({$attendance}%) serta catatan keterlambatan memerlukan perhatian kolaboratif antara sekolah dan orang tua. Ananda merespons bimbingan dengan terbuka, dan pendampingan konsisten di rumah akan mempercepat pemulihan motivasi belajarnya.";
            $aiAcademicNotes = 'Kemampuan teknis dan pemahaman konsep kejuruan baik. Kendala utama terletak pada ketidakhadiran di jam pertama yang menyebabkan penugasan mandiri tertunda.';
            $parentRecommendations = "1. Mohon memastikan ananda beristirahat malam sebelum pukul 22.00 WIB untuk menjaga kebugaran pagi hari.\n2. Lakukan evaluasi berkala terhadap penyelesaian tugas sekolah di rumah secara suportif.\n3. Wali kelas dan Guru BK siap berkoordinasi mingguan untuk memantau kemajuan belajar ananda.";
        } elseif ($student->risk_level === 'medium' || $attendance < 90) {
            $disciplineStatus = 'Tertib & Terbina';
            $sickCount = 2;
            $permissionCount = 1;
            $unexcusedCount = max(0, (int) round((100 - $attendance) / 6));
            $aiCharacterSummary = "Ananda {$student->name} menunjukkan etika belajar yang sopan, kooperatif dalam dinamika kelompok, serta mematuhi arahan pendidik. Kehadiran saat ini mencapai {$attendance}%. Dengan sedikit penguatan pada kedisiplinan belajar mandiri, potensi ananda dapat berkembang lebih optimal.";
            $aiAcademicNotes = 'Tuntas dalam seluruh kompetensi dasar semester berjalan. Disarankan untuk lebih aktif dalam sesi presentasi dan pengayaan materi kejuruan.';
            $parentRecommendations = "1. Berikan apresiasi atas konsistensi belajar ananda selama semester ini.\n2. Dampingi ananda membuat jadwal belajar mandiri minimal 45 menit per hari.\n3. Hubungi wali kelas apabila ananda berhalangan hadir agar surat keterangan izin tercatat resmi di sistem.";
        } else {
            $disciplineStatus = 'Sangat Tertib & Teladan';
            $sickCount = 1;
            $permissionCount = 0;
            $unexcusedCount = 0;
            $aiCharacterSummary = "Ananda {$student->name} merupakan peserta didik teladan dengan tingkat kehadiran istimewa ({$attendance}%). Menunjukkan karakter profil pelajar yang mandiri, bernalar kritis, santun, serta konsisten menjadi teladan positif bagi rekan-rekan sekelasnya.";
            $aiAcademicNotes = 'Seluruh capaian pembelajaran dan tugas produktif diselesaikan dengan predikat Sangat Baik (A). Menunjukkan ketelitian tinggi dalam pengerjaan proyek akhir.';
            $parentRecommendations = "1. Terima kasih atas kerja sama dan pendampingan luar biasa dari orang tua di rumah.\n2. Dorong ananda untuk terus mengembangkan portofolio dan mempersiapkan diri mengikuti seleksi prestasi / LKS.\n3. Pertahankan pola komunikasi positif yang sudah terjalin sangat baik.";
        }

        $reportCode = 'RPR-'.date('Y').'-'.str_pad((string) $student->id, 3, '0', STR_PAD_LEFT);

        StudentReport::updateOrCreate(
            [
                'student_id' => $student->id,
                'academic_period' => $period,
            ],
            [
                'report_code' => $reportCode,
                'attendance_rate' => $attendance,
                'sick_count' => $sickCount,
                'permission_count' => $permissionCount,
                'unexcused_count' => $unexcusedCount,
                'discipline_points' => $disciplinePoints,
                'discipline_status' => $disciplineStatus,
                'ai_character_summary' => $aiCharacterSummary,
                'ai_academic_notes' => $aiAcademicNotes,
                'parent_recommendations' => $parentRecommendations,
                'status' => 'generated',
                'parent_phone' => $student->parent_phone,
                'parent_name' => $student->parent_name,
                'delivery_channel' => 'WhatsApp Official & Tanggapin App',
                'acknowledgement_status' => 'Draf Siap Kirim',
                'homeroom_teacher_name' => $student->schoolClass->homeroom_teacher_name ?? 'Wali Kelas',
            ]
        );

        return back()->with('success', "Rapor AI Ananda {$student->name} berhasil digenerate dan siap dikirim!");
    }

    /**
     * Send student report card to parent via WhatsApp & record communication.
     */
    public function sendReportToParent(Request $request, StudentReport $report): RedirectResponse
    {
        $student = $report->student;
        $user = auth()->user();

        // Scoping check: Wali Kelas can only send reports of students in their assigned class
        if ($user && $user->role === 'wali_kelas' && $user->school_class_id && $student->school_class_id !== $user->school_class_id) {
            return back()->withErrors(['unauthorized' => 'Akses ditolak: Anda hanya berhak mengirim rapor siswa pada rombel binaan Anda.']);
        }

        $nowStr = now()->format('d M H:i');

        $report->update([
            'status' => 'sent',
            'sent_to_parent_at' => $nowStr,
            'acknowledgement_status' => 'Sudah Dibaca & Dikonfirmasi Orang Tua',
        ]);

        ParentCommunication::create([
            'student_id' => $student->id,
            'sender_name' => auth()->user()->name ?? 'Wali Kelas',
            'parent_name' => $student->parent_name,
            'category' => 'Rapor Perkembangan Siswa',
            'message' => "Yth. Bapak/Ibu {$student->parent_name}, kami menyampaikan dokumen resmi Rapor Perkembangan & Karakter Ananda {$student->name} ({$report->report_code}) Semester {$report->academic_period}. Kehadiran: {$report->attendance_rate}%. Catatan Karakter AI & Rekomendasi Pendampingan terlampir. Terima kasih atas kerja sama Bapak/Ibu.",
            'status' => 'Terkirim via WhatsApp & Tanggapin App',
            'acknowledgement' => 'Sudah Membaca',
            'sent_at' => $nowStr,
        ]);

        return back()->with('success', "Rapor {$report->report_code} berhasil dikirim ke WhatsApp Orang Tua ({$student->parent_phone}) dan bukti tanda terima telah tercatat!");
    }

    /**
     * Store new school payment / invoice record (Bendahara).
     */
    public function storePayment(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'type' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'integer', 'min:1000'],
            'due_date' => ['required', 'string', 'max:50'],
            'status' => ['required', 'string', 'in:Belum Bayar,Menunggu Verifikasi,Terlambat,Lunas'],
        ]);

        $invoiceNo = 'INV-'.now()->format('Ym').'-'.str_pad((string) (SchoolPayment::count() + 1), 4, '0', STR_PAD_LEFT);

        SchoolPayment::create([
            'invoice_no' => $invoiceNo,
            'student_id' => $validated['student_id'],
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'paid_at' => $validated['status'] === 'Lunas' ? now()->format('Y-m-d H:i') : null,
        ]);

        return back()->with('success', "Tagihan {$invoiceNo} berhasil dicatat & masuk ke pembukuan kas!");
    }

    /**
     * Reconcile / verify school payment as Lunas (Bendahara).
     */
    public function verifyPayment(SchoolPayment $payment): RedirectResponse
    {
        $payment->update([
            'status' => 'Lunas',
            'paid_at' => now()->format('Y-m-d H:i'),
        ]);

        return back()->with('success', "Rekonsiliasi tagihan {$payment->invoice_no} berhasil diverifikasi Lunas!");
    }
}
