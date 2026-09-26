# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Nama Produk

**Tanggapin**

**Tagline:**
**“Deteksi lebih cepat. Tindak lebih tepat.”**

Tanggapin adalah platform operasional sekolah yang menghubungkan data siswa, early warning, kasus, komunikasi orang tua, pembayaran, kinerja guru, dan respons insiden dalam satu alur kerja sederhana.

---

# 2. Ide Bisnis

Sekolah sebenarnya sudah memiliki banyak data:

- absensi
- nilai
- pelanggaran
- data siswa
- komunikasi orang tua
- pembayaran
- dokumen guru
- data tugas tambahan
- laporan kasus

Masalahnya, data tersebut **terpisah dan lebih banyak digunakan untuk administrasi daripada tindakan**.

Tanggapin mengubah data operasional tersebut menjadi:

**DATA → DETEKSI → TINDAKAN → KOMUNIKASI → DOKUMENTASI → EVALUASI**

Produk bukan pengganti Dapodik, PMM, WhatsApp, atau sistem pembayaran.

Tanggapin menjadi **lapisan operasional di atas sistem yang sudah digunakan sekolah**.

---

# 3. Masalah Utama

### Masalah 1 — Risiko siswa terlambat terdeteksi

Wali kelas harus menggabungkan absensi, nilai, dan pelanggaran secara manual.

### Masalah 2 — Komunikasi guru–orang tua tidak terstruktur

Informasi penting tenggelam dalam chat dan konflik mudah terjadi.

### Masalah 3 — Validasi data administrasi guru

Data tugas tambahan dan informasi pendukung masih rentan kesalahan input.

### Masalah 4 — Penanganan ATS lambat

Data tersedia, tetapi verifikasi dan tindak lanjut lapangan belum terintegrasi.

### Masalah 5 — Pembinaan siswa reaktif

Pola pelanggaran baru terlihat setelah direkap.

### Masalah 6 — Penanganan kasus tidak terdokumentasi

BK, wali kelas, dan kesiswaan berkoordinasi melalui kanal informal.

### Masalah 7 — Orang tua tidak mengetahui perkembangan anak

Informasi yang diterima sering generik dan tidak berdasarkan kondisi aktual anak.

### Masalah 8 — Penagihan SPP manual

Bendahara harus mencocokkan transfer dan konfirmasi secara manual.

### Masalah 9 — Bukti kinerja guru tersebar

Dokumen kegiatan dan bukti kinerja berada di berbagai tempat.

### Masalah 10 — Respons insiden tidak terkoordinasi

Sekolah tidak memiliki workflow digital yang siap digunakan ketika terjadi keadaan darurat.

---

# 4. Solusi Produk

Tanggapin memiliki **10 modul utama** yang berada dalam satu platform.

Namun seluruh modul menggunakan prinsip yang sama:

> **Temukan masalah → tentukan siapa yang menangani → lakukan tindakan → catat hasilnya.**

---

# 5. Target Pengguna

## Primary User

### Wali Kelas

Mendeteksi siswa berisiko dan melakukan follow-up.

### Guru BK

Mengelola kasus dan intervensi siswa.

### Kesiswaan

Memantau kedisiplinan dan pembinaan.

### Operator

Mengelola data dan validasi.

### Bendahara

Mengelola tagihan dan pembayaran.

### Kepala Sekolah

Melihat kondisi sekolah secara keseluruhan.

## Secondary User

### Guru

Mengelola data pembelajaran dan bukti aktivitas.

### Orang Tua

Menerima informasi perkembangan anak.

### Tim Darurat

Mengikuti workflow ketika terjadi insiden.

---

# 6. Value Proposition

### Untuk sekolah

**Tidak perlu menambah banyak aplikasi.**

Tanggapin menyatukan aktivitas operasional yang sebelumnya tersebar.

### Untuk wali kelas

**Tidak perlu mencari siswa bermasalah secara manual.**

Sistem membantu menunjukkan siswa yang membutuhkan perhatian.

### Untuk BK

**Tidak perlu mengandalkan chat untuk mengelola kasus.**

Setiap kasus memiliki timeline dan status.

### Untuk orang tua

