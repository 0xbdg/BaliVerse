# UI/UX Specification: "Bali: The Island of Gods" (3D Web Experience)

## 1. Filosofi Desain (Design Philosophy)
* **Spatial-First Approach:** Kanvas 3D adalah bintang utama. Elemen antarmuka (UI 2D) harus terasa melayang (*floating*), minimalis, dan tidak menghalangi pandangan ke pulau 3D.
* **Tropical Glassmorphism:** Menggunakan efek kaca buram (*backdrop-blur*) dengan sentuhan warna hangat agar menyatu harmonis dengan pencahayaan matahari terbenam/siang hari di dunia 3D.
* **Cultural Modernism:** Menggabungkan tata letak antarmuka web modern yang bersih dengan aksen ornamen khas Bali (garis geometris *ukiran*, siluet Candi Bentar, dan palet warna alami).

---

## 2. Sistem Desain (Design System)

### A. Palet Warna (Color Palette)
* **Glass Surface (Light Mode / Siang):** `rgba(255, 252, 245, 0.72)` dengan `backdrop-filter: blur(16px)` dan border `1px solid rgba(255, 255, 255, 0.5)`.
* **Glass Surface (Dark Mode / Malam):** `rgba(18, 24, 28, 0.78)` dengan `backdrop-filter: blur(16px)` dan border `1px solid rgba(255, 215, 130, 0.2)`.
* **Primary Accent (Bali Gold / Emas Agung):** `#D99B26` (Untuk tombol aksi utama, indikator aktif, dan *highlight*).
* **Secondary Accent (Turquoise Sea / Biru Uluwatu):** `#008080` / `#14B8A6` (Untuk elemen interaktif sekunder dan *badge* kategori).
* **Text Primary:** `#1C1917` (Siang) / `#FAF8F5` (Malam).
* **Text Secondary:** `#57534E` (Siang) / `#A8A29E` (Malam).

### B. Tipografi (Typography)
* **Display / Heading Font:** *Cinzel* atau *Cormorant Garamond* (Memberikan kesan elegan, klasik, dan sakral untuk nama destinasi seperti "ULUWATU" atau "UBUD").
* **Body / UI Font:** *Plus Jakarta Sans* atau *Inter* (Sangat terbaca untuk deskripsi panjang, tombol, dan metadata pada ukuran kecil).
* **Skala Ukuran:**
  * Hero Title: `2.5rem` (40px) - Bold
  * Drawer Destination Title: `1.75rem` (28px) - SemiBold
  * Body Text: `0.9375rem` (15px) - Regular, *line-height* `1.6`
  * Micro Label / Badge: `0.75rem` (12px) - Medium, *uppercase*, *letter-spacing* `0.08em`

---

## 3. Tata Letak Layar & Komponen (Screen Layout & Components)

### A. Loading Screen (Layar Pemuatan Awal)
* **Latar Belakang:** Warna krem hangat (`#FAF6EE`) dengan tekstur kertas halus.
* **Elemen Tengah:** 
  * Ilustrasi vektor garis (SVG) Gapura Candi Bentar atau topeng Barong yang terisi warna secara bertahap seiring persentase *loading* (`0%` - `100%`).
  * Teks fakta singkat acak tentang Bali di bawah *progress bar* (Contoh: *"Tahukah kamu? Subak adalah sistem irigasi tradisional Bali yang diakui UNESCO sejak 2012."*).
* **Transisi Keluar:** *Fade-out* perlahan bersamaan dengan kamera 3D yang melakukan *zoom-in* dari atas awan menuju Pulau Bali.

### B. Main HUD (Heads-Up Display - Tampilan Utama)
1. **Top-Left (Header & Branding):**
   * Logo minimalis + Judul **"BALI 3D"** dengan subjudul *"Interactive Island Explorer"*.
