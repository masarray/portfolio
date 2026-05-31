## Tujuan

Mengganti halaman utama project (saat ini placeholder TanStack Start) dengan portfolio **ari-angelsix-style-portfolio-v6** yang Anda upload — lengkap dengan live wallpaper, cursor effects, menu bar macOS, jendela aplikasi, dan dock dengan animasi magnify (gaya angelsix.com).

Catatan: saya tidak akan menyalin asset/branding milik angelsix.com. Inspirasinya diambil dari pola UI (desktop macOS, dock magnify, animated wallpaper) yang sudah ada di file v6 Anda. Isi konten = data Anda sendiri di `src/data.js`.

## Yang akan dilakukan

1. **Port komponen v6 → TanStack Start**
   - Salin `LiveWallpaper.jsx`, `CursorEffects.jsx`, `MenuBar.jsx`, `Dock.jsx`, `MacWindow.jsx`, `AppContent.jsx`, dan `data.js` ke `src/components/desktop/` dan `src/data/portfolio.ts`.
   - Konversi `.jsx` → `.tsx` (typing ringan, props apa adanya, no refactor besar).

2. **Integrasi styling**
   - Pindahkan isi `styles.css` v6 ke `src/styles.css` dalam satu blok `@layer components` agar tidak bentrok dengan Tailwind v4 dan token desain yang sudah ada.
   - Pertahankan token tema project (oklch) — animasi/wallpaper pakai CSS sendiri (gradient + keyframes).

3. **Route baru**
   - Ganti `src/routes/index.tsx` agar me-render `<DesktopShell />` (LiveWallpaper + MenuBar + windows + CursorEffects + Dock) full-screen.
   - Set head meta: title "Ari Sulistiono — Portfolio", description sesuai `data.js`.
   - Disable body scroll & set viewport 100dvh untuk feel desktop.

4. **SSR & browser-only guards**
   - LiveWallpaper & CursorEffects pakai `window`, `requestAnimationFrame`, `matchMedia`. Bungkus dengan `useEffect` + early-return saat `typeof window === 'undefined'` agar aman di SSR TanStack Start.
   - Hormati `prefers-reduced-motion` (sudah ada di v6).

5. **Dock & window behavior**
   - Magnify hover dock (scale berdasarkan jarak cursor) — sudah ada di v6, dipertahankan.
   - Jendela bisa di-drag, focus, close, minimize (dari `MacWindow.jsx`).
   - State daftar window aktif dikelola di `DesktopShell` (port dari `App.jsx`).

6. **Cleanup**
   - Hapus placeholder `data-lovable-blank-page-placeholder` di `index.tsx`.
   - Tidak menambah dependency baru (v6 hanya butuh React, sudah tersedia).

## Yang TIDAK dilakukan

- Tidak meng-copy aset visual, font kustom, atau teks marketing dari angelsix.com.
- Tidak menambah backend / Lovable Cloud (portfolio statis).
- Tidak mengubah routing lain atau styling global di luar yang dibutuhkan halaman desktop.

## Struktur file akhir (ringkas)

```text
src/
  routes/index.tsx              → render <DesktopShell />
  components/desktop/
    DesktopShell.tsx            (dari App.jsx)
    LiveWallpaper.tsx
    CursorEffects.tsx
    MenuBar.tsx
    Dock.tsx
    MacWindow.tsx
    AppContent.tsx
  data/portfolio.ts             (dari data.js)
  styles.css                    (+ blok desktop styles)
```

## Konfirmasi sebelum eksekusi

- OK untuk **menimpa** `src/routes/index.tsx` placeholder dengan halaman desktop ini?
- Konten/data tetap pakai isi `data.js` dari zip Anda (nama: Ari Sulistiono, dst.)?