**Tidak hanya menerima pengumuman.**

Orang tua mendapatkan informasi yang relevan dengan anaknya.

### Untuk kepala sekolah

**Tidak hanya melihat data.**

Kepala sekolah dapat melihat masalah yang membutuhkan tindakan.

---

# 7. Fitur Utama

# MODULE 01 — EARLY WARNING

## Tujuan

Mendeteksi pola risiko siswa sebelum berkembang menjadi masalah yang lebih besar.

### Data yang digunakan

- Absensi
- Keterlambatan
- Nilai
- Pelanggaran
- Catatan pembinaan
- Perubahan perilaku
- Riwayat kasus

### Fitur

**Risk Overview**

Menampilkan siswa berdasarkan kondisi:

- Perlu perhatian
- Perlu follow-up
- Prioritas tinggi

### Student Risk Profile

Setiap siswa memiliki ringkasan:

- kehadiran
- nilai
- pelanggaran
- tren
- riwayat intervensi

### Risk Trigger

Contoh:

> Kehadiran menurun dalam beberapa minggu.

atau

> Pelanggaran meningkat.

Sistem menandai kondisi tersebut sebagai **trigger**, bukan sebagai diagnosis.

### Action

Guru dapat langsung:

- membuat follow-up
- menghubungi orang tua
- membuat case
- memberi catatan
- menjadwalkan pertemuan

---

# MODULE 02 — CLASS MONITORING

## Tujuan

Memberikan wali kelas satu halaman untuk melihat kondisi kelas.

### Fitur

- Ringkasan kehadiran
- Ringkasan nilai
- Pelanggaran
- Siswa membutuhkan perhatian
- Follow-up belum selesai
- Tren kelas

### Class Health

Menampilkan kondisi kelas berdasarkan indikator operasional.

Bukan memberi label terhadap siswa.

---

# MODULE 03 — CASE MANAGEMENT

## Tujuan

Mengubah penanganan siswa dari komunikasi ad-hoc menjadi workflow.

### Case Types

- Akademik
- Kehadiran
- Kedisiplinan
- Sosial
- Komunikasi orang tua
- Perlindungan siswa
- Lainnya

### Case Workflow

**New → Assigned → In Progress → Follow-up → Resolved**

### Case Detail

- Siswa
- Jenis kasus
- Ringkasan
- Prioritas
- Penanggung jawab
- Timeline
- Catatan
- Tindakan
- Lampiran
- Status

### Timeline

Semua aktivitas tersimpan:

> 10:00 — Case dibuat
> 11:30 — Ditugaskan ke BK
> 14:00 — Orang tua dihubungi
> 16:00 — Follow-up dijadwalkan

### Collaboration

Anggota terkait dapat memberikan:

- catatan
- update
- tugas
- lampiran

---

# MODULE 04 — PARENT COMMUNICATION

## Tujuan

Menyediakan komunikasi sekolah–orang tua yang terstruktur tanpa harus menggantikan WhatsApp.

### Fitur

**Student Updates**

Orang tua melihat informasi khusus anak.

Contoh:

- kehadiran
- tugas
- catatan wali kelas
- perkembangan
- agenda

### Structured Message

Pesan memiliki:

- kategori
- isi
- tanggal
- pengirim
- status dibaca

### Announcement

Sekolah dapat membuat:

- pengumuman kelas
- pengumuman sekolah
- agenda
- reminder

### Acknowledgement

Orang tua dapat memilih:

**Sudah membaca**

atau

**Perlu ditindaklanjuti**

---

# MODULE 05 — STUDENT DISCIPLINE

## Tujuan

Mengubah pencatatan pelanggaran menjadi sistem pembinaan.

### Fitur

- Input pelanggaran
- Kategori pelanggaran
- Riwayat siswa
- Poin
- Catatan pembinaan
- Follow-up
- Riwayat tindakan

### Pattern Detection

Sistem membantu menemukan pola:

- pelanggaran berulang
- waktu tertentu
- kategori tertentu
- peningkatan frekuensi

Fokusnya bukan menghukum, tetapi **mendeteksi pola untuk pembinaan lebih awal.**

---

