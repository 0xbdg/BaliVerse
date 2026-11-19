# Project Specification: "Bali: The Island of Gods" - Interactive 3D Tourism Experience

## 1. Ringkasan Proyek (Project Overview)
**Nama Proyek:** Bali 3D Experience (atau *Pulau Dewata Interactive*)  
**Deskripsi:** Sebuah platform web eksplorasi wisata Bali yang imersif dan interaktif menggunakan teknologi WebGL/Three.js. Pengguna dapat menjelajahi peta topografi pulau Bali dalam bentuk 3D bergaya *stylized/low-poly* atau *semi-realistic*, berinteraksi dengan berbagai *landmark* ikonik, melihat informasi budaya, kuliner, hingga merencanakan rute perjalanan secara visual.  
**Target Audiens:** Wisatawan domestik dan mancanegara, *travel blogger*, agen perjalanan, serta penikmat seni digital interaktif.  
**Tujuan Utama:** Memberikan pengalaman pra-wisata (*pre-travel experience*) yang memukau sehingga meningkatkan minat wisatawan untuk berkunjung ke Bali secara nyata.

---

## 2. Arsitektur Teknologi (Tech Stack)
* **Core 3D Engine:** Three.js (atau React Three Fiber / `@react-three/fiber` & `@react-three/drei` jika menggunakan ekosistem React).
* **Frontend Framework:** Next.js / React / Vite (disarankan Vite + React untuk performa *bundling* yang cepat).
* **Styling & UI Overlay:** Tailwind CSS + Framer Motion (untuk transisi antarmuka 2D yang mulus di atas kanvas 3D).
* **Animasi 3D & Kamera:** GSAP (GreenSock Animation Platform) untuk pergerakan kamera yang sinematik (*smooth camera transitions*).
* **3D Modeling & Assets:** Blender (ekspor ke format `.glb` / `.gltf` dengan kompresi Draco).
* **Audio:** Howler.js atau Web Audio API (untuk *ambience* suara gamelan, deburan ombak, dan kicau burung).

---

## 3. Konsep Visual & Estetika (Art Direction)
* **Gaya Visual:** *Stylized Diorama / Miniature World* dengan pencahayaan hangat khas tropis (*Golden Hour* atau *Bright Tropical Daylight*).
* **Palet Warna:**
  * Hijau Zamrud & Terasering (*Ubud / Jatiluwih*)
  * Biru Pirus & Gradasi Laut (*Uluwatu / Nusa Penida*)
  * Terakota & Batu Vulkanik (*Pura / Gunung Agung*)
  * Emas & Putih (*Ornamen Budaya & Awan*)
* **Atmosfer:** Efek partikel ringan seperti kelopak bunga kamboja yang jatuh, riak air laut yang bergerak (*custom water shader*), kabut tipis di area pegunungan, dan awan yang melintas perlahan.

---

## 4. Fitur Utama & Interaktivitas (Core Features)

### A. Eksplorasi Peta Pulau Bali 3D (Interactive Island Map)
* **Kontrol Kamera:** Pengguna dapat melakukan *Orbit* (memutar), *Zoom* (memperbesar/memperkecil), dan *Pan* (menggeser) mengelilingi pulau Bali.
* **Day/Night Cycle Toggle:** Tombol untuk mengubah suasana dari siang hari yang cerah menjadi malam hari dengan lampu-lampu kota, obor pura, dan langit berbintang.

### B. Destinasi & Landmark Interaktif (Hotspots / Pins)
Terdapat *pin* 3D melayang pada lokasi-lokasi ikonik yang dapat diklik. Saat diklik, kamera akan melakukan *zoom-in* secara sinematik ke area tersebut dan memunculkan panel informasi:
1. **Ubud (Tegalalang & Monkey Forest):** Visual sawah terasering hijau dan hutan tropis.
2. **Uluwatu:** Tebing curam di tepi laut dengan siluet Pura Luhur Uluwatu dan animasi ombak menabrak karang.
3. **Kintamani (Gunung & Danau Batur):** Visual gunung berapi dengan kaldera dan efek kabut pagi.
4. **Tanah Lot:** Pura di atas batu karang di tengah laut.
5. **Nusa Penida (Kelingking Beach):** Tebing ikonik berbentuk *T-Rex* dengan gradasi air laut biru jernih.
6. **Canggu / Seminyak:** Nuansa pantai santai, papan selancar, dan *beach club*.

### C. Panel Informasi Destinasi (2D UI Overlay)
Saat *landmark* dipilih, muncul *drawer* atau *card* kaca transparan (*Glassmorphism*) yang berisi:
* Sejarah singkat & daya tarik utama.
* Galeri foto/video asli destinasi tersebut.
* Rekomendasi aktivitas & kuliner lokal di sekitar area.
* Estimasi waktu tempuh dari Bandara Ngurah Rai.

### D. Mode Tur Terpandu (Guided Storytelling Tour)
* Fitur "Mulai Tur" yang menggerakkan kamera secara otomatis dari satu destinasi ke destinasi lain layaknya presentasi interaktif, dilengkapi narasi teks dan perubahan musik latar sesuai suasana daerah (misal: suara ombak di Uluwatu, suara gamelan rindik di Ubud).

