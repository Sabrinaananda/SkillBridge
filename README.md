# SkillBridge

> Platform digital yang mengintegrasikan pencarian kerja **freelance** dan **magang** dalam satu ekosistem berbasis teknologi cerdas berbasis AI.

**Dibuat oleh:** Sabrina Ananda Rizkita Fatmantara Putri  
**NIM:** 202310370311206  
**Mata Kuliah:** Rekayasa Kebutuhan D  
**Tugas:** Daily Project 7

---

## Links

| Tipe | Link |
|------|------|
| Live Web | [https://sabrinaananda.github.io/SkillBridge/](#) |
| Source Code | [https://github.com/Sabrinaananda/SkillBridge/](#) |

---

## Deskripsi Produk

**SkillBridge** adalah platform digital yang dirancang untuk membantu **mahasiswa dan fresh graduate** menemukan peluang kerja yang sesuai kemampuan mereka, sekaligus mengembangkan keterampilan secara berkelanjutan.

Versi ini merupakan implementasi multi-halaman penuh dengan backend autentikasi nyata menggunakan **Supabase**, sehingga pengguna dapat benar-benar mendaftar, masuk, dan mengakses profil pribadi mereka.

---

## Fitur Utama

| No | Fitur | Halaman | Deskripsi |
|----|-------|---------|-----------|
| 1 | **Landing Page & AI Matching** | `index.html` | Hero, preview lowongan, mentor unggulan, dan CTA utama |
| 2 | **Direktori Lowongan** | `lowongan.html` | 12+ lowongan dengan filter kategori, tipe, dan search real-time |
| 3 | **Skill Assessment** | `skill-assessment.html` | Quiz interaktif, timer, hasil skor, sertifikat, dan learning path AI |
| 4 | **Mentorship** | `mentorship.html` | Direktori 6 mentor, drawer profil detail, booking sesi, mini chat |
| 5 | **Portfolio Builder** | `portfolio-builder.html` | Builder drag-drop dengan AI tips, analitik views, dan template picker |
| 6 | **Gamification & Reward** | `gamification.html` | XP, level, badge, misi harian, leaderboard, dan reward store |
| 7 | **Real-time Chat** | `chat.html` | Chat 3-panel, daftar kontak, interview scheduler |
| 8 | **Profil Pengguna** | `profil.html` | Data akun dari Supabase, riwayat lamaran, aktivitas, dan pengaturan |

---

## Autentikasi (Supabase)

Sistem auth menggunakan **Supabase Auth** yang terintegrasi di semua halaman melalui satu file `auth.js`.

### Alur Pengguna

```
Daftar → Profil dibuat otomatis di database → Redirect ke profil.html
Masuk  → Fetch data profil dari Supabase    → Redirect ke profil.html
Keluar → Session dihapus                    → Redirect ke index.html
```

### Fitur Auth

| Fitur | Keterangan |
|-------|-----------|
| ✅ Register | Nama, email, password, dan role (Mahasiswa / Fresh Graduate / Profesional) |
| ✅ Login | Email + password dengan pesan error yang ramah |
| ✅ Auto profil | Trigger database membuat row profil otomatis saat user daftar |
| ✅ Session persist | Login tetap aktif walau tab ditutup |
| ✅ Forgot password | Kirim link reset ke email |
| ✅ Password strength | Indikator kekuatan password real-time |
| ✅ Show/hide password | Toggle visibilitas password |
| ✅ Protected pages | `profil.html`, `portfolio-builder.html`, `chat.html` redirect ke home jika belum login |
| ✅ Nav dinamis | Navbar berubah otomatis — tampilkan avatar + dropdown jika sudah login |

---

## Setup Database Supabase

> **Wajib dijalankan sebelum pertama kali dipakai.**

### Langkah-langkah

1. Buka [supabase.com](https://supabase.com) → login → pilih project SkillBridge
2. Klik menu **SQL Editor** di sidebar kiri
3. Klik **New Query**
4. Salin seluruh isi file `supabase_setup.sql` dan paste ke editor
5. Klik **Run** (atau tekan `Ctrl+Enter`)
6. Pastikan output menampilkan nama tabel: `lamaran`, `profiles`, `user_badges`

### Tabel yang Dibuat

| Tabel | Fungsi |
|-------|--------|
| `profiles` | Data profil pengguna (nama, role, bio, lokasi, link, XP, level, streak) |
| `lamaran` | Riwayat lamaran kerja per user |
| `user_badges` | Badge/pencapaian gamifikasi per user |

### Matikan Konfirmasi Email *(agar bisa langsung login setelah daftar)*

1. Di Supabase dashboard → **Authentication** → **Providers** → **Email**
2. Matikan toggle **"Confirm email"**
3. Klik **Save**

---

## 🛠️ Teknologi

| Teknologi | Fungsi |
|-----------|--------|
| **HTML5** | Struktur 8 halaman terpisah |
| **CSS3** | CSS Variables, Flexbox, Grid, animasi, dark theme |
| **Vanilla JavaScript** | Interaktivitas, DOM, filter, quiz engine |
| **Supabase JS v2** | Auth (login/register/session) + database (profiles) |
| **Google Fonts** | Sora & DM Sans |
| **Font Awesome 6** | Icon library |

---

## Cara Menjalankan

### 1. Setup Database (sekali saja)

Jalankan `supabase_setup.sql` di Supabase SQL Editor (lihat panduan di atas).

### 2. Jalankan di Lokal

```bash
# Clone atau ekstrak folder project
cd skillbridge_final

# Buka via Live Server (direkomendasikan)
# Install ekstensi Live Server di VSCode, klik kanan index.html → Open with Live Server
```

> Jalankan melalui **Live Server** (VSCode extension) atau server lokal agar Supabase Auth bekerja dengan benar. Jangan buka langsung sebagai `file://`.

### 3. Deploy ke Vercel / Netlify

Cukup drag & drop seluruh folder ke dashboard Vercel atau Netlify — langsung live tanpa konfigurasi tambahan.

---

## Struktur Proyek

```
skillbridge_final/
├── index.html              # Landing page & AI job matching
├── lowongan.html           # Direktori lowongan kerja
├── skill-assessment.html   # Assessment, quiz, sertifikasi
├── mentorship.html         # Direktori mentor & booking
├── portfolio-builder.html  # Builder portfolio (protected)
├── gamification.html       # XP, badge, leaderboard, rewards
├── chat.html               # Real-time chat & interview scheduler (protected)
├── profil.html             # Profil user dari Supabase (protected)
├── auth.js                 # Supabase Auth — shared semua halaman
├── supabase_setup.sql      # Script setup database Supabase
└── README.md               # Dokumentasi ini
```

---

## Pengujian Aspek Kualitas (ISO 25010)

| No | Aspek Kualitas | Skenario Uji | Expected Result | Actual Result | Status |
|----|---------------|--------------|-----------------|---------------|--------|
| 1 | **Functionality – Completeness** | Semua 8 halaman tersedia dan terhubung via navbar | Semua link navbar mengarah ke halaman yang benar | Navigasi antar 8 halaman berjalan tanpa error | ✅ PASS |
| 2 | **Functionality – Correctness** | Daftar akun baru → profil terbuat otomatis di Supabase | Row profil muncul di tabel `profiles` | Trigger Supabase membuat profil otomatis setelah register | ✅ PASS |
| 3 | **Functionality – Correctness** | Login dengan email & password yang benar | Redirect ke `profil.html`, nama muncul di navbar | Session terbentuk, nama dari Supabase tampil di nav | ✅ PASS |
| 4 | **Functionality – Appropriateness** | Filter lowongan bekerja sesuai kategori | Kartu lowongan berubah sesuai filter yang dipilih | Filter Freelance/Magang/Remote/Tech bekerja real-time | ✅ PASS |
| 5 | **Usability – Learnability** | Pengguna baru dapat mendaftar tanpa panduan | Form register mudah dimengerti, error jelas | Alur daftar → login → profil berjalan intuitif | ✅ PASS |
| 6 | **Usability – Aesthetics** | Tampilan konsisten di semua 8 halaman | Dark theme, font, spacing seragam | Design system konsisten di semua halaman | ✅ PASS |
| 7 | **Usability – Operability** | Quiz assessment berjalan dengan timer | Soal muncul, timer hitung mundur, hasil tampil | Quiz engine berjalan, highlight jawaban benar/salah | ✅ PASS |
| 8 | **Reliability – Availability** | Web dibuka di Chrome, Firefox, Edge | Halaman load sempurna tanpa error console | Berhasil dibuka normal di semua browser modern | ✅ PASS |
| 9 | **Reliability – Fault Tolerance** | Login dengan password salah tidak crash | Pesan error muncul, form tetap aktif | Pesan "Email atau password salah" muncul, app tidak crash | ✅ PASS |
| 10 | **Reliability – Fault Tolerance** | Akses `profil.html` tanpa login | Redirect ke `index.html` | Protected page redirect otomatis ke halaman utama | ✅ PASS |
| 11 | **Performance – Time Behaviour** | Halaman load pertama kali | Load < 3 detik | Load time < 2 detik (pure HTML/CSS/JS + CDN) | ✅ PASS |
| 12 | **Performance – Resource Utilization** | Animasi scroll reveal tidak lag | Animasi 60fps, tidak ada frame drop | Animasi IntersectionObserver berjalan smooth | ✅ PASS |
| 13 | **Maintainability – Modularity** | Auth terpisah di `auth.js` yang dipakai semua halaman | Satu file auth untuk 8 halaman | `auth.js` di-include di semua halaman, tidak duplikasi kode | ✅ PASS |
| 14 | **Portability – Adaptability** | Tampilan responsif di mobile 375px | Layout menyesuaikan, tidak ada overflow | Navbar collapse, card stack 1 kolom di mobile | ✅ PASS |
| 15 | **Portability – Adaptability** | Tampilan responsif di tablet 768px | Grid menyesuaikan jumlah kolom | Grid berubah dari 3 kolom ke 2 kolom | ✅ PASS |
| 16 | **Security – Confidentiality** | User hanya bisa akses data profil sendiri | Data user lain tidak bisa diakses | Row Level Security (RLS) Supabase aktif di semua tabel | ✅ PASS |
| 17 | **Interaction – Feedback** | Toast notification muncul setelah aksi | Notifikasi muncul di pojok kanan bawah | Toast muncul dengan ikon & teks sesuai aksi | ✅ PASS |
| 18 | **Interaction – Gamification** | Halaman gamification menampilkan data lengkap | Badge, XP bar, leaderboard, misi, reward store tampil | Semua komponen gamifikasi interaktif dan responsif | ✅ PASS |

### Ringkasan

| Aspek | Total Uji | Lulus | Gagal | Persentase |
|-------|-----------|-------|-------|------------|
| Functionality | 4 | 4 | 0 | 100% |
| Usability | 3 | 3 | 0 | 100% |
| Reliability | 3 | 3 | 0 | 100% |
| Performance | 2 | 2 | 0 | 100% |
| Maintainability | 1 | 1 | 0 | 100% |
| Portability | 2 | 2 | 0 | 100% |
| Security | 1 | 1 | 0 | 100% |
| Interaction | 2 | 2 | 0 | 100% |
| **Total** | **18** | **18** | **0** | **100%** |

---

## Mapping Fitur → Implementasi

| Fitur | Implementasi di Web |
|-------|---------------------|
| AI Job Matching | Match Score bar di setiap kartu lowongan + rekomendasi learning path AI |
| Hybrid Platform | Filter Freelance/Magang, badge tipe di kartu lowongan |
| Skill Assessment | Quiz interaktif 10–15 soal, timer, highlight jawaban, skor, sertifikat |
| One-Click Apply | Tombol "Lamar ⚡" → modal apply dengan cover letter |
| Mentorship | Direktori mentor + drawer profil + booking slot + mini chat |
| Real-time Chat | Chat 3-panel: kontak, percakapan, interview scheduler |
| Portfolio Builder | Editor drag-drop, AI tips, analitik views, template picker, publish |
| Gamification | XP, level, badge, streak, misi harian, leaderboard, reward store |
| Transparency | Status lamaran real-time di halaman profil |
| Auth & Database | Supabase Auth + PostgreSQL dengan RLS dan trigger otomatis |

---

## Developer

**Sabrina Ananda Rizkita Fatmantara Putri**  
NIM: 202310370311206  
Rekayasa Kebutuhan D — Universitas Muhammadiyah Malang

---

*Daily Project 7 & 8 — SkillBridge Full-Stack Web Implementation*
