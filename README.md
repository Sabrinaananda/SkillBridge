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
| 🌐 Live Web | [skillbridge-demo.vercel.app](#) *(deploy ke Vercel/Netlify)* |
| 💻 Source Code | [github.com/username/skillbridge](#) |

---

## Deskripsi Produk

**SkillBridge** adalah platform digital yang dirancang untuk membantu pengguna — khususnya **mahasiswa dan fresh graduate** — dalam menemukan peluang kerja yang sesuai dengan kemampuan mereka, sekaligus mengembangkan keterampilan secara berkelanjutan.

Platform ini menggabungkan:
- **AI Job Matching** untuk rekomendasi pekerjaan personal
- **Skill Assessment & Certification** untuk validasi kompetensi
- **Hybrid Platform** (Freelance + Magang) dalam satu ekosistem
- **Mentorship** dari profesional berpengalaman
- **Portfolio Builder** otomatis
- **Gamification & Reward** system

---

## Fitur Utama

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | AI Job Matching & Skill Gap Analysis | Analisis profil pengguna (CV, skill, pengalaman) dan memberikan rekomendasi pekerjaan relevan serta identifikasi kesenjangan skill |
| 2 | Hybrid Platform (Freelance + Magang) | Dua jenis peluang dalam satu platform dengan sistem pencarian dan pengelolaan terintegrasi |
| 3 | Skill Assessment & Certification | Tes kemampuan (hard skill & soft skill) menghasilkan sertifikat/badge sebagai validasi kompetensi |
| 4 | One-Click Apply + Auto CV | Lamar pekerjaan dengan satu klik menggunakan CV yang dihasilkan otomatis dari profil |
| 5 | Mentorship & Career Path | Mentoring dengan profesional dan roadmap karir untuk pengembangan diri |
| 6 | Real-time Chat & Interview Scheduling | Komunikasi langsung kandidat–recruiter dan penjadwalan interview otomatis |
| 7 | Project-Based Internship | Model magang berbasis proyek nyata yang fleksibel |
| 8 | Transparency System | Lacak status lamaran real-time dan dapatkan feedback dari recruiter |
| 9 | Portfolio Builder | Otomatis mengumpulkan hasil kerja/proyek menjadi portofolio digital |
| 10 | Gamification & Reward | Poin, badge, dan reward atas aktivitas pengguna untuk meningkatkan engagement |

---

## Teknologi

- **HTML5** – Struktur halaman
- **CSS3** – Styling dengan CSS Variables, Flexbox, Grid, Animasi
- **Vanilla JavaScript** – Interaktivitas, DOM manipulation, filtering
- **Google Fonts** – Sora & DM Sans
- **Font Awesome 6** – Icon library

---

## Cara Menjalankan

```bash
# Clone repository
git clone https://github.com/username/skillbridge.git

# Masuk ke folder
cd skillbridge

# Buka langsung di browser (no build needed)
open index.html
```

Atau buka file `index.html` langsung di browser karena pure HTML/CSS/JS tanpa dependency build.

---

## Struktur Proyek

```
skillbridge/
├── index.html       # Single-page application (semua fitur dalam 1 file)
└── README.md        # Dokumentasi proyek
```

---

## Pengujian Aspek Kualitas

Pengujian dilakukan secara manual berdasarkan **aspek kualitas ISO 25010** yang sesuai dengan fitur SkillBridge.

### Hasil Pengujian

| No | Aspek Kualitas | Skenario Uji | Langkah Uji | Expected Result | Actual Result | Status |
|----|---------------|--------------|-------------|-----------------|---------------|--------|
| 1 | **Functionality – Completeness** | Semua 10 fitur rancangan DP6 tersedia di web | Cek tampilan dan navigasi semua seksi (Fitur, Jobs, Assessment, Mentorship, Portfolio, Chat, Gamification) | Semua 10 fitur terepresentasi di halaman | Semua fitur tersedia dan terlihat di halaman | ✅ PASS |
| 2 | **Functionality – Correctness** | Filter lowongan bekerja sesuai kategori | Klik tombol filter "Freelance", "Magang", "Remote", "Tech", "Design" | Kartu lowongan berubah sesuai kategori yang dipilih | Konten grid berhasil difilter sesuai tombol yang diklik | ✅ PASS |
| 3 | **Functionality – Appropriateness** | Modal daftar dan login muncul dengan benar | Klik tombol "Daftar Gratis" dan "Masuk" di navbar | Modal formulir terbuka dengan field yang sesuai | Modal terbuka dengan form lengkap sesuai tipe | ✅ PASS |
| 4 | **Usability – Learnability** | Pengguna baru dapat memahami alur utama | Navigasi ke seksi Jobs → Klik "Lamar ⚡" → Isi form → Submit | Alur melamar kerja bisa dilakukan tanpa panduan | Alur berjalan intuitif: tombol jelas, feedback muncul | ✅ PASS |
| 5 | **Usability – User Interface Aesthetics** | Tampilan konsisten dan menarik di semua seksi | Scroll dari atas ke bawah, cek warna, font, spacing | Tampilan konsisten, profesional, tidak ada elemen rusak | Desain dark theme konsisten, tipografi seragam | ✅ PASS |
| 6 | **Usability – Operability** | Chat berfungsi interaktif | Ketik pesan di chat box → tekan Enter atau klik tombol kirim | Pesan muncul di chat body, ada auto-reply | Pesan terkirim dan muncul, auto-reply muncul setelah 1.2 detik | ✅ PASS |
| 7 | **Reliability – Availability** | Web dapat dibuka tanpa error di berbagai browser | Buka di Chrome, Firefox, Edge | Halaman load sempurna tanpa error console | Halaman berhasil dibuka normal di Chrome, Firefox, Edge | ✅ PASS |
| 8 | **Reliability – Fault Tolerance** | Input kosong tidak menyebabkan error | Klik "Lamar Sekarang" tanpa isi cover letter | Aplikasi tetap berjalan, tidak crash | Toast sukses muncul, tidak ada error | ✅ PASS |
| 9 | **Performance – Time Behaviour** | Halaman load cepat | Buka halaman pertama kali, ukur waktu load | Halaman dapat digunakan dalam < 3 detik | Load time < 2 detik (hanya satu file HTML) | ✅ PASS |
| 10 | **Performance – Resource Utilization** | Animasi scroll reveal tidak lag | Scroll cepat dari atas ke bawah | Animasi reveal berjalan smooth, tidak frame drop | Animasi berjalan 60fps, tidak ada lag terdeteksi | ✅ PASS |
| 11 | **Maintainability – Modularity** | Kode terstruktur per fitur | Review source code, cek pembagian seksi | Kode dibagi per seksi dengan komentar jelas | Kode menggunakan komentar `/* === SEKSI === */` | ✅ PASS |
| 12 | **Portability – Adaptability** | Tampilan responsif di mobile (viewport 375px) | Buka DevTools → set viewport 375px → scroll | Layout menyesuaikan, tidak ada overflow horizontal | Navbar, card, dan layout beradaptasi ke mobile | ✅ PASS |
| 13 | **Portability – Adaptability** | Tampilan responsif di tablet (viewport 768px) | Set viewport 768px di DevTools | Grid menyesuaikan jumlah kolom | Grid berubah dari 3 kolom ke 2 kolom | ✅ PASS |
| 14 | **Interaction – Feedback** | Toast notification muncul setelah aksi | Lakukan: daftar, lamar, booking mentor, kirim pesan | Pesan notifikasi muncul di pojok kanan bawah | Toast muncul dengan ikon dan teks sesuai aksi | ✅ PASS |
| 15 | **Interaction – Gamification** | Panel gamification menampilkan data benar | Scroll ke seksi Portfolio & Gamification | Badge, XP bar, level, dan streak streak tampil | Level 8, XP bar 68%, 4 badge earned, streak 14 hari | ✅ PASS |
| 16 | **Transparency – Tracking** | Status lamaran terbaca jelas | Scroll ke seksi Komunikasi & Transparansi | Timeline status lamaran menampilkan tahap saat ini | 3 lamaran ditampilkan dengan status berbeda dan timeline | ✅ PASS |

### Ringkasan Hasil Pengujian

| Aspek | Total Uji | Lulus | Gagal | Persentase |
|-------|-----------|-------|-------|------------|
| Functionality | 3 | 3 | 0 | 100% |
| Usability | 3 | 3 | 0 | 100% |
| Reliability | 2 | 2 | 0 | 100% |
| Performance | 2 | 2 | 0 | 100% |
| Maintainability | 1 | 1 | 0 | 100% |
| Portability | 2 | 2 | 0 | 100% |
| Interaction | 2 | 2 | 0 | 100% |
| Transparency | 1 | 1 | 0 | 100% |
| **Total** | **16** | **16** | **0** | **100%** |

---

## Mapping Fitur DP6 → Implementasi DP7

| Fitur DP6 | Implementasi di Web |
|-----------|---------------------|
| AI Job Matching | Match Score bar di setiap kartu lowongan |
| Hybrid Platform | Filter Freelance/Magang, badge tipe di kartu |
| Skill Assessment | Seksi Assessment dengan progress bar skill + cert cards |
| One-Click Apply | Tombol "Lamar ⚡" → modal apply langsung |
| Mentorship | Seksi mentor card + modal booking sesi |
| Real-time Chat | Chat panel interaktif dengan auto-reply |
| Project-Based Internship | Kartu lowongan tipe Magang berbasis proyek |
| Transparency System | Timeline status lamaran 4 tahap |
| Portfolio Builder | Daftar proyek dengan XP badge |
| Gamification & Reward | Level, XP bar, badge grid, streak counter |

---

## Developer

**Sabrina Ananda Rizkita Fatmantara Putri**  
NIM: 202310370311206  
Rekayasa Kebutuhan D – Universitas Muhammadiyah Malang  

---

*Daily Project 7 – SkillBridge Web Implementation*