### E. Pengalaman Audio Spasial (Ambient Soundscape)
* Musik latar instrumen tradisional Bali (Gamelan Rindik / Suling) yang lembut.
* Efek suara berbasis posisi kamera: semakin dekat kamera ke laut, semakin jelas suara ombak; semakin dekat ke pegunungan, semakin terdengar suara angin dan burung.
* Tombol *Mute/Unmute* yang mudah diakses.

---

## 5. Struktur Halaman & Alur Pengguna (User Flow)

1. **Loading Screen:**
   * Menampilkan animasi persentase *loading* aset 3D dengan ilustrasi siluet Barong atau Gapura Candi Bentar.
   * Instruksi singkat cara navigasi (*"Drag untuk memutar, Scroll untuk zoom, Klik pin untuk menjelajah"*).
2. **Landing / Main Canvas:**
   * Tampilan penuh (*fullscreen*) pulau Bali 3D dari sudut pandang udara (*bird's-eye view*).
   * Judul minimalis di sudut kiri atas dan menu navigasi cepat di bagian bawah (*Dock Menu* berisi daftar destinasi).
3. **Exploration Mode (Bebas):**
   * Pengguna bebas menggeser peta dan mengeklik *pin* destinasi.
4. **Detail View Mode:**
   * Kamera fokus pada satu *landmark* spesifik (misal: diorama Pura Tanah Lot yang lebih detail).
   * UI panel terbuka di sisi kanan layar.
   * Tombol "Kembali ke Peta Utama" untuk melakukan *zoom-out*.

---

## 6. Kebutuhan Aset 3D & Shader (Asset Requirements)

| Kategori | Detail Aset | Spesifikasi Teknis |
| :--- | :--- | :--- |
| **Terrain** | Peta kontur Pulau Bali & Nusa Penida | Heightmap berbasis data DEM (Digital Elevation Model) yang disederhanakan. |
| **Arsitektur** | Candi Bentar, Meru (Pura bertingkat), Bale Bengong | *Low-poly* dengan *baked texture* (AO & Diffuse) agar ringan. |
| **Vegetasi** | Pohon Kelapa, Pohon Kamboja, Padi Terasering | Menggunakan `THREE.InstancedMesh` untuk performa rendering optimal. |
| **Water Shader** | Lautan di sekitar Bali | *Custom GLSL Shader* dengan efek buih ombak di tepi pantai dan refleksi cahaya. |
| **Karakter/Objek** | Perahu Jukung, Peselancar, Burung Jalak Bali | Animasi *looping* sederhana (perahu terombang-ambing, burung terbang melingkar). |

---

## 7. Optimasi Performa (Performance & Technical Constraints)
Karena aplikasi 3D berbasis web rentan berat pada perangkat spesifikasi rendah, berikut adalah standar wajib yang harus diterapkan:
* **Target FPS:** Minimal 60 FPS di desktop dan 30-60 FPS di perangkat *mobile*.
* **Ukuran Total Aset:** Maksimal 15 MB untuk keseluruhan model 3D dan tekstur saat pemuatan awal.
* **Kompresi Model:** Wajib menggunakan **Draco Compression** untuk file `.glb` dan **KTX2 / Basis Universal** untuk tekstur.
* **Draw Calls:** Menjaga *draw calls* di bawah 100 dengan menggabungkan geometri statis dan menggunakan *Instancing* untuk pepohonan.
* **Adaptive Pixel Ratio:** Membatasi `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` agar tidak membebani GPU pada layar Retina/4K.
* **Fallback 2D:** Jika perangkat pengguna tidak mendukung WebGL atau mengalami *lag* parah, sediakan opsi untuk beralih ke mode tampilan galeri peta 2D statis.

---

## 8. Rencana Pengembangan (Development Milestones)

* **Fase 1: Prototyping & Terrain (Minggu 1-2)**
  * Setup proyek Vite + React + Three.js.
  * Membuat *mesh* daratan Pulau Bali dan *shader* laut dasar.
  * Implementasi kontrol kamera (*OrbitControls*) dan batas area (*camera bounds*).
* **Fase 2: 3D Modeling & Environment (Minggu 3-4)**
  * Pembuatan aset 3D *landmark* utama di Blender (Pura, Gunung, Tebing, Pepohonan).
  * Penempatan objek (*scene composition*) dan pengaturan pencahayaan (*lighting & shadows*).
* **Fase 3: Interaktivitas & UI Integration (Minggu 5-6)**
  * Implementasi *Raycasting* untuk klik pada *pin* destinasi.
  * Integrasi animasi kamera GSAP saat berpindah lokasi.
  * Pembuatan UI Overlay (Panel informasi, menu navigasi, tombol Day/Night).
* **Fase 4: Audio, Polish & Optimization (Minggu 7-8)**
  * Penambahan efek suara gamelan dan *ambience* alam.
  * Kompresi aset, *profiling* performa (memori & FPS), serta penyesuaian responsivitas untuk tampilan *mobile*.
  * *Deployment* ke Vercel atau Netlify.
