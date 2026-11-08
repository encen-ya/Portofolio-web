# Kreszen Portfolio (React + Vite)

Versi React dari portfolio `porto.html`, sudah dikembangkan dengan hero nama
dua baris, section About gelap dengan animasi orbit bola biru, footer
"HUBUNGI", dan hamparan gunung dither di bawah halaman. Background halftone
nebula dan animasi scroll tetap dipertahankan.

## Menjalankan

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite (biasanya `http://localhost:5173`).

Build produksi:

```bash
npm run build
npm run preview
```

## Struktur

```text
portfolio-react/
├─ public/
│  ├─ favicon.svg
│  └─ images/
│     └─ kreszen.png
├─ src/
│  ├─ components/        # komponen per section
│  │  ├─ Navigation.jsx
│  │  ├─ Hero.jsx
│  │  ├─ HeroSky.jsx     # canvas background nebula
│  │  ├─ About.jsx
│  │  ├─ AboutOrbit.jsx   # canvas orbit bola biru di section About
│  │  ├─ Work.jsx
│  │  ├─ Stack.jsx
│  │  ├─ Skills.jsx
│  │  ├─ Journal.jsx
│  │  ├─ Footer.jsx
│  │  ├─ FooterRidges.jsx # canvas gunung dither di bawah footer
│  │  └─ Icons.jsx
│  ├─ data/              # semua teks dan gambar per section
│  │  ├─ navigation.json
│  │  ├─ hero.json
│  │  ├─ about.json
│  │  ├─ projects.json
│  │  ├─ stack.json
│  │  ├─ skills.json
│  │  ├─ journal.json
│  │  └─ footer.json
│  ├─ hooks/
│  │  ├─ useHeroNameMotion.js  # efek hover magnetik pada nama hero
│  │  └─ useSiteMotion.js
│  ├─ lib/
│  │  ├─ hero-sky.js     # WebGL halftone nebula
│  │  ├─ ridge.js        # generator gunung dither footer
│  │  └─ motion.js       # scroll motion, reveal, split text
│  ├─ styles/
│  │  ├─ index.css       # entrypoint import semua CSS
│  │  └─ parts/          # CSS per section/scene
│  ├─ App.jsx
│  └─ main.jsx
├─ index.html
├─ package.json
└─ vite.config.js
```

## Mengedit konten

Semua konten utama ada di `src/data/*.json`. Contoh:

- Ganti nama, hook, atau foto hero: `src/data/hero.json`
- Ubah judul dan paragraf About: `src/data/about.json`
- Tambah project: `src/data/projects.json` pada array `items`
- Tambah stack: `src/data/stack.json`
- Tambah tulisan blog: `src/data/journal.json`
- Ubah kata besar, link, dan newsletter footer: `src/data/footer.json`

Foto profil ada di `public/images/kreszen.png` dan dipakai di hero.
Untuk mengganti warna gunung dither di bawah footer, ubah array `TONES` di
`src/components/FooterRidges.jsx`.

Animasi About dibuat tanpa dependency di `src/components/AboutOrbit.jsx`
(Canvas 2D). Orbit bisa di-drag untuk diputar dan diklik untuk membentuk
ulang ring. Warna bola diatur lewat array `TONES` dan `DOT_TONES`; ukuran
orbit mengikuti lebar `.about__visual` di `section-about.css`.

## Catatan

- Versi lama tetap ada di `C:\Portofolio\design-studio-website-template`.
- Motion scroll memakai CSS scroll-driven animation. Browser yang tidak
  mendukungnya tetap menampilkan halaman secara statis.
- Smooth wheel scrolling hanya aktif untuk pointer presisi (mouse/trackpad) dan
  otomatis berhenti saat menu mobile terbuka.
- Gunung dither footer muncul sekali saat masuk viewport, lalu kabut bergerak
  pelan. Kursor menggeser kabut dan memberi parallax. Semua gerak berhenti saat
  `prefers-reduced-motion` aktif.
- Orbit About hanya berputar otomatis saat `prefers-reduced-motion` tidak aktif
  dan canvas sedang terlihat. Dengan reduced motion, orbit tampil statis; drag
  tetap memperbarui frame tanpa animasi berkelanjutan.