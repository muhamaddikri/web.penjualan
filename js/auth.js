/**
 * auth.js
 * -----------------------------------------------------------------------
 * Autentikasi SEDERHANA berbasis localStorage — cocok untuk demo/prototipe.
 *
 * >>> UNTUK PRODUKSI <<<
 * Ganti checkCredentials() agar memanggil endpoint login backend Anda
 * (mis. POST /api/login) dan simpan token (JWT dsb) alih-alih flag boolean.
 * Jangan menyimpan password di kode sisi klien seperti contoh ini.
 * -----------------------------------------------------------------------
 */

const DEMO_USER = { username: 'admin', password: 'admin123' };
const SESSION_KEY = 'sd_is_logged_in';
const SESSION_NAME_KEY = 'sd_user_name';

function checkCredentials(username, password) {
  return username.trim() === DEMO_USER.username && password === DEMO_USER.password;
}

function loginUser(username) {
  localStorage.setItem(SESSION_KEY, 'true');
  localStorage.setItem(SESSION_NAME_KEY, username);
}

function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_NAME_KEY);
  window.location.href = 'index.html';
}

function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === 'true';
}

function getUserName() {
  return localStorage.getItem(SESSION_NAME_KEY) || 'Admin';
}

// --- Guard: lindungi dashboard.html dari akses tanpa login ---
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

// --- Handler form login (dipakai di index.html) ---
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  // Jika sudah login, langsung lempar ke dashboard
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');

    if (checkCredentials(username, password)) {
      loginUser(username);
      window.location.href = 'dashboard.html';
    } else {
      errorEl.textContent = 'Username atau password salah. Coba admin / admin123.';
      errorEl.classList.remove('hidden');
    }
  });
}
