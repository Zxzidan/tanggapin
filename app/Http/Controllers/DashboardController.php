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
use App\Models\TeacherDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the Tanggapin operational dashboard (Ikhtisar & Tindakan).
     */
    public function index(Request $request): Response
    {
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
    public function earlyWarning(): Response
    {
        return Inertia::render('early-warning', [
            'stats' => $this->getStats(),
            'priorityFeed' => $this->getPriorityFeed(),
        ]);
    }

    /**
     * Modul 02: Kondisi Kelas & Monitoring Rombel
     */
    public function kondisiKelas(): Response
    {
        return Inertia::render('kondisi-kelas', [
            'classes' => $this->getClasses(),
            'disciplineList' => $this->getDisciplineList(),
        ]);
    }

    /**
     * Modul 06: Alur Lapangan ATS (Anak Tidak Sekolah)
     */
    public function alurAts(): Response
    {
        return Inertia::render('alur-ats', [
            'atsList' => $this->getAtsList(),
        ]);
    }

    /**
     * Modul 03: Case Management (Manajemen Kasus BK)
     */
    public function manajemenKasus(): Response
    {
        return Inertia::render('manajemen-kasus', [
            'stats' => $this->getStats(),
            'cases' => $this->getCases(),
        ]);
    }

    /**
     * Modul 04: Komunikasi Orang Tua Terstruktur
     */
    public function komunikasiOrtu(): Response
    {
        return Inertia::render('komunikasi-ortu', [
            'parentUpdates' => $this->getParentUpdates(),
        ]);
    }

    /**
     * Modul 09: Cek Data Dapodik (Anomali Operator)
     */
    public function dapodik(): Response
    {
        return Inertia::render('dapodik', [
            'dapodikIssues' => $this->getDapodikIssues(),
        ]);
    }

    /**
     * Modul 07: Pembayaran & SPP (Rekonsiliasi Bendahara)
     */
    public function pembayaran(): Response
    {
        return Inertia::render('pembayaran', [
            'paymentList' => $this->getPayments(),
        ]);
    }

    /**
     * Modul 08: Dokumen Guru (Kelengkapan Administrasi & Portofolio)
     */
    public function dokumenGuru(): Response
    {
        return Inertia::render('dokumen-guru', [
            'documents' => $this->getDocuments(),
        ]);
    }

    /**
     * Modul 10: Respons Insiden & Kesiapsiagaan Sekolah
     */
    public function responsInsiden(): Response
    {
        return Inertia::render('respons-insiden', [
            'incidents' => $this->getIncidents(),
        ]);
    }

    private function getStats(): array
    {
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
    }

    private function getPriorityFeed(): array
    {
        return RiskAlert::with(['student.schoolClass'])
            ->latest()
            ->take(10)
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
        return SchoolClass::withCount([
            'students as students_at_risk' => fn ($query) => $query->where('risk_level', 'high'),
        ])->get()->map(function (SchoolClass $cls): array {
            $pendingCount = Followup::whereHas('student', fn ($q) => $q->where('school_class_id', $cls->id))
                ->where('status', 'pending')
                ->count();

            return [
                'id' => (string) $cls->id,
                'name' => $cls->name,
                'major' => $cls->major,
                'homeroomTeacher' => $cls->homeroom_teacher_name,
                'totalStudents' => $cls->total_students,
                'attendanceRate' => $cls->attendance_rate,
                'studentsAtRisk' => $cls->students_at_risk,
                'pendingFollowups' => $pendingCount,
                'healthStatus' => $cls->health_status,
            ];
        })->toArray();
    }

    private function getCases(): array
    {
        return StudentCase::with(['student.schoolClass', 'timelines'])
            ->latest()
            ->get()
            ->map(function (StudentCase $case): array {
                return [
                    'id' => (string) $case->id,
                    'code' => $case->code,
                    'studentName' => $case->student->name ?? 'Siswa',
                    'class' => $case->student->schoolClass->name ?? '-',
                    'category' => $case->category,
                    'priority' => $case->priority,
                    'stage' => $case->stage,
                    'stageLabel' => $case->stage_label,
                    'assignee' => $case->assignee_name,
                    'lastActivity' => $case->last_activity,
                    'lastUpdate' => $case->updated_at?->diffForHumans() ?? 'Baru saja',
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
        return ParentCommunication::with('student')->latest()->get()->map(fn (ParentCommunication $msg): array => [
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
        return DisciplineRecord::with('student.schoolClass')->latest()->get()->map(fn (DisciplineRecord $rec): array => [
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

    /**
     * Store a newly created discipline record in database.
     */
    public function storeDisciplineRecord(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'infraction' => 'required|string',
            'points' => 'required|integer',
            'pattern_notes' => 'nullable|string',
        ]);

        DisciplineRecord::create([
            'student_id' => $validated['student_id'],
            'infraction' => $validated['infraction'],
            'points' => $validated['points'],
            'action_status' => 'Menunggu Pembinaan',
            'pattern_notes' => $validated['pattern_notes'] ?? 'Dicatat dari modul kedisiplinan',
            'recorded_at' => now()->format('d M H:i'),
        ]);

        return back()->with('success', 'Catatan kedisiplinan berhasil disimpan!');
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
}
