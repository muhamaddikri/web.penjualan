/**
 * data.js
 * -----------------------------------------------------------------------
 * Sumber data dashboard. Saat ini memakai DATA DUMMY yang di-generate
 * secara acak (tapi konsisten / seeded) supaya angka tidak berubah-ubah
 * setiap reload.
 *
 * >>> CARA MENGGANTI DENGAN DATA ASLI <<<
 * Ganti isi fungsi getTransactions() di bawah agar mengambil data dari
 * API / backend Anda, misalnya:
 *
 *   async function getTransactions() {
 *     const res = await fetch('https://api.tokoanda.com/transaksi');
 *     return await res.json();
 *   }
 *
 * Pastikan setiap objek transaksi memiliki struktur (shape) yang sama
 * seperti pada TRANSACTIONS di bawah ini, agar seluruh dashboard
 * (kartu ringkasan, grafik, tabel, ekspor) tetap berfungsi tanpa
 * perubahan lain.
 * -----------------------------------------------------------------------
 */

// Seeded PRNG sederhana (Mulberry32) agar data dummy konsisten
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260807);

const CUSTOMERS = [
  'Andi Saputra', 'Budi Santoso', 'Citra Dewi', 'Dian Permata', 'Eka Wijaya',
  'Fajar Nugroho', 'Gita Lestari', 'Hendra Kusuma', 'Indah Sari', 'Joko Prasetyo',
  'Kartika Putri', 'Lukman Hakim', 'Maya Anggraini', 'Nanda Pratama', 'Oki Firmansyah',
  'Putri Ayu', 'Rizky Ramadhan', 'Siti Aminah', 'Tono Wibowo', 'Umi Kalsum'
];

const PRODUCTS = [
  { name: 'Kemeja Flanel Pria', category: 'Fashion Pria', price: 175000 },
  { name: 'Dress Wanita Casual', category: 'Fashion Wanita', price: 220000 },
  { name: 'Sepatu Sneakers', category: 'Sepatu', price: 350000 },
  { name: 'Tas Ransel Kanvas', category: 'Aksesoris', price: 265000 },
  { name: 'Jam Tangan Digital', category: 'Aksesoris', price: 410000 },
  { name: 'Headset Bluetooth', category: 'Elektronik', price: 285000 },
  { name: 'Powerbank 10000mAh', category: 'Elektronik', price: 195000 },
  { name: 'Kaos Polos Premium', category: 'Fashion Pria', price: 95000 },
  { name: 'Rok Plisket', category: 'Fashion Wanita', price: 150000 },
  { name: 'Sandal Slip-On', category: 'Sepatu', price: 120000 },
];

const STATUSES = ['Lunas', 'Lunas', 'Lunas', 'Pending'];

function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }

function generateTransactions(count = 65) {
  const now = new Date('2026-08-07');
  const startWindow = new Date('2026-02-01');
  const list = [];

  for (let i = 0; i < count; i++) {
    const product = pick(PRODUCTS);
    const qty = 1 + Math.floor(rand() * 5);
    const date = new Date(
      startWindow.getTime() + rand() * (now.getTime() - startWindow.getTime())
    );

    list.push({
      id: `TRX-${String(1000 + i)}`,
      date: date.toISOString().slice(0, 10),
      customer: pick(CUSTOMERS),
      product: product.name,
      category: product.category,
      qty,
      total: product.price * qty,
      status: pick(STATUSES),
    });
  }

  // Urutkan dari tanggal terbaru ke terlama
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const TRANSACTIONS = generateTransactions(65);

/**
 * Titik akses utama data. Ganti fungsi ini jika ingin menyambungkan
 * ke API/backend sungguhan (lihat komentar di atas).
 */
async function getTransactions() {
  return TRANSACTIONS;
}
