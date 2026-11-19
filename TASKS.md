# Project Tasks & Roadmap: Bali 3D Interactive Website

Gunakan dokumen ini untuk melacak progres pengembangan dari tahap inisialisasi hingga rilis produksi.

> **Status Fase 1 (19 Nov 2026):** Selesai. Terrain memakai aset `public/bali.glb` (mesh DEM ekspor Three.js, ~968k vertex / 322k triangle, Z-up). Aset dinormalisasi ke Y-up, diskalakan 0.1, diputar 33,8° agar *north-up*, dan diwarnai per-vertex berdasarkan elevasi/kemiringan. Peta *shoreline* 256×256 dibuat dari footprint mesh untuk gradasi kedalaman dan busa laut.
>
> **Catatan aset:** `bali.glb` ~23 MB (belum Draco) dan hanya mencakup Bali mainland + Semenanjung Bukit. **Nusa Penida belum ada di dalam mesh** sehingga perlu ditambahkan pada Fase 2.

## Fase 1: Setup Proyek & Fondasi 3D (Minggu 1-2)
- [x] **Inisialisasi Repositori & Tech Stack**
  - [x] Setup proyek menggunakan Vite + React + TypeScript.
  - [x] Instalasi dependensi utama: `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `tailwindcss`, `framer-motion`, `lucide-react`, `zustand`, serta font Fontsource.
  - [x] Konfigurasi struktur folder (`src/components/canvas`, `src/components/ui`, `src/data`, `src/shaders`, `src/hooks`).
- [x] **Setup Kanvas 3D & Kamera**
  - [x] Membuat komponen `<Canvas>` utama dengan konfigurasi *toneMapping* (`ACESFilmicToneMapping`) dan *shadows*.
  - [x] Implementasi `OrbitControls` dengan pembatasan sudut (*minPolarAngle*, *maxPolarAngle*) dan batas *zoom* (*minDistance*, *maxDistance*) agar kamera tidak menembus tanah/laut.
  - [x] Membuat sistem *Camera Rig* berbasis GSAP untuk perpindahan posisi (`position`) dan target (`lookAt`) kamera yang mulus.
- [x] **Pembuatan Terrain Dasar & Laut**
  - [x] Mengolah `bali.glb` menjadi *mesh* terrain: konversi Z-up → Y-up, skala, koreksi rotasi *north-up*, pemusatan di origin, dan pewarnaan vertex (pantai, hutan, batuan vulkanik).
  - [x] Membuat *custom GLSL shader* laut dengan animasi riak gelombang, gradasi kedalaman berbasis peta *shoreline*, busa pantai, fresnel, dan kabut.
  - [x] Menambahkan *loading screen* awal, HUD branding minimal, dan petunjuk kontrol (desktop & sentuh).

## Fase 2: Aset 3D & Atmosfer Lingkungan (Minggu 3-4)
- [ ] **Pembuatan & Optimasi Model 3D (Blender)**
  - [ ] Menambahkan *mesh* Nusa Penida (belum termasuk dalam `bali.glb`) beserta tebing Kelingking.
  - [ ] Modeling *landmark* ikonik versi *stylized*: Pura Tanah Lot, Pura Uluwatu, Gunung & Danau Batur, Terasering Ubud, Tebing Kelingking Nusa Penida, dan Pantai Canggu.
  - [ ] Modeling aset pelengkap: Pohon kelapa, pohon kamboja, perahu jukung, awan *low-poly*, dan Candi Bentar.
  - [ ] Melakukan *texture baking* (Ambient Occlusion & Diffuse) dan ekspor ke format `.glb` dengan kompresi **Draco**.
- [ ] **Komposisi Scene & Pencahayaan**
  - [ ] Menempatkan seluruh model *landmark* pada koordinat yang akurat di atas *mesh* Pulau Bali.
  - [ ] Implementasi `InstancedMesh` untuk menyebarkan ratusan pohon kelapa dan vegetasi tanpa menurunkan FPS.
  - [ ] Membuat sistem pencahayaan ganda untuk siklus **Siang (Day)** dan **Malam (Night)** termasuk *skybox/environment map* dan lampu titik (*point lights*) pada obor pura & area perkotaan.
  - [ ] Menambahkan efek partikel (kelopak bunga kamboja melayang & kabut tipis di Kintamani).

## Fase 3: Interaktivitas & Antarmuka Pengguna / UI (Minggu 5-6)
- [ ] **Sistem Data & State Management**
  - [ ] Membuat file `destinations.ts` berisi metadata lengkap 6 destinasi (koordinat 3D, offset kamera, sejarah, foto, kuliner, jarak dari bandara).
  - [ ] Setup *state management* (Zustand) untuk melacak: `activeDestination`, `isTourActive`, `timeOfDay` ('day' | 'night'), dan `isMuted`.
- [ ] **Komponen 3D Interaktif**
  - [ ] Membuat komponen `<DestinationPin />` menggunakan `<Html>` dari `@react-three/drei` untuk label melayang.
  - [ ] Menambahkan efek *hover* dan klik pada *pin* untuk memicu animasi kamera *zoom-in*.
- [ ] **Implementasi UI 2D Overlay (Sesuai `UI-SPEC.md`)**
  - [ ] Membuat `<LoadingScreen />` terhubung dengan `useProgress` dari Drei.
  - [ ] Membuat `<HeaderHUD />` (Logo, Toggle Siang/Malam, Toggle Audio, Tombol Bantuan).
  - [ ] Membuat `<DockMenu />` di bagian bawah layar untuk navigasi cepat antar destinasi.
  - [ ] Membuat `<DestinationDrawer />` dengan desain *Glassmorphism*, galeri foto, dan tab informasi.
  - [ ] Membuat fitur **Guided Tour** otomatis dengan narasi teks berjalan dan kontrol pemutaran.

## Fase 4: Audio Spasial, Optimasi & Deployment (Minggu 7-8)
- [ ] **Integrasi Audio (Howler.js / Web Audio API)**
  - [ ] Menambahkan musik latar instrumen Rindik Bali yang lembut (*looping*).
  - [ ] Menambahkan efek suara klik UI halus dan *ambience* lingkungan (suara ombak saat fokus ke pantai, suara angin/burung saat fokus ke pegunungan).
- [ ] **Optimasi Performa & Responsivitas**
  - [ ] Audit ukuran aset total (memastikan `< 15 MB`) dan kompresi tekstur ke format `.webp` / `.ktx2`.
  - [ ] Kompresi ulang `bali.glb` (saat ini ~23 MB, belum Draco) + *mesh decimation* agar masuk target ukuran.
  - [ ] Mengimplementasikan *camera target offset* agar objek 3D tidak tertutup panel UI di layar desktop maupun mobile.
  - [ ] Menguji performa di perangkat *mobile* (iOS Safari & Android Chrome) serta menambahkan pengaturan kualitas grafis otomatis jika FPS rendah.
  - [ ] Membuat tampilan *fallback* 2D statis jika browser pengguna tidak mendukung WebGL.
- [ ] **Testing & Deployment**
  - [ ] Pengujian lintas browser (*cross-browser testing*) dan perbaikan *bug* navigasi kamera.
  - [ ] Konfigurasi SEO metadata, *Open Graph image*, dan favicon.
  - [ ] *Deploy* aplikasi ke Vercel / Netlify dan verifikasi kecepatan muat (*Lighthouse Audit*).