# MODULE 06 — ATS FIELD WORKFLOW

## Tujuan

Membantu sekolah menangani proses verifikasi dan tindak lanjut ATS secara lokal.

### Fitur

**ATS List**

Daftar kandidat berdasarkan data yang dimasukkan/import sekolah.

### Verification

Petugas dapat mencatat:

- status verifikasi
- alamat
- kondisi
- hasil kunjungan
- tanggal
- petugas

### Field Visit

Workflow:

**Assigned → Visit → Verified → Intervention → Follow-up → Closed**

### Evidence

Lampiran:

- foto
- dokumen
- catatan kunjungan

### Intervention Tracking

Pilihan tindakan:

- kembali sekolah
- rujukan
- bantuan
- komunikasi keluarga
- monitoring

Tanggapin tidak menggantikan database nasional; modul ini fokus pada **workflow operasional sekolah/lapangan**.

---

# MODULE 07 — SCHOOL PAYMENT

## Tujuan

Mengurangi pekerjaan manual bendahara.

### Fitur

- Data tagihan
- SPP
- Status pembayaran
- Jatuh tempo
- Riwayat transaksi
- Reminder
- Rekonsiliasi

### Parent View

Orang tua melihat:

**Tagihan → Nominal → Jatuh Tempo → Status**

### Payment Status

- Belum bayar
- Menunggu verifikasi
- Lunas
- Terlambat

### Payment Gateway

Disiapkan sebagai integrasi opsional.

---

# MODULE 08 — TEACHER DOCUMENT HUB

## Tujuan

Mengurangi waktu guru mencari bukti aktivitas/kinerja.

### Fitur

**Evidence Repository**

Guru menyimpan:

- kegiatan
- sertifikat
- dokumentasi
- perangkat pembelajaran
- laporan
- bukti kegiatan

### Tagging

Dokumen dapat diberi:

- kategori
- tahun
- kegiatan
- periode

### Search

Guru dapat mencari dokumen berdasarkan:

**nama / kategori / tanggal / kegiatan**

### Export

Dokumen dapat dikompilasi menjadi satu paket.

Tanggapin berfungsi sebagai **document organizer**, bukan pengganti sistem resmi pemerintah.

---

# MODULE 09 — DAPODIK DATA CHECK

## Tujuan

Membantu operator menemukan data yang berpotensi tidak konsisten sebelum proses administrasi resmi.

### Fitur

**Data Validation**

Memeriksa:

- data kosong
- data duplikat
- ketidaksesuaian
- tugas tambahan
- data guru
- data kelas

### Validation Status

- Valid
- Perlu diperiksa
- Error

### Issue List

Operator mendapatkan daftar:

> 12 data perlu diperiksa.

Setiap masalah memiliki:

- field bermasalah
- alasan
- data saat ini
- tindakan koreksi

### Import / Export

Mendukung proses berbasis file sesuai format yang diperbolehkan.

Tanggapin **tidak mengklaim sebagai pengganti Dapodik** dan tidak menjanjikan pencairan tunjangan.

---

# MODULE 10 — INCIDENT RESPONSE

## Tujuan

Membantu sekolah merespons keadaan darurat dengan workflow siap pakai.

### Incident Types

- Banjir
- Gempa
- Kebakaran
- Gangguan keamanan
- Kecelakaan
- Insiden sekolah lainnya

### Emergency Workflow

**Incident → Activate Team → Verify → Communicate → Response → Recovery**

### Incident Dashboard

Menampilkan:

- kondisi
- lokasi
- penanggung jawab
- tugas
- status
- update

### Checklist

Contoh:

**Evakuasi**

☐ Aktifkan tim
☐ Informasikan guru
☐ Periksa siswa
☐ Hubungi orang tua
☐ Catat kondisi
☐ Update kepala sekolah

### Emergency Communication

Satu tindakan dapat membuat update ke pihak yang relevan.

---

# 8. DASHBOARD KEPALA SEKOLAH

Dashboard utama tidak dibuat penuh grafik.

Fokusnya adalah:

## “Apa yang membutuhkan perhatian saya hari ini?”

Contoh:

**12**
Siswa perlu follow-up

