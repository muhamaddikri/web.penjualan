# SalesBoard — Dashboard Laporan Penjualan

Dashboard penjualan responsif berbasis **HTML/CSS/JS murni (vanilla)** — tanpa build tool,
tanpa `npm install`. Tinggal buka di browser atau upload ke hosting statis mana pun.

## 📁 Struktur Proyek

```
sales-dashboard/
├── index.html          # Halaman login
├── dashboard.html       # Halaman utama dashboard (SPA sederhana, 4 "view")
├── css/
│   └── style.css        # Semua styling + tema light/dark + responsive
└── js/
    ├── data.js           # Sumber data (dummy) — GANTI DI SINI untuk data asli
    ├── auth.js            # Login sederhana (localStorage)
    ├── theme.js            # Toggle tema terang/gelap
    ├── charts.js            # Line chart & pie chart (Chart.js)
    ├── table.js               # Tabel transaksi: search, filter, sort, pagination
    ├── export.js                # Ekspor PDF (jsPDF) & Excel (SheetJS)
    └── app.js                     # Inisialisasi & navigasi antar-menu
```

## ▶️ Cara Menjalankan

**Opsi 1 — Buka langsung**
Klik dua kali `index.html`, atau buka lewat browser (`File > Open`).

**Opsi 2 — Live server (disarankan)**
Beberapa fitur (terutama saat nanti disambungkan ke `fetch()` API) butuh server lokal:
```bash
# Python
python3 -m http.server 5500

# atau Node (npx serve)
npx serve .
```
Lalu buka `http://localhost:5500`.

**Login demo:** username `admin`, password `admin123` (lihat `js/auth.js`).

Tidak perlu instalasi apa pun — Chart.js, SheetJS (Excel), dan jsPDF dimuat langsung
dari CDN (cdnjs.cloudflare.com) di `dashboard.html`.

## 🔌 Mengganti Data Dummy dengan Data Asli

Buka `js/data.js` dan ubah fungsi `getTransactions()` agar mengambil data dari API/backend:

```js
async function getTransactions() {
  const res = await fetch('https://api.tokoanda.com/transaksi');
  return await res.json();
}
```

Setiap transaksi **harus** punya bentuk (shape) seperti ini agar kartu ringkasan, grafik,
tabel, dan ekspor tetap berfungsi tanpa perubahan lain:

```js
{
  id: 'TRX-1000',
  date: '2026-08-01',       // format YYYY-MM-DD
  customer: 'Andi Saputra',
  product: 'Kemeja Flanel Pria',
  category: 'Fashion Pria',
  qty: 2,
  total: 350000,             // dalam Rupiah, angka murni (bukan string)
  status: 'Lunas',           // 'Lunas' atau 'Pending'
}
```

## 🔐 Autentikasi

Login saat ini memakai flag sederhana di `localStorage` (`js/auth.js`) — cocok untuk
demo/prototipe, **bukan untuk produksi**. Untuk produksi:

1. Ganti `checkCredentials()` agar memanggil endpoint backend (`POST /api/login`).
2. Simpan token sesi (JWT dsb) alih-alih flag boolean.
3. Jangan simpan password apa pun di kode sisi klien.
4. Tambahkan validasi token/expiry di `requireAuth()`.

## 📤 Ekspor Data

- **Excel** — menggunakan library [SheetJS](https://sheetjs.com/) (`xlsx`), mengekspor
  data yang **sedang tampil sesuai filter/pencarian aktif** di tabel Transaksi.
- **PDF** — menggunakan [jsPDF](https://github.com/parallax/jsPDF) + `jspdf-autotable`,
  juga mengikuti hasil filter yang aktif.

Kedua tombol ada di menu **Transaksi**. Logikanya ada di `js/export.js`.

## 🎨 Tema (Dark/Light Mode)

Toggle tema tersedia di:
- Ikon 🌙/☀️ pada topbar (semua halaman dashboard), dan
- Menu **Pengaturan** (pilihan Terang/Gelap eksplisit).

Semua warna didefinisikan sebagai CSS custom properties di `css/style.css`
(lihat `:root` dan `[data-theme='dark']`), sehingga mudah dikustomisasi —
tinggal ubah nilai hex di satu tempat.

## 📱 Responsif

- **Desktop**: sidebar tetap terlihat di kiri.
- **Mobile/tablet (< 900px)**: sidebar disembunyikan, diganti tombol hamburger (☰)
  di topbar yang membuka sidebar sebagai overlay.
- Tabel transaksi otomatis bisa di-scroll horizontal di layar sempit.

## 🧩 Menyesuaikan Lebih Lanjut

| Ingin mengubah...            | Edit di...                          |
|-------------------------------|--------------------------------------|
| Warna/aksen tema               | `css/style.css` → variabel `:root`   |
| Menu navigasi sidebar           | `dashboard.html` → bagian `<nav>`    |
| Jumlah baris per halaman tabel   | `js/table.js` → `tableState.pageSize` |
| Kolom tabel transaksi             | `dashboard.html` (`<thead>`) + `js/table.js` (`renderTable`) |
| Kredensial login demo               | `js/auth.js` → `DEMO_USER`           |

## 🧱 Mengintegrasikan ke Proyek React/Framework Lain

Struktur ini murni HTML/CSS/JS agar mudah dijalankan tanpa build tool. Jika proyek Anda
memakai React/Vue/dsb:
- Logika di `js/table.js`, `js/charts.js`, `js/export.js` bisa langsung diadaptasi
  menjadi komponen/hook (misalnya `useMemo` untuk filter, `useEffect` untuk render chart).
- Struktur data di `js/data.js` bisa langsung dipakai sebagai bentuk state/props.
- CSS variables di `style.css` bisa dipetakan ke Tailwind config (`theme.extend.colors`)
  bila ingin migrasi ke Tailwind CSS.
