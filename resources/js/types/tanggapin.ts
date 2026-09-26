export type RoleType =
    | 'kepala_sekolah'
    | 'wali_kelas'
    | 'guru_bk'
    | 'bendahara'
    | 'operator';

export interface TanggapinStats {
    studentsNeedingAttention: number;
    activeCases: number;
    overdueCases: number;
    dataCheckIssues: number;
    duePayments: number;
    activeIncidents: number;
    resolvedThisMonth: number;
}

export interface PriorityAlert {
    id: string;
    studentId: string;
    studentName: string;
    class: string;
    riskLevel: 'high' | 'medium' | 'low';
    triggerType: string;
    summary: string;
    actionTaken: boolean;
    suggestedAction: string;
    parentName: string;
    parentPhone: string;
    homeroomTeacher: string;
    timestamp: string;
}

export interface ClassMonitoringItem {
    id: string;
    name: string;
    major: string;
    homeroomTeacher: string;
    totalStudents: number;
    attendanceRate: number;
    studentsAtRisk: number;
    pendingFollowups: number;
    healthStatus: 'good' | 'warning' | 'critical';
}

export interface CaseTimelineItem {
    time: string;
    title: string;
    actor: string;
}

export interface CaseItem {
    id: string;
    code: string;
    studentName: string;
    class: string;
    category:
        | 'Akademik'
        | 'Kehadiran'
        | 'Kedisiplinan'
        | 'Sosial'
        | 'Sosial & Perlindungan'
        | (string & {});
    priority: 'Tinggi' | 'Sedang' | 'Rendah';
    stage: 'new' | 'assigned' | 'in_progress' | 'follow_up' | 'resolved';
    stageLabel: string;
    assignee: string;
    lastActivity: string;
    lastUpdate: string;
    timeline: CaseTimelineItem[];
}

export interface AtsItem {
    id: string;
    studentName: string;
    lastClass: string;
    address: string;
    officer: string;
    status: string;
    reason: string;
    scheduledVisit: string;
}

export interface PaymentItem {
    id: string;
    invoiceNo: string;
    studentName: string;
    class: string;
    type: string;
    amount: number;
    dueDate: string;
    status: 'Belum Bayar' | 'Menunggu Verifikasi' | 'Lunas' | 'Terlambat';
}

export interface DapodikIssue {
    id: string;
    category: string;
    targetName: string;
    field: string;
    description: string;
    severity: 'Error' | 'Perlu Diperiksa';
    action: string;
}

export interface TeacherDocument {
    id: string;
    title: string;
    teacher: string;
    category: string;
    period: string;
    status: string;
    size: string;
}

export interface IncidentChecklistItem {
    id: string;
    label: string;
    done: boolean;
}

export interface IncidentItem {
    id: string;
    title: string;
    type: string;
    status: string;
    level: string;
    leadOfficer: string;
    checklist: IncidentChecklistItem[];
}

export interface ParentUpdate {
    id: string;
    studentName: string;
    parentName: string;
    category: string;
    message: string;
    date: string;
    status: string;
    acknowledgement: 'Sudah membaca' | 'Perlu ditindaklanjuti';
}

export interface DisciplineRecordItem {
    id: string;
    studentId: string;
    studentName: string;
    class: string;
    infraction: string;
    points: number;
    actionStatus: string;
    patternNotes: string;
    recordedAt: string;
}

export interface DashboardPageProps {
    stats: TanggapinStats;
    priorityFeed: PriorityAlert[];
    classes: ClassMonitoringItem[];
    cases: CaseItem[];
    atsList: AtsItem[];
    paymentList: PaymentItem[];
    dapodikIssues: DapodikIssue[];
    documents: TeacherDocument[];
    incidents: IncidentItem[];
    parentUpdates: ParentUpdate[];
    disciplineList?: DisciplineRecordItem[];
}

export interface StudentReportItem {
    id: string;
    reportCode: string;
    period: string;
    attendanceRate: number;
    sickCount: number;
    permissionCount: number;
    unexcusedCount: number;
    disciplinePoints: number;
    disciplineStatus: string;
    aiCharacterSummary: string;
    aiAcademicNotes?: string | null;
    parentRecommendations: string;
    status: 'draft' | 'generated' | 'sent';
    sentAt?: string | null;
    acknowledgement: string;
    homeroomTeacher: string;
}

export interface StudentForReportItem {
    id: string;
    name: string;
    nisn: string;
    class: string;
    homeroomTeacher: string;
    attendanceRate: number;
    riskLevel: 'high' | 'medium' | 'low';
    parentName: string;
    parentPhone: string;
    hasReport: boolean;
    reportStatus: 'none' | 'draft' | 'generated' | 'sent';
    latestReport: StudentReportItem | null;
}
