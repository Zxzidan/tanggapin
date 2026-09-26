<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\SchoolSetting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * Display user & staff management page with class quota info.
     */
    public function index(): Response
    {
        $this->authorizeOperator();

        $setting = SchoolSetting::current();
        $classCount = SchoolClass::count();
        $maxClasses = $setting->getClassLimit();

        $users = User::with('schoolClass')
            ->orderBy('role')
            ->orderBy('name')
            ->get()
            ->map(fn (User $u): array => [
                'id' => (string) $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'schoolClassId' => $u->school_class_id ? (string) $u->school_class_id : null,
                'schoolClassName' => $u->schoolClass->name ?? null,
                'rawPassword' => $u->raw_password ?? 'password',
                'emailVerifiedAt' => $u->email_verified_at?->format('d M Y'),
                'createdAt' => $u->created_at?->format('d M Y H:i') ?? 'Terdaftar',
            ]);

        $classes = SchoolClass::orderBy('name')
            ->get(['id', 'name', 'major', 'homeroom_teacher_name', 'total_students'])
            ->map(fn (SchoolClass $c): array => [
                'id' => (string) $c->id,
                'name' => $c->name,
                'major' => $c->major,
                'homeroomTeacher' => $c->homeroom_teacher_name,
                'totalStudents' => $c->total_students,
            ]);

        $quota = [
            'plan' => $setting->subscription_plan,
            'planName' => match ($setting->subscription_plan) {
                'perintis' => 'Paket Perintis',
                'yayasan' => 'Paket Yayasan & Dinas',
                default => 'Paket Unggulan',
            },
            'currentClasses' => $classCount,
            'maxClasses' => $maxClasses,
            'isUnlimited' => $setting->subscription_plan === 'yayasan',
            'isLimitReached' => $setting->isClassLimitReached(),
            'remainingClasses' => $maxClasses !== null ? max(0, $maxClasses - $classCount) : 9999,
        ];

        return Inertia::render('kelola-pengguna', [
            'users' => $users,
            'classes' => $classes,
            'quota' => $quota,
            'setting' => [
                'schoolName' => $setting->school_name,
                'npsn' => $setting->npsn,
                'academicYear' => $setting->academic_year,
            ],
        ]);
    }

    /**
     * Store a newly created staff user account.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorizeOperator();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', Rule::in(['wali_kelas', 'bendahara', 'kepala_sekolah', 'guru_bk'])],
            'school_class_id' => [
                'nullable',
                Rule::requiredIf(fn () => $request->input('role') === 'wali_kelas'),
                'exists:school_classes,id',
            ],
            'password' => ['nullable', 'string', 'min:8'],
        ], [
            'role.in' => 'Peran yang valid: Wali Kelas, Bendahara, Kepala Sekolah, atau Guru BK.',
            'school_class_id.required' => 'Wali Kelas wajib memilih rombongan belajar / kelas binaan.',
            'email.unique' => 'Alamat email ini sudah terdaftar di sistem.',
        ]);

        $password = ! empty($validated['password']) ? $validated['password'] : 'password123';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'school_class_id' => $validated['role'] === 'wali_kelas' ? $validated['school_class_id'] : null,
            'password' => Hash::make($password),
            'raw_password' => $password,
            'email_verified_at' => now(),
        ]);

        // If wali kelas, update the homeroom teacher name in the school class
        if ($user->role === 'wali_kelas' && $user->school_class_id) {
            SchoolClass::where('id', $user->school_class_id)->update([
                'homeroom_teacher_name' => $user->name,
            ]);
        }

        $roleLabels = [
            'wali_kelas' => 'Wali Kelas',
            'bendahara' => 'Bendahara Sekolah',
            'kepala_sekolah' => 'Kepala Sekolah',
            'guru_bk' => 'Guru BK',
        ];
        $roleName = $roleLabels[$user->role] ?? $user->role;

        return back()->with('success', "Akun resmi {$roleName} untuk {$user->name} ({$user->email}) berhasil dibuat oleh Operator! Kata sandi: {$password}");
    }

    /**
     * Update an existing staff user account.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorizeOperator();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(['wali_kelas', 'bendahara', 'kepala_sekolah', 'guru_bk', 'operator'])],
            'school_class_id' => [
                'nullable',
                Rule::requiredIf(fn () => $request->input('role') === 'wali_kelas'),
                'exists:school_classes,id',
            ],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'school_class_id' => $validated['role'] === 'wali_kelas' ? $validated['school_class_id'] : null,
        ];

        if (! empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
            $userData['raw_password'] = $validated['password'];
        }

        $user->update($userData);

        if ($user->role === 'wali_kelas' && $user->school_class_id) {
            SchoolClass::where('id', $user->school_class_id)->update([
                'homeroom_teacher_name' => $user->name,
            ]);
        }

        return back()->with('success', "Data akun {$user->name} berhasil diperbarui.");
    }

    /**
     * Delete a staff user account.
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->authorizeOperator();

        if (auth()->id() === $user->id) {
            return back()->withErrors(['delete' => 'Anda tidak dapat menghapus akun Operator yang sedang aktif digunakan.']);
        }

        $userName = $user->name;
        $user->delete();

        return back()->with('success', "Akun staf {$userName} berhasil dihapus dari sistem.");
    }

    /**
     * Store a new school class with plan quota enforcement (35 for unggulan, unlimited for yayasan, 10 for perintis).
     */
    public function storeClass(Request $request): RedirectResponse
    {
        $this->authorizeOperator();

        $setting = SchoolSetting::current();
        if ($setting->isClassLimitReached()) {
            $max = $setting->getClassLimit();
            $plan = ucfirst($setting->subscription_plan);

            return back()->withErrors([
                'class_limit' => "Batas kuota kelas untuk {$plan} ({$max} kelas) telah tercapai. Upgrade ke Paket Yayasan untuk mengelola rombel tanpa batas (Unlimited).",
            ]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:school_classes,name'],
            'major' => ['required', 'string', 'max:100'],
            'homeroom_teacher_name' => ['required', 'string', 'max:255'],
        ], [
            'name.unique' => 'Nama rombongan belajar ini sudah terdaftar.',
        ]);

        SchoolClass::create([
            'name' => $validated['name'],
            'major' => $validated['major'],
            'homeroom_teacher_name' => $validated['homeroom_teacher_name'],
            'academic_year' => $setting->academic_year,
            'total_students' => 0,
            'attendance_rate' => 100,
            'health_status' => 'good',
        ]);

        return back()->with('success', "Rombongan belajar {$validated['name']} berhasil ditambahkan ke sistem!");
    }

    /**
     * Update school subscription plan (perintis, unggulan 35 kelas, yayasan unlimited).
     */
    public function updatePlan(Request $request): RedirectResponse
    {
        $this->authorizeOperator();

        $validated = $request->validate([
            'subscription_plan' => ['required', 'string', Rule::in(['perintis', 'unggulan', 'yayasan'])],
        ]);

        $setting = SchoolSetting::current();
        $plan = $validated['subscription_plan'];
        $maxClasses = match ($plan) {
            'perintis' => 10,
            'unggulan' => 35,
            'yayasan' => null,
        };

        $setting->update([
            'subscription_plan' => $plan,
            'max_classes' => $maxClasses,
        ]);

        $planNames = [
            'perintis' => 'Paket Perintis (Maksimal 10 Kelas)',
            'unggulan' => 'Paket Unggulan (Maksimal 35 Kelas)',
            'yayasan' => 'Paket Yayasan (Unlimited Kelas)',
        ];

        return back()->with('success', "Paket langganan sekolah berhasil disesuaikan menjadi {$planNames[$plan]}!");
    }

    /**
     * Authorize that the current authenticated user is an Operator or Kepala Sekolah.
     */
    private function authorizeOperator(): void
    {
        $user = auth()->user();
        if (! $user || (! $user->isOperator() && ! $user->isKepalaSekolah())) {
            abort(403, 'Akses khusus Operator Sekolah atau Kepala Sekolah.');
        }
    }
}
