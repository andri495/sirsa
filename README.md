# SIRSA - Sistem Informasi Pengaduan Masyarakat Berbasis AI

Aplikasi web modern untuk pelaporan dan penanganan keluhan fasilitas publik masyarakat berbasis klasifikasi kecerdasan buatan (NLP). Dibuat untuk memenuhi kriteria tugas pemrograman web dengan tampilan responsif (HP dan Laptop).

---

## 🌟 Fitur Utama

1. **Halaman Login (`login.html`)**:
   - Tampilan modern dengan split-screen banner SIRSA.
   - Pilihan peran: **Petugas / Admin** & **Warga / Pelapor**.
   - Tombol **1-Click Isi Cepat Akun Demo** untuk kemudahan penilaian dan pengujian.
   - Fitur lihat/sembunyikan kata sandi (toggle password visibility).
   - Validasi formulir & status otentikasi tersimpan di `localStorage`.

2. **Halaman Form Pengaduan (`form.html` & Widget di `index.html`)**:
   - **Real-Time AI Classification**: Saat mengetik deskripsi (misal: "jalan berlubang", "sampah bau pasar", "got banjir"), AI secara otomatis memprediksi kategori (Infrastruktur, Sampah, Layanan Publik, Drainase, Keamanan) dan tingkat prioritas (Tinggi, Sedang, Rendah).
   - Upload foto bukti kerusakan dengan drag & drop dan instant preview gambar.
   - Tombol simulasi **Deteksi Lokasi GPS Saya**.
   - Validasi NIK 16 digit sesuai standar KTP.
   - Modal penerbitan tiket aduan resmi (contoh: `#SR-12482`).

3. **Halaman Daftar Pengaduan (`daftar.html` & View di `index.html`)**:
   - Menampilkan daftar lengkap laporan masyarakat.
   - **Pencarian Real-Time**: Berdasarkan Nomor Tiket, Judul, Pelapor, atau Lokasi.
   - **Filter Multi-Kriteria**: Filter berdasarkan Kategori, Prioritas Urgensi, dan Status (Menunggu, Diproses, Selesai).
   - **Modal Detail Interaktif**: Melihat rincian lengkap, foto kerusakan, akurasi AI, dan fitur bagi Admin untuk memperbarui status penanganan serta menambahkan catatan petugas.
   - **Export CSV**: Mengunduh data seluruh laporan ke format file `.csv`.
   - **Cetak / PDF**: Fitur siap cetak untuk laporan rekapitulasi.

4. **Dashboard Utama (`index.html`)**:
   - Tampilan identik 100% dengan mockup referensi UI.
   - 4 Kartu Statistik Dinamis (*Total Laporan*, *Diproses AI*, *Prioritas Tinggi*, *Selesai*).
   - Tabel *Daftar Laporan - Klasifikasi AI* dengan pagination.
   - Widget *Formulir Pelaporan Warga* dan kotak *AI Insight*.

5. **Responsif di HP dan Laptop**:
   - **Laptop / Layar Besar**: Layout 2 kolom yang lega dengan sidebar navigasi tetap.
   - **Tablet / Layar Sedang**: Penyesuaian grid kartu statistik 2x2.
   - **HP / Mobile**: Menu navigasi laci samping (*off-canvas drawer* dengan tombol hamburger), konversi tabel ke tampilan kartu (*mobile card view*), dan tombol ramah sentuhan layar.

---

## 🚀 Cara Menjalankan

### Cara 1: Langsung Buka di Browser (Tanpa Instalasi Apapun)
Anda bisa langsung mengklik dua kali salah satu file berikut pada File Explorer / Finder:
- `index.html` (Dashboard & Aplikasi Utama)
- `login.html` (Halaman Login)
- `form.html` (Halaman Form Pengaduan)
- `daftar.html` (Halaman Daftar Pengaduan)

### Cara 2: Menjalankan Local Web Server

Menggunakan **Node.js**:
```bash
npm start
# atau
npx serve -l 3000 .
```

Menggunakan **Python**:
```bash
python3 -m http.server 3000
```
Buka browser pada: `http://localhost:3000`

---

## 📂 Struktur File Proyek

```
tugas sirsa/
├── index.html           # Master App & Dashboard utama (sesuai gambar mockup)
├── dashboard.html       # File Dashboard SIRSA
├── login.html           # Halaman Login Admin & Warga (Root)
├── form.html            # Halaman Form Pengaduan Warga (Root)
├── daftar.html          # Halaman Daftar Pengaduan & Manajemen Status (Root)
├── package.json         # Konfigurasi npm script
├── README.md            # Dokumentasi proyek
├── auth/                # 📁 FOLDER AUTH (Modul Autentikasi Pengguna)
│   ├── index.html       # Auto redirect ke login
│   ├── login.html       # Halaman Login Akun Warga & Petugas
│   ├── register.html    # Halaman Pendaftaran Akun Baru (NIK 16 digit, password strength)
│   └── daftar.html      # Alias registrasi akun
├── user/                # 📁 FOLDER USER (Modul Antarmuka Warga / Pengguna)
│   ├── index.html       # Auto redirect ke dashboard user
│   ├── dashboard.html   # File Dashboard Warga (Statistik aduan saya, quick form AI, pelacakan)
│   ├── form.html        # Formulir Pengaduan Warga dengan Realtime NLP AI
│   ├── daftar.html      # Riwayat dan Status Lengkap Aduan Warga
│   └── profil.html      # Profil dan Data Kependudukan Terverifikasi
├── Frontend 1/          # 📁 FOLDER FRONTEND 1 (Struktur Terpadu Praktikum Frontend 1)
│   ├── auth/            # Modul Auth dalam Frontend 1
│   ├── user/            # Modul User dalam Frontend 1
│   ├── dashboard.html   # File Dashboard dalam Frontend 1
│   ├── index.html       # Index App Frontend 1
│   ├── css/             # Stylesheet
│   ├── js/              # Logika & Engine NLP AI
│   └── assets/          # Logo dan ikon
├── css/
│   └── style.css        # Desain responsif, tipografi Plus Jakarta Sans, warna mockup
├── js/
│   ├── app.js           # Logika interaktivitas SPA, modal, filter, dan routing
│   ├── ai-classifier.js # Mesin NLP pemrosesan teks AI (Kategori & Prioritas)
│   └── mock-data.js     # Data simulasi aduan awal & penyimpanan LocalStorage
└── assets/
    └── sirsa-logo.svg   # Logo vektor resmi SIRSA (Radar Crosshair)
```

---

## 🎨 Teknologi yang Digunakan
- **HTML5**: Semantik dan aksesibel.
- **CSS3**: Vanilla CSS dengan CSS Custom Properties (Variables), Flexbox, CSS Grid, Glassmorphism, dan Breakpoints Responsif.
- **JavaScript (ES6+)**: Logika reaktif, DOM manipulation, manipulasi LocalStorage, dan NLP tokenizer.
# sirsa
