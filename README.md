# Bali 3D — Interactive Island Explorer

Pengalaman eksplorasi Pulau Bali dalam diorama 3D berbasis WebGL. Fase 1 mencakup fondasi proyek, kanvas 3D, terrain dari `bali.glb`, dan laut dengan shader kustom.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build produksi
npm run preview
```

## Stack

- Vite + React 19 + TypeScript
- Three.js, `@react-three/fiber`, `@react-three/drei`
- GSAP (kamera), Zustand (state)
- Tailwind CSS v4, Framer Motion, Lucide
- Font: Cinzel + Plus Jakarta Sans (via Fontsource)

## Struktur

```
public/bali.glb                  Mesh terrain (DEM ekspor, Z-up)
src/components/canvas/           Canvas, terrain, laut, lighting, camera rig
src/components/ui/               Loading screen, HUD, petunjuk kontrol
src/data/island.ts               Konstanta aset, kamera, dan lingkungan
src/lib/terrain.ts               Normalisasi mesh, pewarnaan, peta shoreline
src/shaders/ocean.ts             Vertex & fragment shader laut
src/store/useSceneStore.ts       State kamera (siap untuk Fase 3)
```

## Catatan Aset

- `bali.glb` adalah mesh DEM tunggal (~968k vertex / 322k triangle, ~23 MB, tanpa tekstur).
- Aset aslinya Z-up dan miring ~33,8° dari utara; saat dimuat mesh dikonversi ke Y-up, diskalakan `0.1`, diputar agar *north-up*, lalu dipusatkan di origin.
- Warna terrain dibuat per-vertex dari elevasi, kemiringan, dan noise—tanpa tekstur eksternal.
- Peta *shoreline* 256×256 dihasilkan saat runtime dari footprint mesh untuk gradasi kedalaman dan busa.
- **Nusa Penida belum ada di mesh**; perlu ditambahkan pada Fase 2.
- Ukuran 23 MB masih di atas target 15 MB; kompresi Draco/decimation dijadwalkan pada Fase 4.

## Kontrol

- Drag: putar peta
- Scroll / pinch: zoom
- Klik kanan / dua jari: geser
- Kamera awal menyesuaikan orientasi layar (desktop vs portrait)

## Status

Fase 1 selesai. Fase 2 (modeling landmark, InstancedMesh vegetasi, siklus siang/malam, partikel) berikutnya.