2. **Top-Right (Environment & Audio Controls):**
   * **Day/Night Switcher:** Tombol *pill* interaktif (Ikon Matahari / Bulan) untuk mengubah pencahayaan 3D secara *real-time*.
   * **Audio Toggle:** Tombol bundar dengan animasi gelombang suara (*equalizer* kecil) untuk mematikan/menyalakan musik Rindik & suara ombak.
   * **Help / Controls Info (`?`):** Membuka *modal* kecil berisi panduan kontrol *mouse/touch*.
3. **Bottom-Center (Floating Dock Menu):**
   * *Dock* melayang berbentuk kapsul berisi daftar cepat 6 destinasi utama (Ubud, Uluwatu, Kintamani, Tanah Lot, Nusa Penida, Canggu).
   * Tombol khusus **"Mulai Tur Terpandu" (Guided Tour)** dengan aksen warna Emas (`#D99B26`).

### C. 3D Spatial Pins (Hotspots pada Peta)
* **Bentuk:** Penanda melayang di atas koordinat 3D yang terdiri dari titik bercahaya (*pulsing dot*) dan label nama tempat yang selalu menghadap kamera (*billboard*).
* **Interaksi Hover:** Pin membesar (`scale: 1.15`), label berubah warna menjadi Emas, dan muncul pratinjau kategori kecil (misal: *Budaya & Alam*).

### D. Destination Detail Drawer (Panel Informasi Destinasi)
Muncul dari sisi kanan layar (`width: 420px` di desktop, *bottom sheet* `height: 65vh` di mobile) saat *pin* diklik:
* **Header Panel:** Tombol tutup (`X`) atau "Kembali ke Peta", *badge* kategori wisata, dan judul destinasi.
* **Media Carousel:** Galeri 3-4 foto resolusi tinggi atau video pendek asli lokasi tersebut.
* **Tab Navigasi Internal:**
  1. **Ringkasan:** Deskripsi daya tarik, sejarah singkat, dan waktu terbaik berkunjung.
  2. **Aktivitas & Kuliner:** Daftar rekomendasi kegiatan (misal: *Menonton Tari Kecak*) dan makanan khas terdekat (misal: *Babi Guling / Bebek Betutu*).
  3. **Info Praktis:** Estimasi jarak & waktu tempuh dari Bandara I Gusti Ngurah Rai (DPS) serta kisaran tiket masuk.
* **Footer Panel:** Tombol navigasi cepat **"Destinasi Berikutnya →"** untuk berpindah antar lokasi tanpa harus keluar ke peta utama.

### E. Guided Tour Overlay (Mode Tur Otomatis)
* Saat mode tur aktif, HUD utama disembunyikan agar tampilan sinematik.
* Muncul **Subtitle Card** di bagian bawah layar berisi narasi cerita destinasi yang sedang disorot kamera, lengkap dengan tombol *Pause/Resume*, *Next*, dan *Exit Tour*.

---

## 4. Responsivitas (Mobile vs Desktop)
* **Desktop (`> 1024px`):** Panel detail berada di sisi kanan (mengambil 30% lebar layar), sementara kamera 3D menggeser titik fokus objek (*camera offset*) sedikit ke kiri agar objek tidak tertutup panel.
* **Mobile (`< 768px`):** 
  * *Dock Menu* di bagian bawah dapat digeser secara horizontal (*horizontal scroll*).
  * Panel detail menggunakan komponen *Bottom Sheet* yang bisa ditarik ke atas/bawah (*swipeable*).
  * Menambahkan dukungan gestur sentuh (*1-finger rotate, 2-finger pinch to zoom*).

---

## 5. Aksesibilitas & Fallback (Accessibility)
* **Keyboard Navigation:** Pengguna dapat menekan tombol panah Kiri/Kanan untuk berpindah antar destinasi dan `Esc` untuk kembali ke tampilan peta penuh.
* **Reduced Motion:** Jika pengguna mengaktifkan pengaturan *Reduce Motion* di OS mereka, transisi kamera GSAP dipercepat atau dibuat instan tanpa efek *swing* berlebihan.
* **Low-End Device Banner:** Notifikasi halus jika FPS turun di bawah 20 FPS, menawarkan tombol untuk mematikan bayangan (*shadows*) dan partikel.