**4**
Kasus aktif

**7**
Data perlu diperiksa

**18**
Tagihan jatuh tempo

**2**
Insiden aktif

### Priority Feed

Contoh:

> 3 siswa mengalami penurunan kehadiran.

> 2 case belum mendapat follow-up.

> 7 data operator membutuhkan validasi.

Dashboard mengarahkan pengguna ke **action**, bukan sekadar analytics.

---

# 9. DASHBOARD WALI KELAS

Fokus:

### Hari Ini

- Absensi
- Siswa membutuhkan perhatian
- Follow-up
- Pesan orang tua
- Catatan

### Quick Actions

**+ Catat Absensi**

**+ Buat Follow-up**

**+ Hubungi Orang Tua**

**+ Buat Case**

---

# 10. DASHBOARD BK

Fokus:

- Case aktif
- Prioritas
- Follow-up hari ini
- Case overdue
- Riwayat intervensi

Tidak menggunakan tampilan dashboard yang penuh angka.

---

# 11. DASHBOARD BENDAHARA

Fokus:

- Total tagihan
- Belum bayar
- Jatuh tempo
- Menunggu verifikasi
- Pembayaran terbaru

---

# 12. DASHBOARD OPERATOR

Fokus:

- Data error
- Data perlu validasi
- Import terbaru
- Perubahan data
- Status sinkronisasi

---

# 13. DASHBOARD ORANG TUA

Orang tua hanya melihat data anaknya.

### Home

**Perkembangan Anak**

- Kehadiran
- Akademik
- Catatan
- Agenda
- Tagihan

### Notifications

Hanya informasi yang relevan.

Tidak menampilkan data siswa lain.

---

# 14. ROLE & PERMISSION

## Super Admin

Semua konfigurasi.

## Kepala Sekolah

Melihat seluruh operasional dan memberikan approval.

## Operator

Mengelola data sekolah.

## Wali Kelas

Mengelola kelas dan siswa yang menjadi tanggung jawabnya.

## Guru BK

Mengelola case terkait siswa.

## Kesiswaan

Mengelola disiplin.

## Bendahara

Mengelola pembayaran.

## Guru

Mengelola data pembelajaran dan dokumen.

## Orang Tua

Melihat data anak.

## Tim Insiden

Mengakses incident workflow.

---

# 15. SISTEM NOTIFIKASI

Notifikasi harus **sedikit tetapi penting**.

### Notification Priority

**Critical**
Harus segera diperhatikan.

**Action Required**
Membutuhkan tindakan.

**Information**
Informasi biasa.

Notifikasi dapat melalui:

- In-app
- Email
- WhatsApp gateway sebagai integrasi opsional

---

# 16. SEARCH

Global search untuk mencari:

- siswa
- guru
- case
- dokumen
- tagihan
- incident

Contoh:

`Cari: Brian`

Hasil:

**Student**
Brian — XI RPL 2

**Cases**
2 case

**Documents**
4 dokumen

---

# 17. ACTIVITY LOG

Semua tindakan penting dicatat.

Contoh:

> Wali Kelas mengubah status follow-up.

> Operator memperbaiki data guru.

> Bendahara memverifikasi pembayaran.

> BK menambahkan catatan case.

Tujuan:

**Transparansi + audit trail.**

---

# 18. PRIVACY & SECURITY

Karena produk menangani data siswa:

- Role-based access
- Data isolation
- Audit log
- Secure authentication
- Password hashing
- Session management
- Backup
- Minimal data exposure
- Parent hanya melihat anaknya
- Guru hanya melihat data sesuai kewenangan

Data sensitif tidak ditampilkan secara berlebihan di dashboard.

---

# 19. BUSINESS MODEL

## SaaS Sekolah

Sekolah membayar langganan.

### Paket Starter

Untuk sekolah kecil.

Fitur:

- Student monitoring
- Early warning
- Parent communication
- Discipline
- Basic dashboard

### Paket School

Menambahkan:

- Case management
- Payment
- Document hub
- Data validation
- Advanced reports

### Paket Enterprise

Untuk:

- Yayasan
- Multi-school
- Dinas / institusi pendidikan

Dengan:

- Multi-school dashboard
- Central administration
- Advanced analytics
- API
- Custom integration

---

# 20. MODEL HARGA

Gunakan **per sekolah**, bukan per user.

Contoh konsep:

**Starter**
Rp300–500 ribu / bulan

**School**
Rp750 ribu–1,5 juta / bulan

**Enterprise**
Custom pricing

Tujuannya membuat biaya lebih mudah dipahami sekolah.

---

# 21. REVENUE STREAM

Pendapatan berasal dari:

1. Subscription sekolah
2. Paket multi-school
3. Integrasi pembayaran
4. Integrasi komunikasi
5. Custom integration
6. Enterprise dashboard
7. Setup/onboarding sekolah

---

# 22. GO-TO-MARKET

Target awal:

**Sekolah swasta dan yayasan dengan 300–1.500 siswa.**

Alasan:

- Pengambilan keputusan relatif lebih sederhana
- Banyak aktivitas masih manual
- Memiliki kebutuhan administrasi operasional
- Bisa menggunakan SaaS tanpa menunggu perubahan sistem pemerintah

### Strategi masuk

Mulai dari:

**Early Warning + Case Management**

Kemudian masuk ke:

Communication → Payment → Document → Data Validation → Incident.

---

# 23. COMPETITIVE POSITIONING

Tanggapin bukan:

- LMS
- e-learning
- aplikasi absensi biasa
- aplikasi pembayaran saja
- aplikasi BK saja
- pengganti Dapodik

Tanggapin adalah:

> **Operational Action Layer untuk sekolah.**

Fokus utamanya adalah:

**“Apa yang harus dilakukan sekolah setelah data menunjukkan sebuah masalah?”**

---

# 24. CORE DIFFERENTIATOR

Bukan jumlah fitur.

Diferensiasi utama:

## DATA → ACTION

Sistem tidak berhenti pada:

> “Siswa ini memiliki absensi rendah.”

Tetapi melanjutkan:

> **“Buat follow-up?”**

Kemudian:

**Assign → Contact Parent → Intervention → Follow-up → Resolve**

Dengan demikian data sekolah menjadi workflow tindakan.

---

# 25. MVP

MVP pertama tidak perlu membangun seluruh 10 modul sekaligus secara penuh.

Namun seluruh masalah tetap memiliki representasi dalam roadmap produk.

### MVP PHASE 1

Fokus:

**Early Warning + Case Management + Parent Communication**

Fitur:

- Student profile
- Attendance input
- Violation input
- Grade input
- Risk trigger
- Risk dashboard
- Case creation
- Case timeline
- Assignment
- Follow-up
- Parent update
- Notification
- Dashboard wali kelas
- Dashboard BK
- Dashboard kepala sekolah

### PHASE 2

Tambahkan:

- Discipline
- Payment
- Teacher document hub

### PHASE 3

Tambahkan:

- Dapodik validation
- ATS workflow
- Incident response

### PHASE 4

Tambahkan:

- Integrations
- Multi-school
- Enterprise dashboard
- API

---

# 26. USER FLOW UTAMA

## Early Warning

**Input Data**

↓

**System Detects Pattern**

↓

**Risk Appears**

↓

**Teacher Opens Student**

↓

**Create Follow-up**

↓

**Contact Parent**

↓

**Create Case if Needed**

↓

**Intervention**

↓

**Follow-up**

↓

**Resolved**

---

# 27. CONTOH USE CASE

### Kondisi

Seorang siswa mengalami:

- absensi menurun
- nilai beberapa mata pelajaran turun
- pelanggaran meningkat

### Sistem

Dashboard wali kelas menunjukkan:

**Perlu perhatian**

Guru membuka profil siswa.

Sistem menampilkan faktor yang memicu perhatian.

Guru membuat:

**Follow-up**

Kemudian:

**Hubungi Orang Tua**

Jika diperlukan:

**Create Case → BK**

BK melakukan intervensi.

Semua tindakan tercatat.

---

# 28. DESIGN DIRECTION

## Prinsip utama

**Professional school SaaS.**

Bukan desain AI dashboard.

Jangan menggunakan:

- gradient berlebihan
- glassmorphism berlebihan
- terlalu banyak card
- grafik dekoratif
- glowing effect
- ilustrasi AI generik
- terlalu banyak warna
- angka besar tanpa konteks
- copywriting panjang

### Visual

Gunakan:

- clean
- calm
- trustworthy
- functional
- modern
- compact
- human

### Warna

Gunakan warna dasar netral dengan satu warna utama sebagai accent.

Status menggunakan warna secara konsisten:

- normal
- perhatian
- urgent
- selesai

Jangan menjadikan seluruh halaman berwarna.

---

# 29. UI PRINCIPLE

Setiap halaman harus menjawab:

### 1. Apa yang terjadi?

### 2. Apa yang membutuhkan perhatian?

### 3. Apa yang harus saya lakukan?

Contoh:

Bukan:

**Attendance Analytics**

Tetapi:

**12 siswa membutuhkan perhatian**

**[Lihat siswa]**

---

# 30. NAVIGATION

Sidebar:

**Overview**

**Students**

**Early Warning**

**Cases**

**Attendance**

**Discipline**

**Communication**

**Payments**

**Documents**

**Data Check**

**Incidents**

**Reports**

**Settings**

Menu ditampilkan berdasarkan role.

---

# 31. STUDENT PROFILE

Halaman siswa menjadi pusat informasi.

Header:

**Nama Siswa**
Kelas • Status

Tabs:

**Overview | Attendance | Academic | Discipline | Cases | Communication**

Sidebar:

**Risk Status**

**Open Cases**

**Last Follow-up**

**Parent Contact**

Semua informasi penting tersedia tanpa berpindah banyak halaman.

---

# 32. REPORTING

Laporan:

- Siswa berisiko
- Kehadiran
- Pelanggaran
- Case
- Follow-up
- Pembayaran
- Data validation
- Aktivitas guru
- Incident

Export:

- PDF
- Excel/CSV

---

# 33. ADMIN SETTINGS

### School

- Nama sekolah
- Logo
- Tahun ajaran
- Kelas
- Jurusan

### Users

- Guru
- Operator
- BK
- Bendahara
- Kepala sekolah

### Rules

Sekolah dapat mengatur indikator early warning.

Contoh:

**Attendance threshold**

**Violation threshold**

**Grade trend**

Sistem tidak menentukan diagnosis; sekolah mengatur aturan operasionalnya sendiri.

---

# 34. SUCCESS METRICS

Produk dianggap berhasil apabila:

### Operational

- Waktu menemukan siswa berisiko berkurang
- Follow-up terdokumentasi
- Case overdue berkurang
- Komunikasi penting tidak hilang
- Pekerjaan rekap manual berkurang

### Product

- Weekly active school
- Weekly active teacher
- Case completion rate
- Follow-up completion rate
- Parent engagement
- Data validation completion

### Business

- School conversion
- Monthly recurring revenue
- Retention
- Expansion ke modul lain

---

# 35. METRIK UTAMA PRODUK

North Star Metric:

## **Resolved Student Actions**

Jumlah tindakan siswa yang:

**Detected → Assigned → Followed-up → Resolved**

Karena tujuan produk bukan menghasilkan lebih banyak data.

Tujuannya adalah:

> **lebih banyak masalah terdeteksi dan ditindaklanjuti sebelum menjadi lebih besar.**

---

# 36. BATASAN PRODUK

Tanggapin tidak boleh memposisikan diri sebagai:

- pengganti Dapodik
- pengganti sistem pemerintah
- alat diagnosis siswa
- alat penentu kondisi psikologis siswa
- sistem yang otomatis menentukan hukuman
- sistem yang menjamin pencairan TPG
- sistem yang menjamin ATS kembali sekolah

Tanggapin adalah **alat operasional dan workflow management**.

---

# 37. PRODUCT PRINCIPLE

Seluruh fitur harus mengikuti satu prinsip:

> **“Jangan hanya memberi sekolah informasi. Berikan jalan untuk bertindak.”**

Data → Signal → Action → Owner → Follow-up → Outcome.

Itulah inti bisnis Tanggapin.
